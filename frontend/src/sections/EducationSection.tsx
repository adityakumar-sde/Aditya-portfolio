import React from 'react';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { EDUCATION_ITEMS } from '../data/portfolioData';
import { soundManager } from '../services/audio';

export const EducationSection: React.FC = () => {
  return (
    <section className="relative py-24 px-6 bg-[#060709] border-t border-white/5">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            08 / ACADEMIC FOUNDATION
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white tracking-tight uppercase">
            EDUCATION
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EDUCATION_ITEMS.map((item, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundManager.playClick()}
              className="glass-panel p-6 rounded-xl border border-white/10 space-y-4 hover:border-cyan-500/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  {item.grade}
                </span>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-white leading-snug">
                  {item.degree}
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-body">
                  {item.institution}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{item.period}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
