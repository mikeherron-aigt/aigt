'use client';

import dynamic from 'next/dynamic';

const VrMuseumClient = dynamic(() => import('./VrMuseumClient'), { ssr: false });

export default function VrMuseumClientShell() {
  return <VrMuseumClient />;
}
