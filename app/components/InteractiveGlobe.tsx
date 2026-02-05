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

      // White background lighting
      const pointLight = new THREE.PointLight(0xffffff, 10, 200);
      pointLight.position.set(-50, 0, 60);
      scene.add(pointLight);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.5));

      // Controls
      controls = new OrbitControls(camera, renderer.domElement);
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.8;
      controls.enableDamping = true;
      controls.enableRotate = true;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minPolarAngle = (Math.PI / 2) - 0.5;
      controls.maxPolarAngle = (Math.PI / 2) + 0.5;

      // Base sphere
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

          if (red < 80 && green < 80 && blue < 80)
            activeLatLon[lat].push(lon);

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

        // Manually add Pacific islands
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
      image.onload = () => {
        const imageCanvas = document.createElement('canvas');
        imageCanvas.width = image.width;
        imageCanvas.height = image.height;

        const context = imageCanvas.getContext('2d');
        if (!context) return;

        context.drawImage(image, 0, 0);

        const imageData = context.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
        readImageData(imageData.data);

        setDots();
        initGlowSystem(calcPosFromLatLonRad);
      };

      image.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCgRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAAATAAAAZodpAAQAAAABAAAAegAAAAAAAABIAAAAAQAAAEgAAAABUGl4ZWxtYXRvciBQcm8gMi4zAAAAAqACAAQAAAABAAABaKADAAQAAAABAAAAtAAAAAD/4QmcaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0wOVQwNjozNToxMysxMjowMCIgeG1wOkNyZWF0b3JUb29sPSJQaXhlbG1hdG9yIFBybyAyLjMiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/wAARCAC0AWgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwABAQEBAQECAQECAgICAgIDAgICAgMEAwMDAwMEBQQEBAQEBAUFBQUFBQUFBgYGBgYGBgYGBgYHBwcHBwcHBwcH/9sAQwEBAQECAgIDAgIDCAUEBQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI/90ABAAX/9oADAMBAAIRAxEAPwD+/iivO/DvxZ+HHi2AXXhrV7S9hfZ5U8DFopfMzt8pmNsYI+Qtzx1rq5fEOiwzT281zGjWv/HwHyAnyeZkkff5PpQBs0VXtLu0v7aO9sZY5oZVDxSxMHR1PUqw4IPqKsUAFFFFABRVe7u7SwtZb6/ljgghjaWaaZgiRogyzMzYAAAySTgCvxr/AOCgn7Hnx+/bh/aI1j4yfsm+Bv+EpSHwnY+G28O6HY3OqvZ6hHe3F1BqX2LS4J5o5pIIYSrzRRrB5rhN7vIof++KKAPiL/hmX/goX/0aX/5kz4d//OCoqn8IP2Nv+CiPgv8AaK0f9ojx5+xN/Y/ibwzb6TbeFvt3xW8F6pfSaNDfxXM1jdXD+IEe6jkaKP57kiR41VXaRAqsv7K0UAf5RH/B4Bqf7TWq/wDBR3w1F+0DLc3ehf8ACKNBX9lrS43t5U+G7I08eoQxSW7x3GlxzxAW9sjwSfaBcXUyySMJGr+SWv72/wDgux/wQv8A2rP+ClP7c83x//Zh+EXhbX7O7+Gel+Dr3SfFWstpOr3ek2kMgs7l47TTri3eRZJXQRebucKGy2Ca/gd+KX7Nf7Qv7O1/a6T8e/hz418DXN7aG/sYvGGi3WjvcW6tsDNHdxxv8r7k+6eVb0JoA8Jooorg5fHc9l+0tY/AdX0+WCbS9U1gT/Z5C0gtliEe1HyQPtB/ugZH8lAH/9P+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Z';
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

      const findClosestDot = (targetLat: number, targetLon: number) => {
        let closestDot: THREE.Mesh | null = null;
        let minDistance = Infinity;

        allDotMeshes.forEach((dotMesh) => {
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
          originalDotProperties.set(dotMesh, {
            color: (dotMesh.material as THREE.MeshBasicMaterial).color.getHex(),
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
