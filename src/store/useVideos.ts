import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addVideoActions } from './actions/videoActions';
import { boardActions } from './actions/boardActions';
import type { VideosState, Video, Board } from './types';

export const useVideos = create<VideosState>()(
  persist(
    (set) => ({
      videos: [],
      boards: [],
      activeTab: 'recent',
      ...addVideoActions(set),
      ...boardActions(set),
      setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => set({ activeTab: tab }),

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

      reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) => {
        set((state) => {
          let filteredVideos = state.videos;
          
          if (listType === 'pinned') {
            filteredVideos = state.videos.filter(v => v.isPinned);
          } else if (listType === 'notes') {
            filteredVideos = state.videos.filter(v => Array.isArray(v.notes) && v.notes.length > 0);
          }
          
          const [movedVideo] = filteredVideos.splice(sourceIndex, 1);
          filteredVideos.splice(destinationIndex, 0, movedVideo);
          
          const updatedVideos = filteredVideos.map((video, index) => ({
            ...video,
            order: index,
          }));
          
          const finalVideos = state.videos.map(video => {
            const updatedVideo = updatedVideos.find(v => v.id === video.id);
            return updatedVideo || video;
          });
          
          return { videos: finalVideos };
        });
      },

      reorderVideosInBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => {
        set((state) => {
          const boardVideos = state.videos.filter(video => video.boardIds?.includes(boardId));
          
          const [movedVideo] = boardVideos.splice(sourceIndex, 1);
          boardVideos.splice(destinationIndex, 0, movedVideo);
          
          const updatedVideos = boardVideos.map((video, index) => ({
            ...video,
            order: index,
          }));
          
          const finalVideos = state.videos.map(video => {
            const updatedVideo = updatedVideos.find(v => v.id === video.id);
            return updatedVideo || video;
          });
          
          return { videos: finalVideos };
        });
      },

      togglePin: (id: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id ? { ...video, isPinned: !video.isPinned } : video
          ),
        })),

      moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? {
                  ...video,
                  boardIds: video.boardIds
                    ? [...video.boardIds.filter(id => id !== sourceBoardId), destinationBoardId]
                    : [destinationBoardId],
                }
              : video
          ),
        })),

      deleteBoard: (id: string) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          videos: state.videos.map((video) => ({
            ...video,
            boardIds: video.boardIds?.filter((boardId) => boardId !== id) || [],
          })),
        })),
    }),
    {
      name: 'videos-storage',
    }
  )
);

export type { Video, Board } from './types';
