import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../services/audio';

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState<boolean>(true);

  const handleToggle = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-mono text-slate-300 hover:text-white cursor-pointer group"
      aria-label={muted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
      title={muted ? 'Enable subtle ambient sound' : 'Mute sound'}
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
          <span className="text-[11px] tracking-wider uppercase text-slate-400 group-hover:text-slate-200">
            SOUND OFF
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] tracking-wider uppercase text-cyan-300">
            SOUND ON
          </span>
          <span className="flex items-center gap-0.5 ml-0.5">
            <span className="w-0.5 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1.5 bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </>
      )}
    </button>
  );
};
