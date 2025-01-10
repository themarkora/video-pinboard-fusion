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

export interface Board {
  id: string;
  name: string;
  createdAt: Date;
}

export interface VideosState {
  videos: Video[];
  boards: Board[];
  activeTab: 'recent' | 'pinned' | 'notes' | 'boards';
}