/**
 * PowerUpShop Component
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { usePowerUps } from '../../hooks/usePowerUps';
import { PowerUpCard } from './PowerUpCard';
import { PowerUpUsageModal } from './PowerUpUsageModal';
import type { PowerUp } from '../../types/powerUpsTypes';

export const PowerUpShop: React.FC = () => {
  const { powerUps, userMlCoins, purchasePowerUp, canAffordPowerUp } = usePowerUps();
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handlePurchase = (powerUpId: string) => {
    const powerUp = powerUps.find((p) => p.id === powerUpId);
    if (powerUp) {
      setSelectedPowerUp(powerUp);
      setShowModal(true);
    }
  };

  const confirmPurchase = () => {
    if (selectedPowerUp && purchasePowerUp(selectedPowerUp.id)) {
      setShowModal(false);
      setSelectedPowerUp(null);
    }
  };

  const corePowerUps = powerUps.filter((p) => p.type === 'core');
  const advancedPowerUps = powerUps.filter((p) => p.type === 'advanced');

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="bg-gradient-to-r from-detective-orange to-detective-gold p-6 rounded-detective text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-detective-3xl font-bold mb-2">Tienda de Power-ups</h1>
            <p className="text-detective-lg opacity-90">
              Mejora tu experiencia de aprendizaje
            </p>
          </div>
          <div className="text-right">
            <p className="text-detective-sm opacity-80 mb-1">Tu Balance</p>
            <div className="flex items-center gap-2 text-detective-3xl font-bold">
              <Icons.Coins className="w-8 h-8" />
              {userMlCoins} ML
            </div>
          </div>
        </div>
      </div>

      {/* Core Power-ups */}
      <div>
        <h2 className="text-detective-2xl font-bold text-detective-text mb-4 flex items-center gap-2">
          <Icons.Zap className="w-6 h-6 text-detective-orange" />
          Power-ups Básicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {corePowerUps.map((powerUp) => (
            <PowerUpCard
              key={powerUp.id}
              powerUp={powerUp}
              onPurchase={() => handlePurchase(powerUp.id)}
              showActions={!powerUp.owned}
            />
          ))}
        </div>
      </div>

      {/* Advanced Power-ups */}
      <div>
        <h2 className="text-detective-2xl font-bold text-detective-text mb-4 flex items-center gap-2">
          <Icons.Crown className="w-6 h-6 text-detective-gold" />
          Power-ups Avanzados
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {advancedPowerUps.map((powerUp) => (
            <PowerUpCard
              key={powerUp.id}
              powerUp={powerUp}
              onPurchase={() => handlePurchase(powerUp.id)}
              showActions={!powerUp.owned}
            />
          ))}
        </div>
      </div>

      {/* Purchase Modal */}
      {showModal && selectedPowerUp && (
        <PowerUpUsageModal
          powerUp={selectedPowerUp}
          action="purchase"
          onConfirm={confirmPurchase}
          onCancel={() => {
            setShowModal(false);
            setSelectedPowerUp(null);
          }}
          canAfford={canAffordPowerUp(selectedPowerUp.id)}
        />
      )}
    </div>
  );
};
