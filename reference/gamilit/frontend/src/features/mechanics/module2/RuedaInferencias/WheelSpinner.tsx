/**
 * WheelSpinner Component
 *
 * @description Animated spinning wheel for category selection
 * @task FE-071
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WheelSpinnerProps } from './ruedaInferenciasTypes';

export const WheelSpinner: React.FC<WheelSpinnerProps> = ({
  categories,
  isSpinning,
  onSpinComplete,
}) => {
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Calculate segment angle
  const segmentAngle = 360 / categories.length;

  useEffect(() => {
    if (isSpinning) {
      // Generate random rotation (3-5 full rotations + random offset)
      const fullRotations = 3 + Math.random() * 2; // 3-5 rotations
      const randomDegrees = Math.random() * 360;
      const totalRotation = rotation + (fullRotations * 360) + randomDegrees;

      setRotation(totalRotation);

      // Calculate selected category after animation completes
      setTimeout(() => {
        const normalizedRotation = totalRotation % 360;
        const selectedIdx = Math.floor(normalizedRotation / segmentAngle) % categories.length;
        setSelectedIndex(selectedIdx);
        onSpinComplete(categories[selectedIdx]);
      }, 3000); // Match animation duration
    }
  }, [isSpinning]);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Wheel Container */}
      <div className="relative w-80 h-80">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-red-500 drop-shadow-lg" />
        </div>

        {/* Wheel */}
        <motion.div
          className="w-full h-full rounded-full relative overflow-hidden shadow-2xl border-8 border-yellow-400"
          animate={{ rotate: rotation }}
          transition={{
            duration: isSpinning ? 3 : 0,
            ease: isSpinning ? [0.25, 0.1, 0.25, 1] : 'linear',
          }}
        >
          {categories.map((category, index) => {
            const angle = index * segmentAngle;
            const isSelected = selectedIndex === index && !isSpinning;

            return (
              <div
                key={category.id}
                className="absolute w-full h-full"
                style={{
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'center',
                }}
              >
                <div
                  className={`absolute w-1/2 h-1/2 origin-bottom-right flex items-end justify-center pb-4 pr-4 transition-all ${
                    isSelected ? 'scale-105' : ''
                  }`}
                  style={{
                    backgroundColor: category.color,
                    clipPath: `polygon(100% 100%, 0% 100%, 50% 0%)`,
                    transform: `rotate(${segmentAngle / 2}deg)`,
                  }}
                >
                  <div
                    className="text-white font-bold text-center"
                    style={{
                      transform: `rotate(-${angle + segmentAngle / 2}deg)`,
                      fontSize: '0.875rem',
                      lineHeight: '1.2',
                      maxWidth: '80px',
                    }}
                  >
                    <div className="text-2xl mb-1">{category.icon}</div>
                    <div>{category.name}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Center Circle */}
          <div className="absolute inset-0 m-auto w-16 h-16 bg-white rounded-full border-4 border-yellow-400 shadow-lg flex items-center justify-center">
            <div className="text-2xl">🎯</div>
          </div>
        </motion.div>
      </div>

      {/* Selected Category Display */}
      {selectedIndex !== null && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-lg shadow-lg p-6 border-4 border-blue-500 max-w-md"
        >
          <div className="text-center">
            <div className="text-4xl mb-2">{categories[selectedIndex].icon}</div>
            <h3 className="text-xl font-bold text-blue-600 mb-2">
              {categories[selectedIndex].name}
            </h3>
            <p className="text-gray-600 text-sm">
              {categories[selectedIndex].description}
            </p>
          </div>
        </motion.div>
      )}

      {/* Spin Status */}
      {isSpinning && (
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg px-6 py-3">
          <p className="text-yellow-800 font-semibold text-center">
            🎪 ¡Girando la ruleta...!
          </p>
        </div>
      )}
    </div>
  );
};
