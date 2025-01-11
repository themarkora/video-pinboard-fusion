import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addVideoActions } from './actions/videoActions';
import { boardActions } from './actions/boardActions';
import { Video, Board } from './types';
import { supabase } from '@/integrations/supabase/client';

export interface VideosState {
  videos: Video[];
  boards: Board[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
  addVideo: (url: string, isPinned?: boolean) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  addNote: (videoId: string, note: string) => Promise<void>;
  updateNote: (videoId: string, noteIndex: number, updatedNote: string) => Promise<void>;
  deleteNote: (videoId: string, noteIndex: number) => Promise<void>;
  addVote: (videoId: string) => Promise<void>;
  addView: (videoId: string) => Promise<void>;
  addTag: (videoId: string, tag: string) => Promise<void>;
  removeTag: (videoId: string, tag: string) => Promise<void>;
  addBoard: (name: string) => Promise<string>;
  deleteBoard: (id: string) => Promise<void>;
  addToBoard: (videoId: string, boardId: string) => Promise<void>;
  removeFromBoard: (videoId: string, boardId: string) => Promise<void>;
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
  togglePin: (id: string) => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchBoards: () => Promise<void>;
  clearAllData: () => void;
}

export const useVideos = create<VideosState>()(
  persist(
    (set) => ({
      videos: [],
      boards: [],
      activeTab: 'recent',
      clearAllData: () => set({ videos: [], boards: [], activeTab: 'recent' }),
      ...addVideoActions(set),
      ...boardActions(set),
      setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => set({ activeTab: tab }),

      removeTag: async (videoId: string, tag: string) => {
        const { data: video } = await supabase
          .from('videos')
          .select('tags')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedTags = video.tags?.filter((t) => t !== tag) || [];

        const { error } = await supabase
          .from('videos')
          .update({ tags: updatedTags })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, tags: updatedTags }
              : v
          ),
        }));
      },

      deleteVideo: async (id: string) => {
        const { error } = await supabase
          .from('videos')
          .delete()
          .eq('id', id);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        }));
      },

      addNote: async (videoId: string, note: string) => {
        const { data: video } = await supabase
          .from('videos')
          .select('notes')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedNotes = [...(video.notes || []), note];

        const { error } = await supabase
          .from('videos')
          .update({ notes: updatedNotes })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, notes: updatedNotes }
              : v
          ),
        }));
      },

      addVote: async (videoId: string) => {
        const { data: video } = await supabase
          .from('videos')
          .select('votes')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedVotes = (video.votes || 0) + 1;

        const { error } = await supabase
          .from('videos')
          .update({ votes: updatedVotes })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, votes: updatedVotes }
              : v
          ),
        }));
      },

      addView: async (videoId: string) => {
        const { data: video } = await supabase
          .from('videos')
          .select('views')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedViews = (video.views || 0) + 1;

        const { error } = await supabase
          .from('videos')
          .update({ views: updatedViews })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, views: updatedViews }
              : v
          ),
        }));
      },

      addTag: async (videoId: string, tag: string) => {
        const { data: video } = await supabase
          .from('videos')
          .select('tags')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedTags = [...new Set([...(video.tags || []), tag])];

        const { error } = await supabase
          .from('videos')
          .update({ tags: updatedTags })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, tags: updatedTags }
              : v
          ),
        }));
      },

      deleteNote: async (videoId: string, noteIndex: number) => {
        const { data: video } = await supabase
          .from('videos')
          .select('notes')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedNotes = video.notes?.filter((_, index) => index !== noteIndex) || [];

        const { error } = await supabase
          .from('videos')
          .update({ notes: updatedNotes })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, notes: updatedNotes }
              : v
          ),
        }));
      },

      updateNote: async (videoId: string, noteIndex: number, updatedNote: string) => {
        const { data: video } = await supabase
          .from('videos')
          .select('notes')
          .eq('id', videoId)
          .single();

        if (!video) throw new Error('Video not found');

        const updatedNotes = video.notes?.map((note, index) =>
          index === noteIndex ? updatedNote : note
        ) || [];

        const { error } = await supabase
          .from('videos')
          .update({ notes: updatedNotes })
          .eq('id', videoId);

        if (error) throw error;

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === videoId
              ? { ...v, notes: updatedNotes }
              : v
          ),
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

        set((state) => ({
          videos: state.videos.map((v) =>
            v.id === id
              ? { ...v, isPinned: updatedIsPinned }
              : v
          ),
        }));
      },
    }),
    {
      name: 'videos-storage',
    }
  )
);

export type { Video, Board };