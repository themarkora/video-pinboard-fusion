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
  const { videos, reorderVideosInBoard } = useVideos();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const boardVideos = videos.filter(video => video.boardIds?.includes(id));

  const handleDragEnter = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  return (
    <Card 
      className={`bg-[#1A1F2E] border-2 transition-colors duration-200 ${
        isDraggingOver 
          ? 'border-purple-500 bg-purple-500/10' 
          : 'border-[#2A2F3C]'
      } overflow-hidden`}
      onDragEnter={handleDragEnter}
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
      <Droppable 
        droppableId={id} 
        type="VIDEO"
        isDropDisabled={!isExpanded}
      >
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`transition-all duration-200 ${
              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
            onDragEnter={() => setIsDraggingOver(true)}
            onDragLeave={() => setIsDraggingOver(false)}
            onDragEnd={() => setIsDraggingOver(false)}
          >
            <div className="p-4 bg-background border-t border-[#2A2F3C]">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {boardVideos.map((video, index) => (
                  <Draggable key={video.id} draggableId={video.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none',
                        }}
                      >
                        <div style={{ opacity: snapshot.isDragging ? 0.5 : 1 }}>
                          <VideoCard video={video} onTogglePin={() => {}} boardId={id} />
                        </div>
                        {snapshot.isDragging && (
                          <div
                            style={{
                              position: 'fixed',
                              pointerEvents: 'none',
                              width: 'auto',
                              height: 'auto',
                              top: 0,
                              left: 0,
                              transform: provided.draggableProps.style?.transform,
                            }}
                          >
                            <VideoCard video={video} onTogglePin={() => {}} boardId={id} />
                          </div>
                        )}
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
          </div>
        )}
      </Droppable>
    </Card>
  );
};