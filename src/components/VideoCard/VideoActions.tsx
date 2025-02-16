import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Tag, Trash2, X } from "lucide-react";
import { Pin } from '@/components/icons/Pin';
import { PinOff } from '@/components/icons/PinOff';

interface VideoActionsProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onAddToBoard?: () => void;
  onDelete?: () => void;
  onAddTag?: () => void;
  onAddNote?: () => void;
  boardId?: string;
  onRemoveFromBoard?: () => void;
}

export const VideoActions: React.FC<VideoActionsProps> = ({
  isPinned,
  onTogglePin,
  onAddToBoard,
  onDelete,
  onAddTag,
  onAddNote,
  boardId,
  onRemoveFromBoard,
}) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {boardId ? (
        <Button 
          variant="destructive"
          className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
          onClick={onRemoveFromBoard}
        >
          <X className="h-5 w-5" />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      ) : (
        <Button 
          variant="secondary"
          className={`w-full ${isPinned ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#2A2F3C] hover:bg-[#353B4A]'} text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2`}
          onClick={onTogglePin}
        >
          {isPinned ? (
            <>
              <PinOff className="h-5 w-5" />
              <span className="hidden sm:inline">Unpin</span>
            </>
          ) : (
            <>
              <Pin className="h-5 w-5" />
              <span className="hidden sm:inline">Pin</span>
            </>
          )}
        </Button>
      )}

      <Button 
        variant="secondary"
        className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
        onClick={onAddTag}
      >
        <Tag className="h-5 w-5" />
        <span className="hidden sm:inline">Tag</span>
      </Button>

      <Button 
        variant="destructive"
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
        onClick={onDelete}
      >
        <Trash2 className="h-5 w-5" />
        <span className="hidden sm:inline">Delete</span>
      </Button>

      <Button 
        variant="secondary"
        className="w-full col-span-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
        onClick={onAddToBoard}
      >
        <span>Add to Board</span>
      </Button>
    </div>
  );
};