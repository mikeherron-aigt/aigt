'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type Props = {
  /** Optional fallback size. If omitted, the component fills its container. */
  width?: number;
  height?: number;
  /** Optional: cap device pixel ratio for performance */
  maxDpr?: number;
};

export default function InteractiveGlobe({
  width,
  height,
  maxDpr = 2,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let raf = 0;

    // Scene
    const scene = new THREE.Scene();

    // Renderer (resizes to container)
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });

    // Camera (aspect updated on resize)
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 5000);
    camera.position.set(0, 0, 360);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.5;

    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Globe base (white)
    const RADIUS = 120;
    const globeGeom = new THREE.SphereGeometry(RADIUS, 128, 96);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Dots
    const dotsGroup = new THREE.Group();
    scene.add(dotsGroup);

    const DOT_COLOR = new THREE.Color('#8d948a');
    const DOT_RADIUS = RADIUS + 1.2;
    const DOT_SIZE = 0.35;

    const STEP = 1;
    const THRESHOLD = 70;

    let disposed = false;

    const buildDots = async () => {
      // Clear old dots
      while (dotsGroup.children.length) dotsGroup.remove(dotsGroup.children[0]);

      const img = new Image();
      img.src = '/globe-map.png';
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load /globe-map.png'));
      });

      if (disposed) return;

      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;

      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, c.width, c.height);
      const data = imageData.data;
      const w = imageData.width;
      const h = imageData.height;

      const positions: number[] = [];
      const colors: number[] = [];

      for (let y = 0; y < h; y += STEP) {
        for (let x = 0; x < w; x += STEP) {
          const idx = (y * w + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const a = data[idx + 3];

          if (a < 10) continue;

          const brightness = (r + g + b) / 3;
          if (brightness >= THRESHOLD) continue;

          const u = x / w;
          const v = y / h;

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

    // Resize logic
    const setSize = (w: number, h: number) => {
      if (w <= 0 || h <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    // Observe container size
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      // Prefer borderBoxSize when available, fall back to contentRect
      const box = (entry as any).borderBoxSize?.[0];
      const nextW = Math.round(box?.inlineSize ?? entry.contentRect.width);
      const nextH = Math.round(box?.blockSize ?? entry.contentRect.height);

      setSize(nextW, nextH);
    });

    ro.observe(container);

    // Initial size (covers first paint)
    const initialW = Math.round(width ?? container.clientWidth);
    const initialH = Math.round(height ?? container.clientHeight);
    setSize(initialW, initialH);

    buildDots().catch(() => {});

    const animate = () => {
      controls.update();
      globeMesh.rotation.y += 0.0012;
      dotsGroup.rotation.y += 0.0012;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      disposed = true;

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
  }, [width, height, maxDpr]);

  /**
   * IMPORTANT:
   * - If parent gives a size (recommended), this fills it.
   * - If parent does not size it, you can pass width/height as a fallback.
   */
  return (
    <div
      ref={containerRef}
      style={{
        width: width ?? '100%',
        height: height ?? '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
