import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, ArrowDownToLine, ShieldCheck } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../services/audio';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenResume: () => void;
  onBackToCover?: () => void;
  onOpenTerminal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenResume,
  onBackToCover,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const { theme, themeConfig, cycleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);

      // Scrollspy: detect active section
      const sections = [
        { id: 'home', el: document.getElementById('hero') },
        { id: 'about', el: document.getElementById('about') },
        { id: 'projects', el: document.getElementById('work') },
        { id: 'contacts', el: document.getElementById('contact') },
      ];

      const scrollPos = window.scrollY + 200;
      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.el && s.el.offsetTop <= scrollPos) {
          setActiveTab(s.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', name: 'Home', href: '#hero' },
    { id: 'about', name: 'About', href: '#about' },
    { id: 'projects', name: 'Projects', href: '#work' },
    { id: 'contacts', name: 'Contacts', href: '#contact' },
  ];

  const handleLinkClick = (id: string, href: string) => {
    soundManager.playClick();
    setActiveTab(id);
    setMobileMenuOpen(false);

    const targetEl = document.querySelector(href);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0a0d14]/90 backdrop-blur-2xl py-3 border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between">
        {/* Left Side: Brand Logo & Click-to-Cycle Atmosphere Button (No dropdown) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundManager.playClick();
              if (onBackToCover) onBackToCover();
            }}
            className="flex items-center gap-1.5 group cursor-pointer bg-transparent border-none p-0"
            title="Return to Front Page Cover"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0a0d14] rounded-[11px] flex items-center justify-center font-sans font-bold text-xs tracking-wider text-white">
                AK
              </div>
            </div>
            <span className="font-sans font-bold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors hidden sm:inline">
              Aditya
            </span>
          </button>

          {/* Click-Only Atmosphere Switcher Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              cycleTheme();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131926]/90 border border-white/15 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95 group"
            title={`Current: ${themeConfig.name} · Click to cycle atmospheres`}
            aria-label="Switch Background Atmosphere"
          >
            <span className="text-xs transition-transform group-hover:rotate-12">{themeConfig.icon}</span>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase hidden sm:inline text-slate-300 group-hover:text-white">
              {theme}
            </span>
          </button>
        </div>

        {/* Center: Dribbble Style Floating Capsule Nav with Animated Sliding Pill */}
        <nav className="hidden md:flex items-center bg-[#111624]/90 backdrop-blur-2xl border border-white/15 rounded-full p-1 shadow-[0_10px_35px_rgba(0,0,0,0.7)] relative">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id, link.href);
                }}
                className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors z-10 cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`absolute inset-0 rounded-full bg-gradient-to-r ${themeConfig.navActiveGradient} shadow-[0_0_16px_rgba(56,189,248,0.4)] -z-10`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>{link.name}</span>
              </a>
            );
          })}
        </nav>

        {/* Right Side: Download CV & Admin Console */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenResume();
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#161e2e]/90 hover:bg-[#1f2a3f] border border-white/15 text-xs font-medium text-slate-200 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.03] cursor-pointer"
            title="Download CV"
          >
            <span>Download CV</span>
            <ArrowDownToLine className="w-3.5 h-3.5 text-cyan-400" />
          </button>

          {/* Admin console button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAdmin();
            }}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer hover:scale-105"
            title="Admin Console"
            aria-label="Admin Console"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-[#131926] border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[56px] bg-[#0a0d14]/98 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-4 z-50 shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.id, link.href);
                }}
                className={`text-sm font-medium py-2.5 border-b border-white/5 flex items-center justify-between ${
                  activeTab === link.id ? 'text-cyan-400 font-semibold' : 'text-slate-300'
                }`}
              >
                <span>{link.name}</span>
                <span className="text-xs text-slate-500">→</span>
              </a>
            ))}
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/10">
            <span className="text-xs font-mono text-slate-400">ATMOSPHERE:</span>
            <button
              onClick={() => {
                soundManager.playClick();
                cycleTheme();
              }}
              className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-mono text-white flex items-center gap-1.5"
            >
              <span>{themeConfig.icon}</span>
              <span className="capitalize">{theme}</span>
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => {
                soundManager.playClick();
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-xs font-semibold text-white shadow-lg"
            >
              <span>Download CV</span>
              <ArrowDownToLine className="w-3.5 h-3.5 text-white" />
            </button>

            <div className="flex items-center justify-between pt-2">
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <button
                onClick={() => {
                  soundManager.playClick();
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="text-xs text-cyan-400 flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
