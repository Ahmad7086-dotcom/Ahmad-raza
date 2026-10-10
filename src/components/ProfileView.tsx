import React, { useState } from 'react';
import { useTouTube } from '../context/TouTubeContext';
import { VideoCard } from './VideoCard';
import {
  User,
  ShieldCheck,
  Video as VideoIcon,
  Flame,
  Bookmark,
  ThumbsUp,
  Edit3,
  Calendar,
  Sparkles,
  Upload
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser, videos, setIsUploadModalOpen } = useTouTube();

  const [activeSubTab, setActiveSubTab] = useState<'my-videos' | 'shorts' | 'liked' | 'saved'>('my-videos');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio);

  const userVideos = videos.filter((v) => v.creator.id === currentUser.id && v.type !== 'short');
  const userShorts = videos.filter((v) => v.creator.id === currentUser.id && v.type === 'short');
  const likedVideos = videos.filter((v) => v.isLiked);
  const savedVideos = videos.filter((v) => v.isSaved);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name: editName, bio: editBio });
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Channel Header Banner */}
      <div className="rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
        {/* Banner image */}
        <div className="h-36 sm:h-48 w-full bg-gradient-to-r from-rose-900/60 via-zinc-900 to-amber-900/40 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verified Human Creator Channel</span>
          </div>
        </div>

        {/* Channel Details */}
        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-zinc-900 shadow-xl"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white">
                  {currentUser.name}
                </h2>
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {currentUser.handle} • {currentUser.subscribers.toLocaleString()} subscribers • {userVideos.length + userShorts.length} authentic videos
              </p>
              <p className="text-xs text-zinc-600 dark:text-zinc-300 max-w-lg mt-1">
                {currentUser.bio}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Customize Channel</span>
            </button>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Post New Video</span>
            </button>
          </div>
        </div>

        {/* Profile Edit Form */}
        {isEditing && (
          <form
            onSubmit={handleSaveProfile}
            className="p-4 mx-4 sm:mx-6 mb-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Channel Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Channel Bio</label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full mt-1 px-3 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Channel Tab Bar */}
        <div className="flex items-center gap-1 px-4 sm:px-6 border-t border-zinc-200 dark:border-zinc-800 overflow-x-auto">
          {[
            { id: 'my-videos', label: `Your Videos (${userVideos.length})`, icon: VideoIcon },
            { id: 'shorts', label: `Shorts (${userShorts.length})`, icon: Flame },
            { id: 'liked', label: `Liked Videos (${likedVideos.length})`, icon: ThumbsUp },
            { id: 'saved', label: `Saved Library (${savedVideos.length})`, icon: Bookmark }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-rose-600 text-rose-600 dark:text-rose-400'
                    : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div>
        {activeSubTab === 'my-videos' && (
          <div>
            {userVideos.length === 0 ? (
              <div className="text-center py-16 space-y-3 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8">
                <VideoIcon className="w-10 h-10 text-zinc-400 mx-auto" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  No Standard Videos Posted Yet
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Upload your original footage, guitar sessions, or vlogs without generative AI!
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Upload First Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userVideos.map((vid) => (
                  <VideoCard key={vid.id} video={vid} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'shorts' && (
          <div>
            {userShorts.length === 0 ? (
              <div className="text-center py-16 space-y-3 rounded-3xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8">
                <Flame className="w-10 h-10 text-rose-500 mx-auto" />
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  No Shorts Uploaded Yet
                </h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Create vertical short reels of real tricks, crafts, or moments.
                </p>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
                >
                  Upload Short Reel
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {userShorts.map((sh) => (
                  <VideoCard key={sh.id} video={sh} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'liked' && (
          <div>
            {likedVideos.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 text-xs">
                You haven't liked any human videos yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedVideos.map((vid) => (
                  <VideoCard key={vid.id} video={vid} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'saved' && (
          <div>
            {savedVideos.length === 0 ? (
              <div className="text-center py-16 text-zinc-400 text-xs">
                Your saved playlist is empty. Click the Bookmark icon on any video to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedVideos.map((vid) => (
                  <VideoCard key={vid.id} video={vid} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
