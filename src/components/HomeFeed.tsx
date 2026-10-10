import React from 'react';
import { useTouTube } from '../context/TouTubeContext';
import { VideoCard } from './VideoCard';
import {
  ShieldCheck,
  Flame,
  Radio,
  Search,
  Sparkles,
  Upload,
  Layers,
  Heart
} from 'lucide-react';

export const HomeFeed: React.FC = () => {
  const {
    videos,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsUploadModalOpen,
    setActiveTab
  } = useTouTube();

  const categories = [
    { id: 'all', label: 'All Human Videos' },
    { id: 'verified', label: '🌱 100% Verified Non-AI' },
    { id: 'shorts', label: 'Shorts' },
    { id: 'live', label: '🔴 Live Streams' },
    { id: 'music', label: 'Music & Jam' },
    { id: 'vlogs', label: 'Vlogs & Walks' },
    { id: 'tech', label: 'Tech & Builds' },
    { id: 'sports', label: 'Sports & Skate' },
    { id: 'food', label: 'Food & Cooking' }
  ];

  // Filtering
  const filteredVideos = videos.filter((v) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = v.title.toLowerCase().includes(q);
      const matchDesc = v.description.toLowerCase().includes(q);
      const matchCreator = v.creator.name.toLowerCase().includes(q);
      const matchTags = v.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCreator && !matchTags) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory === 'verified') {
      return v.isHumanVerified;
    }
    if (selectedCategory === 'shorts') {
      return v.type === 'short';
    }
    if (selectedCategory === 'live') {
      return v.type === 'live' || v.isLiveNow;
    }
    if (selectedCategory !== 'all') {
      return v.category === selectedCategory;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Featured TouTube Human Community Banner (when on 'all' and no search) */}
      {!searchQuery && selectedCategory === 'all' && (
        <div className="relative rounded-3xl overflow-hidden p-5 sm:p-7 bg-gradient-to-r from-rose-950/60 via-zinc-900/80 to-zinc-950 border border-rose-500/20 text-white shadow-xl">
          <div className="max-w-2xl space-y-2.5 relative z-10">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Authentic Video Platform</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black leading-tight">
              Watch Genuine Human Videos, Shorts & Connect in Real-Time Live Chat
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              No AI generated avatars or synthetic scripts. Pure human creativity, raw sound, and authentic live conversations.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-transform active:scale-95"
              >
                Post Your Video
              </button>
              <button
                onClick={() => setActiveTab('live')}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
              >
                Join Live Streams
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Search / Filter Indicator */}
      {searchQuery && (
        <div className="flex items-center justify-between text-xs text-zinc-500 pb-1">
          <span>
            Showing results for <strong className="text-zinc-900 dark:text-white">"{searchQuery}"</strong> ({filteredVideos.length} videos found)
          </span>
          <button
            onClick={() => setSearchQuery('')}
            className="text-rose-500 hover:underline font-semibold"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-20 space-y-3 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 p-8">
          <Search className="w-10 h-10 text-zinc-400 mx-auto" />
          <h3 className="font-bold text-sm text-zinc-900 dark:text-white">No videos matched your filter</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Try a different search term or upload the first video in this category!
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-6 sm:gap-y-8">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
