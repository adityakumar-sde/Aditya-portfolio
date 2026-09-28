import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { soundManager } from '../services/audio';

export const EngineeringStackSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>(SKILL_CATEGORIES[0].category);

  const currentCategoryData = SKILL_CATEGORIES.find((c) => c.category === activeCategory) || SKILL_CATEGORIES[0];

  return (
    <section className="relative py-28 px-6 bg-[#060709] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
            04 / TECHNICAL PROFICIENCY
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold text-white tracking-tight uppercase">
            CURATED ENGINEERING STACK
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-body leading-relaxed font-light">
            A purposeful, enterprise-tested toolkit chosen for stability, performance, and maintainability across distributed systems and modern interfaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-white/10">
          {SKILL_CATEGORIES.map((cat) => {
            const isActive = cat.category === activeCategory;
            return (
              <button
                key={cat.category}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat.category);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-black font-bold shadow-lg shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.category}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {currentCategoryData.skills.map((skill, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundManager.playClick()}
              className="glass-panel p-6 rounded-xl space-y-3 border border-white/10 hover:border-cyan-500/40 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-bold text-white tracking-wide">
                  {skill.name}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {skill.level}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-body leading-relaxed">
                {skill.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
