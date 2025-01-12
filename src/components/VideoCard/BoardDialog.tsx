import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Board } from '@/store/types';

interface BoardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBoard: () => void;
  onSelectBoard: (boardId: string) => void;
  newBoardName: string;
  onNewBoardNameChange: (name: string) => void;
  boards: Board[];
}

export const BoardDialog = ({
  isOpen,
  onOpenChange,
  onCreateBoard,
  onSelectBoard,
  newBoardName,
  onNewBoardNameChange,
  boards,
}: BoardDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1F2E] border-none text-white">
        <DialogHeader>
          <DialogTitle>Add to Board</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="New board name..."
              value={newBoardName}
              onChange={(e) => onNewBoardNameChange(e.target.value)}
              className="bg-[#2A2F3C] border-none text-white"
            />
            <Button
              onClick={onCreateBoard}
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!newBoardName.trim()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
          <div className="space-y-2">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                className="w-full p-3 text-left rounded-lg bg-[#2A2F3C] hover:bg-[#3A3F4C] transition-colors"
              >
                {board.name}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};