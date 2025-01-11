import { supabase } from '@/integrations/supabase/client';

export const boardActions = (set: any) => ({
  addBoard: async (name: string) => {
    const boardId = crypto.randomUUID();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const newBoard = {
      id: boardId,
      user_id: user.id,
      name,
      created_at: new Date(),
    };

    const { error } = await supabase
      .from('boards')
      .insert(newBoard);

    if (error) throw error;

    set((state: any) => ({
      boards: [...state.boards, newBoard],
    }));
    return boardId;
  },
  
  fetchBoards: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: boards, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    set({ boards: boards || [] });
  },

  deleteBoard: async (id: string) => {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id);

    if (error) throw error;

    set((state: any) => ({
      boards: state.boards.filter((board: any) => board.id !== id),
      videos: state.videos.map((video: any) => ({
        ...video,
        board_ids: video.board_ids?.filter((boardId: string) => boardId !== id) || []
      }))
    }));
  },

  addToBoard: async (videoId: string, boardId: string) => {
    const { data: video } = await supabase
      .from('videos')
      .select('board_ids')
      .eq('id', videoId)
      .single();

    if (!video) throw new Error('Video not found');

    const updatedBoardIds = [...(video.board_ids || []), boardId];

    const { error } = await supabase
      .from('videos')
      .update({ board_ids: updatedBoardIds })
      .eq('id', videoId);

    if (error) throw error;

    set((state: any) => ({
      videos: state.videos.map((v: any) =>
        v.id === videoId
          ? { ...v, board_ids: updatedBoardIds }
          : v
      ),
    }));
  },

  removeFromBoard: async (videoId: string, boardId: string) => {
    const { data: video } = await supabase
      .from('videos')
      .select('board_ids')
      .eq('id', videoId)
      .single();

    if (!video) throw new Error('Video not found');

    const updatedBoardIds = video.board_ids?.filter((id: string) => id !== boardId) || [];

    const { error } = await supabase
      .from('videos')
      .update({ board_ids: updatedBoardIds })
      .eq('id', videoId);

    if (error) throw error;

    set((state: any) => ({
      videos: state.videos.map((v: any) =>
        v.id === videoId
          ? { ...v, board_ids: updatedBoardIds }
          : v
      ),
    }));
  },
});