import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, X } from "lucide-react";
import { useVideos } from '@/store/useVideos';
import { useToast } from '@/hooks/use-toast';

interface VideoNotesProps {
  notes: string[];
  note: string;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
  videoId: string;
  showInput: boolean;
  onShowInputChange: (show: boolean) => void;
}

export const VideoNotes: React.FC<VideoNotesProps> = ({
  notes,
  note,
  onNoteChange,
  onAddNote,
  videoId,
  showInput,
  onShowInputChange,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const { updateNote, deleteNote } = useVideos();
  const { toast } = useToast();
  
  const MAX_CHARS = 25;

  const handleUpdateNote = (index: number) => {
    if (editedNote.trim()) {
      updateNote(videoId, index, editedNote);
      setEditingIndex(null);
      setEditedNote("");
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
      });
    }
  };

  const handleDeleteNote = (index: number) => {
    deleteNote(videoId, index);
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
    });
  };

  return (
    <div className="space-y-4">
      {notes.map((noteText, index) => (
        <div key={index} className="flex items-center justify-between gap-2 text-sm">
          {editingIndex === index ? (
            <input
              type="text"
              value={editedNote}
              onChange={(e) => setEditedNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUpdateNote(index);
                }
              }}
              className="flex-1 bg-transparent border-b border-purple-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <span className="flex-1 text-gray-300">{noteText}</span>
          )}
          <div className="flex items-center gap-2">
            {editingIndex === index ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingIndex(null);
                    setEditedNote("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleUpdateNote(index)}
                >
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditingIndex(index);
                    setEditedNote(noteText);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteNote(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}

      {!showInput ? (
        <button
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 bg-transparent hover:bg-transparent focus:outline-none group"
          onClick={() => onShowInputChange(true)}
        >
          <Pencil className="w-4 h-4 group-hover:text-purple-300 transition-colors duration-200" />
          <span className="group-hover:text-purple-300 transition-colors duration-200">Add Note</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add a note... (Press Enter to save)"
              className="min-h-[80px] bg-black/20 border-purple-500/50 focus:border-purple-500 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (note.trim()) {
                    onAddNote();
                  }
                }
              }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {note.length}/{MAX_CHARS}
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-300"
              onClick={() => onShowInputChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (note.trim()) {
                  onAddNote();
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};