'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import VrMuseumEmbed, { type MuseumArtwork, type VrMuseumEmbedHandle } from '@/app/components/VrMuseumEmbed';

export default function VrMuseumClient() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<MuseumArtwork | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<VrMuseumEmbedHandle | null>(null);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else containerRef.current.requestFullscreen();
  };

  const closeOverlay = () => {
    setSelectedArtwork(null);
    embedRef.current?.clearFocus?.();
  };

  const artworks: MuseumArtwork[] = useMemo(
    () => [
      {
        id: 'CD-0001',
        title: 'The Geometry of Forever',
        collection: 'Cosmic Dreams',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/CD/2025-JD-CD-0001/2025-JD-CD-0001__full__v02.webp',
      },
      {
        id: 'CD-0016',
        title: 'The Geometry of Her Becoming',
        collection: 'Cosmic Dreams',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/CD/2025-JD-CD-0016/2025-JD-CD-0016__full__v02.webp',
      },
      {
        id: 'CD-0095',
        title: 'She Was the Forest I Kept Returning To',
        collection: 'Cosmic Dreams',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/CD/2025-JD-CD-0095/2025-JD-CD-0095__full__v02.webp',
      },
      {
        id: 'CD-0137',
        title: 'When the Moon Remembers Us',
        collection: 'Cosmic Dreams',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/CD/2025-JD-CD-0137/2025-JD-CD-0137__full__v02.webp',
      },
      {
        id: 'DW-0018',
        title: 'Quantum Shift',
        collection: 'Dreams & Wonders',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/DW/2025-JD-DW-0018/2025-JD-DW-0018__full__v02.webp',
      },
      {
        id: 'AG-0009',
        title: 'Quantum Multiverse',
        collection: 'American Graffiti',
        artist: 'John',
        year: '2024',
        imageUrl: 'https://image.artigt.com/JD/AG/2024-JD-AG-0009/2024-JD-AG-0009__full__v02.webp',
      },
      {
        id: 'AG-0025',
        title: 'The Orbit of Many Souls',
        collection: 'American Graffiti',
        artist: 'John',
        year: '2024',
        imageUrl: 'https://image.artigt.com/JD/AG/2024-JD-AG-0025/2024-JD-AG-0025__full__v02.webp',
      },
      {
        id: 'AG-0037',
        title: 'The Molten Geometry of Street Myth',
        collection: 'American Graffiti',
        artist: 'John',
        year: '2024',
        imageUrl: 'https://image.artigt.com/JD/AG/2024-JD-AG-0037/2024-JD-AG-0037__full__v02.webp',
      },
      {
        id: 'DW-0010',
        title: 'Butterfly Kisses in White',
        collection: 'Dreams & Wonders',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/DW/2025-JD-DW-0010/2025-JD-DW-0010__full__v02.webp',
      },
      {
        id: 'MM-0016',
        title: 'No Ordinary Love',
        collection: 'A Miracle in the Making',
        artist: 'John',
        year: '2024',
        imageUrl: 'https://image.artigt.com/JD/MM/2024-JD-MM-0016/2024-JD-MM-0016__full__v02.webp',
      },
      {
        id: 'MM-0018',
        title: 'Breaking Through the Lattice of Perception',
        collection: 'A Miracle in the Making',
        artist: 'John',
        year: '2024',
        imageUrl: 'https://image.artigt.com/JD/MM/2024-JD-MM-0018/2024-JD-MM-0018__full__v02.webp',
      },
      {
        id: 'MM-0004',
        title: 'Mother Nature',
        collection: 'A Miracle in the Making',
        artist: 'John',
        year: '2024',
        imageUrl: 'https://image.artigt.com/JD/MM/2024-JD-MM-0004/2024-JD-MM-0004__full__v02.webp',
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
                  position: 'fixed',
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
                  setSelectedArtwork(art);
                  embedRef.current?.focusArtwork?.(art.id);
                }}
              />

              {/* Fullscreen artwork overlay */}
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
                    ✕
                  </button>

                  <div
                    style={{
                      width: 'min(1180px, 92vw)',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0, 1fr) 340px',
                      gap: 22,
                      alignItems: 'start',
                    }}
                  >
                    <div
                      style={{
                        borderRadius: 18,
                        background: 'rgba(10,10,10,0.65)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        padding: 18,
                        boxShadow: '0 18px 70px rgba(0,0,0,0.65)',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedArtwork.imageUrl}
                        alt={selectedArtwork.title}
                        style={{
                          width: '100%',
                          height: 'auto',
                          maxHeight: '76vh',
                          objectFit: 'contain',
                          borderRadius: 12,
                          display: 'block',
                          margin: '0 auto',
                          background: '#0b0b0b',
                        }}
                      />
                    </div>

                    <div
                      style={{
                        borderRadius: 18,
                        background: 'rgba(12,12,12,0.72)',
                        border: '1px solid rgba(255,255,255,0.10)',
                        padding: 18,
                        color: '#fff',
                        boxShadow: '0 18px 70px rgba(0,0,0,0.55)',
                        backdropFilter: 'blur(14px)',
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 650, lineHeight: 1.25 }}>
                        {selectedArtwork.title}
                      </div>

                      <div style={{ marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.70)' }}>
                        {selectedArtwork.artist}
                        {selectedArtwork.year ? `, ${selectedArtwork.year}` : ''}
                      </div>

                      <div style={{ marginTop: 16, display: 'grid', gap: 12 }}>
                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              color: 'rgba(255,255,255,0.45)',
                              letterSpacing: 0.6,
                              textTransform: 'uppercase',
                            }}
                          >
                            Collection
                          </div>
                          <div style={{ marginTop: 4, fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
                            {selectedArtwork.collection || 'Unassigned'}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: 11,
                              color: 'rgba(255,255,255,0.45)',
                              letterSpacing: 0.6,
                              textTransform: 'uppercase',
                            }}
                          >
                            Catalog ID
                          </div>
                          <div
                            style={{
                              marginTop: 4,
                              fontSize: 13,
                              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                              color: 'rgba(255,255,255,0.80)',
                            }}
                          >
                            {selectedArtwork.id}
                          </div>
                        </div>
                      </div>

                      {selectedArtwork.description && (
                        <p style={{ marginTop: 16, fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.70)' }}>
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
