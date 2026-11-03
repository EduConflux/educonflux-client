import React from 'react';
import { X, Mic, MicOff, Hand, VolumeX, ShieldCheck } from 'lucide-react';
import type { PeerConnectionState } from '../types';

interface ParticipantsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  localName: string;
  isHost: boolean;
  isAudioMuted: boolean;
  isHandRaised: boolean;
  peers: PeerConnectionState[];
  onMuteAll?: () => void;
}

export const ParticipantsDrawer: React.FC<ParticipantsDrawerProps> = ({
  isOpen,
  onClose,
  localName,
  isHost,
  isAudioMuted,
  isHandRaised,
  peers,
  onMuteAll,
}) => {
  if (!isOpen) return null;

  const total = 1 + peers.length;

  return (
    <div className="w-80 bg-neutral-900 border-l border-neutral-800 flex flex-col h-full z-20 animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-sm text-white">Participants ({total})</h4>
          <span className="text-[10px] text-neutral-400">Connected in room</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Host Controls Section */}
      {isHost && onMuteAll && (
        <div className="p-3 border-b border-neutral-800 bg-neutral-950/40">
          <button
            type="button"
            onClick={onMuteAll}
            className="w-full py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-200 border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <VolumeX className="w-4 h-4 text-rose-500" />
            <span>Mute All Students</span>
          </button>
        </div>
      )}

      {/* Attendees List */}
      <div className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar">
        {/* Local user row */}
        <div className="p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-neutral-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {localName[0]}
            </div>
            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">
                {localName} (You)
              </span>
              {isHost && (
                <span className="text-[9px] text-[#F97316] font-extrabold uppercase flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Meeting Host
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isHandRaised && (
              <span className="p-1 rounded bg-amber-500/20 text-amber-400" title="Hand Raised">
                <Hand className="w-3.5 h-3.5" />
              </span>
            )}
            <span
              className={`p-1 rounded ${
                isAudioMuted ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'
              }`}
            >
              {isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            </span>
          </div>
        </div>

        {/* Remote peers */}
        {peers.map((peer) => (
          <div
            key={peer.userId}
            className="p-2.5 rounded-xl bg-neutral-800/40 border border-neutral-800 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2 truncate">
              <div className="w-7 h-7 rounded-full bg-neutral-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {peer.userName[0]}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {peer.userName}
                </span>
                {peer.userRole === 'HOST' && (
                  <span className="text-[9px] text-[#F97316] font-bold uppercase">
                    Host
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {peer.isHandRaised && (
                <span className="p-1 rounded bg-amber-500/20 text-amber-400 animate-pulse" title="Hand Raised">
                  <Hand className="w-3.5 h-3.5" />
                </span>
              )}
              <span
                className={`p-1 rounded ${
                  peer.isAudioMuted ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-400 bg-emerald-500/10'
                }`}
              >
                {peer.isAudioMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ParticipantsDrawer;

