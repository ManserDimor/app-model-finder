import { useStore } from './useStore';

describe('useStore - Authentication', () => {
  beforeEach(() => {
    // Reset store state before each test
    useStore.setState({
      currentUser: null,
      isAuthenticated: false,
      watchHistory: [],
      likedVideos: [],
      subscriptions: [],
      playlists: [],
    });
    localStorage.clear();
  });

  it('should start with no current user', () => {
    const state = useStore.getState();
    expect(state.currentUser).toBeNull();
  });

  it('should login with valid credentials', () => {
    const state = useStore.getState();
    const result = state.login('john@example.com', 'password');
    
    expect(result).toBe(true);
    expect(useStore.getState().currentUser).not.toBeNull();
    expect(useStore.getState().currentUser?.email).toBe('john@example.com');
  });

  it('should login with any email (demo mode)', () => {
    const state = useStore.getState();
    const result = state.login('newuser@example.com', 'anypassword');
    
    expect(result).toBe(true);
    expect(useStore.getState().currentUser).not.toBeNull();
    expect(useStore.getState().currentUser?.email).toBe('newuser@example.com');
  });

  it('should logout successfully', () => {
    const state = useStore.getState();
    state.login('john@example.com', 'password');
    expect(useStore.getState().currentUser).not.toBeNull();
    
    state.logout();
    expect(useStore.getState().currentUser).toBeNull();
    expect(useStore.getState().isAuthenticated).toBe(false);
  });

  it('should register new user', () => {
    const state = useStore.getState();
    const result = state.register('newuser', 'newuser@example.com', 'password123');
    
    expect(result).toBe(true);
    expect(useStore.getState().currentUser).not.toBeNull();
    expect(useStore.getState().currentUser?.username).toBe('newuser');
    expect(useStore.getState().isAuthenticated).toBe(true);
  });
});

describe('useStore - Video Interactions', () => {
  beforeEach(() => {
    useStore.setState({
      currentUser: {
        id: 'test-user',
        username: 'testuser',
        email: 'test@example.com',
        avatar: '',
        createdAt: new Date().toISOString(),
        subscribers: 0,
        description: 'Test user description',
      },
      isAuthenticated: true,
      watchHistory: [],
      likedVideos: [],
      subscriptions: [],
      playlists: [],
    });
  });

  it('should add video to watch history', () => {
    const state = useStore.getState();
    state.addToWatchHistory('video-1');
    
    expect(useStore.getState().watchHistory).toContain('video-1');
  });

  it('should move duplicate videos to front of watch history', () => {
    const state = useStore.getState();
    state.addToWatchHistory('video-1');
    state.addToWatchHistory('video-2');
    state.addToWatchHistory('video-1');
    
    const history = useStore.getState().watchHistory;
    expect(history[0]).toBe('video-1');
    expect(history.filter(id => id === 'video-1').length).toBe(1);
  });

  it('should add video to liked videos', () => {
    const state = useStore.getState();
    state.likeVideo('video-1');
    
    expect(useStore.getState().likedVideos).toContain('video-1');
  });

  it('should not duplicate liked videos', () => {
    const state = useStore.getState();
    state.likeVideo('video-1');
    state.likeVideo('video-1');
    
    expect(useStore.getState().likedVideos.filter(id => id === 'video-1').length).toBe(1);
  });

  it('should subscribe to channel', () => {
    const state = useStore.getState();
    state.subscribe('channel-1');
    
    expect(useStore.getState().subscriptions).toContain('channel-1');
  });

  it('should unsubscribe from channel', () => {
    const state = useStore.getState();
    state.subscribe('channel-1');
    expect(useStore.getState().subscriptions).toContain('channel-1');
    
    state.unsubscribe('channel-1');
    expect(useStore.getState().subscriptions).not.toContain('channel-1');
  });
});

describe('useStore - Comments', () => {
  beforeEach(() => {
    useStore.setState({
      currentUser: {
        id: 'test-user',
        username: 'testuser',
        email: 'test@example.com',
        avatar: '',
        createdAt: new Date().toISOString(),
        subscribers: 0,
        description: 'Test user',
      },
      isAuthenticated: true,
    });
  });

  it('should add comment to video', () => {
    const state = useStore.getState();
    const initialComments = state.comments.length;
    
    const newComment = {
      id: 'comment-new',
      videoId: 'video-1',
      userId: 'test-user',
      username: 'testuser',
      userAvatar: '',
      content: 'Great video!',
      likes: 0,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    
    state.addComment(newComment);
    
    expect(useStore.getState().comments.length).toBe(initialComments + 1);
    expect(useStore.getState().comments[0].content).toBe('Great video!');
  });
});

describe('useStore - UI State', () => {
  it('should update search query', () => {
    const state = useStore.getState();
    state.setSearchQuery('test search');
    
    expect(useStore.getState().searchQuery).toBe('test search');
  });

  it('should update selected category', () => {
    const state = useStore.getState();
    state.setSelectedCategory('Music');
    
    expect(useStore.getState().selectedCategory).toBe('Music');
  });

  it('should toggle sidebar', () => {
    const state = useStore.getState();
    const initialState = state.sidebarOpen;
    
    state.setSidebarOpen(!initialState);
    
    expect(useStore.getState().sidebarOpen).toBe(!initialState);
  });
});
