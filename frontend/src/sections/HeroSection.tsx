import React, { lazy, Suspense, useState } from 'react';
import { ArrowUpRight, ChevronDown, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../services/audio';
import { useTheme } from '../context/ThemeContext';

const HeroCanvas = lazy(() =>
  import('../three/HeroCanvas').then((module) => ({
    default: module.HeroCanvas,
  })),
);

interface HeroSectionProps {
  onOpenResume?: () => void;
  onSelectSystem?: (systemId: string) => void;
  customConfig?: {
    title: string;
    tagline: string;
    statusText: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  customConfig,
}) => {
  const { theme, themeConfig } = useTheme();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const techChips = [
    'Java / Spring',
    'Go',
    'React',
    'TypeScript',
    'Kubernetes',
    'AWS',
    'Kafka',
    'PostgreSQL',
  ];

  return (
    <section
      id="hero"
      style={{ backgroundColor: themeConfig.bgHex }}
      className="relative min-h-screen w-full flex items-center justify-center px-6 sm:px-10 lg:px-20 overflow-hidden text-white pt-20 transition-colors duration-700"
    >
      {/* Subtle Ambient Depth Lighting in Background shifting with Theme */}
      <div
        style={{ backgroundColor: themeConfig.primaryHex }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full filter blur-[140px] pointer-events-none opacity-10 transition-colors duration-700"
      />
      <div
        style={{ backgroundColor: themeConfig.accentHex }}
        className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full filter blur-[130px] pointer-events-none opacity-10 transition-colors duration-700"
      />

      {/* 3D Atmospheric Canvas (Stars, Cyber Matrix, or Zen Fireflies) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
        <Suspense fallback={null}>
          <HeroCanvas themeMode={theme} />
        </Suspense>
      </div>

      {/* Center Stage Container - Exactly matching Dribbble Reference */}
      <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col md:flex-row items-center justify-center gap-10 md:gap-14 lg:gap-20 py-16">
        {/* Left Column: Creative Circular Avatar of Aditya with 3D Tilt & Status Badges */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group shrink-0 cursor-pointer"
        >
          {/* Theme Dynamic Ambient Aura Pulse */}
          <div
            className={`absolute -inset-4 bg-gradient-to-tr ${themeConfig.auraGradient} rounded-full filter blur-2xl -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-pulse`}
          />

          {/* Main Circular Portrait */}
          <div
            style={{
              transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)] bg-[#111722]"
          >
            <img
              src="/aditya-photo-hd.jpg"
              alt="Aditya Kumar"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* Floating Status Pill Badge (Bottom-Left) */}
          <div className="absolute -bottom-2 -left-2 sm:bottom-3 sm:-left-3 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0c1220]/95 backdrop-blur-xl border border-emerald-500/30 text-emerald-300 shadow-2xl shadow-black/90 pointer-events-none transition-transform group-hover:scale-105">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-semibold tracking-wider uppercase">Open to Work</span>
          </div>

          {/* Floating Tech Badge (Top-Right) */}
          <div className="absolute -top-2 -right-2 sm:top-3 sm:-right-3 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c1220]/95 backdrop-blur-xl border border-cyan-500/30 text-cyan-300 shadow-2xl shadow-black/90 pointer-events-none transition-transform group-hover:scale-105">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span className="text-[11px] font-mono font-semibold tracking-wider uppercase">Full-Stack & Cloud</span>
          </div>
        </div>

        {/* Right Column: Name, Subtitle, Tech Chips and Social Buttons */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-xl">
          {/* Greeting & Headline - Clean without bracket tags */}
          <div className="space-y-1.5">
            <span
              style={{ color: themeConfig.primaryHex }}
              className="text-xs font-mono uppercase tracking-widest block transition-colors font-semibold"
            >
              👋 WELCOME TO MY PORTFOLIO
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-sans font-black text-white tracking-tight leading-[1.1]">
              Hi, I’m{' '}
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${themeConfig.gradientText} transition-all duration-700`}>
                Aditya Kumar
              </span>
            </h1>
          </div>

          {/* Subtitle Statement */}
          <p className="text-base sm:text-lg md:text-xl text-slate-300 font-normal">
            {customConfig?.title || 'Software Engineer | Full Stack Developer'}
          </p>

          {/* Interactive Tech Chips */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
            {techChips.map((tech) => (
              <span
                key={tech}
                onMouseEnter={() => soundManager.playClick()}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition-all cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Social Buttons & Direct Contact CTA */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3.5 pt-2">
            {/* GitHub Button */}
            <a
              href={PERSONAL_INFO.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="w-11 h-11 rounded-full bg-[#161f30] hover:bg-[#223048] border border-white/15 flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="w-5 h-5 fill-current text-white" />
            </a>

            {/* LinkedIn Button */}
            <a
              href={PERSONAL_INFO.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundManager.playClick()}
              className="w-11 h-11 rounded-full bg-[#0a66c2] hover:bg-[#004182] flex items-center justify-center text-white transition-all transform hover:scale-110 shadow-lg hover:shadow-blue-500/25 cursor-pointer"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="w-5 h-5 fill-current text-white" />
            </a>

            {/* Explore Work CTA Button */}
            <a
              href="#work"
              onClick={() => soundManager.playClick()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-mono font-semibold text-white tracking-wider transition-all hover:scale-105 shadow-md cursor-pointer"
            >
              <span>EXPLORE WORK</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            </a>

            {/* Let's Connect CTA Button */}
            <a
              href="#contact"
              onClick={() => soundManager.playClick()}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r ${themeConfig.navActiveGradient} hover:opacity-90 text-xs font-mono font-semibold text-white tracking-wider transition-all hover:scale-105 shadow-lg shadow-cyan-500/20 cursor-pointer`}
            >
              <span>GET IN TOUCH</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
