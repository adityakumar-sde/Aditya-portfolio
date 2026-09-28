import React from 'react';
import { Server, Layout, Database, Radio, BrainCircuit, Cpu } from 'lucide-react';
import { ENGINEERING_SYSTEMS } from '../data/portfolioData';
import { soundManager } from '../services/audio';

interface EngineeringSystemsSectionProps {
  selectedSystemId?: string | null;
}

export const EngineeringSystemsSection: React.FC<EngineeringSystemsSectionProps> = ({ selectedSystemId }) => {
  const iconMap: Record<string, React.ReactNode> = {
    backend: <Server className="w-5 h-5 text-cyan-400" />,
    frontend: <Layout className="w-5 h-5 text-indigo-400" />,
    data: <Database className="w-5 h-5 text-emerald-400" />,
    realtime: <Radio className="w-5 h-5 text-amber-400" />,
    ai: <BrainCircuit className="w-5 h-5 text-pink-400" />,
    devops: <Cpu className="w-5 h-5 text-teal-400" />
  };

  return (
    <section id="systems" className="relative py-24 px-6 bg-[#08090c] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
              01 / CORE SYSTEMS
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight">
              ARCHITECTURAL ECOSYSTEM
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 max-w-md font-body">
            Six specialized technical domains functioning in synergy to build resilient, distributed, and responsive digital products.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ENGINEERING_SYSTEMS.map((sys) => {
            const isHighlighted = selectedSystemId === sys.id;

            return (
              <div
                key={sys.id}
                onMouseEnter={() => soundManager.playClick()}
                className={`glass-panel p-6 rounded-xl space-y-4 transition-all duration-300 relative group overflow-hidden ${
                  isHighlighted ? 'border-cyan-400 bg-cyan-950/20 ring-1 ring-cyan-400/50 scale-[1.02]' : ''
                }`}
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10 group-hover:opacity-25 transition-opacity pointer-events-none"
                  style={{ backgroundColor: sys.color }}
                />

                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    {iconMap[sys.id]}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">SYS // 0{sys.id.length}</span>
                </div>

                <div>
                  <h3 className="text-xl font-display font-bold text-white tracking-wide">
                    {sys.title}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 block mt-0.5">
                    {sys.subtitle}
                  </span>
                </div>

                <div className="inline-block px-2.5 py-1 rounded bg-black/40 border border-white/5 font-mono text-xs text-slate-300">
                  {sys.tech}
                </div>

                <p className="text-xs text-slate-300 font-body leading-relaxed">
                  {sys.description}
                </p>

                <div className="pt-2 border-t border-white/5 space-y-1.5">
                  {sys.stats.map((st, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">{st}</span>
                      <span className="text-cyan-400">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
