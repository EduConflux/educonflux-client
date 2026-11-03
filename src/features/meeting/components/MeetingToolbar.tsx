import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Hand,
  MessageSquare,
  Users,
  PhoneOff,
  ShieldAlert,
} from 'lucide-react';

interface MeetingToolbarProps {
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  isHost: boolean;
  attendeeCount: number;
  showChat: boolean;
  showParticipants: boolean;
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleHandRaise: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onLeaveCall: () => void;
  onEndCallForEveryone?: () => void;
}

export const MeetingToolbar: React.FC<MeetingToolbarProps> = ({
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  isHandRaised,
  isHost,
  attendeeCount,
  showChat,
  showParticipants,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleHandRaise,
  onToggleChat,
  onToggleParticipants,
  onLeaveCall,
  onEndCallForEveryone,
}) => {
  return (
    <div className="bg-neutral-900 border-t border-neutral-800 px-4 py-3 flex items-center justify-between gap-2 z-20">
      {/* Left Strip: Room & Status */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-white">Live Classroom Lecture</span>
      </div>

      {/* Center: Main AV & Interactive Controls */}
      <div className="flex items-center gap-2 sm:gap-3 mx-auto">
        {/* Mic Toggle */}
        <button
          type="button"
          onClick={onToggleAudio}
          className={`p-3 rounded-2xl transition-all cursor-pointer border shadow-sm ${
            isAudioMuted
              ? 'bg-rose-600/90 text-white border-rose-500 hover:bg-rose-700'
              : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
          }`}
          title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Camera Toggle */}
        <button
          type="button"
          onClick={onToggleVideo}
          className={`p-3 rounded-2xl transition-all cursor-pointer border shadow-sm ${
            isVideoOff
              ? 'bg-rose-600/90 text-white border-rose-500 hover:bg-rose-700'
              : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
          }`}
          title={isVideoOff ? 'Start Camera' : 'Stop Camera'}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Screen Share */}
        <button
          type="button"
          onClick={onToggleScreenShare}
          className={`p-3 rounded-2xl transition-all cursor-pointer border shadow-sm ${
            isScreenSharing
              ? 'bg-blue-600 text-white border-blue-500 hover:bg-blue-700'
              : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
          }`}
          title={isScreenSharing ? 'Stop Presenting' : 'Share Screen'}
        >
          <Monitor className="w-5 h-5" />
        </button>

        {/* Raise Hand */}
        <button
          type="button"
          onClick={onToggleHandRaise}
          className={`p-3 rounded-2xl transition-all cursor-pointer border shadow-sm ${
            isHandRaised
              ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold'
              : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
          }`}
          title={isHandRaised ? 'Lower Hand' : 'Raise Hand'}
        >
          <Hand className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-neutral-800 mx-1 hidden sm:block" />

        {/* In-Call Chat Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleChat}
          className={`p-3 rounded-2xl transition-all cursor-pointer border shadow-sm ${
            showChat
              ? 'bg-[#F97316] text-white border-[#F97316]'
              : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
          }`}
          title="In-Call Chat"
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Participants Drawer Toggle */}
        <button
          type="button"
          onClick={onToggleParticipants}
          className={`p-3 rounded-2xl transition-all cursor-pointer border shadow-sm relative ${
            showParticipants
              ? 'bg-[#F97316] text-white border-[#F97316]'
              : 'bg-neutral-800 text-white border-neutral-700 hover:bg-neutral-700'
          }`}
          title="Participants"
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-neutral-700 text-white border border-neutral-600">
            {attendeeCount}
          </span>
        </button>
      </div>

      {/* Right Strip: End Meeting / Leave Actions */}
      <div className="flex items-center gap-2">
        {isHost && onEndCallForEveryone && (
          <button
            type="button"
            onClick={onEndCallForEveryone}
            className="px-3.5 py-2.5 rounded-2xl bg-rose-700/80 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm border border-rose-600"
            title="End meeting for all participants"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden md:inline">End For All</span>
          </button>
        )}

        <button
          type="button"
          onClick={onLeaveCall}
          className="p-3 sm:px-4 sm:py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
          title="Leave Meeting"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="hidden sm:inline">Leave</span>
        </button>
      </div>
    </div>
  );
};
export default MeetingToolbar;

