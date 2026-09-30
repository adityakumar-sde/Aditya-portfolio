import React, { createContext, useContext, useState } from 'react';

export type ThemeMode = 'stars' | 'matrix' | 'zen' | 'aurora' | 'network';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  icon: string;
  bgHex: string;
  primaryHex: string;
  accentHex: string;
  gradientText: string;
  navActiveGradient: string;
  auraGradient: string;
  particleColor: number;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  stars: {
    id: 'stars',
    name: 'Cosmic Starfield',
    icon: '✨',
    bgHex: '#07090e',
    primaryHex: '#38bdf8',
    accentHex: '#818cf8',
    gradientText: 'from-white via-slate-100 to-cyan-300',
    navActiveGradient: 'from-blue-600 via-indigo-600 to-cyan-500',
    auraGradient: 'from-cyan-500/25 via-blue-500/20 to-indigo-500/20',
    particleColor: 0x38bdf8,
  },
  matrix: {
    id: 'matrix',
    name: 'Cyber Matrix',
    icon: '⚡',
    bgHex: '#060710',
    primaryHex: '#a855f7',
    accentHex: '#00f0ff',
    gradientText: 'from-white via-fuchsia-100 to-purple-300',
    navActiveGradient: 'from-purple-600 via-fuchsia-600 to-cyan-500',
    auraGradient: 'from-purple-500/30 via-fuchsia-500/20 to-cyan-500/20',
    particleColor: 0xa855f7,
  },
  zen: {
    id: 'zen',
    name: 'Zen Fireflies',
    icon: '🍵',
    bgHex: '#060907',
    primaryHex: '#10b981',
    accentHex: '#34d399',
    gradientText: 'from-white via-emerald-100 to-teal-300',
    navActiveGradient: 'from-emerald-600 via-teal-600 to-cyan-500',
    auraGradient: 'from-emerald-500/30 via-teal-500/20 to-lime-500/20',
    particleColor: 0x10b981,
  },
  aurora: {
    id: 'aurora',
    name: 'Borealis Aurora',
    icon: '🌌',
    bgHex: '#070a12',
    primaryHex: '#06b6d4',
    accentHex: '#ec4899',
    gradientText: 'from-white via-teal-100 to-pink-300',
    navActiveGradient: 'from-cyan-500 via-teal-500 to-pink-500',
    auraGradient: 'from-cyan-500/25 via-teal-500/20 to-pink-500/20',
    particleColor: 0x06b6d4,
  },
  network: {
    id: 'network',
    name: 'Neural Network',
    icon: '🌐',
    bgHex: '#06080e',
    primaryHex: '#60a5fa',
    accentHex: '#38bdf8',
    gradientText: 'from-white via-sky-100 to-blue-400',
    navActiveGradient: 'from-blue-600 via-sky-600 to-indigo-500',
    auraGradient: 'from-blue-500/25 via-sky-500/20 to-indigo-500/20',
    particleColor: 0x60a5fa,
  },
};

const normalizeTheme = (saved: string | null): ThemeMode => {
  if (saved === 'midnight' || saved === 'stars') return 'zen';
  if (saved === 'cyber') return 'matrix';
  if (saved === 'emerald') return 'zen';
  if (saved && THEMES[saved as ThemeMode]) {
    return saved as ThemeMode;
  }
  return 'zen';
};

interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeMode) => void;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('aditya_portfolio_theme_mode');
      return normalizeTheme(saved);
    } catch (e) {
      console.warn('Failed to load theme mode', e);
    }
    return 'zen';
  });

  const setTheme = (nextTheme: ThemeMode) => {
    setThemeState(nextTheme);
    try {
      localStorage.setItem('aditya_portfolio_theme_mode', nextTheme);
    } catch (e) {
      console.warn('Failed to save theme mode', e);
    }
  };

  const cycleTheme = () => {
    const themeKeys: ThemeMode[] = ['stars', 'matrix', 'zen', 'aurora', 'network'];
    const nextIdx = (themeKeys.indexOf(theme) + 1) % themeKeys.length;
    setTheme(themeKeys[nextIdx]);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig: THEMES[theme] || THEMES.stars,
        setTheme,
        cycleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
