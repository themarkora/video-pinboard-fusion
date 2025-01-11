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
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-2xl mx-auto">
      <div className="flex-1 relative">
        <Input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube video URL"
          className="w-full bg-[#2A2F3E] border-none h-12 text-gray-300 rounded-2xl text-base pr-[140px]"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          className="absolute right-0 top-0 bg-[#9334E9] hover:bg-[#7928CA] h-12 px-6 rounded-2xl min-w-[140px] transition-colors duration-200"
          disabled={isLoading || !videoUrl.trim()}
        >
          {isLoading ? (
            <Loader2 size={18} className="animate-spin mr-2 text-gray-200" />
          ) : (
            <Pin size={18} className="mr-2 text-gray-200" />
          )}
          <span className="text-base font-medium text-gray-200">Pin Video</span>
        </Button>
      </div>
    </form>
  );
}