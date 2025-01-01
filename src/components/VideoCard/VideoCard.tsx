import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { VideoPlayer } from '../VideoPlayer';
import { VideoNotes } from './VideoNotes';
import { BoardCreationModal } from '../BoardCreationModal';
import { Video } from '@/store/useVideos';
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/components/ui/use-toast";

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
}

export const VideoCard = ({ video, onTogglePin }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAddingToBoard, setIsAddingToBoard] = useState(false);
  const { deleteVideo } = useVideos();
  const { toast } = useToast();

  const handleDelete = () => {
    deleteVideo(video.id);
    toast({
      title: "Video deleted",
      description: "The video has been removed from your collection.",
    });
  };

  return (
    <Card className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden">
      <div 
        className="relative aspect-video cursor-pointer" 
        onClick={() => setIsPlaying(true)}
      >
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-white text-xl mb-6 line-clamp-2">
          {video.title}
        </h3>
        
        {video.notes && video.notes.length > 0 && (
          <div className="mb-4 p-3 bg-[#2A2F3C] rounded-lg">
            <VideoNotes videoId={video.id} notes={video.notes} />
          </div>
        )}
        
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button 
              size="lg"
              className="flex-1 bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsAddingToBoard(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              Add to Board
            </Button>
          </div>

          <Button 
            size="lg"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Delete
          </Button>

          {!video.notes?.length && (
            <VideoNotes videoId={video.id} />
          )}
        </div>
      </div>

      <VideoPlayer
        videoId={video.id}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
      />

      <BoardCreationModal
        isOpen={isAddingToBoard}
        onClose={() => setIsAddingToBoard(false)}
        videoId={video.id}
      />
    </Card>
  );
};