import { Video } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const details = await fetchVideoDetails(videoId);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const newVideo = {
      id: videoId,
      user_id: user.id,
      url,
      title: details.title,
      thumbnail: details.thumbnail,
      is_pinned: true, // Always set to true when adding
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

    if (error) throw error;

    // Update local state with the new video, maintaining consistency with is_pinned
    set((state: any) => ({
      videos: [{ 
        ...newVideo, 
        isPinned: newVideo.is_pinned, // Add isPinned for frontend compatibility
        addedAt: new Date(newVideo.added_at) 
      }, ...state.videos],
    }));
  },

  togglePin: async (id: string) => {
    // First get the current pin state from the database
    const { data: video } = await supabase
      .from('videos')
      .select('is_pinned')
      .eq('id', id)
      .single();

    if (!video) throw new Error('Video not found');

    const updatedIsPinned = !video.is_pinned;

    // Update in database
    const { error } = await supabase
      .from('videos')
      .update({ is_pinned: updatedIsPinned })
      .eq('id', id);

    if (error) throw error;

    // Update local state, maintaining both is_pinned and isPinned properties
    set((state: any) => ({
      videos: state.videos.map((v: Video) =>
        v.id === id
          ? { ...v, is_pinned: updatedIsPinned, isPinned: updatedIsPinned }
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

    // Transform the data to include both is_pinned and isPinned for frontend compatibility
    const transformedVideos = (videos || []).map(video => ({
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