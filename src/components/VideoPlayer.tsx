import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  thumbnail?: string; // Added thumbnail prop as optional
}

export const VideoPlayer = ({ videoId, isOpen, onClose, thumbnail }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-[#2A2F3C] border-none">
        <div className="relative w-full pt-[56.25%]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2A2F3C]">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          )}
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
              onReady={() => setIsLoading(false)}
              className="w-full h-full"
              iframeClassName="w-full h-full absolute top-0 left-0"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};