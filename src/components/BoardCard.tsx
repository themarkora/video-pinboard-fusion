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
  const [newName, setNewName] = useState(name);
  const { videos, renameBoard, deleteBoard } = useVideos();
  const { toast } = useToast();

  const boardVideos = videos.filter(video => video.boardIds?.includes(id));

  const handleRename = async () => {
    try {
      await renameBoard(id, newName);
      setIsRenaming(false);
      toast({
        title: "Board renamed",
        description: `Board has been renamed to "${newName}"`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to rename board",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBoard(id);
      toast({
        title: "Board deleted",
        description: "Board has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete board",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div 
            className="flex-1 flex items-center space-x-3 cursor-pointer hover:bg-secondary/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Folder className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400">{boardVideos.length} videos</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-[#2A2F3C] border-none text-white">
                <DropdownMenuItem 
                  onClick={() => setIsRenaming(true)}
                  className="hover:bg-purple-600/20 cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="hover:bg-red-600/20 cursor-pointer text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
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
      </Card>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent className="bg-[#2A2F3C] text-white border-none">
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="bg-[#1A1F2E] border-none text-white"
            placeholder="Enter new board name"
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
              disabled={!newName.trim() || newName === name}
            >
              Rename
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};