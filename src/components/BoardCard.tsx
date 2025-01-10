import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { VideoCard } from './VideoCard';
import { useVideos } from '@/store/useVideos';
import { Droppable, Draggable } from 'react-beautiful-dnd';

interface BoardCardProps {
  id: string;
  name: string;
}

export const BoardCard = ({ id, name }: BoardCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { videos } = useVideos();

  // Ensure videos are properly sorted by order
  const boardVideos = videos
    .filter(video => video.boardIds?.includes(id))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <Card 
      className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden"
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
    >
      <div 
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-secondary/50"
        onClick={() => setIsExpanded(!isExpanded)}
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
          <Droppable droppableId={id} type="VIDEO">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
                  snapshot.isDraggingOver ? 'bg-purple-500/10 rounded-xl p-4' : ''
                }`}
              >
                {boardVideos.map((video, index) => (
                  <Draggable key={video.id} draggableId={video.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-transform duration-200 ${
                          snapshot.isDragging ? 'scale-105 rotate-2' : ''
                        }`}
                      >
                        <VideoCard video={video} onTogglePin={() => {}} boardId={id} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {boardVideos.length === 0 && (
            <p className="text-gray-400 text-center py-4">No videos in this board yet.</p>
          )}
        </div>
      )}
    </Card>
  );
};