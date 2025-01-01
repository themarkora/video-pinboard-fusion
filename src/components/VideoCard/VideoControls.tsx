import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface VideoControlsProps {
  videoId: string;
  votes: number;
  views: number;
  hasVoted: boolean;
  onVote: () => void;
}

export const VideoControls = ({ votes = 0, views = 0, hasVoted, onVote }: VideoControlsProps) => {
  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasVoted) {
      toast({
        title: "Already voted",
        description: "You have already voted for this video",
        variant: "destructive",
      });
      return;
    }

    onVote();
    toast({
      title: "Vote recorded",
      description: "Your vote has been recorded",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1 text-gray-400">
          <Eye className="w-4 h-4" />
          <span>{views} views</span>
        </div>
      </div>
      <button
        onClick={handleVote}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-2 rounded-full transition-all duration-300",
          hasVoted
            ? "bg-gray-800 text-primary"
            : "bg-primary hover:bg-primary/90 text-white",
          "transform hover:scale-105"
        )}
        disabled={hasVoted}
      >
        <Heart
          className={cn(
            "w-4 h-4 transition-transform duration-300",
            hasVoted && "fill-primary",
            !hasVoted && "hover:scale-110"
          )}
        />
        <span className="font-medium">
          {hasVoted ? 'Voted' : 'Vote'} • {votes}
        </span>
      </button>
    </div>
  );
};