import { Video, VideoComment, LiveChatMessage, ChatChannel, CommunityMessage } from '../types';

export const FALLBACK_VIDEO_URL = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4';

export const VERIFIED_VIDEO_URLS = {
  surfing: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
  oceans: 'https://vjs.zencdn.net/v/oceans.mp4',
  flower: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  friday: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
  sintel: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
  bunny: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  jellyfish: 'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4'
};

export const INITIAL_VIDEOS: Video[] = [
  // --- Standard Videos ---
  {
    id: 'vid-1',
    title: 'Acoustic Guitar Session & Raw Live Vocals (No Autotune, 100% Real)',
    description: 'Recorded live in an analog studio with two Neumann microphones and an authentic 1974 Gibson acoustic guitar. No AI pitch correction or generated stems were used in this recording.',
    videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    duration: 180,
    views: 184200,
    likes: 14200,
    dislikes: 112,
    createdAt: '2 days ago',
    category: 'music',
    type: 'video',
    isHumanVerified: true,
    humanVerificationNote: 'Filmed on Sony FX3 with Shure SM7B direct analog master',
    tags: ['Acoustic', 'LiveMusic', 'HumanMade', 'Guitar', 'AnalogStudio'],
    creator: {
      id: 'cr-1',
      name: 'Ali Raza & Acoustic Friends',
      handle: '@aliraza_live',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      subscribers: 420000,
      isVerified: true,
      isSubscribed: false
    }
  },
  {
    id: 'vid-2',
    title: 'Tokyo Midnight Rain Walk - Handheld Binaural 4K Sound (No Filters)',
    description: 'Walking through Shibuya and Shinjuku alleyways at 2 AM in light rain. Audio recorded with 3Dio Free Space binaural microphones. Pure raw human sensory experience.',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    duration: 46,
    views: 492000,
    likes: 38100,
    dislikes: 240,
    createdAt: '5 days ago',
    category: 'vlogs',
    type: 'video',
    isHumanVerified: true,
    humanVerificationNote: 'Human handheld camera walking 8km through rainy Tokyo',
    tags: ['Tokyo', 'RainWalk', 'Binaural', 'HumanFootage', 'TravelVlog'],
    creator: {
      id: 'cr-2',
      name: 'Kenji Nightwalker',
      handle: '@kenji_walks',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      subscribers: 810000,
      isVerified: true,
      isSubscribed: true
    }
  },
  {
    id: 'vid-3',
    title: 'Custom 65% Mechanical Keyboard Build & Typing Sound Test',
    description: 'Soldering bespoke Lubed Boba U4T switches on a solid brass plate. Complete hand-assembled process without automated manufacturing or synthetic sound overlays.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    duration: 15,
    views: 96300,
    likes: 8300,
    dislikes: 45,
    createdAt: '1 week ago',
    category: 'tech',
    type: 'video',
    isHumanVerified: true,
    humanVerificationNote: 'Hand-soldered brass keyboard build documented with continuous overhead camera',
    tags: ['Tech', 'MechanicalKeyboard', 'HandCrafted', 'ASMR', 'DeskSetup'],
    creator: {
      id: 'cr-3',
      name: 'Hamza Keebs',
      handle: '@hamzakeebs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      subscribers: 155000,
      isVerified: true,
      isSubscribed: false
    }
  },
  {
    id: 'vid-4',
    title: 'Traditional Handcrafted Neapolitan Sourdough Pizza in Wood Fired Oven',
    description: '72-hour natural fermentation dough shaped completely by hand. Sourced San Marzano tomatoes, fresh buffalo mozzarella, and firewood oven heated to 480°C.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
    duration: 12,
    views: 245000,
    likes: 21900,
    dislikes: 130,
    createdAt: '3 days ago',
    category: 'food',
    type: 'video',
    isHumanVerified: true,
    humanVerificationNote: 'Real kitchen cook session filmed by artisan chef Marco',
    tags: ['Cooking', 'ArtisanFood', 'Pizza', 'Sourdough', 'HumanTouch'],
    creator: {
      id: 'cr-4',
      name: 'Chef Marco Bellini',
      handle: '@marcobellini',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
      subscribers: 630000,
      isVerified: true,
      isSubscribed: false
    }
  },
  {
    id: 'vid-5',
    title: 'Downhill Mountain Biking Through Alpine Forest Singletrack',
    description: 'Raw chest-cam GoPro footage hammering through root gardens, rock drops, and steep berms in Whistler, British Columbia. 100% human muscle and mountain gravity.',
    videoUrl: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80',
    duration: 52,
    views: 182000,
    likes: 16500,
    dislikes: 88,
    createdAt: '4 days ago',
    category: 'sports',
    type: 'video',
    isHumanVerified: true,
    humanVerificationNote: 'Uncut GoPro Hero 11 Black chest mount single take',
    tags: ['MTB', 'Downhill', 'Whistler', 'HumanAdrenaline', 'ExtremeSports'],
    creator: {
      id: 'cr-5',
      name: 'Zain TrailRider',
      handle: '@zaintrails',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
      subscribers: 290000,
      isVerified: true,
      isSubscribed: true
    }
  },

  // --- Live Streams ---
  {
    id: 'live-1',
    title: '🔴 LIVE: Studio Acoustic Jam Session & Chat with Fans (Playing Your Requests)',
    description: 'We are hanging out in the Lahore studio playing acoustic covers and original songs. Drop your requests in the live chat right now! Verified human live musicians.',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    duration: 0,
    views: 45200,
    likes: 8900,
    dislikes: 23,
    createdAt: 'Started 34m ago',
    category: 'music',
    type: 'live',
    isLiveNow: true,
    liveViewers: 2840,
    isHumanVerified: true,
    humanVerificationNote: 'Broadcast live via Blackmagic ATEM Mini Pro with real analog instruments',
    tags: ['LiveStream', 'AcousticJam', 'LiveChat', 'DirectInteraction', 'HumanMusicians'],
    creator: {
      id: 'cr-1',
      name: 'Ali Raza & Acoustic Friends',
      handle: '@aliraza_live',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      subscribers: 420000,
      isVerified: true,
      isSubscribed: false
    }
  },
  {
    id: 'live-2',
    title: '🔴 LIVE: Street Coffee & Chill Community Chat in Downtown Cafe',
    description: 'Morning coffee roasting and live talk with everyone in the chat. Ask anything about brewing, gear, or daily life.',
    videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80',
    duration: 0,
    views: 22100,
    likes: 3400,
    dislikes: 12,
    createdAt: 'Started 18m ago',
    category: 'lifestyle',
    type: 'live',
    isLiveNow: true,
    liveViewers: 1420,
    isHumanVerified: true,
    humanVerificationNote: 'Live iPhone 15 Pro mobile rig stream with cellular bonding',
    tags: ['CoffeeLive', 'CommunityChat', 'RealHumans', 'MorningVibe'],
    creator: {
      id: 'cr-6',
      name: 'Sana Coffee & Conversations',
      handle: '@sanacoffee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      subscribers: 310000,
      isVerified: true,
      isSubscribed: false
    }
  },

  // --- Shorts ---
  {
    id: 'short-1',
    title: 'Clean Heelflip 7-Stair First Try! 🛹 Real Street Skateboarding',
    description: 'Battled this spot for 2 hours in raw heat. No CGI, no green screen, just pure dedication and pavement.',
    videoUrl: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1520045892732-304bc3ac5d8e?auto=format&fit=crop&w=800&q=80',
    duration: 15,
    views: 740000,
    likes: 68000,
    dislikes: 410,
    createdAt: '1 day ago',
    category: 'sports',
    type: 'short',
    isHumanVerified: true,
    humanVerificationNote: 'Filmed in public skatepark on VX1000 with real fisheye lens',
    tags: ['Shorts', 'Skateboarding', 'HumanAthletics', 'RealFootage'],
    creator: {
      id: 'cr-7',
      name: 'Bilal Skater',
      handle: '@bilalskate',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
      subscribers: 540000,
      isVerified: true,
      isSubscribed: true
    }
  },
  {
    id: 'short-2',
    title: 'Freehand Swan Latte Art in 20 Seconds! ☕',
    description: 'Steaming silky microfoam and pouring a triple wing swan. Handcrafted barista speedrun.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    duration: 12,
    views: 1200000,
    likes: 115000,
    dislikes: 850,
    createdAt: '2 days ago',
    category: 'food',
    type: 'short',
    isHumanVerified: true,
    humanVerificationNote: 'Shot in a specialty roastery in real time',
    tags: ['Shorts', 'LatteArt', 'CoffeeLover', 'BaristaSkills'],
    creator: {
      id: 'cr-6',
      name: 'Sana Coffee & Conversations',
      handle: '@sanacoffee',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      subscribers: 310000,
      isVerified: true,
      isSubscribed: false
    }
  },
  {
    id: 'short-3',
    title: 'Fingerstyle Acoustic Riff that will melt your mind 🎸',
    description: 'Written this morning in open DADGAD tuning. Just fingers against bronze strings.',
    videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    duration: 46,
    views: 890000,
    likes: 92000,
    dislikes: 310,
    createdAt: '3 days ago',
    category: 'music',
    type: 'short',
    isHumanVerified: true,
    humanVerificationNote: 'Authentic acoustic recording with Rode wireless go microphone',
    tags: ['Shorts', 'Fingerstyle', 'AcousticGuitar', 'OriginalTune'],
    creator: {
      id: 'cr-1',
      name: 'Ali Raza & Acoustic Friends',
      handle: '@aliraza_live',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      subscribers: 420000,
      isVerified: true,
      isSubscribed: false
    }
  },
  {
    id: 'short-4',
    title: 'Throwing a Massive Clay Vase on the Pottery Wheel 🏺',
    description: 'Centering 6kg of terracotta clay and opening it up in one single fluid motion.',
    videoUrl: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
    duration: 15,
    views: 630000,
    likes: 54000,
    dislikes: 180,
    createdAt: '4 days ago',
    category: 'lifestyle',
    type: 'short',
    isHumanVerified: true,
    humanVerificationNote: 'Filmed in pottery studio with zero synthetic simulation',
    tags: ['Shorts', 'Pottery', 'ClayArt', 'HandmadeCraft', 'Calm'],
    creator: {
      id: 'cr-8',
      name: 'Fatima Ceramics',
      handle: '@fatimaceramics',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      subscribers: 220000,
      isVerified: true,
      isSubscribed: false
    }
  }
];

