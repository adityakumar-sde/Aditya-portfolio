import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface AiLabCanvasProps {
  onNodeClick: (nodeId: string) => void;
  activeNodeId?: string | null;
}

export const AiLabCanvas: React.FC<AiLabCanvasProps> = ({ onNodeClick, activeNodeId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060709, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xec4899, 2.5, 20);
    pointLight.position.set(0, 4, 5);
    scene.add(pointLight);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const nodeConfigs = [
      { id: 'llm', title: 'LLM', color: 0xec4899, pos: [-2.5, 1.2, 0.2] },
      { id: 'genai', title: 'GENAI', color: 0x818cf8, pos: [2.5, 1.2, -0.2] },
      { id: 'prompt-engineering', title: 'PROMPT ENGINEERING', color: 0x38bdf8, pos: [-1.4, -1.3, 0.5] },
      { id: 'ai-apis', title: 'AI APIs', color: 0x34d399, pos: [1.4, -1.3, -0.4] },
      { id: 'automation', title: 'AUTOMATION', color: 0xf59e0b, pos: [-0.0, 2.2, 0.1] },
      { id: 'n8n', title: 'n8n', color: 0x06b6d4, pos: [0.0, -0.2, 0.8] },
    ];

    const nodeMeshes: { mesh: THREE.Mesh; id: string; title: string; color: number }[] = [];

    const makeTextTexture = (label: string, colorHex: string) => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 128;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0d14';
        ctx.fillRect(0, 0, 256, 128);
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, 252, 124);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(label, 128, 72);
      }
      return new THREE.CanvasTexture(c);
    };

    nodeConfigs.forEach((cfg) => {
      const geo = new THREE.IcosahedronGeometry(0.5, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.45,
        roughness: 0.3,
        metalness: 0.7,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...(cfg.pos as [number, number, number]));
      mesh.userData = { id: cfg.id, title: cfg.title };

      const wire = new THREE.Mesh(
        geo,
        new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.3 })
      );
      wire.scale.set(1.08, 1.08, 1.08);
      mesh.add(wire);

      const texture = makeTextTexture(cfg.title, `#${cfg.color.toString(16).padStart(6, '0')}`);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.7, 1);
      sprite.position.set(0, 0.85, 0);
      mesh.add(sprite);

      networkGroup.add(mesh);
      nodeMeshes.push({ mesh, id: cfg.id, title: cfg.title, color: cfg.color });
    });

    const connections: [number, number][] = [
      [0, 1], [0, 2], [0, 4], [0, 5],
      [1, 3], [1, 4], [1, 5],
      [2, 3], [2, 5],
      [3, 5],
      [4, 5]
    ];

    const pulses: { mesh: THREE.Mesh; p1: THREE.Vector3; p2: THREE.Vector3; progress: number; speed: number }[] = [];

    connections.forEach(([i, j]) => {
      const p1 = new THREE.Vector3(...(nodeConfigs[i].pos as [number, number, number]));
      const p2 = new THREE.Vector3(...(nodeConfigs[j].pos as [number, number, number]));

      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xec4899,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(lineGeo, lineMat);
      networkGroup.add(line);

      const packet = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      networkGroup.add(packet);
      pulses.push({
        mesh: packet,
        p1,
        p2,
        progress: Math.random(),
        speed: 0.4 + Math.random() * 0.4
      });
    });

    const mouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    let curHover: { id: string; title: string } | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleClick = () => {
      if (curHover) {
        onNodeClick(curHover.id);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      networkGroup.rotation.y = Math.sin(time * 0.2) * 0.35;
      networkGroup.rotation.x = Math.cos(time * 0.15) * 0.15;

      pulses.forEach((p) => {
        p.progress = (p.progress + delta * p.speed) % 1;
        p.mesh.position.lerpVectors(p.p1, p.p2, p.progress);
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const matched = nodeMeshes.find(n => n.mesh === hit);
        if (matched) {
          if (curHover?.id !== matched.id) {
            curHover = { id: matched.id, title: matched.title };
            setHoveredNode(curHover);
            container.style.cursor = 'pointer';
          }
        }
      } else {
        if (curHover !== null) {
          curHover = null;
          setHoveredNode(null);
          container.style.cursor = 'default';
        }
      }

      nodeMeshes.forEach(({ mesh, id }) => {
        const isActive = activeNodeId === id;
        const isHover = curHover?.id === id;
        if (isActive || isHover) {
          mesh.scale.lerp(new THREE.Vector3(1.35, 1.35, 1.35), 0.1);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
        } else {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.45;
        }
      });

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onNodeClick, activeNodeId]);

  return (
    <div className="relative w-full h-[460px] rounded-xl overflow-hidden bg-[#07090e] border border-white/10 group">
      <div ref={mountRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-pink-300">
            3D NEURAL SYNERGY TOPOLOGY
          </span>
        </div>
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
          Click any neural node to explore practical implementations
        </p>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-pink-500/40 px-3.5 py-1.5 rounded-lg flex items-center gap-2 pointer-events-none">
          <span className="text-xs font-mono text-pink-400">Node:</span>
          <span className="text-sm font-semibold text-white">{hoveredNode.title}</span>
        </div>
      )}
    </div>
  );
};
