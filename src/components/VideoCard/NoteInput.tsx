import React from 'react';
import { Button } from "@/components/ui/button";

interface NoteInputProps {
  note: string;
  onNoteChange: (value: string) => void;
  onAddNote: () => void;
  onCancel: () => void;
  maxChars: number;
}

export const NoteInput: React.FC<NoteInputProps> = ({
  note,
  onNoteChange,
  onAddNote,
  onCancel,
  maxChars,
}) => {
  const handleNoteChange = (value: string) => {
    if (value.length <= maxChars) {
      onNoteChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Add a note... (Press Enter to save)"
          className="w-full min-h-[100px] bg-[#1A1F2E] border border-purple-500/30 rounded-xl p-4 text-gray-200 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (note.trim()) {
                onAddNote();
              }
            }
          }}
          maxLength={maxChars}
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {note.length}/{maxChars}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-gray-300"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
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
      </div>
    </div>
  );
};