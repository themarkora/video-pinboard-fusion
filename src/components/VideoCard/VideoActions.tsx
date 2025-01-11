import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Tag, Trash2, X } from "lucide-react";
import { Pin } from '@/components/icons/Pin';
import { PinOff } from '@/components/icons/PinOff';

interface VideoActionsProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onAddToBoard: () => void;
  onDelete: () => void;
  onAddTag?: () => void;
  boardId?: string;
  onRemoveFromBoard?: () => void;
  onAddNote?: () => void;
}

export const VideoActions: React.FC<VideoActionsProps> = ({
  isPinned,
  onTogglePin,
  onAddToBoard,
  onDelete,
  onAddTag,
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
        <div className="relative w-full h-11 rounded-xl overflow-hidden">
          <Button 
            variant="secondary"
            className={`w-full h-full flex items-center justify-center gap-2 ${
              isPinned 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-gradient-to-r from-[#2A2F3C] via-[#2A2F3C] to-purple-600'
            } text-white font-medium transition-all duration-200`}
            onClick={onTogglePin}
          >
            <div className="flex items-center gap-2">
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
            </div>
          </Button>
        </div>
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