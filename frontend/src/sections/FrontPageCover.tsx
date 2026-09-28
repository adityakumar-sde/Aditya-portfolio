import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Terminal,
  Box,
  FileText,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronUp,
  RotateCw,
  Sparkles,
  Mail,
  ShieldCheck,
  Sliders,
  Globe,
  Palette,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { GithubIcon } from '../components/SocialIcons';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundManager } from '../services/audio';

interface FrontPageCoverProps {
  onUnlock3D: (targetSection?: string) => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
  onOpenTerminal: () => void;
  hasUnlockedOnce?: boolean;
}

interface MultilingualTitle {
  code: string;
  lang: string;
  label: string;
  text: string;
  fontFamily: string;
  duration: number;
  dir?: 'ltr' | 'rtl';
}

export interface ShayariItem {
  id: number;
  category: 'breakup' | 'love' | 'sad' | 'emotional' | 'normal' | 'motivation';
  line1: string;
  line2: string;
}

// Complete Hindi Shayari Collection - Sad, Love, Emotional, Breakup, Normal & Motivational
export const SHAYARI_LIBRARY: ShayariItem[] = [
  // 1. Breakup & Heartbreak (Featured Original)
  {
    id: 1,
    category: 'breakup',
    line1: 'खाली पड़े मेरे हाथ देख लो, कोई नहीं मेरे साथ देख लो,',
    line2: 'जिसे चाहा सारी उम्र बड़ी शिद्दत से, वो जाते-जाते कह गए अपनी औकात देख लो।'
  },
  // 2. Love & Romantic (इश्क और मोहब्बत)
  {
    id: 2,
    category: 'love',
    line1: 'तेरी मुस्कुराहट में वो जादू है जो हर दर्द भुला दे,',
    line2: 'खुदा करे ये जिंदगी तेरी बाहों और पनाहों में ही गुजर जाए।'
  },
  // 3. Sad & Loneliness (उदासी और तन्हाई)
  {
    id: 3,
    category: 'sad',
    line1: 'कभी-कभी खामोशी ही सबसे गहरा दर्द बयां कर देती है,',
    line2: 'जो जान से प्यारे थे, वही आज अजनबियों की तरह गुजर गए।'
  },
  // 4. Emotional & Life Truth (जिंदगी की सच्चाई)
  {
    id: 4,
    category: 'emotional',
    line1: 'जिंदगी के सफर में बहुत से चेहरे करीब आकर बिछड़ गए,',
    line2: 'कुछ ने मुस्कुराना सिखाया, तो कुछ ने दुनिया का सच दिखा दिया।'
  },
  // 5. Normal & Philosophy / Peace (सादगी और सुकून)
  {
    id: 5,
    category: 'normal',
    line1: 'सादगी में जो सुकून है वो दुनिया के किसी दिखावे में नहीं,',
    line2: 'चंद पलों की जिंदगी है, हर लम्हे को मुस्कुराकर जीना सीख लो।'
  },
  // 6. Ambition & Revenge Hustle (संकल्प और मुकाम)
  {
    id: 6,
    category: 'motivation',
    line1: 'ठुकरा दिया जिन्होंने हमें हमारा वक्त देखकर,',
    line2: 'कसम खाते हैं, ऐसा वक्त लाएंगे कि मिलना पड़ेगा हमसे वक्त लेकर।'
  },
  // 7. Love & Soul Connection
  {
    id: 7,
    category: 'love',
    line1: 'इश्क वो नहीं जो चेहरे से शुरू होकर जिस्म पर खत्म हो,',
    line2: 'इश्क वो है जो रूह से जुड़कर ताउम्र दुआओं में शामिल रहे।'
  },
  // 8. Engineer Code Metaphor
  {
    id: 8,
    category: 'motivation',
    line1: 'टूटे हुए दिल से जब कोई इंजीनियर कोड लिखता है,',
    line2: 'तो बग नहीं, पूरी दुनिया हिलाने वाला सिस्टम खड़ा होता है।'
  },
  // 9. Emotional Heartache
  {
    id: 9,
    category: 'emotional',
    line1: 'हम वो नहीं जो हर महफिल में अपने आंसुओं का तमाशा बनाएं,',
    line2: 'हम तन्हाइयों में बिखरकर भी खुद को समेटना बखूबी जानते हैं।'
  },
  // 10. Bihari Engineer Grit
  {
    id: 10,
    category: 'motivation',
    line1: 'मोहब्बत में हारे जरूर हैं मगर हौसला अभी जिंदा है,',
    line2: 'हम वो बिहारी इंजीनियर हैं जो राख से भी अंगार बना दें।'
  },
  // 11. Normal / Memory & Time
  {
    id: 11,
    category: 'normal',
    line1: 'वक्त के साथ सब कुछ बदल जाता है मगर यादें हमेशा जिंदा रहती हैं,',
    line2: 'दिल के पन्नों पर जो नाम छप जाए वो कभी धुंधला नहीं होता।'
  },
  // 12. Sad & Regret
  {
    id: 12,
    category: 'sad',
    line1: 'उन्हें लगता है कि हम उनके बिना अब खुश नहीं रहते,',
    line2: 'उन्हें क्या पता कि हमने अपने दर्द को ही अपनी मुस्कान बना लिया।'
  },
  // 13. Deep Love
  {
    id: 13,
    category: 'love',
    line1: 'तुम लाख छुपाओ मगर तुम्हारी आंखों में हमारा ही अक्स है,',
    line2: 'मोहब्बत वो नहीं जो अल्फाजों में हो, ये तो खामोशी का एहसास है।'
  },
  // 14. Silent Grind
  {
    id: 14,
    category: 'motivation',
    line1: 'जिसने रुलाया था हमें कभी हमारी सादगी और मुफलिसी पर,',
    line2: 'एक दिन वो भी तरसेंगे हमारा नाम गूगल पर सर्च करने को।'
  },
  // 15. Midnight Hustle
  {
    id: 15,
    category: 'motivation',
    line1: 'दिल टूटा तो नींद उड़ी, नींद उड़ी तो रातें जागीं,',
    line2: 'और उन्हीं जागी रातों ने आज इंजीनियर का वजूद तराश दिया।'
  },
  // 16. Normal & Wisdom
  {
    id: 16,
    category: 'normal',
    line1: 'ना किसी से उम्मीद रखो और ना किसी से कोई गिला करो,',
    line2: 'जिंदगी अपनी शर्तों पर जियो और अपने काम से दुनिया को हैरान करो।'
  }
];

