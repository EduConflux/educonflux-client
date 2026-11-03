export type MeetingStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED';
export type ParticipantRole = 'HOST' | 'CO_HOST' | 'PARTICIPANT';

export interface ClassroomMeetingResponse {
  id: number;
  classroomId: number;
  classroomName?: string;
  hostUserId: number;
  hostName: string;
  title: string;
  status: MeetingStatus;
  roomCode: string;
  scheduledStartTime?: string;
  startedAt?: string;
  endedAt?: string;
  allowStudentUnmute: boolean;
  allowStudentScreenShare: boolean;
  activeParticipantCount: number;
  createdAt?: string;
}

export interface CreateMeetingRequest {
  title?: string;
  scheduledStartTime?: string;
  allowStudentUnmute?: boolean;
  allowStudentScreenShare?: boolean;
}

export interface MeetingParticipantResponse {
  id: number;
  meetingId: number;
  userId: number;
  userName: string;
  userEmail: string;
  role: ParticipantRole;
  joinedAt: string;
  leftAt?: string;
  durationSeconds?: number;
  handRaised: boolean;
  micMuted: boolean;
  cameraOff: boolean;
}

export interface IceServerResponse {
  urls: string[];
  username?: string;
  credential?: string;
}

export type SignalMessageType =
  | 'ROOM_JOINED'
  | 'PEER_JOINED'
  | 'PEER_LEFT'
  | 'OFFER'
  | 'ANSWER'
  | 'ICE_CANDIDATE'
  | 'MEDIA_STATE_CHANGED'
  | 'HAND_RAISE'
  | 'HOST_ACTION'
  | 'MEETING_ENDED';

export interface WebRTCSignalMessage {
  type: SignalMessageType;
  senderId?: number;
  senderName?: string;
  senderRole?: string;
  targetUserId?: number;
  sdp?: RTCSessionDescriptionInit;
  candidate?: RTCIceCandidateInit;
  isAudioMuted?: boolean;
  isVideoOff?: boolean;
  isScreenSharing?: boolean;
  isHandRaised?: boolean;
  hostCommand?: 'MUTE_AUDIO' | 'KICK' | 'END_MEETING';
  timestamp?: string;
}

export interface PeerConnectionState {
  userId: number;
  userName: string;
  userRole: ParticipantRole;
  pc: RTCPeerConnection;
  stream: MediaStream;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  isSpeaking?: boolean;
}

