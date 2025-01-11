import { Video } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("Please sign in to add videos");
      throw new Error('User not authenticated');
    }

    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const details = await fetchVideoDetails(videoId);

    const newVideo = {
      id: videoId,
      user_id: session.user.id,
      url,
      title: details.title,
      thumbnail: details.thumbnail,
      is_pinned: true,
      added_at: new Date().toISOString(),
      notes: [],
      board_ids: [],
      views: 0,
      votes: 0,
      tags: [],
    };

    const { error } = await supabase
      .from('videos')
      .insert(newVideo);

    if (error) {
      toast.error("Failed to add video");
      throw error;
    }

    set((state: any) => ({
      videos: [{ 
        ...newVideo, 
        isPinned: newVideo.is_pinned,
        addedAt: new Date(newVideo.added_at) 
      }, ...state.videos],
    }));
  },

  togglePin: async (id: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("Please sign in to toggle pin status");
      throw new Error('User not authenticated');
    }

    const { data: video } = await supabase
      .from('videos')
      .select('is_pinned')
      .eq('id', id)
      .single();

    if (!video) throw new Error('Video not found');

    const updatedIsPinned = !video.is_pinned;

    const { error } = await supabase
      .from('videos')
      .update({ is_pinned: updatedIsPinned })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update pin status");
      throw error;
    }

    set((state: any) => ({
      videos: state.videos.map((v: Video) =>
        v.id === id
          ? { ...v, isPinned: updatedIsPinned, is_pinned: updatedIsPinned }
          : v
      ),
    }));
  },

  fetchVideos: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast.error("Please sign in to view videos");
      throw new Error('User not authenticated');
    }

    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('added_at', { ascending: false });

    if (error) {
      toast.error("Failed to fetch videos");
      throw error;
    }

    const transformedVideos = videos.map(video => ({
      ...video,
      isPinned: video.is_pinned,
      addedAt: new Date(video.added_at)
    }));

    set({ videos: transformedVideos });
  },
});

const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const fetchVideoDetails = async (videoId: string) => {
  const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
  const data = await response.json();
  
  return {
    title: data.title || 'Untitled Video',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
};