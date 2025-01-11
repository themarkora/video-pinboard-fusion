import { Button } from "@/components/ui/button";
import { Pin, PinOff, Trash2, Plus, Tag } from "lucide-react";
import { toast } from "sonner";

export interface VideoActionsProps {
  isPinned: boolean;
  onTogglePin: () => void;
  onDelete?: () => void;
  onAddToBoard?: () => void;
  onAddTag?: () => void;
  boardId?: string;
  onRemoveFromBoard?: () => void;
}

export const VideoActions = ({ 
  isPinned, 
  onTogglePin,
  onDelete,
  onAddToBoard,
  onAddTag,
  boardId,
  onRemoveFromBoard 
}: VideoActionsProps) => {
  const handleTogglePin = async () => {
    try {
      await onTogglePin();
      toast.success(isPinned ? "Video unpinned" : "Video pinned");
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast.error("Failed to toggle pin status");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="secondary"
        className={`w-full ${isPinned ? 'bg-purple-600 hover:bg-purple-700' : 'bg-[#2A2F3C] hover:bg-[#353B4A]'} text-white rounded-xl h-11 font-medium transition-all duration-200 flex items-center justify-center gap-2`}
        onClick={handleTogglePin}
      >
        {isPinned ? (
          <>
            <PinOff className="w-4 h-4" />
            Unpin
          </>
        ) : (
          <>
            <Pin className="w-4 h-4" />
            Pin
          </>
        )}
      </Button>

      {onAddToBoard && (
        <Button
          variant="secondary"
          className="w-full bg-[#2A2F3C] hover:bg-[#353B4A] text-white rounded-xl h-11 font-medium"
          onClick={onAddToBoard}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Board
        </Button>
      )}

      {onAddTag && (
        <Button
          variant="secondary"
          className="w-full bg-[#2A2F3C] hover:bg-[#353B4A] text-white rounded-xl h-11 font-medium"
          onClick={onAddTag}
        >
          <Tag className="w-4 h-4 mr-2" />
          Add Tag
        </Button>
      )}

      {boardId && onRemoveFromBoard && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={onRemoveFromBoard}
        >
          Remove from Board
        </Button>
      )}

      {onDelete && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={onDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </Button>
      )}
    </div>
  );
};