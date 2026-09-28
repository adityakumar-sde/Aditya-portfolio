import React from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../services/audio';

export const AboutSection: React.FC = () => {
  const domains = [
    'Backend Engineering',
    'Frontend Development',
    'Databases',
    'Realtime Systems',
    'AI Integration',
    'Automation Workflows',
    'DevOps & Containers'
  ];

  return (
    <section id="about" className="relative py-28 px-6 bg-[#080a0e] border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            09 / PROFILE
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            ABOUT ADITYA
          </h2>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-white/10 bg-[#0b0e14]/90 space-y-8">
          <div className="space-y-4 text-base md:text-lg text-slate-200 font-body leading-relaxed font-light">
            <p>
              I'm a Software Engineer focused on building reliable backend systems, modern web applications, realtime platforms and practical AI-powered solutions.
            </p>
            <p className="text-sm md:text-base text-slate-300">
              My engineering discipline combines robust core backend architectures with responsive frontend user experiences, production-tuned database persistence, and low-latency bidirectional socket channels. I prioritize clean code boundaries, strict typing, and automated delivery pipelines that eliminate operational friction.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
              CROSS-DISCIPLINARY TECHNICAL CONVERGENCE:
            </span>
            <div className="flex flex-wrap gap-2">
              {domains.map((d, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => soundManager.playClick()}
                  className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-200 hover:border-cyan-400 hover:text-cyan-300 transition-colors cursor-default"
                >
                  {d}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Location: {PERSONAL_INFO.location}</span>
            <span className="text-cyan-400">Direct Inquiries: {PERSONAL_INFO.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
