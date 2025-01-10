import { Button } from "@/components/ui/button";
import { LogOut, Pin } from "lucide-react";

export const Header = () => {
  return (
    <header className="w-full px-6 py-4 bg-[#0F1116] border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Pin 
            size={32} 
            className="text-primary animate-float-pin"
            strokeWidth={2.5}
          />
          <span className="text-2xl font-bold">VidPin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">marko</span>
          <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}