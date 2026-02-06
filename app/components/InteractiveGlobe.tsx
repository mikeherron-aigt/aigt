'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type Props = {
  width?: number;
  height?: number;
  className?: string;
};

export default function InteractiveGlobe({ width, height, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let raf = 0;
    let disposed = false;

    // ---- Scene ----
    const scene = new THREE.Scene();

    // ---- Camera ----
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 3000);
    scene.add(camera);

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);

    // ---- Globe ----
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Dotted globe settings (tweak if you want denser/lighter)
    const radius = 40;
    const dotCount = 2400;
    const dotSize = 0.55;

    // Build dot positions uniformly over sphere
    const positions = new Float32Array(dotCount * 3);
    const random = (min: number, max: number) => min + Math.random() * (max - min);

    for (let i = 0; i < dotCount; i++) {
      // Uniform distribution on a sphere surface
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dotsMat = new THREE.PointsMaterial({
      color: 0x111111,
      size: dotSize,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.18,
      depthWrite: false,
    });

    const dots = new THREE.Points(dotsGeo, dotsMat);
    globeGroup.add(dots);

    // A very subtle halo to soften the edge
    const haloGeo = new THREE.SphereGeometry(radius * 1.01, 64, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      transparent: true,
      opacity: 0.035,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    globeGroup.add(halo);

    // ---- Controls ----
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Optional: keep user from flipping it upside down
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI - 0.25;

    // ---- Sizing ----
    const resize = () => {
      if (disposed) return;

      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      camera.aspect = w / h;

      // Camera distance tuned to keep globe consistent across aspect ratios
      // Slightly farther back on smaller viewports
      const baseZ = window.innerWidth > 700 ? 140 : 185;
      camera.position.set(0, 0, baseZ);

      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
    };

    // First paint after layout
    requestAnimationFrame(() => resize());

    // Observe container changes (prod/permalink timing fix)
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    window.addEventListener('resize', resize);

    // ---- Animate ----
    const animate = () => {
      if (disposed) return;

      controls.update();

      // subtle, calm rotation
      globeGroup.rotation.y += 0.0012;

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(raf);

      window.removeEventListener('resize', resize);
      ro.disconnect();

      controls.dispose();

      // Dispose objects
      dotsGeo.dispose();
      dotsMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();

      renderer.dispose();

      try {
        renderer.forceContextLoss();
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
