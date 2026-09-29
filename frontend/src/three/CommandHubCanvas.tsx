import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundManager } from '../services/audio';

export type HubDimension = 'systems' | 'work' | 'stack' | 'career' | 'about';

interface CommandHubCanvasProps {
  activeDimension: HubDimension;
  selectedSubItemId?: string | null;
  onSelectSubItem?: (id: string) => void;
}

export const CommandHubCanvas: React.FC<CommandHubCanvasProps> = ({
  activeDimension,
  selectedSubItemId,
  onSelectSubItem,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // References to communicate with Three.js loop
  const dimensionRef = useRef<HubDimension>(activeDimension);
  dimensionRef.current = activeDimension;

  const selectedSubItemRef = useRef<string | null | undefined>(selectedSubItemId);
  selectedSubItemRef.current = selectedSubItemId;

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06080d, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 9.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0x38bdf8, 3.5, 30);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x818cf8, 2.2, 25);
    fillLight.position.set(-6, -3, 5);
    scene.add(fillLight);

    const bottomGlow = new THREE.PointLight(0x06b6d4, 1.8, 20);
    bottomGlow.position.set(0, -6, 2);
    scene.add(bottomGlow);

    // 3. Root Groups for each dimension
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    const systemsGroup = new THREE.Group();
    const workGroup = new THREE.Group();
    const stackGroup = new THREE.Group();
    const careerGroup = new THREE.Group();
    const aboutGroup = new THREE.Group();

    masterGroup.add(systemsGroup);
    masterGroup.add(workGroup);
    masterGroup.add(stackGroup);
    masterGroup.add(careerGroup);
    masterGroup.add(aboutGroup);

    // Helper: Canvas Text Texture
    const createTextBadge = (text: string, sub: string, colorHex: string) => {
      const cvs = document.createElement('canvas');
      cvs.width = 384;
      cvs.height = 160;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(8, 12, 20, 0.94)';
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(8, 8, 368, 144, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = colorHex;
        ctx.beginPath();
        ctx.arc(36, 44, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 26px "Space Grotesk", Inter, sans-serif';
        ctx.fillText(text, 56, 52);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '18px "JetBrains Mono", monospace';
        ctx.fillText(sub, 36, 106);
      }
      const tex = new THREE.CanvasTexture(cvs);
      tex.needsUpdate = true;
      return tex;
    };

    interface ClickableObject {
      mesh: THREE.Object3D;
      id: string;
      label: string;
      dim: HubDimension;
    }
    const interactiveObjects: ClickableObject[] = [];

    // =========================================================================
    // DIMENSION 1: CORE SYSTEMS (Hexagonal Orbit with Center Energy Core)
    // =========================================================================
    const systemsData = [
      { id: 'backend', title: 'BACKEND', sub: 'Java · Spring Boot', color: 0x38bdf8, angle: 0 },
      { id: 'frontend', title: 'FRONTEND', sub: 'React · TS · WebGL', color: 0x818cf8, angle: Math.PI / 3 },
      { id: 'data', title: 'DATA', sub: 'MySQL · JPA · Redis', color: 0x34d399, angle: (2 * Math.PI) / 3 },
      { id: 'realtime', title: 'REALTIME', sub: 'WebSocket · STOMP', color: 0xf59e0b, angle: Math.PI },
      { id: 'ai', title: 'AI ENGINES', sub: 'LLM · GenAI · n8n', color: 0xec4899, angle: (4 * Math.PI) / 3 },
      { id: 'devops', title: 'DEVOPS', sub: 'Docker · CI/CD · Linux', color: 0x06b6d4, angle: (5 * Math.PI) / 3 },
    ];

    const coreGeo = new THREE.IcosahedronGeometry(0.85, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    systemsGroup.add(coreMesh);

    const coreInnerGeo = new THREE.SphereGeometry(0.55, 24, 24);
    const coreInnerMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: false });
    const coreInnerMesh = new THREE.Mesh(coreInnerGeo, coreInnerMat);
    systemsGroup.add(coreInnerMesh);

    const orbitRadius = 3.6;
    systemsData.forEach((sys) => {
      const x = Math.cos(sys.angle) * orbitRadius;
      const y = Math.sin(sys.angle) * 0.9;
      const z = Math.sin(sys.angle) * orbitRadius * 0.75;

      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(x, y, z);

      const nodeGeo = new THREE.OctahedronGeometry(0.48, 0);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: sys.color,
        roughness: 0.25,
        metalness: 0.8,
        emissive: sys.color,
        emissiveIntensity: 0.45,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeGroup.add(nodeMesh);

      const haloGeo = new THREE.TorusGeometry(0.68, 0.025, 12, 32);
      const haloMat = new THREE.MeshBasicMaterial({ color: sys.color, transparent: true, opacity: 0.7 });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = Math.PI / 2;
      nodeGroup.add(haloMesh);

      const spriteMat = new THREE.SpriteMaterial({
        map: createTextBadge(sys.title, sys.sub, '#' + sys.color.toString(16).padStart(6, '0')),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.9, 0.78, 1);
      sprite.position.set(0, 0.82, 0);
      nodeGroup.add(sprite);

      systemsGroup.add(nodeGroup);
      interactiveObjects.push({ mesh: nodeMesh, id: sys.id, label: sys.title, dim: 'systems' });

      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z)];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: sys.color,
        transparent: true,
        opacity: 0.45,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      systemsGroup.add(line);
    });

    // =========================================================================
    // DIMENSION 2: SELECTED WORK (3D Layered Server Architecture Chassis)
    // =========================================================================
    const workTiers = [
      { id: 'client-tier', label: 'REACT 19 / TS FRONTEND', sub: 'Responsive Workspace & Telephony UI', color: 0x818cf8, y: 1.8 },
      { id: 'gateway-tier', label: 'API GATEWAY & STOMP', sub: 'TLS / Rate Limit / WebSocket Broker', color: 0x38bdf8, y: 1.0 },
      { id: 'controller-tier', label: 'SPRING BOOT CONTROLLERS', sub: 'REST & Message Handlers', color: 0x06b6d4, y: 0.2 },
      { id: 'service-tier', label: 'SERVICE DOMAIN ENGINE', sub: 'Lead Queues & Transaction Bounds', color: 0x10b981, y: -0.6 },
      { id: 'repository-tier', label: 'JPA & HIBERNATE 6', sub: 'Optimized Query Cache & HikariCP', color: 0xf59e0b, y: -1.4 },
      { id: 'storage-tier', label: 'MYSQL 8 & REDIS CLUSTER', sub: 'ACID Persistence & In-Memory Store', color: 0xec4899, y: -2.2 },
    ];

    workTiers.forEach((tier) => {
      const tierGroup = new THREE.Group();
      tierGroup.position.set(0, tier.y, 0);

      const slabGeo = new THREE.BoxGeometry(4.4, 0.16, 2.2);
      const slabMat = new THREE.MeshStandardMaterial({
        color: 0x0a0f1d,
        roughness: 0.2,
        metalness: 0.9,
        emissive: tier.color,
        emissiveIntensity: 0.25,
      });
      const slabMesh = new THREE.Mesh(slabGeo, slabMat);
      tierGroup.add(slabMesh);

      const edgesGeo = new THREE.EdgesGeometry(slabGeo);
      const edgesMat = new THREE.LineBasicMaterial({ color: tier.color, transparent: true, opacity: 0.8 });
      const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
      tierGroup.add(edgesMesh);

      const pillarGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.65, 8);
      const pillarMat = new THREE.MeshBasicMaterial({ color: tier.color });
      const offsets = [
        [-2.0, 0.35, -0.9],
        [2.0, 0.35, -0.9],
        [-2.0, 0.35, 0.9],
        [2.0, 0.35, 0.9],
      ];
      offsets.forEach(([px, py, pz]) => {
        const p = new THREE.Mesh(pillarGeo, pillarMat);
        p.position.set(px, py, pz);
        tierGroup.add(p);
      });

      const spriteMat = new THREE.SpriteMaterial({
        map: createTextBadge(tier.label, tier.sub, '#' + tier.color.toString(16).padStart(6, '0')),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.4, 0.92, 1);
      sprite.position.set(0, 0.38, 1.25);
      tierGroup.add(sprite);

      workGroup.add(tierGroup);
      interactiveObjects.push({ mesh: slabMesh, id: tier.id, label: tier.label, dim: 'work' });
    });

    // =========================================================================
    // DIMENSION 3: TECH STACK & AI LAB (Neural Quantum Gyroscope Matrix)
    // =========================================================================
    const ringGeo1 = new THREE.TorusGeometry(3.0, 0.03, 16, 64);
    const ringGeo2 = new THREE.TorusGeometry(2.2, 0.03, 16, 64);
    const ringGeo3 = new THREE.TorusGeometry(1.4, 0.03, 16, 64);

    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 });
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xec4899, transparent: true, opacity: 0.6 });
    const ringMat3 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.6 });

    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);

    ring1.rotation.x = Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    ring3.rotation.z = Math.PI / 6;

    stackGroup.add(ring1);
    stackGroup.add(ring2);
    stackGroup.add(ring3);

    const aiCoreGeo = new THREE.DodecahedronGeometry(0.75, 0);
    const aiCoreMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xec4899,
      emissiveIntensity: 0.5,
    });
    const aiCoreMesh = new THREE.Mesh(aiCoreGeo, aiCoreMat);
    stackGroup.add(aiCoreMesh);
    interactiveObjects.push({ mesh: aiCoreMesh, id: 'ai-core', label: 'NEURAL AI LAB', dim: 'stack' });

    const stackOrbs = [
      { id: 'java', label: 'JAVA 17', sub: 'Enterprise Core', color: 0x38bdf8, pos: [2.8, 0.8, 0] },
      { id: 'spring-boot', label: 'SPRING BOOT', sub: 'Microservices & REST', color: 0x10b981, pos: [-2.6, -0.9, 0.8] },
      { id: 'react', label: 'REACT 19', sub: 'Interactive UI / WebGL', color: 0x818cf8, pos: [0, 2.7, 0.9] },
      { id: 'llm', label: 'LLM & GENAI', sub: 'Prompt & Multi-Agent', color: 0xec4899, pos: [-1.8, 1.8, -1.2] },
      { id: 'n8n', label: 'n8n AUTOMATION', sub: 'Event Orchestration', color: 0x06b6d4, pos: [1.8, -1.6, -1.0] },
      { id: 'mysql-redis', label: 'MYSQL & REDIS', sub: 'Data & Cache', color: 0xf59e0b, pos: [0, -2.6, 1.2] },
    ];

    stackOrbs.forEach((orb) => {
      const orbGroup = new THREE.Group();
      orbGroup.position.set(orb.pos[0], orb.pos[1], orb.pos[2]);

      const oGeo = new THREE.SphereGeometry(0.32, 24, 24);
      const oMat = new THREE.MeshStandardMaterial({
        color: orb.color,
        roughness: 0.2,
        metalness: 0.8,
        emissive: orb.color,
        emissiveIntensity: 0.4,
      });
      const oMesh = new THREE.Mesh(oGeo, oMat);
      orbGroup.add(oMesh);

      const spriteMat = new THREE.SpriteMaterial({
        map: createTextBadge(orb.label, orb.sub, '#' + orb.color.toString(16).padStart(6, '0')),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.7, 0.7, 1);
      sprite.position.set(0, 0.55, 0);
      orbGroup.add(sprite);

      stackGroup.add(orbGroup);
      interactiveObjects.push({ mesh: oMesh, id: orb.id, label: orb.label, dim: 'stack' });
    });

    // =========================================================================
    // DIMENSION 4: CAREER & MILESTONES (Ascending Holographic Checkpoint Tower)
    // =========================================================================
    const careerNodes = [
      { id: 'tam-infosoft', label: 'TAM INFOSOFT', sub: 'Full Stack Engineer (Present)', color: 0x38bdf8, pos: [0, 1.6, 0] },
      { id: 'thinknext', label: 'THINKNEXT TECH', sub: 'Java Full Stack Intern', color: 0x818cf8, pos: [0, 0.5, 0] },
      { id: 'mca', label: 'MCA DEGREE', sub: 'Global Group · GPA: 7.29', color: 0x34d399, pos: [0, -0.6, 0] },
      { id: 'bsc-maths', label: 'B.Sc MATHEMATICS', sub: 'LNMU University · 73.13%', color: 0xf59e0b, pos: [0, -1.7, 0] },
    ];

    const spireGeo = new THREE.CylinderGeometry(0.03, 0.05, 4.4, 16);
    const spireMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.5 });
    const spireMesh = new THREE.Mesh(spireGeo, spireMat);
    careerGroup.add(spireMesh);

    careerNodes.forEach((cn, i) => {
      const cGroup = new THREE.Group();
      cGroup.position.set(cn.pos[0], cn.pos[1], cn.pos[2]);

      const pGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.1, 6);
      const pMat = new THREE.MeshStandardMaterial({
        color: 0x090e18,
        roughness: 0.2,
        metalness: 0.8,
        emissive: cn.color,
        emissiveIntensity: i === 0 ? 0.6 : 0.25,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      cGroup.add(pMesh);

      const bGeo = new THREE.SphereGeometry(i === 0 ? 0.24 : 0.16, 16, 16);
      const bMat = new THREE.MeshBasicMaterial({ color: cn.color });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.y = 0.2;
      cGroup.add(bMesh);

      const spriteMat = new THREE.SpriteMaterial({
        map: createTextBadge(cn.label, cn.sub, '#' + cn.color.toString(16).padStart(6, '0')),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.4, 0.9, 1);
      sprite.position.set(i % 2 === 0 ? 1.9 : -1.9, 0.2, 0.2);
      cGroup.add(sprite);

      careerGroup.add(cGroup);
      interactiveObjects.push({ mesh: pMesh, id: cn.id, label: cn.label, dim: 'career' });
    });

    // =========================================================================
    // DIMENSION 5: PHILOSOPHY & ABOUT (Multi-faceted Quantum Polyhedron & SLA Rings)
    // =========================================================================
    const aboutPolyGeo = new THREE.IcosahedronGeometry(1.3, 0);
    const aboutPolyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    });
    const aboutPolyMesh = new THREE.Mesh(aboutPolyGeo, aboutPolyMat);
    aboutGroup.add(aboutPolyMesh);

    const aboutInnerGeo = new THREE.OctahedronGeometry(0.85, 0);
    const aboutInnerMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      wireframe: false,
    });
    const aboutInnerMesh = new THREE.Mesh(aboutInnerGeo, aboutInnerMat);
    aboutGroup.add(aboutInnerMesh);

    const slaBadges = [
      { id: 'uptime', label: '99.99% SLA', sub: 'High Availability', color: 0x34d399, pos: [-2.6, 1.4, 0.5] },
      { id: 'latency', label: '< 45ms P99', sub: 'Sub-second API Latency', color: 0x38bdf8, pos: [2.6, 1.4, -0.5] },
      { id: 'qps', label: '250k+ QPS', sub: 'High Throughput Engine', color: 0xf59e0b, pos: [-2.4, -1.4, -0.5] },
      { id: 'apps', label: '15+ SHIPPED', sub: 'Production Systems', color: 0xec4899, pos: [2.4, -1.4, 0.5] },
    ];

    slaBadges.forEach((sla) => {
      const spriteMat = new THREE.SpriteMaterial({
        map: createTextBadge(sla.label, sla.sub, '#' + sla.color.toString(16).padStart(6, '0')),
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(2.0, 0.82, 1);
      sprite.position.set(sla.pos[0], sla.pos[1], sla.pos[2]);
      aboutGroup.add(sprite);
    });

    interactiveObjects.push({ mesh: aboutPolyMesh, id: 'philosophy-core', label: 'PRECISION & SCALE', dim: 'about' });

    // =========================================================================
    // 4. MOUSE DRAG / ORBIT & RAYCASTING INTERACTION
    // =========================================================================
    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotXTarget = 0.12;
    let rotYTarget = 0;
    let currentRotX = 0.12;
    let currentRotY = 0;
    let zoomTarget = 9.5;
    let currentZoom = 9.5;

    const handlePointerDown = (e: MouseEvent) => {
      isMouseDown = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      setIsInteracting(false);
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (isMouseDown) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rotYTarget += deltaX * 0.006;
        rotXTarget = Math.max(-0.6, Math.min(0.6, rotXTarget + deltaY * 0.005));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const activeObjects = interactiveObjects.filter((o) => o.dim === dimensionRef.current);
      const intersects = raycaster.intersectObjects(activeObjects.map((o) => o.mesh), true);

      if (intersects.length > 0) {
        const hit = activeObjects.find((o) => o.mesh === intersects[0].object || o.mesh.children.includes(intersects[0].object));
        if (hit) {
          setHoveredLabel(hit.label);
          renderer.domElement.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredLabel(null);
      renderer.domElement.style.cursor = isMouseDown ? 'grabbing' : 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      const activeObjects = interactiveObjects.filter((o) => o.dim === dimensionRef.current);
      const intersects = raycaster.intersectObjects(activeObjects.map((o) => o.mesh), true);

      if (intersects.length > 0) {
        const hit = activeObjects.find((o) => o.mesh === intersects[0].object || o.mesh.children.includes(intersects[0].object));
        if (hit && onSelectSubItem) {
          soundManager.playClick();
          onSelectSubItem(hit.id);
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      zoomTarget = Math.max(6.5, Math.min(13.0, zoomTarget + e.deltaY * 0.005));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mouseup', handlePointerUp);
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('click', handleClick);
    dom.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth || 800;
      const h = mountRef.current.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 5. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      clock.getDelta();
      const time = clock.getElapsedTime();

      currentRotX += (rotXTarget - currentRotX) * 0.08;
      currentRotY += (rotYTarget - currentRotY) * 0.08;
      currentZoom += (zoomTarget - currentZoom) * 0.08;

      masterGroup.rotation.x = currentRotX;
      masterGroup.rotation.y = currentRotY + (isInteracting ? 0 : time * 0.12);
      camera.position.z = currentZoom;

      const currentDim = dimensionRef.current;
      systemsGroup.visible = currentDim === 'systems';
      workGroup.visible = currentDim === 'work';
      stackGroup.visible = currentDim === 'stack';
      careerGroup.visible = currentDim === 'career';
      aboutGroup.visible = currentDim === 'about';

      if (systemsGroup.visible) {
        coreMesh.rotation.y = time * 0.4;
        coreMesh.rotation.x = time * 0.2;
        coreInnerMesh.scale.setScalar(1 + Math.sin(time * 3) * 0.08);
      } else if (workGroup.visible) {
        workGroup.position.y = Math.sin(time * 1.5) * 0.08;
      } else if (stackGroup.visible) {
        ring1.rotation.z = time * 0.3;
        ring2.rotation.x = time * 0.25;
        ring3.rotation.y = time * 0.35;
        aiCoreMesh.rotation.y = time * 0.5;
      } else if (careerGroup.visible) {
        spireMesh.rotation.y = time * 0.2;
      } else if (aboutGroup.visible) {
        aboutPolyMesh.rotation.y = time * 0.35;
        aboutPolyMesh.rotation.z = time * 0.2;
        aboutInnerMesh.rotation.y = -time * 0.5;
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handlePointerUp);
      dom.removeEventListener('mousedown', handlePointerDown);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('click', handleClick);
      dom.removeEventListener('wheel', handleWheel);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] rounded-2xl overflow-hidden bg-[#080c14]/75 backdrop-blur-md border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: 3D Hologram HUD Status */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-400">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        <span>3D SPATIAL TELEMETRY FEED // 60 FPS</span>
      </div>

      {/* Top Right: Active Dimension Indicator */}
      <div className="absolute top-4 right-4 z-20 pointer-events-none px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono uppercase tracking-wider text-slate-300">
        DIM: <span className="text-cyan-400 font-bold">{activeDimension}</span>
      </div>

      {/* Hovered Node Tooltip HUD */}
      {hoveredLabel && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 rounded-xl bg-cyan-950/80 backdrop-blur-md border border-cyan-400 text-white font-mono text-xs tracking-wider shadow-lg shadow-cyan-500/20">
          SELECT NODE: <span className="text-cyan-300 font-bold">{hoveredLabel}</span>
        </div>
      )}

      {/* Bottom Control Hint */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between text-[11px] font-mono text-slate-500 pointer-events-none">
        <span className="hidden sm:inline">DRAG TO ORBIT // SCROLL TO ZOOM</span>
        <span className="text-cyan-400/80">INTERACTIVE THREE.JS ENGINE</span>
      </div>
    </div>
  );
};
