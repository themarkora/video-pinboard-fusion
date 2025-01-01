import { create } from 'zustand';

export interface Video {
  id: string;
  url: string;
  title: string;
  thumbnail: string;
  isPinned: boolean;
  addedAt: Date;
}

interface VideosState {
  videos: Video[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
  addVideo: (url: string) => Promise<void>;
  togglePin: (id: string) => void;
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
}

const getYouTubeVideoId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export const useVideos = create<VideosState>((set) => ({
  videos: [],
  activeTab: 'recent',
  addVideo: async (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return;

    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=YOUR_API_KEY&part=snippet`;
    // For now, we'll use placeholder data since we don't have an API key
    const newVideo: Video = {
      id: videoId,
      url,
      title: 'YouTube Video',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      isPinned: true,
      addedAt: new Date(),
    };

    set((state) => ({
      videos: [newVideo, ...state.videos],
    }));
  },
  togglePin: (id: string) => {
    set((state) => ({
      videos: state.videos.map((video) =>
        video.id === id ? { ...video, isPinned: !video.isPinned } : video
      ),
    }));
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
}));