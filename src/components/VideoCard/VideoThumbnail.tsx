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
        className="w-full h-full object-cover rounded-t-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
    </div>
  );
};