'use client';

import * as THREE from 'three';

// Room dimensions — match the original vanilla Three.js scene exactly
export const ROOM_W = 14;
export const ROOM_H = 4.2;
export const ROOM_D = 28;

const BASEBOARD_H = 0.09;
const BASEBOARD_T = 0.035;

// Back wall windows — 3 tall panes evenly spaced
const WIN_W = 1.8;
const WIN_H_LOCAL = 2.6;
const WIN_Y_BTM_LOCAL = -1.3; // local y on back-wall mesh (world y = ROOM_H/2 + WIN_Y_BTM_LOCAL = 0.8)
const WIN_X_CENTERS = [-4, 0, 4] as const;
const WIN_FRAME_T = 0.055;
const WIN_FRAME_D = 0.12;
const WIN_SILL_D = 0.26;
const WIN_Y_CENTER_WORLD = ROOM_H / 2 + WIN_Y_BTM_LOCAL + WIN_H_LOCAL / 2; // = 2.1

// Build back-wall ShapeGeometry with rectangular window holes
const backWallShape = (() => {
  const shape = new THREE.Shape();
  // Outer wall — counterclockwise (viewed from +Z / inside room)
  shape.moveTo(-ROOM_W / 2, -ROOM_H / 2);
  shape.lineTo( ROOM_W / 2, -ROOM_H / 2);
  shape.lineTo( ROOM_W / 2,  ROOM_H / 2);
  shape.lineTo(-ROOM_W / 2,  ROOM_H / 2);
  shape.closePath();
  // Window holes — clockwise
  for (const cx of WIN_X_CENTERS) {
    const hole = new THREE.Path();
    hole.moveTo(cx - WIN_W / 2, WIN_Y_BTM_LOCAL);
    hole.lineTo(cx - WIN_W / 2, WIN_Y_BTM_LOCAL + WIN_H_LOCAL);
    hole.lineTo(cx + WIN_W / 2, WIN_Y_BTM_LOCAL + WIN_H_LOCAL);
    hole.lineTo(cx + WIN_W / 2, WIN_Y_BTM_LOCAL);
    hole.closePath();
    shape.holes.push(hole);
  }
  return shape;
})();

/**
 * The museum room: floor, ceiling, four walls, and baseboards.
 * All dimensions and materials mirror the original vrMuseumScene.ts.
 */
