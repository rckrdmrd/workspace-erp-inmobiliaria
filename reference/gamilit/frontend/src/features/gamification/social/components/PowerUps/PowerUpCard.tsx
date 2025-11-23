/**
 * PowerUpCard Component
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Coins, Package, type LucideIcon } from 'lucide-react';
import type { PowerUp } from '../../types/powerUpsTypes';

// Icon mapping helper
const iconMap: Record<string, LucideIcon> = {
  Zap,
  Coins,
  Package,
};

interface PowerUpCardProps {
  powerUp: PowerUp;
  onPurchase?: () => void;
  onUse?: () => void;
  showActions?: boolean;
}

export const PowerUpCard: React.FC<PowerUpCardProps> = ({
  powerUp,
  onPurchase,
  onUse,
  showActions = true,
}) => {
  const Icon = iconMap[powerUp.icon] || Zap;
  const isAdvanced = powerUp.type === 'advanced';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -3 }}
      className={`bg-white rounded-detective p-5 shadow-card hover:shadow-card-hover transition-all border-2 ${
        isAdvanced ? 'border-detective-gold' : 'border-detective-orange'
      } ${powerUp.status === 'locked' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg ${
          isAdvanced ? 'bg-gradient-to-br from-detective-gold to-detective-orange' : 'bg-detective-orange'
        }`}>
          <Icon className="w-8 h-8 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-detective-lg text-detective-text">
              {powerUp.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              isAdvanced ? 'bg-detective-gold text-white' : 'bg-detective-orange text-white'
            }`}>
              {isAdvanced ? 'AVANZADO' : 'BÁSICO'}
            </span>
          </div>

          <p className="text-detective-sm text-detective-text-secondary mb-3">
            {powerUp.description}
          </p>

          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-detective-gold" />
              <span className="text-detective-base font-semibold">{powerUp.price} ML</span>
            </div>
            {powerUp.owned && (
              <div className="flex items-center gap-1 text-detective-success">
                <Package className="w-4 h-4" />
                <span className="text-detective-base font-semibold">x{powerUp.quantity}</span>
              </div>
            )}
          </div>

          {powerUp.duration && (
            <p className="text-detective-xs text-detective-text-secondary mb-2">
              Duración: {powerUp.duration} minutos
            </p>
          )}
          {powerUp.cooldown && (
            <p className="text-detective-xs text-detective-text-secondary mb-2">
              Enfriamiento: {powerUp.cooldown} minutos
            </p>
          )}

          {showActions && (
            <div className="flex gap-2 mt-3">
              {!powerUp.owned && onPurchase && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onPurchase}
                  disabled={powerUp.status === 'locked'}
                  className="flex-1 bg-detective-orange text-white py-2 rounded-detective font-semibold hover:bg-detective-orange-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Comprar
                </motion.button>
              )}
              {powerUp.owned && onUse && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onUse}
                  disabled={powerUp.status === 'cooldown' || powerUp.status === 'active' || powerUp.quantity === 0}
                  className="flex-1 bg-detective-orange text-white py-2 rounded-detective font-semibold hover:bg-detective-orange-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {powerUp.status === 'active' ? 'Activo' : powerUp.status === 'cooldown' ? 'Enfriamiento' : 'Usar'}
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
