'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import VrMuseumEmbed, { type MuseumArtwork, type VrMuseumEmbedHandle } from '@/app/components/VrMuseumEmbed';

export default function VrMuseumClient() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<MuseumArtwork | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<VrMuseumEmbedHandle | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen();
  };

  const closeOverlay = () => {
    setSelectedArtwork(null);
    embedRef.current?.clearFocus?.();
  };

  // ESC closes overlay
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedArtwork) closeOverlay();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedArtwork]);

  // Prevent scroll while overlay is open
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (selectedArtwork) e.preventDefault();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel as any);
  }, [selectedArtwork]);

  // Replace this with your real data if you have it already
  const artworks: MuseumArtwork[] = useMemo(
    () => [
      {
        id: 'AG-0025',
        title: 'The Orbit of Many Souls',
        artist: 'John',
        year: '2024',
        collection: 'American Graffiti',
        imageUrl: 'https://image.artigt.com/JD/AG/2024-JD-AG-0025/2024-JD-AG-0025__full__v02.webp',
      },
      {
        id: 'AG-0037',
        title: 'The Molten Geometry of Street Myth',
        artist: 'John',
        year: '2024',
        collection: 'American Graffiti',
        imageUrl: 'https://image.artigt.com/JD/AG/2024-JD-AG-0037/2024-JD-AG-0037__full__v02.webp',
      },
      {
        id: 'DW-0010',
        title: 'Butterfly Kisses in White',
        artist: 'John',
        year: '2025',
        collection: 'Dreams & Wonders',
        imageUrl: 'https://image.artigt.com/JD/DW/2025-JD-DW-0010/2025-JD-DW-0010__full__v02.webp',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#ffffff' }}>
      <div className="w-full" style={{ backgroundColor: '#f5f5f5' }}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-10 sm:py-14">
          <div className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-[28px] sm:text-[34px] font-[500] tracking-[-0.02em] text-black">
                  Virtual Museum
                </h1>
                <p className="mt-2 text-[14px] sm:text-[15px] text-black/70 max-w-[780px] leading-relaxed">
                  Prototype gallery experience. Click a work to focus and view details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsExpanded((v) => !v)}
                className="px-4 py-2 rounded-full text-[13px] border border-black/20 bg-white hover:bg-black hover:text-white transition"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            </div>

            <div
              ref={containerRef}
              className="w-full mx-auto overflow-hidden rounded-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-black/10"
              style={{
                position: 'relative',
                maxWidth: isExpanded ? '1440px' : '1100px',
                height: isExpanded ? 'min(88vh, 980px)' : '700px',
                background: '#0b0b0b',
              }}
            >
              <button
                type="button"
                onClick={toggleFullscreen}
                style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'rgba(0,0,0,0.45)',
                  color: 'rgba(255,255,255,0.85)',
                  fontSize: 13,
                  border: '1px solid rgba(255,255,255,0.12)',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  zIndex: 5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {isFullscreen ? '✕ Exit' : '⛶ Fullscreen'}
              </button>

              <VrMuseumEmbed
                ref={embedRef}
                artworks={artworks}
                onArtworkClick={(art) => {
                   setTimeout(() => setSelectedArtwork(art), 350);
                
                }}
              />

              {selectedArtwork && (
                <div
                  role="dialog"
                  aria-modal="true"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) closeOverlay();
                  }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: 'rgba(0,0,0,0.88)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                  }}
                >
                  <button
                    type="button"
                    onClick={closeOverlay}
                    style={{
                      position: 'absolute',
                      top: 24,
                      right: 24,
                      width: 44,
                      height: 44,
                      borderRadius: 999,
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'rgba(20,20,20,0.8)',
                      color: '#fff',
                      cursor: 'pointer',
                      backdropFilter: 'blur(10px)',
                      fontSize: 18,
                      display: 'grid',
                      placeItems: 'center',
                    }}
                    aria-label="Close"
                  >
                    ✕
                  </button>

                  <div
                    style={{
                      width: 'min(1200px, 94vw)',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) 360px',
                      gap: 28,
                      alignItems: 'start',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 20,
                        background: '#0d0d0d',
                        padding: 20,
                        boxShadow: '0 30px 100px rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.10)',
                      }}
                    >
                      <img
                        src={selectedArtwork.imageUrl}
                        alt={selectedArtwork.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '82vh',
                          objectFit: 'contain',
                          borderRadius: 14,
                          display: 'block',
                          margin: '0 auto',
                          background: '#0b0b0b',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        borderRadius: 20,
                        background: 'rgba(18,18,18,0.85)',
                        padding: 22,
                        color: '#fff',
                        backdropFilter: 'blur(14px)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        boxShadow: '0 30px 100px rgba(0,0,0,0.45)',
                      }}
                    >
                      <div style={{ fontSize: 20, fontWeight: 620, lineHeight: 1.2 }}>
                        {selectedArtwork.title}
                      </div>

                      <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.70)' }}>
                        {selectedArtwork.artist}
                        {selectedArtwork.year ? `, ${selectedArtwork.year}` : ''}
                      </div>

                      <div style={{ marginTop: 22 }}>
                        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>COLLECTION</div>
                        <div style={{ marginTop: 4 }}>{selectedArtwork.collection || 'Unassigned'}</div>
                      </div>

                      <div style={{ marginTop: 18 }}>
                        <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 1 }}>CATALOG ID</div>
                        <div style={{ marginTop: 4, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                          {selectedArtwork.id}
                        </div>
                      </div>

                      {selectedArtwork.description && (
                        <p style={{ marginTop: 18, fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,0.70)' }}>
                          {selectedArtwork.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
