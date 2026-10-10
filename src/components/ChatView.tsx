import React, { useState } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import {
  MessageSquare,
  Send,
  Users,
  Video as VideoIcon,
  Smile,
  Hash,
  ShieldCheck,
  CheckCircle2,
  Paperclip,
  Share2,
  Play
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    channels,
    activeChannelId,
    setActiveChannelId,
    communityMessages,
    sendCommunityMessage,
    currentUser,
    setCurrentWatchingVideo,
    videos
  } = useTouTube();

  const [messageText, setMessageText] = useState('');
  const [isVideoPickerOpen, setIsVideoPickerOpen] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const messages = communityMessages[activeChannelId] || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendCommunityMessage(activeChannelId, messageText);
      setMessageText('');
    }
  };

  const handleShareVideo = (vid: typeof videos[0]) => {
    sendCommunityMessage(activeChannelId, `Check this video: "${vid.title}"`, vid);
    setIsVideoPickerOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 h-[calc(100vh-80px)] flex flex-col">
      <div className="flex-1 flex rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-xl">
        {/* Left: Channels & DMs List */}
        <div className="w-64 sm:w-80 shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/50">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">Community Chat</h3>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Live
            </span>
          </div>

          {/* List of Channels and DMs */}
          <div className="flex-1 overflow-y-auto p-2 space-y-4">
            {/* Public Channels */}
            <div>
              <div className="px-2 mb-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Channels
              </div>
              <div className="space-y-1">
                {channels
                  .filter((c) => c.type === 'public')
                  .map((ch) => {
                    const isActive = ch.id === activeChannelId;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChannelId(ch.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <Hash className="w-4 h-4 shrink-0 opacity-70" />
                        <span className="truncate flex-1">{ch.name}</span>
                        {ch.onlineCount && (
                          <span className="text-[10px] text-zinc-400 font-normal">
                            {ch.onlineCount} online
                          </span>
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="px-2 mb-1.5 text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                Direct Chats
              </div>
              <div className="space-y-1">
                {channels
                  .filter((c) => c.type === 'direct')
                  .map((ch) => {
                    const isActive = ch.id === activeChannelId;
                    return (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChannelId(ch.id)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 shadow-xs'
                            : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200'
                        }`}
                      >
                        <img
                          src={ch.avatar}
                          alt={ch.name}
                          className="w-5 h-5 rounded-full object-cover shrink-0"
                        />
                        <span className="truncate flex-1">{ch.name}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Current User footer */}
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex items-center gap-2.5">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-emerald-500 font-semibold">Online & Ready to Chat</p>
            </div>
          </div>
        </div>

        {/* Right: Message Window */}
        <div className="flex-1 flex flex-col bg-white dark:bg-zinc-950">
          {/* Channel Header */}
          <div className="px-5 py-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/70 dark:bg-zinc-900/60 backdrop-blur-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  {activeChannel.type === 'public' ? `#${activeChannel.name}` : activeChannel.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                  Verified Humans
                </span>
              </div>
              {activeChannel.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                  {activeChannel.description}
                </p>
              )}
            </div>

            <button
              onClick={() => setIsVideoPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
            >
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Share Video</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 text-xs">
                No messages yet in this channel. Send the first message to say hello!
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="flex items-start gap-3 text-xs">
                  <img
                    src={m.sender.avatar}
                    alt={m.sender.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900 dark:text-zinc-100">
                        {m.sender.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">{m.sender.handle}</span>
                      <span className="text-[10px] text-zinc-400">• {m.timestamp}</span>
                    </div>

                    {m.text && (
                      <p className="text-zinc-800 dark:text-zinc-200 leading-relaxed font-normal">
                        {m.text}
                      </p>
                    )}

                    {/* Shared Video Card in chat */}
                    {m.sharedVideo && (
                      <div
                        onClick={() => {
                          const target = videos.find((v) => v.id === m.sharedVideo?.id);
                          if (target) setCurrentWatchingVideo(target);
                        }}
                        className="mt-2 max-w-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-rose-500/50 cursor-pointer transition-all group"
                      >
                        <div className="relative aspect-video w-full bg-black">
                          <img
                            src={m.sharedVideo.thumbnailUrl}
                            alt={m.sharedVideo.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg">
                              <Play className="w-5 h-5 fill-white ml-0.5" />
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/80 text-white">
                            {m.sharedVideo.duration}
                          </span>
                        </div>
                        <div className="p-2.5">
                          <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-rose-500 transition-colors">
                            {m.sharedVideo.title}
                          </h5>
                          <p className="text-[11px] text-zinc-500 mt-0.5">
                            {m.sharedVideo.creatorName}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Emoji Reactions */}
                    {m.reactions && (
                      <div className="flex gap-1.5 pt-1">
                        {Object.entries(m.reactions).map(([emoji, count]) => (
                          <span
                            key={emoji}
                            className="px-2 py-0.5 rounded-full text-[11px] bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 font-semibold"
                          >
                            {emoji} {count}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 sm:p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => setIsVideoPickerOpen(true)}
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Attach video"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={`Message ${activeChannel.type === 'public' ? `#${activeChannel.name}` : activeChannel.name}...`}
              className="flex-1 px-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-500 transition-all"
            />

            <button
              type="submit"
              disabled={!messageText.trim()}
              className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>

      {/* Share Video Modal Picker */}
      {isVideoPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
              <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Select a Video to Share in Chat
              </h4>
              <button
                onClick={() => setIsVideoPickerOpen(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => handleShareVideo(vid)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                >
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-20 aspect-video rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                      {vid.title}
                    </p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      {vid.creator.name} • {vid.views.toLocaleString()} views
                    </p>
                  </div>
                  <Share2 className="w-4 h-4 text-rose-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
