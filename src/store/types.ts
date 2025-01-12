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
  addVideo: (url: string, isPinned?: boolean) => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
  addNote: (videoId: string, note: string) => Promise<void>;
  updateNote: (videoId: string, noteIndex: number, updatedNote: string) => void;
  deleteNote: (videoId: string, noteIndex: number) => void;
  addBoard: (name: string) => string;
  deleteBoard: (boardId: string) => Promise<void>;
  addToBoard: (videoId: string, boardId: string) => Promise<void>;
  removeFromBoard: (videoId: string, boardId: string) => Promise<void>;
  setActiveTab: (tab: 'recent' | 'pinned' | 'notes' | 'boards') => void;
  clearState: () => void;
  fetchUserData: () => Promise<void>;
  renameBoard: (boardId: string, newName: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  addTag: (videoId: string, tag: string) => void;
  removeTag: (videoId: string, tag: string) => void;
  addVote: (videoId: string) => void;
  addView: (videoId: string) => void;
}