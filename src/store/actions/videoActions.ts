import { Video } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const details = await fetchVideoDetails(videoId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Create new video with is_pinned always set to true
    const newVideo = {
      id: videoId,
      user_id: user.id,
      url,
      title: details.title,
      thumbnail: details.thumbnail,
      is_pinned: true, // Always set to true
      added_at: new Date().toISOString(),
      notes: [],
      board_ids: [],
      views: 0,
      votes: 0,
      tags: [],
    };

    // Insert into database
    const { error } = await supabase
      .from('videos')
      .insert(newVideo);

    if (error) throw error;

    // Update local state with the new video
    set((state: any) => ({
      videos: [{ ...newVideo, added_at: new Date(newVideo.added_at) }, ...state.videos],
    }));
  },

  togglePin: async (id: string) => {
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

    if (error) throw error;

    set((state: any) => ({
      videos: state.videos.map((v: Video) =>
        v.id === id
          ? { ...v, is_pinned: updatedIsPinned }
          : v
      ),
    }));
  },

  fetchVideos: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('added_at', { ascending: false });

    if (error) throw error;

    set({ videos: videos || [] });
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