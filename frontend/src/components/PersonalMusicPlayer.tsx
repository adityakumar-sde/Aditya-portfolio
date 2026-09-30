import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Sparkles,
  Disc3,
  X,
  Upload,
  Search,
  Loader2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { soundManager } from '../services/audio';

export const PersonalMusicPlayer: React.FC = () => {
const {
  currentSong,
  isPlaying,
  togglePlay,
  playSong,
  playNext,
  playPrevious,
  executeCommand,
} = useMusic();

  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [commandInput, setCommandInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Chhath Puja');

  // Top Default Fallback: Sharda Sinha Chhath Puja Geet
  const activeTrack = currentSong || {
    id: 1,
    title: 'Kaanche Hi Baans Ke Bahangiya',
    artist: 'Sharda Sinha',
    language: 'Bhojpuri',
    genre: 'Chhath Puja',
    era: 'Classic',
    audioUrl: '/music/kaanche-hi-bans-ke-bahangiya.mp3',
    durationSeconds: 327,
    enabled: true
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    togglePlay();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    playNext();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    playPrevious();
  };

  const handleAiClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    setIsPromptOpen(!isPromptOpen);
  };

  const handleSubmitCommand = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commandInput.trim() || isProcessing) return;

    soundManager.playClick();
    setIsProcessing(true);
    await executeCommand(commandInput.trim());
    setIsProcessing(false);
    setCommandInput('');
    setIsPromptOpen(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    soundManager.playClick();
    setIsProcessing(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));

    try {
      const res = await fetch('/api/music/upload', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      const newSong = await res.json();
      playSong(newSong);
      setIsPromptOpen(false);
    } catch (err) {
      console.error('Failed to upload song:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const categories = [
    { label: '🌸 Chhath Puja (Priority #1)', query: 'Play Chhath Puja geet by Sharda Sinha' },
    { label: '🎙️ Old Hindi Classics', query: 'Play old Hindi classics' },
    { label: '📻 Old Bhojpuri Folk', query: 'Play old classic Bhojpuri song' },
    { label: '👑 Kishore Kumar', query: 'Kishore Kumar' },
    { label: '⚡ Pawan Singh Hits', query: 'Pawan Singh' },
    { label: '🔥 Khesari Lal Hits', query: 'Khesari Lal' },
    { label: '🙏 Hanuman Chalisa', query: 'Hanuman Chalisa' },
    { label: '🎵 52 Gaj Ka Daman', query: '52 Gaj Ka Daman' },
  ];

  const containerClasses =
    'fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 select-none max-w-[calc(100vw-2.5rem)]';

  return (
    <div className={containerClasses}>
      {/* AI Assistant Popover with Quick Category Access & Upload */}
      <AnimatePresence>
        {isPromptOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2.5 w-84 sm:w-96 max-w-[92vw] bg-[#0c0e14]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-white z-50 pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>SEARCH & AI MUSIC ASSISTANT</span>
              </div>
              <button
                onClick={() => setIsPromptOpen(false)}
                className="text-white/40 hover:text-white p-1 rounded hover:bg-white/10 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCommand} className="flex items-center gap-1.5 mb-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-cyan-400/70 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder="Search any song (e.g. Kesariya, Pawan Singh)..."
                  className="w-full bg-white/5 border border-white/15 focus:border-cyan-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/35 focus:outline-none transition-colors"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !commandInput.trim()}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-semibold cursor-pointer transition-all shadow-md flex items-center gap-1 text-xs shrink-0"
              >
                {isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Play</span>
                )}
              </button>
            </form>

            {/* Now Playing Info inside Popover */}
            {activeTrack && (
              <div className="flex items-center gap-2.5 p-2 mb-2.5 rounded-xl bg-white/5 border border-white/10">
                <div className="relative w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                  <Disc3 className={`w-4 h-4 text-cyan-300 ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-semibold text-white truncate">{activeTrack.title}</span>
                  <span className="text-[10px] text-white/60 truncate">{activeTrack.artist} • {activeTrack.mood || activeTrack.genre}</span>
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shrink-0">
                  {isPlaying ? 'PLAYING' : 'PAUSED'}
                </span>
              </div>
            )}

            {/* Quick Category / Artist Selectors */}
            <p className="text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">
              Quick Picks & Popular Searches:
            </p>
            <div className="grid grid-cols-2 gap-1 mb-2.5">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.label);
                    executeCommand(cat.query);
                    setIsPromptOpen(false);
                  }}
                  className={`text-[10px] px-2 py-1 rounded-lg text-left truncate transition-colors border cursor-pointer ${
                    activeCategory === cat.label
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 font-semibold'
                      : 'bg-white/5 hover:bg-white/10 text-white/75 hover:text-white border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Upload MP3 Option */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 font-mono text-[10px] cursor-pointer transition-colors">
                <Upload className="w-3 h-3" />
                <span>Upload MP3 Track</span>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[9px] text-white/40 font-mono">
                Auto-saves to library
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ULTRA-MINIMAL VISIBLE CAPSULE:
          Contains strictly and only 4 controls:
          1. Previous (⏮)
          2. Play / Pause (⏯)
          3. Next (⏭)
          4. AI / Search (✨)
          NO song name or text displayed!
      */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-1.5 bg-[#0a0c10]/92 hover:bg-[#0a0c10]/98 backdrop-blur-2xl border border-white/20 hover:border-cyan-400/60 rounded-full px-2.5 py-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all pointer-events-auto"
      >
        {/* 1. Previous */}
        <button
          onClick={handlePrevious}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors cursor-pointer active:scale-95"
          title="Previous Song"
          aria-label="Previous Song"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* 2. Play / Pause */}
        <button
          onClick={handleTogglePlay}
          className="p-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black transition-all cursor-pointer shadow-md shadow-cyan-500/30 active:scale-95 flex items-center justify-center"
          title={isPlaying ? 'Pause' : 'Resume'}
          aria-label={isPlaying ? 'Pause' : 'Resume'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* 3. Next */}
        <button
          onClick={handleNext}
          className="p-1.5 rounded-full hover:bg-white/10 text-white/75 hover:text-white transition-colors cursor-pointer active:scale-95"
          title="Next Song"
          aria-label="Next Song"
        >
          <SkipForward className="w-4 h-4" />
        </button>

        {/* 4. AI Feature */}
        <button
          onClick={handleAiClick}
          className={`p-1.5 rounded-full transition-colors cursor-pointer active:scale-95 ${
            isPromptOpen
              ? 'bg-cyan-500/30 text-cyan-300'
              : 'hover:bg-white/10 text-cyan-400 hover:text-cyan-300'
          }`}
          title="AI Voice & Natural Language Music Assistant / Search"
          aria-label="AI Music Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

export default PersonalMusicPlayer;