const MULTILINGUAL_TITLES: MultilingualTitle[] = [
  {
    code: 'EN',
    lang: 'English',
    label: 'English',
    text: 'Bihari Engineer',
    fontFamily: "'Cinzel', 'Syne', sans-serif",
    duration: 5000,
    dir: 'ltr'
  },
  {
    code: 'HI',
    lang: 'Hindi',
    label: 'हिन्दी',
    text: 'बिहारी इंजीनियर',
    fontFamily: "'Noto Sans Devanagari', 'Syne', sans-serif",
    duration: 3500,
    dir: 'ltr'
  },
  {
    code: 'FR',
    lang: 'French',
    label: 'Français',
    text: 'Ingénieur Bihari',
    fontFamily: "'Cinzel', 'Syne', sans-serif",
    duration: 3500,
    dir: 'ltr'
  },
  {
    code: 'ES',
    lang: 'Spanish',
    label: 'Español',
    text: 'Ingeniero Bihari',
    fontFamily: "'Cinzel', 'Syne', sans-serif",
    duration: 3500,
    dir: 'ltr'
  },
  {
    code: 'JA',
    lang: 'Japanese',
    label: '日本語',
    text: 'ビハールエンジニア',
    fontFamily: "'Noto Sans JP', 'Syne', sans-serif",
    duration: 3500,
    dir: 'ltr'
  },
  {
    code: 'DE',
    lang: 'German',
    label: 'Deutsch',
    text: 'Bihari-Ingenieur',
    fontFamily: "'Cinzel', 'Syne', sans-serif",
    duration: 3500,
    dir: 'ltr'
  },
  {
    code: 'RU',
    lang: 'Russian',
    label: 'Русский',
    text: 'Бихарский Инженер',
    fontFamily: "'Cinzel', 'Syne', sans-serif",
    duration: 3500,
    dir: 'ltr'
  }
];

