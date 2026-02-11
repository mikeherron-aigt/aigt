'use client';

import { useMemo, useState } from 'react';
import VrMuseumEmbed, { type MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export default function VrMuseumClient() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Your images are in /public, so they are served from "/filename.webp"
  const artworks: MuseumArtwork[] = useMemo(
    () => [
      {
        id: '2025-JD-CD-0001',
        title: 'Collection Piece',
        artist: 'John',
        year: '2025',
        imageUrl: '/2025-JD-CD-0001.webp',
      },
      {
        id: '2025-JD-CD-0016',
        title: 'Collection Piece',
        artist: 'John',
        year: '2025',
        imageUrl: '/2025-JD-CD-0016.webp',
      },
      {
        id: '2025-JD-CD-0095',
        title: 'Collection Piece',
        artist: 'John',
        year: '2025',
        imageUrl: '/2025-JD-CD-0095.webp',
      },
      {
        id: '2025-JD-CD-0137',
        title: 'Collection Piece',
        artist: 'John',
        year: '2025',
        imageUrl: '/2025-JD-CD-0137.webp',
      },
      {
        id: '2025-JD-DW-0018',
        title: 'Dreams and Wonders',
        artist: 'John',
        year: '2025',
        imageUrl: '/2025-JD-DW-0018.webp',
      },
      {
        id: '2025-JD-DW-0028',
        title: 'Dreams and Wonders',
        artist: 'John',
        year: '2025',
        imageUrl: '/2025-JD-DW-0028.webp',
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
              className="w-full mx-auto overflow-hidden rounded-[22px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-black/10"
              style={{
                maxWidth: isExpanded ? '1440px' : '1100px',
                height: isExpanded ? 'min(88vh, 980px)' : '700px',
                background: '#0b0b0b',
              }}
            >
              <VrMuseumEmbed artworks={artworks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
