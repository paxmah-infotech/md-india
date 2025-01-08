'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Import QRLoader dynamically with no SSR
const QRLoader = dynamic(() => import('@/components/QRLoader'), {
  ssr: false
});

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) return null;

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isLoading && <QRLoader />}
      <div className={isLoading ? 'hidden' : ''}>
        {children}
      </div>
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
