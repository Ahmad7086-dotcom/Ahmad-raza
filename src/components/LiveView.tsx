import React, { useState } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import { Video } from '../types';
import {
  Radio,
  Users,
  MessageSquare,
  Send,
  DollarSign,
  Sparkles,
  Flame,
  Heart,
  Video as VideoIcon,
  ShieldCheck,
  CheckCircle2,
  Tv,
  Volume2,
  VolumeX
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const LiveView: React.FC = () => {
  const {
    videos,
    setCurrentWatchingVideo,
    liveChatMessages,
    sendLiveChatMessage,
    floatingReactions,
    triggerLiveReaction,
    currentUser,
    addNewVideo
  } = useTouTube();

  const liveVideos = videos.filter((v) => v.type === 'live' || v.isLiveNow);
  const [selectedLive, setSelectedLive] = useState<Video>(liveVideos[0] || videos[0]);
  const [liveMsgInput, setLiveMsgInput] = useState('');
  const [isSuperChatOpen, setIsSuperChatOpen] = useState(false);
  const [superAmt, setSuperAmt] = useState(500);
  const [superMsg, setSuperMsg] = useState('');
  const [isMuted, setIsMuted] = useState(true);

  // Go live announcement modal
  const [isGoLiveModalOpen, setIsGoLiveModalOpen] = useState(false);
  const [liveTitle, setLiveTitle] = useState('');
  const [liveCategory, setLiveCategory] = useState<'music' | 'gaming' | 'tech' | 'lifestyle'>('lifestyle');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (liveMsgInput.trim()) {
      sendLiveChatMessage(selectedLive.id, liveMsgInput);
      setLiveMsgInput('');
    }
  };

  const handleSendSuper = () => {
    sendLiveChatMessage(selectedLive.id, superMsg || `Super Chat of Rs. ${superAmt}! Keep it real!`, superAmt);
    setIsSuperChatOpen(false);
    setSuperMsg('');
  };

  const handleStartLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;

    addNewVideo({
      title: `🔴 LIVE: ${liveTitle}`,
      description: 'Human live stream with real-time direct chat and questions.',
      videoUrl: 'https://vjs.zencdn.net/v/oceans.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
      duration: 0,
      category: liveCategory,
      type: 'live',
      isLiveNow: true,
      liveViewers: 142,
      isHumanVerified: true,
      humanVerificationNote: 'Self-hosted live human broadcast',
      tags: ['LiveStream', 'TouTubeLive', 'HumanCreators', 'RealTalk'],
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        subscribers: currentUser.subscribers,
        isVerified: true,
        isSubscribed: false
      }
    });

    setIsGoLiveModalOpen(false);
    setLiveTitle('');
  };

  const FALLBACK_LIVE_URL = 'https://vjs.zencdn.net/v/oceans.mp4';
  const [activeLiveSource, setActiveLiveSource] = useState(selectedLive?.videoUrl || FALLBACK_LIVE_URL);

  React.useEffect(() => {
    setActiveLiveSource(selectedLive?.videoUrl || FALLBACK_LIVE_URL);
  }, [selectedLive?.id, selectedLive?.videoUrl]);

  const handleLiveVideoError = () => {
    if (activeLiveSource !== FALLBACK_LIVE_URL) {
      console.warn('Live stream source failed, falling back:', activeLiveSource);
      setActiveLiveSource(FALLBACK_LIVE_URL);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Live Hub Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-rose-950/40 via-zinc-900/60 to-zinc-900/40 border border-rose-500/20 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-4 h-4 animate-live-pulse" />
            <span>TouTube Live Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
            Real Humans Broadcasting Live
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-xl">
            Watch genuine musicians, travelers, and artisans streaming with zero AI synthetic delay. Chat directly in real-time.
          </p>
        </div>

        <button
          onClick={() => setIsGoLiveModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-all hover:scale-102"
        >
          <VideoIcon className="w-4 h-4" />
          <span>Go Live Now</span>
        </button>
      </div>

      {/* Main Live Stream Player & Side-by-side Live Chat */}
      {selectedLive && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Stream */}
          <div className="lg:col-span-2 space-y-3">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-xl border border-zinc-200 dark:border-zinc-800">
              <video
                key={activeLiveSource}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                onError={handleLiveVideoError}
                className="w-full h-full object-cover"
              >
                <source src={activeLiveSource} type="video/mp4" />
                <source src={FALLBACK_LIVE_URL} type="video/mp4" />
                Your browser does not support HTML5 video.
              </video>

              {/* Floating Live Reactions Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                {floatingReactions.map((r) => (
                  <div
                    key={r.id}
                    style={{ left: `${r.left}%`, bottom: '15%' }}
                    className="absolute text-3xl animate-float-reaction drop-shadow-md select-none"
                  >
                    {r.emoji}
                  </div>
                ))}
              </div>

              {/* Live Overlay Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-rose-600/90 text-white text-xs font-bold shadow-md">
                <Radio className="w-3.5 h-3.5 animate-live-pulse" />
                <span>LIVE</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>{selectedLive.liveViewers?.toLocaleString() || '2.8K'} watching</span>
              </div>

              {/* Audio mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Verified badge */}
              <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Human Broadcast • Uncut Audio</span>
              </div>
            </div>

            {/* Stream Title and Creator */}
            <div className="flex items-start justify-between gap-4 pt-1">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-zinc-900 dark:text-zinc-100 leading-snug">
                  {selectedLive.title}
                </h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <img
                    src={selectedLive.creator.avatar}
                    alt={selectedLive.creator.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <span className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">
                    {selectedLive.creator.name}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {selectedLive.creator.subscribers.toLocaleString()} subscribers
                  </span>
                </div>
              </div>

              <button
                onClick={() => setCurrentWatchingVideo(selectedLive)}
                className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
              >
                Open Full Theater
              </button>
            </div>
          </div>

          {/* Interactive Live Chat */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xl flex flex-col h-[500px]">
            {/* Header */}
            <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Live Chat Stream</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">
                  ACTIVE
                </span>
              </div>

              <button
                onClick={() => setIsSuperChatOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-bold transition-colors"
                title="Super Chat Support"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Super Chat</span>
              </button>
            </div>

            {/* Quick floating reaction triggers */}
            <div className="px-3 py-1.5 bg-zinc-100/50 dark:bg-zinc-950/40 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">React Live:</span>
              <div className="flex items-center gap-2 text-base">
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

            {/* Live Chat Messages list */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2 text-xs divide-y divide-zinc-100 dark:divide-zinc-800/30">
              {liveChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`pt-2 first:pt-0 ${
                    msg.superChatAmount
                      ? 'p-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/10 border border-amber-500/40 shadow-xs'
                      : ''
                  }`}
                >
                  {msg.superChatAmount && (
                    <div className="flex items-center justify-between font-bold text-amber-500 pb-1 mb-1 border-b border-amber-500/30 text-xs">
                      <span>⚡ SUPER CHAT</span>
                      <span>Rs. {msg.superChatAmount}</span>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <img
                      src={msg.avatar}
                      alt={msg.author}
                      className="w-5 h-5 rounded-full object-cover mt-0.5 shrink-0"
                    />
                    <div className="flex-1 leading-snug">
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
                      <span className="text-zinc-900 dark:text-zinc-100">{msg.message}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendChat}
              className="p-2.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={liveMsgInput}
                onChange={(e) => setLiveMsgInput(e.target.value)}
                placeholder="Say something in live chat..."
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={!liveMsgInput.trim()}
                className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* All Active Live Streams */}
      <div className="pt-4 space-y-3">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Tv className="w-4 h-4 text-rose-500" />
          <span>More Live Human Broadcasts</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveVideos.map((lVid) => (
            <div
              key={lVid.id}
              onClick={() => setSelectedLive(lVid)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                selectedLive?.id === lVid.id
                  ? 'border-rose-500/60 bg-rose-500/5 dark:bg-rose-500/10'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="relative aspect-video w-36 rounded-xl overflow-hidden bg-black shrink-0">
                <img src={lVid.thumbnailUrl} alt={lVid.title} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 right-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5 animate-live-pulse" />
                  LIVE
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
                  {lVid.title}
                </h4>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  {lVid.creator.name}
                </p>
                <p className="text-[10px] font-medium text-rose-500 mt-0.5">
                  {lVid.liveViewers?.toLocaleString() || '1.8K'} viewers
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Super Chat Modal */}
      {isSuperChatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-500 font-bold">
                <Sparkles className="w-5 h-5" />
                <span>Send Super Chat</span>
              </div>
              <button
                onClick={() => setIsSuperChatOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Send a highlighted message to {selectedLive.creator.name}!
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[200, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setSuperAmt(amt)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    superAmt === amt
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  Rs. {amt}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={superMsg}
              onChange={(e) => setSuperMsg(e.target.value)}
              placeholder="Your highlighted message in live chat..."
              className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsSuperChatOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSendSuper}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
              >
                Send Rs. {superAmt}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Go Live Modal */}
      {isGoLiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <form
            onSubmit={handleStartLive}
            className="w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-sm">
                <Radio className="w-5 h-5 animate-live-pulse" />
                <span>Go Live as Verified Human Creator</span>
              </div>
              <button
                type="button"
                onClick={() => setIsGoLiveModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Live Stream Title</label>
              <input
                type="text"
                value={liveTitle}
                onChange={(e) => setLiveTitle(e.target.value)}
                placeholder="e.g. Acoustic Jam & Live Q&A with Viewers"
                required
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Category</label>
              <select
                value={liveCategory}
                onChange={(e) => setLiveCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-rose-500"
              >
                <option value="music">Music & Jam Sessions</option>
                <option value="lifestyle">Lifestyle & Daily Chat</option>
                <option value="gaming">Gaming & Live Play</option>
                <option value="tech">Tech & Hardware Building</option>
              </select>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>You are broadcasting as a verified human creator. Live chat will automatically be enabled.</span>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGoLiveModalOpen(false)}
                className="px-3 py-2 rounded-xl text-xs text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
              >
                Start Broadcast Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
