'use client';

import { createContext, useContext, useRef, type MutableRefObject, type ReactNode } from 'react';
import * as THREE from 'three';

interface MuseumSceneContextValue {
  /** The transformed museum group (already scaled/offset to room coordinates) */
  museumGroupRef: MutableRefObject<THREE.Group | null>;
}

const MuseumSceneContext = createContext<MuseumSceneContextValue | null>(null);

export function MuseumSceneProvider({ children }: { children: ReactNode }) {
  const museumGroupRef = useRef<THREE.Group>(null);
  return (
    <MuseumSceneContext.Provider value={{ museumGroupRef }}>
      {children}
    </MuseumSceneContext.Provider>
  );
}

export function useMuseumScene() {
  const ctx = useContext(MuseumSceneContext);
  if (!ctx) throw new Error('useMuseumScene must be used within MuseumSceneProvider');
  return ctx;
}
