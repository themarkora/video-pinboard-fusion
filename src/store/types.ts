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
  tags?: string[];
}

export interface Board {
  id: string;
  name: string;
  createdAt: Date;
}

export interface VideosState {
  videos: Video[];
  boards: Board[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
  
  // Video actions
  addVideo: (url: string, isPinned?: boolean) => Promise<void>;
  deleteVideo: (id: string) => void;
  togglePin: (id: string) => void;
  addVote: (videoId: string) => void;
  addView: (videoId: string) => void;
  addNote: (videoId: string, note: string) => void;
  addTag: (videoId: string, tag: string) => void;
  
  // Board actions
  addBoard: (name: string) => string;
  addToBoard: (videoId: string, boardId: string) => void;
  removeFromBoard: (videoId: string, boardId: string) => void;
  moveVideoToBoard: (videoId: string, sourceBoardId: string, destinationBoardId: string) => void;
  reorderVideos: (listType: string, sourceIndex: number, destinationIndex: number) => void;
  reorderVideosInBoard: (boardId: string, sourceIndex: number, destinationIndex: number) => void;
  
  // Navigation actions
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
}