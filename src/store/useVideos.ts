import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addVideoActions } from './actions/videoActions';
import { boardActions } from './actions/boardActions';
import { Video, Board } from './types';

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
  reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) => void;
  moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => void;
  togglePin: (id: string) => void;
}

export const useVideos = create<VideosState>()(
  persist(
    (set) => ({
      videos: [],
      boards: [],
      activeTab: 'recent',

      deleteVideo: (id: string) => 
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id)
        })),

      addNote: (videoId: string, note: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? { ...video, notes: [...(video.notes || []), note] }
              : video
          ),
        })),

      updateNote: (videoId: string, noteIndex: number, updatedNote: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId && video.notes
              ? {
                  ...video,
                  notes: video.notes.map((note, index) =>
                    index === noteIndex ? updatedNote : note
                  ),
                }
              : video
          ),
        })),

      deleteNote: (videoId: string, noteIndex: number) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId && video.notes
              ? {
                  ...video,
                  notes: video.notes.filter((_, index) => index !== noteIndex),
                }
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
              ? { ...video, tags: [...(video.tags || []), tag] }
              : video
          ),
        })),

      removeTag: (videoId: string, tag: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId && video.tags
              ? { ...video, tags: video.tags.filter((t) => t !== tag) }
              : video
          ),
        })),

      togglePin: (id: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id
              ? { ...video, isPinned: !video.isPinned }
              : video
          ),
        })),

      setActiveTab: (tab) => set({ activeTab: tab }),

      reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) =>
        set((state) => {
          let relevantVideos = [...state.videos];
          
          // Filter videos based on list type
          if (listType === 'pinned') {
            relevantVideos = relevantVideos.filter(v => v.isPinned);
          } else if (listType === 'notes') {
            relevantVideos = relevantVideos.filter(v => Array.isArray(v.notes) && v.notes.length > 0);
          } else if (listType !== 'recent') {
            relevantVideos = relevantVideos
              .filter(v => v.boardIds?.includes(listType))
              .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          }

          // Perform the reorder
          const [movedVideo] = relevantVideos.splice(sourceIndex, 1);
          relevantVideos.splice(destinationIndex, 0, movedVideo);

          // Create a map of the reordered videos with their new indices
          const reorderedMap = new Map(
            relevantVideos.map((video, index) => [video.id, index])
          );

          // Update the main videos array while preserving other videos' order
          const finalVideos = state.videos.map(video => {
            if (reorderedMap.has(video.id)) {
              return {
                ...video,
                order: reorderedMap.get(video.id)
              };
            }
            return video;
          });

          return { videos: finalVideos };
        }),

      moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) =>
        set((state) => {
          const destinationBoardVideos = state.videos
            .filter(v => v.boardIds?.includes(destinationBoardId))
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

          const updatedVideos = state.videos.map((video) => {
            if (video.id === videoId) {
              let newBoardIds = [...(video.boardIds || [])];
              
              // Remove from source board if it's a board (not a tab)
              if (sourceBoardId !== 'recent' && sourceBoardId !== 'pinned' && sourceBoardId !== 'notes') {
                newBoardIds = newBoardIds.filter(id => id !== sourceBoardId);
              }
              
              // Add to destination board if not already present
              if (!newBoardIds.includes(destinationBoardId)) {
                newBoardIds.push(destinationBoardId);
              }

              return { 
                ...video, 
                boardIds: newBoardIds,
                order: destinationBoardVideos.length // Place at the end of the destination board
              };
            }
            return video;
          });

          return { videos: updatedVideos };
        }),

      ...addVideoActions(set),
      ...boardActions(set),
    }),
    {
      name: 'videos-storage',
    }
  )
);

export type { Video, Board };
