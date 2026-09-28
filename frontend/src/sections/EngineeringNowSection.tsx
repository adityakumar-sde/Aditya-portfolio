import React from 'react';
import { Hammer, Sparkles, TrendingUp, Layers } from 'lucide-react';
import { ENGINEERING_NOW } from '../data/portfolioData';
import { soundManager } from '../services/audio';

export const EngineeringNowSection: React.FC = () => {
  return (
    <section className="relative py-28 px-6 bg-[#08090d] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>05 / CONTINUOUS EVOLUTION</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            ENGINEERING NOW
          </h2>
          <p className="text-sm md:text-lg font-mono text-cyan-300">
            Technology doesn't stand still. Neither do I.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div
            onMouseEnter={() => soundManager.playClick()}
            className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-[#0a0d14]/80 hover:border-cyan-500/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Hammer className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg text-white tracking-wider">
                  BUILDING WITH
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 uppercase px-2 py-0.5 rounded bg-cyan-500/10">
                PRODUCTION
              </span>
            </div>

            <p className="text-xs text-slate-400 font-body">
              Technologies actively utilized in production environments, microservices, and client platforms.
            </p>

            <div className="space-y-3 pt-2">
              {ENGINEERING_NOW.buildingWith.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs font-mono text-slate-400">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            onMouseEnter={() => soundManager.playClick()}
            className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-[#0a0d14]/80 hover:border-pink-500/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-pink-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg text-white tracking-wider">
                  EXPLORING
                </h3>
              </div>
              <span className="text-[10px] font-mono text-pink-300 uppercase px-2 py-0.5 rounded bg-pink-500/10">
                INNOVATION
              </span>
            </div>

            <p className="text-xs text-slate-400 font-body">
              Emerging paradigms, agentic workflows, and LLM orchestration being tested in labs and personal prototypes.
            </p>

            <div className="space-y-3 pt-2">
              {ENGINEERING_NOW.exploring.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs font-mono text-pink-300/80">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            onMouseEnter={() => soundManager.playClick()}
            className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-[#0a0d14]/80 hover:border-indigo-500/40 transition-all duration-300"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-indigo-400">
                <Layers className="w-5 h-5" />
                <h3 className="font-display font-bold text-lg text-white tracking-wider">
                  GOING DEEPER INTO
                </h3>
              </div>
              <span className="text-[10px] font-mono text-indigo-300 uppercase px-2 py-0.5 rounded bg-indigo-500/10">
                MASTERY
              </span>
            </div>

            <p className="text-xs text-slate-400 font-body">
              Deep foundational architectural competencies being refined through rigorous study and distributed problem-solving.
            </p>

            <div className="space-y-3 pt-2">
              {ENGINEERING_NOW.goingDeeperInto.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-white">{item.name}</span>
                  <span className="text-xs font-mono text-indigo-300/80">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
