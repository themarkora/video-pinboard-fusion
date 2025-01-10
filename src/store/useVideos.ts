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
  reorderVideosInBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  togglePin: (id: string) => void;
  moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => void;
}

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

      updateNote: (videoId: string, noteIndex: number, updatedNote: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? {
                  ...video,
                  notes: video.notes?.map((note, index) =>
                    index === noteIndex ? updatedNote : note
                  ) || [],
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
                  notes: video.notes?.filter((_, index) => index !== noteIndex) || [],
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
              ? {
                  ...video,
                  tags: [...new Set([...(video.tags || []), tag])]
                }
              : video
          ),
        })),

      reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) => {
        set((state) => {
          let filteredVideos = [...state.videos];
          
          // Filter videos based on the list type
          if (listType === 'pinned') {
            filteredVideos = filteredVideos.filter(v => v.isPinned);
          } else if (listType === 'notes') {
            filteredVideos = filteredVideos.filter(v => Array.isArray(v.notes) && v.notes.length > 0);
          }
          
          // Perform the reorder
          const [movedVideo] = filteredVideos.splice(sourceIndex, 1);
          filteredVideos.splice(destinationIndex, 0, movedVideo);
          
          // Update the order property for all videos in the filtered list
          const updatedFilteredVideos = filteredVideos.map((video, index) => ({
            ...video,
            order: index
          }));
          
          // Merge the updated filtered videos back into the main videos array
          const finalVideos = state.videos.map(video => {
            const updatedVideo = updatedFilteredVideos.find(v => v.id === video.id);
            return updatedVideo || video;
          });
          
          return { videos: finalVideos };
        });
      },

      reorderVideosInBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => {
        set((state) => {
          // Get videos in this board and maintain their current order
          const boardVideos = state.videos
            .filter(video => video.boardIds?.includes(boardId))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          
          // Perform the reorder within board videos
          const [movedVideo] = boardVideos.splice(sourceIndex, 1);
          boardVideos.splice(destinationIndex, 0, movedVideo);
          
          // Update order for all videos in this board
          const updatedBoardVideos = boardVideos.map((video, index) => ({
            ...video,
            order: index
          }));
          
          // Merge the updated board videos back into the main videos array
          const finalVideos = state.videos.map(video => {
            const updatedVideo = updatedBoardVideos.find(v => v.id === video.id);
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

      moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => {
        set((state) => {
          const updatedVideos = state.videos.map((video) => {
            if (video.id === videoId) {
              let newBoardIds = [...(video.boardIds || [])];
              
              // Remove from source board if it's a valid board ID
              if (sourceBoardId !== 'recent' && sourceBoardId !== 'pinned' && sourceBoardId !== 'notes') {
                newBoardIds = newBoardIds.filter(id => id !== sourceBoardId);
              }
              
              // Add to destination board if not already present
              if (!newBoardIds.includes(destinationBoardId)) {
                newBoardIds.push(destinationBoardId);
              }
              
              return { ...video, boardIds: newBoardIds };
            }
            return video;
          });

          return { videos: updatedVideos };
        });
      },

    }),
    {
      name: 'videos-storage',
    }
  )
);

export type { Video, Board };
