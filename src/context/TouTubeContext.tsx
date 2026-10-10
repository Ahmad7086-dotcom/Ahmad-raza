import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Video, VideoComment, LiveChatMessage, CommunityMessage, ChatChannel, UserProfile } from '../types';
import { INITIAL_VIDEOS, INITIAL_COMMENTS, INITIAL_LIVE_CHAT, INITIAL_CHANNELS, INITIAL_COMMUNITY_MESSAGES, CURRENT_USER } from '../data/seedVideos';
import confetti from 'canvas-confetti';

interface TouTubeContextType {
  // Theme
  isDark: boolean;
  toggleTheme: () => void;

  // Active navigation tab
  activeTab: 'home' | 'shorts' | 'live' | 'chat' | 'subscriptions' | 'library' | 'my-channel';
  setActiveTab: (tab: 'home' | 'shorts' | 'live' | 'chat' | 'subscriptions' | 'library' | 'my-channel') => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Active watch video (if user clicked to watch)
  currentWatchingVideo: Video | null;
  setCurrentWatchingVideo: (video: Video | null) => void;

  // Videos state
  videos: Video[];
  toggleLikeVideo: (videoId: string) => void;
  toggleDislikeVideo: (videoId: string) => void;
  toggleSaveVideo: (videoId: string) => void;
  toggleSubscribeChannel: (creatorId: string) => void;

  // Add / Post new Video or Short
  addNewVideo: (newVid: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => void;

  // Comments
  comments: Record<string, VideoComment[]>;
  addComment: (videoId: string, content: string) => void;
  likeComment: (videoId: string, commentId: string) => void;

  // Live Chat
  liveChatMessages: LiveChatMessage[];
  sendLiveChatMessage: (videoId: string, message: string, superChatAmount?: number) => void;

  // Community / Direct Chat
  channels: ChatChannel[];
  activeChannelId: string;
  setActiveChannelId: (channelId: string) => void;
  communityMessages: Record<string, CommunityMessage[]>;
  sendCommunityMessage: (channelId: string, text: string, sharedVideo?: Video) => void;

  // Upload modal visibility
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: (open: boolean) => void;

  // Current User
  currentUser: UserProfile;
  updateCurrentUser: (updated: Partial<UserProfile>) => void;

  // Floating reactions for Live stream
  floatingReactions: { id: string; emoji: string; left: number }[];
  triggerLiveReaction: (emoji: string) => void;
}

const TouTubeContext = createContext<TouTubeContextType | undefined>(undefined);

export const TouTubeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('toutube_theme');
    return saved ? saved === 'dark' : true; // Default dark mode as requested
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('toutube_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('toutube_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Tabs & filters
  const [activeTab, setActiveTab] = useState<'home' | 'shorts' | 'live' | 'chat' | 'subscriptions' | 'library' | 'my-channel'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentWatchingVideo, setCurrentWatchingVideo] = useState<Video | null>(null);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('toutube_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const updateCurrentUser = (updated: Partial<UserProfile>) => {
    setCurrentUser(prev => {
      const next = { ...prev, ...updated };
      localStorage.setItem('toutube_user', JSON.stringify(next));
      return next;
    });
  };

  // Videos
  const [videos, setVideos] = useState<Video[]>(() => {
    try {
      const saved = localStorage.getItem('toutube_videos');
      if (saved) {
        const parsed: Video[] = JSON.parse(saved);
        // Sanitize broken Google Storage URLs or dead blob: URLs from previous sessions
        const sanitized = parsed.map((v, i) => {
          if (!v.videoUrl || v.videoUrl.includes('commondatastorage.googleapis.com') || (v.videoUrl.startsWith('blob:') && !v.videoUrl.includes('localhost'))) {
            const fallback = INITIAL_VIDEOS[i % INITIAL_VIDEOS.length]?.videoUrl || 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4';
            return { ...v, videoUrl: fallback };
          }
          return v;
        });
        return sanitized;
      }
    } catch {
      // Fallback to fresh initial videos
    }
    return INITIAL_VIDEOS;
  });

  useEffect(() => {
    localStorage.setItem('toutube_videos', JSON.stringify(videos));
  }, [videos]);

  // Comments
  const [comments, setComments] = useState<Record<string, VideoComment[]>>(() => {
    const saved = localStorage.getItem('toutube_comments');
    return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
  });

  useEffect(() => {
    localStorage.setItem('toutube_comments', JSON.stringify(comments));
  }, [comments]);

  // Live Chat
  const [liveChatMessages, setLiveChatMessages] = useState<LiveChatMessage[]>(() => {
    const saved = localStorage.getItem('toutube_livechat');
    return saved ? JSON.parse(saved) : INITIAL_LIVE_CHAT;
  });

