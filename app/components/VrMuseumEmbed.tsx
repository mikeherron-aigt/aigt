'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

export type MuseumArtwork = {
  id: string;
  title: string;
  artist: string;
  year?: string;
  imageUrl: string; // should be "/filename.png" (one leading slash)
};

type VrMuseumSceneHandle = { dispose: () => void };

export default function VrMuseumEmbed({ artworks }: { artworks: MuseumArtwork[] }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<VrMuseumSceneHandle | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Create a stable dependency that changes only when the actual artwork set changes
  const artworksKey = useMemo(() => {
    return artworks
      .map((a) => `${a.id}:${(a.imageUrl || '').trim()}`)
      .sort()
      .join('|');
  }, [artworks]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    if (typeof window === 'undefined') return;

    let cancelled = false;

    // Always clear any previous scene first
    try {
      handleRef.current?.dispose();
    } catch {}
    handleRef.current = null;

    // Clear any leftover canvases (just in case something went sideways)
    while (el.firstChild) el.removeChild(el.firstChild);

    setError(null);

    (async () => {
      try {
        const mod = await import('@/app/lib/vrMuseumScene');
        if (cancelled) return;

        handleRef.current = mod.createVrMuseumScene({
          container: el,
          artworks,
        });
      } catch (e: any) {
        if (cancelled) return;
        console.error('[VR MUSEUM] Init failed:', e);
        setError(e?.message ? String(e.message) : 'VR museum failed to load');
      }
    })();

    return () => {
      cancelled = true;
      try {
        handleRef.current?.dispose();
      } catch {}
      handleRef.current = null;

      // Clean up DOM on unmount
      if (el) {
        while (el.firstChild) el.removeChild(el.firstChild);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artworksKey]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'relative' }} />

      {/* Overlay hint */}
      {!error && (
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
      )}

      {/* Error state */}
      {error && (
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
              {error}
              <div style={{ marginTop: 10, opacity: 0.85 }}>
                Quick check: your imageUrl values should look like <code>/2025-JD-CD-0001.png</code> (one leading slash).
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
