export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  subscribers: number;
  isVerified: boolean;
  isSubscribed?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  isSaved?: boolean;
  createdAt: string;
  creator: Creator;
  category: 'all' | 'gaming' | 'tech' | 'nature' | 'music' | 'vlogs' | 'lifestyle' | 'sports' | 'food';
  type: 'video' | 'short' | 'live';
  isHumanVerified: boolean; // "jo ai say na banwai ho"
  humanVerificationNote?: string;
  tags: string[];
  liveViewers?: number;
  isLiveNow?: boolean;
}

export interface VideoComment {
  id: string;
  videoId: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  badge?: 'Creator' | 'VIP Member' | 'Human Verified';
}

export interface LiveChatMessage {
  id: string;
  videoId: string;
  author: string;
  avatar: string;
  message: string;
  timestamp: string;
  badge?: 'mod' | 'member' | 'verified';
  superChatAmount?: number;
  superChatColor?: string;
}

export interface CommunityMessage {
  id: string;
  channelId: string;
  sender: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    isCurrentUser?: boolean;
  };
  text: string;
  timestamp: string;
  sharedVideo?: {
    id: string;
    title: string;
    thumbnailUrl: string;
    creatorName: string;
    duration: string;
  };
  reactions?: Record<string, number>;
}

export interface ChatChannel {
  id: string;
  name: string;
  type: 'public' | 'direct';
  description?: string;
  unreadCount?: number;
  avatar?: string;
  onlineCount?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  subscribers: number;
  joinedDate: string;
}
