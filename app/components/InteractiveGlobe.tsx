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

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(30, 1, 1, 2000);
    camera.position.z = window.innerWidth > 700 ? 100 : 140;
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setClearColor(0x000000, 0);

    // Globe (simple placeholder - keep your existing globe build below if you already have one)
    // If you already have your full globe code (textures, dots, arcs, etc), paste it where indicated.
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const sphereGeo = new THREE.SphereGeometry(40, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x111111,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphere);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = false;
    controls.enablePan = false;

    // ---- IMPORTANT: real sizing logic for production ----
    const resize = () => {
      if (disposed) return;

      // Prefer actual rendered size of the container
      const w = container.clientWidth;
      const h = container.clientHeight;

      if (!w || !h) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
    };

    // First paint after layout
    requestAnimationFrame(() => resize());

    // Keep in sync on any layout changes (Netlify/prod timing fix)
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    // Also handle window resize
    window.addEventListener('resize', resize);

    const animate = () => {
      if (disposed) return;

      controls.update();

      // subtle spin
      globeGroup.rotation.y += 0.0015;

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

      // Dispose scene objects
      sphereGeo.dispose();
      sphereMat.dispose();

      renderer.dispose();

      // Ensure WebGL context releases
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
