'use client';

import { useMemo, useState } from 'react';
import VrMuseumEmbed, { type MuseumArtwork } from '@/app/components/VrMuseumEmbed';

export default function VrMuseumPage() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Put John’s images in /public/vr-museum/artworks/...
  // Then reference them as "/vr-museum/artworks/filename.jpg"
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
                  Explore a prototype gallery experience. For now we are focusing on getting the embedded VR
                  scene working and loading John’s works directly from the site.
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

            <div
              className="max-w-[1100px] mx-auto text-[13px] text-black/60 leading-relaxed"
              style={{ display: isExpanded ? 'none' : 'block' }}
            >
              Tip: click and drag to look around. Scroll to move forward and back. Press <span className="font-[600]">W/A/S/D</span>{' '}
              once we enable walk mode (next step).
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[80px] py-12">
        <div className="max-w-[1100px]">
          <h2 className="text-[18px] font-[500] text-black">Next upgrades</h2>
          <ul className="mt-3 space-y-2 text-[14px] text-black/70">
            <li>HDR lighting + better reflections (big realism jump)</li>
            <li>Soft track lighting per artwork</li>
            <li>Artwork labels and a clean info panel</li>
            <li>Optional walk mode + gentle motion smoothing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

