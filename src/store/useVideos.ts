import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import { Video, Board, VideosState } from './types';
import { toast } from "sonner";

export const useVideos = create<VideosState>((set, get) => ({
  videos: [],
  boards: [],
  activeTab: 'recent',

  addVideo: async (url: string, isPinned: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('videos')
        .insert([{ url, is_pinned: isPinned, user_id: user.id }]);

      if (error) throw error;

      set(state => ({
        videos: [...state.videos, { id: crypto.randomUUID(), url, title: '', thumbnail: '', isPinned, addedAt: new Date(), notes: [], boardIds: [] }]
      }));
    } catch (error) {
      console.error('Error adding video:', error);
      toast.error('Failed to add video. Please try signing in again.');
      throw error;
    }
  },

  deleteVideo: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        videos: state.videos.filter(video => video.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting video:', error);
      toast.error('Failed to delete video. Please try signing in again.');
      throw error;
    }
  },

  addBoard: (name: string) => {
    try {
      const boardId = crypto.randomUUID();
      set(state => ({
        boards: [...state.boards, { id: boardId, name, createdAt: new Date() }]
      }));
      return boardId;
    } catch (error) {
      console.error('Error adding board:', error);
      toast.error('Failed to add board');
      throw error;
    }
  },

  deleteBoard: async (boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        boards: state.boards.filter(board => board.id !== boardId),
        videos: state.videos.map(video => ({
          ...video,
          boardIds: video.boardIds?.filter(id => id !== boardId) || []
        }))
      }));
    } catch (error) {
      console.error('Error deleting board:', error);
      toast.error('Failed to delete board. Please try signing in again.');
      throw error;
    }
  },

  renameBoard: async (boardId: string, newName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase
        .from('boards')
        .update({ name: newName })
        .eq('id', boardId)
        .eq('user_id', user.id);

      if (error) throw error;

      set(state => ({
        boards: state.boards.map(board =>
          board.id === boardId ? { ...board, name: newName } : board
        )
      }));
    } catch (error) {
      console.error('Error renaming board:', error);
      toast.error('Failed to rename board. Please try signing in again.');
      throw error;
    }
  },

  addNote: async (videoId: string, note: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      set(state => ({
        videos: state.videos.map(video =>
          video.id === videoId
            ? { ...video, notes: [...(video.notes || []), note] }
            : video
        )
      }));
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note. Please try signing in again.');
      throw error;
    }
  },

  addToBoard: async (videoId: string, boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      set(state => ({
        videos: state.videos.map(video =>
          video.id === videoId
            ? { ...video, boardIds: [...(video.boardIds || []), boardId] }
            : video
        )
      }));
    } catch (error) {
      console.error('Error adding to board:', error);
      toast.error('Failed to add to board. Please try signing in again.');
      throw error;
    }
  },

  removeFromBoard: async (videoId: string, boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      set(state => ({
        videos: state.videos.map(video =>
          video.id === videoId
            ? {
                ...video,
                boardIds: video.boardIds?.filter(id => id !== boardId) || []
              }
            : video
        )
      }));
    } catch (error) {
      console.error('Error removing from board:', error);
      toast.error('Failed to remove from board. Please try signing in again.');
      throw error;
    }
  },

  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => {
    set({ activeTab: tab });
  },

  clearState: () => {
    set({ videos: [], boards: [], activeTab: 'recent' });
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
      toast.error('Failed to fetch your data. Please try signing in again.');
      set({ videos: [], boards: [] });
    }
  },
}));
