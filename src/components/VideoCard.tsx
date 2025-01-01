import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { VideoPlayer } from './VideoPlayer';
import { Video } from '@/store/useVideos';
import { Pin } from './icons/Pin';
import { PinOff } from './icons/PinOff';

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
}

export const VideoCard = ({ video, onTogglePin }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      <Card className="bg-secondary/50 backdrop-blur-lg border-white/10 overflow-hidden">
        <div 
          className="relative aspect-video cursor-pointer" 
          onClick={() => setIsPlaying(true)}
        >
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white mb-1 line-clamp-2">{video.title}</h3>
          <div className="flex gap-2 mt-4">
            <Button 
              size="sm" 
              className={`flex-1 ${video.isPinned ? 'bg-[#9b87f5] hover:bg-[#9b87f5]/90' : 'bg-[#9b87f5] hover:bg-[#9b87f5]/90'}`}
              onClick={() => onTogglePin(video.id)}
            >
              {video.isPinned ? (
                <>
                  <PinOff className="mr-2" size={16} color="white" />
                  Unpin
                </>
              ) : (
                <>
                  <Pin className="mr-2" size={16} color="white" />
                  Pin Video
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              className="px-3 bg-[#ea384c] hover:bg-[#ea384c]/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      <VideoPlayer
        videoId={video.id}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
      />
    </>
  );
};