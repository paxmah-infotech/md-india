'use client';

import { useEffect, useState } from 'react';

interface ClientSideWrapperProps {
  children: React.ReactNode;
  className?: string;
  initialClassName?: string;
}

export default function ClientSideWrapper({ 
  children, 
  className = '', 
  initialClassName = ''
}: ClientSideWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and initial client render, use the initialClassName
  if (!mounted) {
    return <div className={initialClassName}>{children}</div>;
  }

  // After mounting on client, use the dynamic className
  return <div className={className}>{children}</div>;
}
