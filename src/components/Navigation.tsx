import { Button } from "@/components/ui/button";
import { Clock, Pin, StickyNote, FolderOpen } from "lucide-react";
import { useVideos } from "@/store/useVideos";

export const Navigation = () => {
  const { activeTab, setActiveTab, videos, boards } = useVideos();

  const pinnedCount = videos.filter(v => v.isPinned).length;
  const notesCount = videos.filter(v => v.notes && v.notes.length > 0).length;
  const boardsCount = boards.length;

  return (
    <nav className="flex items-center justify-center w-full max-w-[1200px] mx-auto px-4">
      <div className="flex bg-[#1F2937]/50 rounded-2xl p-1.5">
        <Button 
          variant="secondary" 
          className={`${
            activeTab === 'recent' ? 'bg-primary' : 'bg-transparent'
          } hover:bg-white/[0.1] text-white px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium transition-colors duration-200`}
          onClick={() => setActiveTab('recent')}
        >
          <Clock className="h-5 w-5" />
          Recent Videos
        </Button>
        
        <Button 
          variant="secondary" 
          className={`${
            activeTab === 'pinned' ? 'bg-primary' : 'bg-transparent'
          } hover:bg-white/[0.1] text-white px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium transition-colors duration-200`}
          onClick={() => setActiveTab('pinned')}
        >
          <Pin className="h-5 w-5" />
          Pinned Videos ({pinnedCount})
        </Button>
        
        <Button 
          variant="secondary" 
          className={`${
            activeTab === 'notes' ? 'bg-primary' : 'bg-transparent'
          } hover:bg-white/[0.1] text-white px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium transition-colors duration-200`}
          onClick={() => setActiveTab('notes')}
        >
          <StickyNote className="h-5 w-5" />
          Videos with Notes ({notesCount})
        </Button>
        
        <Button 
          variant="secondary" 
          className={`${
            activeTab === 'boards' ? 'bg-primary' : 'bg-transparent'
          } hover:bg-white/[0.1] text-white px-6 py-2 h-12 rounded-2xl flex items-center gap-3 text-base font-medium transition-colors duration-200`}
          onClick={() => setActiveTab('boards')}
        >
          <FolderOpen className="h-5 w-5" />
          Boards ({boardsCount})
        </Button>
      </div>
    </nav>
  );
};