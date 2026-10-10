import React from 'react';
import { TouTubeProvider, useTouTube } from './context/TouTubeContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeFeed } from './components/HomeFeed';
import { WatchView } from './components/WatchView';
import { ShortsView } from './components/ShortsView';
import { LiveView } from './components/LiveView';
import { ChatView } from './components/ChatView';
import { ProfileView } from './components/ProfileView';
import { UploadModal } from './components/UploadModal';
import { VideoCard } from './components/VideoCard';
import { PlaySquare, Bookmark, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    currentWatchingVideo,
    setCurrentWatchingVideo,
    videos,
    setIsUploadModalOpen
  } = useTouTube();

  // Subscriptions tab content
  const subscribedVideos = videos.filter((v) => v.creator.isSubscribed);

  // Library tab content
  const savedVideos = videos.filter((v) => v.isSaved);
  const likedVideos = videos.filter((v) => v.isLiked);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      <Header />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* If user is watching a video, they get full theater or watch mode */}
        {currentWatchingVideo ? (
          <main className="flex-1 overflow-x-hidden">
            <WatchView
              video={currentWatchingVideo}
              onBack={() => setCurrentWatchingVideo(null)}
            />
          </main>
        ) : (
          <>
            {/* Sidebar navigation */}
            <Sidebar />

            {/* Dynamic View container */}
            <main className="flex-1 min-w-0 overflow-y-auto">
              {activeTab === 'home' && <HomeFeed />}
              {activeTab === 'shorts' && <ShortsView />}
              {activeTab === 'live' && <LiveView />}
              {activeTab === 'chat' && <ChatView />}
              {activeTab === 'my-channel' && <ProfileView />}

              {/* Subscriptions Tab View */}
              {activeTab === 'subscriptions' && (
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <PlaySquare className="w-5 h-5 text-rose-600" />
                      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white">
                        Subscribed Creators Feed
                      </h2>
                    </div>
                    <span className="text-xs text-zinc-500">
                      {subscribedVideos.length} human videos
                    </span>
                  </div>

                  {subscribedVideos.length === 0 ? (
                    <div className="text-center py-20 text-zinc-400 text-xs">
                      You haven't subscribed to any creators yet. Subscribe to your favorite human creators to see their videos here!
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {subscribedVideos.map((video) => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Library Tab View */}
              {activeTab === 'library' && (
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-8">
                  {/* Saved / Watch Later Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-5 h-5 text-rose-600" />
                        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                          Saved Playlist ({savedVideos.length})
                        </h2>
                      </div>
                    </div>

                    {savedVideos.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4">No saved videos yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {savedVideos.map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Liked Videos Section */}
                  <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-200 dark:border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                        <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                          Liked Videos ({likedVideos.length})
                        </h2>
                      </div>
                    </div>

                    {likedVideos.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-4">No liked videos yet.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {likedVideos.map((video) => (
                          <VideoCard key={video.id} video={video} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </main>
          </>
        )}
      </div>

      {/* Global Upload & Post Modal */}
      <UploadModal />
    </div>
  );
};

export default function App() {
  return (
    <TouTubeProvider>
      <MainLayout />
    </TouTubeProvider>
  );
}
