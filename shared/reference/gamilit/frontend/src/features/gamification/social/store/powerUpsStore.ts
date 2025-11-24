/**
 * Power-ups Store
 * Zustand store for managing power-up state
 */

import { create } from 'zustand';
import type { PowerUp, ActivePowerUp, PowerUpInventory } from '../types/powerUpsTypes';
import { powerUpsMockData } from '../mockData/powerUpsMockData';

interface PowerUpsStore {
  powerUps: PowerUp[];
  inventory: PowerUpInventory;
  userMlCoins: number;

  // Actions
  purchasePowerUp: (powerUpId: string) => boolean;
  usePowerUp: (powerUpId: string) => boolean;
  refreshActivePowerUps: () => void;
  addMlCoins: (amount: number) => void;
  deductMlCoins: (amount: number) => boolean;
}

const calculateInventory = (powerUps: PowerUp[]): PowerUpInventory => {
  const owned = powerUps.filter((p) => p.owned);
  const active: ActivePowerUp[] = powerUps
    .filter((p) => p.status === 'active' && p.expiresAt)
    .map((p) => ({
      powerUpId: p.id,
      name: p.name,
      icon: p.icon,
      expiresAt: p.expiresAt!,
      remainingTime: Math.max(0, p.expiresAt!.getTime() - Date.now()) / 1000,
      effect: p.effect,
    }));

  return {
    owned,
    active,
    totalSpent: 0,
    totalUsages: owned.reduce((sum, p) => sum + p.usageCount, 0),
  };
};

export const usePowerUpsStore = create<PowerUpsStore>((set, get) => ({
  powerUps: powerUpsMockData,
  inventory: calculateInventory(powerUpsMockData),
  userMlCoins: 5000, // Mock starting coins

  purchasePowerUp: (powerUpId: string) => {
    const state = get();
    const powerUp = state.powerUps.find((p) => p.id === powerUpId);

    if (!powerUp || state.userMlCoins < powerUp.price) {
      return false;
    }

    set((state) => {
      const updatedPowerUps = state.powerUps.map((p) => {
        if (p.id === powerUpId) {
          return {
            ...p,
            owned: true,
            quantity: p.quantity + 1,
            status: 'available' as const,
          };
        }
        return p;
      });

      return {
        powerUps: updatedPowerUps,
        inventory: calculateInventory(updatedPowerUps),
        userMlCoins: state.userMlCoins - powerUp.price,
      };
    });

    return true;
  },

  usePowerUp: (powerUpId: string) => {
    const state = get();
    const powerUp = state.powerUps.find((p) => p.id === powerUpId);

    if (!powerUp || !powerUp.owned || powerUp.quantity <= 0 || powerUp.status === 'cooldown') {
      return false;
    }

    set((state) => {
      const now = new Date();
      const updatedPowerUps = state.powerUps.map((p) => {
        if (p.id === powerUpId) {
          const expiresAt = p.duration ? new Date(now.getTime() + p.duration * 60000) : undefined;
          const cooldownEndsAt = p.cooldown ? new Date(now.getTime() + p.cooldown * 60000) : undefined;

          return {
            ...p,
            quantity: p.quantity - 1,
            usageCount: p.usageCount + 1,
            status: p.duration ? ('active' as const) : p.cooldown ? ('cooldown' as const) : ('available' as const),
            activatedAt: now,
            expiresAt,
            cooldownEndsAt,
          };
        }
        return p;
      });

      return {
        powerUps: updatedPowerUps,
        inventory: calculateInventory(updatedPowerUps),
      };
    });

    return true;
  },

  refreshActivePowerUps: () => {
    set((state) => {
      const now = Date.now();
      const updatedPowerUps = state.powerUps.map((p) => {
        // Check if active power-up expired
        if (p.status === 'active' && p.expiresAt && p.expiresAt.getTime() <= now) {
          return {
            ...p,
            status: p.cooldown ? ('cooldown' as const) : ('available' as const),
            activatedAt: undefined,
            expiresAt: undefined,
          };
        }

        // Check if cooldown ended
        if (p.status === 'cooldown' && p.cooldownEndsAt && p.cooldownEndsAt.getTime() <= now) {
          return {
            ...p,
            status: 'available' as const,
            cooldownEndsAt: undefined,
          };
        }

        return p;
      });

      return {
        powerUps: updatedPowerUps,
        inventory: calculateInventory(updatedPowerUps),
      };
    });
  },

  addMlCoins: (amount: number) => {
    set((state) => ({
      userMlCoins: state.userMlCoins + amount,
    }));
  },

  deductMlCoins: (amount: number) => {
    const state = get();
    if (state.userMlCoins < amount) return false;

    set({ userMlCoins: state.userMlCoins - amount });
    return true;
  },
}));
