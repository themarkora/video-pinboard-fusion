import { Video } from '../types';
import { supabase } from '@/integrations/supabase/client';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string, isPinned: boolean = true) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const details = await fetchVideoDetails(videoId);
    
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be logged in to add videos');

    // Insert into Supabase with user_id
    const { error: dbError } = await supabase
      .from('videos')
      .insert({
        id: videoId,
        url,
        title: details.title,
        thumbnail: details.thumbnail,
        is_pinned: isPinned,
        user_id: user.id,  // Set the user_id to the current user's ID
      });

    if (dbError) throw dbError;

    // Update local state after successful DB insert
    set((state: any) => ({
      videos: [
        {
          id: videoId,
          url,
          title: details.title,
          thumbnail: details.thumbnail,
          isPinned,
          addedAt: new Date(),
          notes: [],
          boardIds: [],
          views: 0,
          votes: 0,
        },
        ...state.videos,
      ],
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