import React from 'react';
import { X, Download, Printer, CheckCircle, Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { PERSONAL_INFO, EXPERIENCE_ITEMS, EDUCATION_ITEMS, SKILL_CATEGORIES } from '../data/portfolioData';
import { soundManager } from '../services/audio';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const handleDownload = () => {
    soundManager.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl h-[90vh] bg-[#0b0e14] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        <div className="px-6 py-4 bg-[#10141d] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
              EXECUTIVE RESUME PROFILE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-xs font-mono font-semibold text-black transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Resume"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-[#0b0e14] font-body space-y-8">
          <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-extrabold text-white tracking-wide">
                {PERSONAL_INFO.name}
              </h1>
              <h2 className="text-sm font-mono tracking-widest text-cyan-400 mt-1 uppercase">
                {PERSONAL_INFO.title}
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-2 leading-relaxed">
                {PERSONAL_INFO.tagline}
              </p>
            </div>

            <div className="space-y-1 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>{PERSONAL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{PERSONAL_INFO.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
              Engineering Profile
            </h3>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              {PERSONAL_INFO.about}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Professional Experience</span>
            </h3>

            <div className="space-y-6">
              {EXPERIENCE_ITEMS.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h4 className="text-sm font-bold text-white">
                      {exp.role} · <span className="text-cyan-300 font-semibold">{exp.company}</span>
                    </h4>
                    <span className="text-xs font-mono text-slate-400">{exp.period} | {exp.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 py-1">
                    {exp.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <ul className="space-y-1.5 pl-4 list-disc text-xs text-slate-300">
                    {exp.responsibilities.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Education & Academic Background</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {EDUCATION_ITEMS.map((edu, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-white/5 border border-white/5 space-y-1">
                  <h4 className="text-xs font-bold text-white">{edu.degree}</h4>
                  <p className="text-[11px] text-slate-400">{edu.institution}</p>
                  <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                    <span className="text-slate-400">{edu.period}</span>
                    <span className="text-cyan-400 font-semibold">{edu.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4">
              Technical Proficiencies
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SKILL_CATEGORIES.map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <h5 className="text-[11px] font-mono font-bold text-slate-300 border-b border-white/10 pb-1">
                    {cat.category}
                  </h5>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {cat.skills.map((s, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <CheckCircle className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                        <span>{s.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
