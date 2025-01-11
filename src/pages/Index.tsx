import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { VideoCard } from "@/components/VideoCard";
import { AddVideo } from "@/components/AddVideo";
import { BoardCard } from "@/components/BoardCard";
import { useVideos } from "@/store/useVideos";

const Index = () => {
  const { videos, activeTab, boards, togglePin } = useVideos();

  const filteredVideos = () => {
    switch (activeTab) {
      case "pinned":
        return videos.filter((video) => video.isPinned);
      case "notes":
        return videos.filter((video) => video.notes && video.notes.length > 0);
      default:
        return videos;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F1116]">
      <Header />
      <div className="py-8">
        <Navigation />
        <div className="max-w-[1200px] mx-auto px-4 mt-8">
          <AddVideo />
          <div className="mt-8">
            {activeTab === "boards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {boards.map((board) => (
                  <BoardCard 
                    key={board.id} 
                    id={board.id} 
                    name={board.name} 
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos().map((video) => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onTogglePin={togglePin}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;