  // Floating reaction items
  const [floatingReactions, setFloatingReactions] = useState<{ id: string; emoji: string; left: number }[]>([]);

  const triggerLiveReaction = (emoji: string) => {
    const newReaction = {
      id: Math.random().toString(36).substring(2, 9),
      emoji,
      left: 15 + Math.random() * 70 // 15% to 85% width
    };
    setFloatingReactions(prev => [...prev.slice(-15), newReaction]);
    setTimeout(() => {
      setFloatingReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2800);
  };

  // Community Chat
  const [channels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>('ch-general');
  const [communityMessages, setCommunityMessages] = useState<Record<string, CommunityMessage[]>>(() => {
    const saved = localStorage.getItem('toutube_comm_msgs');
    return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_MESSAGES;
  });

  useEffect(() => {
    localStorage.setItem('toutube_comm_msgs', JSON.stringify(communityMessages));
  }, [communityMessages]);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Like / Dislike Video
  const toggleLikeVideo = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const wasLiked = !!v.isLiked;
          const wasDisliked = !!v.isDisliked;
          return {
            ...v,
            isLiked: !wasLiked,
            likes: wasLiked ? v.likes - 1 : v.likes + 1,
            isDisliked: false,
            dislikes: wasDisliked ? v.dislikes - 1 : v.dislikes
          };
        }
        return v;
      })
    );
    if (currentWatchingVideo && currentWatchingVideo.id === videoId) {
      setCurrentWatchingVideo(prev => {
        if (!prev) return null;
        const wasLiked = !!prev.isLiked;
        const wasDisliked = !!prev.isDisliked;
        return {
          ...prev,
          isLiked: !wasLiked,
          likes: wasLiked ? prev.likes - 1 : prev.likes + 1,
          isDisliked: false,
          dislikes: wasDisliked ? prev.dislikes - 1 : prev.dislikes
        };
      });
    }
  };

  const toggleDislikeVideo = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const wasDisliked = !!v.isDisliked;
          const wasLiked = !!v.isLiked;
          return {
            ...v,
            isDisliked: !wasDisliked,
            dislikes: wasDisliked ? v.dislikes - 1 : v.dislikes + 1,
            isLiked: false,
            likes: wasLiked ? v.likes - 1 : v.likes
          };
        }
        return v;
      })
    );
    if (currentWatchingVideo && currentWatchingVideo.id === videoId) {
      setCurrentWatchingVideo(prev => {
        if (!prev) return null;
        const wasDisliked = !!prev.isDisliked;
        const wasLiked = !!prev.isLiked;
        return {
          ...prev,
          isDisliked: !wasDisliked,
          dislikes: wasDisliked ? prev.dislikes - 1 : prev.dislikes + 1,
          isLiked: false,
          likes: wasLiked ? prev.likes - 1 : prev.likes
        };
      });
    }
  };

  const toggleSaveVideo = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, isSaved: !v.isSaved } : v))
    );
    if (currentWatchingVideo && currentWatchingVideo.id === videoId) {
      setCurrentWatchingVideo(prev => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }
  };

  const toggleSubscribeChannel = (creatorId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.creator.id === creatorId) {
          const nextSub = !v.creator.isSubscribed;
          return {
            ...v,
            creator: {
              ...v.creator,
              isSubscribed: nextSub,
              subscribers: nextSub ? v.creator.subscribers + 1 : v.creator.subscribers - 1
            }
          };
        }
        return v;
      })
    );
    if (currentWatchingVideo && currentWatchingVideo.creator.id === creatorId) {
      setCurrentWatchingVideo(prev => {
        if (!prev) return null;
        const nextSub = !prev.creator.isSubscribed;
        return {
          ...prev,
          creator: {
            ...prev.creator,
            isSubscribed: nextSub,
            subscribers: nextSub ? prev.creator.subscribers + 1 : prev.creator.subscribers - 1
          }
        };
      });
    }
  };

  // Add video or short
  const addNewVideo = (newVidData: Omit<Video, 'id' | 'views' | 'likes' | 'dislikes' | 'createdAt'>) => {
    const newVideo: Video = {
      ...newVidData,
      id: `vid-custom-${Date.now()}`,
      views: 1,
      likes: 1,
      dislikes: 0,
      createdAt: 'Just now',
      isLiked: true
    };
    setVideos(prev => [newVideo, ...prev]);
    // celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Comments
  const addComment = (videoId: string, content: string) => {
    if (!content.trim()) return;
    const newComm: VideoComment = {
      id: `comm-${Date.now()}`,
      videoId,
      author: currentUser.name,
      handle: currentUser.handle,
      avatar: currentUser.avatar,
      content: content.trim(),
      timestamp: 'Just now',
      likes: 0,
      badge: 'Human Verified'
    };
    setComments(prev => ({
      ...prev,
      [videoId]: [newComm, ...(prev[videoId] || [])]
    }));
  };

  const likeComment = (videoId: string, commentId: string) => {
    setComments(prev => {
      const list = prev[videoId] || [];
      return {
        ...prev,
        [videoId]: list.map(c => {
          if (c.id === commentId) {
            const wasLiked = !!c.isLiked;
            return {
              ...c,
              isLiked: !wasLiked,
              likes: wasLiked ? c.likes - 1 : c.likes + 1
            };
          }
          return c;
        })
      };
    });
  };

  // Live Chat
  const sendLiveChatMessage = (videoId: string, message: string, superChatAmount?: number) => {
    if (!message.trim()) return;
    const newMsg: LiveChatMessage = {
      id: `lc-user-${Date.now()}`,
      videoId,
      author: currentUser.name,
      avatar: currentUser.avatar,
      message: message.trim(),
      timestamp: 'Now',
      badge: 'verified',
      superChatAmount,
      superChatColor: superChatAmount ? '#ec4899' : undefined
    };

    setLiveChatMessages(prev => [...prev, newMsg]);

    if (superChatAmount && superChatAmount > 0) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      triggerLiveReaction('🎉');
    }
  };

  // Community Messages
  const sendCommunityMessage = (channelId: string, text: string, sharedVideo?: Video) => {
    if (!text.trim() && !sharedVideo) return;
    const newMsg: CommunityMessage = {
      id: `cm-user-${Date.now()}`,
      channelId,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        isCurrentUser: true
      },
      text: text.trim(),
      timestamp: 'Just now',
      sharedVideo: sharedVideo
        ? {
            id: sharedVideo.id,
            title: sharedVideo.title,
            thumbnailUrl: sharedVideo.thumbnailUrl,
            creatorName: sharedVideo.creator.name,
            duration: sharedVideo.type === 'live' ? 'LIVE' : `${Math.floor(sharedVideo.duration / 60)}:${(sharedVideo.duration % 60).toString().padStart(2, '0')}`
          }
        : undefined
    };

    setCommunityMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg]
    }));
  };

  // Simulated live chat stream heartbeat: during live streams, add occasional realistic live viewer comments
  useEffect(() => {
    const simulatedComments = [
      { author: 'Hamza K.', msg: 'The bass on this is incredible! 🎸', badge: 'member' },
      { author: 'Zainab Ali', msg: 'Greetings from Islamabad! Loved this performance', badge: 'verified' },
      { author: 'Rayan Ahmed', msg: 'Super clean video quality! 4K looks amazing', badge: undefined },
      { author: 'Sohail Khan', msg: 'Can you show your camera settings? 🔥', badge: undefined },
      { author: 'Nadia Malik', msg: 'Original human talents are the best 🙌', badge: 'mod' },
      { author: 'Daniyal', msg: 'Drop the chords in description please!', badge: undefined }
    ];

    const interval = setInterval(() => {
      // 50% chance every 6 seconds to add a simulated live chat message
      if (Math.random() > 0.4) {
        const randomItem = simulatedComments[Math.floor(Math.random() * simulatedComments.length)];
        const incomingMsg: LiveChatMessage = {
          id: `lc-sim-${Date.now()}`,
          videoId: 'live-1',
          author: randomItem.author,
          avatar: `https://images.unsplash.com/photo-${1500000000000 + (Date.now() % 50000)}?auto=format&fit=crop&w=100&q=80`,
          message: randomItem.msg,
          timestamp: 'Just now',
          badge: randomItem.badge as any
        };
        setLiveChatMessages(prev => [...prev.slice(-40), incomingMsg]);
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <TouTubeContext.Provider
      value={{
        isDark,
        toggleTheme,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        currentWatchingVideo,
        setCurrentWatchingVideo,
        videos,
        toggleLikeVideo,
        toggleDislikeVideo,
        toggleSaveVideo,
        toggleSubscribeChannel,
        addNewVideo,
        comments,
        addComment,
        likeComment,
        liveChatMessages,
        sendLiveChatMessage,
        channels,
        activeChannelId,
        setActiveChannelId,
        communityMessages,
        sendCommunityMessage,
        isUploadModalOpen,
        setIsUploadModalOpen,
        currentUser,
        updateCurrentUser,
        floatingReactions,
        triggerLiveReaction
      }}
    >
      {children}
    </TouTubeContext.Provider>
  );
};

export const useTouTube = () => {
  const context = useContext(TouTubeContext);
  if (!context) {
    throw new Error('useTouTube must be used within TouTubeProvider');
  }
  return context;
};
