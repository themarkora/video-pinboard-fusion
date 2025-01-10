import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { VideoCard } from './VideoCard';
import { useVideos } from '@/store/useVideos';

interface BoardCardProps {
  id: string;
  name: string;
  activeBoard: string | null;
  onBoardClick: (id: string) => void;
}

export const BoardCard = ({ id, name, activeBoard, onBoardClick }: BoardCardProps) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const { videos } = useVideos();
  const isExpanded = activeBoard === id;

  const boardVideos = videos.filter(video => video.boardIds?.includes(id));

  useEffect(() => {
    if (isExpanded && boardRef.current) {
      boardRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isExpanded]);

  return (
    <Card 
      ref={boardRef}
      className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden"
    >
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50"
        onClick={() => onBoardClick(id)}
      >
        <div className="flex items-center space-x-3">
          <Folder className="w-6 h-6 text-purple-500" />
          <h3 className="text-lg font-semibold text-white">{name}</h3>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-400">{boardVideos.length} videos</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 bg-background border-t border-[#2A2F3C]">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {boardVideos.map((video) => (
              <VideoCard key={video.id} video={video} onTogglePin={() => {}} boardId={id} />
            ))}
          </div>
          {boardVideos.length === 0 && (
            <p className="text-gray-400 text-center py-4">No videos in this board yet.</p>
          )}
        </div>
      )}
    </Card>
  );
};