'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type Props = {
  width?: number;
  height?: number;
};

export default function InteractiveGlobe({ width = 1100, height = 1100 }: Props) {
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

    // Globe size
    const RADIUS = 120;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // Camera (fit globe to frame)
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 5000);

    // One knob that controls how big the globe appears in-frame
    const FIT = 1.2;

    const fovRad = THREE.MathUtils.degToRad(camera.fov);
    const fitHeightDistance = (RADIUS * FIT) / Math.tan(fovRad / 2);
    const fitWidthDistance =
      (RADIUS * FIT) / (Math.tan(fovRad / 2) * camera.aspect);

    camera.position.set(0, 0, Math.max(fitHeightDistance, fitWidthDistance));
    camera.lookAt(0, 0, 0);

    // Light
    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Ocean (sphere)
    const globeGeom = new THREE.SphereGeometry(RADIUS, 128, 96);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0xfafafa });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Dots
    const dotsGroup = new THREE.Group();
    scene.add(dotsGroup);

    const DOT_COLOR = new THREE.Color('#A1A69D');
    const DOT_RADIUS = RADIUS + 0.8; // close to surface, but avoids shimmer
    const DOT_SIZE = 1.8;

    // Performance knobs
    // If you want even smoother, set STEP to 3. Visual difference is small, perf gain is real.
    const STEP = 2;
    const THRESHOLD = 70;

    const buildDots = async () => {
      while (dotsGroup.children.length) dotsGroup.remove(dotsGroup.children[0]);

      const img = new Image();
      img.src = '/globe-map.png';
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load /globe-map.png'));
      });

      if (disposed) return;

      // Read pixels from a smaller working canvas (keeps things fast even if source is large)
      const workW = Math.min(img.width, 2048);
      const workH = Math.round((workW / img.width) * img.height);

      const c = document.createElement('canvas');
      c.width = workW;
      c.height = workH;

      const ctx = c.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, c.width, c.height);

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

          // IMPORTANT: Horizontal flip fix
          // Original: const u = x / w;
          // Flipped:  const u = 1 - x / w;
          const u = 1 - x / w;
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
        opacity: 1.0,
        depthTest: true,
        depthWrite: false,
        sizeAttenuation: true,
      });

      const points = new THREE.Points(geo, mat);
      dotsGroup.add(points);
    };

    buildDots().catch(() => {});

    // Controls (interactive + smooth)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enabled = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.enableZoom = false;

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.rotateSpeed = 0.45;

    // Smooth auto-rotate
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;

    // Important on touch devices / trackpads
    renderer.domElement.style.touchAction = 'none';

    // Pause auto-rotate while dragging
    controls.addEventListener('start', () => {
      controls.autoRotate = false;
    });
    controls.addEventListener('end', () => {
      controls.autoRotate = true;
    });

    const clock = new THREE.Clock();

    const animate = () => {
      if (disposed) return;

      // OrbitControls uses time-based rotation internally if you pass delta
      const delta = clock.getDelta();
      controls.update(delta);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      disposed = true;

      cancelAnimationFrame(raf);
      controls.dispose();

      globeGeom.dispose();
      globeMat.dispose();

      dotsGroup.traverse((obj) => {
        const anyObj = obj as any;
        if (anyObj.geometry?.dispose) anyObj.geometry.dispose();
        if (anyObj.material?.dispose) anyObj.material.dispose();
      });

      renderer.dispose();
      scene.clear();
    };
  }, [width, height]);

  return (
    <div ref={containerRef} style={{ width, height }}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
      />
    </div>
  );
}
