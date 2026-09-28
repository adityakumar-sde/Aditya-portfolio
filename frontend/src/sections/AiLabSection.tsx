import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Zap } from 'lucide-react';
import { AI_LAB_NODES } from '../data/portfolioData';
import { AiLabCanvas } from '../three/AiLabCanvas';
import { soundManager } from '../services/audio';

export const AiLabSection: React.FC = () => {
  const [activeNodeId, setActiveNodeId] = useState<string>('llm');

  const activeNode = AI_LAB_NODES.find((n) => n.id === activeNodeId) || AI_LAB_NODES[0];

  const handleNodeClick = (id: string) => {
    soundManager.playClick();
    setActiveNodeId(id);
  };

  return (
    <section className="relative py-28 px-6 bg-[#06070a] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-pink-400">
              06 / NEURAL EXPERIMENTATION
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight">
              AI LAB
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 max-w-md font-body">
            Bridging production software engineering with modern neural architectures, automated visual workflows, and deterministic prompt systems.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <AiLabCanvas onNodeClick={handleNodeClick} activeNodeId={activeNodeId} />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="flex flex-wrap gap-2">
              {AI_LAB_NODES.map((node) => {
                const isSelected = node.id === activeNodeId;
                return (
                  <button
                    key={node.id}
                    onClick={() => handleNodeClick(node.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/25 border border-pink-400'
                        : 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
                    }`}
                  >
                    {node.title}
                  </button>
                );
              })}
            </div>

            <div className="glass-panel p-8 rounded-2xl border border-pink-500/30 bg-[#090c13]/90 space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-pink-400 uppercase tracking-widest">
                      {activeNode.category}
                    </span>
                    <h3 className="text-2xl font-display font-black text-white tracking-wide">
                      {activeNode.title}
                    </h3>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 block mb-1">
                  METHODOLOGY & CAPABILITY
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-body">
                  {activeNode.description}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-pink-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span>PRACTICAL IMPLEMENTATION</span>
                </div>
                <p className="text-xs text-slate-300 font-body leading-relaxed">
                  {activeNode.useCase}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Integrated with Spring Boot APIs</span>
                <span className="text-pink-400">Zero Hallucinations ✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
