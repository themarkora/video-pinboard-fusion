import { supabase } from '@/integrations/supabase/client';
import { Board } from '../types';

export const boardActions = (set: any) => ({
  addBoard: (name: string) => {
    const boardId = crypto.randomUUID();
    set((state: any) => ({
      boards: [...state.boards, { 
        id: boardId, 
        name,
        createdAt: new Date()
      }],
    }));
    return boardId;
  },
  
  deleteBoard: async (id: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        boards: state.boards.filter((board: Board) => board.id !== id),
        videos: state.videos.map((video: any) => ({
          ...video,
          boardIds: video.boardIds?.filter((boardId: string) => boardId !== id) || []
        }))
      }));
    } catch (error) {
      console.error('Error deleting board:', error);
      throw error;
    }
  },

  updateBoardName: async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('boards')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      set((state: any) => ({
        boards: state.boards.map((board: Board) =>
          board.id === id ? { ...board, name: newName } : board
        ),
      }));
    } catch (error) {
      console.error('Error updating board name:', error);
      throw error;
    }
  },

  addToBoard: (videoId: string, boardId: string) =>
    set((state: any) => ({
      videos: state.videos.map((video: any) =>
        video.id === videoId
          ? { ...video, boardIds: [...(video.boardIds || []), boardId] }
          : video
      ),
    })),

  removeFromBoard: (videoId: string, boardId: string) =>
    set((state: any) => ({
      videos: state.videos.map((video: any) =>
        video.id === videoId
          ? {
              ...video,
              boardIds: (video.boardIds || []).filter((id: string) => id !== boardId),
            }
          : video
      ),
    })),
});