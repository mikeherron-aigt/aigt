// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function InteractiveGlobe() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene;
    let camera;
    let renderer;
    let particles;
    let animationFrameId;

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
        antialias: true,
        alpha: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(sizes.width, sizes.height);
      container.appendChild(renderer.domElement);

      const pointLight = new THREE.PointLight(0xffffff, 10, 200);
      pointLight.position.set(-50, 0, 60);
      scene.add(pointLight);
      scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.5));

      const baseSphere = new THREE.SphereGeometry(19.5, 35, 35);
      const baseMaterial = new THREE.MeshBasicMaterial({
        color: 0xf5f5f5,
        transparent: false,
        side: THREE.BackSide,
      });
      const baseMesh = new THREE.Mesh(baseSphere, baseMaterial);
      scene.add(baseMesh);

      particles = new THREE.Group();
      scene.add(particles);

      createGlobe();
    };

    const createGlobe = () => {
      const dotSphereRadius = 20;
      const allDotMeshes = [];

      const calcPosFromLatLonRad = (lon, lat) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const x = -(dotSphereRadius * Math.sin(phi) * Math.cos(theta));
        const z = dotSphereRadius * Math.sin(phi) * Math.sin(theta);
        const y = dotSphereRadius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
      };

      // Function to check if a point is on land (simplified continent shapes)
      const isLand = (lat, lon) => {
        // North America
        if (lat >= 15 && lat <= 70 && lon >= -170 && lon <= -50) {
          if (lat < 25 && lon > -90) return false; // Gulf of Mexico
          return true;
        }
        
        // South America
        if (lat >= -55 && lat <= 12 && lon >= -81 && lon <= -34) {
          return true;
        }
        
        // Europe
        if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 40) {
          return true;
        }
        
        // Africa
        if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
          if (lat > 30 && lon < 0) return false; // Mediterranean
          return true;
        }
        
        // Asia (main body)
        if (lat >= 10 && lat <= 75 && lon >= 40 && lon <= 180) {
          return true;
        }
        
        // Southeast Asia
        if (lat >= -10 && lat <= 25 && lon >= 95 && lon <= 140) {
          return true;
        }
        
        // Australia
        if (lat >= -44 && lat <= -10 && lon >= 110 && lon <= 155) {
          return true;
        }
        
        return false;
      };

      // Create dots with proper spacing
      for (let lat = 90; lat >= -90; lat -= 1.2) {
        const radius = Math.cos(Math.abs(lat) * (Math.PI / 180)) * dotSphereRadius;
        const circumference = radius * Math.PI * 2;
        const numDotsAtLat = Math.max(3, Math.floor(circumference * 3));

        for (let i = 0; i < numDotsAtLat; i++) {
          const lon = -180 + (i / numDotsAtLat) * 360;

          if (!isLand(lat, lon)) continue;

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

      console.log(`Created ${allDotMeshes.length} dots`);

      initGlowSystem(allDotMeshes, calcPosFromLatLonRad);

      // Auto-rotation
      let autoRotateSpeed = 0.002;
      const animate = () => {
        particles.rotation.y += autoRotateSpeed;
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    };

    const initGlowSystem = (allDotMeshes, calcPosFromLatLonRad) => {
      let currentGlowIndex = 0;
      let currentGlowDot = null;
      let glowState = "idle";
      let glowPhaseStart = 0;
      const GLOW_FADE_IN = 1500;
      const GLOW_HOLD = 1000;
      const GLOW_FADE_OUT = 1500;

      const citySequence = [
        { lat: 40.7, lon: -74.0, name: "New York" },
        { lat: 41.9, lon: -87.6, name: "Chicago" },
        { lat: 34.0, lon: -118.2, name: "Los Angeles" },
        { lat: 35.7, lon: 139.7, name: "Tokyo" },
        { lat: 31.2, lon: 121.5, name: "Shanghai" },
        { lat: 28.6, lon: 77.2, name: "Delhi" },
        { lat: 30.0, lon: 31.2, name: "Cairo" },
        { lat: 41.9, lon: 12.5, name: "Rome" },
        { lat: 48.8, lon: 2.3, name: "Paris" },
        { lat: 51.5, lon: -0.1, name: "London" },
      ];

      const originalDotProperties = new Map();

      const findClosestDot = (targetLat, targetLon) => {
        let closestDot = null;
        let minDistance = Infinity;

        allDotMeshes.forEach((dotMesh) => {
          const targetPos = calcPosFromLatLonRad(targetLon, targetLat);
          const distance = dotMesh.position.distanceTo(targetPos);
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
          currentGlowDot.scale.setScalar(original.scale + (targetScale - original.scale) * progress);

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
          currentGlowDot.scale.setScalar(startScale + (original.scale - startScale) * progress);

          if (elapsed >= GLOW_FADE_OUT) {
            currentGlowDot.material.color.setHex(original.color);
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

    const render = () => {
      if (renderer && scene && camera) {
        renderer.render(scene, camera);
        animationFrameId = requestAnimationFrame(render);
      }
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
