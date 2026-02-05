"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let particles: THREE.Group;
    let animationFrameId: number;

    // Scene setup
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

      // Lighting
      const pointLight = new THREE.PointLight(0xffffff, 10, 200);
      pointLight.position.set(-50, 0, 60);
      scene.add(pointLight);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.5));

      // Base sphere
      const baseSphere = new THREE.SphereGeometry(19.5, 35, 35);
      const baseMaterial = new THREE.MeshBasicMaterial({
        color: 0xf5f5f5,
        transparent: false,
        side: THREE.BackSide,
      });
      const baseMesh = new THREE.Mesh(baseSphere, baseMaterial);
      scene.add(baseMesh);

      // Create particles group
      particles = new THREE.Group();
      scene.add(particles);

      // Load map and create dots
      createGlobe();
    };

    const createGlobe = () => {
      const dotSphereRadius = 20;
      const allDotMeshes: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>[] = [];

      const calcPosFromLatLonRad = (lon: number, lat: number): THREE.Vector3 => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);

        const x = -(dotSphereRadius * Math.sin(phi) * Math.cos(theta));
        const z = dotSphereRadius * Math.sin(phi) * Math.sin(theta);
        const y = dotSphereRadius * Math.cos(phi);

        return new THREE.Vector3(x, y, z);
      };

      const createDotsFromMap = () => {
        const image = new Image();
        image.crossOrigin = "anonymous";

        image.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;

          const context = canvas.getContext("2d");
          if (!context) return;

          context.drawImage(image, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

          // Process image data to find land masses
          const activeLatLon: { [key: number]: number[] } = {};

          for (let i = 0, lon = -180, lat = 90; i < imageData.data.length; i += 4, lon++) {
            if (!activeLatLon[lat]) activeLatLon[lat] = [];

            const red = imageData.data[i];
            const green = imageData.data[i + 1];
            const blue = imageData.data[i + 2];

            if (red < 80 && green < 80 && blue < 80) activeLatLon[lat].push(lon);

            if (lon === 180) {
              lon = -180;
              lat--;
            }
          }

          // Create dots based on map
          for (let lat = 90; lat > -90; lat--) {
            const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
            const circumference = radius * Math.PI * 2;

            for (let x = 0; x < circumference * 2.5; x++) {
              const long = -180 + (x * 360) / (circumference * 2.5);

              // Check if this coordinate should have a dot
              if (!activeLatLon[lat] || !activeLatLon[lat].length) continue;

              const closest = activeLatLon[lat].reduce((prev, curr) => {
                return Math.abs(curr - long) < Math.abs(prev - long) ? curr : prev;
              });

              if (Math.abs(long - closest) >= 0.5) continue;

              const vector = calcPosFromLatLonRad(long, lat);

              const dotGeometry = new THREE.CircleGeometry(0.12, 8);
              const material = new THREE.MeshBasicMaterial({
                color: 0xa1a69d,
                side: THREE.DoubleSide,
              });

              const mesh = new THREE.Mesh(dotGeometry, material);
              mesh.position.copy(vector);
              mesh.lookAt(new THREE.Vector3(0, 0, 0));
              particles.add(mesh);
              allDotMeshes.push(mesh);
            }
          }

          // Add Pacific islands manually
          const pacificIslands = [
            // Hawaii chain
            { lat: 22.0, lon: -159.5, latSize: 0.08, lonSize: 0.12 },
            { lat: 21.5, lon: -158.0, latSize: 0.1, lonSize: 0.15 },
            { lat: 21.0, lon: -157.0, latSize: 0.05, lonSize: 0.1 },
            { lat: 20.8, lon: -156.3, latSize: 0.1, lonSize: 0.12 },
            { lat: 19.7, lon: -155.5, latSize: 0.15, lonSize: 0.2 },
            // Other Pacific islands
            { lat: -17.7, lon: -149.4, latSize: 0.12, lonSize: 0.12 },
            { lat: -18.1, lon: 178.4, latSize: 0.15, lonSize: 0.15 },
            { lat: 7.5, lon: 134.6, latSize: 0.1, lonSize: 0.1 },
            { lat: -13.8, lon: -171.8, latSize: 0.1, lonSize: 0.1 },
            { lat: -21.2, lon: -159.8, latSize: 0.08, lonSize: 0.08 },
            { lat: 13.4, lon: 144.8, latSize: 0.08, lonSize: 0.08 },
          ];

          pacificIslands.forEach((island) => {
            for (
              let lat = island.lat - island.latSize;
              lat <= island.lat + island.latSize;
              lat += 0.15
            ) {
              for (
                let lon = island.lon - island.lonSize;
                lon <= island.lon + island.lonSize;
                lon += 0.15
              ) {
                const vector = calcPosFromLatLonRad(lon, lat);

                const dotGeometry = new THREE.CircleGeometry(0.12, 8);
                const material = new THREE.MeshBasicMaterial({
                  color: 0xa1a69d,
                  side: THREE.DoubleSide,
                });

                const mesh = new THREE.Mesh(dotGeometry, material);
                mesh.position.copy(vector);
                mesh.lookAt(new THREE.Vector3(0, 0, 0));
                particles.add(mesh);
                allDotMeshes.push(mesh);
              }
            }
          });

          // Initialize glow system
          initGlowSystem(allDotMeshes, calcPosFromLatLonRad);
        };

        // World map data (base64 encoded)
        image.src =
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCgRXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAExAAIAAAATAAAAZodpAAQAAAABAAAAegAAAAAAAABIAAAAAQAAAEgAAAABUGl4ZWxtYXRvciBQcm8gMi4zAAAAAqACAAQAAAABAAABaKADAAQAAAABAAAAtAAAAAD/4QmcaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNC0wNS0wOVQwNjozNToxMysxMjowMCIgeG1wOkNyZWF0b3JUb29sPSJQaXhlbG1hdG9yIFBybyAyLjMiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+AP/tADhQaG90b3Nob3AgMy4wADhCSU0EBAAAAAAAADhCSU0EJQAAAAAAENQdjNmPALIE6YAJmOz4Qn7/wAARCAC0AWgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwABAQEBAQECAQECAgICAgIDAgICAgMEAwMDAwMEBQQEBAQEBAUFBQUFBQUFBgYGBgYGBgYGBgYHBwcHBwcHBwcH/9sAQwEBAQECAgIDAgIDCAUEBQgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgI/90ABAAX/9oADAMBAAIRAxEAPwD+/iivO/DvxZ+HHi2AXXhrV7S9hfZ5U8DFopfMzt8p8bZM4I+Qtzx1rq5fEOiwzT281zGjWv8Ax8B8gJ8nmZJPH3eT6DrQBs0VXtLu0v7aO9sZY5oZVDxSxMHR1PQqw4IPqKsUAFFFFABRVe7u7SwtZb6/ljgghjaWaaZgiRogyzMzYAAAySTgCvxr/aA/4LCaN8M/ElzoPwW+HOrfE63tpGtn1fwzr+hG2Nxg7EST7Y9xIWYBcJEXJYAKc0Afs5RX8zqf8FwPjNqfxYlntfh9r1j4Y0eaJ9Y8FzeCvE1x43u4JCqn7EqW62GULh2Ly8RgkAnAr2r9o/8Abm/bPvb2T4s/sn2WsP4RisFkbw7rnw+1C8vXELlbiSRxe2FzbSFcmJGidXCkhuQKAP34rivE3xJ+HXguJLjxjr+i6THK4jjfU76C1V3bOFUyuoJODgDk4r+H/wDbU/aP+Mv7d3i7wLol943+OPw08PXFne6TbXvhOfVfGGoWuu6ZBHLqOnTyQ2epb5PMFuxnt5SuxNuTlv5p/wBpL9j3x1+0T4dj+MGi+JvGniDxHc6hfWt5ceM vCx8OTX4tZiqXCfZIZDqM0ofLP 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";
      };

      createDotsFromMap();

      // Auto-rotation
      let autoRotateSpeed = 0.002;
      const animate = () => {
        particles.rotation.y += autoRotateSpeed;
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    };

    const initGlowSystem = (
      allDotMeshes: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>[],
      calcPosFromLatLonRad: (lon: number, lat: number) => THREE.Vector3
    ) => {
      let currentGlowIndex = 0;
      let currentGlowDot: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial> | null = null;
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

      const originalDotProperties = new Map<
        THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial>,
        { color: number; scale: number }
      >();

      const findClosestDot = (targetLat: number, targetLon: number) => {
        let closestDot: THREE.Mesh<THREE.CircleGeometry, THREE.MeshBasicMaterial> | null = null;
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
            color: dotMesh.material.color.getHex(),
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
          currentGlowDot.material.color.lerpColors(startColor, endColor, progress);

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
          currentGlowDot.material.color.lerpColors(startColor, endColor, progress);

          const startScale = original.scale * 3;
          currentGlowDot.scale.setScalar(
            startScale + (original.scale - startScale) * progress
          );

          if (elapsed >= GLOW_FADE_OUT) {
            currentGlowDot.material.color.setHex(original.color);
            currentGlowDot.scale.setScalar(original.scale);
            currentGlowDot = null;
            moveToNextCity();
          }
        }
      };

      // Start first glow
      setTimeout(() => startNextGlow(), 100);

      // Animation loop for glows
      const animateGlows = () => {
        updateGlows();
        requestAnimationFrame(animateGlows);
      };
      animateGlows();
    };

    // Animation loop
    const render = () => {
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Handle resize
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

    setupScene();
    render();

    window.addEventListener("resize", handleResize);

    // Cleanup
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