export interface WallpaperTheme {
  id: string;
  name: string;
  type: 'gradient' | 'image';
  src?: string;
  gradient?: string;
  accentColor: string;
  photoBorderColor: string;
  photoGlow: string;
  textColor: string;
  description: string;
}

// 5 High-Resolution True 4K Wallpapers (3840px Enhanced) + Fallback Gradient
export const WALLPAPER_THEMES: WallpaperTheme[] = [
  {
    id: 'butterfly',
    name: 'Teal Butterfly 4K',
    type: 'image',
    src: '/wallpapers/wallpaper-butterfly.jpg',
    accentColor: '#22d3ee',
    photoBorderColor: 'rgba(34, 211, 238, 0.55)',
    photoGlow: '0 30px 80px -10px rgba(6, 182, 212, 0.45)',
    textColor: '#ffffff',
    description: 'Neon teal butterfly in 4K ultra clarity'
  },
  {
    id: 'spiderman-hang',
    name: 'Spider-Man Dusk 4K',
    type: 'image',
    src: '/wallpapers/wallpaper-spiderman-hang.jpg',
    accentColor: '#ef4444',
    photoBorderColor: 'rgba(239, 68, 68, 0.55)',
    photoGlow: '0 30px 80px -10px rgba(239, 68, 68, 0.45)',
    textColor: '#ffffff',
    description: 'Spider-Man inverted silhouette in 4K resolution'
  },
  {
    id: 'cyber-keyboard',
    name: 'Cyber Keyboard 4K',
    type: 'image',
    src: '/wallpapers/wallpaper-keyboard.jpg',
    accentColor: '#a855f7',
    photoBorderColor: 'rgba(168, 85, 247, 0.55)',
    photoGlow: '0 30px 80px -10px rgba(168, 85, 247, 0.45)',
    textColor: '#ffffff',
    description: 'RGB mechanical key switches in 4K ultra detail'
  },
  {
    id: 'golden-bridge',
    name: 'Golden Bridge 4K',
    type: 'image',
    src: '/wallpapers/wallpaper-bridge.jpg',
    accentColor: '#f97316',
    photoBorderColor: 'rgba(249, 115, 22, 0.55)',
    photoGlow: '0 30px 80px -10px rgba(249, 115, 22, 0.45)',
    textColor: '#ffffff',
    description: 'Crimson suspension bridge in 4K atmospheric fog'
  },
  {
    id: 'spiderman-city',
    name: 'Neon Metropolis 4K',
    type: 'image',
    src: '/wallpapers/wallpaper-spiderman-bokeh.jpg',
    accentColor: '#38bdf8',
    photoBorderColor: 'rgba(56, 189, 248, 0.55)',
    photoGlow: '0 30px 80px -10px rgba(14, 165, 233, 0.45)',
    textColor: '#ffffff',
    description: 'Spider-Man over neon city lights in 4K'
  },
  {
    id: 'classic-dark',
    name: 'Midnight Void',
    type: 'gradient',
    gradient: 'radial-gradient(ellipse at 50% 40%, #0d131f 0%, #06080d 60%, #020305 100%)',
    accentColor: '#00f0ff',
    photoBorderColor: 'rgba(0, 240, 255, 0.4)',
    photoGlow: '0 25px 70px -10px rgba(0, 240, 255, 0.35)',
    textColor: '#ffffff',
    description: 'Deep minimalist obsidian engineering workspace'
  }
];

