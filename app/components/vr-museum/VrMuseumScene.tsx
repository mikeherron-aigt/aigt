'use client';

import { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Museum from './Museum';
import { ArtworkWalls } from './ArtworkFrame';
import Controls from './Controls';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';

/**
 * Dynamic key light that follows the camera, keeping shadows consistent
 * relative to the player's view while concentrating shadow map resolution
 * near their current position.
 */
function KeyLight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const { camera, scene } = useThree();
  const targetRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    const t = new THREE.Object3D();
    targetRef.current = t;
    scene.add(t);
    if (lightRef.current) lightRef.current.target = t;
    return () => { scene.remove(t); };
  }, [scene]);

  useFrame(() => {
    const l = lightRef.current, t = targetRef.current;
    if (!l || !t) return;

    // Get camera's forward direction (where user is looking)
    // This ensures shadows rotate with the user's view, not just translate with position
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    // Get right direction perpendicular to forward (90° clockwise from view)
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    // Position light to the upper-back-right relative to camera's view
    // This keeps shadows consistent from the user's perspective:
    //   - Always appears to come from upper-back-right of where you're looking
    //   - Creates natural-looking shadows that fall forward and to the left
    //   - Shadows stay in same relative position as you turn your head
    const lightOffset = new THREE.Vector3();
    lightOffset.addScaledVector(right, 5);      // 5m to the right of view direction
    lightOffset.addScaledVector(forward, 4);    // 4m behind view direction (positive = behind)
    lightOffset.y = 10;                         // 10m above ground (fixed height)

    l.position.copy(camera.position).add(lightOffset);

    // Target aims at floor beneath camera - shadows cast downward
    t.position.set(camera.position.x, 0, camera.position.z);
    t.updateMatrixWorld();

    // Update shadow frustum (though position/target changes should trigger this)
    l.shadow.camera.updateProjectionMatrix();
  });

  return (
    <directionalLight
      ref={lightRef}
      intensity={0.7}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-near={0.5}
      shadow-camera-far={30}
      shadow-camera-left={-10}
      shadow-camera-right={10}
      shadow-camera-top={10}
      shadow-camera-bottom={-10}
      shadow-bias={-0.0001}
    />
  );
}

interface VrMuseumSceneProps {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
}

/**
 * React Three Fiber scene root for the VR museum.
 * Mirrors all settings from the original vrMuseumScene.ts:
 * - ACES filmic tone mapping (room only — art planes use MeshBasicMaterial)
 * - PCFSoft shadow maps
 * - Same lighting rig (ambient, key directional, fill, rim point)
 * - Same fog
 */
export default function VrMuseumScene({ artworks, onArtworkClick }: VrMuseumSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 55,
        position: [0, 1.55, 6.6],
        near: 0.1,
        far: 120,
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
      }}
      shadows={{ type: THREE.PCFSoftShadowMap }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.setPixelRatio(Math.min(window.devicePixelRatio ?? 1, 2));
      }}
      style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
    >
      {/* Scene background + fog — warm off-white matches walls/ceiling */}
      <color attach="background" args={['#f0efeb']} />
      <fog attach="fog" args={['#f0efeb', 20, 52]} />

      {/* Lighting rig */}
      <ambientLight intensity={0.9} />

      {/* Key light — follows camera, casts dynamic shadows */}
      <KeyLight />

      {/* Fill light */}
      <directionalLight position={[-6, 6, -2]} intensity={0.15} />

      {/* Rim point light */}
      <pointLight position={[0, 3.8, 10]} intensity={0.35} distance={40} />

      {/* Hamptons sunshine — warm afternoon sun streaming through back windows */}
      {/* No shadow casting - shadows handled by dynamic KeyLight */}
      <directionalLight
        position={[-8, 10, -28]}
        intensity={1.5}
        color="#fff9e8"
      />

      {/* Ceiling track lights — warm halogen (~3000K) spaced along gallery length */}
      <pointLight position={[0, 4.0, -10]} intensity={0.9} distance={14} decay={2} color="#fff8f0" />
      <pointLight position={[0, 4.0,  -4]} intensity={0.9} distance={14} decay={2} color="#fff8f0" />
      <pointLight position={[0, 4.0,   2]} intensity={0.9} distance={14} decay={2} color="#fff8f0" />
      <pointLight position={[0, 4.0,   8]} intensity={0.9} distance={14} decay={2} color="#fff8f0" />
      <pointLight position={[0, 4.0,  14]} intensity={0.9} distance={14} decay={2} color="#fff8f0" />

      {/* Room + artworks */}
      <Museum />
      <ArtworkWalls artworks={artworks} onArtworkClick={onArtworkClick} />

      {/* Navigation controls */}
      <Controls />
    </Canvas>
  );
}
