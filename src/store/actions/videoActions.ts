import { StateCreator } from 'zustand';
import { VideosState } from '../types';
import { supabase } from '@/integrations/supabase/client';

export interface VideoSlice {
  addVideo: (url: string, isPinned?: boolean) => Promise<void>;
  deleteVideo: (id: string) => void;
  addNote: (videoId: string, note: string) => void;
  updateNote: (videoId: string, noteIndex: number, updatedNote: string) => void;
  deleteNote: (videoId: string, noteIndex: number) => void;
  addVote: (videoId: string) => void;
  addView: (videoId: string) => void;
  addTag: (videoId: string, tag: string) => void;
  removeTag: (videoId: string, tag: string) => void;
  togglePin: (id: string) => Promise<void>;
}

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

export const createVideoSlice: StateCreator<VideosState, [], [], VideoSlice> = (set, get) => ({
  addVideo: async (url: string, isPinned: boolean = false) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const videoId = getYouTubeVideoId(url);
      if (!videoId) throw new Error('Invalid YouTube URL');

      const details = await fetchVideoDetails(videoId);
      
      const timestamp = new Date().getTime();
      const uniqueId = `${videoId}_${timestamp}`;

      const newVideo = {
        id: uniqueId,
        url,
        title: details.title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        is_pinned: isPinned,
        user_id: user.id,
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

      set(state => ({
        videos: [{
          id: uniqueId,
          url,
          title: details.title,
          thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          isPinned,
          addedAt: new Date(),
          notes: [],
          boardIds: [],
          views: 0,
          votes: 0,
          tags: [],
        }, ...state.videos],
      }));
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
    }
  },

  deleteVideo: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      set((state) => ({
        videos: state.videos.filter((video) => video.id !== id),
      }));
    }
  },

  addNote: async (videoId: string, note: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentState = get();
    const video = currentState.videos.find(v => v.id === videoId);
    if (!video) return;

    const updatedNotes = [...(video.notes || []), note];

    set({
      videos: currentState.videos.map((video) =>
        video.id === videoId
          ? { ...video, notes: updatedNotes }
          : video
      ),
    });

    const { error } = await supabase
      .from('videos')
      .update({ notes: updatedNotes })
      .eq('id', videoId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error adding note:', error);
      set({ videos: currentState.videos });
    }
  },

  updateNote: (videoId: string, noteIndex: number, updatedNote: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              notes: video.notes?.map((note, index) =>
                index === noteIndex ? updatedNote : note
              ),
            }
          : video
      ),
    })),

  deleteNote: (videoId: string, noteIndex: number) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              notes: video.notes?.filter((_, index) => index !== noteIndex),
            }
          : video
      ),
    })),

  addVote: (videoId: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? { ...video, votes: (video.votes || 0) + 1 }
          : video
      ),
    })),

  addView: (videoId: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? { ...video, views: (video.views || 0) + 1 }
          : video
      ),
    })),

  addTag: (videoId: string, tag: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              tags: [...new Set([...(video.tags || []), tag])]
            }
          : video
      ),
    })),

  removeTag: (videoId: string, tag: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              tags: video.tags?.filter((t) => t !== tag) || []
            }
          : video
      ),
    })),

  togglePin: async (id: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return;

      const currentVideos = get().videos;
      const videoToUpdate = currentVideos.find(v => v.id === id);
      if (!videoToUpdate) return;

      const newIsPinned = !videoToUpdate.isPinned;

      set({
        videos: currentVideos.map(video =>
          video.id === id ? { ...video, isPinned: newIsPinned } : video
        ),
      });

      const { error } = await supabase
        .from('videos')
        .update({ is_pinned: newIsPinned })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating pin status:', error);
        set({
          videos: currentVideos.map(video =>
            video.id === id ? { ...video, isPinned: !newIsPinned } : video
          ),
        });
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  },
});