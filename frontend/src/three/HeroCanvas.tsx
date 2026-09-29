import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface DomainItem {
  id: string;
  number: string;
  name: string;
  category: string;
  description: string;
  latency: string;
  uptime: string;
  nodes: string;
  tech: string[];
  color: string;
}

export const DOMAINS: DomainItem[] = [
  {
    id: 'cloud',
    number: '01',
    name: 'CLOUD & K8S',
    category: 'INFRASTRUCTURE',
    description: 'Multi-region hybrid Kubernetes mesh with automated GitOps.',
    latency: '1.2ms',
    uptime: '99.999%',
    nodes: '640+ Nodes',
    tech: ['Kubernetes', 'AWS EKS', 'Terraform', 'Istio'],
    color: '#10b981',
  },
];

export interface HeroCanvasProps {
  themeMode?: string;
  particleColorHex?: number;
  activeDomainId?: string;
  onSelectDomain?: (domain: DomainItem) => void;
  onSelectSystem?: (systemId: string) => void;
  activeSystemId?: string | null;
  isLightMode?: boolean;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({
  themeMode = 'stars',
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeModeRef = useRef<string>(themeMode);

  useEffect(() => {
    themeModeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
    container.appendChild(renderer.domElement);

    // =========================================================================
    // 1. COSMIC STARFIELD & SHOOTING STARS (Mode: 'stars')
    // =========================================================================
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);

    const starCount = 380;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 40;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 24;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

    const starCanvas = document.createElement('canvas');
    starCanvas.width = 32;
    starCanvas.height = 32;
    const starCtx = starCanvas.getContext('2d');
    if (starCtx) {
      const grad = starCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(186, 230, 253, 0.85)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      starCtx.fillStyle = grad;
      starCtx.fillRect(0, 0, 32, 32);
    }
    const starTex = new THREE.CanvasTexture(starCanvas);

    const starMat = new THREE.PointsMaterial({
      size: 0.13,
      map: starTex,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    starsGroup.add(starPoints);

    // Shooting Stars Meteors
    const meteorCount = 2;
    const meteorLines: { line: THREE.Line; speed: number; x: number; y: number }[] = [];
    for (let m = 0; m < meteorCount; m++) {
      const lineGeo = new THREE.BufferGeometry();
      const linePoints = new Float32Array([0, 0, 0, -2.5, 1.5, 0]);
      lineGeo.setAttribute('position', new THREE.BufferAttribute(linePoints, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.65,
      });
      const meteorLine = new THREE.Line(lineGeo, lineMat);
      const startX = (Math.random() - 0.5) * 20;
      const startY = 8 + Math.random() * 6;
      meteorLine.position.set(startX, startY, -2);
      starsGroup.add(meteorLine);
      meteorLines.push({
        line: meteorLine,
        speed: 0.14 + Math.random() * 0.08,
        x: startX,
        y: startY,
      });
    }

    // =========================================================================
    // 2. CYBER MATRIX PERSPECTIVE GRID (Mode: 'matrix')
    // =========================================================================
    const matrixGroup = new THREE.Group();
    scene.add(matrixGroup);

    const gridHelper = new THREE.GridHelper(36, 36, 0x00f0ff, 0x7e22ce);
    gridHelper.position.set(0, -4.5, 0);
    matrixGroup.add(gridHelper);

    const dataCount = 140;
    const dataGeo = new THREE.BufferGeometry();
    const dataPos = new Float32Array(dataCount * 3);
    const dataSpeeds = new Float32Array(dataCount);

    for (let i = 0; i < dataCount; i++) {
      dataPos[i * 3] = (Math.random() - 0.5) * 28;
      dataPos[i * 3 + 1] = -4.5 + Math.random() * 12;
      dataPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      dataSpeeds[i] = 0.03 + Math.random() * 0.05;
    }
    dataGeo.setAttribute('position', new THREE.BufferAttribute(dataPos, 3));

    const dataMat = new THREE.PointsMaterial({
      size: 0.09,
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });
    const dataPoints = new THREE.Points(dataGeo, dataMat);
    matrixGroup.add(dataPoints);

    // =========================================================================
    // 3. ZEN FIREFLIES & ORGANIC STARDUST (Mode: 'zen')
    // =========================================================================
    const zenGroup = new THREE.Group();
    scene.add(zenGroup);

    const fireflyCount = 150;
    const zenGeo = new THREE.BufferGeometry();
    const zenPos = new Float32Array(fireflyCount * 3);
    const zenBase = new Float32Array(fireflyCount * 3);
    const zenSpeeds = new Float32Array(fireflyCount);

    for (let i = 0; i < fireflyCount; i++) {
      const idx = i * 3;
      const x = (Math.random() - 0.5) * 26;
      const y = (Math.random() - 0.5) * 16;
      const z = (Math.random() - 0.5) * 12;
      zenPos[idx] = x;
      zenPos[idx + 1] = y;
      zenPos[idx + 2] = z;
      zenBase[idx] = x;
      zenBase[idx + 1] = y;
      zenBase[idx + 2] = z;
      zenSpeeds[i] = 0.5 + Math.random() * 0.8;
    }
    zenGeo.setAttribute('position', new THREE.BufferAttribute(zenPos, 3));

    const zenCanvas = document.createElement('canvas');
    zenCanvas.width = 32;
    zenCanvas.height = 32;
    const zenCtx = zenCanvas.getContext('2d');
    if (zenCtx) {
      const grad = zenCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(52, 211, 153, 0.9)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      zenCtx.fillStyle = grad;
      zenCtx.fillRect(0, 0, 32, 32);
    }
    const zenTex = new THREE.CanvasTexture(zenCanvas);

    const zenMat = new THREE.PointsMaterial({
      size: 0.14,
      map: zenTex,
      color: 0x10b981,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const zenPoints = new THREE.Points(zenGeo, zenMat);
    zenGroup.add(zenPoints);

    // =========================================================================
    // 4. BOREALIS AURORA FLOWING WAVE (Mode: 'aurora')
    // =========================================================================
    const auroraGroup = new THREE.Group();
    scene.add(auroraGroup);

    const aCols = 55;
    const aRows = 30;
    const auroraCount = aCols * aRows;
    const auroraPositions = new Float32Array(auroraCount * 3);
    const auroraColors = new Float32Array(auroraCount * 3);
    const auroraInitPos = new Float32Array(auroraCount * 3);

    const aColor1 = new THREE.Color(0x06b6d4); // Cyan
    const aColor2 = new THREE.Color(0xec4899); // Pink / Magenta
    const aColor3 = new THREE.Color(0x8b5cf6); // Purple

    const aSpacingX = 0.55;
    const aSpacingZ = 0.45;
    const aOffX = (aCols * aSpacingX) / 2;
    const aOffZ = (aRows * aSpacingZ) / 2;

    for (let r = 0; r < aRows; r++) {
      for (let c = 0; c < aCols; c++) {
        const idx = (r * aCols + c) * 3;
        const x = c * aSpacingX - aOffX;
        const z = r * aSpacingZ - aOffZ;
        const y = -1.0;

        auroraPositions[idx] = x;
        auroraPositions[idx + 1] = y;
        auroraPositions[idx + 2] = z;

        auroraInitPos[idx] = x;
        auroraInitPos[idx + 1] = y;
        auroraInitPos[idx + 2] = z;

        const ratioX = c / aCols;
        const mixed = aColor1.clone().lerp(aColor2, ratioX).lerp(aColor3, r / aRows);
        auroraColors[idx] = mixed.r;
        auroraColors[idx + 1] = mixed.g;
        auroraColors[idx + 2] = mixed.b;
      }
    }

    const auroraGeo = new THREE.BufferGeometry();
    auroraGeo.setAttribute('position', new THREE.BufferAttribute(auroraPositions, 3));
    auroraGeo.setAttribute('color', new THREE.BufferAttribute(auroraColors, 3));

    const auroraMat = new THREE.PointsMaterial({
      size: 0.12,
      map: starTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const auroraPoints = new THREE.Points(auroraGeo, auroraMat);
    auroraGroup.add(auroraPoints);

    // =========================================================================
    // 5. NEURAL NETWORK / CONSTELLATION MESH (Mode: 'network')
    // =========================================================================
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const nodeCount = 75;
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeVelocities = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = (Math.random() - 0.5) * 24;
      nodePositions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      nodePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      nodeVelocities[i * 3] = (Math.random() - 0.5) * 0.012;
      nodeVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.012;
      nodeVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.012;
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 0.16,
      map: starTex,
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    networkGroup.add(nodePoints);

    // Dynamic Connections Lines
    const maxLines = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const netLinesGeo = new THREE.BufferGeometry();
    netLinesGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const netLinesMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const netLines = new THREE.LineSegments(netLinesGeo, netLinesMat);
    networkGroup.add(netLines);

    // =========================================================================
    // 6. ANIMATION LOOP & MOUSE PARALLAX
    // =========================================================================
    let animId: number;
    let clock = new THREE.Clock();
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const animate = () => {
      const time = clock.getElapsedTime();
      const currentMode = themeModeRef.current;

      // Mouse Parallax Damping
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;
      camera.position.x = mouse.x * 0.8;
      camera.position.y = mouse.y * 0.5;
      camera.lookAt(0, 0, 0);

      // Mode Visibility Toggling
      const isStars = currentMode === 'stars' || currentMode === 'midnight';
      const isMatrix = currentMode === 'matrix' || currentMode === 'cyber';
      const isZen = currentMode === 'zen' || currentMode === 'emerald';
      const isAurora = currentMode === 'aurora';
      const isNetwork = currentMode === 'network';

      starsGroup.visible = isStars;
      matrixGroup.visible = isMatrix;
      zenGroup.visible = isZen;
      auroraGroup.visible = isAurora;
      networkGroup.visible = isNetwork;

      // 1. Stars Animation
      if (isStars) {
        starPoints.rotation.y = time * 0.015;
        starPoints.rotation.x = time * 0.008;

        meteorLines.forEach((m) => {
          m.line.position.x += m.speed * 1.5;
          m.line.position.y -= m.speed;
          if (m.line.position.y < -10 || m.line.position.x > 20) {
            m.line.position.x = (Math.random() - 0.5) * 20 - 8;
            m.line.position.y = 8 + Math.random() * 6;
          }
        });
      }

      // 2. Cyber Matrix Animation
      if (isMatrix) {
        gridHelper.position.z = (time * 1.6) % 1.0;
        const dArr = (dataGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < dataCount; i++) {
          const idx = i * 3 + 1;
          dArr[idx] += dataSpeeds[i];
          if (dArr[idx] > 8) {
            dArr[idx] = -4.5;
          }
        }
        dataGeo.attributes.position.needsUpdate = true;
      }

      // 3. Zen Fireflies Animation
      if (isZen) {
        const zArr = (zenGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < fireflyCount; i++) {
          const idx = i * 3;
          const spd = zenSpeeds[i];
          zArr[idx] = zenBase[idx] + Math.sin(time * spd + i) * 0.4;
          zArr[idx + 1] = zenBase[idx + 1] + Math.cos(time * spd * 0.8 + i) * 0.35;
          zArr[idx + 2] = zenBase[idx + 2] + Math.sin(time * spd * 0.6 + i * 2) * 0.3;
        }
        zenGeo.attributes.position.needsUpdate = true;
        zenMat.opacity = 0.5 + Math.sin(time * 2.5) * 0.25;
      }

      // 4. Aurora Flowing Waves Animation
      if (isAurora) {
        const aArr = (auroraGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let r = 0; r < aRows; r++) {
          for (let c = 0; c < aCols; c++) {
            const idx = (r * aCols + c) * 3;
            const x = auroraInitPos[idx];
            const z = auroraInitPos[idx + 2];
            const wave1 = Math.sin(x * 0.28 + time * 1.4) * 0.9;
            const wave2 = Math.cos(z * 0.35 + time * 1.0) * 0.6;
            const wave3 = Math.sin((x + z) * 0.2 + time * 0.8) * 0.4;
            aArr[idx + 1] = wave1 + wave2 + wave3;
          }
        }
        auroraGeo.attributes.position.needsUpdate = true;
      }

      // 5. Neural Network Constellation Animation
      if (isNetwork) {
        const nPos = (nodeGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
        for (let i = 0; i < nodeCount; i++) {
          const idx = i * 3;
          nPos[idx] += nodeVelocities[idx];
          nPos[idx + 1] += nodeVelocities[idx + 1];
          nPos[idx + 2] += nodeVelocities[idx + 2];

          // Bounce off boundaries
          if (nPos[idx] < -13 || nPos[idx] > 13) nodeVelocities[idx] *= -1;
          if (nPos[idx + 1] < -8 || nPos[idx + 1] > 8) nodeVelocities[idx + 1] *= -1;
          if (nPos[idx + 2] < -6 || nPos[idx + 2] > 6) nodeVelocities[idx + 2] *= -1;
        }
        nodeGeo.attributes.position.needsUpdate = true;

        // Connect nearby nodes
        let lineIdx = 0;
        const maxDist = 3.4;
        const maxDistSq = maxDist * maxDist;

        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            const dx = nPos[i * 3] - nPos[j * 3];
            const dy = nPos[i * 3 + 1] - nPos[j * 3 + 1];
            const dz = nPos[i * 3 + 2] - nPos[j * 3 + 2];
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < maxDistSq) {
              linePositions[lineIdx++] = nPos[i * 3];
              linePositions[lineIdx++] = nPos[i * 3 + 1];
              linePositions[lineIdx++] = nPos[i * 3 + 2];
              linePositions[lineIdx++] = nPos[j * 3];
              linePositions[lineIdx++] = nPos[j * 3 + 1];
              linePositions[lineIdx++] = nPos[j * 3 + 2];
            }
          }
        }
        netLinesGeo.attributes.position.needsUpdate = true;
        netLinesGeo.setDrawRange(0, lineIdx / 3);
      }

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      starGeo.dispose();
      starMat.dispose();
      starTex.dispose();
      dataGeo.dispose();
      dataMat.dispose();
      gridHelper.dispose();
      zenGeo.dispose();
      zenMat.dispose();
      zenTex.dispose();
      auroraGeo.dispose();
      auroraMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      netLinesGeo.dispose();
      netLinesMat.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
};
