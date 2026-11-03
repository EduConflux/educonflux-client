import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Monitor, Hand, User as UserIcon } from 'lucide-react';
import type { ParticipantRole } from '../types';

interface VideoTileProps {
  stream?: MediaStream | null;
  name: string;
  role?: ParticipantRole;
  isLocal?: boolean;
  isAudioMuted?: boolean;
  isVideoOff?: boolean;
  isScreenSharing?: boolean;
  isHandRaised?: boolean;
  isSpeaking?: boolean;
}

export const VideoTile: React.FC<VideoTileProps> = ({
  stream,
  name,
  role = 'PARTICIPANT',
  isLocal = false,
  isAudioMuted = false,
  isVideoOff = false,
  isScreenSharing = false,
  isHandRaised = false,
  isSpeaking = false,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative w-full h-full bg-[#171717] rounded-2xl overflow-hidden border-2 transition-all flex items-center justify-center ${
        isSpeaking ? 'border-[#F97316] shadow-lg shadow-orange-500/20' : 'border-neutral-800'
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isVideoOff || !stream ? 'opacity-0' : 'opacity-100'
        } ${isLocal && !isScreenSharing ? 'scale-x-[-1]' : ''}`}
      />

      {/* Fallback Avatar when Camera is Off */}
      {(isVideoOff || !stream) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-neutral-900 select-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-800 border-2 border-neutral-700 flex items-center justify-center text-white font-black text-xl sm:text-2xl shadow-inner">
            {initials || <UserIcon className="w-8 h-8 text-neutral-400" />}
          </div>
          <span className="text-xs font-semibold text-neutral-400">Camera Off</span>
        </div>
      )}

      {/* Top Indicators: Hand Raised & Screen Share */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
        {isHandRaised && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-neutral-950 shadow-md animate-bounce">
            <Hand className="w-3 h-3" />
            <span>Hand Raised</span>
          </span>
        )}
        {isScreenSharing && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-md">
            <Monitor className="w-3 h-3" />
            <span>Presenting</span>
          </span>
        )}
      </div>

      {/* Bottom Info Bar: Name, Role, Mic Status */}
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs border border-white/10 shadow-sm max-w-[80%] truncate">
          <span className="font-bold truncate">
            {name} {isLocal && '(You)'}
          </span>
          {role === 'HOST' && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-orange-500/80 text-white uppercase tracking-wider">
              Host
            </span>
          )}
        </div>

        {/* Audio Mute Indicator */}
        <div
          className={`p-1.5 rounded-xl backdrop-blur-md border shadow-sm ${
            isAudioMuted
              ? 'bg-rose-600/80 border-rose-500/50 text-white'
              : 'bg-black/60 border-white/10 text-emerald-400'
          }`}
        >
          {isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
        </div>
      </div>
    </div>
  );
};
export default VideoTile;

