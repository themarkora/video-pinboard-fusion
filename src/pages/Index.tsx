import { Header } from "@/components/Header";
import { Navigation } from "@/components/Navigation";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pin, StickyNote, Target, Microscope } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-white">
      <AnimatedBackground />
      <Header />
      <main className="max-w-3xl mx-auto px-6 text-center pt-16">
        <div className="mb-16">
          <img src="/lovable-uploads/4ec29862-7e48-44ec-8e24-268de758604c.png" alt="VidPin Logo" className="h-12 mx-auto mb-8" />
          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Paste YouTube video URL"
              className="w-full bg-secondary/50 border-none h-12 pl-4 pr-32 text-base"
            />
            <Button className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 h-10">
              <Pin className="mr-2 h-4 w-4" />
              Pin Video
            </Button>
          </div>
          
          <h1 className="text-xl text-gray-300 mb-8">
            Your personal YouTube video organizer for research and inspiration
          </h1>
          
          <div className="space-y-4 text-gray-400 text-lg">
            <div className="flex items-center justify-center gap-2">
              <Pin className="h-5 w-5 text-primary" />
              <span>Pin videos you want to reference later</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <StickyNote className="h-5 w-5 text-primary" />
              <span>Add private notes and insights</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Organize your research and inspiration</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Microscope className="h-5 w-5 text-primary" />
              <span>Quickly find videos when you need them</span>
            </div>
          </div>
        </div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search videos by title, channel, or notes..."
            className="w-full bg-secondary/50 border-none h-12 pl-12 text-base"
          />
        </div>

        <Navigation />
      </main>
    </div>
  );
};

export default Index;