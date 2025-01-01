import React from 'react';
import YouTube from 'react-youtube';
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface VideoPlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, isOpen, onClose }: VideoPlayerProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <div className="aspect-video w-full">
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: {
                autoplay: 1,
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};