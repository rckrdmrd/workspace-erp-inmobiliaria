/**
 * PowerUpUsageModal Component
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Coins, AlertTriangle, type LucideIcon } from 'lucide-react';
import type { PowerUp } from '../../types/powerUpsTypes';

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Coins,
  AlertTriangle,
};

interface PowerUpUsageModalProps {
  powerUp: PowerUp;
  action: 'purchase' | 'use';
  onConfirm: () => void;
  onCancel: () => void;
  canAfford?: boolean;
}

export const PowerUpUsageModal: React.FC<PowerUpUsageModalProps> = ({
  powerUp,
  action,
  onConfirm,
  onCancel,
  canAfford = true,
}) => {
  const Icon = iconMap[powerUp.icon] || Zap;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-detective p-6 max-w-md w-full shadow-detective-lg"
        >
          <div className="text-center mb-6">
            <div className="inline-block p-4 rounded-full bg-gradient-to-br from-detective-orange to-detective-gold mb-4">
              <Icon className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-detective-2xl font-bold text-detective-text mb-2">
              {action === 'purchase' ? 'Comprar' : 'Usar'} Power-up
            </h2>
            <h3 className="text-detective-xl font-semibold text-detective-orange">
              {powerUp.name}
            </h3>
          </div>

          <div className="bg-detective-bg rounded-detective p-4 mb-6">
            <p className="text-detective-text-secondary mb-4">
              {powerUp.description}
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-detective-sm text-detective-text-secondary">Efecto:</span>
                <span className="text-detective-base font-semibold text-detective-text">
                  {powerUp.effect.description}
                </span>
              </div>

              {action === 'purchase' && (
                <div className="flex items-center justify-between">
                  <span className="text-detective-sm text-detective-text-secondary">Costo:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-detective-gold" />
                    <span className="text-detective-lg font-bold text-detective-text">
                      {powerUp.price} ML
                    </span>
                  </div>
                </div>
              )}

              {powerUp.duration && (
                <div className="flex items-center justify-between">
                  <span className="text-detective-sm text-detective-text-secondary">Duración:</span>
                  <span className="text-detective-base font-semibold text-detective-text">
                    {powerUp.duration} minutos
                  </span>
                </div>
              )}

              {powerUp.cooldown && action === 'use' && (
                <div className="flex items-center justify-between">
                  <span className="text-detective-sm text-detective-text-secondary">Enfriamiento:</span>
                  <span className="text-detective-base font-semibold text-detective-text">
                    {powerUp.cooldown} minutos
                  </span>
                </div>
              )}
            </div>
          </div>

          {!canAfford && (
            <div className="bg-red-50 border border-red-200 rounded-detective p-3 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <p className="text-detective-sm text-red-600">
                No tienes suficientes ML Coins para esta compra
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-detective-text py-3 rounded-detective font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={!canAfford}
              className="flex-1 bg-detective-orange text-white py-3 rounded-detective font-semibold hover:bg-detective-orange-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