export const INITIAL_COMMENTS: Record<string, VideoComment[]> = {
  'vid-1': [
    {
      id: 'comm-1',
      videoId: 'vid-1',
      author: 'Usman Tariq',
      handle: '@usman_tariq',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      content: 'Bhai kya zabardast awaz hai! Pure human talent, no autotune nonsense. Keep it up!',
      timestamp: '1 day ago',
      likes: 142,
      badge: 'VIP Member'
    },
    {
      id: 'comm-2',
      videoId: 'vid-1',
      author: 'Zara Khan',
      handle: '@zara_k',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      content: 'The acoustic guitar tone sounds so warm and natural. Authentic videos like this are rare now.',
      timestamp: '18 hours ago',
      likes: 89,
      badge: 'Human Verified'
    },
    {
      id: 'comm-3',
      videoId: 'vid-1',
      author: 'Hamza Keebs',
      handle: '@hamzakeebs',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      content: 'What mic pre-amp are you using bro? The low-end resonance is so clean!',
      timestamp: '12 hours ago',
      likes: 31
    }
  ],
  'vid-2': [
    {
      id: 'comm-4',
      videoId: 'vid-2',
      author: 'Dawood Ahmed',
      handle: '@dawood_dev',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
      content: 'Listening to this with headphones while coding at night is peak peace of mind.',
      timestamp: '2 days ago',
      likes: 320,
      badge: 'Human Verified'
    }
  ]
};

