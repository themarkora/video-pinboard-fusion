import { create } from 'zustand';
import { createVideoSlice } from './actions/videoActions';
import { createBoardSlice } from './actions/boardActions';
import { VideosState } from './types';
import { supabase } from '@/integrations/supabase/client';

export const useVideos = create<VideosState>()((set, get) => ({
  videos: [],
  boards: [],
  activeTab: 'recent',
  ...createVideoSlice(set, get),
  ...createBoardSlice(set, get),

  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => 
    set({ activeTab: tab }),

  clearState: () => 
    set({ videos: [], boards: [], activeTab: 'recent' }),

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
}));

export type { Video, Board };