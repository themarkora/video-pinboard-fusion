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
  fetchUserVideos: () => Promise<void>;
  fetchUserBoards: () => Promise<void>;
  clearStore: () => void;
}

export const useVideos = create<VideosState>((set) => ({
  videos: [],
  boards: [],
  activeTab: 'recent',
  ...addVideoActions(set),
  ...boardActions(set),
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => set({ activeTab: tab }),

  fetchUserVideos: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    // Map the Supabase response to match our Video type
    const mappedVideos: Video[] = videos.map(video => ({
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
      user_id: video.user_id
    }));

    set({ videos: mappedVideos });
  },

  fetchUserBoards: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: boards, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching boards:', error);
      return;
    }

    // Map the Supabase response to match our Board type
    const mappedBoards: Board[] = boards.map(board => ({
      id: board.id,
      name: board.name,
      createdAt: new Date(board.created_at),
      user_id: board.user_id
    }));

    set({ boards: mappedBoards });
  },

  clearStore: () => set({ videos: [], boards: [], activeTab: 'recent' }),

  togglePin: async (id: string) => {
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, isPinned: !video.isPinned } : video
      ),
    }));

    // Update the pinned status in Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const video = useVideos.getState().videos.find(v => v.id === id);
    if (!video) return;

    const { error } = await supabase
      .from('videos')
      .update({ is_pinned: !video.isPinned })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error updating pin status:', error);
      // Revert the optimistic update if there was an error
      set((state) => ({
        videos: state.videos.map((video) =>
          video.id === id ? { ...video, isPinned: !video.isPinned } : video
        ),
      }));
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

  deleteVideo: (id: string) =>
    set((state) => ({
      videos: state.videos.filter((video) => video.id !== id),
    })),

  addNote: (videoId: string, note: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? { ...video, notes: [...(video.notes || []), note] }
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
}));

export type { Video, Board };
