import React from 'react';
import { useTouTube } from '../context/TouTubeContext';
import {
  Home,
  Flame,
  Radio,
  MessageSquare,
  Bookmark,
  User,
  History,
  ShieldCheck,
  Sparkles,
  PlaySquare,
  ThumbsUp
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setCurrentWatchingVideo,
    videos
  } = useTouTube();

  const subscribedCreators = Array.from(
    new Map(
      videos
        .filter((v) => v.creator.isSubscribed)
        .map((v) => [v.creator.id, v.creator])
    ).values()
  );

  interface NavItem {
    id: 'home' | 'shorts' | 'live' | 'chat' | 'subscriptions' | 'library' | 'my-channel';
    label: string;
    icon: React.ElementType;
    badge?: string;
    isLive?: boolean;
  }

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'shorts', label: 'Shorts', icon: Flame, badge: 'Popular' },
    { id: 'live', label: 'Live Streams', icon: Radio, isLive: true },
    { id: 'chat', label: 'Community Chat', icon: MessageSquare, badge: 'New' },
    { id: 'subscriptions', label: 'Subscriptions', icon: PlaySquare },
    { id: 'library', label: 'Library & Likes', icon: History },
    { id: 'my-channel', label: 'My Channel', icon: User }
  ];

  return (
    <aside className="w-16 md:w-60 shrink-0 border-r border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-2 md:p-4 flex flex-col justify-between transition-colors duration-200 min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentWatchingVideo(null);
                  setActiveTab(item.id);
                }}
                className={`w-full flex items-center justify-center md:justify-start gap-3.5 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-rose-500/10 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
                title={item.label}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-rose-600 dark:text-rose-400' : 'group-hover:scale-110 transition-transform'}`} />
                  {item.isLive && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
                    </span>
                  )}
                </div>
                <span className="hidden md:inline truncate">{item.label}</span>
                {item.badge && (
                  <span className="hidden md:inline ml-auto text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-900">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subscriptions section (desktop only) */}
        <div className="hidden md:block pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="px-2 mb-2 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <span>Subscriptions</span>
            <span className="text-[10px] text-zinc-500">{subscribedCreators.length}</span>
          </div>

          <div className="space-y-1">
            {subscribedCreators.length === 0 ? (
              <p className="px-2 py-2 text-xs text-zinc-400 italic">No subscriptions yet</p>
            ) : (
              subscribedCreators.map((creator) => (
                <button
                  key={creator.id}
                  onClick={() => {
                    setCurrentWatchingVideo(null);
                    setActiveTab('subscriptions');
                  }}
                  className="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-left transition-colors"
                >
                  <img
                    src={creator.avatar}
                    alt={creator.name}
                    className="w-6 h-6 rounded-full object-cover border border-zinc-200 dark:border-zinc-800"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 truncate">{creator.name}</p>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Human / Non-AI Certified Footer Badge */}
      <div className="hidden md:block p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800/80 mt-6">
        <div className="flex items-center gap-2 mb-1.5 text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="text-xs font-bold">100% Non-AI Zone</span>
        </div>
        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
          Real human videos, raw sound, and genuine live chat. No generative synthetic slop.
        </p>
      </div>
    </aside>
  );
};
