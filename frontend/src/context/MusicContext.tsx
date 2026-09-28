import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type { Song, MusicListResponse, MusicCommandResponse } from '../types/music';

interface MusicContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  playlist: Song[];
  statusMessage: string;
  togglePlay: () => void;
  playSong: (song: Song) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  executeCommand: (command: string) => Promise<MusicCommandResponse | null>;
  volume: number;
  setVolume: (v: number) => void;
  audioError: string | null;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>('Personal Music Player Ready');
  const [volume, setVolumeState] = useState<number>(0.85);
  const [audioError, setAudioError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentSongRef = useRef<Song | null>(null);
  currentSongRef.current = currentSong;

  const playNextRef = useRef<() => void>(() => {});
  const playPreviousRef = useRef<() => void>(() => {});
  const playlistRef = useRef<Song[]>([]);
  playlistRef.current = playlist;

  // Initialize persistent HTML5 Audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Continuous playback: automatically play next song when current finishes
    audio.onended = () => {
      if (playNextRef.current) {
        playNextRef.current();
      }
    };

    audio.onerror = (e) => {
      console.warn('Audio playback element error:', e);
      setIsPlaying(false);
      setAudioError('Unable to stream track');
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Fetch initial default songs (Bhojpuri / Bihari Old Classic preference)
  useEffect(() => {
    fetch('/api/music/default')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load default music');
        return res.json() as Promise<MusicListResponse>;
      })
      .then((data) => {
        if (data.songs && data.songs.length > 0) {
          setPlaylist(data.songs);
          setCurrentSong(data.songs[0]);
          setStatusMessage(data.message || 'Preferred Bhojpuri classics ready');
        }
      })
      .catch((err) => {
        console.warn('Could not load default music from backend:', err);
      });
  }, []);

  const playSong = useCallback((song: Song) => {
    if (!audioRef.current || !song) return;
    setAudioError(null);
    setCurrentSong(song);

    audioRef.current.src = song.audioUrl;
    audioRef.current.load();

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true);
        setStatusMessage(`Playing: ${song.title} (${song.language})`);
      })
      .catch((err) => {
        console.warn('Audio play request blocked or failed:', err);
        setIsPlaying(false);
        setAudioError('Click Play to allow audio playback');
      });
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setStatusMessage('Playback paused');
    } else {
      setAudioError(null);
      if (!audioRef.current.src || !audioRef.current.src.endsWith(currentSong.audioUrl)) {
        audioRef.current.src = currentSong.audioUrl;
        audioRef.current.load();
      }
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setStatusMessage(`Playing: ${currentSong.title}`);
        })
        .catch((err) => {
          console.warn('Audio play blocked:', err);
          setIsPlaying(false);
          setAudioError('Click Play to listen');
        });
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(async () => {
    const list = playlistRef.current;
    const cur = currentSongRef.current;
    if (list && list.length > 1 && cur) {
      const curIndex = list.findIndex(
        (s) => (s.id && cur.id && s.id === cur.id) || (s.audioUrl && cur.audioUrl && s.audioUrl === cur.audioUrl)
      );
      if (curIndex !== -1 && curIndex < list.length - 1) {
        playSong(list[curIndex + 1]);
        return;
      } else if (curIndex !== -1 && curIndex === list.length - 1) {
        playSong(list[0]);
        return;
      }
    }

    try {
      const url = cur && cur.id ? `/api/music/next?currentId=${cur.id}` : '/api/music/next';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch next song');
      const nextSong: Song = await res.json();
      playSong(nextSong);
    } catch (err) {
      console.warn('Next song error:', err);
    }
  }, [playSong]);

  const playPrevious = useCallback(async () => {
    const list = playlistRef.current;
    const cur = currentSongRef.current;
    if (list && list.length > 1 && cur) {
      const curIndex = list.findIndex(
        (s) => (s.id && cur.id && s.id === cur.id) || (s.audioUrl && cur.audioUrl && s.audioUrl === cur.audioUrl)
      );
      if (curIndex > 0) {
        playSong(list[curIndex - 1]);
        return;
      } else if (curIndex === 0) {
        playSong(list[list.length - 1]);
        return;
      }
    }

    try {
      const url = cur && cur.id ? `/api/music/previous?currentId=${cur.id}` : '/api/music/previous';
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch previous song');
      const prevSong: Song = await res.json();
      playSong(prevSong);
    } catch (err) {
      console.warn('Previous song error:', err);
    }
  }, [playSong]);

  // Keep refs updated for event callbacks
  playNextRef.current = playNext;
  playPreviousRef.current = playPrevious;

  const executeCommand = useCallback(
    async (commandText: string): Promise<MusicCommandResponse | null> => {
      try {
        const res = await fetch('/api/music/command', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            command: commandText,
          }),
        });
        if (!res.ok) throw new Error('Command failed');
        const data: MusicCommandResponse = await res.json();

        setStatusMessage(data.message);

        if (data.action === 'PAUSE') {
          if (audioRef.current) audioRef.current.pause();
          setIsPlaying(false);
        } else if (data.action === 'RESUME') {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
          }
        } else if (data.action === 'NEXT') {
          await playNext();
        } else if (data.action === 'PREVIOUS') {
          await playPrevious();
        } else if (data.action === 'PLAY') {
          if (data.songs && data.songs.length > 0) {
            setPlaylist(data.songs);
            playSong(data.songs[0]);
          } else if (data.currentSong) {
            playSong(data.currentSong);
          }
        }

        return data;
      } catch (err) {
        console.warn('Command execution error:', err);
        return null;
      }
    },
    [playSong, playNext, playPrevious]
  );

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) {
      audioRef.current.volume = v;
    }
  }, []);

  return (
    <MusicContext.Provider
      value={{
        currentSong,
        isPlaying,
        playlist,
        statusMessage,
        togglePlay,
        playSong,
        playNext,
        playPrevious,
        executeCommand,
        volume,
        setVolume,
        audioError,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};