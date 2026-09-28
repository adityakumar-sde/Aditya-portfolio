import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { CustomCursor } from './components/CustomCursor';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AdminModal } from './components/AdminModal';
import { ResumeModal } from './components/ResumeModal';
import { PersonalMusicPlayer } from './components/PersonalMusicPlayer';
import { MusicProvider } from './context/MusicContext';
import { FrontPageCover } from './sections/FrontPageCover';
import { HeroSection } from './sections/HeroSection';
import { EngineeringSystemsSection } from './sections/EngineeringSystemsSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { EngineeringStackSection } from './sections/EngineeringStackSection';
import { EngineeringNowSection } from './sections/EngineeringNowSection';
import { AiLabSection } from './sections/AiLabSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { EducationSection } from './sections/EducationSection';
import { AboutSection } from './sections/AboutSection';
import { EngineeringPhilosophySection } from './sections/EngineeringPhilosophySection';
import { ContactSection } from './sections/ContactSection';
import { FooterSignature } from './sections/FooterSignature';

export const App: React.FC = () => {
  // viewMode controls whether user is on the Editorial Front Page or the 3D Engineering Space
  const [viewMode, setViewMode] = useState<'cover' | '3d'>('cover');
  const [selectedSystemId, setSelectedSystemId] = useState<string | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isResumeOpen, setIsResumeOpen] = useState<boolean>(false);

  const rootClasses =
    viewMode === 'cover'
      ? 'relative w-full h-screen overflow-hidden bg-[#060709] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 font-body'
      : 'relative min-h-screen bg-[#060709] text-slate-100 selection:bg-cyan-500/20 selection:text-cyan-300 font-body';

  return (
    <MusicProvider>
      <div className={rootClasses}>
        <CustomCursor />

        {/* Global Personal Music Player (Positioned in first page bottom-left corner) */}
        <PersonalMusicPlayer />

        <AnimatePresence mode="wait">
          {viewMode === 'cover' ? (
            /* ========================================================= */
            /* 1. EDITORIAL FRONT PAGE COVER (Locked until user unlocks) */
            /* ========================================================= */
            <motion.div
              key="front-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-screen overflow-hidden"
            >
              <FrontPageCover
                onUnlock3D={() => setViewMode('3d')}
                onOpenResume={() => setIsResumeOpen(true)}
                onOpenAdmin={() => setIsAdminOpen(true)}
              />
            </motion.div>
          ) : (
            /* ========================================================= */
            /* 2. 3D ENGINEERING ECOSYSTEM & PORTFOLIO                  */
            /* ========================================================= */
            <motion.div
              key="3d-portfolio"
              initial={{ opacity: 0, y: 50, scale: 1.02 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              {/* Top Navbar with 'COVER' return toggle */}
              <Navbar
                onOpenAdmin={() => setIsAdminOpen(true)}
                onOpenResume={() => setIsResumeOpen(true)}
                onBackToCover={() => setViewMode('cover')}
              />

              {/* Core Architectural Sections */}
              <main className="relative z-10 flex flex-col">
                <HeroSection
                  onOpenResume={() => setIsResumeOpen(true)}
                  onSelectSystem={(sysId) => setSelectedSystemId(sysId)}
                />

                <EngineeringSystemsSection selectedSystemId={selectedSystemId} />

                <ProjectsSection />

                <EngineeringStackSection />

                <EngineeringNowSection />

                <AiLabSection />

                <ExperienceSection />

                <EducationSection />

                <AboutSection />

                <EngineeringPhilosophySection />

                <ContactSection />
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
      </div>
    </MusicProvider>
  );
};

export default App;