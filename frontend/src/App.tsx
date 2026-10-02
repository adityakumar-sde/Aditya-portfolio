import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AdminModal } from './components/AdminModal';
import { ResumeModal } from './components/ResumeModal';
import { DeveloperTerminalModal, type PortfolioCustomConfig } from './components/DeveloperTerminalModal';
import { PersonalMusicPlayer } from './components/PersonalMusicPlayer';
import { MusicProvider } from './context/MusicContext';
import { ThemeProvider } from './context/ThemeContext';
import { FrontPageCover } from './sections/FrontPageCover';
import { HeroSection } from './sections/HeroSection';
import { SpatialEngineeringHub } from './sections/SpatialEngineeringHub';
import { ContactSection } from './sections/ContactSection';
import { FooterSignature } from './sections/FooterSignature';
import { PERSONAL_INFO } from './data/portfolioData';
import { soundManager } from './services/audio';

const DEFAULT_CONFIG: PortfolioCustomConfig = {
  title: PERSONAL_INFO.title,
  tagline: PERSONAL_INFO.tagline,
  statusText: `${PERSONAL_INFO.location} · AVAILABLE FOR IMPACT`,
};

export const App: React.FC = () => {
  // viewMode controls whether user is on the Editorial Front Page or the 3D Engineering Space
  const [viewMode, setViewMode] = useState<'cover' | '3d'>('cover');
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [hasUnlockedOnce, setHasUnlockedOnce] = useState<boolean>(false);

  // Live modifiable config state from Developer Terminal (persisted in localStorage)
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioCustomConfig>(() => {
    try {
      const saved = localStorage.getItem('aditya_portfolio_custom_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load portfolio custom config', e);
    }
    return DEFAULT_CONFIG;
  });

  const handleUpdateConfig = (key: keyof PortfolioCustomConfig, value: string) => {
    setPortfolioConfig((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem('aditya_portfolio_custom_config', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to persist custom config', e);
      }
      return next;
    });
  };

  const handleResetConfig = () => {
    setPortfolioConfig(DEFAULT_CONFIG);
    try {
      localStorage.removeItem('aditya_portfolio_custom_config');
    } catch (e) {
      console.warn('Failed to clear custom config', e);
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const cleanId = sectionId.replace('#', '').toLowerCase();
    if (cleanId === 'cover' || cleanId === 'home') {
      setViewMode('cover');
      return;
    }
    setViewMode('3d');
    setTimeout(() => {
      const el = document.getElementById(cleanId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  // Global Keyboard Shortcut: Press ` (tilde) or Ctrl+Shift+T to open Terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '`' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't')
      ) {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Two-Finger Trackpad / Wheel listener & Touch gesture to return to Front Page Cover
  useEffect(() => {
    if (viewMode !== '3d') return;

    let touchStartY = 0;
    let touchFingers = 0;

    // Trackpad / Mouse Wheel: When user is at the top of the 3D page (scrollY <= 10)
    // and scrolls up with two fingers (negative deltaY)
    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY <= 15 && e.deltaY < -18) {
        soundManager.playClick();
        setViewMode('cover');
      }
    };

    // Touch devices: Two-finger swipe down anywhere near top, or downward pull at scrollY === 0
    const handleTouchStart = (e: TouchEvent) => {
      touchFingers = e.touches.length;
      if (e.touches.length >= 1 && window.scrollY <= 10) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY <= 10 && touchStartY > 0) {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;
        // Two fingers swipe down (> 25px) OR pull down at top (> 60px)
        if ((touchFingers >= 2 && deltaY > 20) || deltaY > 45) {
          soundManager.playClick();
          setViewMode('cover');
        }
      }
      touchStartY = 0;
      touchFingers = 0;
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [viewMode]);

  // Global Zoom Lock: Prevent browser zooming via Ctrl+wheel, touch pinch, and keyboard zoom shortcuts
  useEffect(() => {
    const handleWheelZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    const handleKeyZoom = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        ['+', '-', '=', '_', '0', 'NumpadAdd', 'NumpadSubtract'].includes(e.key || e.code)
      ) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    const preventGesture = (e: Event) => e.preventDefault();

    window.addEventListener('wheel', handleWheelZoom, { passive: false });
    window.addEventListener('keydown', handleKeyZoom, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('gesturestart', preventGesture);
    document.addEventListener('gesturechange', preventGesture);
    document.addEventListener('gestureend', preventGesture);

    return () => {
      window.removeEventListener('wheel', handleWheelZoom);
      window.removeEventListener('keydown', handleKeyZoom);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('gesturestart', preventGesture);
      document.removeEventListener('gesturechange', preventGesture);
      document.removeEventListener('gestureend', preventGesture);
    };
  }, []);

  const rootClasses =
    viewMode === 'cover'
      ? 'relative w-full h-screen overflow-hidden bg-[#070b14] text-slate-100 selection:bg-cyan-400/20 selection:text-cyan-200 font-body transition-colors duration-500 ease-out'
      : 'relative min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-400/20 selection:text-cyan-200 font-body transition-colors duration-500 ease-out';

  return (
    <ThemeProvider>
      <MusicProvider>
      <div className={`${rootClasses} page-shell`}>
        {/* Personal Music Player scoped strictly to Editorial Front Page Cover */}
        {viewMode === 'cover' && <PersonalMusicPlayer />}

        <div className="absolute inset-0 bg-[#070b14]" aria-hidden="true" />
        <AnimatePresence mode="sync">
          {viewMode === 'cover' ? (
            /* ========================================================= */
            /* 1. EDITORIAL FRONT PAGE COVER (Locked until user unlocks) */
            /* ========================================================= */
            <motion.div
              key="front-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative z-10 w-full h-screen overflow-hidden will-change-transform bg-[#070b14]"
            >
              <FrontPageCover
                hasUnlockedOnce={hasUnlockedOnce}
                onUnlock3D={(targetSection) => {
                  setHasUnlockedOnce(true);
                  setViewMode('3d');
                  if (targetSection) {
                    setTimeout(() => {
                      const el = document.getElementById(targetSection);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 200);
                  }
                }}
                onOpenResume={() => setIsResumeOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenTerminal={() => setIsTerminalOpen(true)}
              />
            </motion.div>
          ) : (
            /* ========================================================= */
            /* 2. 3D ENGINEERING ECOSYSTEM & PORTFOLIO                  */
            /* ========================================================= */
            <motion.div
              key="3d-portfolio"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="relative z-10 w-full min-h-screen will-change-transform bg-[#070b14]"
            >
              {/* Top Navbar with 'COVER' return toggle & Terminal button */}
              <Navbar
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenResume={() => setIsResumeOpen(true)}
                onBackToCover={() => setViewMode('cover')}
                onOpenTerminal={() => setIsTerminalOpen(true)}
              />

              {/* Core Architectural Sections */}
              <main className="relative z-10 flex flex-col">
                <HeroSection
                  onOpenResume={() => setIsResumeOpen(true)}
                  onSelectSystem={(sysId) => setSelectedSystemId(sysId)}
                  customConfig={portfolioConfig}
                />

                <SpatialEngineeringHub selectedSystemId={selectedSystemId} />

                <ContactSection onOpenResume={() => setIsResumeOpen(true)} />
              </main>

              {/* 3D Interactive Footer Signature */}
              <FooterSignature />

              {/* Floating AI Assistant Chatbot */}
              <AiAssistantModal />

              
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Modals (Accessible from both Cover and 3D mode) */}
        <AdminModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />

        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />

        <DeveloperTerminalModal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
          config={portfolioConfig}
          onUpdateConfig={handleUpdateConfig}
          onResetConfig={handleResetConfig}
          onNavigateSection={handleNavigateSection}
          onOpenAdmin={() => setIsAdminOpen(true)}
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </div>
    </MusicProvider>
    </ThemeProvider>
  );
};

export default App;
