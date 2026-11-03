import React from 'react';
import { VideoTile } from './VideoTile';
import type { PeerConnectionState, ParticipantRole } from '../types';

interface VideoGridProps {
  localStream: MediaStream | null;
  localName: string;
  isHost: boolean;
  isAudioMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isHandRaised: boolean;
  peers: PeerConnectionState[];
}

export const VideoGrid: React.FC<VideoGridProps> = ({
  localStream,
  localName,
  isHost,
  isAudioMuted,
  isVideoOff,
  isScreenSharing,
  isHandRaised,
  peers,
}) => {
  // Check if someone is screen sharing
  const remoteScreenSharer = peers.find((p) => p.isScreenSharing);

  const screenSharer = isScreenSharing
    ? {
        stream: localStream,
        userName: localName,
        userRole: (isHost ? 'HOST' : 'PARTICIPANT') as ParticipantRole,
        isLocal: true,
      }
    : remoteScreenSharer
    ? {
        stream: remoteScreenSharer.stream,
        userName: remoteScreenSharer.userName,
        userRole: remoteScreenSharer.userRole,
        isLocal: false,
      }
    : null;

  const totalAttendees = 1 + peers.length;

  // Grid layout class based on count
  const getGridClasses = (count: number) => {
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2';
    if (count <= 6) return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  };

  // If someone is screen sharing, show Presenter/Spotlight layout
  if (screenSharer) {
    return (
      <div className="flex-1 flex flex-col lg:flex-row gap-3 p-3 overflow-hidden min-h-0">
        {/* Main Stage */}
        <div className="flex-1 min-h-[300px] h-full rounded-2xl overflow-hidden shadow-2xl">
          <VideoTile
            stream={screenSharer.stream}
            name={`${screenSharer.userName}'s Presentation`}
            role={screenSharer.userRole}
            isLocal={screenSharer.isLocal}
            isScreenSharing={true}
          />
        </div>

        {/* Sidebar strip of participant cameras */}
        <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto no-scrollbar shrink-0">
          {/* Local camera tile in strip */}
          <div className="w-48 lg:w-full h-32 shrink-0">
            <VideoTile
              stream={localStream}
              name={localName}
              role={isHost ? 'HOST' : 'PARTICIPANT'}
              isLocal={true}
              isAudioMuted={isAudioMuted}
              isVideoOff={isVideoOff}
              isHandRaised={isHandRaised}
            />
          </div>

          {/* Remote peers in strip */}
          {peers.map((peer) => (
            <div key={peer.userId} className="w-48 lg:w-full h-32 shrink-0">
              <VideoTile
                stream={peer.stream}
                name={peer.userName}
                role={peer.userRole}
                isAudioMuted={peer.isAudioMuted}
                isVideoOff={peer.isVideoOff}
                isHandRaised={peer.isHandRaised}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Normal Gallery Mode
  return (
    <div
      className={`flex-1 p-3 grid gap-3 auto-rows-fr overflow-y-auto no-scrollbar min-h-0 ${getGridClasses(
        totalAttendees
      )}`}
    >
      {/* 1. Local Participant Tile */}
      <div className="w-full h-full min-h-[180px]">
        <VideoTile
          stream={localStream}
          name={localName}
          role={isHost ? 'HOST' : 'PARTICIPANT'}
          isLocal={true}
          isAudioMuted={isAudioMuted}
          isVideoOff={isVideoOff}
          isScreenSharing={isScreenSharing}
          isHandRaised={isHandRaised}
        />
      </div>

      {/* 2. Remote Peers Tiles */}
      {peers.map((peer) => (
        <div key={peer.userId} className="w-full h-full min-h-[180px]">
          <VideoTile
            stream={peer.stream}
            name={peer.userName}
            role={peer.userRole}
            isAudioMuted={peer.isAudioMuted}
            isVideoOff={peer.isVideoOff}
            isScreenSharing={peer.isScreenSharing}
            isHandRaised={peer.isHandRaised}
          />
        </div>
      ))}
    </div>
  );
};
export default VideoGrid;
