import React from 'react';
import { X, CheckCircle2, Cpu } from 'lucide-react';
import type { ArchitectureNodeData } from '../types';
import { soundManager } from '../services/audio';

interface ArchitectureInspectorModalProps {
  node: ArchitectureNodeData | null;
  onClose: () => void;
}

export const ArchitectureInspectorModal: React.FC<ArchitectureInspectorModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel p-6 border border-cyan-500/30 bg-[#0c0f16]/95 shadow-2xl shadow-cyan-950/40 rounded-xl">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
                {node.layer} LAYER COMPONENT
              </span>
              <h3 className="text-xl font-display font-bold text-white tracking-wide">
                {node.name}
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Inspector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              TECHNOLOGY / FRAMEWORK
            </span>
            <div className="inline-block px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-cyan-300">
              {node.tech}
            </div>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              ARCHITECTURAL PURPOSE
            </span>
            <p className="text-sm text-slate-200 leading-relaxed font-body">
              {node.description}
            </p>
          </div>

          <div>
            <span className="text-xs font-mono text-slate-400 block mb-2">
              KEY ARCHITECTURAL RESPONSIBILITIES
            </span>
            <ul className="space-y-2">
              {node.responsibilities.map((resp, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="btn-secondary text-xs py-2 px-4"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