export const INITIAL_LIVE_CHAT: LiveChatMessage[] = [
  {
    id: 'lc-1',
    videoId: 'live-1',
    author: 'Khurram Shah',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
    message: 'Salam Ali bhai! Please play Coke Studio song Tu Jhoom next! 🔥',
    timestamp: 'Just now',
    badge: 'member'
  },
  {
    id: 'lc-2',
    videoId: 'live-1',
    author: 'Ayesha Malik',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
    message: 'The audio sync and guitar chords are so soothing! ❤️',
    timestamp: 'Just now',
    badge: 'verified'
  },
  {
    id: 'lc-3',
    videoId: 'live-1',
    author: 'Tariq Mehmood',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
    message: 'Super chat sending for tea & coffee for the band! Keep rocking 🎸☕',
    timestamp: 'Just now',
    badge: 'member',
    superChatAmount: 500,
    superChatColor: '#f59e0b'
  },
  {
    id: 'lc-4',
    videoId: 'live-1',
    author: 'Faizan Gamer',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80',
    message: 'TouTube live chat is so fast! Much better than other platforms 🙌',
    timestamp: 'Just now'
  },
  {
    id: 'lc-5',
    videoId: 'live-1',
    author: 'Zoya Lens',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
    message: 'Can you show the camera setup after this song? Amazing dynamic range.',
    timestamp: 'Just now',
    badge: 'mod'
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'ch-general',
    name: 'general-human-creators',
    type: 'public',
    description: 'Public chat for all human video creators & viewers to discuss and chill',
    onlineCount: 342,
    unreadCount: 0
  },
  {
    id: 'ch-feedback',
    name: 'video-feedback-lounge',
    type: 'public',
    description: 'Share your latest video or short and get honest feedback from real people',
    onlineCount: 189,
    unreadCount: 2
  },
  {
    id: 'ch-gear',
    name: 'camera-and-audio-gear',
    type: 'public',
    description: 'Cameras, lenses, mics, and lighting discussions for real production',
    onlineCount: 94,
    unreadCount: 0
  },
  {
    id: 'dm-aliraza',
    name: 'Ali Raza (Acoustic)',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
    unreadCount: 1
  },
  {
    id: 'dm-hamza',
    name: 'Hamza Keebs',
    type: 'direct',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80',
    unreadCount: 0
  }
];

