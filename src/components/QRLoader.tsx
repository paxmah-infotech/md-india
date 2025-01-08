'use client';

import { siteConfig } from '@/config/site.config';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const QRLoader = () => {
  const gridSize = 5;
  const centerPiece = Math.floor(gridSize / 2);
  const [delays, setDelays] = useState<number[]>([]);

  useEffect(() => {
    // Generate random delays on the client side only
    setDelays(Array.from({ length: gridSize * gridSize }, () => Math.random() * 0.5));
  }, []);

  // Function to check if a position is a corner piece
  const isCornerPiece = (row: number, col: number) => {
    return (
      // Top-left corner
      (row < 2 && col < 2) ||
      // Top-right corner
      (row < 2 && col > gridSize - 3) ||
      // Bottom-left corner
      (row > gridSize - 3 && col < 2)
    );
  };

  // Animation variants for squares
  const squareVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="relative">
        {/* QR Code Grid */}
        <div 
          className="grid gap-1"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          }}
        >
          {delays.map((delay, idx) => {
            const row = Math.floor(idx / gridSize);
            const col = idx % gridSize;
            const isCorner = isCornerPiece(row, col);
            const isCenter = row === centerPiece && col === centerPiece;
            
            // Skip rendering for pieces that should be transparent
            if (!isCorner && !isCenter) {
              return (
                <motion.div
                  key={idx}
                  variants={squareVariants}
                  initial="initial"
                  animate="animate"
                  transition={{
                    duration: 0.5,
                    delay,
                    repeat: Infinity,
                    repeatType: "reverse",
                    repeatDelay: 1
                  }}
                  className="w-4 h-4 sm:w-6 sm:h-6 rounded-sm bg-transparent"
                />
              );
            }

            return (
              <motion.div
                key={idx}
                variants={squareVariants}
                initial="initial"
                animate="animate"
                transition={{
                  duration: 0.5,
                  delay: delay * 0.6,
                }}
                className="w-4 h-4 sm:w-6 sm:h-6 bg-blue-600 rounded-sm"
              />
            );
          })}
        </div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center"
        >
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            {siteConfig.name}
          </h2>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </motion.div>
      </div>
    </div>
  );
};

export default QRLoader;
