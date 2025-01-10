import { Video } from '../types';

export const addVideoActions = (set: any) => ({
  addVideo: async (url: string, isPinned: boolean = true) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) throw new Error('Invalid YouTube URL');

    const details = await fetchVideoDetails(videoId);
    
    set((state: any) => ({
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
    set((state: any) => {
      const updatedVideos = state.videos.map((video: Video) =>
        video.id === id ? { ...video, isPinned: !video.isPinned } : video
      );
      return { videos: updatedVideos };
    }),
});

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