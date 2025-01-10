import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { VideoPlayer } from './VideoPlayer';
import { Video } from '@/store/useVideos';
import { useVideos } from '@/store/useVideos';
import { useToast } from './ui/use-toast';
import { VideoThumbnail } from './VideoCard/VideoThumbnail';
import { VideoNotes } from './VideoCard/VideoNotes';
import { VideoActions } from './VideoCard/VideoActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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

  const handleAddToBoard = () => {
    // This function will be passed to VideoActions
    // The dialog will be opened by the button in VideoActions
  };

  return (
    <>
      <Card className="bg-[#1A1F2E] border-none overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
        <VideoThumbnail
          thumbnail={video.thumbnail}
          title={video.title}
          onClick={() => setIsPlaying(true)}
        />
        
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-white text-lg md:text-xl line-clamp-2 min-h-[3.5rem]">
            {video.title}
          </h3>

          <VideoActions
            isPinned={video.isPinned}
            onTogglePin={() => onTogglePin(video.id)}
            onAddToBoard={handleAddToBoard}
            onDelete={() => {
              deleteVideo(video.id);
              toast({
                title: "Video deleted",
                description: "The video has been removed from your collection.",
              });
            }}
            onAddNote={() => setIsAddingNote(true)}
            boardId={boardId}
            onRemoveFromBoard={() => {
              if (boardId) {
                removeFromBoard(video.id, boardId);
                toast({
                  title: "Video removed",
                  description: "Video has been removed from the board",
                });
              }
            }}
          />

          <Dialog>
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

          <VideoNotes
            notes={video.notes || []}
            isAddingNote={isAddingNote}
            note={note}
            onNoteChange={setNote}
            onAddNote={handleAddNote}
          />
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