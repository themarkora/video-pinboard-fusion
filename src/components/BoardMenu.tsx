import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from "@/store/useVideos";
import { toast } from "sonner";

interface BoardMenuProps {
  boardId: string;
  boardName: string;
}

export const BoardMenu = ({ boardId, boardName }: BoardMenuProps) => {
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState(boardName);
  const { renameBoard, deleteBoard } = useVideos();

  const handleRename = async () => {
    if (newBoardName.trim() && newBoardName !== boardName) {
      await renameBoard(boardId, newBoardName.trim());
      toast.success("Board renamed successfully");
      setIsRenameDialogOpen(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      await deleteBoard(boardId);
      toast.success("Board deleted successfully");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <MoreVertical className="h-5 w-5 text-gray-400 hover:text-gray-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#2A2F3C] border-[#1A1F2E]">
          <DropdownMenuItem
            onClick={() => setIsRenameDialogOpen(true)}
            className="text-gray-200 focus:text-white focus:bg-purple-600/20 cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-400 focus:text-red-400 focus:bg-red-600/20 cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="bg-[#2A2F3C] text-white border-none">
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <Input
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Enter new board name"
            className="bg-secondary/50 border-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRename();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsRenameDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newBoardName.trim() || newBoardName === boardName}
            >
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};