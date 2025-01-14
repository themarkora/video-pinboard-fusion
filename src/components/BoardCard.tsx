import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Folder, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { VideoCard } from './VideoCard';
import { useVideos } from '@/store/useVideos';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface BoardCardProps {
  id: string;
  name: string;
}

export const BoardCard = ({ id, name }: BoardCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newBoardName, setNewBoardName] = useState(name);
  const { videos, deleteBoard } = useVideos();
  const { toast } = useToast();

  const boardVideos = videos.filter(video => video.boardIds?.includes(id));

  const handleRename = () => {
    if (newBoardName.trim() && newBoardName !== name) {
      // Update board name logic will be implemented here
      setIsRenaming(false);
      toast({
        title: "Board renamed",
        description: `Board renamed to "${newBoardName}"`,
        className: "bg-toast text-white border-none",
      });
    }
  };

  const handleDelete = () => {
    deleteBoard(id);
    toast({
      title: "Board deleted",
      description: "The board has been deleted",
      className: "bg-toast text-white border-none",
    });
  };

  return (
    <Card className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div 
          className="flex-1 flex items-center space-x-3 cursor-pointer hover:bg-secondary/50"
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#2A2F3C] border-[#3A3F4C] text-white">
            <DropdownMenuItem 
              onClick={() => setIsRenaming(true)}
              className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50"
            >
              <Pencil className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={handleDelete}
              className="flex items-center gap-2 cursor-pointer text-red-400 hover:bg-secondary/50 hover:text-red-400"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isExpanded && (
        <div className="p-4 bg-background border-t border-[#2A2F3C]">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {boardVideos.map((video) => (
              <VideoCard key={video.id} video={video} onTogglePin={() => {}} boardId={id} />
            ))}
          </div>
          {boardVideos.length === 0 && (
            <p className="text-gray-400 text-center py-4">No videos in this board yet.</p>
          )}
        </div>
      )}

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
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
              onClick={() => setIsRenaming(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={!newBoardName.trim() || newBoardName === name}
            >
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};