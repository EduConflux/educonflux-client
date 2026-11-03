import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../../auth/context/AuthContext';
import type {
  ClassroomMeetingResponse,
  WebRTCSignalMessage,
  PeerConnectionState,
  ParticipantRole,
} from '../types';

interface UseWebRTCMeetingProps {
  meeting: ClassroomMeetingResponse;
  classroomId: number;
  iceServers?: RTCIceServer[];
  onMeetingEnded?: () => void;
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
];

export function useWebRTCMeeting({
  meeting,
  classroomId,
  iceServers = DEFAULT_ICE_SERVERS,
  onMeetingEnded,
}: UseWebRTCMeetingProps) {
  const { user } = useAuth();
  const currentUserId = user?.id || 0;
  const currentUserName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : user?.email?.split('@')[0] || 'User';

  const isHost = meeting.hostUserId === currentUserId;

  // Media states
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Peers dictionary
  const [peers, setPeers] = useState<Map<number, PeerConnectionState>>(new Map());

  // Connection and status
  const [isConnected, setIsConnected] = useState(false);
  const [inCallMessages, setInCallMessages] = useState<
    Array<{ senderId: number; senderName: string; text: string; time: string }>
  >([]);

  // Refs for stable access in event callbacks
  const stompClientRef = useRef<Client | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenTrackRef = useRef<MediaStreamTrack | null>(null);
  const peersRef = useRef<Map<number, PeerConnectionState>>(new Map());
  const pendingIceCandidatesRef = useRef<Map<number, RTCIceCandidateInit[]>>(new Map());

  // Keep refs in sync
  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  // Send a STOMP message helper
  const sendStompMessage = useCallback(
    (destination: string, payload: any) => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination,
          body: JSON.stringify(payload),
        });
      }
    },
    []
  );

  // Initialize or get RTCPeerConnection for a peer
  const getOrCreatePeerConnection = useCallback(
    (peerId: number, peerName: string, role: ParticipantRole = 'PARTICIPANT'): RTCPeerConnection => {
      const existing = peersRef.current.get(peerId);
      if (existing) {
        return existing.pc;
      }

      const pc = new RTCPeerConnection({ iceServers });
      const remoteStream = new MediaStream();

      // Add local tracks to new peer connection
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          pc.addTrack(track, localStreamRef.current!);
        });
      }

      // Handle ICE Candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          sendStompMessage(`/app/classroom/${classroomId}/meeting/ice/${peerId}`, {
            type: 'ICE_CANDIDATE',
            senderId: currentUserId,
            targetUserId: peerId,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      // Handle remote tracks
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
        setPeers((prev) => {
          const updated = new Map(prev);
          const state = updated.get(peerId);
          if (state) {
            updated.set(peerId, { ...state, stream: remoteStream });
          }
          return updated;
        });
      };

      // Peer connection state tracking
      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          // Cleanup on disconnect
          pc.close();
          setPeers((prev) => {
            const updated = new Map(prev);
            updated.delete(peerId);
            return updated;
          });
        }
      };

      const newState: PeerConnectionState = {
        userId: peerId,
        userName: peerName,
        userRole: role,
        pc,
        stream: remoteStream,
        isAudioMuted: false,
        isVideoOff: false,
        isScreenSharing: false,
        isHandRaised: false,
      };

      peersRef.current.set(peerId, newState);
      setPeers(new Map(peersRef.current));

      return pc;
    },
    [classroomId, currentUserId, iceServers, sendStompMessage]
  );

  // Initialize Local Media (Camera + Mic)
  useEffect(() => {
    let mounted = true;

    async function initMedia() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24 } },
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);
      } catch (err) {
        console.warn('Could not acquire camera/mic, falling back to audio only or blank stream', err);
        try {
          const audioOnly = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
          if (mounted) {
            localStreamRef.current = audioOnly;
            setLocalStream(audioOnly);
            setIsVideoOff(true);
          }
        } catch {
          console.warn('No media devices available');
        }
      }
    }

    initMedia();

    return () => {
      mounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
      }
    };
  }, []);

  // Connect STOMP WebSocket and wire signal listeners
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const stompClient = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: () => {},
      reconnectDelay: 4000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = () => {
      setIsConnected(true);

      // 1. Subscribe to Peer Join/Leave Broadcasts
      stompClient.subscribe(`/topic/classroom/${classroomId}/meeting/peers`, async (frame) => {
        const signal: WebRTCSignalMessage = JSON.parse(frame.body);
        const peerId = signal.senderId;

        if (!peerId || peerId === currentUserId) return;

        if (signal.type === 'PEER_JOINED') {
          // If current user has a lower ID, initiate the WebRTC Offer to avoid glares
          const pc = getOrCreatePeerConnection(
            peerId,
            signal.senderName || `User ${peerId}`,
            (signal.senderRole as ParticipantRole) || 'PARTICIPANT'
          );

          if (currentUserId < peerId) {
            try {
              const offer = await pc.createOffer();
              await pc.setLocalDescription(offer);
              sendStompMessage(`/app/classroom/${classroomId}/meeting/signal/${peerId}`, {
                type: 'OFFER',
                senderId: currentUserId,
                senderName: currentUserName,
                sdp: offer,
              });
            } catch (err) {
              console.error('Failed to create offer for peer', peerId, err);
            }
          }
        } else if (signal.type === 'PEER_LEFT') {
          const peer = peersRef.current.get(peerId);
          if (peer) {
            peer.pc.close();
            peersRef.current.delete(peerId);
            setPeers(new Map(peersRef.current));
          }
        } else if (signal.type === 'MEETING_ENDED') {
          onMeetingEnded?.();
        }
      });

      // 2. Subscribe to Private Signal Channel (SDP Offers & Answers)
      stompClient.subscribe(`/topic/classroom/${classroomId}/meeting/signal/${currentUserId}`, async (frame) => {
        const signal: WebRTCSignalMessage = JSON.parse(frame.body);
        const senderId = signal.senderId;
        if (!senderId) return;

        const pc = getOrCreatePeerConnection(senderId, signal.senderName || `User ${senderId}`);

        if (signal.type === 'OFFER' && signal.sdp) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

            // Flush any queued ICE candidates for this peer
            const queued = pendingIceCandidatesRef.current.get(senderId) || [];
            for (const cand of queued) {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
            }
            pendingIceCandidatesRef.current.delete(senderId);

            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);

            sendStompMessage(`/app/classroom/${classroomId}/meeting/signal/${senderId}`, {
              type: 'ANSWER',
              senderId: currentUserId,
              senderName: currentUserName,
              sdp: answer,
            });
          } catch (err) {
            console.error('Error handling SDP offer from', senderId, err);
          }
        } else if (signal.type === 'ANSWER' && signal.sdp) {
          try {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

            // Flush any queued ICE candidates
            const queued = pendingIceCandidatesRef.current.get(senderId) || [];
            for (const cand of queued) {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
            }
            pendingIceCandidatesRef.current.delete(senderId);
          } catch (err) {
            console.error('Error handling SDP answer from', senderId, err);
          }
        }
      });

      // 3. Subscribe to Private ICE Candidate Channel
      stompClient.subscribe(`/topic/classroom/${classroomId}/meeting/ice/${currentUserId}`, async (frame) => {
        const signal: WebRTCSignalMessage = JSON.parse(frame.body);
        const senderId = signal.senderId;
        if (!senderId || !signal.candidate) return;

        const peer = peersRef.current.get(senderId);
        if (peer && peer.pc.remoteDescription) {
          try {
            await peer.pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } catch (err) {
            console.warn('Failed to add ICE candidate', err);
          }
        } else {
          // Queue candidate until remote description is set
          const existing = pendingIceCandidatesRef.current.get(senderId) || [];
          existing.push(signal.candidate);
          pendingIceCandidatesRef.current.set(senderId, existing);
        }
      });

      // 4. Subscribe to Media State Broadcasts (mic, camera, hand raise)
      stompClient.subscribe(`/topic/classroom/${classroomId}/meeting/state`, (frame) => {
        const signal: WebRTCSignalMessage = JSON.parse(frame.body);
        const peerId = signal.senderId;
        if (!peerId) return;

        setPeers((prev) => {
          const updated = new Map(prev);
          const state = updated.get(peerId);
          if (state) {
            updated.set(peerId, {
              ...state,
              isAudioMuted: signal.isAudioMuted !== undefined ? signal.isAudioMuted : state.isAudioMuted,
              isVideoOff: signal.isVideoOff !== undefined ? signal.isVideoOff : state.isVideoOff,
              isScreenSharing: signal.isScreenSharing !== undefined ? signal.isScreenSharing : state.isScreenSharing,
              isHandRaised: signal.isHandRaised !== undefined ? signal.isHandRaised : state.isHandRaised,
            });
          }
          return updated;
        });
      });

      // 5. Subscribe to Host Control Broadcasts
      stompClient.subscribe(`/topic/classroom/${classroomId}/meeting/control`, (frame) => {
        const signal: WebRTCSignalMessage = JSON.parse(frame.body);

        if (signal.hostCommand === 'MUTE_AUDIO') {
          // If not host, enforce mute
          if (!isHost) {
            if (localStreamRef.current) {
              localStreamRef.current.getAudioTracks().forEach((t) => (t.enabled = false));
            }
            setIsAudioMuted(true);
          }
        } else if (signal.hostCommand === 'END_MEETING') {
          onMeetingEnded?.();
        } else if (signal.hostCommand === 'KICK' && signal.targetUserId === currentUserId) {
          onMeetingEnded?.();
        }
      });

      // Announce arrival to classroom meeting
      sendStompMessage(`/app/classroom/${classroomId}/meeting/join`, {});
    };

    stompClient.onDisconnect = () => {
      setIsConnected(false);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClientRef.current && stompClientRef.current.connected) {
        sendStompMessage(`/app/classroom/${classroomId}/meeting/leave`, {});
        stompClientRef.current.deactivate();
      }
      // Close all peer connections
      peersRef.current.forEach((peer) => peer.pc.close());
      peersRef.current.clear();
      setPeers(new Map());
    };
  }, [classroomId, currentUserId, currentUserName, getOrCreatePeerConnection, isHost, onMeetingEnded, sendStompMessage]);

  // Controls: Audio Mute / Unmute
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      const newMutedState = !isAudioMuted;
      audioTracks.forEach((track) => {
        track.enabled = !newMutedState;
      });
      setIsAudioMuted(newMutedState);

      sendStompMessage(`/app/classroom/${classroomId}/meeting/state`, {
        type: 'MEDIA_STATE_CHANGED',
        isAudioMuted: newMutedState,
        isVideoOff,
        isScreenSharing,
        isHandRaised,
      });
    }
  }, [classroomId, isAudioMuted, isHandRaised, isScreenSharing, isVideoOff, sendStompMessage]);

  // Controls: Video On / Off
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      const newVideoOffState = !isVideoOff;
      videoTracks.forEach((track) => {
        track.enabled = !newVideoOffState;
      });
      setIsVideoOff(newVideoOffState);

      sendStompMessage(`/app/classroom/${classroomId}/meeting/state`, {
        type: 'MEDIA_STATE_CHANGED',
        isAudioMuted,
        isVideoOff: newVideoOffState,
        isScreenSharing,
        isHandRaised,
      });
    }
  }, [classroomId, isAudioMuted, isHandRaised, isScreenSharing, isVideoOff, sendStompMessage]);

  // Controls: Screen Share
  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      // Stop screen share -> revert back to camera track
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }

      const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
      if (cameraTrack) {
        peersRef.current.forEach((peer) => {
          const sender = peer.pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(cameraTrack);
          }
        });
      }

      setIsScreenSharing(false);
      sendStompMessage(`/app/classroom/${classroomId}/meeting/state`, {
        type: 'MEDIA_STATE_CHANGED',
        isAudioMuted,
        isVideoOff,
        isScreenSharing: false,
        isHandRaised,
      });
    } else {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;

        screenTrack.onended = () => {
          toggleScreenShare();
        };

        // Replace outgoing video track on all peer connections
        peersRef.current.forEach((peer) => {
          const sender = peer.pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) {
            sender.replaceTrack(screenTrack);
          }
        });

        setIsScreenSharing(true);
        sendStompMessage(`/app/classroom/${classroomId}/meeting/state`, {
          type: 'MEDIA_STATE_CHANGED',
          isAudioMuted,
          isVideoOff,
          isScreenSharing: true,
          isHandRaised,
        });
      } catch (err) {
        console.warn('Screen share cancelled or failed', err);
      }
    }
  }, [classroomId, isAudioMuted, isHandRaised, isScreenSharing, isVideoOff, sendStompMessage]);

  // Controls: Hand Raise
  const toggleHandRaise = useCallback(() => {
    const newState = !isHandRaised;
    setIsHandRaised(newState);
    sendStompMessage(`/app/classroom/${classroomId}/meeting/state`, {
      type: 'HAND_RAISE',
      isAudioMuted,
      isVideoOff,
      isScreenSharing,
      isHandRaised: newState,
    });
  }, [classroomId, isAudioMuted, isHandRaised, isScreenSharing, isVideoOff, sendStompMessage]);

  // Host Control: Mute All Students
  const muteAll = useCallback(() => {
    if (!isHost) return;
    sendStompMessage(`/app/classroom/${classroomId}/meeting/control`, {
      type: 'HOST_ACTION',
      hostCommand: 'MUTE_AUDIO',
    });
  }, [classroomId, isHost, sendStompMessage]);

  // In-call message send
  const sendInCallMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setInCallMessages((prev) => [
        ...prev,
        { senderId: currentUserId, senderName: 'You', text, time },
      ]);
    },
    [currentUserId]
  );

  return {
    currentUserId,
    currentUserName,
    isHost,
    isConnected,
    localStream,
    peers: Array.from(peers.values()),
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    isHandRaised,
    inCallMessages,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    toggleHandRaise,
    muteAll,
    sendInCallMessage,
  };
}

