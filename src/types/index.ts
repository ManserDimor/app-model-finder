export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  createdAt: string;
  subscribers: number;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  dislikes: number;
  createdAt: string;
  channelId: string;
  channelName: string;
  channelAvatar: string;
  tags: string[];
  category: string;
}

export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  likes: number;
  createdAt: string;
  replies: Comment[];
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  avatar: string;
  banner: string;
  subscribers: number;
  videoCount: number;
  createdAt: string;
  userId: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoIds: string[];
  userId: string;
  isPublic: boolean;
  createdAt: string;
}
