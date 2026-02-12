'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import VrMuseumEmbed, { type MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export default function VrMuseumClient() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<MuseumArtwork | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  // Your images are in /public, so they are served from "/filename.png"
  const artworks: MuseumArtwork[] = useMemo(
    () => [
      {
        id: 'CD-0001',
        title: 'The Geometry of Forever',
        collection: 'Cosmic Dreams',
        artist: 'John',
        year: '2025',
        imageUrl: 'https://image.artigt.com/JD/CD/2025-JD-CD-0001/2025-JD-CD-0001__full__v02.webp',
        noFlip: true, // This anchor plane already faces outward
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
        anchor: 'ARTWORK_19',
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
        anchor: 'ARTWORK_16',
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
                  Prototype gallery experience. Embedded scene with a simple expand control.
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
              {/* Fullscreen toggle button */}
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

              <VrMuseumEmbed artworks={artworks} onArtworkClick={setSelectedArtwork} />

              {/* Artwork detail panel — slides in from the right on click */}
              {selectedArtwork && (
                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bottom: 16,
                    width: 280,
                    background: 'rgba(10,10,10,0.88)',
                    backdropFilter: 'blur(18px)',
                    WebkitBackdropFilter: 'blur(18px)',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '20px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                    color: '#fff',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
                    zIndex: 10,
                    overflowY: 'auto',
                  }}
                >
                  {/* Close button */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedArtwork(null)}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '50%',
                        width: 28,
                        height: 28,
                        cursor: 'pointer',
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 14,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      aria-label="Close detail panel"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Artwork thumbnail */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedArtwork.imageUrl}
                    alt={selectedArtwork.title}
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      objectFit: 'cover',
                      aspectRatio: '4/5',
                      background: '#1a1a1a',
                    }}
                  />

                  {/* Artwork info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
                      {selectedArtwork.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', display: 'flex', gap: 8 }}>
                      <span>{selectedArtwork.artist}</span>
                      {selectedArtwork.year && (
                        <>
                          <span style={{ opacity: 0.35 }}>·</span>
                          <span>{selectedArtwork.year}</span>
                        </>
                      )}
                    </div>
                    {selectedArtwork.medium && (
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontStyle: 'italic' }}>
                        {selectedArtwork.medium}
                      </div>
                    )}
                    {selectedArtwork.description && (
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: 4 }}>
                        {selectedArtwork.description}
                      </p>
                    )}
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontFamily: 'monospace' }}>
                      {selectedArtwork.collection}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2, fontFamily: 'monospace' }}>
                      {selectedArtwork.id}
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
