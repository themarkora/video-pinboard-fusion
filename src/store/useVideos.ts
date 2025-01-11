import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
}

export const useVideos = create<VideosState>()(
  persist(
    (set, get) => ({
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
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching videos:', error);
          return;
        }

        // Map Supabase response to our Video type
        const mappedVideos: Video[] = (videos || []).map(video => ({
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
          tags: video.tags || []
        }));

        set({ videos: mappedVideos });
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

      togglePin: (id: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id ? { ...video, isPinned: !video.isPinned } : video
          ),
        })),

    }),
    {
      name: 'videos-storage',
    }
  )
);

export type { Video, Board };