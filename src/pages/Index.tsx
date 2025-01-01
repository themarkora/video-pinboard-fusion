import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { AddVideo } from "@/components/AddVideo";
import { VideoCard } from "@/components/VideoCard";
import { BoardCard } from "@/components/BoardCard";
import { useVideos } from "@/store/useVideos";

const Index = () => {
  const { videos, addVideo, togglePin, activeTab, boards } = useVideos();

  const filteredVideos = videos.filter((video) => {
    switch (activeTab) {
      case 'pinned':
        return video.isPinned;
      case 'notes':
        return video.notes && video.notes.length > 0;
      case 'boards':
        return false; // Don't show videos in board view
      case 'recent':
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <AnimatedBackground />
      <Header />
      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center pt-16 mb-16">
          <img src="/lovable-uploads/4ec29862-7e48-44ec-8e24-268de758604c.png" alt="VidPin Logo" className="h-12 mx-auto mb-8" />
          <AddVideo />
        </div>

        <Navigation />

        {activeTab === 'boards' ? (
          <div className="grid gap-6 mt-8">
            {boards.map((board) => (
              <BoardCard key={board.id} id={board.id} name={board.name} />
            ))}
            {boards.length === 0 && (
              <p className="text-center text-gray-400 py-8">No boards created yet.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {filteredVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onTogglePin={togglePin}
              />
            ))}
            {filteredVideos.length === 0 && (
              <p className="text-center text-gray-400 py-8 col-span-full">No videos available.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;