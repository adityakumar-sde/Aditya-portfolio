import React from 'react';
import { Hammer, Sparkles, Layers, Zap } from 'lucide-react';
import { soundManager } from '../services/audio';

export const EngineeringPhilosophySection: React.FC = () => {
  const blocks = [
    {
      title: 'BUILD',
      subtitle: 'Execution & Resilience',
      icon: <Hammer className="w-6 h-6 text-cyan-400" />,
      items: ['Backend systems', 'APIs & Gateways', 'Microservices', 'Realtime applications'],
      highlight: 'Java 17 · Spring Boot · WebSocket · MySQL',
      description: 'Translating product specifications into deterministic, type-safe, production-tested software with high uptime.'
    },
    {
      title: 'DESIGN',
      subtitle: 'Structure & Scalability',
      icon: <Layers className="w-6 h-6 text-indigo-400" />,
      items: ['Architecture & Clean Code', 'Normalized Databases', 'Responsive UI/UX', 'Scalable systems'],
      highlight: 'SOLID · System Design · JPA · React',
      description: 'Designing maintainable service boundaries, database schemas, and clean API contracts before writing code.'
    },
    {
      title: 'EXPLORE',
      subtitle: 'Innovation & Efficiency',
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      items: ['Generative AI', 'LLMs & RAG', 'Workflow Automation', 'Modern engineering'],
      highlight: 'n8n · AI APIs · Prompt Architecture',
      description: 'Harnessing autonomous agentic tooling, visual workflow pipelines, and neural intelligence to eliminate repetitive toil.'
    }
  ];

  return (
    <section id="engineering" className="relative py-28 px-6 bg-[#060709] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.25em] text-cyan-400 uppercase">
            <Zap className="w-3.5 h-3.5" />
            <span>02 / PHILOSOPHY</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            ENGINEERING, NOT JUST CODE.
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-body leading-relaxed font-light">
            I build software across the full development lifecycle — from backend architecture and APIs to modern interfaces, realtime systems, databases, DevOps and AI-powered workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {blocks.map((block, idx) => (
            <div
              key={block.title}
              onMouseEnter={() => soundManager.playClick()}
              className="glass-panel p-8 rounded-2xl space-y-6 relative group overflow-hidden border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:-translate-y-1.5"
            >
              <div className="absolute top-4 right-6 font-display font-black text-6xl text-white/5 pointer-events-none group-hover:text-cyan-500/10 transition-colors">
                0{idx + 1}
              </div>

              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  {block.icon}
                </div>
                <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">
                  PHASE // 0{idx + 1}
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-display font-black text-white tracking-wider">
                  {block.title}
                </h3>
                <span className="text-xs font-mono text-cyan-400 block mt-0.5">
                  {block.subtitle}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-body leading-relaxed">
                {block.description}
              </p>

              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase block">
                  CORE DOMAINS:
                </span>
                <ul className="space-y-2">
                  {block.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-white/10">
                <span className="text-[10px] font-mono text-cyan-300/80 block">
                  TECHNICAL FOCUS
                </span>
                <span className="text-xs font-mono font-medium text-slate-200">
                  {block.highlight}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
