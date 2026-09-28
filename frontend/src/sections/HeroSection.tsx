import React, { useState } from 'react';
import { ArrowDown, FileDown, Terminal, Sparkles, ChevronRight } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { HeroCanvas } from '../three/HeroCanvas';
import { soundManager } from '../services/audio';

interface HeroSectionProps {
  onOpenResume: () => void;
  onSelectSystem?: (systemId: string) => void;
  customConfig?: {
    title: string;
    tagline: string;
    statusText: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenResume, onSelectSystem, customConfig }) => {
  const [activeSystem, setActiveSystem] = useState<string | null>(null);

  const handleSystemClick = (sysId: string) => {
    soundManager.playClick();
    setActiveSystem(sysId);
    onSelectSystem?.(sysId);
    const el = document.getElementById('systems');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-16 px-6 overflow-hidden bg-[#060709]">
      <div className="absolute inset-0 z-0">
        <HeroCanvas onSelectSystem={handleSystemClick} activeSystemId={activeSystem} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pointer-events-none">
        <div className="lg:col-span-8 space-y-6 text-left pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
              {customConfig?.statusText || `${PERSONAL_INFO.location} · AVAILABLE FOR IMPACT`}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight text-white uppercase leading-[0.95]">
              ADITYA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">
                KUMAR
              </span>
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <span className="h-[2px] w-8 bg-cyan-400" />
              <p className="text-sm md:text-lg font-mono tracking-[0.25em] text-cyan-400 uppercase font-semibold">
                {customConfig?.title || PERSONAL_INFO.title}
              </p>
            </div>
          </div>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl font-body leading-relaxed font-light">
            {customConfig?.tagline || PERSONAL_INFO.tagline}
          </p>

          <div className="pt-1">
            <div className="inline-flex items-center gap-2 text-xs md:text-sm font-mono text-slate-400 bg-black/40 px-3.5 py-2 rounded-lg border border-white/5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{PERSONAL_INFO.secondaryStatement}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              onClick={() => soundManager.playClick()}
              className="btn-primary"
            >
              <span>VIEW MY WORK</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                soundManager.playClick();
                onOpenResume();
              }}
              className="btn-secondary"
            >
              <FileDown className="w-4 h-4 text-cyan-400" />
              <span>DOWNLOAD RESUME</span>
            </button>

            <a
              href="#about"
              onClick={() => soundManager.playClick()}
              className="text-xs font-mono tracking-widest text-slate-400 hover:text-white px-3 py-2 transition-colors"
            >
              ABOUT ME →
            </a>
          </div>
        </div>

        <div className="lg:col-span-4 hidden lg:flex flex-col items-end text-right pointer-events-auto">
          <div className="glass-panel p-5 max-w-xs space-y-3 bg-[#0a0d14]/75 border-cyan-500/20">
            <div className="flex items-center justify-end gap-2 text-cyan-400 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE ENVIRONMENT</span>
            </div>
            <p className="text-xs text-slate-300 font-body leading-relaxed">
              Orbiting satellites represent core engineering systems. Click any node in 3D space to inspect its capabilities.
            </p>
            <div className="flex flex-wrap justify-end gap-1.5 pt-1">
              {['BACKEND', 'FRONTEND', 'DATA', 'REALTIME', 'AI', 'DEVOPS'].map((node) => (
                <button
                  key={node}
                  onClick={() => handleSystemClick(node.toLowerCase())}
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-white/5 transition-colors cursor-pointer"
                >
                  {node}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none opacity-60">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400">
          SCROLL TO EXPLORE
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
      </div>
    </section>
  );
};
