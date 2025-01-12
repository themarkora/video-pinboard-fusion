import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Folder, Edit, Trash } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { VideoCard } from './VideoCard';
import { useVideos } from '@/store/useVideos';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "./ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface BoardCardProps {
  id: string;
  name: string;
}

export const BoardCard = ({ id, name }: BoardCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState(name);
  const { videos, deleteBoard, renameBoard } = useVideos();
  const { toast } = useToast();

  const boardVideos = videos.filter(video => video.boardIds?.includes(id));

  const handleDelete = () => {
    deleteBoard(id);
    toast({
      title: "Board deleted",
      description: "The board has been successfully deleted",
    });
  };

  const handleRename = () => {
    if (newBoardName.trim() && newBoardName !== name) {
      renameBoard(id, newBoardName.trim());
      setIsEditDialogOpen(false);
      toast({
        title: "Board renamed",
        description: `Board renamed to "${newBoardName}"`,
      });
    }
  };

  return (
    <>
      <Card className="bg-[#1A1F2E] border-2 border-[#2A2F3C] overflow-hidden">
        <div className="p-4 flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 flex-1 cursor-pointer hover:bg-secondary/50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Folder className="w-6 h-6 text-purple-500" />
            <h3 className="text-lg font-semibold text-white">{name}</h3>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-400">{boardVideos.length} videos</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditDialogOpen(true);
              }}
              className="h-8 w-8 p-0 hover:bg-secondary/50"
            >
              <Edit className="h-4 w-4 text-gray-400" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteDialogOpen(true);
              }}
              className="h-8 w-8 p-0 hover:bg-secondary/50"
            >
              <Trash className="h-4 w-4 text-red-400" />
            </Button>
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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-[#2A2F3C] text-white border-none">
          <DialogHeader>
            <DialogTitle>Rename Board</DialogTitle>
          </DialogHeader>
          <Input
            type="text"
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
              onClick={() => setIsEditDialogOpen(false)}
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#2A2F3C] text-white border-none">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Board</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this board? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary hover:bg-secondary/80">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};