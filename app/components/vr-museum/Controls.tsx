'use client';

import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider, RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';

const MIN_PITCH = -0.55;
const MAX_PITCH = 0.45;
const MOVE_SPEED = 5; // m/s
const EYE_HEIGHT = 0.8; // eye level above floor surface

// Capsule collider dimensions
const HALF_HEIGHT = 0.4;  // half the cylinder portion
const RADIUS = 0.3;       // capsule radius

// Spawn position
const SPAWN_X = -1.5;
const SPAWN_Y = 1.5;
const SPAWN_Z = 2.6;

// Pre-allocate to avoid GC pressure in useFrame
const _forward = new THREE.Vector3();
const _right = new THREE.Vector3();

/**
 * First-person controller using direct camera movement (no physics).
 * - Mouse drag to look
 * - WASD to move
 * - Scroll wheel for forward impulse
 * - E key for interaction
 */
export default function Controls() {
  const { gl, camera, scene } = useThree();

  const floorY = useRef(0); // current floor height beneath player (first floor at Y=0)
  const isInitialized = useRef(false); // prevent floor snapping during spawn
  const rigidBodyRef = useRef<RapierRigidBody>(null);

  const state = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    yaw: 0,
    pitch: 0,
    keys: new Set<string>(),
    scrollImpulse: 0,
  });

  // Input event listeners
  useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;

    canvas.style.cursor = 'grab';

    function onPointerDown(e: PointerEvent) {
      s.isDragging = true;
      s.lastX = e.clientX;
      s.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      if (e.pointerType !== 'touch') canvas.style.cursor = 'grabbing';
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
      if (e.pointerType !== 'touch') canvas.style.cursor = 'grab';
    }

    function onWheel(e: WheelEvent) {
      s.scrollImpulse += e.deltaY * 0.015;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;

      if (e.code === 'KeyE') {
        const raycaster = new THREE.Raycaster();
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
  }, [gl.domElement, camera, scene]);

  // Set initial camera position
  useEffect(() => {
    camera.position.set(SPAWN_X, -1.4, SPAWN_Z);
  }, [camera]);

  useFrame((_, delta) => {
    const s = state.current;

    // Look rotation
    (camera as THREE.PerspectiveCamera).rotation.order = 'YXZ';
    camera.rotation.y = s.yaw;
    camera.rotation.x = s.pitch;

    // Desired XZ movement from WASD
    _forward.set(-Math.sin(s.yaw), 0, -Math.cos(s.yaw));
    _right.set(Math.cos(s.yaw), 0, -Math.sin(s.yaw));

    let vx = 0;
    let vz = 0;

    if (s.keys.has('keyw') || s.keys.has('arrowup'))    { vx += _forward.x; vz += _forward.z; }
    if (s.keys.has('keys') || s.keys.has('arrowdown'))  { vx -= _forward.x; vz -= _forward.z; }
    if (s.keys.has('keya') || s.keys.has('arrowleft'))  { vx -= _right.x;   vz -= _right.z;   }
    if (s.keys.has('keyd') || s.keys.has('arrowright')) { vx += _right.x;   vz += _right.z;   }

    // Enable floor detection after first movement input
    if ((vx !== 0 || vz !== 0) && !isInitialized.current) {
      // Initialize floor to current position to prevent snapping to wrong floor
      floorY.current = camera.position.y - EYE_HEIGHT;
      isInitialized.current = true;
    }

    const len = Math.sqrt(vx * vx + vz * vz);
    if (len > 0) { vx = (vx / len) * MOVE_SPEED; vz = (vz / len) * MOVE_SPEED; }

    // Scroll impulse
    if (Math.abs(s.scrollImpulse) > 0.01) {
      vx += _forward.x * s.scrollImpulse;
      vz += _forward.z * s.scrollImpulse;
      s.scrollImpulse *= 0.85;
    } else {
      s.scrollImpulse = 0;
    }

    // Check for walls, objects, and edges before moving
    let canMove = true;
    if (vx !== 0 || vz !== 0) {
      const moveDir = new THREE.Vector3(vx, 0, vz).normalize();

      // Check for walls at eye level
      const wallRay = new THREE.Raycaster(camera.position, moveDir);
      const wallHits = wallRay.intersectObjects(scene.children, true);
      if (wallHits.length > 0 && wallHits[0].distance < 0.5) {
        canMove = false;
      }

      // Check for objects at floor level (prevent walking over objects)
      if (canMove) {
        const floorLevelRay = new THREE.Raycaster(
          new THREE.Vector3(camera.position.x, floorY.current + 0.3, camera.position.z),
          moveDir
        );
        const floorLevelHits = floorLevelRay.intersectObjects(scene.children, true);
        if (floorLevelHits.length > 0 && floorLevelHits[0].distance < 0.5) {
          canMove = false;
        }
      }

      // Check for floor below destination position (prevent walking off edges/railings)
      if (canMove) {
        const destX = camera.position.x + vx * delta;
        const destZ = camera.position.z + vz * delta;
        const edgeCheckRay = new THREE.Raycaster(
          new THREE.Vector3(destX, camera.position.y + 2, destZ),
          new THREE.Vector3(0, -1, 0)
        );
        const edgeHits = edgeCheckRay.intersectObjects(scene.children, true);

        // Verify there's a floor below within reasonable distance
        let hasFloorBelow = false;
        for (const hit of edgeHits) {
          // Floor must be within 0.5m above to 3m below current position
          if (hit.point.y > floorY.current - 0.5 && hit.point.y < camera.position.y + 0.5) {
            hasFloorBelow = true;
            break;
          }
        }

        if (!hasFloorBelow) {
          canMove = false; // Block movement at edges
        }
      }
    }

    // Apply movement if no wall blocking
    if (canMove) {
      camera.position.x += vx * delta;
      camera.position.z += vz * delta;
    }

    // Only snap to floor after initialization to prevent spawning on wrong floor
    if (isInitialized.current) {
      // Cast ray downward from camera to find floor (not walls/ceiling)
      const rayOrigin = new THREE.Vector3(
        camera.position.x,
        camera.position.y + 2, // start ray above current camera position
        camera.position.z
      );
      const raycaster = new THREE.Raycaster(rayOrigin, new THREE.Vector3(0, -1, 0));
      const hits = raycaster.intersectObjects(scene.children, true);

      // Find first surface below the camera that's near current floor level
      // This prevents glitching to other floors when touching railings
      for (const hit of hits) {
        if (hit.point.y < camera.position.y - 0.5) {
          // Only update floor if new surface is within 1m of current floor
          // Tight tolerance prevents accidental jumps between floors
          if (Math.abs(hit.point.y - floorY.current) < 1.0) {
            floorY.current = hit.point.y;
            break;
          }
        }
      }

      camera.position.y = floorY.current + EYE_HEIGHT - 0.0001;
    }

    // Sync RigidBody to camera position (body centered at camera Y, since body extends above/below)
    if (rigidBodyRef.current) {
      rigidBodyRef.current.setNextKinematicTranslation({
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      });
    }
  });

  // RigidBody for future physics interactions (currently visualization only)
  // Collision detection uses Three.js raycasts for reliability
  return (
    <RigidBody
      ref={rigidBodyRef}
      type="kinematicPosition"
      position={[SPAWN_X, SPAWN_Y, SPAWN_Z]}
      colliders={false}
    >
      <CapsuleCollider args={[HALF_HEIGHT, RADIUS]} />
    </RigidBody>
  );
}
