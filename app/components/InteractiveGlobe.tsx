// app/components/InteractiveGlobe.tsx
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

type DotMesh = THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>;

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Scene setup
    const scene = new THREE.Scene();

    const sizes = {
      width: container.clientWidth,
      height: container.clientHeight,
    };

    const camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 1, 1000);
    camera.position.z = window.innerWidth > 700 ? 100 : 140;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);

    // Lighting to match your white background feel
    const pointLight = new THREE.PointLight(0xffffff, 10, 200);
    pointLight.position.set(-50, 0, 60);
    scene.add(pointLight);
    scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.5));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 2 - 0.5;
    controls.maxPolarAngle = Math.PI / 2 + 0.5;

    // Base sphere (inside-out)
    const baseSphere = new THREE.SphereGeometry(19.5, 35, 35);
    const baseMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5f5f5,
      transparent: false,
      side: THREE.BackSide,
    });
    const baseMesh = new THREE.Mesh(baseSphere, baseMaterial);
    scene.add(baseMesh);

    // Dots
    const dotSphereRadius = 20;
    const allDotMeshes: DotMesh[] = [];
    const dotGeometry = new THREE.CircleGeometry(0.12, 8);

    const makeDot = (pos: THREE.Vector3) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xa1a69d, // sage
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(dotGeometry, material) as DotMesh;
      mesh.position.copy(pos);
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      scene.add(mesh);
      allDotMeshes.push(mesh);
    };

    const calcPosFromLatLonRad = (lon: number, lat: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);

      const x = -(dotSphereRadius * Math.sin(phi) * Math.cos(theta));
      const z = dotSphereRadius * Math.sin(phi) * Math.sin(theta);
      const y = dotSphereRadius * Math.cos(phi);

      return new THREE.Vector3(x, y, z);
    };

    // Read map pixels, decide where dots exist
    const activeLatLon: Record<number, number[]> = {};

    const readImageData = (data: Uint8ClampedArray) => {
      for (let i = 0, lon = -180, lat = 90; i < data.length; i += 4, lon++) {
        if (!activeLatLon[lat]) activeLatLon[lat] = [];

        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // “land” threshold (dark pixels)
        if (r < 80 && g < 80 && b < 80) activeLatLon[lat].push(lon);

        if (lon === 180) {
          lon = -180;
          lat--;
        }
      }
    };

    const visibilityForCoordinate = (lon: number, lat: number) => {
      const row = activeLatLon[lat];
      if (!row || row.length === 0) return false;

      const closest = row.reduce((prev, curr) =>
        Math.abs(curr - lon) < Math.abs(prev - lon) ? curr : prev
      );

      return Math.abs(lon - closest) < 0.5;
    };

    const setDotsFromMap = () => {
      for (let lat = 90; lat > -90; lat--) {
        const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
        const circumference = radius * Math.PI * 2;

        for (let x = 0; x < circumference * 2.5; x++) {
          const lon = -180 + (x * 360) / (circumference * 2.5);
          if (!visibilityForCoordinate(lon, lat)) continue;
          makeDot(calcPosFromLatLonRad(lon, lat));
        }
      }

      // Small island helpers (same spirit as your HTML)
      const islands = [
        { lat: 22.0, lon: -159.5, latSize: 0.08, lonSize: 0.12 }, // Kauai
        { lat: 21.5, lon: -158.0, latSize: 0.1, lonSize: 0.15 },  // Oahu
        { lat: 20.8, lon: -156.3, latSize: 0.1, lonSize: 0.12 },  // Maui
        { lat: 19.7, lon: -155.5, latSize: 0.15, lonSize: 0.2 },  // Big Island
        { lat: -18.1, lon: 178.4, latSize: 0.15, lonSize: 0.15 }, // Fiji
        { lat: -17.7, lon: -149.4, latSize: 0.12, lonSize: 0.12 }, // Tahiti
      ];

      islands.forEach((island) => {
        for (let la = island.lat - island.latSize; la <= island.lat + island.latSize; la += 0.15) {
          for (let lo = island.lon - island.lonSize; lo <= island.lon + island.lonSize; lo += 0.15) {
            makeDot(calcPosFromLatLonRad(lo, la));
          }
        }
      });
    };

    // Glow system (city sequence) – runs on actual dots
    const citySequence = [
      { lat: 40.7, lon: -74.0 },  // NYC
      { lat: 41.9, lon: -87.6 },  // Chicago
      { lat: 34.0, lon: -118.2 }, // LA
      { lat: 21.3, lon: -157.8 }, // Honolulu
      { lat: 35.7, lon: 139.7 },  // Tokyo
      { lat: 31.2, lon: 121.5 },  // Shanghai
      { lat: 28.6, lon: 77.2 },   // Delhi
      { lat: 30.0, lon: 31.2 },   // Cairo
      { lat: 41.9, lon: 12.5 },   // Rome
      { lat: 48.8, lon: 2.3 },    // Paris
      { lat: 51.5, lon: -0.1 },   // London
    ];

    const original = new Map<DotMesh, { color: number; scale: number }>();

    let glowIndex = 0;
    let glowDot: DotMesh | null = null;
    let glowState: 'idle' | 'in' | 'hold' | 'out' = 'idle';
    let phaseStart = 0;

    const GLOW_FADE_IN = 1500;
    const GLOW_HOLD = 1000;
    const GLOW_FADE_OUT = 1500;

    const findClosestDot = (targetLat: number, targetLon: number) => {
      let closest: DotMesh | null = null;
      let min = Infinity;
      const targetPos = calcPosFromLatLonRad(targetLon, targetLat);

      for (const dot of allDotMeshes) {
        const d = dot.position.distanceTo(targetPos);
        if (d < min) {
          min = d;
          closest = dot;
        }
      }
      return closest;
    };

    const startNextGlow = () => {
      const city = citySequence[glowIndex];
      const dot = findClosestDot(city.lat, city.lon);
      glowIndex = (glowIndex + 1) % citySequence.length;

      if (!dot) return;

      if (!original.has(dot)) {
        original.set(dot, { color: dot.material.color.getHex(), scale: dot.scale.x });
      }

      glowDot = dot;
      glowState = 'in';
      phaseStart = Date.now();
    };

    const updateGlow = () => {
      if (!glowDot) return;

      const now = Date.now();
      const elapsed = now - phaseStart;
      const base = original.get(glowDot);
      if (!base) return;

      if (glowState === 'in') {
        const t = Math.min(elapsed / GLOW_FADE_IN, 1);
        glowDot.material.color.lerpColors(
          new THREE.Color(base.color),
          new THREE.Color(0x2d5016),
          t
        );
        const targetScale = base.scale * 3;
        glowDot.scale.setScalar(base.scale + (targetScale - base.scale) * t);

        if (t >= 1) {
          glowState = 'hold';
          phaseStart = now;
        }
      } else if (glowState === 'hold') {
        if (elapsed >= GLOW_HOLD) {
          glowState = 'out';
          phaseStart = now;
        }
      } else if (glowState === 'out') {
        const t = Math.min(elapsed / GLOW_FADE_OUT, 1);
        glowDot.material.color.lerpColors(
          new THREE.Color(0x2d5016),
          new THREE.Color(base.color),
          t
        );
        const startScale = base.scale * 3;
        glowDot.scale.setScalar(startScale + (base.scale - startScale) * t);

        if (t >= 1) {
          glowDot.material.color.setHex(base.color);
          glowDot.scale.setScalar(base.scale);
          glowDot = null;
          glowState = 'idle';
          setTimeout(startNextGlow, 500);
        }
      }
    };

    // Load the map image from /public
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, c.width, c.height);

      readImageData(imageData.data);
      setDotsFromMap();

      // start glow
      setTimeout(startNextGlow, 100);
    };
    img.src = '/globe-map.jpg';

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;

      camera.position.z = window.innerWidth > 700 ? 100 : 140;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', onResize);

    let raf = 0;
    const animate = () => {
      updateGlow();
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();

      // dispose meshes/materials we created
      for (const dot of allDotMeshes) {
        dot.geometry.dispose();
        dot.material.dispose();
        scene.remove(dot);
      }
      baseSphere.dispose();
      baseMaterial.dispose();
      scene.remove(baseMesh);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
