import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MeetingToolbar } from './MeetingToolbar';

describe('MeetingToolbar Component', () => {
  const defaultProps = {
    isAudioMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    isHandRaised: false,
    isHost: false,
    attendeeCount: 5,
    showChat: false,
    showParticipants: false,
    onToggleAudio: vi.fn(),
    onToggleVideo: vi.fn(),
    onToggleScreenShare: vi.fn(),
    onToggleHandRaise: vi.fn(),
    onToggleChat: vi.fn(),
    onToggleParticipants: vi.fn(),
    onLeaveCall: vi.fn(),
    onEndCallForEveryone: vi.fn(),
  };

  it('renders participant count badge', () => {
    render(<MeetingToolbar {...defaultProps} attendeeCount={8} />);
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('triggers audio and video mute toggle callbacks', () => {
    render(<MeetingToolbar {...defaultProps} />);

    const audioBtn = screen.getByTitle(/Mute Microphone/i);
    fireEvent.click(audioBtn);
    expect(defaultProps.onToggleAudio).toHaveBeenCalledTimes(1);

    const videoBtn = screen.getByTitle(/Stop Camera/i);
    fireEvent.click(videoBtn);
    expect(defaultProps.onToggleVideo).toHaveBeenCalledTimes(1);
  });

  it('renders End Call for Everyone button ONLY for host', () => {
    const { rerender } = render(<MeetingToolbar {...defaultProps} isHost={false} />);
    expect(screen.queryByTitle(/End Meeting For All/i)).not.toBeInTheDocument();

    rerender(<MeetingToolbar {...defaultProps} isHost={true} />);
    const endForAllBtn = screen.getByTitle(/End Meeting For All/i);
    expect(endForAllBtn).toBeInTheDocument();

    fireEvent.click(endForAllBtn);
    expect(defaultProps.onEndCallForEveryone).toHaveBeenCalledTimes(1);
  });

  it('triggers leave call when participant clicks leave button', () => {
    render(<MeetingToolbar {...defaultProps} />);
    const leaveBtn = screen.getByTitle(/Leave Meeting/i);
    fireEvent.click(leaveBtn);
    expect(defaultProps.onLeaveCall).toHaveBeenCalledTimes(1);
  });
});
