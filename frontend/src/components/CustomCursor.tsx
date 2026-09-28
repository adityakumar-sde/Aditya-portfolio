import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.classList.contains('cursor-pointer') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (isTouchDevice || !isVisible) return null;

  return (
    <>
      <div
        className="custom-cursor-dot"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: isPointer ? 'translate(-50%, -50%) scale(1.6)' : 'translate(-50%, -50%) scale(1)',
          backgroundColor: isPointer ? '#38bdf8' : '#e0f2fe',
        }}
      />
      <div
        className="custom-cursor-ring"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: isPointer
            ? 'translate(-50%, -50%) scale(1.45)'
            : 'translate(-50%, -50%) scale(1)',
          borderColor: isPointer ? 'rgba(56, 189, 248, 0.7)' : 'rgba(56, 189, 248, 0.3)',
          backgroundColor: isPointer ? 'rgba(56, 189, 248, 0.05)' : 'transparent',
        }}
      />
    </>
  );
};
