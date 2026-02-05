"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let controls: OrbitControls;
    let baseMesh: THREE.Mesh;
    let animationFrameId: number;
    let allDotMeshes: THREE.Mesh[] = [];

    const setupScene = () => {
      const container = containerRef.current;
      if (!container) return;

      const sizes = {
        width: container.offsetWidth,
        height: container.offsetHeight,
      };

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(30, sizes.width / sizes.height, 1, 1000);
      camera.position.z = window.innerWidth > 700 ? 100 : 140;

      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(sizes.width, sizes.height);
      container.appendChild(renderer.domElement);

      const pointLight = new THREE.PointLight(0xffffff, 10, 200);
      pointLight.position.set(-50, 0, 60);
      scene.add(pointLight);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.5));

      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableDamping = true;
      controls.enableRotate = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = (Math.PI / 2) - 0.5;
      controls.maxPolarAngle = (Math.PI / 2) + 0.5;

      const baseSphere = new THREE.SphereGeometry(19.5, 35, 35);
      const baseMaterial = new THREE.MeshBasicMaterial({
        color: 0xf5f5f5,
        transparent: false,
        side: THREE.BackSide,
      });
      baseMesh = new THREE.Mesh(baseSphere, baseMaterial);
      scene.add(baseMesh);

      createGlobe();
    };

    const createGlobe = () => {
      const dotSphereRadius = 20;
      const materials: THREE.Material[] = [];
      let activeLatLon: { [key: number]: number[] } = {};

      const readImageData = (imageData: Uint8ClampedArray) => {
        for (let i = 0, lon = -180, lat = 90; i < imageData.length; i += 4, lon++) {
          if (!activeLatLon[lat]) activeLatLon[lat] = [];

          const red = imageData[i];
          const green = imageData[i + 1];
          const blue = imageData[i + 2];

          // Detect teal continents specifically (teal has low red, high green/blue)
          // Teal is approximately RGB(70-100, 125-145, 115-135)
          // Beige background is approximately RGB(220-230, 210-220, 180-195)
          const isTeal = red < 150 && green > 110 && blue > 110 && (green + blue) > (red * 2);
          
          if (isTeal) {
            activeLatLon[lat].push(lon);
          }

          if (lon === 180) {
            lon = -180;
            lat--;
          }
        }
      };

      const visibilityForCoordinate = (lon: number, lat: number) => {
        let visible = false;

        if (!activeLatLon[lat] || !activeLatLon[lat].length) return visible;

        const closest = activeLatLon[lat].reduce((prev, curr) => {
          return (Math.abs(curr - lon) < Math.abs(prev - lon) ? curr : prev);
        });

        if (Math.abs(lon - closest) < 0.5) visible = true;

        return visible;
      };

      const calcPosFromLatLonRad = (lon: number, lat: number) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(dotSphereRadius * Math.sin(phi) * Math.cos(theta));
        const z = (dotSphereRadius * Math.sin(phi) * Math.sin(theta));
        const y = (dotSphereRadius * Math.cos(phi));

        return new THREE.Vector3(x, y, z);
      };

      const setDots = () => {
        let vector = new THREE.Vector3();

        for (let lat = 90; lat > -90; lat--) {
          const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
          const circumference = radius * Math.PI * 2;

          for (let x = 0; x < circumference * 2.5; x++) {
            const long = -180 + x * 360 / (circumference * 2.5);

            if (!visibilityForCoordinate(long, lat)) continue;

            vector = calcPosFromLatLonRad(long, lat);

            const dotGeometry = new THREE.CircleGeometry(0.12, 8);

            const material = new THREE.MeshBasicMaterial({
              color: 0xA1A69D,
              side: THREE.DoubleSide
            });
            material.needsUpdate = true;

            materials.push(material);
            const mesh = new THREE.Mesh(dotGeometry, material);
            mesh.position.copy(vector);
            mesh.lookAt(new THREE.Vector3(0, 0, 0));
            scene.add(mesh);
            allDotMeshes.push(mesh);
          }
        }

        const hawaiiIslands = [
          { lat: 22.0, lon: -159.5, latSize: 0.08, lonSize: 0.12 },
          { lat: 21.5, lon: -158.0, latSize: 0.10, lonSize: 0.15 },
          { lat: 21.0, lon: -157.0, latSize: 0.05, lonSize: 0.10 },
          { lat: 20.8, lon: -156.3, latSize: 0.10, lonSize: 0.12 },
          { lat: 19.7, lon: -155.5, latSize: 0.15, lonSize: 0.20 },
        ];

        hawaiiIslands.forEach(island => {
          for (let lat = island.lat - island.latSize; lat <= island.lat + island.latSize; lat += 0.15) {
            for (let lon = island.lon - island.lonSize; lon <= island.lon + island.lonSize; lon += 0.15) {
              vector = calcPosFromLatLonRad(lon, lat);
              const dotGeometry = new THREE.CircleGeometry(0.12, 8);
              const material = new THREE.MeshBasicMaterial({
                color: 0xA1A69D,
                side: THREE.DoubleSide
              });
              materials.push(material);
              const mesh = new THREE.Mesh(dotGeometry, material);
              mesh.position.copy(vector);
              mesh.lookAt(new THREE.Vector3(0, 0, 0));
              scene.add(mesh);
              allDotMeshes.push(mesh);
            }
          }
        });

        const otherPacificIslands = [
          { lat: -17.7, lon: -149.4, latSize: 0.12, lonSize: 0.12 },
          { lat: -18.1, lon: 178.4, latSize: 0.15, lonSize: 0.15 },
          { lat: 7.5, lon: 134.6, latSize: 0.10, lonSize: 0.10 },
          { lat: -13.8, lon: -171.8, latSize: 0.10, lonSize: 0.10 },
          { lat: -21.2, lon: -159.8, latSize: 0.08, lonSize: 0.08 },
          { lat: 13.4, lon: 144.8, latSize: 0.08, lonSize: 0.08 },
        ];

        otherPacificIslands.forEach(island => {
          for (let lat = island.lat - island.latSize; lat <= island.lat + island.latSize; lat += 0.15) {
            for (let lon = island.lon - island.lonSize; lon <= island.lon + island.lonSize; lon += 0.15) {
              vector = calcPosFromLatLonRad(lon, lat);
              const dotGeometry = new THREE.CircleGeometry(0.12, 8);
              const material = new THREE.MeshBasicMaterial({
                color: 0xA1A69D,
                side: THREE.DoubleSide
              });
              materials.push(material);
              const mesh = new THREE.Mesh(dotGeometry, material);
              mesh.position.copy(vector);
              mesh.lookAt(new THREE.Vector3(0, 0, 0));
              scene.add(mesh);
              allDotMeshes.push(mesh);
            }
          }
        });
      };

      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      image.onerror = () => {
        console.error('Failed to load world map image');
      };
      
      image.onload = () => {
        console.log('World map loaded, size:', image.width, 'x', image.height);
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;

        const context = imageCanvas.getContext('2d');
        if (!context) {
          console.error('Failed to get canvas context');
          return;
        }

        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        console.log('Processing image data...');
        readImageData(imageData.data);

        const latCount = Object.keys(activeLatLon).length;
        const totalCoords = Object.values(activeLatLon).reduce((sum, arr) => sum + arr.length, 0);
        console.log(`Found ${totalCoords} land coordinates across ${latCount} latitude lines`);

        setDots();
        console.log(`Created ${allDotMeshes.length} dots`);
        initGlowSystem(calcPosFromLatLonRad);
      };

      image.src = 'data:image/png;base64,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';
    };

    const initGlowSystem = (calcPosFromLatLonRad: (lon: number, lat: number) => THREE.Vector3) => {
      let currentGlowIndex = 0;
      let currentGlowDot: THREE.Mesh | null = null;
      let glowState: "idle" | "fading_in" | "holding" | "fading_out" = "idle";
      let glowPhaseStart = 0;
      const GLOW_FADE_IN = 1500;
      const GLOW_HOLD = 1000;
      const GLOW_FADE_OUT = 1500;

      const citySequence = [
        { lat: 40.7, lon: -74.0, name: "New York City" },
        { lat: 41.9, lon: -87.6, name: "Chicago" },
        { lat: 34.0, lon: -118.2, name: "Los Angeles" },
        { lat: 21.3, lon: -157.8, name: "Honolulu" },
        { lat: 35.7, lon: 139.7, name: "Tokyo" },
        { lat: 31.2, lon: 121.5, name: "Shanghai" },
        { lat: 28.6, lon: 77.2, name: "Delhi" },
        { lat: 30.0, lon: 31.2, name: "Cairo" },
        { lat: 41.9, lon: 12.5, name: "Rome" },
        { lat: 48.8, lon: 2.3, name: "Paris" },
        { lat: 51.5, lon: -0.1, name: "London" },
      ];

      const originalDotProperties = new Map<THREE.Mesh, { color: number; scale: number }>();

      const findClosestDot = (targetLat: number, targetLon: number): THREE.Mesh | null => {
        let closestDot: THREE.Mesh | null = null;
        let minDistance = Infinity;

        allDotMeshes.forEach((dotMesh: THREE.Mesh) => {
          const dotPos = dotMesh.position;
          const targetPos = calcPosFromLatLonRad(targetLon, targetLat);
          const distance = dotPos.distanceTo(targetPos);

          if (distance < minDistance) {
            minDistance = distance;
            closestDot = dotMesh;
          }
        });

        return closestDot;
      };

      const startNextGlow = () => {
        const city = citySequence[currentGlowIndex];
        const dotMesh = findClosestDot(city.lat, city.lon);

        if (!dotMesh) {
          moveToNextCity();
          return;
        }

        if (!originalDotProperties.has(dotMesh)) {
          const material = dotMesh.material as THREE.MeshBasicMaterial;
          originalDotProperties.set(dotMesh, {
            color: material.color.getHex(),
            scale: dotMesh.scale.x,
          });
        }

        currentGlowDot = dotMesh;
        glowState = "fading_in";
        glowPhaseStart = Date.now();
      };

      const moveToNextCity = () => {
        currentGlowIndex = (currentGlowIndex + 1) % citySequence.length;
        setTimeout(() => startNextGlow(), 500);
      };

      const updateGlows = () => {
        if (!currentGlowDot) return;

        const now = Date.now();
        const elapsed = now - glowPhaseStart;

        if (glowState === "fading_in") {
          const progress = Math.min(elapsed / GLOW_FADE_IN, 1);
          const original = originalDotProperties.get(currentGlowDot);
          if (!original) return;

          const startColor = new THREE.Color(original.color);
          const endColor = new THREE.Color(0x2d5016);
          (currentGlowDot.material as THREE.MeshBasicMaterial).color.lerpColors(
            startColor,
            endColor,
            progress
          );

          const targetScale = original.scale * 3;
          currentGlowDot.scale.setScalar(
            original.scale + (targetScale - original.scale) * progress
          );

          if (elapsed >= GLOW_FADE_IN) {
            glowState = "holding";
            glowPhaseStart = now;
          }
        } else if (glowState === "holding") {
          if (elapsed >= GLOW_HOLD) {
            glowState = "fading_out";
            glowPhaseStart = now;
          }
        } else if (glowState === "fading_out") {
          const progress = Math.min(elapsed / GLOW_FADE_OUT, 1);
          const original = originalDotProperties.get(currentGlowDot);
          if (!original) return;

          const startColor = new THREE.Color(0x2d5016);
          const endColor = new THREE.Color(original.color);
          (currentGlowDot.material as THREE.MeshBasicMaterial).color.lerpColors(
            startColor,
            endColor,
            progress
          );

          const startScale = original.scale * 3;
          currentGlowDot.scale.setScalar(
            startScale + (original.scale - startScale) * progress
          );

          if (elapsed >= GLOW_FADE_OUT) {
            (currentGlowDot.material as THREE.MeshBasicMaterial).color.setHex(
              original.color
            );
            currentGlowDot.scale.setScalar(original.scale);
            currentGlowDot = null;
            moveToNextCity();
          }
        }
      };

      setTimeout(() => startNextGlow(), 100);

      const animateGlows = () => {
        updateGlows();
        requestAnimationFrame(animateGlows);
      };
      animateGlows();
    };

    const handleResize = () => {
      if (!containerRef.current) return;

      const sizes = {
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      };

      camera.position.z = window.innerWidth > 700 ? 100 : 140;
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      renderer.setSize(sizes.width, sizes.height);
    };

    const render = () => {
      if (controls) controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    setupScene();
    render();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
