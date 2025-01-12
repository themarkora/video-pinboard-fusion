import React, { useState } from 'react';
import { VideoPlayer } from '../VideoPlayer';
import { VideoControls } from './VideoControls';
import { Card } from "@/components/ui/card";
import { useVideos } from '@/store/useVideos';
import { Video } from '@/store/types';

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
}

export const VideoCard = ({ video, onTogglePin }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { addVote, addView } = useVideos();
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (!hasVoted) {
      addVote(video.id);
      setHasVoted(true);
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    addView(video.id);
  };

  return (
    <Card className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden">
      <div 
        className="relative aspect-video cursor-pointer" 
        onClick={handlePlay}
      >
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white text-xl mb-4 line-clamp-2">
          {video.title}
        </h3>
        <VideoControls
          videoId={video.id}
          votes={video.votes || 0}
          views={video.views || 0}
          hasVoted={hasVoted}
          onVote={handleVote}
        />
      </div>
      <VideoPlayer
        videoId={video.id}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
      />
    </Card>
  );
};