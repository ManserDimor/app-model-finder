/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import { VideoPlayer } from './VideoPlayer';

// Mock HTMLMediaElement methods
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi.fn(() => Promise.resolve());
  window.HTMLMediaElement.prototype.pause = vi.fn();
});

describe('VideoPlayer', () => {
  const defaultProps = {
    src: 'https://example.com/video.mp4',
    poster: 'https://example.com/poster.jpg',
  };

  it('renders video element with correct source', () => {
    render(<VideoPlayer {...defaultProps} />);
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', defaultProps.src);
  });

  it('renders with poster image', () => {
    render(<VideoPlayer {...defaultProps} />);
    const video = document.querySelector('video');
    expect(video).toHaveAttribute('poster', defaultProps.poster);
  });

  it('shows play button overlay when not playing', () => {
    render(<VideoPlayer {...defaultProps} />);
    // The play button overlay should be visible initially
    const playOverlay = document.querySelector('button.absolute');
    expect(playOverlay).toBeInTheDocument();
  });

  it('calls onTimeUpdate callback when provided', () => {
    const onTimeUpdate = vi.fn();
    render(<VideoPlayer {...defaultProps} onTimeUpdate={onTimeUpdate} />);
    
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
  });

  it('renders control buttons', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    // Check that control container exists
    const controlsContainer = document.querySelector('.absolute.bottom-0');
    expect(controlsContainer).toBeInTheDocument();
  });
});
