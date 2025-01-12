import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoPlayerProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
  thumbnail?: string;
}

export const VideoPlayer = ({ videoId, isOpen, onClose, thumbnail }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // Extract YouTube video ID from URL if full URL is passed
  const getYouTubeId = (url: string) => {
    if (!url) return '';
    
    // If it's already just an ID (11 characters), return it
    if (url.length === 11) return url;
    
    try {
      // Handle full URLs
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        return urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }
    } catch {
      // If URL parsing fails, try regex as fallback
      const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(regex);
      return match ? match[1] : url;
    }
    
    return url;
  };

  const actualVideoId = getYouTubeId(videoId);

  if (!actualVideoId) {
    console.error('Invalid YouTube video ID:', videoId);
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-[#2A2F3C] border-none">
        <VisuallyHidden>
          <DialogTitle>YouTube Video Player</DialogTitle>
        </VisuallyHidden>
        <div className="relative w-full pt-[56.25%]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#2A2F3C]">
              <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
            </div>
          )}
          <div className="absolute inset-0">
            <YouTube
              videoId={actualVideoId}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  modestbranding: 1,
                  rel: 0,
                },
              }}
              onReady={() => setIsLoading(false)}
              onError={(error) => {
                console.error('YouTube Player Error:', error);
                setIsLoading(false);
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