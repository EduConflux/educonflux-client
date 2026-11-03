import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VideoTile } from './VideoTile';

describe('VideoTile Component', () => {
  it('renders participant name and local indicator correctly', () => {
    render(
      <VideoTile
        name="John Doe"
        isLocal={true}
        isAudioMuted={false}
        isVideoOff={false}
      />
    );

    expect(screen.getByText(/John Doe \(You\)/i)).toBeInTheDocument();
  });

  it('renders initial avatar when video is disabled', () => {
    render(
      <VideoTile
        name="Sarah Connor"
        isLocal={false}
        isVideoOff={true}
      />
    );

    // Initials "SC" should appear in avatar placeholder
    expect(screen.getByText('SC')).toBeInTheDocument();
  });

  it('shows muted mic indicator when isAudioMuted is true', () => {
    const { container } = render(
      <VideoTile
        name="Jane Smith"
        isAudioMuted={true}
      />
    );

    // Rose bg badge for muted mic
    const mutedIndicator = container.querySelector('.bg-rose-600\\/80');
    expect(mutedIndicator).toBeInTheDocument();
  });

  it('shows hand raised badge when participant raises hand', () => {
    render(
      <VideoTile
        name="Jane Smith"
        isHandRaised={true}
      />
    );

    expect(screen.getByText(/Raised/i)).toBeInTheDocument();
  });

  it('highlights border with orange when speaking', () => {
    const { container } = render(
      <VideoTile
        name="Active Speaker"
        isSpeaking={true}
      />
    );

    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer.className).toContain('border-[#F97316]');
  });
});
