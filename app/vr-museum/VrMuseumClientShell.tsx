'use client';

import dynamic from 'next/dynamic';

type VrMuseumClientProps = {
  variant?: 'page' | 'embed';
};

const VrMuseumClient = dynamic(() => import('./VrMuseumClient'), { ssr: false });

export default function VrMuseumClientShell({ variant = 'page' }: VrMuseumClientProps) {
  return <VrMuseumClient variant={variant} />;
}
