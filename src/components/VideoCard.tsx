import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { VideoPlayer } from './VideoPlayer';
import { Video } from '@/store/useVideos';
import { useVideos } from '@/store/useVideos';
import { useToast } from '@/hooks/use-toast';
import { VideoThumbnail } from './VideoCard/VideoThumbnail';
import { VideoNotes } from './VideoCard/VideoNotes';
import { VideoActions } from './VideoCard/VideoActions';
import { VideoTags } from './VideoCard/VideoTags';
import { TagDialog } from './VideoCard/TagDialog';
import { BoardDialog } from './VideoCard/BoardDialog';
import { Check } from "lucide-react";

interface VideoCardProps {
  video: Video;
  onTogglePin: (id: string) => void;
  boardId?: string;
}

export const VideoCard = ({ video, onTogglePin, boardId }: VideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const { addNote, addToBoard, deleteVideo, boards, removeFromBoard, addTag, removeTag } = useVideos();
  const [newBoardName, setNewBoardName] = useState('');
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isBoardDialogOpen, setIsBoardDialogOpen] = useState(false);
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
      className: "bg-toast text-white border-none",
      action: (
        <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-white" />
        </div>
      ),
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      className: "bg-toast-destructive text-white border-none",
    });
  };

  const handleAddNote = () => {
    if (note.trim()) {
      addNote(video.id, note);
      setNote('');
      setShowNoteInput(false);
      showSuccessToast(
        "Note added",
        "Your note has been added successfully."
      );
    }
  };

  const handleCreateBoard = () => {
    if (newBoardName.trim()) {
      const boardId = useVideos.getState().addBoard(newBoardName);
      addToBoard(video.id, boardId);
      setNewBoardName('');
      setIsBoardDialogOpen(false);
      showSuccessToast(
        "Board created",
        `Video added to new board "${newBoardName}"`
      );
    }
  };

  const handleRemoveTag = (tag: string) => {
    removeTag(video.id, tag);
    showSuccessToast(
      "Tag removed",
      "The tag has been removed successfully."
    );
  };

  const handleSelectBoard = (boardId: string) => {
    addToBoard(video.id, boardId);
    setIsBoardDialogOpen(false);
    const selectedBoard = boards.find(b => b.id === boardId);
    if (selectedBoard) {
      showSuccessToast(
        "Video added",
        `Video added to board "${selectedBoard.name}"`
      );
    }
  };

  const handleAddTag = (tag: string) => {
    addTag(video.id, tag);
    setNewTag('');
    setIsTagDialogOpen(false);
    showSuccessToast(
      "Tag added",
      "Your tag has been added successfully."
    );
  };

  const allTags = Array.from(
    new Set(
      useVideos
        .getState()
        .videos.flatMap((v) => v.tags || [])
    )
  );

  return (
    <>
      <Card className="bg-[#1A1F2E] border-none overflow-hidden transition-transform duration-200 hover:scale-[1.02] h-fit">
        <VideoThumbnail
          thumbnail={video.thumbnail}
          title={video.title}
          onClick={() => setIsPlaying(true)}
        />
        
        <div className="p-4 space-y-4">
          <h3 className="font-semibold text-white text-lg md:text-xl line-clamp-2">
            {video.title}
          </h3>

          <VideoTags tags={video.tags} onRemoveTag={handleRemoveTag} />

          <VideoActions
            isPinned={video.isPinned}
            onTogglePin={() => onTogglePin(video.id)}
            onAddToBoard={() => setIsBoardDialogOpen(true)}
            onDelete={() => {
              deleteVideo(video.id);
              showSuccessToast(
                "Video deleted",
                "The video has been removed from your collection."
              );
            }}
            onAddTag={() => setIsTagDialogOpen(true)}
            boardId={boardId}
            onRemoveFromBoard={() => {
              if (boardId) {
                removeFromBoard(video.id, boardId);
                showSuccessToast(
                  "Video removed",
                  "Video has been removed from the board"
                );
              }
            }}
          />

          <VideoNotes
            notes={video.notes || []}
            note={note}
            onNoteChange={setNote}
            onAddNote={handleAddNote}
            videoId={video.id}
            showInput={showNoteInput}
            onShowInput={setShowNoteInput}
          />
        </div>
      </Card>

      <TagDialog
        isOpen={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
        onAddTag={handleAddTag}
        onSelectTag={handleAddTag}
        newTag={newTag}
        onNewTagChange={setNewTag}
        existingTags={Array.from(new Set(useVideos.getState().videos.flatMap((v) => v.tags || [])))}
      />

      <BoardDialog
        isOpen={isBoardDialogOpen}
        onOpenChange={setIsBoardDialogOpen}
        onCreateBoard={handleCreateBoard}
        onSelectBoard={handleSelectBoard}
        newBoardName={newBoardName}
        onNewBoardNameChange={setNewBoardName}
        boards={boards}
      />

      <VideoPlayer
        videoId={video.id}
        isOpen={isPlaying}
        onClose={() => setIsPlaying(false)}
      />
    </>
  );
};