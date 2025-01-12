import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  onClick: () => void;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ thumbnail, title, onClick }) => {
  return (
    <div 
      className="relative w-full cursor-pointer group overflow-hidden"
      onClick={onClick}
    >
      <AspectRatio ratio={16 / 9}>
        <img 
          src={thumbnail} 
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="text-white text-lg font-medium">Play Video</div>
        </div>
      </AspectRatio>
    </div>
  );
};