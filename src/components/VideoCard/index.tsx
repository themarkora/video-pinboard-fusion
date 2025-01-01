import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { VideoPlayer } from '../VideoPlayer';
import { VideoThumbnail } from './VideoThumbnail';
import { VideoInfo } from './VideoInfo';
import { VideoActions } from './VideoActions';
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/components/ui/use-toast";
import { Video } from '@/store/useVideos';

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
}

export const VideoCard = ({ video, onTogglePin }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { deleteVideo } = useVideos();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteVideo(video.id);
    toast({
      title: "Video deleted",
      description: "The video has been removed from your collection.",
    });
  };

  const handleAddNote = () => {
    toast({
      title: "Coming soon",
      description: "Note taking functionality will be available soon.",
    });
  };

  const handleAddToBoard = () => {
    toast({
      title: "Coming soon",
      description: "Board functionality will be available soon.",
    });
  };

  return (
    <>
      <Card className="bg-[#1A1F2E] border-none overflow-hidden rounded-lg">
        <VideoThumbnail
          thumbnail={video.thumbnail}
          title={video.title}
          onClick={() => setIsPlaying(true)}
        />
        <VideoInfo
          title={video.title}
          channel={video.channel || 'Unknown Channel'}
          publishedAt={video.publishedAt || new Date().toISOString()}
        />
        <VideoActions
          isPinned={video.isPinned}
          onTogglePin={() => onTogglePin(video.id)}
          onDelete={handleDelete}
          onAddNote={handleAddNote}
          onAddToBoard={handleAddToBoard}
        />
      </Card>
      <VideoPlayer
        videoId={video.id}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
      />
    </>
  );
};