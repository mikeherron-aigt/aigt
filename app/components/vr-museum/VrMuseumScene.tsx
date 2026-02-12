'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { EffectComposer, SMAA, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import Museum from './Museum';
import { AnchoredArtworks } from './ArtworkFrame';
import Controls from './Controls';
import { MuseumSceneProvider } from './MuseumSceneContext';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';

interface VrMuseumSceneProps {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
}

/**
 * React Three Fiber scene root for the VR museum.
 * Uses GLB museum model, simplified lighting with Environment IBL,
 * and postprocessing (SMAA, Bloom, Vignette).
 * Art planes use MeshBasicMaterial — immune to tone mapping.
 */
export default function VrMuseumScene({ artworks, onArtworkClick }: VrMuseumSceneProps) {
  return (
    <Canvas
      camera={{
        fov: 55,
        position: [0, -1.4, 2.6],
        near: 0.1,
        far: 120,
      }}
      gl={{
        powerPreference: 'high-performance',
        antialias: false,
      }}
      dpr={[1, 1.5]}
      shadows
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.95;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
    >
      {/* Scene background + fog — warm off-white matches walls/ceiling */}
      <color attach="background" args={['#f0efeb']} />
      <fog attach="fog" args={['#f0efeb', 20, 52]} />

      {/* Lighting rig — simplified: ambient + single directional + Environment IBL */}
      <ambientLight intensity={0.4} />

      <directionalLight
        position={[5, 8, 3]}
        intensity={1.95}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0001}
      />

      <Environment preset="apartment" />

      <Physics gravity={[0, -9.81, 0]}>
        <MuseumSceneProvider>
          {/* Room + artworks */}
          <Museum />
          <AnchoredArtworks artworks={artworks} onArtworkClick={onArtworkClick} />

          {/* Player physics body + navigation controls */}
          <Controls />
        </MuseumSceneProvider>
      </Physics>

      {/* Postprocessing — SMAA replaces native AA, subtle bloom + vignette */}
      <EffectComposer multisampling={4}>
        <SMAA />
        <Bloom intensity={0.25} luminanceThreshold={0.95} luminanceSmoothing={0.9} />
        <Vignette darkness={0.8} offset={0.3} />
      </EffectComposer>
    </Canvas>
  );
}
