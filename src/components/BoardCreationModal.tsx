import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/components/ui/use-toast";

interface BoardCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
}

export const BoardCreationModal: React.FC<BoardCreationModalProps> = ({ 
  isOpen, 
  onClose, 
  videoId 
}) => {
  const [boardName, setBoardName] = useState('');
  const { addBoard, addToBoard } = useVideos();
  const { toast } = useToast();

  const handleCreateBoard = () => {
    if (boardName.trim()) {
      const boardId = addBoard(boardName.trim());
      addToBoard(videoId, boardId);
      setBoardName('');
      onClose();
      toast({
        title: "Board created",
        description: `Video added to "${boardName}"`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#2A2F3C] text-white border-none">
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <Input
          type="text"
          value={boardName}
          onChange={(e) => setBoardName(e.target.value)}
          placeholder="Enter board name"
          className="bg-secondary/50 border-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateBoard();
            }
          }}
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateBoard}
            disabled={!boardName.trim()}
          >
            Create Board
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};