import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { SignatureCanvas } from '../three/SignatureCanvas';
import { useTheme } from '../context/ThemeContext';

export const FooterSignature: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { themeConfig } = useTheme();

  return (
    <footer
      style={{ backgroundColor: themeConfig.bgHex }}
      className="relative py-10 px-4 sm:px-6 border-t border-white/10 overflow-hidden text-center select-none text-white transition-colors duration-700"
    >
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-widest uppercase">
            {PERSONAL_INFO.name}
          </h2>
          <p className="text-xs md:text-sm font-mono tracking-[0.25em] text-emerald-400 font-semibold uppercase">
            {PERSONAL_INFO.title}
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <SignatureCanvas isLight={false} onCollapsed={() => setIsCollapsed(true)} />
        </div>

        <div
          className={`pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-500 gap-3 transition-opacity duration-1000 ${
            isCollapsed ? 'opacity-100' : 'opacity-80'
          }`}
        >
          <span>DESIGNED & ENGINEERED BY ADITYA KUMAR</span>
          <span>© 2026 Aditya Kumar. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};
