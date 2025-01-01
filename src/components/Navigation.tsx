import { Button } from "@/components/ui/button";
import { Clock, Bookmark, StickyNote, FolderOpen } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="flex justify-center gap-2 my-6">
      <Button variant="secondary" className="bg-secondary/50 backdrop-blur-lg">
        <Clock className="mr-2 h-4 w-4" />
        Recent Videos
      </Button>
      <Button variant="secondary" className="bg-secondary/50 backdrop-blur-lg">
        <Bookmark className="mr-2 h-4 w-4" />
        Pinned Videos
      </Button>
      <Button variant="secondary" className="bg-secondary/50 backdrop-blur-lg">
        <StickyNote className="mr-2 h-4 w-4" />
        Videos with Notes
      </Button>
      <Button variant="secondary" className="bg-secondary/50 backdrop-blur-lg">
        <FolderOpen className="mr-2 h-4 w-4" />
        Boards (13)
      </Button>
    </nav>
  );
};