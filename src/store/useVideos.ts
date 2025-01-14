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
  deleteBoard: (id: string) => Promise<void>;
  updateBoardName: (id: string, newName: string) => Promise<void>;
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

  deleteVideo: async (id: string) => {
    const { error } = await supabase
      .from('videos')
      .delete()
      .eq('id', id);

    if (error) throw error;

    set(state => ({
      videos: state.videos.filter(video => video.id !== id)
    }));
  },

  addNote: async (videoId: string, note: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video) return;

    const updatedNotes = [...(video.notes || []), note];
    const { error } = await supabase
      .from('videos')
      .update({ notes: updatedNotes })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, notes: updatedNotes } : v
      )
    }));
  },

  updateNote: async (videoId: string, noteIndex: number, updatedNote: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video || !video.notes) return;

    const updatedNotes = [...video.notes];
    updatedNotes[noteIndex] = updatedNote;

    const { error } = await supabase
      .from('videos')
      .update({ notes: updatedNotes })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, notes: updatedNotes } : v
      )
    }));
  },

  deleteNote: async (videoId: string, noteIndex: number) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video || !video.notes) return;

    const updatedNotes = video.notes.filter((_, index) => index !== noteIndex);

    const { error } = await supabase
      .from('videos')
      .update({ notes: updatedNotes })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, notes: updatedNotes } : v
      )
    }));
  },

  addVote: async (videoId: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video) return;

    const newVotes = (video.votes || 0) + 1;
    const { error } = await supabase
      .from('videos')
      .update({ votes: newVotes })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, votes: newVotes } : v
      )
    }));
  },

  addView: async (videoId: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video) return;

    const newViews = (video.views || 0) + 1;
    const { error } = await supabase
      .from('videos')
      .update({ views: newViews })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, views: newViews } : v
      )
    }));
  },

  addTag: async (videoId: string, tag: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video) return;

    const updatedTags = [...(video.tags || []), tag];
    const { error } = await supabase
      .from('videos')
      .update({ tags: updatedTags })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, tags: updatedTags } : v
      )
    }));
  },

  removeTag: async (videoId: string, tag: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video || !video.tags) return;

    const updatedTags = video.tags.filter(t => t !== tag);
    const { error } = await supabase
      .from('videos')
      .update({ tags: updatedTags })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, tags: updatedTags } : v
      )
    }));
  },

  addToBoard: async (videoId: string, boardId: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video) return;

    const updatedBoardIds = [...(video.boardIds || []), boardId];
    const { error } = await supabase
      .from('videos')
      .update({ board_ids: updatedBoardIds })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, boardIds: updatedBoardIds } : v
      )
    }));
  },

  removeFromBoard: async (videoId: string, boardId: string) => {
    const video = get().videos.find(v => v.id === videoId);
    if (!video || !video.boardIds) return;

    const updatedBoardIds = video.boardIds.filter(id => id !== boardId);
    const { error } = await supabase
      .from('videos')
      .update({ board_ids: updatedBoardIds })
      .eq('id', videoId);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === videoId ? { ...v, boardIds: updatedBoardIds } : v
      )
    }));
  },

  togglePin: async (id: string) => {
    const video = get().videos.find(v => v.id === id);
    if (!video) return;

    const isPinned = !video.isPinned;
    const { error } = await supabase
      .from('videos')
      .update({ is_pinned: isPinned })
      .eq('id', id);

    if (error) throw error;

    set(state => ({
      videos: state.videos.map(v =>
        v.id === id ? { ...v, isPinned } : v
      )
    }));
  },

  fetchUserData: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) {
        console.error('No authenticated user found');
        set({ videos: [], boards: [] });
        return;
      }

      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user.id);

      if (videosError) throw videosError;

      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .eq('user_id', user.id);

      if (boardsError) throw boardsError;

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
    } catch (error) {
      console.error('Error fetching user data:', error);
      set({ videos: [], boards: [] });
    }
  },

  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => set({ activeTab: tab }),

  clearState: () => set({ videos: [], boards: [], activeTab: 'recent' }),
}));