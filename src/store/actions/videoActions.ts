import { Video } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string, isPinned: boolean = true) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to add videos');

    // Check if video already exists for this user
    const { data: existingVideo } = await supabase
      .from('videos')
      .select()
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single();

    if (existingVideo) {
      throw new Error('Video already exists in your collection');
    }

    const details = await fetchVideoDetails(videoId);
    
    // Insert into Supabase with user_id
    const { data, error } = await supabase
      .from('videos')
      .insert({
        id: videoId,
        url,
        title: details.title,
        thumbnail: details.thumbnail,
        is_pinned: isPinned,
        user_id: user.id,
        added_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding video:', error);
      throw error;
    }

    // Update local state
    set((state: any) => ({
      videos: [data, ...state.videos],
    }));
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