'use client';

import { useEffect, useRef } from 'react';
import { createVrMuseumScene, type VrMuseumSceneHandle } from '@/app/lib/vrMuseumScene';

export type MuseumArtwork = {
  id: string;
  title: string;
  artist: string;
  year?: string;
  imageUrl: string; // must be a public path like "/vr-museum/artworks/file.jpg"
};

export default function VrMuseumEmbed({ artworks }: { artworks: MuseumArtwork[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<VrMuseumSceneHandle | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Create and mount the scene
    handleRef.current = createVrMuseumScene({
      container: mountRef.current,
      artworks,
    });

    return () => {
      handleRef.current?.dispose();
      handleRef.current = null;
    };
  }, [artworks]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* The scene will inject a canvas here */}
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
        Drag to look. Scroll to move.
      </div>
    </div>
  );
}
