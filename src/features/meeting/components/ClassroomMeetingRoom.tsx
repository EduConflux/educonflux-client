import React, { useState } from 'react';
import { useWebRTCMeeting } from '../hooks/useWebRTCMeeting';
import { useIceServers, useEndMeeting } from '../hooks/useMeeting';
import { VideoGrid } from './VideoGrid';
import { MeetingToolbar } from './MeetingToolbar';
import { InCallChatDrawer } from './InCallChatDrawer';
import { ParticipantsDrawer } from './ParticipantsDrawer';
import type { ClassroomMeetingResponse } from '../types';

interface ClassroomMeetingRoomProps {
  meeting: ClassroomMeetingResponse;
  classroomId: number;
  onClose: () => void;
}

export const ClassroomMeetingRoom: React.FC<ClassroomMeetingRoomProps> = ({
  meeting,
  classroomId,
  onClose,
}) => {
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);

  // STUN ICE Servers from backend
  const { data: iceServersData = [] } = useIceServers(classroomId);
  const iceServers = iceServersData.length > 0 ? iceServersData : undefined;

  // End meeting mutation for host
  const endMeetingMutation = useEndMeeting();

  const {
    currentUserName,
    isHost,
    localStream,
    peers,
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
  } = useWebRTCMeeting({
    meeting,
    classroomId,
    iceServers,
    onMeetingEnded: onClose,
  });

  const handleEndCallForEveryone = async () => {
    if (window.confirm('Are you sure you want to end the lecture for all attendees?')) {
      try {
        await endMeetingMutation.mutateAsync({ classroomId, meetingId: meeting.id });
        onClose();
      } catch (err) {
        console.error('Failed to end meeting', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col text-white animate-in fade-in select-none">
      {/* Top Meeting Title Bar */}
      <div className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-xs z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-white text-sm">{meeting.title}</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded border border-neutral-700">
            Room: {meeting.roomCode}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-[11px]">
            Host: <span className="font-semibold text-white">{meeting.hostName}</span>
          </span>
        </div>
      </div>

      {/* Main Body: Video Grid + Optional Drawers */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <VideoGrid
          localStream={localStream}
          localName={currentUserName}
          isHost={isHost}
          isAudioMuted={isAudioMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          isHandRaised={isHandRaised}
          peers={peers}
        />

        {/* Side Drawers */}
        <InCallChatDrawer
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          messages={inCallMessages}
          onSendMessage={sendInCallMessage}
        />

        <ParticipantsDrawer
          isOpen={showParticipants}
          onClose={() => setShowParticipants(false)}
          localName={currentUserName}
          isHost={isHost}
          isAudioMuted={isAudioMuted}
          isHandRaised={isHandRaised}
          peers={peers}
          onMuteAll={muteAll}
        />
      </div>

      {/* Bottom Meeting Controls Toolbar */}
      <MeetingToolbar
        isAudioMuted={isAudioMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        isHandRaised={isHandRaised}
        isHost={isHost}
        attendeeCount={1 + peers.length}
        showChat={showChat}
        showParticipants={showParticipants}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleHandRaise={toggleHandRaise}
        onToggleChat={() => {
          setShowChat((prev) => !prev);
          setShowParticipants(false);
        }}
        onToggleParticipants={() => {
          setShowParticipants((prev) => !prev);
          setShowChat(false);
        }}
        onLeaveCall={onClose}
        onEndCallForEveryone={isHost ? handleEndCallForEveryone : undefined}
      />
    </div>
  );
};
export default ClassroomMeetingRoom;

