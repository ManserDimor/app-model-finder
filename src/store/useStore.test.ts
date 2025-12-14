import { useStore } from './useStore';

describe('useStore - Video Interactions', () => {
  it('should add video to watch history', () => {
    const { addToWatchHistory } = useStore.getState();
    addToWatchHistory('video-1');
    expect(useStore.getState().watchHistory).toContain('video-1');
  });

  it('should toggle sidebar', () => {
    const { setSidebarOpen } = useStore.getState();
    setSidebarOpen(false);
    expect(useStore.getState().sidebarOpen).toBe(false);
  });
});
