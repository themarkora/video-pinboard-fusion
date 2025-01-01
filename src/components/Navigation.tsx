import { Button } from "@/components/ui/button";
import { Clock, Pin, StickyNote, FolderOpen } from "lucide-react";

export const Navigation = () => {
  return (
    <nav className="flex flex-wrap justify-center gap-3">
      <Button variant="secondary" className="bg-primary hover:bg-primary/90">
        <Clock className="mr-2 h-4 w-4" />
        Recent Videos
      </Button>
      <Button variant="secondary" className="bg-secondary/50 hover:bg-secondary/70">
        <Pin className="mr-2 h-4 w-4" />
        Pinned Videos
      </Button>
      <Button variant="secondary" className="bg-secondary/50 hover:bg-secondary/70">
        <StickyNote className="mr-2 h-4 w-4" />
        Videos with Notes
      </Button>
      <Button variant="secondary" className="bg-secondary/50 hover:bg-secondary/70">
        <FolderOpen className="mr-2 h-4 w-4" />
        Boards (13)
      </Button>
    </nav>
  );
};