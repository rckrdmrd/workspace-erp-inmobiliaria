/**
 * usePowerUps Hook
 */

import { useEffect } from 'react';
import { usePowerUpsStore } from '../store/powerUpsStore';

export const usePowerUps = () => {
  const {
    powerUps,
    inventory,
    userMlCoins,
    purchasePowerUp,
    usePowerUp,
    refreshActivePowerUps,
    addMlCoins,
    deductMlCoins,
  } = usePowerUpsStore();

  useEffect(() => {
    const interval = setInterval(() => {
      refreshActivePowerUps();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, [refreshActivePowerUps]);

  const canAffordPowerUp = (powerUpId: string): boolean => {
    const powerUp = powerUps.find((p) => p.id === powerUpId);
    return powerUp ? userMlCoins >= powerUp.price : false;
  };

  const getActivePowerUps = () => {
    return inventory.active;
  };

  const getOwnedPowerUps = () => {
    return inventory.owned;
  };

  const getAvailablePowerUps = () => {
    return powerUps.filter((p) => p.status === 'available' && p.owned && p.quantity > 0);
  };

  return {
    powerUps,
    inventory,
    userMlCoins,
    purchasePowerUp,
    usePowerUp,
    canAffordPowerUp,
    getActivePowerUps,
    getOwnedPowerUps,
    getAvailablePowerUps,
    addMlCoins,
    deductMlCoins,
  };
};
