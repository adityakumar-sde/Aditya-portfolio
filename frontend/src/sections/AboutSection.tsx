import React from 'react';
import { ArrowUpRight, CheckCircle2, Cpu, Globe2, Sparkles, Terminal } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../services/audio';

export const AboutSection: React.FC = () => {
  const stats = [
    { label: 'YEARS EXPERIENCE', value: '3+', desc: 'Modern software engineering' },
    { label: 'PRODUCTION APPS', value: '15+', desc: 'Shipped & scaled systems' },
    { label: 'RELIABILITY SLA', value: '99.99%', desc: 'Uptime & zero-downtime mesh' },
    { label: 'SCALE PEAK', value: '250k+', desc: 'Concurrent QPS processed' },
  ];

  const domains = [
    'Distributed Backend & Microservices',
    'Modern Web & Frontend (React/TypeScript)',
    'High-Throughput Databases & Caching',
    'Real-time WebSockets & Telemetry',
    'Cloud Native Infrastructure (Kubernetes/AWS)',
    'Event-Driven Streaming (Apache Kafka)',
    'CI/CD DevOps & GitOps Automation',
    'AI Model Integration & Vector Embeddings',
  ];

  return (
    <section id="about" className="relative py-28 px-6 sm:px-10 lg:px-20 bg-[#0a0d14] text-white border-t border-white/5">
      {/* Background Soft Glows */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-cyan-600/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>02 / ABOUT ADITYA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-white tracking-tight uppercase">
            Engineering With Precision & Scale
          </h2>
          <p className="text-base text-slate-400 max-w-2xl font-body">
            Passionate software engineer building resilient backend architectures, fluid web experiences, and distributed cloud systems.
          </p>
        </div>

        {/* 4 Creative Impact Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              onMouseEnter={() => soundManager.playClick()}
              className="p-6 rounded-2xl bg-[#0f1422]/90 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
            >
              <div className="text-3xl sm:text-4xl md:text-5xl font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-400 tracking-tight">
                {s.value}
              </div>
              <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-wider mt-2">
                {s.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {s.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Narrative & Technical Convergence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Personal Narrative */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0f1422]/80 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Background & Technical Philosophy
                </h3>
                <span className="text-xs font-mono text-slate-400">Based in {PERSONAL_INFO.location}</span>
              </div>
            </div>

            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              <p>
                I am a Software Engineer focused on building robust, high-performance distributed systems, reactive frontend experiences, and reliable microservice topologies.
              </p>
              <p>
                My engineering approach blends clean architectural boundaries, comprehensive test coverage, and automated deployment pipelines with intuitive, fluid user interfaces. From handling sub-millisecond database queries to orchestrating cloud-native container workloads, I focus on delivering scalable software that solves real problems.
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-emerald-400" />
                <span>Available for Global Remote Roles</span>
              </div>
              <a
                href="#contact"
                onClick={() => soundManager.playClick()}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <span>Direct Inquiries</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Technical Domains */}
          <div className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#0f1422]/80 border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Core Competencies
              </h3>
            </div>

            <div className="space-y-2.5">
              {domains.map((dom, idx) => (
                <div
                  key={idx}
                  onMouseEnter={() => soundManager.playClick()}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-cyan-500/30 transition-all text-xs font-mono text-slate-200"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{dom}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
