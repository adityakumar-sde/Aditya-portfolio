import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Layout,
  Database,
  Radio,
  BrainCircuit,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Hammer,
  Layers,
  TrendingUp,
  Calendar,
  MapPin,
  GraduationCap,
  Activity,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import {
  ENGINEERING_SYSTEMS,
  PROJECTS,
  SKILL_CATEGORIES,
  ENGINEERING_NOW,
  AI_LAB_NODES,
  EXPERIENCE_ITEMS,
  EDUCATION_ITEMS,
  CRM_ARCHITECTURE_NODES,
} from '../data/portfolioData';
import { CommandHubCanvas, type HubDimension } from '../three/CommandHubCanvas';
import { ArchitectureInspectorModal } from '../components/ArchitectureInspectorModal';
import type { ArchitectureNodeData } from '../types';
import { soundManager } from '../services/audio';
import { useTheme } from '../context/ThemeContext';

interface SpatialEngineeringHubProps {
  initialDimension?: HubDimension;
  selectedSystemId?: string | null;
}

export const SpatialEngineeringHub: React.FC<SpatialEngineeringHubProps> = ({
  initialDimension = 'systems',
  selectedSystemId,
}) => {
  const { themeConfig } = useTheme();
  const [activeDimension, setActiveDimension] = useState<HubDimension>(initialDimension);
  const [selectedSubItemId, setSelectedSubItemId] = useState<string | null>('backend');
  const [activeWorkProjectId, setActiveWorkProjectId] = useState<string>(PROJECTS[0].id);
  const [activeStackTab, setActiveStackTab] = useState<'production' | 'ai' | 'evolution'>('production');
  const [activeAiLabNodeId, setActiveAiLabNodeId] = useState<string>('llm');
  const [activeCareerTab, setActiveCareerTab] = useState<'experience' | 'education'>('experience');

  // Architecture Inspector Modal for 3D Work section
  const [selectedArchNode, setSelectedArchNode] = useState<ArchitectureNodeData | null>(null);

  // Sync when hero or external caller selects a system
  useEffect(() => {
    if (selectedSystemId) {
      setActiveDimension('systems');
      setSelectedSubItemId(selectedSystemId);
    }
  }, [selectedSystemId]);

  // Sync with browser URL hash (e.g. #about, #work, #systems)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'about') setActiveDimension('about');
      else if (hash === 'work' || hash === 'projects') setActiveDimension('work');
      else if (hash === 'systems') setActiveDimension('systems');
      else if (hash === 'stack' || hash === 'skills') setActiveDimension('stack');
      else if (hash === 'career' || hash === 'experience') setActiveDimension('career');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleDimensionChange = (dim: HubDimension) => {
    soundManager.playClick();
    setActiveDimension(dim);
    if (dim === 'systems') setSelectedSubItemId('backend');
    else if (dim === 'work') setSelectedSubItemId('client-tier');
    else if (dim === 'stack') setSelectedSubItemId('java');
    else if (dim === 'career') setSelectedSubItemId('tam-infosoft');
    else if (dim === 'about') setSelectedSubItemId('philosophy-core');
  };

  const handleSubItemSelect = (id: string) => {
    soundManager.playClick();
    setSelectedSubItemId(id);

    if (activeDimension === 'systems') {
      setSelectedSubItemId(id);
    } else if (activeDimension === 'work') {
      const foundNode = CRM_ARCHITECTURE_NODES.find((n) => n.id === id || n.layer === id.replace('-tier', ''));
      if (foundNode) {
        setSelectedArchNode(foundNode);
      }
    } else if (activeDimension === 'stack') {
      if (['llm', 'genai', 'prompt-engineering', 'ai-apis', 'automation', 'n8n', 'ai-core'].includes(id)) {
        setActiveStackTab('ai');
        if (id !== 'ai-core') setActiveAiLabNodeId(id);
      } else {
        setActiveStackTab('production');
      }
    }
  };

  const dimensions = [
    { id: 'systems' as HubDimension, label: 'CORE SYSTEMS', index: '01', icon: <Server className="w-4 h-4" /> },
    { id: 'work' as HubDimension, label: 'SELECTED WORK', index: '02', icon: <Layers className="w-4 h-4" /> },
    { id: 'stack' as HubDimension, label: 'TECH STACK & AI', index: '03', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'career' as HubDimension, label: 'CAREER & MILESTONES', index: '04', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'about' as HubDimension, label: 'PHILOSOPHY & ABOUT', index: '05', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const currentProject = PROJECTS.find((p) => p.id === activeWorkProjectId) || PROJECTS[0];
  const currentSystem = ENGINEERING_SYSTEMS.find((s) => s.id === selectedSubItemId) || ENGINEERING_SYSTEMS[0];
  const currentAiNode = AI_LAB_NODES.find((n) => n.id === activeAiLabNodeId) || AI_LAB_NODES[0];

  const systemIconMap: Record<string, React.ReactNode> = {
    backend: <Server className="w-5 h-5 text-cyan-400" />,
    frontend: <Layout className="w-5 h-5 text-indigo-400" />,
    data: <Database className="w-5 h-5 text-emerald-400" />,
    realtime: <Radio className="w-5 h-5 text-amber-400" />,
    ai: <BrainCircuit className="w-5 h-5 text-pink-400" />,
    devops: <Cpu className="w-5 h-5 text-teal-400" />,
  };

  return (
    <section
      id="spatial-hub"
      style={{ backgroundColor: themeConfig.bgHex }}
      className="relative py-24 px-4 sm:px-6 lg:px-12 text-white overflow-hidden transition-colors duration-700"
    >
      {/* Invisible Anchors for Navbar Scrollspy & Smooth Scrolling */}
      <div id="systems" className="absolute -top-24" />
      <div id="work" className="absolute -top-24" />
      <div id="stack" className="absolute -top-24" />
      <div id="career" className="absolute -top-24" />
      <div id="about" className="absolute -top-24" />

      {/* Ambient Lighting shifting with Active Theme */}
      <div
        style={{ backgroundColor: themeConfig.primaryHex }}
        className="absolute top-1/4 -left-40 w-[480px] h-[480px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-colors duration-700"
      />
      <div
        style={{ backgroundColor: themeConfig.accentHex }}
        className="absolute bottom-1/4 -right-40 w-[480px] h-[480px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-colors duration-700"
      />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        {/* ================================================================= */}
        {/* TOP COMMAND DECK HEADER (ZeBeyond Engineering Platform Style)     */}
        {/* ================================================================= */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-widest uppercase">
                <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                <span>3D SPATIAL COMMAND HUB</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ALL SYSTEMS NOMINAL
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-sans font-black tracking-tight uppercase text-white">
              ENGINEERING PLATFORM
            </h2>
            <p className="text-sm text-slate-300 font-body max-w-xl">
              Unified interactive command deck consolidating architectural systems, flagship production work, curated stack, career trajectory, and engineering philosophy.
            </p>
          </div>

          {/* Quick Telemetry Stats */}
          <div className="flex items-center gap-3 sm:gap-6 bg-[#080c14]/90 p-3 sm:p-4 rounded-xl border border-white/10 backdrop-blur-md">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">AVAILABILITY</div>
              <div className="text-sm sm:text-base font-mono font-bold text-cyan-400">99.99% SLA</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">P99 LATENCY</div>
              <div className="text-sm sm:text-base font-mono font-bold text-emerald-400">&lt; 45ms</div>
            </div>
            <div className="w-[1px] h-8 bg-white/10" />
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">THROUGHPUT</div>
              <div className="text-sm sm:text-base font-mono font-bold text-indigo-400">250k+ QPS</div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 5-DIMENSION SWITCHER TABS                                         */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {dimensions.map((dim) => {
            const isActive = activeDimension === dim.id;
            return (
              <button
                key={dim.id}
                onClick={() => handleDimensionChange(dim.id)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-lg shadow-cyan-500/25 border border-cyan-300'
                    : 'bg-[#080c14]/80 text-slate-400 hover:text-white border border-white/10 hover:border-cyan-500/30 hover:bg-[#0f1422]'
                }`}
              >
                <span className={`text-[11px] font-mono ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {dim.index}
                </span>
                <span className={isActive ? 'text-white' : 'text-slate-400'}>{dim.icon}</span>
                <span>{dim.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeDimensionGlow"
                    className="absolute inset-0 rounded-xl bg-cyan-400/10 pointer-events-none"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* MAIN COMMAND DECK: 2-COLUMN SPLIT (3D STAGE + DOSSIER HUD)        */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =============================================================== */}
          {/* LEFT: 3D HOLOGRAPHIC STAGE (7 COLS ON LARGE)                     */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-4">
            <CommandHubCanvas
              activeDimension={activeDimension}
              selectedSubItemId={selectedSubItemId}
              onSelectSubItem={handleSubItemSelect}
            />

            {/* Sub-item Navigation Bar Below Canvas */}
            <div className="p-3 rounded-xl bg-[#080c14]/90 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-1">
                <span>INTERACTIVE SUBSYSTEMS</span>
                <span className="text-cyan-400">CLICK TO FOCUS</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {activeDimension === 'systems' &&
                  ENGINEERING_SYSTEMS.map((sys) => {
                    const isSelected = selectedSubItemId === sys.id;
                    return (
                      <button
                        key={sys.id}
                        onClick={() => handleSubItemSelect(sys.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-md shadow-cyan-500/10'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sys.color }} />
                        <span>{sys.title}</span>
                      </button>
                    );
                  })}

                {activeDimension === 'work' &&
                  PROJECTS.map((proj) => {
                    const isSelected = activeWorkProjectId === proj.id;
                    return (
                      <button
                        key={proj.id}
                        onClick={() => {
                          soundManager.playClick();
                          setActiveWorkProjectId(proj.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>{proj.title}</span>
                      </button>
                    );
                  })}

                {activeDimension === 'stack' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveStackTab('production');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                        activeStackTab === 'production'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      PRODUCTION CORE
                    </button>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveStackTab('ai');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                        activeStackTab === 'ai'
                          ? 'bg-pink-500/20 text-pink-300 border border-pink-400 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      NEURAL AI LAB
                    </button>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveStackTab('evolution');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                        activeStackTab === 'evolution'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      CONTINUOUS EVOLUTION
                    </button>
                  </div>
                )}

                {activeDimension === 'career' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveCareerTab('experience');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                        activeCareerTab === 'experience'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      ENGINEERING EXPERIENCE
                    </button>
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveCareerTab('education');
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono cursor-pointer ${
                        activeCareerTab === 'education'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                      }`}
                    >
                      ACADEMIC CREDENTIALS
                    </button>
                  </div>
                )}

                {activeDimension === 'about' && (
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-cyan-400">
                      MISSION: HIGH RELIABILITY & SCALE
                    </span>
                    <span className="px-3 py-1 rounded bg-white/5 border border-white/5 text-slate-300">
                      DELHI, INDIA
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT: COMMAND TELEMETRY DOSSIER (5 COLS ON LARGE)                */}
          {/* =============================================================== */}
          <div className="lg:col-span-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#080c14]/95 border border-white/10 backdrop-blur-xl shadow-2xl relative min-h-[580px] flex flex-col justify-between">
              {/* Dynamic Content Container */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* ======================================================= */}
                  {/* 1. CORE SYSTEMS DOSSIER                                 */}
                  {/* ======================================================= */}
                  {activeDimension === 'systems' && (
                    <motion.div
                      key={`systems-${currentSystem.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            {systemIconMap[currentSystem.id]}
                          </div>
                          <div>
                            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                              SYSTEM // {currentSystem.subtitle}
                            </span>
                            <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                              {currentSystem.title}
                            </h3>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded bg-white/5 border border-white/5">
                          SYS-0{currentSystem.id.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          PRIMARY ARCHITECTURE & TECH
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono text-sm text-cyan-300">
                          {currentSystem.tech}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          ENGINEERING ROLE & SPECS
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed font-body">
                          {currentSystem.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-2">
                        <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                          CORE SLA SPECIFICATIONS
                        </div>
                        <div className="grid grid-cols-1 gap-2.5">
                          {currentSystem.stats.map((stat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 p-3 rounded-lg bg-white/5 border border-white/5 text-xs font-mono text-slate-200"
                            >
                              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                              <span>{stat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <button
                          onClick={() => handleDimensionChange('work')}
                          className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 tracking-wider transition-colors cursor-pointer"
                        >
                          <span>VIEW SYSTEM IN SELECTED WORK</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ======================================================= */}
                  {/* 2. SELECTED WORK DOSSIER                                */}
                  {/* ======================================================= */}
                  {activeDimension === 'work' && (
                    <motion.div
                      key={`work-${currentProject.id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <div>
                          <div className="flex items-center gap-2">
                            {currentProject.featured && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                                FLAGSHIP SYSTEM
                              </span>
                            )}
                            <span className="text-xs font-mono text-slate-400">
                              {currentProject.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-sans font-bold text-white tracking-wide mt-1">
                            {currentProject.title}
                          </h3>
                        </div>

                        {currentProject.githubUrl && (
                          <a
                            href={currentProject.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-white/10 transition-colors"
                            title="View GitHub Repository"
                          >
                            <GithubIcon className="w-5 h-5 text-slate-300" />
                          </a>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                        {currentProject.description}
                      </p>

                      <div className="space-y-3">
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[11px] font-mono text-amber-400 block uppercase font-bold">
                            ENGINEERING CHALLENGE:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-body">
                            {currentProject.problem}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                          <span className="text-[11px] font-mono text-emerald-400 block uppercase font-bold">
                            ARCHITECTURAL SOLUTION:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed font-body">
                            {currentProject.solution}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-mono text-slate-400 uppercase">TECH PIPELINE:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentProject.technologies.map((t) => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded bg-white/5 border border-white/5 text-[11px] font-mono text-cyan-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            setSelectedArchNode(CRM_ARCHITECTURE_NODES[0]);
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors text-xs font-mono cursor-pointer font-bold"
                        >
                          <Cpu className="w-4 h-4" />
                          <span>LAUNCH 3D NODE INSPECTOR</span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ======================================================= */}
                  {/* 3. TECH STACK & AI LAB DOSSIER                          */}
                  {/* ======================================================= */}
                  {activeDimension === 'stack' && (
                    <motion.div
                      key={`stack-${activeStackTab}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {activeStackTab === 'production' && (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-white/10">
                            <span className="text-[11px] font-mono text-cyan-400 uppercase">
                              CURATED PRODUCTION STACK
                            </span>
                            <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                              Core Engineering Arsenal
                            </h3>
                          </div>

                          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2 scrollbar-none">
                            {SKILL_CATEGORIES.slice(0, 4).map((cat) => (
                              <div key={cat.category} className="space-y-2">
                                <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider">
                                  {cat.category}
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {cat.skills.map((skill) => (
                                    <div
                                      key={skill.name}
                                      className="p-2.5 rounded-lg bg-black/40 border border-white/5 space-y-1"
                                    >
                                      <div className="text-xs font-semibold text-white">{skill.name}</div>
                                      <div className="text-[10px] font-mono text-slate-400">{skill.level}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeStackTab === 'ai' && (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-white/10">
                            <span className="text-[11px] font-mono text-pink-400 uppercase">
                              NEURAL EXPERIMENTATION & APIS
                            </span>
                            <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                              {currentAiNode.title}
                            </h3>
                            <span className="text-xs font-mono text-slate-400">{currentAiNode.category}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {AI_LAB_NODES.map((n) => (
                              <button
                                key={n.id}
                                onClick={() => {
                                  soundManager.playClick();
                                  setActiveAiLabNodeId(n.id);
                                }}
                                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer ${
                                  activeAiLabNodeId === n.id
                                    ? 'bg-pink-500 text-white font-bold'
                                    : 'bg-white/5 text-slate-400 hover:text-white border border-white/5'
                                }`}
                              >
                                {n.title}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                              <span className="text-xs font-mono text-pink-400 uppercase font-bold">
                                ARCHITECTURAL PURPOSE:
                              </span>
                              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-body">
                                {currentAiNode.description}
                              </p>
                            </div>

                            <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                              <span className="text-xs font-mono text-cyan-400 uppercase font-bold">
                                PRODUCTION APPLICATION:
                              </span>
                              <p className="text-xs text-slate-300 leading-relaxed font-body">
                                {currentAiNode.useCase}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {activeStackTab === 'evolution' && (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-white/10">
                            <span className="text-[11px] font-mono text-indigo-400 uppercase">
                              CONTINUOUS EVOLUTION
                            </span>
                            <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                              Engineering Now
                            </h3>
                          </div>

                          <div className="space-y-3">
                            <div className="text-xs font-mono text-cyan-400 font-bold uppercase">
                              EXPLORING & EXPERIMENTING:
                            </div>
                            <div className="space-y-2">
                              {ENGINEERING_NOW.exploring.map((exp) => (
                                <div
                                  key={exp.name}
                                  className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                                >
                                  <span className="font-semibold text-white">{exp.name}</span>
                                  <span className="font-mono text-slate-400">{exp.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-3 pt-2">
                            <div className="text-xs font-mono text-indigo-400 font-bold uppercase">
                              GOING DEEPER INTO:
                            </div>
                            <div className="space-y-2">
                              {ENGINEERING_NOW.goingDeeperInto.map((deep) => (
                                <div
                                  key={deep.name}
                                  className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                                >
                                  <span className="font-semibold text-white">{deep.name}</span>
                                  <span className="font-mono text-slate-400">{deep.desc}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ======================================================= */}
                  {/* 4. CAREER & MILESTONES DOSSIER                          */}
                  {/* ======================================================= */}
                  {activeDimension === 'career' && (
                    <motion.div
                      key={`career-${activeCareerTab}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      {activeCareerTab === 'experience' && (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-white/10">
                            <span className="text-[11px] font-mono text-cyan-400 uppercase">
                              CAREER TRAJECTORY
                            </span>
                            <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                              Engineering Experience
                            </h3>
                          </div>

                          <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1 scrollbar-none">
                            {EXPERIENCE_ITEMS.map((exp) => (
                              <div
                                key={exp.id}
                                className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-base font-bold text-white">{exp.role}</div>
                                    <div className="text-xs font-mono text-cyan-400">{exp.company}</div>
                                  </div>
                                  {exp.current && (
                                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono">
                                      PRESENT
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-cyan-400" />
                                    {exp.period}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-slate-500" />
                                    {exp.location}
                                  </span>
                                </div>

                                <div className="space-y-1 text-xs text-slate-300 font-body">
                                  {exp.highlights.map((h, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                                      <span>{h}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {activeCareerTab === 'education' && (
                        <div className="space-y-4">
                          <div className="pb-3 border-b border-white/10">
                            <span className="text-[11px] font-mono text-emerald-400 uppercase">
                              ACADEMIC FOUNDATION
                            </span>
                            <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                              Education & Degrees
                            </h3>
                          </div>

                          <div className="space-y-3">
                            {EDUCATION_ITEMS.map((edu, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                                    <span className="text-sm font-bold text-white">{edu.degree}</span>
                                  </div>
                                  <span className="text-xs font-mono text-emerald-400 font-bold">
                                    {edu.grade}
                                  </span>
                                </div>

                                <div className="text-xs text-slate-300">{edu.institution}</div>

                                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                                  <span>{edu.period}</span>
                                  <span>{edu.location}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ======================================================= */}
                  {/* 5. PHILOSOPHY & ABOUT DOSSIER                           */}
                  {/* ======================================================= */}
                  {activeDimension === 'about' && (
                    <motion.div
                      key="about-dossier"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-6"
                    >
                      <div className="pb-3 border-b border-white/10">
                        <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                          05 / PRECISION & SCALE
                        </span>
                        <h3 className="text-2xl font-sans font-bold text-white tracking-wide">
                          Engineering Philosophy
                        </h3>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed">
                        I build software across the full development lifecycle — from robust backend architectures in Java and Spring Boot to reactive user experiences, distributed data persistence, and modern automation workflows.
                      </p>

                      <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-black/40 border border-cyan-500/20 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
                            <Hammer className="w-3.5 h-3.5" />
                            <span>01 // BUILD (Execution & Resilience)</span>
                          </div>
                          <p className="text-xs text-slate-300 font-body">
                            Translating specifications into deterministic, type-safe, production-tested software with high uptime.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-indigo-500/20 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-indigo-400">
                            <Layers className="w-3.5 h-3.5" />
                            <span>02 // DESIGN (Structure & Scalability)</span>
                          </div>
                          <p className="text-xs text-slate-300 font-body">
                            Designing maintainable service boundaries, database schemas, and clean API contracts before writing code.
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-pink-500/20 space-y-1">
                          <div className="flex items-center gap-2 text-xs font-mono font-bold text-pink-400">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>03 // EXPLORE (Innovation & Automation)</span>
                          </div>
                          <p className="text-xs text-slate-300 font-body">
                            Harnessing autonomous agentic tooling, visual workflow pipelines, and neural intelligence to eliminate repetitive toil.
                          </p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                        <a
                          href="#contact"
                          onClick={() => soundManager.playClick()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs font-mono tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-transform"
                        >
                          <span>COLLABORATE & INITIATE CONTACT</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Security / Status Footer */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>VERIFIED ENTERPRISE PROFILE</span>
                </div>
                <span>ADITYA.K // 2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Architecture Inspector Modal */}
      <ArchitectureInspectorModal
        node={selectedArchNode}
        onClose={() => setSelectedArchNode(null)}
      />
    </section>
  );
};
