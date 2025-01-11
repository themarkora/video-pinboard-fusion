import { StateCreator } from 'zustand';
import { VideosState } from '../useVideos';
import { extractVideoId, fetchVideoInfo } from '@/lib/youtube';

export const addVideoActions = (
  set: Parameters<StateCreator<VideosState>>[0],
  get: Parameters<StateCreator<VideosState>>[1],
  store: Parameters<StateCreator<VideosState>>[2]
) => ({
  addVideo: async (url: string, isPinned: boolean = false) => {
    try {
      const videoId = extractVideoId(url);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      const videoInfo = await fetchVideoInfo(videoId);
      
      set((state) => ({
        videos: [
          {
            id: videoId,
            url,
            title: videoInfo.title || 'Untitled Video',
            thumbnail: videoInfo.thumbnail,
            isPinned,
            addedAt: new Date(),
            notes: [],
            boardIds: [],
            tags: [],
          },
          ...state.videos,
        ],
      }));
    } catch (error) {
      throw error;
    }
  },
});