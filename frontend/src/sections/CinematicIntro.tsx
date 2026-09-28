import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IntroCanvas } from '../three/IntroCanvas';
import { soundManager } from '../services/audio';

interface CinematicIntroProps {
  onComplete: () => void;
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [isSkipped, setIsSkipped] = useState<boolean>(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      soundManager.playWebShot();
    }, 800);

    const t2 = setTimeout(() => {
      soundManager.playWebImpact();
      setStep(1);
    }, 3200);

    const t3 = setTimeout(() => {
      setStep(2);
    }, 4200);

    const t4 = setTimeout(() => {
      setStep(3);
    }, 5100);

    const t5 = setTimeout(() => {
      handleFinish();
    }, 6400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleFinish = () => {
    setIsSkipped(true);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060709] overflow-hidden select-none">
      <IntroCanvas onIntroComplete={handleFinish} isSkipped={isSkipped} />

      <button
        onClick={handleFinish}
        className="absolute top-8 right-8 z-50 text-[11px] font-mono tracking-[0.2em] text-slate-400 hover:text-cyan-400 transition-colors uppercase flex items-center gap-2 group cursor-pointer bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 hover:border-cyan-500/30"
        aria-label="Skip Introduction"
      >
        <span>SKIP INTRO</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>

      <div className="relative z-30 flex flex-col items-center justify-center text-center px-6 max-w-4xl pointer-events-none">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 15, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.2em' }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs md:text-sm font-mono uppercase text-cyan-400 tracking-[0.25em]"
            >
              HI. WELCOME TO ADITYA'S PORTFOLIO.
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, scale: 0.95, letterSpacing: '-0.02em' }}
              animate={{ opacity: 1, scale: 1, letterSpacing: '0.04em' }}
              exit={{ opacity: 0, y: -15, transition: { duration: 0.4 } }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-wider"
            >
              I'M ADITYA KUMAR.
            </motion.div>
          )}

          {step >= 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-4xl md:text-6xl lg:text-7xl font-display font-black tracking-tight text-white">
                ADITYA KUMAR
              </span>
              <span className="text-xs md:text-base font-mono tracking-[0.35em] text-cyan-400 uppercase">
                SOFTWARE ENGINEER
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-[#060709]/40 to-[#060709]" />
    </div>
  );
};
