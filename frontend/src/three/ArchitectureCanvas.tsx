import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { ArchitectureNodeData } from '../types';
import { CRM_ARCHITECTURE_NODES } from '../data/portfolioData';

interface ArchitectureCanvasProps {
  onNodeClick: (node: ArchitectureNodeData) => void;
  selectedNodeId?: string | null;
}

export const ArchitectureCanvas: React.FC<ArchitectureCanvasProps> = ({ onNodeClick, selectedNodeId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ArchitectureNodeData | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 25);
    pointLight.position.set(2, 6, 6);
    scene.add(pointLight);

    const accentLight = new THREE.PointLight(0x818cf8, 2, 20);
    accentLight.position.set(-5, -4, 4);
    scene.add(accentLight);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const layerColors: Record<string, number> = {
      frontend: 0x818cf8,
      transport: 0x38bdf8,
      controller: 0x06b6d4,
      service: 0x10b981,
      data: 0xf59e0b,
      realtime: 0xec4899
    };

    const createNodeTexture = (text: string, sub: string, colorHex: string) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, 512, 256);
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 8;
        ctx.strokeRect(4, 4, 504, 248);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, 256, 115);

        ctx.fillStyle = colorHex;
        ctx.font = '24px "JetBrains Mono", monospace';
        ctx.fillText(sub, 256, 175);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const nodeMeshes: { mesh: THREE.Mesh; data: ArchitectureNodeData; origPos: THREE.Vector3 }[] = [];

    CRM_ARCHITECTURE_NODES.forEach((node) => {
      const color = layerColors[node.layer] || 0x38bdf8;
      const colorStr = `#${color.toString(16).padStart(6, '0')}`;
      const texture = createNodeTexture(node.name, node.tech.split('/')[0].trim(), colorStr);

      const boxGeo = new THREE.BoxGeometry(2.1, 1.1, 0.4);
      const materials = [
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 }),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 }),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 }),
        new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 }),
        new THREE.MeshStandardMaterial({ map: texture, roughness: 0.2, metalness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.8 }),
      ];

      const mesh = new THREE.Mesh(boxGeo, materials);
      const pos = new THREE.Vector3(...node.position);
      mesh.position.copy(pos);
      mesh.userData = { nodeData: node };

      const edges = new THREE.EdgesGeometry(boxGeo);
      const edgeLine = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.6 })
      );
      mesh.add(edgeLine);

      rootGroup.add(mesh);
      nodeMeshes.push({ mesh, data: node, origPos: pos.clone() });
    });

    const connections: [string, string, number][] = [
      ['react-client', 'gateway-transport', 0x38bdf8],
      ['gateway-transport', 'controller-layer', 0x38bdf8],
      ['controller-layer', 'service-layer', 0x10b981],
      ['service-layer', 'repository-layer', 0xf59e0b],
      ['repository-layer', 'mysql-db', 0xf59e0b],
      ['react-client', 'websocket-broker', 0xec4899],
      ['websocket-broker', 'service-layer', 0xec4899]
    ];

    const pulses: { mesh: THREE.Mesh; curve: THREE.CatmullRomCurve3; progress: number; speed: number }[] = [];

    connections.forEach(([startId, endId, color]) => {
      const startNode = CRM_ARCHITECTURE_NODES.find(n => n.id === startId);
      const endNode = CRM_ARCHITECTURE_NODES.find(n => n.id === endId);
      if (!startNode || !endNode) return;

      const p1 = new THREE.Vector3(...startNode.position);
      const p2 = new THREE.Vector3(...endNode.position);
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      mid.z += 0.3;

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2]);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.02, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35 });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      rootGroup.add(tube);

      const packetGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const packetMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const packet = new THREE.Mesh(packetGeo, packetMat);
      rootGroup.add(packet);

      pulses.push({
        mesh: packet,
        curve,
        progress: Math.random(),
        speed: 0.3 + Math.random() * 0.2
      });
    });

    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    const mouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    let currentHover: ArchitectureNodeData | null = null;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rootGroup.rotation.y += deltaX * 0.005;
        rootGroup.rotation.x += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      if (currentHover) {
        onNodeClick(currentHover);
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('click', onClick);

    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      if (!isDragging) {
        rootGroup.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
      }

      pulses.forEach((p) => {
        p.progress = (p.progress + delta * p.speed) % 1;
        const point = p.curve.getPoint(p.progress);
        p.mesh.position.copy(point);
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.mesh));

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const matched = nodeMeshes.find(n => n.mesh === hit);
        if (matched) {
          if (currentHover?.id !== matched.data.id) {
            currentHover = matched.data;
            setHoveredNode(matched.data);
            container.style.cursor = 'pointer';
          }
        }
      } else {
        if (currentHover !== null) {
          currentHover = null;
          setHoveredNode(null);
          container.style.cursor = 'grab';
        }
      }

      nodeMeshes.forEach(({ mesh, data, origPos }) => {
        const isSelected = selectedNodeId === data.id;
        const isHover = currentHover?.id === data.id;

        if (isSelected || isHover) {
          mesh.scale.lerp(new THREE.Vector3(1.1, 1.1, 1.2), 0.1);
          mesh.position.lerp(new THREE.Vector3(origPos.x, origPos.y, origPos.z + 0.3), 0.1);
        } else {
          mesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
          mesh.position.lerp(origPos, 0.1);
        }
      });

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onNodeClick, selectedNodeId]);

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden bg-[#0a0c10] border border-white/10 group">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-300">
            3D INTERACTIVE ARCHITECTURE INSPECTOR
          </span>
        </div>
        <p className="text-[11px] font-mono text-slate-400 mt-0.5">
          Drag to orbit · Click any layer for technical telemetry
        </p>
      </div>

      {hoveredNode && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto z-20 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-4 py-2.5 rounded-lg flex items-center justify-between gap-4 pointer-events-none">
          <div>
            <span className="text-xs font-mono text-cyan-400 block">{hoveredNode.layer.toUpperCase()} LAYER</span>
            <span className="text-sm font-semibold text-white">{hoveredNode.name}</span>
          </div>
          <span className="text-xs font-mono text-slate-300 bg-white/5 px-2 py-1 rounded">
            Click to inspect →
          </span>
        </div>
      )}

      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden md:block">
        <span className="text-[10px] font-mono text-slate-400 bg-black/50 px-2 py-1 rounded border border-white/5">
          WebGL Architecture Matrix
        </span>
      </div>
    </div>
  );
};
