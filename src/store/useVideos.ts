import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

export interface Video {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  isPinned: boolean;
  addedAt: Date;
  publishedAt: string;
  notes?: string[];
  boardId?: string;
}

interface Board {
  id: string;
  name: string;
}

interface VideosState {
  videos: Video[];
  boards: Board[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
  addVideo: (url: string) => Promise<void>;
  togglePin: (id: string) => void;
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
  addNote: (videoId: string, note: string) => void;
  addToBoard: (videoId: string, boardId: string) => void;
  addBoard: (name: string) => void;
  deleteVideo: (id: string) => void;
}

const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const fetchVideoDetails = async (videoId: string) => {
  try {
    // First try to get video info using oEmbed
    const response = await fetch(
      `https://noembed.com/embed?url=https://youtube.com/watch?v=${videoId}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch video details');
    }

    const data = await response.json();
    
    if (!data || !data.title) {
      throw new Error('Invalid video data received');
    }

    // Get upload date from YouTube page
    const pageResponse = await fetch(`https://youtube.com/watch?v=${videoId}`);
    const pageHtml = await pageResponse.text();
    
    // Extract upload date from meta tags
    const uploadDateMatch = pageHtml.match(/"uploadDate":"([^"]+)"/);
    const uploadDate = uploadDateMatch ? new Date(uploadDateMatch[1]) : new Date();

    return {
      title: data.title,
      publishedAt: format(uploadDate, 'MM/dd/yyyy'),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      author: data.author_name,
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    // Fallback to basic info if fetch fails
    return {
      title: 'YouTube Video',
      publishedAt: format(new Date(), 'MM/dd/yyyy'),
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      author: 'Unknown Creator'
    };
  }
};

export const useVideos = create<VideosState>()(
  persist(
    (set) => ({
      videos: [],
      boards: [],
      activeTab: 'recent',
      addVideo: async (url: string) => {
        const videoId = getYouTubeVideoId(url);
        if (!videoId) return;

        const details = await fetchVideoDetails(videoId);
        
        set((state) => ({
          videos: [
            {
              id: videoId,
              url,
              title: details.title,
              thumbnail: details.thumbnail,
              isPinned: false,
              addedAt: new Date(),
              publishedAt: details.publishedAt,
              notes: [],
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
            video.id === videoId ? { ...video, boardId } : video
          ),
        })),
      addBoard: (name: string) =>
        set((state) => ({
          boards: [...state.boards, { id: crypto.randomUUID(), name }],
        })),
      deleteVideo: (id: string) =>
        set((state) => ({
          videos: state.videos.filter((video) => video.id !== id),
        })),
    }),
    {
      name: 'videos-storage',
    }
  )
);