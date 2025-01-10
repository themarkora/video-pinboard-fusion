import React, { useState } from 'react';
import { MessageSquare, Pencil, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from '@/store/useVideos';
import { useToast } from '@/hooks/use-toast';

interface VideoNotesProps {
  notes: string[];
  note: string;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
  videoId: string;
}

export const VideoNotes: React.FC<VideoNotesProps> = ({
  notes,
  note,
  onNoteChange,
  onAddNote,
  videoId,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const { updateNote, deleteNote } = useVideos();
  const { toast } = useToast();
  const [showInput, setShowInput] = useState(false);

  const handleEditClick = (index: number, currentNote: string) => {
    setEditingIndex(index);
    setEditedNote(currentNote);
  };

  const handleSaveEdit = (index: number) => {
    if (editedNote.trim()) {
      updateNote(videoId, index, editedNote);
      setEditingIndex(null);
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully.",
        className: "bg-purple-600/90 text-white border-none",
      });
    }
  };

  const handleDeleteNote = (index: number) => {
    deleteNote(videoId, index);
    toast({
      title: "Note deleted",
      description: "Your note has been deleted successfully.",
      className: "bg-purple-600/90 text-white border-none",
    });
  };

  return (
    <div className="space-y-4">
      {!showInput ? (
        <button
          className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 bg-transparent hover:bg-transparent focus:outline-none group"
          onClick={() => setShowInput(true)}
        >
          <Pencil className="w-4 h-4 group-hover:text-purple-300 transition-colors duration-200" />
          <span className="group-hover:text-purple-300 transition-colors duration-200">Add Note</span>
        </button>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <textarea
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Add a note... (Press Enter to save)"
              className="w-full min-h-[100px] bg-[#1A1F2E] border border-purple-500/30 rounded-xl p-4 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onAddNote();
                  setShowInput(false);
                }
              }}
            />
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-gray-300"
                onClick={() => setShowInput(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => {
                  onAddNote();
                  setShowInput(false);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {notes && notes.length > 0 && (
        <div className="p-3 bg-[#2A2F3C] rounded-xl space-y-2">
          {notes.map((noteText, index) => (
            <div key={`${videoId}-note-${index}`} className="flex items-start gap-2 text-gray-300 group">
              <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
              {editingIndex === index ? (
                <div className="flex-1 flex gap-2">
                  <Input
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    className="flex-1 bg-[#1A1F2E] border-none rounded-xl h-8 text-sm text-gray-200"
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(index)}
                    autoFocus
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-8 px-3 bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleSaveEdit(index)}
                  >
                    Save
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => handleDeleteNote(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-start justify-between">
                  <p className="text-sm">{noteText}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => handleEditClick(index, noteText)}
                    >
                      <Pencil className="h-3 w-3 text-gray-400 hover:text-white transition-colors" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={() => handleDeleteNote(index)}
                    >
                      <X className="h-3 w-3 text-red-500 hover:text-red-400 transition-colors" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
