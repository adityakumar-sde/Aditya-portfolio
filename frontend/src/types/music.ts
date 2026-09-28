export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  language: string;
  genre?: string;
  era?: string;
  mood?: string;
  tags?: string;
  audioUrl: string;
  coverUrl?: string;
  durationSeconds?: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface MusicListResponse {
  songs: Song[];
  total: number;
  message: string;
}

export interface MusicCommandResponse {
  success: boolean;
  action: 'PLAY' | 'PAUSE' | 'RESUME' | 'NEXT' | 'PREVIOUS' | 'SEARCH';
  message: string;
  songs: Song[];
  currentSong?: Song;
}