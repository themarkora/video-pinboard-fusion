import React from 'react';
import { Button } from "@/components/ui/button";
import { Pin, PinOff, Trash2, MessageSquare, FolderPlus } from 'lucide-react';

interface VideoActionsProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete: () => void;
  onAddNote: () => void;
  onAddToBoard: () => void;
}

export const VideoActions: React.FC<VideoActionsProps> = ({
  isPinned,
  onTogglePin,
  onDelete,
  onAddNote,
  onAddToBoard,
}) => {
  return (
    <div className="p-4 space-y-2">
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className={`flex-1 ${isPinned ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#2A2F3C] hover:bg-[#353B4A]'}`}
          onClick={onTogglePin}
        >
          {isPinned ? (
            <>
              <PinOff className="mr-2 h-4 w-4" />
              Unpin
            </>
          ) : (
            <>
              <Pin className="mr-2 h-4 w-4" />
              Pin
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          className="flex-1 bg-[#2A2F3C] hover:bg-[#353B4A]"
          onClick={onAddToBoard}
        >
          <FolderPlus className="mr-2 h-4 w-4" />
          Add to Board
        </Button>
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          className="flex-1 bg-[#2A2F3C] hover:bg-[#353B4A]"
          onClick={onAddNote}
        >
          <MessageSquare className="mr-2 h-4 w-4" />
          Add Note
        </Button>
        <Button
          variant="destructive"
          className="flex-1"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
};