export const INITIAL_COMMUNITY_MESSAGES: Record<string, CommunityMessage[]> = {
  'ch-general': [
    {
      id: 'cm-1',
      channelId: 'ch-general',
      sender: {
        id: 'user-ali',
        name: 'Ali Raza',
        handle: '@aliraza_live',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      },
      text: 'Salam dosto! Our live jam stream is starting in 15 minutes. Join in for some acoustic vibes!',
      timestamp: 'Today at 6:15 PM',
      sharedVideo: {
        id: 'live-1',
        title: '🔴 LIVE: Studio Acoustic Jam Session & Chat with Fans',
        thumbnailUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
        creatorName: 'Ali Raza & Acoustic Friends',
        duration: 'LIVE'
      },
      reactions: { '🔥': 14, '❤️': 22 }
    },
    {
      id: 'cm-2',
      channelId: 'ch-general',
      sender: {
        id: 'user-kenji',
        name: 'Kenji Nightwalker',
        handle: '@kenji_walks',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'
      },
      text: 'Just finished editing the Tokyo Rain footage! Pure real ambient audio recorded in 24-bit 96kHz.',
      timestamp: 'Today at 6:22 PM',
      reactions: { '👏': 9, '💯': 11 }
    },
    {
      id: 'cm-3',
      channelId: 'ch-general',
      sender: {
        id: 'user-sana',
        name: 'Sana Coffee',
        handle: '@sanacoffee',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80'
      },
      text: 'Love the non-AI focus here. It feels like early YouTube where you could connect with actual creators and talk in chat without bots!',
      timestamp: 'Today at 6:28 PM',
      reactions: { '💯': 31, '❤️': 18 }
    }
  ],
  'dm-aliraza': [
    {
      id: 'dm-msg-1',
      channelId: 'dm-aliraza',
      sender: {
        id: 'user-ali',
        name: 'Ali Raza',
        handle: '@aliraza_live',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'
      },
      text: 'Yar bro! Thanks for tuning into the stream. Let me know if you want to collaborate on the next acoustic session!',
      timestamp: '5:40 PM'
    }
  ]
};

export const CURRENT_USER = {
  id: 'current-user',
  name: 'Anaiza',
  handle: '@anaiza_creator',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'Human content creator & passionate storyteller. Authentic videos only 🌱',
  subscribers: 1240,
  joinedDate: 'Joined Oct 2026'
};
