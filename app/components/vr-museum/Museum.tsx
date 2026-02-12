'use client';

import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { useMuseumScene } from './MuseumSceneContext';

// Target room dimensions — used by ArtworkFrame for placement and Controls for bounds.
export const ROOM_W = 14;
/** Approximate ceiling height in world units — used to filter roof from ground raycasts */
export const ROOM_H = 4.2;
export const ROOM_D = 28;

export default function Museum() {
  const { museumGroupRef } = useMuseumScene();
  const { scene } = useGLTF('/models/museum.glb');

  // Compute scale & offset to fit the GLB into our target room dimensions.
  // The GLB may be at an arbitrary position/scale (e.g. centered at z=-500, ~100 units wide).
  const { scale, offset } = useMemo(() => {
    // Force world matrix update before computing bounds
    scene.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Try to find the floor surface to align y=0 properly.
    // The GLB node hierarchy names the floor node "Floor_*".
    let floorTopY = box.min.y; // fallback to bottom of overall bounds
    scene.traverse((child) => {
      if (child.name.toLowerCase().includes('floor')) {
        const floorBox = new THREE.Box3().setFromObject(child);
        if (floorBox.max.y > floorTopY) {
          floorTopY = floorBox.max.y;
        }
      }
    });

    // Uniform scale based on width so proportions are preserved
    const s = ROOM_W / size.x;

    // Reposition so floor surface sits at y=0, centered at x=0 and z=0
    const off = new THREE.Vector3(
      -center.x * s,
      -floorTopY * s,
      -center.z * s
    );

    return { scale: s, offset: off };
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Tone down PBR materials so IBL doesn't make walls look like chrome
        const mat = child.material;
        if (mat instanceof THREE.MeshStandardMaterial) {
          mat.roughness = Math.max(mat.roughness, 0.85);
          mat.metalness = Math.min(mat.metalness, 0.02);
          mat.envMapIntensity = 0.25;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <group ref={museumGroupRef} position={[offset.x, offset.y, offset.z]} scale={[scale, scale, scale]}>
        <primitive object={scene} />
      </group>
    </RigidBody>
  );
}

useGLTF.preload('/models/museum.glb');
