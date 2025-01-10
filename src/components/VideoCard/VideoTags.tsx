import { X } from "lucide-react";

interface VideoTagsProps {
  tags: string[];
  onRemoveTag: (tag: string) => void;
}

export const VideoTags = ({ tags, onRemoveTag }: VideoTagsProps) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded-full text-sm flex items-center gap-1 group"
        >
          {tag}
          <button
            onClick={() => onRemoveTag(tag)}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Remove tag"
          >
            <X className="h-3 w-3 hover:text-purple-100" />
          </button>
        </span>
      ))}
    </div>
  );
};