import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Pin } from '@/components/icons/Pin';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/hooks/use-toast";
import { Check, AlertCircle } from 'lucide-react';

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
          className: "bg-[#492A81] text-white border-none",
          action: (
            <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ),
        });
      } catch (error) {
        toast({
          title: "Error adding video",
          description: "Please check the URL and try again.",
          variant: "destructive",
          className: "bg-red-600 text-white border-none",
          action: (
            <div className="h-6 w-6 bg-white/20 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-white" />
            </div>
          ),
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
        className="flex-1 bg-[#2A2F3E] border-none h-12 text-gray-300 rounded-2xl text-base"
        disabled={isLoading}
      />
      <Button 
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 h-12 px-4 rounded-2xl min-w-[120px]"
        disabled={isLoading || !videoUrl.trim()}
      >
        {isLoading ? (
          <Loader2 size={18} className="animate-spin mr-0.5" />
        ) : (
          <Pin size={18} className="mr-0.5" />
        )}
        Pin Video
      </Button>
    </form>
  );
}