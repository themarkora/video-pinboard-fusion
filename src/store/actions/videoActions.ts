import { Video } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string, isPinned: boolean = true) => {
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
      is_pinned: isPinned,
      added_at: new Date(),
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

    set((state: any) => ({
      videos: [newVideo, ...state.videos],
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