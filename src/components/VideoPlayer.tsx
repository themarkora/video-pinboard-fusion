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
      <DialogContent className="sm:max-w-[800px] p-0">
        <div className="relative w-full pt-[56.25%]">
          <div className="absolute inset-0">
            <YouTube
              videoId={videoId}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                },
              }}
              className="w-full h-full"
              iframeClassName="w-full h-full absolute top-0 left-0"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};