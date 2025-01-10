import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare } from 'lucide-react';
import { useVideos } from '@/store/useVideos';

interface VideoNotesProps {
  videoId: string;
  notes?: string[];
}

export const VideoNotes = ({ videoId, notes = [] }: VideoNotesProps) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [note, setNote] = useState('');
  const { addNote } = useVideos();

  const handleAddNote = () => {
    if (note.trim()) {
      addNote(videoId, note);
      setNote('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="space-y-3">
      {notes.map((note, index) => (
        <div key={index} className="flex items-start gap-2 text-gray-300">
          <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
          <p>{note}</p>
        </div>
      ))}
      
      {isAddingNote ? (
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
      ) : (
        <Button 
          variant="secondary"
          className="w-full"
          onClick={() => setIsAddingNote(true)}
        >
          <MessageSquare className="mr-2 h-5 w-5" />
          Add Note
        </Button>
      )}
    </div>
  );
};