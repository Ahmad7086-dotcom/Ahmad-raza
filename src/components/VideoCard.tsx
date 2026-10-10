import React from 'react';
import { Video } from '../types';
import { useTouTube } from '../context/TouTubeContext';
import { ShieldCheck, Radio, CheckCircle2, Bookmark, Share2, MessageCircle } from 'lucide-react';

interface VideoCardProps {
  video: Video;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const { setCurrentWatchingVideo, toggleSaveVideo, setActiveTab, sendCommunityMessage } = useTouTube();

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShareToChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    sendCommunityMessage('ch-general', `Check out this human video: "${video.title}"`, video);
    setActiveTab('chat');
  };

  return (
    <div
      onClick={() => setCurrentWatchingVideo(video)}
      className="group flex flex-col cursor-pointer transition-all rounded-2xl overflow-hidden hover:translate-y-[-2px]"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/60 shadow-sm">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Video Type / Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5">
          {video.type === 'live' || video.isLiveNow ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-600 text-white shadow-md">
              <Radio className="w-3 h-3 animate-live-pulse" />
              LIVE
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-black/80 text-white backdrop-blur-xs">
              {formatDuration(video.duration)}
            </span>
          )}
        </div>

        {/* Human Authenticity Stamp */}
        {video.isHumanVerified && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-950/80 text-emerald-400 border border-emerald-500/30 backdrop-blur-xs shadow-sm">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Human Made</span>
          </div>
        )}

        {/* Quick hover action bar */}
        <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/70 backdrop-blur-xs p-1 rounded-xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveVideo(video.id);
            }}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            title={video.isSaved ? 'Saved to library' : 'Save to library'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${video.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
          <button
            onClick={handleShareToChat}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
            title="Share to Community Chat"
          >
            <MessageCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex gap-3 pt-3 px-1">
        <img
          src={video.creator.avatar}
          alt={video.creator.name}
          className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-zinc-200 dark:border-zinc-800"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-snug text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
            {video.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="truncate hover:text-zinc-700 dark:hover:text-zinc-300 font-medium">{video.creator.name}</span>
            {video.creator.isVerified && (
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            {video.type === 'live' ? (
              <span className="text-rose-500 font-semibold">{video.liveViewers?.toLocaleString() || '1.4K'} watching</span>
            ) : (
              <span>{formatViews(video.views)} views</span>
            )}
            <span>•</span>
            <span>{video.createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
