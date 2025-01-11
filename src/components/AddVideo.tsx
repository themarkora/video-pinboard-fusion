import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Pin } from '@/components/icons/Pin';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/components/ui/use-toast";

export function AddVideo() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addVideo } = useVideos();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoUrl.trim() && !isLoading) {
      setIsLoading(true);
      try {
        await addVideo(videoUrl.trim(), true);
        setVideoUrl('');
        toast({
          title: "Video pinned successfully",
          description: "Your video has been added to your collection.",
        });
      } catch (error) {
        toast({
          title: "Error adding video",
          description: "Please check the URL and try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl mx-auto">
      <div className="flex-1 relative">
        <Input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube video URL"
          className="w-full bg-[#1A1F2E] border-none h-12 text-gray-300 rounded-l-2xl rounded-r-none text-base pr-4"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit"
        className="h-12 rounded-l-none rounded-r-2xl flex items-center justify-center gap-2 text-white font-medium transition-all duration-200 p-0 overflow-hidden bg-purple-600 hover:bg-purple-700 min-w-[120px]"
        disabled={isLoading || !videoUrl.trim()}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Pin size={18} />
        )}
        <span>Pin Video</span>
      </Button>
    </form>
  );
}