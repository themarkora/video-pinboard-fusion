import React, { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { Pin } from '@/components/icons/Pin';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVideos } from '@/store/useVideos';
import { useToast } from "@/hooks/use-toast";

const isValidYouTubeUrl = (url: string) => {
  const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
  return pattern.test(url);
};

export function AddVideo() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { addVideo } = useVideos();
  const { toast } = useToast();

  const showSuccessToast = (title: string, description: string) => {
    toast({
      title,
      description,
      className: "bg-toast text-white border-none",
      action: (
        <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
          <Check className="h-5 w-5 text-white" />
        </div>
      ),
    });
  };

  const showErrorToast = (title: string, description: string) => {
    toast({
      title,
      description,
      variant: "destructive",
      className: "bg-toast-destructive text-white border-none",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = videoUrl.trim();
    
    if (!trimmedUrl) {
      showErrorToast(
        "URL Required",
        "Please enter a YouTube video URL."
      );
      return;
    }

    if (!isValidYouTubeUrl(trimmedUrl)) {
      showErrorToast(
        "Invalid URL",
        "Please enter a valid YouTube video URL."
      );
      return;
    }

    if (!isLoading) {
      setIsLoading(true);
      try {
        await addVideo(trimmedUrl, true);
        setVideoUrl('');
        showSuccessToast(
          "Video pinned successfully",
          "Your video has been added to your collection."
        );
      } catch (error: any) {
        console.error('Error adding video:', error);
        
        if (error.message?.includes('already exists')) {
          showErrorToast(
            "Video already in collection",
            "This video is already in your collection. Try adding another one!"
          );
        } else {
          showErrorToast(
            "Error adding video",
            "There was a problem adding your video. Please try again."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste YouTube video URL"
          className="flex-1 bg-[#2A2F3E] border-none h-12 text-gray-300 rounded-2xl text-base pr-[140px] focus-visible:ring-[0.7px] focus-visible:ring-gray-400"
          disabled={isLoading}
        />
        <Button 
          type="submit"
          className="absolute right-0 top-0 h-full bg-purple-600 hover:bg-purple-700 px-6 rounded-r-2xl rounded-l-none gap-2 text-gray-200 transition-colors"
          disabled={isLoading || !videoUrl.trim()}
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-gray-200" />
          ) : (
            <Pin className="h-5 w-5 text-gray-200" />
          )}
          <span className="text-gray-200">Pin Video</span>
        </Button>
      </div>
    </form>
  );
}