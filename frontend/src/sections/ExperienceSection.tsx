import React from 'react';
import { Calendar, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';
import { EXPERIENCE_ITEMS } from '../data/portfolioData';
import { soundManager } from '../services/audio';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="relative py-28 px-6 bg-[#08090c] border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            07 / CAREER TRAJECTORY
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            EXPERIENCE
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-body leading-relaxed max-w-xl font-light">
            Hands-on engineering across enterprise systems, client platforms, and microservice APIs.
          </p>
        </div>

        <div className="relative pl-6 md:pl-10 space-y-12 before:absolute before:left-2 md:before:left-3 before:top-3 before:bottom-3 before:w-[2px] before:bg-gradient-to-b before:from-cyan-400 before:via-indigo-500 before:to-slate-800">
          {EXPERIENCE_ITEMS.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => soundManager.playClick()}
              className="relative space-y-4 group"
            >
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#060709] border-2 border-cyan-400 group-hover:scale-125 transition-transform flex items-center justify-center">
                {item.current && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                )}
              </div>

              <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6 bg-[#0a0d14]/90 group-hover:border-cyan-500/40 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-display font-bold text-white tracking-wide">
                        {item.role}
                      </h3>
                      {item.current && (
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-wider font-semibold">
                          PRESENT
                        </span>
                      )}
                    </div>
                    <span className="text-base font-semibold text-cyan-400 block mt-1">
                      {item.company}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs font-mono text-slate-400 md:text-right">
                    <div className="flex items-center md:justify-end gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{item.period}</span>
                    </div>
                    <div className="flex items-center md:justify-end gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="space-y-2.5 pt-2">
                  <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                    KEY RESPONSIBILITIES:
                  </span>
                  <ul className="space-y-2">
                    {item.responsibilities.map((resp, rIdx) => (
                      <li key={rIdx} className="flex items-start gap-3 text-xs md:text-sm text-slate-300 leading-relaxed font-body">
                        <ChevronRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {item.highlights && item.highlights.length > 0 && (
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-xs font-mono text-cyan-300/80 block uppercase tracking-wider">
                      IMPACT & HIGHLIGHTS:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      {item.highlights.map((hl, hIdx) => (
                        <div
                          key={hIdx}
                          className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
