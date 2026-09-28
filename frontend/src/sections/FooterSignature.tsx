import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SignatureCanvas } from '../three/SignatureCanvas';

export const FooterSignature: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <footer className="relative py-24 px-6 bg-[#040507] border-t border-white/5 overflow-hidden text-center select-none">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black text-white tracking-widest uppercase">
            {PERSONAL_INFO.name}
          </h2>
          <p className="text-xs md:text-sm font-mono tracking-[0.3em] text-cyan-400 uppercase">
            {PERSONAL_INFO.title}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <SignatureCanvas onCollapsed={() => setIsCollapsed(true)} />
        </div>

        <div
          className={`pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4 transition-opacity duration-1000 ${
            isCollapsed ? 'opacity-100' : 'opacity-70'
          }`}
        >
          <span>DESIGNED & ENGINEERED BY ADITYA KUMAR</span>
          <span>© 2026 Aditya Kumar. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
