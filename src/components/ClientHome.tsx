'use client';

import dynamic from 'next/dynamic';

const HomeComponent = dynamic(() => import('./Home'), {
  ssr: false,
});

export default function ClientHome() {
  return <HomeComponent />;
}
