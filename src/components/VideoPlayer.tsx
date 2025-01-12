import React from 'react';
import YouTube from 'react-youtube';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoPlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ videoId, isOpen, onClose }: VideoPlayerProps) => {
  // Extract video ID if full URL is provided
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url; // Returns the ID or original string if it's already an ID
  };

  const actualVideoId = getYouTubeVideoId(videoId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-[#2A2F3C] border-none">
        <VisuallyHidden>
          <DialogTitle>YouTube Video Player</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full pt-[56.25%]">
          <div className="absolute inset-0">
            <YouTube
              videoId={actualVideoId}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                  rel: 0
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