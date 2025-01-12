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

      const videoId = crypto.randomUUID();
      const newVideo = {
        id: videoId,
        url,
        title: '', // Will be updated after fetching from YouTube
        thumbnail: '', // Will be updated after fetching from YouTube
        is_pinned: isPinned,
        user_id: user.id,
      };

      const { error } = await supabase
        .from('videos')
        .insert(newVideo);

      if (error) throw error;

      set(state => ({
        videos: [...state.videos, { 
          id: videoId, 
          url, 
          title: '', 
          thumbnail: '', 
          isPinned, 
          addedAt: new Date(),
          notes: [],
          boardIds: [],
          views: 0,
          votes: 0,
          tags: []
        }]
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
      if (!user) throw new Error('User not authenticated');

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
      toast.error('Failed to delete video');
    }
  },

  addNote: async (videoId: string, note: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      set(state => ({
        videos: state.videos.map(video =>
          video.id === videoId
            ? { ...video, notes: [...(video.notes || []), note] }
            : video
        )
      }));

      const video = get().videos.find(v => v.id === videoId);
      if (!video) return;

      const { error } = await supabase
        .from('videos')
        .update({ notes: [...(video.notes || []), note] })
        .eq('id', videoId)
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    }
  },

  updateNote: (videoId: string, noteIndex: number, updatedNote: string) => {
    set(state => ({
      videos: state.videos.map(video =>
        video.id === videoId
          ? {
              ...video,
              notes: video.notes?.map((note, index) =>
                index === noteIndex ? updatedNote : note
              ),
            }
          : video
      ),
    }));
  },

  deleteNote: (videoId: string, noteIndex: number) => {
    set(state => ({
      videos: state.videos.map(video =>
        video.id === videoId
          ? {
              ...video,
              notes: video.notes?.filter((_, index) => index !== noteIndex),
            }
          : video
      ),
    }));
  },

  addBoard: (name: string) => {
    const boardId = crypto.randomUUID();
    set(state => ({
      boards: [...state.boards, { id: boardId, name, createdAt: new Date() }]
    }));
    return boardId;
  },

  deleteBoard: async (boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
      toast.error('Failed to delete board');
    }
  },

  addToBoard: async (videoId: string, boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      set(state => ({
        videos: state.videos.map(video =>
          video.id === videoId
            ? { ...video, boardIds: [...(video.boardIds || []), boardId] }
            : video
        )
      }));
    } catch (error) {
      console.error('Error adding to board:', error);
      toast.error('Failed to add to board');
    }
  },

  removeFromBoard: async (videoId: string, boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
      toast.error('Failed to remove from board');
    }
  },

  togglePin: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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

      if (error) throw error;
    } catch (error) {
      console.error('Error toggling pin:', error);
      toast.error('Failed to update pin status');
    }
  },

  addTag: (videoId: string, tag: string) => {
    set(state => ({
      videos: state.videos.map(video =>
        video.id === videoId
          ? { ...video, tags: [...new Set([...(video.tags || []), tag])] }
          : video
      ),
    }));
  },

  removeTag: (videoId: string, tag: string) => {
    set(state => ({
      videos: state.videos.map(video =>
        video.id === videoId
          ? { ...video, tags: video.tags?.filter(t => t !== tag) || [] }
          : video
      ),
    }));
  },

  addVote: (videoId: string) => {
    set(state => ({
      videos: state.videos.map(video =>
        video.id === videoId
          ? { ...video, votes: (video.votes || 0) + 1 }
          : video
      ),
    }));
  },

  addView: (videoId: string) => {
    set(state => ({
      videos: state.videos.map(video =>
        video.id === videoId
          ? { ...video, views: (video.views || 0) + 1 }
          : video
      ),
    }));
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
      toast.error('Failed to fetch your data');
      set({ videos: [], boards: [] });
    }
  },

  renameBoard: async (boardId: string, newName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

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
      toast.error('Failed to rename board');
    }
  },
}));