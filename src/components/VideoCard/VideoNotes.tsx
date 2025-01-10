import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface VideoNotesProps {
  notes: string[];
  isAddingNote: boolean;
  note: string;
  onNoteChange: (note: string) => void;
  onAddNote: () => void;
}

export const VideoNotes: React.FC<VideoNotesProps> = ({
  notes,
  isAddingNote,
  note,
  onNoteChange,
  onAddNote,
}) => {
  return (
    <>
      {isAddingNote && (
        <div className="flex gap-2">
          <Input
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder="Add a note..."
            className="bg-secondary/50 border-none rounded-xl flex-1"
            onKeyDown={(e) => e.key === 'Enter' && onAddNote()}
          />
          <Button
            variant="secondary"
            className="rounded-xl whitespace-nowrap"
            onClick={onAddNote}
          >
            Add
          </Button>
        </div>
      )}
      
      {notes && notes.length > 0 && (
        <div className="p-3 bg-[#2A2F3C] rounded-xl space-y-2">
          {notes.map((note, index) => (
            <div key={index} className="flex items-start gap-2 text-gray-300">
              <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
              <p className="text-sm">{note}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};