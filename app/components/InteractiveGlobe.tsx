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

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // Camera (fixed distance, do not change on resize)
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 4000);
    camera.position.set(0, 0, 360);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.5;

    // Lights (not really needed, base is MeshBasic, but harmless)
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Globe base (white)
    const RADIUS = 120; // larger so it fills like Figma
    const globeGeom = new THREE.SphereGeometry(RADIUS, 128, 96);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Dots group
    const dotsGroup = new THREE.Group();
    scene.add(dotsGroup);

    const DOT_COLOR = new THREE.Color('#8d948a');
    const DOT_RADIUS = RADIUS + 1.2;
    const DOT_SIZE = 0.35; // smaller dots like the comp

    // Resize (only aspect + renderer size)
    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    // Force an initial layout pass before first resize
    requestAnimationFrame(() => {
      resize();
    });

    // Build dots from /public/globe-map.png
    const STEP = 1;        // dense
    const THRESHOLD = 70;  // adjust land detection (higher = more land picked up)

    const buildDots = async () => {
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

      const imageData = ctx.getImageData(0, 0, c.width, c.height);
      const { data, width, height } = imageData;

      const positions: number[] = [];
      const colors: number[] = [];

      for (let y = 0; y < height; y += STEP) {
        for (let x = 0; x < width; x += STEP) {
          const idx = (y * width + x) * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a < 10) continue;

          // black land on white ocean
          const brightness = (r + g + b) / 3;
          if (brightness >= THRESHOLD) continue;

          const u = x / width;
          const v = y / height;

          const lon = u * Math.PI * 2 - Math.PI;
          const lat = Math.PI / 2 - v * Math.PI;

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
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geo, mat);
      dotsGroup.add(points);
    };

    buildDots().catch(() => {
      // leave blank if the map fails
    });

    // Animate
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
        const anyObj = obj as any;
        if (anyObj.geometry?.dispose) anyObj.geometry.dispose();
        if (anyObj.material?.dispose) anyObj.material.dispose();
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
