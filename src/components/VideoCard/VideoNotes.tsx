import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { useVideos } from '@/store/useVideos';
import { useToast } from '@/hooks/use-toast';
import { NoteInput } from './NoteInput';
import { Note } from './Note';

interface VideoNotesProps {
  notes: string[];
  note: string;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
  videoId: string;
  showInput: boolean;
  onShowInput: (show: boolean) => void;
}

export const VideoNotes: React.FC<VideoNotesProps> = ({
  notes,
  note,
  onNoteChange,
  onAddNote,
  videoId,
  showInput,
  onShowInput,
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedNote, setEditedNote] = useState("");
  const { updateNote, deleteNote } = useVideos();
  const { toast } = useToast();
  
  const MAX_CHARS = 25;

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
          onClick={() => onShowInput(true)}
        >
          <Pencil className="w-4 h-4 group-hover:text-purple-300 transition-colors duration-200" />
          <span className="group-hover:text-purple-300 transition-colors duration-200">Add Note</span>
        </button>
      ) : (
        <NoteInput
          note={note}
          onNoteChange={onNoteChange}
          onAddNote={onAddNote}
          onCancel={() => onShowInput(false)}
          maxChars={MAX_CHARS}
        />
      )}
      
      {notes && notes.length > 0 && (
        <div className="p-3 bg-[#2A2F3C] rounded-xl space-y-2">
          {notes.map((noteText, index) => (
            <Note
              key={`${videoId}-note-${index}`}
              note={noteText}
              isEditing={editingIndex === index}
              editedNote={editedNote}
              onEditedNoteChange={setEditedNote}
              onSave={() => handleSaveEdit(index)}
              onEdit={() => handleEditClick(index, noteText)}
              onDelete={() => handleDeleteNote(index)}
              maxChars={MAX_CHARS}
            />
          ))}
        </div>
      )}
    </div>
  );
};