import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Video, Channel, Comment, Playlist } from "@/types";
import { mockVideos, mockChannels, mockComments } from "@/data/mockData";

interface AppState {
  // Videos
  videos: Video[];
  addVideo: (video: Video) => void;
  updateVideoViews: (videoId: string) => void;
  likeVideo: (videoId: string) => void;
  dislikeVideo: (videoId: string) => void;

  // Channels
  channels: Channel[];
  subscriptions: string[];
  setSubscriptions: (subscriptions: string[]) => void;
  subscribe: (channelId: string) => void;
  unsubscribe: (channelId: string) => void;

  // Comments
  comments: Comment[];
  addComment: (comment: Comment) => void;

  // Watch history
  watchHistory: string[];
  setWatchHistory: (history: string[]) => void;
  addToWatchHistory: (videoId: string) => void;

  // Liked videos
  likedVideos: string[];
  setLikedVideos: (likedVideos: string[]) => void;

  // Playlists
  playlists: Playlist[];
  createPlaylist: (playlist: Playlist) => void;
  addToPlaylist: (playlistId: string, videoId: string) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // UI
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Videos
      videos: mockVideos,
      addVideo: (video) => set((state) => ({ videos: [video, ...state.videos] })),
      updateVideoViews: (videoId) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, views: v.views + 1 } : v
          ),
        })),
      likeVideo: (videoId) => {
        const { likedVideos } = get();
        if (likedVideos.includes(videoId)) return;
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, likes: v.likes + 1 } : v
          ),
          likedVideos: [...state.likedVideos, videoId],
        }));
      },
      dislikeVideo: (videoId) =>
        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId ? { ...v, dislikes: v.dislikes + 1 } : v
          ),
        })),

      // Channels
      channels: mockChannels,
      subscriptions: [],
      setSubscriptions: (subscriptions) => set({ subscriptions }),
      subscribe: (channelId) =>
        set((state) => ({
          subscriptions: [...state.subscriptions, channelId],
          channels: state.channels.map((c) =>
            c.id === channelId ? { ...c, subscribers: c.subscribers + 1 } : c
          ),
        })),
      unsubscribe: (channelId) =>
        set((state) => ({
          subscriptions: state.subscriptions.filter((id) => id !== channelId),
          channels: state.channels.map((c) =>
            c.id === channelId ? { ...c, subscribers: c.subscribers - 1 } : c
          ),
        })),

      // Comments
      comments: mockComments,
      addComment: (comment) =>
        set((state) => ({ comments: [comment, ...state.comments] })),

      // Watch history
      watchHistory: [],
      setWatchHistory: (history) => set({ watchHistory: history }),
      addToWatchHistory: (videoId) =>
        set((state) => ({
          watchHistory: [
            videoId,
            ...state.watchHistory.filter((id) => id !== videoId),
          ].slice(0, 100),
        })),

      // Liked videos
      likedVideos: [],
      setLikedVideos: (likedVideos) => set({ likedVideos }),

      // Playlists
      playlists: [],
      createPlaylist: (playlist) =>
        set((state) => ({ playlists: [...state.playlists, playlist] })),
      addToPlaylist: (playlistId, videoId) =>
        set((state) => ({
          playlists: state.playlists.map((p) =>
            p.id === playlistId
              ? { ...p, videoIds: [...p.videoIds, videoId] }
              : p
          ),
        })),

      // Search
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),

      // UI
      selectedCategory: "All",
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "streamtube-storage",
      partialize: (state) => ({
        watchHistory: state.watchHistory,
        likedVideos: state.likedVideos,
        subscriptions: state.subscriptions,
        playlists: state.playlists,
      }),
    }
  )
);
