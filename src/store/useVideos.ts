import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Video {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  isPinned: boolean;
  addedAt: Date;
  notes?: string[];
  boardIds?: string[];
  views?: number;
  votes?: number;
  channel?: string;
  publishedAt?: string;
  order?: number;
}

interface Board {
  id: string;
  name: string;
  createdAt: Date;
}

interface VideosState {
  videos: Video[];
  boards: Board[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
  addVideo: (url: string, isPinned?: boolean) => Promise<void>;
  togglePin: (id: string) => void;
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
  addNote: (videoId: string, note: string) => void;
  addToBoard: (videoId: string, boardId: string) => void;
  addBoard: (name: string) => string;
  deleteVideo: (id: string) => void;
  addVote: (videoId: string) => void;
  addView: (videoId: string) => void;
  reorderVideosInBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => void;
  removeFromBoard: (videoId: string, boardId: string) => void;
  reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) => void;
}

const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
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

export const useVideos = create<VideosState>()(
  persist(
    (set, get) => ({
      videos: [],
      boards: [],
      activeTab: 'recent',
      addVideo: async (url: string, isPinned: boolean = true) => {
        const videoId = getYouTubeVideoId(url);
        if (!videoId) throw new Error('Invalid YouTube URL');

        const details = await fetchVideoDetails(videoId);
        
        set((state) => ({
          videos: [
            {
              id: videoId,
              url,
              title: details.title,
              thumbnail: details.thumbnail,
              isPinned,
              addedAt: new Date(),
              notes: [],
              boardIds: [],
              views: 0,
              votes: 0,
            },
            ...state.videos,
          ],
        }));
      },
      togglePin: (id: string) =>
        set((state) => {
          const updatedVideos = state.videos.map((video) =>
            video.id === id ? { ...video, isPinned: !video.isPinned } : video
          );
          
          if (state.activeTab === 'pinned' && !updatedVideos.find(v => v.id === id)?.isPinned) {
            return {
              videos: updatedVideos,
              activeTab: 'recent'
            };
          }
          
          return { videos: updatedVideos };
        }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      addNote: (videoId: string, note: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? { ...video, notes: [...(video.notes || []), note] }
              : video
          ),
        })),
      addToBoard: (videoId: string, boardId: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? { ...video, boardIds: [...(video.boardIds || []), boardId] }
              : video
          ),
        })),
      addBoard: (name: string) => {
        const boardId = crypto.randomUUID();
        set((state) => ({
          boards: [...state.boards, { 
            id: boardId, 
            name,
            createdAt: new Date()
          }],
        }));
        return boardId;
      },
      deleteVideo: (id: string) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
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
      reorderVideosInBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => {
        set((state) => {
          const boardVideos = state.videos
            .filter(video => video.boardIds?.includes(boardId))
            .map((video, index) => ({ ...video, order: index }));

          const [reorderedVideo] = boardVideos.splice(sourceIndex, 1);
          boardVideos.splice(destinationIndex, 0, reorderedVideo);

          const updatedVideos = state.videos.map(video => {
            if (video.boardIds?.includes(boardId)) {
              const boardVideo = boardVideos.find(bv => bv.id === video.id);
              return { ...video, order: boardVideo?.order };
            }
            return video;
          });

          return { videos: updatedVideos };
        });
      },
      moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => {
        set((state) => {
          const updatedVideos = state.videos.map(video => {
            if (video.id === videoId) {
              const newBoardIds = [...(video.boardIds || [])];
              
              // Remove from source board if it's not a tab
              if (sourceBoardId !== 'recent' && sourceBoardId !== 'pinned' && sourceBoardId !== 'notes') {
                const sourceIndex = newBoardIds.indexOf(sourceBoardId);
                if (sourceIndex !== -1) {
                  newBoardIds.splice(sourceIndex, 1);
                }
              }
              
              // Add to destination board if it's not already there
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
      removeFromBoard: (videoId: string, boardId: string) =>
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === videoId
              ? {
                  ...video,
                  boardIds: (video.boardIds || []).filter((id) => id !== boardId),
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
    }),
    {
      name: 'videos-storage',
    }
  )
);
