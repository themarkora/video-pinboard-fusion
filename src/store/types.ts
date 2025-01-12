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