/**
 * RankUpModal Component
 *
 * Celebration modal for rank-ups with confetti and animations.
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { RankBadgeAdvanced } from './RankBadgeAdvanced';
import { useProgression } from '../hooks/useProgression';
import { useRank } from '../hooks/useRank';

export interface RankUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Confetti Particle Component
 */
const ConfettiParticle: React.FC<{ delay: number }> = ({ delay }) => {
  const colors = ['#60a5fa', '#4ade80', '#fb923c', '#a78bfa', '#f59e0b'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const startX = Math.random() * 100;
  const endX = startX + (Math.random() - 0.5) * 50;
  const rotation = Math.random() * 360;

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{
        backgroundColor: color,
        left: `${startX}%`,
        top: -20,
      }}
      initial={{ y: 0, x: 0, opacity: 1, rotate: 0 }}
      animate={{
        y: window.innerHeight,
        x: endX - startX,
        opacity: 0,
        rotate: rotation,
      }}
      transition={{
        duration: 2 + Math.random(),
        delay,
        ease: 'easeIn',
      }}
    />
  );
};

/**
 * RankUpModal Component
 */
export const RankUpModal: React.FC<RankUpModalProps> = ({ isOpen, onClose }) => {
  const { closeRankUpModal } = useProgression();
  const { currentRank, previousRank, currentLevel, prestigeLevel } = useRank();

  // Generate confetti particles
  const confettiCount = 50;
  const confettiParticles = Array.from({ length: confettiCount }, (_, i) => i);

  // Auto-close after 5 seconds (optional)
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        handleClose();
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    closeRankUpModal();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            {/* Confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {confettiParticles.map((i) => (
                <ConfettiParticle key={i} delay={i * 0.02} />
              ))}
            </div>

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Header with gradient background */}
              <div
                className={cn(
                  'relative px-8 pt-12 pb-8 text-white',
                  'bg-gradient-to-br',
                  currentRank.gradient
                )}
              >
                {/* Trophy Icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                  className="flex justify-center mb-4"
                >
                  <div className="p-4 bg-white/20 rounded-full backdrop-blur-sm">
                    <Trophy className="w-12 h-12" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-center mb-2"
                >
                  ¡Felicitaciones!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-white/90"
                >
                  Has alcanzado un nuevo rango
                </motion.p>
              </div>

              {/* Content */}
              <div className="px-8 py-6 space-y-6">
                {/* Rank Progression */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-center gap-4"
                >
                  {previousRank && (
                    <>
                      <RankBadgeAdvanced
                        rank={previousRank.id}

                        prestigeLevel={prestigeLevel}
                        animated={false}
                      />
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </>
                  )}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.8, 1.1, 1] }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                  >
                    <RankBadgeAdvanced
                      rank={currentRank.id}

                      prestigeLevel={prestigeLevel}
                      showGlow={true}
                    />
                  </motion.div>
                </motion.div>

                {/* Rank Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="text-center space-y-2"
                >
                  <h3 className="text-2xl font-bold text-detective-text">
                    {currentRank.nameSpanish}
                  </h3>
                  <p className="text-detective-text-secondary">
                    {currentRank.description}
                  </p>
                </motion.div>

                {/* New Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                  className="bg-amber-50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-2 text-amber-800">
                    <Sparkles className="w-5 h-5" />
                    <h4 className="font-semibold">Beneficios Desbloqueados</h4>
                  </div>
                  <ul className="space-y-2">
                    {currentRank.benefits.map((benefit, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.1 + index * 0.1 }}
                        className="flex items-start gap-2 text-sm text-detective-text"
                      >
                        <span className="text-amber-500 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Multiplier Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="text-center"
                >
                  <div className="inline-block bg-gradient-to-r from-detective-orange to-detective-orange-dark text-white px-6 py-3 rounded-full font-bold text-lg">
                    {currentRank.multiplier.toFixed(2)}x Multiplicador
                  </div>
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.3 }}
                  onClick={handleClose}
                  className="w-full bg-detective-blue hover:bg-detective-blue/90 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  ¡Continuar!
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