export default function Museum() {
  return (
    <group>
      {/* Floor — warm oak parquet */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#c4a882" roughness={0.65} metalness={0} />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, ROOM_H, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_D]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.96} metalness={0} />
      </mesh>

      {/* Ceiling track rail — thin bar running full gallery length */}
      <mesh position={[0, ROOM_H - 0.04, 2]}>
        <boxGeometry args={[0.06, 0.06, ROOM_D - 1]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Track light heads — 5 fixtures matching point light Z positions */}
      {([-10, -4, 2, 8, 14] as number[]).map((z) => (
        <mesh key={z} position={[0, ROOM_H - 0.1, z]}>
          <cylinderGeometry args={[0.055, 0.04, 0.14, 8]} />
          <meshStandardMaterial color="#222222" roughness={0.3} metalness={0.7} />
        </mesh>
      ))}

      {/* Back wall with three window cutouts */}
      <mesh position={[0, ROOM_H / 2, -ROOM_D / 2]} castShadow receiveShadow>
        <shapeGeometry args={[backWallShape]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.92} metalness={0} side={THREE.DoubleSide} />
      </mesh>

      {/* Exterior sky — Hamptons summer blue, visible through windows */}
      <mesh position={[0, 3.5, -ROOM_D / 2 - 2]}>
        <planeGeometry args={[38, 22]} />
        <meshBasicMaterial color="#87CEEB" />
      </mesh>

      {/* Exterior lawn */}
      <mesh position={[0, 0, -ROOM_D / 2 - 10.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[38, 20]} />
        <meshBasicMaterial color="#7AAB52" />
      </mesh>

      {/* Window frames + 6-pane mullion grid */}
      {(WIN_X_CENTERS as readonly number[]).map((cx) => (
        <group key={cx} position={[cx, WIN_Y_CENTER_WORLD, -ROOM_D / 2]}>
          {/* Top rail */}
          <mesh castShadow position={[0, WIN_H_LOCAL / 2 + WIN_FRAME_T / 2, 0]}>
            <boxGeometry args={[WIN_W + WIN_FRAME_T * 2, WIN_FRAME_T, WIN_FRAME_D]} />
            <meshStandardMaterial color="#e8e4dc" roughness={0.5} metalness={0} />
          </mesh>
          {/* Bottom rail */}
          <mesh castShadow position={[0, -(WIN_H_LOCAL / 2 + WIN_FRAME_T / 2), 0]}>
            <boxGeometry args={[WIN_W + WIN_FRAME_T * 2, WIN_FRAME_T, WIN_FRAME_D]} />
            <meshStandardMaterial color="#e8e4dc" roughness={0.5} metalness={0} />
          </mesh>
          {/* Left stile */}
          <mesh castShadow position={[-(WIN_W / 2 + WIN_FRAME_T / 2), 0, 0]}>
            <boxGeometry args={[WIN_FRAME_T, WIN_H_LOCAL, WIN_FRAME_D]} />
            <meshStandardMaterial color="#e8e4dc" roughness={0.5} metalness={0} />
          </mesh>
          {/* Right stile */}
          <mesh castShadow position={[WIN_W / 2 + WIN_FRAME_T / 2, 0, 0]}>
            <boxGeometry args={[WIN_FRAME_T, WIN_H_LOCAL, WIN_FRAME_D]} />
            <meshStandardMaterial color="#e8e4dc" roughness={0.5} metalness={0} />
          </mesh>
          {/* Center vertical mullion */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[WIN_FRAME_T * 0.7, WIN_H_LOCAL, WIN_FRAME_D]} />
            <meshStandardMaterial color="#e8e4dc" roughness={0.5} metalness={0} />
          </mesh>
          {/* Horizontal glazing bars — divide window into 3 rows */}
          {([-0.433, 0.433] as const).map((ry) => (
            <mesh castShadow key={ry} position={[0, ry, 0]}>
              <boxGeometry args={[WIN_W, WIN_FRAME_T * 0.7, WIN_FRAME_D]} />
              <meshStandardMaterial color="#e8e4dc" roughness={0.5} metalness={0} />
            </mesh>
          ))}
          {/* Interior sill — extends into room from window bottom */}
          <mesh castShadow position={[0, -(WIN_H_LOCAL / 2 + WIN_FRAME_T / 2), WIN_FRAME_D / 2 + WIN_SILL_D / 2]}>
            <boxGeometry args={[WIN_W + WIN_FRAME_T * 2 + 0.08, WIN_FRAME_T * 1.5, WIN_SILL_D]} />
            <meshStandardMaterial color="#ede9e2" roughness={0.4} metalness={0} />
          </mesh>
        </group>
      ))}

      {/* Front wall */}
      <mesh position={[0, ROOM_H / 2, ROOM_D / 2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_W, ROOM_H]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.92} metalness={0} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.92} metalness={0} />
      </mesh>

      {/* Right wall */}
      <mesh position={[ROOM_W / 2, ROOM_H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_D, ROOM_H]} />
        <meshStandardMaterial color="#f2f2f2" roughness={0.92} metalness={0} />
      </mesh>

      {/* Baseboards */}
      {/* Back */}
      <mesh position={[0, BASEBOARD_H / 2, -ROOM_D / 2 + BASEBOARD_T / 2]}>
        <boxGeometry args={[ROOM_W, BASEBOARD_H, BASEBOARD_T]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.75} metalness={0} />
      </mesh>
      {/* Front */}
      <mesh position={[0, BASEBOARD_H / 2, ROOM_D / 2 - BASEBOARD_T / 2]}>
        <boxGeometry args={[ROOM_W, BASEBOARD_H, BASEBOARD_T]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.75} metalness={0} />
      </mesh>
      {/* Left */}
      <mesh position={[-ROOM_W / 2 + BASEBOARD_T / 2, BASEBOARD_H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM_D, BASEBOARD_H, BASEBOARD_T]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.75} metalness={0} />
      </mesh>
      {/* Right */}
      <mesh position={[ROOM_W / 2 - BASEBOARD_T / 2, BASEBOARD_H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[ROOM_D, BASEBOARD_H, BASEBOARD_T]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.75} metalness={0} />
      </mesh>
    </group>
  );
}