export const FrontPageCover: React.FC<FrontPageCoverProps> = ({
  onUnlock3D,
  onOpenResume,
  onOpenAdmin,
  onOpenTerminal,
  hasUnlockedOnce = false,
}) => {
  const [currentLangIndex, setCurrentLangIndex] = useState(0);
  const [textMode, setTextMode] = useState<'transparent' | 'translucent' | 'solid'>('transparent');
  const [strokeWidth, setStrokeWidth] = useState<'1.5px' | '2px' | '2.5px'>('2px');

  // Pattern 2: Swipe Up Touch & Wheel Gesture State
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);



  // Rotating Hindi Shayari State with Daily Seed
  const [shayariIndex, setShayariIndex] = useState<number>(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    return dayOfYear % SHAYARI_LIBRARY.length;
  });

  // Wallpaper Theme State with Automatic Broken Path Migration
  const [themes, setThemes] = useState<WallpaperTheme[]>(() => {
    try {
      const saved = localStorage.getItem('portfolio_wallpaper_themes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasBrokenPaths = parsed.some(
            (t: any) =>
              t.src &&
              (t.src.includes('wallpaper-wings') ||
                t.src.includes('wallpaper-neon-city') ||
                t.src.includes('wallpaper-supercar') ||
                t.src.includes('wallpaper-night-city'))
          );
          if (!hasBrokenPaths) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved themes:', e);
    }
    try {
      localStorage.setItem('portfolio_wallpaper_themes', JSON.stringify(WALLPAPER_THEMES));
    } catch (_) {}
    return WALLPAPER_THEMES;
  });

  const [activeThemeIndex, setActiveThemeIndex] = useState<number>(() => {
    try {
      const savedIdx = localStorage.getItem('portfolio_active_wallpaper_index');
      if (savedIdx !== null) {
        const parsed = parseInt(savedIdx, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed < WALLPAPER_THEMES.length) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved theme index:', e);
    }
    return 0; // Default to Teal Butterfly 4K
  });

  const [isWallpaperPickerOpen, setIsWallpaperPickerOpen] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  const currentTheme = themes[activeThemeIndex] || WALLPAPER_THEMES[0];
  const currentLang = MULTILINGUAL_TITLES[currentLangIndex];
  const currentShayari = SHAYARI_LIBRARY[shayariIndex] || SHAYARI_LIBRARY[0];

  // Auto-rotate multilingual titles
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentLangIndex((prev) => (prev + 1) % MULTILINGUAL_TITLES.length);
    }, currentLang.duration);

    return () => clearTimeout(timer);
  }, [currentLangIndex, currentLang.duration]);



  // Auto-rotate Hindi Shayari every 5 minutes (300,000 ms)
  useEffect(() => {
    const shayariInterval = setInterval(() => {
      setShayariIndex((prev) => (prev + 1) % SHAYARI_LIBRARY.length);
    }, 5 * 60 * 1000);

    return () => clearInterval(shayariInterval);
  }, []);

  // Previous Shayari Handler (Circle Button)
  const handlePrevShayari = () => {
    soundManager.playClick();
    setShayariIndex((prev) => (prev - 1 + SHAYARI_LIBRARY.length) % SHAYARI_LIBRARY.length);
  };

  // Reload / Next Shayari Handler (Circle Button)
  const handleNextShayari = () => {
    soundManager.playClick();
    setShayariIndex((prev) => (prev + 1) % SHAYARI_LIBRARY.length);
  };

  const handleSelectTheme = (idx: number) => {
    soundManager.playClick();
    setActiveThemeIndex(idx);
    try {
      localStorage.setItem('portfolio_active_wallpaper_index', idx.toString());
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  };

  // Automated 4K Upscale & Image Refinement Engine for User Uploads
  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP).');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      alert('Image file is too large (max 20MB).');
      return;
    }

    setIsProcessingUpload(true);

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const rawBase64 = loadEvent.target?.result as string;
      if (!rawBase64) {
        setIsProcessingUpload(false);
        return;
      }

      const img = new Image();
      img.onload = () => {
        // Automatic 4K Resolution Target: 3840px along the dominant axis
        const TARGET_4K = 3840;
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;
        const scale = TARGET_4K / Math.max(origW, origH);

        const targetW = Math.round(origW * Math.max(1, scale));
        const targetH = Math.round(origH * Math.max(1, scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          setIsProcessingUpload(false);
          return;
        }

        // High-fidelity bicubic smoothing for 4K upscale
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw scaled 4K image
        ctx.drawImage(img, 0, 0, targetW, targetH);

        // Analyze corner pixels to auto-generate matching neon accents
        let accentHex = '#38bdf8';
        try {
          const sample = ctx.getImageData(Math.floor(targetW * 0.1), Math.floor(targetH * 0.1), 1, 1).data;
          accentHex = `#${((1 << 24) + (sample[0] << 16) + (sample[1] << 8) + sample[2]).toString(16).slice(1)}`;
        } catch (_) {}

        // Convert to optimized high-quality 4K data URL
        const enhanced4KUrl = canvas.toDataURL('image/jpeg', 0.94);

        const newTheme: WallpaperTheme = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, '').slice(0, 16) + ' 4K',
          type: 'image',
          src: enhanced4KUrl,
          accentColor: accentHex,
          photoBorderColor: `${accentHex}99`,
          photoGlow: `0 30px 80px -10px ${accentHex}77`,
          textColor: '#ffffff',
          description: `User uploaded 4K enhanced wallpaper (${targetW}x${targetH})`,
        };

        const updated = [newTheme, ...themes];
        setThemes(updated);
        setActiveThemeIndex(0);
        setIsProcessingUpload(false);

        try {
          localStorage.setItem('portfolio_wallpaper_themes', JSON.stringify(updated.slice(0, 8)));
          localStorage.setItem('portfolio_active_wallpaper_index', '0');
        } catch (err) {
          console.warn('Could not save custom wallpaper to localStorage:', err);
        }
      };
      img.src = rawBase64;
    };
    reader.readAsDataURL(file);
  };

  // Pattern 2: Swipe Up / Curtain Lift to 3D Space Trigger with optional deep-linking
  const handleUnlock = (targetSection?: string) => {
    if (isUnlocking) return;
    setIsUnlocking(true);
    soundManager.playClick();
    try {
      soundManager.playWebShot();
    } catch (_) {}
    onUnlock3D(targetSection);
  };

  // Touch Swipe Up Listener for Mobile & Tablets (Supports 1 finger and 2 fingers)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setTouchStartY(e.touches[0].clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    // Upward swipe threshold: 30px (responsive for 1 or 2 fingers)
    if (deltaY > 20) {
      handleUnlock();
    }
    setTouchStartY(null);
  };

  // Mouse Wheel / Trackpad Scroll Down Listener for Desktop
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY > 18) {
      handleUnlock();
    }
  };

  // Pure typography styling with ZERO dark drop-shadow or dark outlines.
  const getTextStyle = () => {
    if (textMode === 'transparent') {
      return {
        WebkitTextStroke: `${strokeWidth} #ffffff`,
        color: 'transparent',
        textShadow: 'none',
        filter: 'none',
      };
    }
    if (textMode === 'translucent') {
      return {
        WebkitTextStroke: `${strokeWidth} #ffffff`,
        color: 'rgba(255, 255, 255, 0.25)',
        textShadow: 'none',
        filter: 'none',
      };
    }
    return {
      color: '#ffffff',
      WebkitTextStroke: 'none',
      textShadow: 'none',
      filter: 'none',
    };
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      className="relative w-full h-screen overflow-hidden text-white flex flex-col justify-between select-none"
    >
      {/* FULL SCREEN BACKGROUND WALLPAPER SYSTEM (Layer z-0) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <AnimatePresence mode="wait">
          {currentTheme.type === 'image' && currentTheme.src ? (
            <motion.div
              key={currentTheme.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Layer 1: Ambient Colored Blur Canvas */}
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center filter blur-3xl scale-110 opacity-70"
                style={{ backgroundImage: `url(${currentTheme.src})` }}
              />

              {/* Layer 2: True 4K Ultra-Sharp Hero Wallpaper */}
              <img
                src={currentTheme.src}
                alt={currentTheme.name}
                className="relative z-10 w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.85] saturate-[1.04]"
              />

              {/* Atmospheric lighting layers ensuring high contrast and pristine readability */}
              <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/60 via-black/25 to-black/80 pointer-events-none" />
              <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />
            </motion.div>
          ) : (
            <motion.div
              key={currentTheme.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
              style={{ background: currentTheme.gradient }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOP HEADER */}
      <header className="relative z-40 w-full px-5 sm:px-8 pt-5 pb-2 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        {/* Top-Left: © Code by Aditya + Admin button */}
        <div className="flex items-center gap-3">
          <span className="text-sm sm:text-base font-body font-medium tracking-wide text-white drop-shadow-sm">
            © Code by Aditya
          </span>
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenAdmin();
            }}
            className="p-1 rounded-md text-white/40 hover:text-white transition-colors cursor-pointer"
            title="Admin Console"
            aria-label="Admin Console"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Top-Right: Pure Hindi Shayari + Corner Circle Buttons (Previous & Reload / New Shayari) */}
        <div className="flex flex-col items-end gap-2 max-w-lg text-right">
          {/* Shayari Text with Corner Circle Buttons */}
          <div className="flex items-center justify-end gap-2.5 w-full">
            {/* Pure Shayari Text Only */}
            <div
              onClick={handleNextShayari}
              className="cursor-pointer select-none font-hindi-shayari text-right space-y-0.5"
              title="अगली शायरी देखें (क्लिक करें)"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentShayari.id}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="space-y-0.5"
                >
                  <p className="text-xs sm:text-[13px] text-white/95 font-medium leading-relaxed drop-shadow-sm">
                    {currentShayari.line1}
                  </p>
                  <p className="text-xs sm:text-[13px] text-white/95 font-medium leading-relaxed drop-shadow-sm">
                    {currentShayari.line2}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Corner Circle Controls: Previous & Reload / New Shayari */}
            <div className="flex items-center gap-1.5 shrink-0 self-center">
              {/* Previous Shayari (Circle Type) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevShayari();
                }}
                className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 hover:border-cyan-400 text-white/70 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95"
                title="पिछली शायरी (Previous Shayari)"
                aria-label="Previous Shayari"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Reload / New Shayari (Circle Type) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextShayari();
                }}
                className="w-6 h-6 rounded-full bg-black/50 hover:bg-black/80 border border-white/20 hover:border-cyan-400 text-white/70 hover:text-cyan-300 flex items-center justify-center transition-all cursor-pointer shadow-md hover:scale-105 active:scale-95 group/btn"
                title="रिलोड / नई शायरी (Reload / New Shayari)"
                aria-label="Reload / New Shayari"
              >
                <RotateCw className="w-3 h-3 group-hover/btn:rotate-180 transition-transform duration-500" />
              </button>
            </div>
          </div>

          {/* Customization & Mode Controls */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-0.5">
            {/* Active Language Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-[11px] font-mono text-cyan-300 shadow-md">
              <Globe className="w-3 h-3 text-cyan-400" />
              <span className="font-bold">{currentLang.code}</span>
              <span className="text-white/70 text-[10px]">({currentLang.label})</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </div>

            {/* Transparency Mode Switcher */}
            <button
              onClick={() => {
                soundManager.playClick();
                setTextMode((prev) =>
                  prev === 'transparent' ? 'translucent' : prev === 'translucent' ? 'solid' : 'transparent'
                );
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 hover:bg-black/60 text-[10px] font-mono text-cyan-300 hover:text-white border border-white/15 transition-all cursor-pointer shadow-md"
              title="Toggle Text Transparency"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>
                {textMode === 'transparent' ? '100% TRANSPARENT' : textMode === 'translucent' ? 'SEMI-TRANSLUCENT' : 'SOLID'}
              </span>
            </button>

            {/* Stroke Thickness Toggle */}
            {textMode !== 'solid' && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  setStrokeWidth((prev) => (prev === '2px' ? '2.5px' : prev === '2.5px' ? '1.5px' : '2px'));
                }}
                className="px-2 py-1 rounded-full bg-black/40 hover:bg-black/60 text-[10px] font-mono text-white/80 hover:text-white border border-white/15 transition-all cursor-pointer shadow-md"
                title="Change Stroke Outline Width"
              >
                OUTLINE: {strokeWidth}
              </button>
            )}

            {/* WALLPAPER THEME SELECTOR BUTTON & FLYOUT */}
            <div className="relative">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setIsWallpaperPickerOpen((prev) => !prev);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 hover:bg-black/70 text-[10px] font-mono border transition-all cursor-pointer shadow-md"
                style={{
                  color: currentTheme.accentColor,
                  borderColor: currentTheme.photoBorderColor,
                }}
                title="Change Full Screen Wallpaper Theme"
              >
                <Palette className="w-3 h-3" />
                <span>WALLPAPER: {currentTheme.name.toUpperCase()}</span>
              </button>

              {/* WALLPAPER PICKER FLYOUT */}
              <AnimatePresence>
                {isWallpaperPickerOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[#0c0e14]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-3 shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-50 text-left"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 font-semibold flex items-center gap-1.5">
                        <ImageIcon className="w-3 h-3 text-cyan-400" />
                        Wallpaper Themes (4K):
                      </span>
                      <button
                        onClick={() => setIsWallpaperPickerOpen(false)}
                        className="text-white/40 hover:text-white p-0.5 rounded cursor-pointer"
                        title="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-2.5">
                      {themes.map((theme, index) => {
                        const isActive = index === activeThemeIndex;
                        return (
                          <button
                            key={theme.id}
                            onClick={() => handleSelectTheme(index)}
                            className={`group relative flex flex-col items-center gap-1 p-1.5 rounded-xl border text-left transition-all cursor-pointer overflow-hidden ${
                              isActive
                                ? 'border-cyan-400 bg-cyan-950/40 ring-2 ring-cyan-400/50 shadow-lg'
                                : 'border-white/10 hover:border-white/30 bg-black/40 hover:bg-black/60'
                            }`}
                          >
                            <div className="w-full h-12 rounded-lg overflow-hidden relative bg-black/60">
                              {theme.type === 'image' && theme.src ? (
                                <img
                                  src={theme.src}
                                  alt={theme.name}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div
                                  className="w-full h-full"
                                  style={{ background: theme.gradient }}
                                />
                              )}
                              {isActive && (
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-black" />
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-white/90 truncate w-full text-center">
                              {theme.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Automatic 4K Custom Upload Engine */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-white/60">
                        {isProcessingUpload ? 'Upscaling to 4K...' : 'Auto-4K Upload:'}
                      </span>
                      <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-mono border border-cyan-500/40 cursor-pointer transition-colors">
                        <Upload className="w-3 h-3" />
                        <span>{isProcessingUpload ? 'Processing...' : 'Upload Any Photo'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isProcessingUpload}
                          onChange={handleCustomWallpaperUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            
          </div>
        </div>
      </header>

      {/* CENTER STAGE */}
      <div className="relative flex-1 w-full flex flex-col items-center justify-center overflow-hidden px-4 py-8">
        {/* CREATIVE TYPOGRAPHY: "BIHARI ENGINEER" — UNDER THE FRAME & PERFECTLY FIT IN VIEWPORT */}
        <div className="relative z-30 mt-3 sm:mt-4 flex justify-center items-center pointer-events-none select-none px-4 w-full max-w-[92vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLang.code}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -8 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center w-full"
            >
              <h1
                dir={currentLang.dir || 'ltr'}
                style={{
                  ...getTextStyle(),
                  fontFamily: currentLang.fontFamily,
                }}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-widest uppercase leading-tight select-none text-center drop-shadow-md"
              >
                {currentLang.text}
              </h1>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Language Selection Mini Pill Bar */}
        <div className="relative z-40 mt-3 sm:mt-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 shadow-lg pointer-events-auto">
          <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider mr-1 hidden sm:inline">
            Lang:
          </span>
          {MULTILINGUAL_TITLES.map((langItem, idx) => (
            <button
              key={langItem.code}
              onClick={() => {
                soundManager.playClick();
                setCurrentLangIndex(idx);
              }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                idx === currentLangIndex
                  ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
              title={`${langItem.lang} (${langItem.label})`}
            >
              {langItem.code}
            </button>
          ))}
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <footer className="relative z-40 w-full px-6 pb-6 sm:pb-8 flex flex-col items-center gap-3">
        {/* PATTERN 2: SWIPE UP / CURTAIN LIFT TO ENTER 3D SPACE */}
        <div className="relative flex flex-col items-center">
          {hasUnlockedOnce ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleUnlock()}
              className="group cursor-pointer select-none bg-gradient-to-r from-cyan-500/25 via-indigo-600/30 to-cyan-500/25 hover:from-cyan-500/40 hover:to-indigo-600/50 backdrop-blur-2xl border border-cyan-400/60 rounded-full px-6 py-2.5 flex items-center gap-3 shadow-[0_10px_35px_rgba(6,182,212,0.35)] transition-all animate-pulse"
              title="Click to jump directly back to 3D Space (No sliding required)"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xs font-bold shadow-md">
                <Unlock className="w-3.5 h-3.5 text-black" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-cyan-200 uppercase font-bold">
                <span>ENTER 3D SPACE</span>
                <span className="text-cyan-400">→</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3 h-3" />
                <span>ACTIVE</span>
              </div>
            </motion.button>
          ) : (
            <motion.div
              drag="y"
              dragConstraints={{ top: -120, bottom: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                if (info.offset.y < -40 || info.velocity.y < -200) {
                  handleUnlock();
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer select-none bg-[#121418]/90 hover:bg-[#121418] backdrop-blur-2xl border border-white/20 hover:border-cyan-400/60 rounded-full px-5 py-2.5 flex items-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] transition-all touch-none relative"
              onClick={() => handleUnlock()}
              title="Swipe up or click to enter 3D Space"
            >
              {/* Lock Icon */}
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center text-xs font-bold shadow-md">
                <Lock className="w-3.5 h-3.5 text-black group-hover:hidden" />
                <Unlock className="w-3.5 h-3.5 text-black hidden group-hover:block" />
              </div>

              {/* Upward Chevron + English Only Text */}
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-100 uppercase font-semibold">
                <motion.div
                  animate={{ y: [0, -3.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                  className="flex items-center"
                >
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                </motion.div>
                <span>SWIPE UP / CLICK TO ENTER</span>
              </div>

              {/* 3D World Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                <Sparkles className="w-3 h-3" />
                <span>3D WORLD</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* FLOATING PILL DOCK WITH PROPER DEEP-LINKING & ANIMATED HOVER TOOLTIPS */}
        <nav
          className="bg-[#121418]/95 backdrop-blur-2xl border border-white/15 rounded-full px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 shadow-2xl"
          aria-label="Quick Actions Dock"
        >
          {/* 1. HOME / COVER PAGE */}
          <button
            onClick={() => soundManager.playClick()}
            className="group relative p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer shadow-md"
            title="Cover Page (Active)"
            aria-label="Home"
          >
            <Home className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              Cover Home (Active)
            </span>
          </button>

                    {/* 2. TERMINAL & DEVELOPER CLI */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenTerminal();
            }}
            className="group relative p-2.5 rounded-full hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer border border-transparent hover:border-cyan-500/30 shadow-md"
            title="Developer Terminal CLI & System Diagnostics"
            aria-label="Developer Terminal"
          >
            <Terminal className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              Developer Terminal (CLI)
            </span>
          </button>

          {/* 3. 3D SATELLITES & SPACE */}
          <button
            onClick={() => handleUnlock('#hero')}
            className="group relative p-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-400/30 transition-all cursor-pointer"
            title="Explore 3D Satellites & Systems"
            aria-label="3D Systems"
          >
            <Box className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              3D Space & Satellites
            </span>
          </button>

          {/* 4. ABOUT ADITYA */}
          <button
            onClick={() => handleUnlock('#about')}
            className="group relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400 hover:scale-110 transition-transform cursor-pointer shadow-md"
            title="About Aditya Kumar"
            aria-label="About Aditya"
          >
            <img src="/aditya-photo.jpg" alt="Aditya" className="w-full h-full object-cover object-top" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              About Aditya
            </span>
          </button>

          {/* 5. PREVIEW & DOWNLOAD RESUME */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenResume();
            }}
            className="group relative p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Preview & Download Resume"
            aria-label="Resume"
          >
            <FileText className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              Resume (Preview & PDF)
            </span>
          </button>

          {/* 6. GITHUB */}
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="group relative p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="GitHub Profile & Projects"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              GitHub (Code Repos)
            </span>
          </a>

          {/* 7. GMAIL / CONTACT */}
          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Collaboration%20Inquiry%20via%20Portfolio`}
            onClick={() => soundManager.playClick()}
            className="group relative p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title={`Email: ${PERSONAL_INFO.email}`}
            aria-label="Email Aditya"
          >
            <Mail className="w-4 h-4" />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-black/90 text-[10px] font-mono text-cyan-300 whitespace-nowrap border border-cyan-500/40 opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-50">
              Email: {PERSONAL_INFO.email}
            </span>
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default FrontPageCover;
