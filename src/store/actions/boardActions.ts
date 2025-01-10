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

  moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => {
    set((state: any) => {
      const updatedVideos = state.videos.map((video: any) => {
        if (video.id === videoId) {
          let newBoardIds = [...(video.boardIds || [])];
          
          if (sourceBoardId !== 'recent' && sourceBoardId !== 'pinned' && sourceBoardId !== 'notes') {
            newBoardIds = newBoardIds.filter(id => id !== sourceBoardId);
          }
          
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
});