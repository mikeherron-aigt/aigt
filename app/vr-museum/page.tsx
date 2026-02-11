
import dynamic from 'next/dynamic';

const VrMuseumClient = dynamic(() => import('./VrMuseumClient'), { ssr: false });

export default function VrMuseumPage() {
  return <VrMuseumClient />;
}
