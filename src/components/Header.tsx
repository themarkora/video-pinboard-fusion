import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-secondary/5 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/4ec29862-7e48-44ec-8e24-268de758604c.png" alt="VidPin Logo" className="h-8" />
          <span className="text-xl font-semibold">VidPin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">marko</span>
          <Button variant="ghost" className="text-gray-400 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};