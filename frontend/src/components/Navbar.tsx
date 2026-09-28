import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, FileDown, ShieldCheck, ArrowLeft } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SoundToggle } from './SoundToggle';
import { soundManager } from '../services/audio';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenResume: () => void;
  onBackToCover?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin, onOpenResume, onBackToCover }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'WORK', href: '#work' },
    { name: 'ENGINEERING', href: '#engineering' },
    { name: 'EXPERIENCE', href: '#experience' },
    { name: 'ABOUT', href: '#about' },
    { name: 'CONTACT', href: '#contact' },
  ];

  const handleLinkClick = () => {
    soundManager.playClick();
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-nav py-3.5 shadow-2xl shadow-black/40' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="#"
          onClick={() => soundManager.playClick()}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#090b10] rounded-[7px] flex items-center justify-center font-display font-bold text-xs tracking-wider text-white">
              AK
            </div>
          </div>
          <span className="font-display font-extrabold text-base tracking-widest text-white group-hover:text-cyan-400 transition-colors">
            {PERSONAL_INFO.shortName}
          </span>
        </a>

        {/* Desktop Center Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => soundManager.playClick()}
              className="text-xs font-mono tracking-widest text-slate-400 hover:text-cyan-400 transition-colors py-1 relative group"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-200 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {onBackToCover && (<button onClick={() => { soundManager.playClick(); onBackToCover(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-xs font-mono text-cyan-300 transition-all cursor-pointer" title="Return to Editorial Cover"><ArrowLeft className="w-3.5 h-3.5" /><span>COVER</span></button>)}<SoundToggle />

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenResume();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-slate-200 hover:text-white transition-all cursor-pointer"
            title="Download or Preview Resume"
          >
            <FileDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>RESUME</span>
          </button>

          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            title="GitHub (Placeholder until verified URL supplied)"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GITHUB</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500" />
          </a>

          <a
            href={PERSONAL_INFO.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            title="LinkedIn (Placeholder until verified URL supplied)"
          >
            <LinkedinIcon className="w-3.5 h-3.5" />
            <span>LINKEDIN</span>
            <ArrowUpRight className="w-3 h-3 text-slate-500" />
          </a>

          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAdmin();
            }}
            className="p-1.5 rounded-md text-slate-500 hover:text-cyan-400 hover:bg-white/5 transition-colors cursor-pointer"
            title="Admin Console (/admin)"
            aria-label="Open Admin Console"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 lg:hidden">
          {onBackToCover && (<button onClick={() => { soundManager.playClick(); onBackToCover(); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-xs font-mono text-cyan-300 transition-all cursor-pointer" title="Return to Editorial Cover"><ArrowLeft className="w-3.5 h-3.5" /><span>COVER</span></button>)}<SoundToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#090b10]/95 backdrop-blur-2xl border-b border-white/10 p-6 flex flex-col gap-5 z-50">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="text-sm font-mono tracking-widest text-slate-300 hover:text-cyan-400 py-2 border-b border-white/5"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => {
                handleLinkClick();
                onOpenResume();
              }}
              className="btn-primary w-full py-2.5 text-xs font-mono justify-center"
            >
              <FileDown className="w-4 h-4 mr-1.5" />
              DOWNLOAD RESUME
            </button>

            <div className="flex items-center justify-between w-full pt-2">
              <a
                href={PERSONAL_INFO.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GITHUB</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <a
                href={PERSONAL_INFO.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1.5"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LINKEDIN</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>

              <button
                onClick={() => {
                  handleLinkClick();
                  onOpenAdmin();
                }}
                className="text-xs font-mono text-cyan-400 flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ADMIN</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
