import { Header } from "@/components/Header";
import { AddVideo } from "@/components/AddVideo";
import { VideoCard } from "@/components/VideoCard";
import { BoardCard } from "@/components/BoardCard";
import { useVideos } from "@/store/useVideos";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Index = () => {
  const { videos, togglePin, activeTab, boards } = useVideos();

  const filteredVideos = videos.filter((video) => {
    switch (activeTab) {
      case 'pinned':
        return video.isPinned;
      case 'notes':
        return video.notes && video.notes.length > 0;
      case 'boards':
        return false;
      case 'recent':
      default:
        return true;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background-top to-background-bottom text-white relative overflow-hidden">
      <AnimatedBackground />
      <Header />
      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center pt-16 mb-12">
          <div className="flex items-center justify-center mb-4">
            <img src="/lovable-uploads/4ec29862-7e48-44ec-8e24-268de758604c.png" alt="VidPin Logo" className="h-10" />
            <h1 className="text-2xl font-bold ml-2">VidPin</h1>
          </div>
          <AddVideo />
          <p className="text-gray-400 mt-4 text-sm">
            Your personal YouTube video organizer for research and inspiration
          </p>
          <div className="flex flex-col items-center gap-2 mt-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-purple-500">📌</span> Pin videos you want to reference later
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">📝</span> Add private notes and insights
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">🎯</span> Organize your research and inspiration
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">⚡</span> Quickly find videos when you need them
            </div>
          </div>
        </div>

        <div className="relative max-w-2xl mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search videos by title, channel, or notes..." 
            className="w-full bg-[#1A1F2E] border-none pl-10 h-12 text-gray-300"
          />
        </div>

        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="bg-transparent border-b border-gray-800 w-full justify-start gap-2 h-auto pb-4">
            <TabsTrigger 
              value="recent"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-lg"
            >
              Recent Videos
            </TabsTrigger>
            <TabsTrigger 
              value="pinned"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-lg"
            >
              Pinned Videos
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-lg"
            >
              Videos with Notes
            </TabsTrigger>
            <TabsTrigger 
              value="boards"
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-2 rounded-lg"
            >
              Boards ({boards.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

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
