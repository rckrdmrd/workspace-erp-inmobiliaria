/**
 * HintModal Component
 * Modal to display hints with ML Coins cost confirmation
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { X, Lightbulb, Coins, Lock, CheckCircle } from 'lucide-react';

export interface Hint {
  id: string;
  level: number;
  text: string;
  cost: number;
}

interface HintModalProps {
  isOpen: boolean;
  hints: Hint[];
  currentHintLevel: number;
  availableCoins: number;
  onClose: () => void;
  onUseHint: (hint: Hint) => void;
}

export const HintModal: React.FC<HintModalProps> = ({
  isOpen,
  hints,
  currentHintLevel,
  availableCoins,
  onClose,
  onUseHint,
}) => {
  const [selectedHint, setSelectedHint] = useState<Hint | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleHintClick = (hint: Hint) => {
    if (hint.level <= currentHintLevel) {
      // Already unlocked
      return;
    }

    if (hint.level === currentHintLevel + 1) {
      // Next hint to unlock
      if (hint.cost === 0 || availableCoins >= hint.cost) {
        setSelectedHint(hint);
        setShowConfirm(hint.cost > 0);
        if (hint.cost === 0) {
          handleConfirmUse(hint);
        }
      }
    }
  };

  const handleConfirmUse = (hint: Hint) => {
    onUseHint(hint);
    setShowConfirm(false);
    setSelectedHint(null);
  };

  const getHintStatus = (hint: Hint) => {
    if (hint.level <= currentHintLevel) {
      return 'unlocked';
    } else if (hint.level === currentHintLevel + 1) {
      return 'available';
    } else {
      return 'locked';
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-detective shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-detective-orange to-detective-gold p-6 rounded-t-detective">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Sistema de Pistas</h2>
                  <p className="text-sm text-white/80 mt-1">
                    Desbloquea pistas progresivamente para ayudarte
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* ML Coins Display */}
            <div className="mt-4 flex items-center gap-2 bg-white/20 rounded-detective px-4 py-2 w-fit">
              <Coins className="w-5 h-5 text-white" />
              <span className="text-white font-bold">
                {availableCoins} ML Coins disponibles
              </span>
            </div>
          </div>

          {/* Hints List */}
          <div className="p-6 space-y-4">
            {hints.map((hint, index) => {
              const status = getHintStatus(hint);
              const isUnlocked = status === 'unlocked';
              const isAvailable = status === 'available';
              const isLocked = status === 'locked';
              const canAfford = availableCoins >= hint.cost;

              return (
                <motion.div
                  key={hint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    p-5 rounded-detective border-2 transition-all
                    ${
                      isUnlocked
                        ? 'bg-green-50 border-green-300 dark:bg-green-900/20'
                        : isAvailable && canAfford
                        ? 'bg-detective-orange-light border-detective-orange hover:shadow-lg cursor-pointer'
                        : 'bg-gray-50 border-gray-300 dark:bg-gray-900/20 opacity-60'
                    }
                  `}
                  onClick={() => isAvailable && handleHintClick(hint)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`
                      p-3 rounded-full flex-shrink-0
                      ${
                        isUnlocked
                          ? 'bg-green-500'
                          : isAvailable
                          ? 'bg-detective-orange'
                          : 'bg-gray-400'
                      }
                    `}
                    >
                      {isUnlocked ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : isLocked ? (
                        <Lock className="w-6 h-6 text-white" />
                      ) : (
                        <Lightbulb className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-detective-text">
                          Pista Nivel {hint.level}
                        </h3>
                        <div className="flex items-center gap-2">
                          {hint.cost > 0 && !isUnlocked && (
                            <span
                              className={`
                              flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold
                              ${
                                canAfford
                                  ? 'bg-detective-gold text-white'
                                  : 'bg-red-100 text-red-700'
                              }
                            `}
                            >
                              <Coins className="w-4 h-4" />
                              {hint.cost}
                            </span>
                          )}
                          {hint.cost === 0 && !isUnlocked && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white">
                              GRATIS
                            </span>
                          )}
                          {isUnlocked && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-green-500 text-white">
                              DESBLOQUEADA
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Hint Text */}
                      {isUnlocked ? (
                        <p className="text-detective-text leading-relaxed">{hint.text}</p>
                      ) : isAvailable ? (
                        <p className="text-detective-text-secondary italic">
                          Haz clic para desbloquear esta pista
                          {hint.cost > 0 && ` por ${hint.cost} ML Coins`}
                        </p>
                      ) : (
                        <p className="text-detective-text-secondary italic">
                          Desbloquea la pista anterior primero
                        </p>
                      )}

                      {/* Insufficient Coins Warning */}
                      {isAvailable && !canAfford && hint.cost > 0 && (
                        <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-detective">
                          <p className="text-sm text-red-700 dark:text-red-400">
                            No tienes suficientes ML Coins. Necesitas {hint.cost - availableCoins}{' '}
                            más.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Confirmation Dialog */}
          <AnimatePresence>
            {showConfirm && selectedHint && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 rounded-detective"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white dark:bg-gray-800 rounded-detective p-6 max-w-md w-full shadow-2xl"
                >
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-detective-orange rounded-full flex items-center justify-center mb-4">
                      <Coins className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-detective-text mb-2">
                      Confirmar Uso de Pista
                    </h3>
                    <p className="text-detective-text-secondary mb-6">
                      ¿Estás seguro de que deseas usar {selectedHint.cost} ML Coins para
                      desbloquear esta pista?
                    </p>

                    <div className="flex gap-3">
                      <DetectiveButton
                        variant="secondary"
                        onClick={() => {
                          setShowConfirm(false);
                          setSelectedHint(null);
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </DetectiveButton>
                      <DetectiveButton
                        variant="primary"
                        onClick={() => handleConfirmUse(selectedHint)}
                        className="flex-1"
                      >
                        Confirmar
                      </DetectiveButton>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
