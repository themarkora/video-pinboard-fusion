import React from 'react';
import { MessageSquare, Pencil, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NoteProps {
  note: string;
  isEditing: boolean;
  editedNote: string;
  onEditedNoteChange: (value: string) => void;
  onSave: () => void;
  onEdit: () => void;
  onDelete: () => void;
  maxChars: number;
}

export const Note: React.FC<NoteProps> = ({
  note,
  isEditing,
  editedNote,
  onEditedNoteChange,
  onSave,
  onEdit,
  onDelete,
  maxChars,
}) => {
  return (
    <div className="flex items-start gap-2 text-gray-300 group">
      <MessageSquare className="w-4 h-4 mt-1 shrink-0" />
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <Input
            value={editedNote}
            onChange={(e) => onEditedNoteChange(e.target.value.slice(0, maxChars))}
            className="flex-1 bg-[#1A1F2E] border-none rounded-xl h-8 text-sm text-gray-200"
            onKeyDown={(e) => e.key === 'Enter' && onSave()}
            autoFocus
            maxLength={maxChars}
          />
          <Button
            variant="secondary"
            size="sm"
            className="h-8 px-3 bg-purple-600 hover:bg-purple-700 text-white"
            onClick={onSave}
          >
            Save
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onDelete}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex-1 flex items-start justify-between">
          <p className="text-sm break-words">{note}</p>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
              onClick={onEdit}
            >
              <Pencil className="h-3 w-3 text-gray-400 hover:text-white transition-colors" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
              onClick={onDelete}
            >
              <X className="h-3 w-3 text-red-500 hover:text-red-400 transition-colors" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};