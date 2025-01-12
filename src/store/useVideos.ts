import { create } from 'zustand';
import { addVideoActions } from './actions/videoActions';
import { boardActions } from './actions/boardActions';
import { Video, Board } from './types';
import { supabase } from '@/integrations/supabase/client';

export interface VideosState {
  videos: Video[];
  boards: Board[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
  addVideo: (url: string, isPinned?: boolean) => Promise<void>;
  deleteVideo: (id: string) => void;
  addNote: (videoId: string, note: string) => void;
  updateNote: (videoId: string, noteIndex: number, updatedNote: string) => void;
  deleteNote: (videoId: string, noteIndex: number) => void;
  addVote: (videoId: string) => void;
  addView: (videoId: string) => void;
  addTag: (videoId: string, tag: string) => void;
  removeTag: (videoId: string, tag: string) => void;
  addBoard: (name: string) => string;
  deleteBoard: (id: string) => void;
  addToBoard: (videoId: string, boardId: string) => void;
  removeFromBoard: (videoId: string, boardId: string) => void;
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
  togglePin: (id: string) => void;
  clearState: () => void;
  fetchUserData: () => Promise<void>;
}

export const useVideos = create<VideosState>((set, get) => ({
  videos: [],
  boards: [],
  activeTab: 'recent',
  ...addVideoActions(set),
  ...boardActions(set),

  fetchUserData: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: videosData } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id);

    const { data: boardsData } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', user.id);

    // Map database fields to frontend types
    const videos = videosData?.map(video => ({
      id: video.id,
      url: video.url,
      title: video.title,
      thumbnail: video.thumbnail,
      isPinned: video.is_pinned || false,
      addedAt: new Date(video.added_at),
      notes: video.notes || [],
      boardIds: video.board_ids || [],
      views: video.views || 0,
      votes: video.votes || 0,
      tags: video.tags || [],
    })) || [];

    const boards = boardsData?.map(board => ({
      id: board.id,
      name: board.name,
      createdAt: new Date(board.created_at),
    })) || [];

    set({ videos, boards });
  },

  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => set({ activeTab: tab }),

  togglePin: async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const currentVideos = get().videos;
    const videoToUpdate = currentVideos.find(v => v.id === id);
    if (!videoToUpdate) return;

    const newIsPinned = !videoToUpdate.isPinned;

    // Optimistically update local state
    set({
      videos: currentVideos.map(video =>
        video.id === id ? { ...video, isPinned: newIsPinned } : video
      ),
    });

    // Update in Supabase
    const { error } = await supabase
      .from('videos')
      .update({ is_pinned: newIsPinned })
      .eq('id', id)
      .eq('user_id', user.id);

    // Revert on error
    if (error) {
      console.error('Error updating pin status:', error);
      set({
        videos: currentVideos.map(video =>
          video.id === id ? { ...video, isPinned: !newIsPinned } : video
        ),
      });
    }
  },

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

    // Optimistically update local state
    set({
      videos: currentState.videos.map((video) =>
        video.id === videoId
          ? { ...video, notes: updatedNotes }
          : video
      ),
    });

    // Update in Supabase
    const { error } = await supabase
      .from('videos')
      .update({ notes: updatedNotes })
      .eq('id', videoId)
      .eq('user_id', user.id);

    // Revert on error
    if (error) {
      console.error('Error adding note:', error);
      set({ videos: currentState.videos });
    }
  },

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

  clearState: () => set({ videos: [], boards: [], activeTab: 'recent' }),
}));

export type { Video, Board };
