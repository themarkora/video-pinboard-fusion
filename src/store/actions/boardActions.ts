import { StateCreator } from 'zustand';
import { VideosState } from '../types';
import { supabase } from '@/integrations/supabase/client';

export interface BoardSlice {
  addBoard: (name: string) => string;
  deleteBoard: (boardId: string) => Promise<void>;
  renameBoard: (boardId: string, newName: string) => Promise<void>;
  addToBoard: (videoId: string, boardId: string) => void;
  removeFromBoard: (videoId: string, boardId: string) => void;
}

export const createBoardSlice: StateCreator<VideosState, [], [], BoardSlice> = (set, get) => ({
  addBoard: (name: string) => {
    const boardId = crypto.randomUUID();
    set((state) => ({
      boards: [...state.boards, { 
        id: boardId, 
        name,
        createdAt: new Date()
      }],
    }));
    return boardId;
  },

  deleteBoard: async (boardId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId)
        .eq('user_id', user.id);

      if (error) throw error;

      const updatedVideos = get().videos.map(video => ({
        ...video,
        boardIds: video.boardIds?.filter(id => id !== boardId) || []
      }));

      await Promise.all(
        updatedVideos
          .filter(video => video.boardIds !== undefined)
          .map(video =>
            supabase
              .from('videos')
              .update({ board_ids: video.boardIds })
              .eq('id', video.id)
              .eq('user_id', user.id)
          )
      );

      set((state) => ({
        boards: state.boards.filter((board) => board.id !== boardId),
        videos: updatedVideos,
      }));
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  },

  renameBoard: async (boardId: string, newName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('boards')
        .update({ name: newName })
        .eq('id', boardId)
        .eq('user_id', user.id);

      if (error) throw error;

      set((state) => ({
        boards: state.boards.map((board) =>
          board.id === boardId ? { ...board, name: newName } : board
        ),
      }));
    } catch (error) {
      console.error('Error renaming board:', error);
      throw error;
    }
  },

  addToBoard: (videoId: string, boardId: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? { ...video, boardIds: [...(video.boardIds || []), boardId] }
          : video
      ),
    })),

  removeFromBoard: (videoId: string, boardId: string) =>
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === videoId
          ? {
              ...video,
              boardIds: (video.boardIds || []).filter((id) => id !== boardId),
            }
          : video
      ),
    })),
});