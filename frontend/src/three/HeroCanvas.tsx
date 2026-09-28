import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCanvasProps {
  onSelectSystem?: (systemId: string) => void;
  activeSystemId?: string | null;
}

export const HeroCanvas: React.FC<HeroCanvasProps> = ({ onSelectSystem, activeSystemId }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060709, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x090d16, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x818cf8, 2.0, 15);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    const mainCoreGroup = new THREE.Group();

    const coreGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.92,
      roughness: 0.2,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainCoreGroup.add(coreMesh);

    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(coreGeo, wireMat);
    wireMesh.scale.set(1.03, 1.03, 1.03);
    mainCoreGroup.add(wireMesh);

    const ringGeo = new THREE.TorusGeometry(2.1, 0.04, 16, 100);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.8,
    });
    const ring1 = new THREE.Mesh(ringGeo, glassMat);
    mainCoreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, glassMat);
    ring2.rotation.x = Math.PI / 2.3;
    ring2.rotation.y = Math.PI / 4;
    mainCoreGroup.add(ring2);

    const ring3 = new THREE.Mesh(ringGeo, glassMat);
    ring3.rotation.x = -Math.PI / 3;
    ring3.rotation.z = Math.PI / 6;
    mainCoreGroup.add(ring3);

    const dustCount = 200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      const radius = 2.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;
      dustPositions[i] = radius * Math.cos(theta) * Math.cos(phi);
      dustPositions[i + 1] = radius * Math.sin(phi);
      dustPositions[i + 2] = radius * Math.sin(theta) * Math.cos(phi);
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.05,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });
    const dustCloud = new THREE.Points(dustGeo, dustMat);
    mainCoreGroup.add(dustCloud);

    scene.add(mainCoreGroup);

    const systems = [
      { id: 'backend', color: 0x38bdf8, name: 'BACKEND' },
      { id: 'frontend', color: 0x818cf8, name: 'FRONTEND' },
      { id: 'data', color: 0x34d399, name: 'DATA' },
      { id: 'realtime', color: 0xf59e0b, name: 'REALTIME' },
      { id: 'ai', color: 0xec4899, name: 'AI' },
      { id: 'devops', color: 0x06b6d4, name: 'DEVOPS' },
    ];

    const systemMeshes: { mesh: THREE.Mesh; id: string; baseAngle: number; radius: number; color: number }[] = [];
    const systemOrbitGroup = new THREE.Group();

    systems.forEach((sys, idx) => {
      const angle = (idx / systems.length) * Math.PI * 2;
      const radius = 3.6;

      const nodeGeo = new THREE.OctahedronGeometry(0.24, 0);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: sys.color,
        emissive: sys.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.userData = { id: sys.id, name: sys.name };

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * (radius * 0.7);
      const z = (Math.sin(angle * 2)) * 0.8;
      nodeMesh.position.set(x, y, z);

      systemOrbitGroup.add(nodeMesh);
      systemMeshes.push({ mesh: nodeMesh, id: sys.id, baseAngle: angle, radius, color: sys.color });
    });

    scene.add(systemOrbitGroup);

    const mouse = new THREE.Vector2(-999, -999);
    const targetCameraPos = new THREE.Vector3(0, 0, 8.5);
    const raycaster = new THREE.Raycaster();
    let hoveredMesh: THREE.Mesh | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;

      targetCameraPos.x = x * 1.2;
      targetCameraPos.y = y * 0.8;
    };

    const handleClick = () => {
      if (hoveredMesh && hoveredMesh.userData.id) {
        onSelectSystem?.(hoveredMesh.userData.id);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      mainCoreGroup.rotation.y += delta * 0.35;
      mainCoreGroup.rotation.x = Math.sin(time * 0.5) * 0.15;

      ring1.rotation.z += delta * 0.4;
      ring2.rotation.y -= delta * 0.3;
      ring3.rotation.x += delta * 0.35;

      systemMeshes.forEach((item) => {
        const curAngle = item.baseAngle + time * 0.25;
        const x = Math.cos(curAngle) * item.radius;
        const y = Math.sin(curAngle) * (item.radius * 0.65);
        const z = Math.sin(curAngle * 2) * 0.9;
        item.mesh.position.set(x, y, z);
        item.mesh.rotation.x += delta * 1.5;
        item.mesh.rotation.y += delta * 2.0;

        if (activeSystemId === item.id) {
          item.mesh.scale.set(1.5, 1.5, 1.5);
          (item.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.0;
        } else if (item.mesh !== hoveredMesh) {
          item.mesh.scale.set(1.0, 1.0, 1.0);
          (item.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4;
        }
      });

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(systemMeshes.map(m => m.mesh));

      if (intersects.length > 0) {
        const top = intersects[0].object as THREE.Mesh;
        if (hoveredMesh !== top) {
          if (hoveredMesh && hoveredMesh.userData.id !== activeSystemId) {
            hoveredMesh.scale.set(1.0, 1.0, 1.0);
            (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4;
          }
          hoveredMesh = top;
          hoveredMesh.scale.set(1.4, 1.4, 1.4);
          (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.9;
          container.style.cursor = 'pointer';
        }
      } else {
        if (hoveredMesh && hoveredMesh.userData.id !== activeSystemId) {
          hoveredMesh.scale.set(1.0, 1.0, 1.0);
          (hoveredMesh.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.4;
        }
        hoveredMesh = null;
        container.style.cursor = 'default';
      }

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCameraPos.x, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetCameraPos.y, 0.05);
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onSelectSystem, activeSystemId]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full overflow-hidden pointer-events-auto"
      aria-label="Interactive 3D Software Architecture Environment"
    />
  );
};
