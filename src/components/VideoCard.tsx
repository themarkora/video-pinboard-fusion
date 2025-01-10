import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, MessageSquare, X } from "lucide-react";
import { VideoPlayer } from './VideoPlayer';
import { Video } from '@/store/useVideos';
import { Pin } from './icons/Pin';
import { PinOff } from './icons/PinOff';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { useVideos } from '@/store/useVideos';
import { useToast } from './ui/use-toast';

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
  boardId?: string;
}

export const VideoCard = ({ video, onTogglePin, boardId }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [note, setNote] = useState('');
  const { addNote, addToBoard, deleteVideo, boards, removeFromBoard } = useVideos();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const { toast } = useToast();

  const handleAddNote = () => {
    if (note.trim()) {
      addNote(video.id, note);
      setNote('');
      setIsAddingNote(false);
      toast({
        title: "Note added",
        description: "Your note has been saved successfully.",
      });
    }
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      const boardId = useVideos.getState().addBoard(newBoardName);
      addToBoard(video.id, boardId);
      setNewBoardName('');
      toast({
        title: "Board created",
        description: `Video added to new board "${newBoardName}"`,
      });
    }
  };

  const handleRemoveFromBoard = () => {
    if (boardId) {
      removeFromBoard(video.id, boardId);
      toast({
        title: "Video removed",
        description: "Video has been removed from the board",
      });
    }
  };

  return (
    <>
      <Card className="bg-[#1A1F2E] border-none overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
        <div 
          className="relative aspect-video cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img 
            src={video.thumbnail} 
            alt={video.title} 
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" 
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <div className="text-white text-lg font-medium">Play Video</div>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-white text-lg md:text-xl line-clamp-2 min-h-[3.5rem]">
            {video.title}
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {boardId ? (
              <Button 
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                onClick={handleRemoveFromBoard}
              >
                <X className="h-5 w-5" />
                <span className="hidden sm:inline">Remove</span>
              </Button>
            ) : (
              <Button 
                variant="secondary"
                className={`w-full ${video.isPinned ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#2A2F3C] hover:bg-[#353B4A]'} text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2`}
                onClick={() => onTogglePin(video.id)}
              >
                {video.isPinned ? (
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

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline">Add</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#2A2F3C] text-white border-none">
                <DialogHeader>
                  <DialogTitle>Select or Create Board</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {boards.map((board) => (
                    <Button
                      key={board.id}
                      variant="secondary"
                      className="w-full justify-start rounded-xl"
                      onClick={() => {
                        addToBoard(video.id, board.id);
                        toast({
                          title: "Video added to board",
                          description: `Added to "${board.name}"`,
                        });
                      }}
                    >
                      {board.name}
                    </Button>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Create new board..."
                      className="bg-secondary/50 border-none rounded-xl"
                      value={newBoardName}
                      onChange={(e) => setNewBoardName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCreateBoard();
                        }
                      }}
                    />
                    <Button
                      variant="secondary"
                      className="rounded-xl"
                      onClick={handleCreateBoard}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
              onClick={() => {
                deleteVideo(video.id);
                toast({
                  title: "Video deleted",
                  description: "The video has been removed from your collection.",
                });
              }}
            >
              <Trash2 className="h-5 w-5" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>

          <Button 
            variant="secondary"
            className="w-full bg-[#2A2F3C] hover:bg-[#353B4A] text-gray-300 rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => setIsAddingNote(true)}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Add Note</span>
          </Button>

          {isAddingNote && (
            <div className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="bg-secondary/50 border-none rounded-xl flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <Button
                variant="secondary"
                className="rounded-xl whitespace-nowrap"
                onClick={handleAddNote}
              >
                Add
              </Button>
            </div>
          )}
          
          {video.notes && video.notes.length > 0 && (
            <div className="p-3 bg-[#2A2F3C] rounded-xl space-y-2">
              {video.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-300">
                  <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
                  <p className="text-sm">{note}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
      <VideoPlayer
        videoId={video.id}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
      />
    </>
  );
};