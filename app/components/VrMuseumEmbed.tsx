'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import { createVrMuseumScene, type VrMuseumSceneHandle } from '@/app/lib/vrMuseumScene';

export type MuseumArtwork = {
  id: string;
  title: string;
  artist: string;
  year?: string;
  collection?: string;
  imageUrl: string;
  medium?: string;
  description?: string;
};

export type VrMuseumEmbedHandle = {
  focusArtwork?: (id: string) => void;
  clearFocus?: () => void;
};

type Props = {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
};

const VrMuseumEmbed = forwardRef<VrMuseumEmbedHandle, Props>(function VrMuseumEmbed({ artworks, onArtworkClick }, ref) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<VrMuseumSceneHandle | null>(null);

  // Keep a stable reference to the latest callback
  const onArtworkClickRef = useRef<Props['onArtworkClick']>(onArtworkClick);
  useEffect(() => {
    onArtworkClickRef.current = onArtworkClick;
  }, [onArtworkClick]);

  useImperativeHandle(
    ref,
    () => ({
      focusArtwork: (id: string) => sceneRef.current?.focusArtwork?.(id),
      clearFocus: () => sceneRef.current?.clearFocus?.(),
    }),
    []
  );

  const sceneArtworks = useMemo(() => artworks, [artworks]);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    // Create scene
    const handle = createVrMuseumScene({
      container: el,
      artworks: sceneArtworks,
      onArtworkClick: (art) => onArtworkClickRef.current?.(art),
    });

    sceneRef.current = handle;

    return () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
    };
  }, [sceneArtworks]);

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />

      {/* Instruction pill */}
      <div
        style={{
          position: 'absolute',
          left: 16,
          bottom: 16,
          zIndex: 6,
          padding: '10px 14px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.45)',
          color: 'rgba(255,255,255,0.85)',
          fontSize: 13,
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      >
        Drag to look · Scroll to move · Click artwork for details
      </div>
    </div>
  );
});

export default VrMuseumEmbed;
