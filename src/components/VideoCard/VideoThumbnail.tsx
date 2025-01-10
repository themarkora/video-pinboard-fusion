import React from 'react';

interface VideoThumbnailProps {
  thumbnail: string;
  title: string;
  onClick: () => void;
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ thumbnail, title, onClick }) => {
  return (
    <div 
      className="relative aspect-video cursor-pointer group"
      onClick={onClick}
    >
      <img 
        src={thumbnail} 
        alt={title} 
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
        <div className="text-white text-lg font-medium">Play Video</div>
      </div>
    </div>
  );
};