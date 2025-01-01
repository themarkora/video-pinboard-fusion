import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
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
        await addVideo(videoUrl.trim());
        setVideoUrl('');
        toast({
          title: "Video added successfully",
          description: "Your video has been pinned to your collection.",
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
      <Input
        type="text"
        value={videoUrl}
        onChange={(e) => setVideoUrl(e.target.value)}
        placeholder="Paste YouTube video URL"
        className="flex-1 bg-[#1A1F2E] border-none h-12 text-gray-300"
        disabled={isLoading}
      />
      <Button 
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 h-12 px-6"
        disabled={isLoading || !videoUrl.trim()}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin mr-2" />
        ) : (
          <Plus size={18} className="mr-2" />
        )}
        Pin Video
      </Button>
    </form>
  );
}