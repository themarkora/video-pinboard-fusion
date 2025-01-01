import { Button } from "@/components/ui/button";
import { Clock, Pin, StickyNote, FolderOpen } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-center gap-4 w-full max-w-[1200px] mx-auto px-4">
      <Button 
        variant="secondary" 
        className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium"
      >
        <Clock className="h-5 w-5" />
        Recent Videos
      </Button>
      
      <Button 
        variant="secondary" 
        className="bg-[#1F2937]/50 hover:bg-[#1F2937]/70 text-gray-300 px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium"
      >
        <Pin className="h-5 w-5" />
        Pinned Videos
      </Button>
      
      <Button 
        variant="secondary" 
        className="bg-[#1F2937]/50 hover:bg-[#1F2937]/70 text-gray-300 px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium"
      >
        <StickyNote className="h-5 w-5" />
        Videos with Notes
      </Button>
      
      <Button 
        variant="secondary" 
        className="bg-[#1F2937]/50 hover:bg-[#1F2937]/70 text-gray-300 px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium"
      >
        <FolderOpen className="h-5 w-5" />
        Boards (13)
      </Button>
    </nav>
  );
};