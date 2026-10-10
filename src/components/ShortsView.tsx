import React, { useState, useRef, useEffect } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import { Video } from '../types';
import {
  Heart,
  ThumbsDown,
  MessageSquare,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ShieldCheck,
  Music2,
  Send,
  X,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ShortsView: React.FC = () => {
  const {
    videos,
    toggleLikeVideo,
    toggleDislikeVideo,
    toggleSubscribeChannel,
    comments,
    addComment,
    likeComment,
    currentUser
  } = useTouTube();

  const shorts = videos.filter((v) => v.type === 'short');
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentShort = shorts[currentIndex] || shorts[0];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);
  const [shortCommentInput, setShortCommentInput] = useState('');
  const [copiedToast, setCopiedToast] = useState(false);

  // Keyboard navigation for Shorts (Arrow Up / Arrow Down)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCommentDrawerOpen) return;
      if (e.key === 'ArrowDown' || e.key === 'j') {
        goToNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        goToPrev();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm') {
        toggleMute();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isCommentDrawerOpen, isPlaying, isMuted, shorts.length]);

  // Handle video playback when switching shorts
  useEffect(() => {
    if (videoRef.current && currentShort) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      });
    }
  }, [currentIndex, currentShort?.id]);

  const goToNext = () => {
    if (currentIndex < shorts.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

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

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleLike = () => {
    if (!currentShort) return;
    toggleLikeVideo(currentShort.id);
    if (!currentShort.isLiked) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleAddShortComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (shortCommentInput.trim() && currentShort) {
      addComment(currentShort.id, shortCommentInput);
      setShortCommentInput('');
    }
  };

  if (!currentShort) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-zinc-400">
        No shorts available right now. Post your first human short!
      </div>
    );
  }

  const shortComments = comments[currentShort.id] || [];

  const FALLBACK_SHORT_URL = 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4';
  const [activeShortSource, setActiveShortSource] = useState(currentShort?.videoUrl || FALLBACK_SHORT_URL);

  useEffect(() => {
    setActiveShortSource(currentShort?.videoUrl || FALLBACK_SHORT_URL);
  }, [currentShort?.id, currentShort?.videoUrl]);

  const handleShortVideoError = () => {
    if (activeShortSource !== FALLBACK_SHORT_URL) {
      console.warn('Short source failed, falling back:', activeShortSource);
      setActiveShortSource(FALLBACK_SHORT_URL);
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }
  };

  return (
    <div className="flex items-center justify-center py-4 px-2 select-none relative min-h-[calc(100vh-100px)]">
      {/* Toast */}
      {copiedToast && (
        <div className="fixed top-18 z-50 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-xl animate-in fade-in slide-in-from-top duration-200">
          Short link copied to clipboard!
        </div>
      )}

      {/* Main Shorts Frame */}
      <div className="relative flex items-end sm:items-center gap-4 max-w-md w-full mx-auto">
        {/* Video Vertical Container (9:16 aspect ratio) */}
        <div className="relative w-full aspect-[9/16] max-h-[82vh] rounded-3xl overflow-hidden bg-black shadow-2xl border border-zinc-200 dark:border-zinc-800/80">
          <video
            ref={videoRef}
            key={activeShortSource}
            onClick={togglePlay}
            onError={handleShortVideoError}
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover cursor-pointer"
          >
            <source src={activeShortSource} type="video/mp4" />
            <source src={FALLBACK_SHORT_URL} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>

          {/* Pause overlay icon */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            </div>
          )}

          {/* Top Controls: Sound toggle & Human Verified badge */}
          <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10 pointer-events-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Human Verified Short</span>
            </div>

            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 pb-5 z-10 text-white space-y-2 pointer-events-auto">
            {/* Creator info & Subscribe button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentShort.creator.avatar}
                  alt={currentShort.creator.name}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-sm leading-none">{currentShort.creator.name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-300" />
                  </div>
                  <span className="text-[11px] text-zinc-300">{currentShort.creator.handle}</span>
                </div>
              </div>

              <button
                onClick={() => toggleSubscribeChannel(currentShort.creator.id)}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  currentShort.creator.isSubscribed
                    ? 'bg-white/20 text-white'
                    : 'bg-rose-600 hover:bg-rose-700 text-white shadow-md'
                }`}
              >
                {currentShort.creator.isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            {/* Title / Description */}
            <p className="text-xs sm:text-sm font-medium line-clamp-2 leading-relaxed">
              {currentShort.title}
            </p>

            {/* Audio / Music tag */}
            <div className="flex items-center gap-2 text-xs text-zinc-300 pt-1">
              <Music2 className="w-3.5 h-3.5 animate-spin duration-3000" />
              <span className="truncate">Original Human Audio • {currentShort.creator.name}</span>
            </div>
          </div>
        </div>

        {/* Vertical Action Rail (Right side) */}
        <div className="flex flex-col items-center gap-4 pb-3">
          {/* Like */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                currentShort.isLiked
                  ? 'bg-rose-600 text-white scale-110 shadow-lg shadow-rose-600/40'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <Heart className={`w-5 h-5 ${currentShort.isLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              {currentShort.likes.toLocaleString()}
            </span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => toggleDislikeVideo(currentShort.id)}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
                currentShort.isDisliked
                  ? 'bg-zinc-800 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              <ThumbsDown className={`w-5 h-5 ${currentShort.isDisliked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[11px] font-semibold text-zinc-500">Dislike</span>
          </button>

          {/* Comments */}
          <button
            onClick={() => setIsCommentDrawerOpen(true)}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
              {shortComments.length}
            </span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center transition-all">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Share</span>
          </button>

          {/* Next / Prev Navigation Arrows */}
          <div className="pt-2 flex flex-col gap-1.5">
            <button
              onClick={goToPrev}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              title="Previous Short (Up arrow)"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={goToNext}
              disabled={currentIndex === shorts.length - 1}
              className="p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              title="Next Short (Down arrow)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Comments Drawer for Shorts */}
      {isCommentDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md h-full bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Comments ({shortComments.length})
                </h4>
              </div>
              <button
                onClick={() => setIsCommentDrawerOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {shortComments.length === 0 ? (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  No comments yet. Be the first human to share your thoughts!
                </div>
              ) : (
                shortComments.map((comm) => (
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
                          <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-500/10 text-emerald-500 font-semibold">
                            {comm.badge}
                          </span>
                        )}
                        <span className="text-[10px] text-zinc-400">{comm.timestamp}</span>
                      </div>
                      <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{comm.content}</p>
                      <button
                        onClick={() => likeComment(currentShort.id, comm.id)}
                        className={`flex items-center gap-1 text-zinc-500 hover:text-rose-500 transition-colors pt-0.5 ${
                          comm.isLiked ? 'text-rose-600 font-bold' : ''
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${comm.isLiked ? 'fill-current' : ''}`} />
                        <span>{comm.likes}</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment */}
            <form
              onSubmit={handleAddShortComment}
              className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex items-center gap-2"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover"
              />
              <input
                type="text"
                value={shortCommentInput}
                onChange={(e) => setShortCommentInput(e.target.value)}
                placeholder="Add a comment to this short..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!shortCommentInput.trim()}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
