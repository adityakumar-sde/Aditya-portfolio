import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface IntroCanvasProps {
  onIntroComplete?: () => void;
  isSkipped?: boolean;
}

export const IntroCanvas: React.FC<IntroCanvasProps> = ({ onIntroComplete, isSkipped }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || isSkipped) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060709);
    scene.fog = new THREE.FogExp2(0x060709, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x0f172a, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    keyLight.position.set(5, 12, 8);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x60a5fa, 3, 20);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 35;
      particlePos[i + 1] = (Math.random() - 0.5) * 25;
      particlePos[i + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.08,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    const anchorPoint = new THREE.Vector3(0, 8, -1);
    const webCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-14, 12, -4),
      new THREE.Vector3(-7, 10, -2.5),
      anchorPoint.clone()
    ]);
    const webGeo = new THREE.TubeGeometry(webCurve, 32, 0.025, 8, false);
    const webMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0,
    });
    const webProjectile = new THREE.Mesh(webGeo, webMat);
    scene.add(webProjectile);

    const figureGroup = new THREE.Group();

    const torsoGeo = new THREE.ConeGeometry(0.35, 1.1, 6);
    torsoGeo.rotateX(Math.PI);
    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.25,
      metalness: 0.85,
    });
    const glowEdgeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    const torso = new THREE.Mesh(torsoGeo, darkMat);
    const torsoGlow = new THREE.Mesh(torsoGeo, glowEdgeMat);
    torsoGlow.scale.set(1.02, 1.02, 1.02);
    figureGroup.add(torso);
    figureGroup.add(torsoGlow);

    const headGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const head = new THREE.Mesh(headGeo, darkMat);
    head.position.set(0, 0.72, 0.05);
    figureGroup.add(head);

    const visorGeo = new THREE.BoxGeometry(0.25, 0.04, 0.12);
    const visorMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.73, 0.18);
    figureGroup.add(visor);

    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.85, 6);
    armGeo.rotateZ(-Math.PI / 3);
    const armRight = new THREE.Mesh(armGeo, darkMat);
    armRight.position.set(0.45, 0.4, 0);
    figureGroup.add(armRight);

    const armLeft = new THREE.Mesh(armGeo, darkMat);
    armLeft.position.set(-0.45, 0.25, 0.1);
    armLeft.rotation.z = Math.PI / 2.5;
    figureGroup.add(armLeft);

    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 1.0, 6);
    legGeo.rotateZ(0.2);
    const legRight = new THREE.Mesh(legGeo, darkMat);
    legRight.position.set(0.25, -0.9, -0.2);
    figureGroup.add(legRight);

    const legLeft = new THREE.Mesh(legGeo, darkMat);
    legLeft.position.set(-0.25, -0.85, 0.2);
    legLeft.rotation.x = -0.4;
    figureGroup.add(legLeft);

    figureGroup.position.set(-8, 5, 0);
    figureGroup.visible = false;
    scene.add(figureGroup);

    const swingLineGeo = new THREE.BufferGeometry().setFromPoints([anchorPoint, figureGroup.position]);
    const swingLineMat = new THREE.LineBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.85 });
    const swingLine = new THREE.Line(swingLineGeo, swingLineMat);
    swingLine.visible = false;
    scene.add(swingLine);

    const networkGroup = new THREE.Group();
    const networkNodePositions: THREE.Vector3[] = [];

    networkNodePositions.push(new THREE.Vector3(0, 0, 0));

    for (let ring = 1; ring <= 3; ring++) {
      const radius = ring * 2.2;
      const count = ring * 6;
      for (let j = 0; j < count; j++) {
        const theta = (j / count) * Math.PI * 2 + (ring * 0.3);
        const x = Math.cos(theta) * radius + (Math.random() - 0.5) * 0.4;
        const y = Math.sin(theta) * radius + (Math.random() - 0.5) * 0.4;
        const z = (Math.random() - 0.5) * 1.2;
        networkNodePositions.push(new THREE.Vector3(x, y, z));
      }
    }

    const lineIndices: number[] = [];
    for (let i = 0; i < networkNodePositions.length; i++) {
      for (let j = i + 1; j < networkNodePositions.length; j++) {
        const dist = networkNodePositions[i].distanceTo(networkNodePositions[j]);
        if (dist < 2.8) {
          lineIndices.push(i, j);
        }
      }
    }

    const netLineGeo = new THREE.BufferGeometry().setFromPoints(networkNodePositions);
    netLineGeo.setIndex(lineIndices);
    const netLineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    const networkLines = new THREE.LineSegments(netLineGeo, netLineMat);
    networkGroup.add(networkLines);

    const nodeSpheresGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const instancedNodes = new THREE.InstancedMesh(nodeSpheresGeo, nodeMat, networkNodePositions.length);
    const dummy = new THREE.Object3D();
    networkNodePositions.forEach((pos, idx) => {
      dummy.position.copy(pos);
      const scale = idx === 0 ? 2.5 : 1.0;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(idx, dummy.matrix);
    });
    instancedNodes.instanceMatrix.needsUpdate = true;
    instancedNodes.visible = false;
    networkGroup.add(instancedNodes);

    scene.add(networkGroup);

    const startTime = performance.now();
    let hasCompleted = false;

    const animate = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.015;
        if (positions[i] < -12) positions[i] = 12;
      }
      particleGeo.attributes.position.needsUpdate = true;

      if (elapsed < 0.7) {
        camera.position.set(0, 0, 16);
      } else if (elapsed >= 0.7 && elapsed < 1.6) {
        const t = (elapsed - 0.7) / 0.9;
        webMat.opacity = Math.min(1, t * 1.5);
        webProjectile.scale.set(t, t, t);
        camera.position.x = -2 * t;
      } else if (elapsed >= 1.6 && elapsed < 3.3) {
        webMat.opacity = 0;
        figureGroup.visible = true;
        swingLine.visible = true;

        const swingT = (elapsed - 1.6) / 1.7;
        const swingAngle = -1.1 * Math.cos(swingT * Math.PI * 0.9);
        const radius = 7.5;
        const figX = anchorPoint.x + Math.sin(swingAngle) * radius;
        const figY = anchorPoint.y - Math.cos(swingAngle) * radius;
        const figZ = Math.sin(swingT * Math.PI) * 1.5;

        figureGroup.position.set(figX, figY, figZ);
        figureGroup.rotation.z = -swingAngle * 0.8;
        figureGroup.rotation.y = Math.sin(swingT * Math.PI) * 0.4;

        const handPos = figureGroup.position.clone().add(new THREE.Vector3(0.4, 0.4, 0));
        const linePos = swingLine.geometry.attributes.position.array as Float32Array;
        linePos[0] = anchorPoint.x;
        linePos[1] = anchorPoint.y;
        linePos[2] = anchorPoint.z;
        linePos[3] = handPos.x;
        linePos[4] = handPos.y;
        linePos[5] = handPos.z;
        swingLine.geometry.attributes.position.needsUpdate = true;

        camera.position.x = THREE.MathUtils.lerp(camera.position.x, figX * 0.6, 0.08);
        camera.position.y = THREE.MathUtils.lerp(camera.position.y, figY * 0.5 + 1, 0.08);
        camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10.5, 0.05);
        camera.lookAt(figX, figY, figZ);
      } else if (elapsed >= 3.3 && elapsed < 4.8) {
        swingLine.visible = false;
        const impactT = (elapsed - 3.3) / 1.5;

        figureGroup.position.y = THREE.MathUtils.lerp(figureGroup.position.y, 0, 0.05);
        figureGroup.position.z = THREE.MathUtils.lerp(figureGroup.position.z, -3, 0.05);
        darkMat.opacity = Math.max(0.2, 1 - impactT);
        darkMat.transparent = true;

        instancedNodes.visible = true;
        const netProgress = Math.min(1, impactT * 1.4);
        networkLines.material.opacity = netProgress * 0.75;
        networkGroup.scale.set(netProgress, netProgress, netProgress);
        networkGroup.rotation.z += 0.003;
        networkGroup.rotation.y += 0.002;

        camera.position.set(0, 0, 11);
        camera.lookAt(0, 0, 0);
      } else {
        networkGroup.rotation.z += 0.002;
        networkGroup.rotation.y += 0.001;
        if (!hasCompleted && elapsed > 5.2) {
          hasCompleted = true;
          onIntroComplete?.();
        }
      }

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
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onIntroComplete, isSkipped]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-[#060709] pointer-events-none"
    />
  );
};
