'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

// Dynamically import Home component with no SSR
const Home = dynamic(() => import('@/components/Home'), { ssr: false });

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Home />
      </main>
      <Footer />
    </div>
  );
}
