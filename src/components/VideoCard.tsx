import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, Plus } from "lucide-react";

interface VideoCardProps {
  title: string;
  channel: string;
  thumbnail: string;
  publishDate: string;
}

export const VideoCard = ({ title, channel, thumbnail, publishDate }: VideoCardProps) => {
  return (
    <Card className="bg-secondary/50 backdrop-blur-lg border-white/10 overflow-hidden">
      <div className="relative aspect-video">
        <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 line-clamp-2">{title}</h3>
        <p className="text-sm text-white/70 mb-4">{channel}</p>
        <div className="text-xs text-white/50 mb-4">Published: {publishDate}</div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="flex-1">
            <Plus className="mr-2 h-4 w-4" />
            Add to Board
          </Button>
          <Button size="sm" variant="ghost" className="px-2">
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="px-2 text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};