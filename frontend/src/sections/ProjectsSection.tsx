import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import { PROJECTS } from '../data/portfolioData';
import { ArchitectureCanvas } from '../three/ArchitectureCanvas';
import { ArchitectureInspectorModal } from '../components/ArchitectureInspectorModal';
import type { ArchitectureNodeData } from '../types';
import { soundManager } from '../services/audio';

export const ProjectsSection: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<ArchitectureNodeData | null>(null);
  const crmProject = PROJECTS[0];
  const otherProjects = PROJECTS.slice(1);

  const handleNodeClick = (node: ArchitectureNodeData) => {
    soundManager.playClick();
    setSelectedNode(node);
  };

  return (
    <section id="work" className="relative py-28 px-6 bg-[#07080b] border-t border-white/5">
      <div className="max-w-7xl mx-auto space-y-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
              03 / PRODUCTION PORTFOLIO
            </span>
            <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
              SELECTED WORK
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 max-w-md font-body">
            Large-scale architectural systems and full-stack solutions built for reliability, throughput, and operational efficiency.
          </p>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-2xl border border-cyan-500/20 bg-[#0a0d14]/90 space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  FLAGSHIP ENTERPRISE SYSTEM
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {crmProject.category}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                {crmProject.title}
              </h3>
              <p className="text-sm md:text-base font-mono text-cyan-300">
                {crmProject.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {crmProject.githubUrl && (
                <a
                  href={crmProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundManager.playClick()}
                  className="btn-secondary text-xs font-mono py-2.5 px-4"
                  title="GitHub Repository (Placeholder)"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>REPOSITORY</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-400 mr-2">TECH STACK:</span>
            {crmProject.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded bg-white/5 border border-white/10 font-mono text-xs text-slate-200"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-mono tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>THE ENGINEERING CHALLENGE</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                {crmProject.problem}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black/40 border border-white/5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>ARCHITECTURAL SOLUTION</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                {crmProject.solution}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h4 className="text-lg font-display font-bold text-white tracking-wide">
                  SYSTEM ARCHITECTURE MATRIX
                </h4>
              </div>
              <span className="text-xs font-mono text-slate-400 hidden sm:block">
                React → Spring Boot → MySQL + Realtime WebSocket
              </span>
            </div>

            <ArchitectureCanvas onNodeClick={handleNodeClick} selectedNodeId={selectedNode?.id} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            <div className="space-y-3">
              <h5 className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
                SYSTEM CAPABILITIES & MODULES
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {crmProject.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h5 className="text-xs font-mono tracking-widest text-indigo-400 uppercase">
                ENGINEERING HIGHLIGHTS
              </h5>
              <div className="space-y-2.5">
                {crmProject.engineeringHighlights.map((hl, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-black/40 border border-white/5 flex items-start gap-3 text-xs text-slate-300 leading-relaxed font-body"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-display font-bold text-white tracking-wide">
              ADDITIONAL ENGINEERING INITIATIVES
            </h3>
            <span className="text-xs font-mono text-slate-400">
              CMS-DRIVEN REGISTRY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProjects.map((proj) => (
              <div
                key={proj.id}
                className="glass-panel p-8 rounded-xl border border-white/10 space-y-6 flex flex-col justify-between group hover:border-cyan-400/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase text-cyan-400 tracking-wider">
                      {proj.category}
                    </span>
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                        title="GitHub Repository (Placeholder)"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <h4 className="text-2xl font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {proj.title}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">
                    {proj.subtitle}
                  </p>

                  <p className="text-xs text-slate-300 font-body leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">
                      ARCHITECTURAL FLOW:
                    </span>
                    <p className="text-xs font-mono text-cyan-300/80 bg-black/40 p-2.5 rounded border border-white/5">
                      {proj.architectureDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologies.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ArchitectureInspectorModal node={selectedNode} onClose={() => setSelectedNode(null)} />
    </section>
  );
};
