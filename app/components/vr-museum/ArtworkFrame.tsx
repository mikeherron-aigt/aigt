'use client';

import { useEffect, useRef, useState } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';
import { ROOM_W, ROOM_D } from './Museum';

const MAX_ART_W = 1.6;
const MAX_ART_H = 2.0;
const FRAME_T = 0.08;
const DEPTH = 0.08;
const ART_Z = DEPTH / 2 + 0.01;

// Mirror the URL normalization from the original scene —
// avoids new URL() which breaks on Netlify preview deploys.
function normalizeImageUrl(url: string): string {
  if (!url) return url;
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}

interface ArtworkFrameProps {
  artwork: MuseumArtwork;
  position: [number, number, number];
  rotationY: number;
  onClick?: (artwork: MuseumArtwork) => void;
}

/**
 * A single framed artwork: outer frame, inner matte, art plane (MeshBasicMaterial
 * so tone-mapping never darkens it), an overhead spot, and an in-scene placard.
 */
export default function ArtworkFrame({ artwork, position, rotationY, onClick }: ArtworkFrameProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [dims, setDims] = useState({ w: MAX_ART_W * 0.8, h: MAX_ART_H * 0.8 });

  const groupRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTargetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const onClickRef = useRef(onClick);

  useEffect(() => {
    let cancelled = false;
    const src = normalizeImageUrl(artwork.imageUrl);
    const loader = new THREE.TextureLoader();

    loader.load(
      src,
      (tex) => {
        if (cancelled) { tex.dispose(); return; }

        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.needsUpdate = true;

        const img = tex.image as (HTMLImageElement & { naturalWidth?: number; naturalHeight?: number }) | undefined;
        // Guard against zero/NaN — some WebP images report 0 before fully decoded;
        // zero width produces a degenerate (invisible) mesh with white base color.
        const w = Math.max(img?.naturalWidth ?? img?.width ?? 0, 1);
        const h = Math.max(img?.naturalHeight ?? img?.height ?? 0, 1);
        const aspect = w / h;

        let artW = MAX_ART_W;
        let artH = artW / aspect;
        if (artH > MAX_ART_H) {
          artH = MAX_ART_H;
          artW = artH * aspect;
        }

        if (!isFinite(artW) || !isFinite(artH) || artW <= 0 || artH <= 0) {
          artW = MAX_ART_W * 0.8;
          artH = MAX_ART_H * 0.8;
        }

        setDims({ w: artW, h: artH });
        setTexture(tex);
      },
      undefined,
      (err) => { console.warn('[ArtworkFrame] texture load failed:', src, err); }
    );

    return () => { cancelled = true; };
  }, [artwork.imageUrl]);

  // Wire spotlight target after both refs are populated
  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }
  });

  // Keep onClickRef up to date
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);

  // Set up userData.onInteract for E key raycasting
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.onInteract = () => {
        if (onClickRef.current) {
          onClickRef.current(artwork);
        }
      };
    }
  }, [artwork]);

  const { w: artW, h: artH } = dims;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Invisible target for spotlight — sits at the center of the art plane */}
      <group ref={spotTargetRef} position={[0, 0, ART_Z]} />

      {/* Outer frame */}
      <mesh castShadow>
        <boxGeometry args={[artW + FRAME_T, artH + FRAME_T, DEPTH]} />
        <meshStandardMaterial color="#141414" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Matte */}
      <mesh position={[0, 0, DEPTH / 2 + 0.004]}>
        <boxGeometry args={[artW + 0.03, artH + 0.03, 0.005]} />
        <meshStandardMaterial color="#f6f6f6" roughness={0.95} metalness={0} />
      </mesh>

      {/* Art plane — MeshBasicMaterial: immune to lighting & tone mapping */}
      <mesh
        ref={meshRef}
        position={[0, 0, ART_Z]}
        onClick={onClick ? () => onClick(artwork) : undefined}
      >
        <planeGeometry args={[artW, artH]} />
        <meshBasicMaterial
          key={texture ? 'textured' : 'fallback'}
          color={texture ? 0xffffff : 0x2b2b2b}
          map={texture ?? undefined}
        />
      </mesh>

      {/* Overhead spot — subtle fill on frame/matte (art plane ignores it via MeshBasicMaterial) */}
      {/* No shadow casting - shadows handled by dynamic KeyLight */}
      <spotLight
        ref={spotRef}
        position={[0, 3.6, 1.2]}
        intensity={1.4}
        distance={7.5}
        angle={Math.PI / 8}
        penumbra={0.55}
        decay={1.1}
      />

      {/* In-scene museum placard */}
      <Html
        position={[0, -(artH / 2 + 0.28), ART_Z]}
        center
        distanceFactor={3.5}
        occlude
        transform
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        <div
          style={{
            background: 'rgba(242,242,242,0.95)',
            padding: '4px 8px',
            borderRadius: 2,
            maxWidth: 160,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: '#111',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 150,
            }}
          >
            {artwork.title}
          </div>
          <div style={{ fontSize: 7.5, color: '#555', marginTop: 1 }}>
            {artwork.artist}{artwork.year ? `, ${artwork.year}` : ''}
          </div>
        </div>
      </Html>
    </group>
  );
}

const WALL_MARGIN = 2.0; // margin from front/back walls (meters)

/**
 * Compute evenly-spaced Z positions for artworks along one wall.
 * Ensures all artworks stay within usable depth (ROOM_D - 2 * WALL_MARGIN).
 */
function computeZPositions(count: number): number[] {
  if (count === 0) return [];
  if (count === 1) return [0]; // center at z=0
  const usableDepth = ROOM_D - 2 * WALL_MARGIN; // 24m
  const spacing = usableDepth / (count + 1);
  return Array.from({ length: count }, (_, i) =>
    (ROOM_D / 2 - WALL_MARGIN) - (i + 1) * spacing
  );
}

/**
 * Lays out all artworks dynamically on right wall (first half) then left wall (second half).
 * Each wall gets independent, evenly-spaced placement to fit any artwork count.
 */
export function ArtworkWalls({
  artworks,
  onArtworkClick,
}: {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
}) {
  const y = 2.05;

  // Split artworks between right and left walls
  const halfIdx = Math.ceil(artworks.length / 2);
  const rightArtworks = artworks.slice(0, halfIdx);
  const leftArtworks = artworks.slice(halfIdx);

  // Compute z-positions independently for each wall
  const rightZPositions = computeZPositions(rightArtworks.length);
  const leftZPositions = computeZPositions(leftArtworks.length);

  const placements: Array<{ pos: [number, number, number]; rotY: number }> = [];

  // Right wall placements
  for (let i = 0; i < rightArtworks.length; i++) {
    placements.push({ pos: [ROOM_W / 2 - 0.06, y, rightZPositions[i]!], rotY: -Math.PI / 2 });
  }

  // Left wall placements
  for (let i = 0; i < leftArtworks.length; i++) {
    placements.push({ pos: [-ROOM_W / 2 + 0.06, y, leftZPositions[i]!], rotY: Math.PI / 2 });
  }

  return (
    <>
      {artworks.map((artwork, i) => {
        const p = placements[i] ?? {
          pos: [ROOM_W / 2 - 0.06, y, 9 - i * 5.2] as [number, number, number],
          rotY: -Math.PI / 2,
        };
        return (
          <ArtworkFrame
            key={artwork.id}
            artwork={artwork}
            position={p.pos}
            rotationY={p.rotY}
            onClick={onArtworkClick}
          />
        );
      })}
    </>
  );
}
