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
    (set) => ({
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
        set((state) => ({
          videos: state.videos.map((video) =>
            video.id === id ? { ...video, isPinned: !video.isPinned } : video
          ),
        })),
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
    }),
    {
      name: 'videos-storage',
    }
  )
);
