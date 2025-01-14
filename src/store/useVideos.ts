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

const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const fetchVideoDetails = async (videoId: string) => {
  const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
  const data = await response.json();
  
  return {
    title: data.title || 'Untitled Video',
    thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  };
};

export type { Video, Board };