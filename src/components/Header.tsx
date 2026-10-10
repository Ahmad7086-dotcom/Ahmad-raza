import React, { useState } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import {
  Search,
  Video as VideoIcon,
  Bell,
  Sun,
  Moon,
  Upload,
  Radio,
  Flame,
  ShieldCheck,
  X,
  Compass,
  MessageSquare
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    isDark,
    toggleTheme,
    searchQuery,
    setSearchQuery,
    setIsUploadModalOpen,
    setActiveTab,
    activeTab,
    currentUser,
    setCurrentWatchingVideo
  } = useTouTube();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifications = [
    { id: 1, text: 'Ali Raza started a live stream: Studio Acoustic Jam Session!', time: '10m ago', unread: true },
    { id: 2, text: 'Bilal Skater posted a new Human Verified Short: Clean Heelflip 7-Stair', time: '1h ago', unread: true },
    { id: 3, text: 'Your video "Acoustic Session" reached 1,000 human views!', time: '3h ago', unread: false }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'chat') {
      setActiveTab('home');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md px-3 sm:px-6 py-2.5 transition-colors duration-200">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentWatchingVideo(null);
              setActiveTab('home');
            }}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              {/* Play symbol with wave lines */}
              <div className="w-0 h-0 border-y-5 border-y-transparent border-l-8 border-l-white ml-0.5"></div>
              <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white">
                  Tou<span className="text-rose-600 dark:text-rose-500">Tube</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Human
                </span>
              </div>
              <span className="hidden sm:block text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
                100% Non-AI Videos & Live Chat
              </span>
            </div>
          </button>
        </div>

        {/* Center: Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-2 sm:mx-6">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-zinc-400 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search human videos, shorts, live streams..."
              className="w-full pl-10 pr-9 py-2 rounded-full text-sm bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-rose-500 dark:focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Post / Upload Video Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/30 transition-all hover:scale-102 active:scale-98"
            title="Upload video or short"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Post Video</span>
            <span className="sm:hidden">Post</span>
          </button>

          {/* Direct Community Chat Quick Button */}
          <button
            onClick={() => {
              setCurrentWatchingVideo(null);
              setActiveTab('chat');
            }}
            className={`p-2 rounded-full transition-colors relative ${
              activeTab === 'chat'
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
            title="Community & Direct Chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-zinc-700" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className="p-2 rounded-full text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600"></span>
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="font-bold text-sm text-zinc-900 dark:text-white">Notifications</span>
                  <span className="text-zinc-500 text-[11px]">Mark all read</span>
                </div>
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        n.unread
                          ? 'bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/15'
                          : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <p className="text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed">{n.text}</p>
                      <span className="text-zinc-400 text-[10px] mt-1 block">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="relative">
            <button
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-rose-500/40 transition-all focus:outline-none"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-zinc-300 dark:border-zinc-700"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl p-3 z-50">
                <div className="flex items-center gap-3 pb-3 mb-2 border-b border-zinc-100 dark:border-zinc-800">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{currentUser.name}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{currentUser.handle}</p>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-zinc-700 dark:text-zinc-300">
                  <button
                    onClick={() => {
                      setActiveTab('my-channel');
                      setIsProfileOpen(false);
                      setCurrentWatchingVideo(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                  >
                    Your Channel & Videos
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      setIsProfileOpen(false);
                      setCurrentWatchingVideo(null);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium"
                  >
                    Community Chat
                  </button>
                  <button
                    onClick={() => {
                      setIsUploadModalOpen(true);
                      setIsProfileOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium text-rose-600 dark:text-rose-400"
                  >
                    Post Video / Short
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
