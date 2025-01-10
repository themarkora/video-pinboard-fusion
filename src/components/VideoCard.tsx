import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, MessageSquare } from "lucide-react";
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
}

export const VideoCard = ({ video, onTogglePin }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [note, setNote] = useState('');
  const { addNote, addToBoard, deleteVideo, boards } = useVideos();
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

  return (
    <>
      <Card className="bg-[#1A1F2E] border-none overflow-hidden">
        <div 
          className="relative aspect-video cursor-pointer" 
          onClick={() => setIsPlaying(true)}
        >
          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-white text-xl line-clamp-2">{video.title}</h3>
          
          {video.notes && video.notes.length > 0 && (
            <div className="p-3 bg-[#2A2F3C] rounded-lg space-y-2">
              {video.notes.map((note, index) => (
                <div key={index} className="flex items-start gap-2 text-gray-300">
                  <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
                  <p className="text-sm">{note}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="secondary"
              className="w-full bg-[#9334E9] hover:bg-[#9334E9]/80 text-white h-10 rounded-md font-medium transition-colors"
              onClick={() => onTogglePin(video.id)}
            >
              {video.isPinned ? (
                <>
                  <PinOff className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Unpin</span>
                </>
              ) : (
                <>
                  <Pin className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Pin</span>
                </>
              )}
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="secondary"
                  className="w-full bg-[#9334E9] hover:bg-[#9334E9]/80 text-white h-10 rounded-md font-medium transition-colors"
                >
                  <Plus className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add to Board</span>
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
                      className="w-full justify-start"
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
                      className="bg-secondary/50 border-none"
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
              className="w-full bg-[#ea384c] hover:bg-[#ea384c]/80 h-10 rounded-md font-medium transition-colors"
              onClick={() => {
                deleteVideo(video.id);
                toast({
                  title: "Video deleted",
                  description: "The video has been removed from your collection.",
                });
              }}
            >
              <Trash2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Delete</span>
            </Button>
          </div>

          <Button 
            variant="secondary"
            className="w-full bg-[#2A2F3C] hover:bg-[#2A2F3C]/80 text-gray-300 h-10 rounded-md font-medium transition-colors"
            onClick={() => setIsAddingNote(true)}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Note
          </Button>

          {isAddingNote && (
            <div className="flex gap-2">
              <Input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note..."
                className="bg-secondary/50 border-none"
                onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
              />
              <Button
                variant="secondary"
                onClick={handleAddNote}
              >
                Add
              </Button>
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