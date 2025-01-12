export const boardActions = (set: any) => ({
  addBoard: (name: string) => {
    const boardId = crypto.randomUUID();
    set((state: any) => ({
      boards: [...state.boards, { 
        id: boardId, 
        name,
        createdAt: new Date()
      }],
    }));
    return boardId;
  },
  
  addToBoard: (videoId: string, boardId: string) =>
    set((state: any) => ({
      videos: state.videos.map((video: any) =>
        video.id === videoId
          ? { ...video, boardIds: [...(video.boardIds || []), boardId] }
          : video
      ),
    })),

  removeFromBoard: (videoId: string, boardId: string) =>
    set((state: any) => ({
      videos: state.videos.map((video: any) =>
        video.id === videoId
          ? {
              ...video,
              boardIds: (video.boardIds || []).filter((id: string) => id !== boardId),
            }
          : video
      ),
    })),
});