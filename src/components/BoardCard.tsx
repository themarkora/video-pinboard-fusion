import React, { useState, useEffect, useRef } from 'react';
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
  const { videos, reorderVideosInBoard } = useVideos();
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  const boardVideos = videos.filter(video => video.boardIds?.includes(id));

  const handleMouseEnter = (isDraggingOver: boolean) => {
    isDraggingRef.current = isDraggingOver;
    
    if (isDraggingOver && !isExpanded) {
      // Clear any existing timer first
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      // Set new timer
      hoverTimerRef.current = setTimeout(() => {
        if (isDraggingRef.current) { // Only expand if still dragging
          setIsExpanded(true);
        }
      }, 1000);
    }
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  return (
    <Droppable droppableId={id} type="VIDEO">
      {(provided, snapshot) => (
        <Card 
          className={`bg-[#1A1F2E] border-2 ${
            snapshot.isDraggingOver ? 'border-purple-500 bg-purple-500/10' : 'border-[#2A2F3C]'
          } overflow-hidden transition-all duration-200`}
          ref={provided.innerRef}
          {...provided.droppableProps}
          onMouseEnter={() => handleMouseEnter(snapshot.isDraggingOver)}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className={`p-4 flex items-center justify-between ${
              !isExpanded && !snapshot.isDraggingOver && 'cursor-pointer hover:bg-secondary/50'
            }`}
            onClick={() => !snapshot.isDraggingOver && setIsExpanded(!isExpanded)}
          >
            <div className="flex items-center space-x-3">
              <Folder className={`w-6 h-6 ${snapshot.isDraggingOver ? 'text-purple-400' : 'text-purple-500'}`} />
              <h3 className="text-lg font-semibold text-white">{name}</h3>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">{boardVideos.length} videos</span>
              {!snapshot.isDraggingOver && (
                isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )
              )}
            </div>
          </div>
          {isExpanded && (
            <div className="p-4 bg-background border-t border-[#2A2F3C]">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
              {boardVideos.length === 0 && (
                <p className="text-gray-400 text-center py-4">No videos in this board yet.</p>
              )}
            </div>
          )}
          {!isExpanded && provided.placeholder}
        </Card>
      )}
    </Droppable>
  );
};