'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ClientSideWrapper from './ClientSideWrapper';

interface QRCodePreviewProps {
  isLoading?: boolean;
}

export const QRCodePreview: React.FC<QRCodePreviewProps> = ({ isLoading = false }) => {
  const [pattern, setPattern] = useState<boolean[]>([]);

  useEffect(() => {
    // Generate a random pattern for the QR code preview
    const generatePattern = () => {
      const newPattern = Array(16).fill(false).map(() => Math.random() > 0.5);
      setPattern(newPattern);
    };

    generatePattern();
    
    // Regenerate pattern every 3 seconds if loading
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(generatePattern, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  return (
    <ClientSideWrapper
      initialClassName="w-32 h-32 mx-auto bg-white rounded-lg shadow-inner flex items-center justify-center"
      className="w-32 h-32 mx-auto bg-white rounded-lg shadow-inner flex items-center justify-center"
    >
      <div className="grid grid-cols-4 gap-1 p-2">
        {pattern.map((value, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              backgroundColor: value ? '#1f2937' : 'transparent',
              scale: isLoading && value ? [1, 1.1, 1] : 1,
            }}
            transition={{
              backgroundColor: { duration: 0.2 },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-6 h-6 rounded-sm"
          />
        ))}
      </div>
    </ClientSideWrapper>
  );
};
