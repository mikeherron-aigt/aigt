// app/components/InteractiveGlobe.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let raf = 0;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 2000);
    camera.position.set(0, 0, 140);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Lights (kept minimal, base is MeshBasicMaterial anyway)
    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    // Globe base (white)
    const RADIUS = 50;
    const globeGeom = new THREE.SphereGeometry(RADIUS, 96, 64);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Dots group
    const dotsGroup = new THREE.Group();
    scene.add(dotsGroup);

    const DOT_COLOR = new THREE.Color('#8d948a');
    const DOT_SIZE = 0.55; // make a little bigger if needed
    const DOT_RADIUS = RADIUS + 0.85;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.5;

    // Resize
    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);

      // Keep a consistent visual scale
      camera.position.z = w > 700 ? 140 : 170;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // Build dots from /public/globe-map.png
    // Tips:
    // - LOWER STEP = MORE DOTS (1 = densest, 2 = dense, 3+ = sparse)
    // - LOWER THRESHOLD = more land accepted (if your land is gray)
    const STEP = 2;
    const THRESHOLD = 40; // 0..255, lower means stricter

    const buildDots = async () => {
      // Clear any existing dots
      while (dotsGroup.children.length) dotsGroup.remove(dotsGroup.children[0]);

      const img = new Image();
      img.src = '/globe-map.png';
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load /globe-map.png'));
      });

      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);

      const positions: number[] = [];
      const colors: number[] = [];

      for (let y = 0; y < height; y += STEP) {
        for (let x = 0; x < width; x += STEP) {
          const idx = (y * width + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          // ignore fully transparent pixels (if your png uses transparency)
          if (a < 10) continue;

          // treat dark pixels as land (black land on white ocean)
          const brightness = (r + g + b) / 3;
          const isLand = brightness < THRESHOLD;
          if (!isLand) continue;

          // Convert x,y on equirectangular map to spherical coords
          const u = x / width;  // 0..1
          const v = y / height; // 0..1

          const lon = (u * Math.PI * 2) - Math.PI;        // -PI..PI
          const lat = (Math.PI / 2) - (v * Math.PI);      // PI/2..-PI/2

          const cosLat = Math.cos(lat);
          const px = DOT_RADIUS * cosLat * Math.cos(lon);
          const py = DOT_RADIUS * Math.sin(lat);
          const pz = DOT_RADIUS * cosLat * Math.sin(lon);

          positions.push(px, py, pz);
          colors.push(DOT_COLOR.r, DOT_COLOR.g, DOT_COLOR.b);
        }
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const mat = new THREE.PointsMaterial({
        size: DOT_SIZE,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      });

      const points = new THREE.Points(geo, mat);
      dotsGroup.add(points);
    };

    buildDots().catch(() => {
      // If the map fails, you still get the white globe
    });

    // Animation loop
    const animate = () => {
      controls.update();
      globeMesh.rotation.y += 0.0012;
      dotsGroup.rotation.y += 0.0012;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();

      globeGeom.dispose();
      globeMat.dispose();

      dotsGroup.traverse((obj) => {
        const o = obj as THREE.Points;
        if ((o as any).geometry) (o as any).geometry.dispose?.();
        if ((o as any).material) (o as any).material.dispose?.();
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
