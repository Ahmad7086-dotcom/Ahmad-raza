import React, { useState, useRef, useEffect } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import { Video } from '../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  ShieldCheck,
  CheckCircle2,
  Bell,
  MessageSquare,
  DollarSign,
  Send,
  Sparkles,
  Flame,
  Heart,
  Radio,
  X,
  RotateCcw,
  Settings,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WatchViewProps {
  video: Video;
  onBack: () => void;
}

export const WatchView: React.FC<WatchViewProps> = ({ video, onBack }) => {
  const {
    videos,
    toggleLikeVideo,
    toggleDislikeVideo,
    toggleSaveVideo,
    toggleSubscribeChannel,
    comments,
    addComment,
    likeComment,
    liveChatMessages,
    sendLiveChatMessage,
    setCurrentWatchingVideo,
    sendCommunityMessage,
    setActiveTab,
    floatingReactions,
    triggerLiveReaction
  } = useTouTube();

  // Video player controls state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isTheater, setIsTheater] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Tab between Comments and Live Chat
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'comments'>(
    video.type === 'live' || video.isLiveNow ? 'chat' : 'comments'
  );

  // Input states
  const [commentInput, setCommentInput] = useState('');
  const [liveChatInput, setLiveChatInput] = useState('');
  const [isSuperChatModalOpen, setIsSuperChatModalOpen] = useState(false);
  const [superChatAmount, setSuperChatAmount] = useState(500);
  const [superChatMessage, setSuperChatMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const videoComments = comments[video.id] || [];
  const relatedVideos = videos.filter((v) => v.id !== video.id).slice(0, 8);

  const isLive = video.type === 'live' || video.isLiveNow;

  // Auto-play video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        // Autoplay policy might require muted
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
    }
  }, [video.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && volume === 0) {
      setVolume(0.8);
      videoRef.current.volume = 0.8;
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const toggleFullscreen = () => {
    const container = document.getElementById('video-player-container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim()) {
      addComment(video.id, commentInput);
      setCommentInput('');
    }
  };

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveChatInput.trim()) {
      sendLiveChatMessage(video.id, liveChatInput);
      setLiveChatInput('');
    }
  };

  const handleSendSuperChat = () => {
    if (superChatMessage.trim() || superChatAmount > 0) {
      sendLiveChatMessage(
        video.id,
        superChatMessage || `Super Chat of Rs. ${superChatAmount}! Keep creating authentic videos! 🎉`,
        superChatAmount
      );
      setIsSuperChatModalOpen(false);
      setSuperChatMessage('');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem.toString().padStart(2, '0')}`;
  };

  const FALLBACK_URL = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4';
  const [activeSource, setActiveSource] = useState(video.videoUrl || FALLBACK_URL);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    setActiveSource(video.videoUrl || FALLBACK_URL);
    setHasVideoError(false);
  }, [video.id, video.videoUrl]);

  const handleVideoError = () => {
    if (activeSource !== FALLBACK_URL) {
      console.warn('Video source failed, switching to verified fallback URL:', activeSource);
      setActiveSource(FALLBACK_URL);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    } else {
      setHasVideoError(true);
    }
  };

  return (
    <div className="max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-4 animate-in fade-in duration-200">
      {/* Back button */}
      <div className="mb-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Feed</span>
        </button>
      </div>

      <div className={`grid grid-cols-1 ${isTheater ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
        {/* Left Column: Video Player, Details, Comments */}
        <div className={`${isTheater ? 'lg:col-span-1' : 'lg:col-span-2'} space-y-4`}>
          {/* Custom Video Player Container */}
          <div
            id="video-player-container"
            className="relative group aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-zinc-200/50 dark:border-zinc-800/80"
          >
            <video
              ref={videoRef}
              key={activeSource}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              onError={handleVideoError}
              className="w-full h-full object-contain cursor-pointer"
              playsInline
              loop={isLive}
              preload="auto"
            >
              <source src={activeSource} type="video/mp4" />
              <source src={FALLBACK_URL} type="video/mp4" />
              Your browser does not support HTML5 video.
            </video>

            {/* Floating Live Reactions Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {floatingReactions.map((r) => (
                <div
                  key={r.id}
                  style={{ left: `${r.left}%`, bottom: '20%' }}
                  className="absolute text-3xl animate-float-reaction drop-shadow-md select-none"
                >
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Center Big Play/Pause Indicator on click */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-xs cursor-pointer z-10"
              >
                <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl transform scale-100 hover:scale-110 transition-transform">
                  <Play className="w-7 h-7 fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Live Indicator overlay on top left */}
            {isLive && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 backdrop-blur-md text-white text-xs font-bold shadow-lg">
                <Radio className="w-3.5 h-3.5 animate-live-pulse" />
                <span>LIVE STREAM</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>{video.liveViewers?.toLocaleString() || '2.8K'} watching</span>
              </div>
            )}

            {/* Bottom Controls Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 pt-10 opacity-0 group-hover:opacity-100 transition-opacity z-20">
              {/* Scrubber Timeline */}
              {!isLive && (
                <div className="relative mb-2">
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-rose-600 hover:h-2.5 transition-all"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-white text-xs">
                {/* Left controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-1 hover:text-rose-500 transition-colors focus:outline-none"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                  </button>

                  <div className="flex items-center gap-1.5 group/vol">
                    <button onClick={toggleMute} className="p-1 hover:text-rose-500 transition-colors">
                      {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>

                  <span className="text-zinc-300 font-mono text-[11px]">
                    {formatTime(currentTime)} / {isLive ? 'LIVE' : formatTime(duration)}
                  </span>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3">
                  {/* Speed toggle */}
                  <div className="flex items-center gap-1">
                    {[1, 1.5, 2].map((s) => (
                      <button
                        key={s}
                        onClick={() => changeSpeed(s)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          playbackSpeed === s ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* Theater mode */}
                  <button
                    onClick={() => setIsTheater(!isTheater)}
                    className="p-1 hover:text-rose-500 transition-colors"
                    title="Theater mode"
                  >
                    <div className="w-4 h-3 border border-current rounded-xs"></div>
                  </button>

                  {/* Fullscreen */}
                  <button
                    onClick={toggleFullscreen}
                    className="p-1 hover:text-rose-500 transition-colors"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title & Non-AI Badge */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-snug">
              {video.title}
            </h1>

            {/* Non-AI Human Guarantee Banner */}
            {video.isHumanVerified && (
              <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-bold">100% Human-Created Video</span>
                    <span className="hidden sm:inline text-zinc-600 dark:text-zinc-400 text-[11px] ml-1.5">
                      • {video.humanVerificationNote || 'Captured with authentic lens and analog microphones. No generative AI.'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                  VERIFIED HUMAN
                </span>
              </div>
            )}
          </div>

          {/* Channel Bar & Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <img
                src={video.creator.avatar}
                alt={video.creator.name}
                className="w-11 h-11 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{video.creator.name}</span>
                  {video.creator.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400" />}
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {video.creator.subscribers.toLocaleString()} subscribers
                </span>
              </div>

              {/* Subscribe button */}
              <button
                onClick={() => toggleSubscribeChannel(video.creator.id)}
                className={`ml-2 px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                  video.creator.isSubscribed
                    ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/30'
                }`}
              >
                {video.creator.isSubscribed ? (
                  <>
                    <Bell className="w-3.5 h-3.5 fill-current" />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>

            {/* Action Buttons: Like, Dislike, Share, Save */}
            <div className="flex items-center gap-2 text-xs">
              {/* Like / Dislike Capsule */}
              <div className="flex items-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <button
                  onClick={() => toggleLikeVideo(video.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors font-semibold ${
                    video.isLiked ? 'text-rose-600 dark:text-rose-400' : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <ThumbsUp className={`w-4 h-4 ${video.isLiked ? 'fill-current' : ''}`} />
                  <span>{video.likes.toLocaleString()}</span>
                </button>
                <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700"></div>
                <button
                  onClick={() => toggleDislikeVideo(video.id)}
                  className={`px-2.5 py-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors ${
                    video.isDisliked ? 'text-zinc-900 dark:text-white' : 'text-zinc-500'
                  }`}
                >
                  <ThumbsDown className={`w-4 h-4 ${video.isDisliked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Share button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              {/* Save / Bookmark */}
              <button
                onClick={() => toggleSaveVideo(video.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 font-semibold transition-colors ${
                  video.isSaved
                    ? 'text-rose-600 dark:text-rose-400'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${video.isSaved ? 'fill-current' : ''}`} />
                <span>Save</span>
              </button>

              {/* Share to TouTube Community Chat */}
              <button
                onClick={() => {
                  sendCommunityMessage('ch-general', `Discussing "${video.title}"! Join the discussion!`, video);
                  setActiveTab('chat');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                title="Send to Community Chat"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Discuss in Chat</span>
              </button>
            </div>
          </div>

          {/* Description Box */}
          <div className="p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-zinc-800 dark:text-zinc-200 mb-1">
              <span>{video.views.toLocaleString()} views</span>
              <span>•</span>
              <span>{video.createdAt}</span>
              <span>•</span>
              <span className="text-rose-600 dark:text-rose-400 uppercase font-semibold">#{video.category}</span>
            </div>

            <p className={`text-zinc-700 dark:text-zinc-300 leading-relaxed ${isDescExpanded ? '' : 'line-clamp-2'}`}>
              {video.description}
            </p>

            {isDescExpanded && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {video.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-medium text-[11px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                {video.humanVerificationNote && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-mono">
                    Production note: {video.humanVerificationNote}
                  </p>
                )}
              </div>
            )}

            <button
              onClick={() => setIsDescExpanded(!isDescExpanded)}
              className="mt-2 font-semibold text-zinc-900 dark:text-zinc-100 hover:underline"
            >
              {isDescExpanded ? 'Show less' : '...more'}
            </button>
          </div>

          {/* Comments Section (under video on mobile or standard view) */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                {videoComments.length} Comments
              </h3>
              <span className="text-xs text-zinc-500">Sorted by Top Human Comments</span>
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleSendComment} className="flex gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Your Avatar"
                className="w-9 h-9 rounded-full object-cover shrink-0"
              />
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add a comment... (Be respectful, genuine feedback only)"
                  className="w-full pb-1 text-xs sm:text-sm bg-transparent border-b border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500 transition-colors"
                />
                {commentInput && (
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setCommentInput('')}
                      className="px-3 py-1 text-xs rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1 text-xs font-semibold rounded-full bg-rose-600 hover:bg-rose-700 text-white"
                    >
                      Comment
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-4 pt-2">
              {videoComments.map((comm) => (
                <div key={comm.id} className="flex gap-3 text-xs">
                  <img
                    src={comm.avatar}
                    alt={comm.author}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">{comm.author}</span>
                      {comm.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                          {comm.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-400">{comm.timestamp}</span>
                    </div>

                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{comm.content}</p>

                    <div className="flex items-center gap-3 pt-0.5 text-zinc-500 dark:text-zinc-400">
                      <button
                        onClick={() => likeComment(video.id, comm.id)}
                        className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                          comm.isLiked ? 'text-rose-600 font-bold' : ''
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${comm.isLiked ? 'fill-current' : ''}`} />
                        <span>{comm.likes}</span>
                      </button>
                      <button className="hover:text-zinc-900 dark:hover:text-zinc-200">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Chat Panel & Up Next Videos */}
        <div className="space-y-6">
          {/* Live Chat Panel (Always prominent if Live, or switchable) */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 overflow-hidden shadow-lg flex flex-col h-[520px]">
            {/* Live Chat Header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  {isLive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                  )}
                </div>
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {isLive ? 'Top Live Chat' : 'Interactive Live Replay'}
                </h4>
              </div>

              <div className="flex items-center gap-1">
                {isLive && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20">
                    REAL-TIME
                  </span>
                )}
                {/* Super Chat CTA */}
                <button
                  onClick={() => setIsSuperChatModalOpen(true)}
                  className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 transition-colors"
                  title="Send Super Chat Donation"
                >
                  <DollarSign className="w-4 h-4 font-extrabold" />
                </button>
              </div>
            </div>

            {/* Quick Floating Reaction Bar */}
            <div className="px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-950/40 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between text-sm">
              <span className="text-[11px] text-zinc-400 font-medium">Quick React:</span>
              <div className="flex items-center gap-2">
                {['🔥', '❤️', '👏', '🎉', '💯'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => triggerLiveReaction(emoji)}
                    className="hover:scale-130 active:scale-95 transition-transform cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Chat Messages Stream */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs divide-y divide-zinc-100 dark:divide-zinc-800/40">
              {liveChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`pt-2 first:pt-0 ${
                    msg.superChatAmount
                      ? 'p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-transparent border border-amber-500/40 my-1 shadow-sm'
                      : ''
                  }`}
                >
                  {msg.superChatAmount && (
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-500/30 text-amber-500 font-bold text-xs">
                      <span>⚡ Super Chat</span>
                      <span>Rs. {msg.superChatAmount}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <img
                      src={msg.avatar}
                      alt={msg.author}
                      className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 leading-relaxed">
                      <span className="font-semibold text-zinc-600 dark:text-zinc-400 mr-1.5">
                        {msg.author}
                      </span>
                      {msg.badge === 'mod' && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-blue-500/20 text-blue-400 font-bold mr-1">
                          MOD
                        </span>
                      )}
                      {msg.badge === 'member' && (
                        <span className="text-[9px] uppercase px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold mr-1">
                          VIP
                        </span>
                      )}
                      <span className={`text-zinc-900 dark:text-zinc-100 ${msg.superChatAmount ? 'font-semibold' : ''}`}>
                        {msg.message}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Chat Input */}
            <form
              onSubmit={handleSendLiveChat}
              className="p-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={liveChatInput}
                onChange={(e) => setLiveChatInput(e.target.value)}
                placeholder="Chat live with other human viewers..."
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-500"
              />
              <button
                type="button"
                onClick={() => setIsSuperChatModalOpen(true)}
                className="p-2 rounded-xl text-amber-500 hover:bg-amber-500/10 transition-colors"
                title="Super Chat"
              >
                <DollarSign className="w-4 h-4 font-bold" />
              </button>
              <button
                type="submit"
                disabled={!liveChatInput.trim()}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Super Chat Modal */}
          {isSuperChatModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-500 font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>Send Super Chat</span>
                  </div>
                  <button
                    onClick={() => setIsSuperChatModalOpen(false)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Support {video.creator.name} directly! Your message will be highlighted with glowing gold in the live chat.
                </p>

                {/* Amount presets */}
                <div className="grid grid-cols-4 gap-2">
                  {[200, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSuperChatAmount(amt)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        superChatAmount === amt
                          ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                          : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      Rs. {amt}
                    </button>
                  ))}
                </div>

                <textarea
                  value={superChatMessage}
                  onChange={(e) => setSuperChatMessage(e.target.value)}
                  placeholder="Your highlighted message to the creator..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsSuperChatModalOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendSuperChat}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/30"
                  >
                    Send Rs. {superChatAmount}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Up Next / Related Videos */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Related Human Videos</h4>
            <div className="space-y-2.5">
              {relatedVideos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setCurrentWatchingVideo(item);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex gap-2.5 cursor-pointer group p-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <div className="relative aspect-video w-36 rounded-xl overflow-hidden bg-zinc-900 shrink-0">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 text-[10px] font-semibold px-1 py-0.2 rounded bg-black/80 text-white">
                      {item.type === 'live' ? 'LIVE' : `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}`}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-rose-500 transition-colors leading-snug">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                      {item.creator.name}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {item.views.toLocaleString()} views • {item.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
