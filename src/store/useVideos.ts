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
  renameBoard: (boardId: string, newName: string) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
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

  togglePin: async (id: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) return;

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

      if (error) {
        console.error('Error updating pin status:', error);
        set({
          videos: currentVideos.map(video =>
            video.id === id ? { ...video, isPinned: !newIsPinned } : video
          ),
        });
      }
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  },

  addVideo: async (url: string, isPinned: boolean = false) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
      if (!user) throw new Error('User not authenticated');

      const videoId = getYouTubeVideoId(url);
      if (!videoId) throw new Error('Invalid YouTube URL');

      const details = await fetchVideoDetails(videoId);
      
      const timestamp = new Date().getTime();
      const uniqueId = `${videoId}_${timestamp}`;

      const newVideo = {
        id: uniqueId,
        url,
        title: details.title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        is_pinned: isPinned,
        user_id: user.id,
        notes: [],
        board_ids: [],
        views: 0,
        votes: 0,
        tags: [],
      };

      const { error } = await supabase
        .from('videos')
        .insert(newVideo);

      if (error) throw error;

      const frontendVideo: Video = {
        id: uniqueId,
        url,
        title: details.title,
        thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
        isPinned,
        addedAt: new Date(),
        notes: [],
        boardIds: [],
        views: 0,
        votes: 0,
        tags: [],
      };

      set(state => ({
        videos: [frontendVideo, ...state.videos],
      }));
    } catch (error) {
      console.error('Error adding video:', error);
      throw error;
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

    set({
      videos: currentState.videos.map((video) =>
        video.id === videoId
          ? { ...video, notes: updatedNotes }
          : video
      ),
    });

    const { error } = await supabase
      .from('videos')
      .update({ notes: updatedNotes })
      .eq('id', videoId)
      .eq('user_id', user.id);

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

      // Remove board from videos' boardIds arrays
      const updatedVideos = get().videos.map(video => ({
        ...video,
        boardIds: video.boardIds?.filter(id => id !== boardId) || []
      }));

      // Update videos in Supabase
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
