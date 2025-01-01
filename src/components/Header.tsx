import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-secondary/50 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/4ec29862-7e48-44ec-8e24-268de758604c.png" alt="VidPin Logo" className="h-8" />
        </div>
        <div className="flex-1 max-w-2xl mx-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Paste YouTube video URL"
              className="w-full bg-background/50 border-white/10"
            />
            <Button className="absolute right-1 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Pin Video
            </Button>
          </div>
        </div>
        <Button variant="ghost" className="text-white/70 hover:text-white">
          Sign Out
        </Button>
      </div>
    </header>
  );
};