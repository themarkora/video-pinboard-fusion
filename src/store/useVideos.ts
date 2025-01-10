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

      reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) => {
        set((state) => {
          // Get the relevant videos based on list type
          let relevantVideos = [...state.videos];
          
          if (listType === 'pinned') {
            relevantVideos = relevantVideos.filter(v => v.isPinned);
          } else if (listType === 'notes') {
            relevantVideos = relevantVideos.filter(v => Array.isArray(v.notes) && v.notes.length > 0);
          } else if (listType !== 'recent') {
            // Handle board reordering
            relevantVideos = relevantVideos.filter(v => v.boardIds?.includes(listType))
              .sort((a, b) => (a.order || 0) - (b.order || 0));
          }

          // Perform the reorder
          const [movedVideo] = relevantVideos.splice(sourceIndex, 1);
          relevantVideos.splice(destinationIndex, 0, movedVideo);

          // Update order for all affected videos
          const updatedRelevantVideos = relevantVideos.map((video, index) => ({
            ...video,
            order: index
          }));

          // Merge back into the main videos array
          const finalVideos = state.videos.map(video => {
            const updatedVideo = updatedRelevantVideos.find(v => v.id === video.id);
            return updatedVideo || { ...video };
          });

          return { videos: finalVideos };
        });
      },

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

              // Reset order when moving to a new board
              const destinationBoardVideos = state.videos
                .filter(v => v.boardIds?.includes(destinationBoardId))
                .sort((a, b) => (a.order || 0) - (b.order || 0));
              
              return { 
                ...video, 
                boardIds: newBoardIds,
                order: destinationBoardVideos.length // Put at the end of the destination board
              };
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
