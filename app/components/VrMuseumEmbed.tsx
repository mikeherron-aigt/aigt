'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';

export type MuseumArtwork = {
  id: string;
  title: string;
  artist: string;
  collection: string;
  year?: string;
  medium?: string;
  description?: string;
  imageUrl: string; // should be "/filename.png" (one leading slash) or an absolute URL
};

// Dynamic import keeps Three.js / R3F out of the server bundle entirely
const VrMuseumScene = dynamic(() => import('./vr-museum/VrMuseumScene'), { ssr: false });

interface VrMuseumEmbedProps {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
}

export default function VrMuseumEmbed({ artworks, onArtworkClick }: VrMuseumEmbedProps) {
  const [sceneError, setSceneError] = useState<string | null>(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', background: '#0b0b0b' }}>
      {!sceneError && (
        <Suspense fallback={<MuseumLoadingState />}>
          <VrMuseumScene artworks={artworks} onArtworkClick={onArtworkClick} />
        </Suspense>
      )}

      {/* Crosshair — center aiming reticle for E key interaction */}
      {!sceneError && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.5)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      {/* Navigation hint overlay */}
      {!sceneError && (
        <div
          style={{
            position: 'absolute',
            left: 18,
            bottom: 14,
            padding: '8px 12px',
            borderRadius: 999,
            background: 'rgba(0,0,0,0.45)',
            color: 'rgba(255,255,255,0.85)',
            fontSize: 12,
            letterSpacing: '0.01em',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.12)',
            pointerEvents: 'none',
          }}
        >
          WASD to move · Drag to look · E or click artwork for details
        </div>
      )}

      {/* Error state */}
      {sceneError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            textAlign: 'center',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.9))',
            color: 'rgba(255,255,255,0.88)',
            borderRadius: 18,
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>VR museum failed to load</div>
            <div style={{ fontSize: 12, opacity: 0.85, lineHeight: 1.5 }}>
              {sceneError}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MuseumLoadingState() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b0b0b',
        color: 'rgba(255,255,255,0.35)',
        fontSize: 13,
        letterSpacing: '0.04em',
      }}
    >
      Loading gallery…
    </div>
  );
}
