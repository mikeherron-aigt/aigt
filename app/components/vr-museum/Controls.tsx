'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROOM_W = 14;
const ROOM_D = 28;
const MIN_PITCH = -0.55;
const MAX_PITCH = 0.45;

// Pre-allocate vectors to avoid GC pressure in useFrame
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();

/**
 * Drag-to-look + scroll-to-move + WASD controls + E key interaction.
 * Mirrors the behaviour of the original vanilla Three.js implementation with keyboard additions.
 * Renders nothing — just wires up events and drives the camera each frame.
 */
export default function Controls() {
  const { gl, camera, raycaster, scene } = useThree();

  const state = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0,
    basePos: new THREE.Vector3(0, 1.55, 6.6),
    keys: new Set<string>(),
  });

  useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;

    canvas.style.cursor = 'grab';

    function onPointerDown(e: PointerEvent) {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      if (e.pointerType !== 'touch') {
        canvas.style.cursor = 'grabbing';
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!s.isDragging) return;
      const dx = e.clientX - s.lastX;
      const dy = e.clientY - s.lastY;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      s.yaw -= dx * 0.0032;
      s.pitch -= dy * 0.0032;
      s.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, s.pitch));
    }

    function onPointerUp(e: PointerEvent) {
      s.isDragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      if (e.pointerType !== 'touch') {
        canvas.style.cursor = 'grab';
      }
    }

    function onWheel(e: WheelEvent) {
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      const step = e.deltaY * 0.004;
      s.basePos.addScaledVector(forward, step);
      const margin = 0.9;
      s.basePos.x = THREE.MathUtils.clamp(s.basePos.x, -ROOM_W / 2 + margin, ROOM_W / 2 - margin);
      s.basePos.z = THREE.MathUtils.clamp(s.basePos.z, -ROOM_D / 2 + margin, ROOM_D / 2 - margin);
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return; // ignore key repeats

      // Handle E key for interaction (raycasting) - use physical key position
      if (e.code === 'KeyE') {
        raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
        const hits = raycaster.intersectObjects(scene.children, true);
        for (const hit of hits) {
          if (hit.object.userData.onInteract) {
            hit.object.userData.onInteract();
            break;
          }
        }
        return;
      }

      // Track WASD and arrow keys by physical position (works with Dvorak, etc.)
      s.keys.add(e.code.toLowerCase());
    }

    function onKeyUp(e: KeyboardEvent) {
      s.keys.delete(e.code.toLowerCase());
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel as EventListener);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [gl.domElement, camera, raycaster, scene]);

  useFrame(() => {
    const s = state.current;

    // Handle WASD movement - compute direction from yaw state
    if (s.keys.size > 0) {
      // Compute forward direction from yaw (rotation around Y axis)
      // In Three.js coordinate system:
      //   - Initial camera looks toward -Z (yaw=0)
      //   - Yaw increases counterclockwise (left turn)
      //   - Forward vector: (-sin(yaw), 0, -cos(yaw))
      //   - At yaw=0: (0, 0, -1) = toward -Z ✓
      //   - At yaw=π/2: (-1, 0, 0) = toward -X (left) ✓
      _forward.set(-Math.sin(s.yaw), 0, -Math.cos(s.yaw));
      _forward.normalize();

      // Right is 90° clockwise from forward (yaw - π/2)
      //   - At yaw=0: (1, 0, 0) = toward +X (right) ✓
      _right.set(-Math.sin(s.yaw - Math.PI / 2), 0, -Math.cos(s.yaw - Math.PI / 2));
      _right.normalize();

      const speed = 0.06; // m/frame
      const margin = 0.9;

      if (s.keys.has('keyw') || s.keys.has('arrowup')) {
        s.basePos.addScaledVector(_forward, speed);
      }
      if (s.keys.has('keys') || s.keys.has('arrowdown')) {
        s.basePos.addScaledVector(_forward, -speed);
      }
      if (s.keys.has('keya') || s.keys.has('arrowleft')) {
        s.basePos.addScaledVector(_right, -speed);
      }
      if (s.keys.has('keyd') || s.keys.has('arrowright')) {
        s.basePos.addScaledVector(_right, speed);
      }

      // Clamp to room bounds
      s.basePos.x = THREE.MathUtils.clamp(s.basePos.x, -ROOM_W / 2 + margin, ROOM_W / 2 - margin);
      s.basePos.z = THREE.MathUtils.clamp(s.basePos.z, -ROOM_D / 2 + margin, ROOM_D / 2 - margin);
    }

    // Update camera transform
    (camera as THREE.PerspectiveCamera).rotation.order = 'YXZ';
    camera.rotation.y = s.yaw;
    camera.rotation.x = s.pitch;
    camera.position.copy(s.basePos);
  });

  return null;
}
