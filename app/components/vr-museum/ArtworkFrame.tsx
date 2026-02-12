'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { Html, useGLTF, Clone } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { MuseumArtwork } from '@/app/components/VrMuseumEmbed';
import { ROOM_W, ROOM_D } from './Museum';
import { useMuseumScene } from './MuseumSceneContext';

const MAX_ART_W = 1.6;
const MAX_ART_H = 2.0;
const FRAME_MODEL = '/models/fancy_picture_v3.glb';

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
 * A single framed artwork: GLB frame model, art plane (MeshBasicMaterial
 * so tone-mapping never darkens it), an overhead spot, and an in-scene placard.
 *
 * The frame GLB's face is in the YZ plane (depth along X, width along Z, height along Y).
 * An inner +π/2 Y rotation aligns the frame so depth runs along Z (into the room)
 * and width runs along X, matching the outer group's rotationY expectations.
 */
export default function ArtworkFrame({ artwork, position, rotationY, onClick }: ArtworkFrameProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [dims, setDims] = useState({ w: MAX_ART_W * 0.8, h: MAX_ART_H * 0.8, aspect: 1.0 });

  const groupRef = useRef<THREE.Group>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTargetRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const onClickRef = useRef(onClick);

  const { scene: frameScene } = useGLTF(FRAME_MODEL);

  // Compute the frame's native bounding box (in world space, after internal GLB transforms).
  // Frame native axes: X = depth (~0.116), Y = height (~2.0), Z = width (~1.666)
  const frameMeta = useMemo(() => {
    const box = new THREE.Box3().setFromObject(frameScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    return {
      nativeWidth: size.z,   // Z axis = width (~1.666)
      nativeHeight: size.y,  // Y axis = height (~2.0)
      nativeDepth: size.x,   // X axis = depth (~0.116)
    };
  }, [frameScene]);

  // Compute the frame's inner opening rectangle from back-face vertices.
  // The back of the frame (highest X) forms the rabbet/ledge where artwork sits.
  const openingMeta = useMemo(() => {
    let posAttr: THREE.BufferAttribute | null = null;
    frameScene.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.isMesh && m.geometry) {
        const attr = m.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
        if (attr) posAttr = attr;
      }
    });

    if (!posAttr) return { width: frameMeta.nativeWidth * 0.75, height: frameMeta.nativeHeight * 0.80 };

    const attr = posAttr as THREE.BufferAttribute;
    // Find the maximum X (back of frame) and collect vertices near it
    let globalMaxX = -Infinity;
    for (let i = 0; i < attr.count; i++) {
      globalMaxX = Math.max(globalMaxX, attr.getX(i));
    }
    const threshold = globalMaxX - 0.01; // within 1cm of back face

    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < attr.count; i++) {
      if (attr.getX(i) > threshold) {
        const y = attr.getY(i);
        const z = attr.getZ(i);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
      }
    }

    return {
      width: maxZ - minZ,   // Z axis = width of opening
      height: maxY - minY,  // Y axis = height of opening
    };
  }, [frameScene, frameMeta]);

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

        setDims({ w: artW, h: artH, aspect });
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

  const { w: artW, h: artH, aspect: artAspect } = dims;

  // Scale the GLB frame to match artwork dimensions.
  // Scale is applied to native axes (before the inner rotation):
  //   native X = depth, native Y = height, native Z = width
  const framePadding = 0.12;
  const widthScale = (artW + framePadding) / frameMeta.nativeWidth;
  const heightScale = (artH + framePadding) / frameMeta.nativeHeight;
  const depthScale = 1.0; // Keep native depth as-is (~0.116m)

  // Compute the actual opening dimensions after frame scaling.
  // Then contain-fit the artwork aspect ratio within the opening.
  const scaledOpeningW = openingMeta.width * widthScale;
  const scaledOpeningH = openingMeta.height * heightScale;
  const INSET = 0.97; // small gap so edges don't bleed past frame lip

  let planeW: number, planeH: number;
  if (artAspect > scaledOpeningW / scaledOpeningH) {
    // Artwork wider than opening → constrained by width
    planeW = scaledOpeningW * INSET;
    planeH = planeW / artAspect;
  } else {
    // Artwork taller than opening → constrained by height
    planeH = scaledOpeningH * INSET;
    planeW = planeH * artAspect;
  }

  // After the inner +π/2 Y rotation, native X (depth) maps to outer +Z.
  // Art plane sits slightly behind the front lip of the frame (recessed into the frame).
  const artZ = (frameMeta.nativeDepth / 2) * depthScale - 0.01;

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Invisible target for spotlight — sits at the center of the art plane */}
      <group ref={spotTargetRef} position={[0, 0, artZ]} />

      {/* GLB frame — rotated +π/2 around Y so depth aligns with Z (into room) */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Clone
          object={frameScene}
          scale={[depthScale, heightScale, widthScale]}
          castShadow
          receiveShadow
        />
      </group>

      {/* Art plane — MeshBasicMaterial: immune to lighting & tone mapping.
          Contain-fit within frame opening so no edge bleeds past inner border. */}
      <mesh
        ref={meshRef}
        position={[0, 0, artZ]}
        onClick={onClick ? () => onClick(artwork) : undefined}
      >
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          key={texture ? 'textured' : 'fallback'}
          color={texture ? 0xffffff : 0x2b2b2b}
          map={texture ?? undefined}
        />
      </mesh>

      {/* Overhead spot — subtle fill on frame (art plane ignores it via MeshBasicMaterial) */}
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
        position={[0, -(scaledOpeningH / 2 + 0.18), artZ]}
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
/** Half the frame's native depth — used to position frame back flush against wall */
const FRAME_HALF_DEPTH = 0.058; // nativeDepth (~0.116m) / 2
/** Small clearance between frame back and wall surface */
const WALL_GAP = 0.008;

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
 * Uses raycasting at mount time to snap artworks to actual interior wall surfaces.
 */
export function ArtworkWalls({
  artworks,
  onArtworkClick,
}: {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
}) {
  const { museumGroupRef } = useMuseumScene();
  const y = 2.05;
  const [wallXPositions, setWallXPositions] = useState<Map<number, number> | null>(null);
  const hasDetected = useRef(false);

  // Split artworks between right and left walls
  const halfIdx = Math.ceil(artworks.length / 2);
  const rightArtworks = artworks.slice(0, halfIdx);
  const leftArtworks = artworks.slice(halfIdx);

  // Compute z-positions independently for each wall
  const rightZPositions = computeZPositions(rightArtworks.length);
  const leftZPositions = computeZPositions(leftArtworks.length);

  // Detect interior wall positions via raycasting (runs once when museum is ready).
  // Casts from inside the room outward — the first hit with the correct facing
  // normal is the interior wall surface.
  const detectWalls = useCallback(() => {
    const museum = museumGroupRef.current;
    if (!museum || hasDetected.current) return;
    hasDetected.current = true;

    const raycaster = new THREE.Raycaster();
    const positions = new Map<number, number>();

    for (let i = 0; i < artworks.length; i++) {
      const isRight = i < halfIdx;
      const zPositions = isRight ? rightZPositions : leftZPositions;
      const localIdx = isRight ? i : i - halfIdx;
      const z = zPositions[localIdx] ?? 0;

      // Cast from inside the room outward to find interior wall surface
      const origin = new THREE.Vector3(
        isRight ? ROOM_W / 4 : -ROOM_W / 4,
        y,
        z,
      );
      const direction = new THREE.Vector3(isRight ? 1 : -1, 0, 0);

      raycaster.set(origin, direction);
      raycaster.far = ROOM_W;
      const hits = raycaster.intersectObject(museum, true);

      // Accept first hit with a wall-facing normal (pointing back toward room center)
      const wallHit = hits.find(h =>
        h.face && (isRight ? h.face.normal.x < -0.5 : h.face.normal.x > 0.5),
      );
      if (wallHit) {
        positions.set(i, wallHit.point.x);
      }
    }

    if (positions.size > 0) {
      setWallXPositions(positions);
    }
  }, [museumGroupRef, artworks.length, halfIdx, rightZPositions, leftZPositions, y]);

  // Try to detect walls each frame until museum geometry is available
  useFrame(() => {
    if (!hasDetected.current && museumGroupRef.current) {
      detectWalls();
    }
  });

  const placements: Array<{ pos: [number, number, number]; rotY: number }> = [];
  // Offset from interior wall surface: frame back sits WALL_GAP from wall,
  // frame protrudes naturally into the room by its full depth.
  const wallOffset = FRAME_HALF_DEPTH + WALL_GAP;

  // Right wall placements — offset toward room center (-X)
  for (let i = 0; i < rightArtworks.length; i++) {
    const detectedX = wallXPositions?.get(i);
    const x = detectedX != null ? detectedX - wallOffset : ROOM_W / 2 - wallOffset;
    placements.push({ pos: [x, y, rightZPositions[i]!], rotY: -Math.PI / 2 });
  }

  // Left wall placements — offset toward room center (+X)
  for (let i = 0; i < leftArtworks.length; i++) {
    const idx = rightArtworks.length + i;
    const detectedX = wallXPositions?.get(idx);
    const x = detectedX != null ? detectedX + wallOffset : -ROOM_W / 2 + wallOffset;
    placements.push({ pos: [x, y, leftZPositions[i]!], rotY: Math.PI / 2 });
  }

  return (
    <>
      {artworks.map((artwork, i) => {
        const p = placements[i] ?? {
          pos: [ROOM_W / 2 - wallOffset, y, 9 - i * 5.2] as [number, number, number],
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

useGLTF.preload(FRAME_MODEL);

// ─── Anchor-based placement ───────────────────────────────────────────────────

// 180° rotation around Y: corrects anchor planes whose +Z normal faces INTO the
// wall instead of out toward the viewer.  q = (0, sin(π/2), 0, cos(π/2)) = (0,1,0,0)
const Q_FLIP_Y = new THREE.Quaternion(0, 1, 0, 0);

// Adaptive frame sizing constants (meters)
const ART_TARGET_H = 1.1;     // target artwork physical height
const FRAME_BORDER = 0.08;    // frame border thickness around artwork
const MIN_OUTER_W = 0.7;      // minimum frame outer width
const MAX_OUTER_W = 2.2;      // maximum frame outer width
const PLAQUE_GAP = 0.10;      // gap between frame bottom and plaque top
const PLAQUE_MAX_W = 0.9;     // maximum plaque width
const PLAQUE_H = 0.18;        // plaque height
const PLAQUE_Z = 0.03;        // plaque offset from wall (3cm forward)

interface AnchoredArtworkFrameProps {
  artwork: MuseumArtwork;
  position: [number, number, number];
  quaternion: [number, number, number, number]; // [x, y, z, w]
  onClick?: (artwork: MuseumArtwork) => void;
}

/**
 * Like ArtworkFrame but positioned/oriented by an anchor plane's world transform
 * rather than computed wall raycasts. The frame and art render at fixed museum-
 * standard sizes regardless of anchor plane dimensions (anchors only provide
 * position and rotation).
 */
function AnchoredArtworkFrame({
  artwork,
  position,
  quaternion,
  onClick,
}: AnchoredArtworkFrameProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [artAspect, setArtAspect] = useState(1.0);

  const meshRef = useRef<THREE.Mesh>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const spotTargetRef = useRef<THREE.Group>(null);
  const onClickRef = useRef(onClick);

  const { scene: frameScene } = useGLTF(FRAME_MODEL);

  const frameMeta = useMemo(() => {
    const box = new THREE.Box3().setFromObject(frameScene);
    const size = new THREE.Vector3();
    box.getSize(size);
    // Frame native axes: X = depth (~0.116), Y = height (~2.0), Z = width (~1.666)
    return { nativeWidth: size.z, nativeHeight: size.y, nativeDepth: size.x };
  }, [frameScene]);

  // Compute frame opening dimensions (same logic as main ArtworkFrame)
  const openingMeta = useMemo(() => {
    let posAttr: THREE.BufferAttribute | null = null;
    frameScene.traverse((child) => {
      const m = child as THREE.Mesh;
      if (m.isMesh && m.geometry) {
        const attr = m.geometry.getAttribute('position') as THREE.BufferAttribute | undefined;
        if (attr) posAttr = attr;
      }
    });

    if (!posAttr) return { width: frameMeta.nativeWidth * 0.75, height: frameMeta.nativeHeight * 0.80 };

    const attr = posAttr as THREE.BufferAttribute;
    // Find the maximum X (back of frame) and collect vertices near it
    let globalMaxX = -Infinity;
    for (let i = 0; i < attr.count; i++) {
      globalMaxX = Math.max(globalMaxX, attr.getX(i));
    }
    const threshold = globalMaxX - 0.01; // within 1cm of back face

    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    for (let i = 0; i < attr.count; i++) {
      if (attr.getX(i) > threshold) {
        const y = attr.getY(i);
        const z = attr.getZ(i);
        minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
      }
    }

    return {
      width: maxZ - minZ,   // Z axis = width of opening
      height: maxY - minY,  // Y axis = height of opening
    };
  }, [frameScene, frameMeta]);

  // Apply Y-180° flip to make artworks face outward (unless noFlip is set)
  // (ARTWORK_* planes in GLB have inconsistent normals, most face inward)
  const correctedQuat = useMemo((): [number, number, number, number] => {
    const q = new THREE.Quaternion(...quaternion);
    // Rotate 180° around Y axis to flip from wall-facing to room-facing
    if (!artwork.noFlip) {
      q.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI));
    }
    return [q.x, q.y, q.z, q.w];
  }, [quaternion, artwork.noFlip]);

  // Load + configure artwork texture
  useEffect(() => {
    let cancelled = false;
    const src = normalizeImageUrl(artwork.imageUrl);
    new THREE.TextureLoader().load(
      src,
      (tex) => {
        if (cancelled) { tex.dispose(); return; }
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 8;
        tex.wrapS = THREE.ClampToEdgeWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.needsUpdate = true;
        const img = tex.image as (HTMLImageElement & { naturalWidth?: number; naturalHeight?: number }) | undefined;
        const w = Math.max(img?.naturalWidth ?? img?.width ?? 0, 1);
        const h = Math.max(img?.naturalHeight ?? img?.height ?? 0, 1);
        if (w > 0 && h > 0) setArtAspect(w / h);
        setTexture(tex);
      },
      undefined,
      (err) => console.warn('[AnchoredArtworkFrame] texture load failed:', src, err),
    );
    return () => { cancelled = true; };
  }, [artwork.imageUrl]);

  useEffect(() => { onClickRef.current = onClick; }, [onClick]);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.userData.onInteract = () => onClickRef.current?.(artwork);
    }
  }, [artwork]);

  useEffect(() => {
    if (spotRef.current && spotTargetRef.current) {
      spotRef.current.target = spotTargetRef.current;
    }
  });

  // Compute adaptive frame dimensions based on artwork aspect ratio
  // Target art dimensions: fixed height, width derived from aspect ratio
  const artTargetW = ART_TARGET_H * artAspect;
  const artTargetH = ART_TARGET_H;

  // Outer frame dimensions: artwork + border on all sides
  let outerW = artTargetW + FRAME_BORDER * 2;
  let outerH = artTargetH + FRAME_BORDER * 2;

  // Clamp outer width to reasonable range
  outerW = Math.max(MIN_OUTER_W, Math.min(MAX_OUTER_W, outerW));

  // If we clamped width, recompute height to maintain aspect ratio
  if (outerW !== artTargetW + FRAME_BORDER * 2) {
    const clampedArtW = outerW - FRAME_BORDER * 2;
    const clampedArtH = clampedArtW / artAspect;
    outerH = clampedArtH + FRAME_BORDER * 2;
  }

  // Scale frame GLB to computed outer dimensions
  const widthScale = outerW / frameMeta.nativeWidth;
  const heightScale = outerH / frameMeta.nativeHeight;
  const depthScale = 1.0;

  // Art plane dimensions: exact artwork size (no letterboxing)
  const planeW = Math.min(artTargetW, outerW - FRAME_BORDER * 2);
  const planeH = planeW / artAspect;

  // After inner +π/2 Y rotation, native X (depth) maps to outer +Z.
  // Art plane sits slightly recessed inside the frame front face.
  const artZ = (frameMeta.nativeDepth / 2) * depthScale - 0.01;

  return (
    <group position={position} quaternion={correctedQuat}>
      {/* Invisible target for spotlight */}
      <group ref={spotTargetRef} position={[0, 0, artZ]} />

      {/* GLB frame — inner +π/2 Y rotation aligns depth along Z (into room) */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Clone
          object={frameScene}
          scale={[depthScale, heightScale, widthScale]}
          castShadow
          receiveShadow
        />
      </group>

      {/* Art plane — MeshBasicMaterial: immune to tone mapping.
          polygonOffset prevents z-fighting against the anchor plane. */}
      <mesh
        ref={meshRef}
        position={[0, 0, artZ]}
        onClick={onClick ? () => onClick(artwork) : undefined}
      >
        <planeGeometry args={[planeW, planeH]} />
        <meshBasicMaterial
          key={texture ? 'textured' : 'fallback'}
          color={texture ? 0xffffff : 0x2b2b2b}
          map={texture ?? undefined}
          polygonOffset
          polygonOffsetFactor={-1}
          polygonOffsetUnits={-1}
        />
      </mesh>

      {/* Overhead spot — subtle fill on frame */}
      <spotLight
        ref={spotRef}
        position={[0, 3.6, 1.2]}
        intensity={1.4}
        distance={7.5}
        angle={Math.PI / 8}
        penumbra={0.55}
        decay={1.1}
      />

      {/* In-scene museum placard — positioned below frame with adaptive sizing */}
      <Html
        position={[0, -(outerH / 2 + PLAQUE_GAP + PLAQUE_H / 2), PLAQUE_Z]}
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
            // Plaque width scales with frame width: 75% of frame, capped at PLAQUE_MAX_W
            // Convert meters to approximate pixels (distanceFactor=3.5 means ~140-200px range)
            maxWidth: Math.min(outerW * 0.75, PLAQUE_MAX_W) * 140,
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

interface AnchorPlacement {
  artwork: MuseumArtwork;
  position: [number, number, number];
  quaternion: [number, number, number, number];
}

/**
 * Reads ARTWORK_00…ARTWORK_25 anchor planes from the loaded museum GLB,
 * hides them, maps artworks to anchors via:
 *   1. explicit `artwork.anchor` field
 *   2. GLB node `userData.artId` / `userData.anchorKey`
 *   3. sequential fill by numeric anchor order
 * Renders each assigned anchor as an AnchoredArtworkFrame at the anchor's
 * world position and rotation (anchor dimensions are ignored — frames render
 * at fixed museum-standard sizes).
 */
export function AnchoredArtworks({
  artworks,
  onArtworkClick,
}: {
  artworks: MuseumArtwork[];
  onArtworkClick?: (artwork: MuseumArtwork) => void;
}) {
  const { museumGroupRef } = useMuseumScene();
  const [placements, setPlacements] = useState<AnchorPlacement[]>([]);
  // doneRef: guarantees the scan runs exactly once, even across React Strict Mode
  // double-invoke or any future re-renders.
  const doneRef = useRef(false);

  // Keep artworks accessible inside the effect without adding it as a dep
  // (artworks are defined once via useMemo in the parent, so this is safe).
  const artworksRef = useRef(artworks);
  artworksRef.current = artworks;

  useEffect(() => {
    if (doneRef.current) return;

    let raf1 = 0;
    let raf2 = 0;

    // Retry loop: wait for museumGroupRef to be populated, then scan.
    // Uses requestAnimationFrame so at least 2 Three.js render frames have run
    // and all world matrices are fully propagated before we decompose them.
    const scan = () => {
      if (doneRef.current) return;
      const group = museumGroupRef.current;
      if (!group) {
        // Museum not mounted yet — retry next frame
        raf2 = requestAnimationFrame(scan);
        return;
      }

      doneRef.current = true;
      group.updateMatrixWorld(true);

      // 1. Collect and hide all ARTWORK_* meshes
      const anchorMeshes: THREE.Mesh[] = [];
      group.traverse((child) => {
        if (child.name.startsWith('ARTWORK_')) {
          anchorMeshes.push(child as THREE.Mesh);
          child.visible = false;
        }
      });

      if (anchorMeshes.length === 0) {
        console.warn('[AnchoredArtworks] No ARTWORK_* meshes found in museum GLB — no artworks placed.');
        return;
      }

      // Sort by numeric suffix ascending (ARTWORK_00, ARTWORK_01, …)
      anchorMeshes.sort((a, b) => {
        const numA = parseInt(a.name.replace('ARTWORK_', ''), 10) || 0;
        const numB = parseInt(b.name.replace('ARTWORK_', ''), 10) || 0;
        return numA - numB;
      });

      const anchorMap = new Map(anchorMeshes.map((m) => [m.name, m]));
      const currentArtworks = artworksRef.current;

      // 2a. Pass 1 — explicit artwork.anchor field
      const assignment = new Map<string, MuseumArtwork>();
      const unassigned: MuseumArtwork[] = [];
      for (const artwork of currentArtworks) {
        if (artwork.anchor && anchorMap.has(artwork.anchor)) {
          assignment.set(artwork.anchor, artwork);
        } else {
          unassigned.push(artwork);
        }
      }

      // 2b. Pass 2 — GLB userData (artId or anchorKey)
      const stillUnassigned: MuseumArtwork[] = [];
      for (const artwork of unassigned) {
        let matched = false;
        for (const [name, mesh] of anchorMap) {
          if (assignment.has(name)) continue;
          const ud = mesh.userData as Record<string, unknown>;
          if (ud.artId === artwork.id || ud.anchorKey === artwork.id) {
            assignment.set(name, artwork);
            matched = true;
            break;
          }
        }
        if (!matched) stillUnassigned.push(artwork);
      }

      // 2c. Pass 3 — sequential fill
      let fillIdx = 0;
      for (const mesh of anchorMeshes) {
        if (!assignment.has(mesh.name) && fillIdx < stillUnassigned.length) {
          assignment.set(mesh.name, stillUnassigned[fillIdx++]!);
        }
      }

      // 3. Build placement data from each filled anchor's world transform
      // (position + quaternion only — sizing is fixed per artwork, not from anchor)
      const tempPlacements: AnchorPlacement[] = [];
      const pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();
      const scl = new THREE.Vector3();

      for (const mesh of anchorMeshes) {
        const artwork = assignment.get(mesh.name);
        if (!artwork) continue;

        // Decompose world matrix for position and quaternion
        mesh.matrixWorld.decompose(pos, quat, scl);

        tempPlacements.push({
          artwork,
          position: [pos.x, pos.y, pos.z],
          quaternion: [quat.x, quat.y, quat.z, quat.w],
        });
      }

      // 4. Find lowest Y position and add padding to prevent floor contact
      const minY = Math.min(...tempPlacements.map((p) => p.position[1]));
      const FLOOR_PADDING = 0.25; // meters above floor

      const newPlacements = tempPlacements.map((placement) => {
        // Only add padding to artworks at or near the lowest level
        if (Math.abs(placement.position[1] - minY) < 0.1) {
          return {
            ...placement,
            position: [
              placement.position[0],
              placement.position[1] + FLOOR_PADDING,
              placement.position[2],
            ] as [number, number, number],
          };
        }
        return placement;
      });

      setPlacements(newPlacements);
    };

    // Skip 2 rAFs so Three.js has rendered at least twice and all
    // parent group transforms / world matrices are fully propagated.
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(scan);
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {placements.map(({ artwork, position, quaternion }) => (
        <AnchoredArtworkFrame
          key={artwork.id}
          artwork={artwork}
          position={position}
          quaternion={quaternion}
          onClick={onArtworkClick}
        />
      ))}
    </>
  );
}
