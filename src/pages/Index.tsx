import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pin } from "lucide-react";
import { VideoCard } from "@/components/VideoCard";
import { useVideos } from "@/store/useVideos";
import { useState } from "react";

const Index = () => {
  const { videos, addVideo, togglePin, activeTab } = useVideos();
  const [url, setUrl] = useState("");

  const handleAddVideo = async () => {
    if (url) {
      await addVideo(url);
      setUrl("");
    }
  };

  const filteredVideos = videos.filter((video) => {
    switch (activeTab) {
      case 'pinned':
        return video.isPinned;
      case 'recent':
        return true;
      default:
        return false;
    }
  });

  return (
    <div className="min-h-screen bg-background text-white">
      <AnimatedBackground />
      <Header />
      <main className="max-w-7xl mx-auto px-6">
        <div className="text-center pt-16 mb-16">
          <img src="/lovable-uploads/4ec29862-7e48-44ec-8e24-268de758604c.png" alt="VidPin Logo" className="h-12 mx-auto mb-8" />
          <div className="relative mb-6 max-w-3xl mx-auto">
            <Input
              type="text"
              placeholder="Paste YouTube video URL"
              className="w-full bg-secondary/50 border-none h-12 pl-4 pr-32 text-base"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddVideo()}
            />
            <Button 
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 h-10"
              onClick={handleAddVideo}
            >
              <Pin className="mr-2 h-4 w-4" />
              Pin Video
            </Button>
          </div>
        </div>

        <Navigation />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onTogglePin={togglePin}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;