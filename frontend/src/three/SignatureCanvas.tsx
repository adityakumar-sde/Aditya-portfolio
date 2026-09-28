import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface SignatureCanvasProps {
  onCollapsed?: () => void;
}

export const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onCollapsed }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 260;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const count = 120;
    const initialPositions = new Float32Array(count * 3);
    const currentPositions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      const radius = 1.2 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      const x = radius * Math.cos(theta) * Math.cos(phi);
      const y = radius * Math.sin(phi);
      const z = radius * Math.sin(theta) * Math.cos(phi);

      initialPositions[i] = x;
      initialPositions[i + 1] = y;
      initialPositions[i + 2] = z;

      currentPositions[i] = x;
      currentPositions[i + 1] = y;
      currentPositions[i + 2] = z;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(currentPositions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    const flareGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const flareMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    });
    const flare = new THREE.Mesh(flareGeo, flareMat);
    scene.add(flare);

    let startTime = performance.now();
    let hasNotified = false;

    const animate = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      if (elapsed < 3.2) {
        points.rotation.y += 0.008;
        points.rotation.x += 0.004;
      } else if (elapsed >= 3.2 && elapsed < 5.5) {
        const t = (elapsed - 3.2) / 2.3;
        const factor = Math.max(0, 1 - Math.pow(t, 2));

        const pos = geo.attributes.position.array as Float32Array;
        for (let i = 0; i < count * 3; i++) {
          pos[i] = initialPositions[i] * factor;
        }
        geo.attributes.position.needsUpdate = true;
        mat.opacity = factor * 0.8;

        flareMat.opacity = Math.min(1, t * 1.8);
        const flareScale = 0.5 + Math.sin(t * Math.PI) * 1.8;
        flare.scale.set(flareScale, flareScale, flareScale);
      } else {
        const disappearT = Math.min(1, (elapsed - 5.5) / 1.0);
        flareMat.opacity = Math.max(0, 1 - disappearT);
        mat.opacity = 0;

        if (!hasNotified && elapsed > 6.2) {
          hasNotified = true;
          setIsCollapsed(true);
          onCollapsed?.();
        }
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onCollapsed]);

  return (
    <div className="relative w-full h-[240px] flex items-center justify-center overflow-hidden">
      <div ref={mountRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className={`relative z-10 text-center transition-opacity duration-1000 ${isCollapsed ? 'opacity-100' : 'opacity-85'}`}>
        <p className="text-sm font-mono tracking-[0.25em] text-slate-400 uppercase">
          ENGINEERED WITH PRECISION
        </p>
      </div>
    </div>
  );
};
