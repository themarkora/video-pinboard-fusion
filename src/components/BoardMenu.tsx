import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/hooks/use-toast";

interface BoardMenuProps {
  boardId: string;
  boardName: string;
}

export const BoardMenu = ({ boardId, boardName }: BoardMenuProps) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [newName, setNewName] = useState(boardName);
  const { renameBoard, deleteBoard } = useVideos();
  const { toast } = useToast();

  const handleRename = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    try {
      if (newName.trim() && newName !== boardName) {
        await renameBoard(boardId, newName.trim());
        toast({
          title: "Board renamed",
          description: `Board has been renamed to "${newName}"`,
          className: "bg-toast text-white border-none",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename board. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRenameOpen(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await deleteBoard(boardId);
      toast({
        title: "Board deleted",
        description: "Board has been deleted successfully",
        className: "bg-toast text-white border-none",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete board. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger 
          className="focus:outline-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <MoreHorizontal className="h-5 w-5 text-gray-400 hover:text-gray-300" />
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end"
          className="bg-[#2A2F3C] border-[#3A3F4C] text-white"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DropdownMenuItem
            className="flex items-center gap-2 focus:bg-purple-600 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsRenameOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2 focus:bg-purple-600 text-red-400 focus:text-white cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog 
        open={isRenameOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setNewName(boardName);
          }
          setIsRenameOpen(open);
        }}
      >
        <DialogContent 
          className="bg-[#2A2F3C] text-white border-none"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter new board name"
            className="bg-secondary/50 border-none"
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') {
                handleRename();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsRenameOpen(false);
                setNewName(boardName);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newName.trim() || newName === boardName}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};