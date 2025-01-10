import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { VideoPlayer } from './VideoPlayer';
import { Video } from '@/store/useVideos';
import { useVideos } from '@/store/useVideos';
import { useToast } from './ui/use-toast';
import { VideoThumbnail } from './VideoCard/VideoThumbnail';
import { VideoNotes } from './VideoCard/VideoNotes';
import { VideoActions } from './VideoCard/VideoActions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
  boardId?: string;
}

export const VideoCard = ({ video, onTogglePin, boardId }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [note, setNote] = useState('');
  const { addNote, addToBoard, deleteVideo, boards, removeFromBoard, addTag } = useVideos();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
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

  const handleAddTag = () => {
    setIsTagDialogOpen(true);
  };

  const handleTagSubmit = () => {
    if (newTag.trim()) {
      addTag(video.id, newTag.trim());
      setNewTag('');
      setIsTagDialogOpen(false);
      toast({
        title: "Tag added",
        description: "Your tag has been added successfully.",
      });
    }
  };

  const handleSelectTag = (tag: string) => {
    if (tag) {
      addTag(video.id, tag);
      setIsTagDialogOpen(false);
      toast({
        title: "Tag added",
        description: "Selected tag has been added to the video.",
      });
    }
  };

  // Get all unique tags from all videos
  const allTags = Array.from(
    new Set(
      useVideos
        .getState()
        .videos.flatMap((v) => v.tags || [])
    )
  );

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

          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {video.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

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
            onAddTag={handleAddTag}
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

          <Dialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen}>
            <DialogContent className="bg-[#2A2F3C] text-white border-none">
              <DialogHeader>
                <DialogTitle>Add Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {allTags.length > 0 && (
                  <Select onValueChange={handleSelectTag}>
                    <SelectTrigger className="bg-secondary/50 border-none">
                      <SelectValue placeholder="Select existing tag" />
                    </SelectTrigger>
                    <SelectContent>
                      {allTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <div className="flex gap-2">
                  <Input
                    placeholder="Create new tag..."
                    className="bg-secondary/50 border-none rounded-xl"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTagSubmit();
                      }
                    }}
                  />
                  <Button
                    variant="secondary"
                    className="rounded-xl"
                    onClick={handleTagSubmit}
                  >
                    Add
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
