/**
 * PowerUps Integration Tests
 *
 * Tests for power-ups system integrating store with purchase/usage flows.
 *
 * Test Coverage:
 * - Store Initialization (2 tests): Initial state, structure
 * - Purchase PowerUp Flow (4 tests): Purchase, insufficient funds, quantity update, ML Coins deduction
 * - Use PowerUp Flow (4 tests): Use powerup, status change, cooldown, instant effects
 * - Inventory Management (3 tests): Owned items, active items, inventory calculation
 * - ML Coins Management (3 tests): Add coins, deduct coins, insufficient coins
 * - Refresh Active PowerUps (2 tests): Expire active, clear cooldowns
 *
 * Total: 18 tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { usePowerUpsStore } from '../store/powerUpsStore';
import type { PowerUp } from '../types/powerUpsTypes';

describe('PowerUps Integration Tests', () => {
  // ============================================================================
  // SETUP & MOCK DATA
  // ============================================================================

  const mockPowerUp1: PowerUp = {
    id: 'powerup-hint',
    name: 'Pista Mágica',
    description: 'Revela una pista para el ejercicio',
    type: 'core',
    price: 100,
    icon: '💡',
    effect: {
      type: 'hint',
      value: 1,
      description: 'Revela una pista',
    },
    status: 'available',
    usageCount: 0,
    owned: false,
    quantity: 0,
  };

  const mockPowerUp2: PowerUp = {
    id: 'powerup-vision',
    name: 'Visión Lectora',
    description: 'Resalta palabras clave',
    type: 'core',
    price: 150,
    icon: '👁️',
    effect: {
      type: 'vision',
      value: 30,
      description: 'Resalta palabras clave por 30 min',
    },
    duration: 30, // 30 minutes
    status: 'available',
    usageCount: 0,
    owned: false,
    quantity: 0,
  };

  const mockPowerUp3: PowerUp = {
    id: 'powerup-retry',
    name: 'Segunda Oportunidad',
    description: 'Permite reintentar un ejercicio',
    type: 'advanced',
    price: 200,
    icon: '🔄',
    effect: {
      type: 'retry',
      value: 1,
      description: 'Permite 1 reintento',
    },
    cooldown: 60, // 60 minutes
    status: 'available',
    usageCount: 0,
    owned: false,
    quantity: 0,
  };

  beforeEach(() => {
    // Reset store to initial state
    usePowerUpsStore.setState({
      powerUps: [mockPowerUp1, mockPowerUp2, mockPowerUp3],
      inventory: {
        owned: [],
        active: [],
        totalSpent: 0,
        totalUsages: 0,
      },
      userMlCoins: 5000,
    });
  });

  // ============================================================================
  // STORE INITIALIZATION TESTS
  // ============================================================================

  describe('Store Initialization', () => {
    it('should initialize with correct structure', () => {
      const state = usePowerUpsStore.getState();

      expect(state).toHaveProperty('powerUps');
      expect(state).toHaveProperty('inventory');
      expect(state).toHaveProperty('userMlCoins');
      expect(state).toHaveProperty('purchasePowerUp');
      expect(state).toHaveProperty('usePowerUp');
      expect(state).toHaveProperty('refreshActivePowerUps');
      expect(state).toHaveProperty('addMlCoins');
      expect(state).toHaveProperty('deductMlCoins');
    });

    it('should start with ML Coins and no owned powerups', () => {
      const state = usePowerUpsStore.getState();

      expect(state.userMlCoins).toBe(5000);
      expect(state.inventory.owned).toHaveLength(0);
      expect(state.inventory.active).toHaveLength(0);
    });
  });

  // ============================================================================
  // PURCHASE POWERUP FLOW TESTS
  // ============================================================================

  describe('Purchase PowerUp Flow', () => {
    it('should purchase powerup successfully', () => {
      const { purchasePowerUp } = usePowerUpsStore.getState();

      const success = purchasePowerUp('powerup-hint');

      expect(success).toBe(true);

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-hint');

      expect(powerUp?.owned).toBe(true);
      expect(powerUp?.quantity).toBe(1);
      expect(powerUp?.status).toBe('available');
    });

    it('should deduct ML Coins on purchase', () => {
      const { purchasePowerUp } = usePowerUpsStore.getState();

      const initialCoins = usePowerUpsStore.getState().userMlCoins;

      purchasePowerUp('powerup-hint'); // costs 100

      const finalCoins = usePowerUpsStore.getState().userMlCoins;

      expect(finalCoins).toBe(initialCoins - 100);
    });

    it('should not purchase if insufficient ML Coins', () => {
      const { purchasePowerUp } = usePowerUpsStore.getState();

      // Set low coins
      usePowerUpsStore.setState({ userMlCoins: 50 });

      const success = purchasePowerUp('powerup-hint'); // costs 100

      expect(success).toBe(false);

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-hint');

      expect(powerUp?.owned).toBe(false);
      expect(state.userMlCoins).toBe(50); // Unchanged
    });

    it('should increment quantity on multiple purchases', () => {
      const { purchasePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-hint');
      purchasePowerUp('powerup-hint');

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-hint');

      expect(powerUp?.quantity).toBe(2);
      expect(state.userMlCoins).toBe(5000 - 200); // 2 x 100
    });
  });

  // ============================================================================
  // USE POWERUP FLOW TESTS
  // ============================================================================

  describe('Use PowerUp Flow', () => {
    it('should use powerup with duration (set to active)', () => {
      const { purchasePowerUp, usePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-vision'); // has duration
      usePowerUp('powerup-vision');

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-vision');

      expect(powerUp?.status).toBe('active');
      expect(powerUp?.quantity).toBe(0); // Decremented
      expect(powerUp?.usageCount).toBe(1);
      expect(powerUp?.expiresAt).toBeDefined();
    });

    it('should use powerup with cooldown (set to cooldown)', () => {
      const { purchasePowerUp, usePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-retry'); // has cooldown
      usePowerUp('powerup-retry');

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-retry');

      expect(powerUp?.status).toBe('cooldown');
      expect(powerUp?.usageCount).toBe(1);
      expect(powerUp?.cooldownEndsAt).toBeDefined();
    });

    it('should use instant powerup (no duration, no cooldown)', () => {
      const { purchasePowerUp, usePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-hint'); // instant effect
      usePowerUp('powerup-hint');

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-hint');

      expect(powerUp?.status).toBe('available'); // Stays available
      expect(powerUp?.usageCount).toBe(1);
    });

    it('should not use powerup if not owned', () => {
      const { usePowerUp } = usePowerUpsStore.getState();

      const success = usePowerUp('powerup-hint');

      expect(success).toBe(false);

      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-hint');

      expect(powerUp?.usageCount).toBe(0);
    });
  });

  // ============================================================================
  // INVENTORY MANAGEMENT TESTS
  // ============================================================================

  describe('Inventory Management', () => {
    it('should track owned powerups in inventory', () => {
      const { purchasePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-hint');
      purchasePowerUp('powerup-vision');

      const state = usePowerUpsStore.getState();

      expect(state.inventory.owned).toHaveLength(2);
      expect(state.inventory.owned[0].id).toBe('powerup-hint');
      expect(state.inventory.owned[1].id).toBe('powerup-vision');
    });

    it('should track active powerups in inventory', () => {
      const { purchasePowerUp, usePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-vision'); // has duration
      usePowerUp('powerup-vision');

      const state = usePowerUpsStore.getState();

      expect(state.inventory.active).toHaveLength(1);
      expect(state.inventory.active[0].powerUpId).toBe('powerup-vision');
      expect(state.inventory.active[0].remainingTime).toBeGreaterThan(0);
    });

    it('should calculate total usages in inventory', () => {
      const { purchasePowerUp, usePowerUp } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-hint');
      purchasePowerUp('powerup-vision');

      usePowerUp('powerup-hint');
      usePowerUp('powerup-vision');

      const state = usePowerUpsStore.getState();

      expect(state.inventory.totalUsages).toBe(2);
    });
  });

  // ============================================================================
  // ML COINS MANAGEMENT TESTS
  // ============================================================================

  describe('ML Coins Management', () => {
    it('should add ML Coins', () => {
      const { addMlCoins } = usePowerUpsStore.getState();

      const initialCoins = usePowerUpsStore.getState().userMlCoins;

      addMlCoins(1000);

      const state = usePowerUpsStore.getState();

      expect(state.userMlCoins).toBe(initialCoins + 1000);
    });

    it('should deduct ML Coins if sufficient', () => {
      const { deductMlCoins } = usePowerUpsStore.getState();

      const success = deductMlCoins(500);

      expect(success).toBe(true);

      const state = usePowerUpsStore.getState();

      expect(state.userMlCoins).toBe(5000 - 500);
    });

    it('should not deduct ML Coins if insufficient', () => {
      const { deductMlCoins } = usePowerUpsStore.getState();

      const success = deductMlCoins(10000); // More than available

      expect(success).toBe(false);

      const state = usePowerUpsStore.getState();

      expect(state.userMlCoins).toBe(5000); // Unchanged
    });
  });

  // ============================================================================
  // REFRESH ACTIVE POWERUPS TESTS
  // ============================================================================

  describe('Refresh Active PowerUps', () => {
    it('should expire active powerups after duration', () => {
      const { purchasePowerUp, usePowerUp, refreshActivePowerUps } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-vision'); // 30 min duration, no cooldown
      usePowerUp('powerup-vision');

      // Manually set expiresAt to past
      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-vision');
      if (powerUp) {
        powerUp.expiresAt = new Date(Date.now() - 1000); // Expired
      }
      usePowerUpsStore.setState({ powerUps: state.powerUps });

      refreshActivePowerUps();

      const updatedState = usePowerUpsStore.getState();
      const updatedPowerUp = updatedState.powerUps.find((p) => p.id === 'powerup-vision');

      expect(updatedPowerUp?.status).toBe('available'); // No cooldown, so goes to available
      expect(updatedState.inventory.active).toHaveLength(0); // Removed from active
    });

    it('should clear cooldown after cooldown period', () => {
      const { purchasePowerUp, usePowerUp, refreshActivePowerUps } = usePowerUpsStore.getState();

      purchasePowerUp('powerup-retry'); // has cooldown
      usePowerUp('powerup-retry');

      // Manually set cooldownEndsAt to past
      const state = usePowerUpsStore.getState();
      const powerUp = state.powerUps.find((p) => p.id === 'powerup-retry');
      if (powerUp) {
        powerUp.cooldownEndsAt = new Date(Date.now() - 1000); // Cooldown ended
      }
      usePowerUpsStore.setState({ powerUps: state.powerUps });

      refreshActivePowerUps();

      const updatedState = usePowerUpsStore.getState();
      const updatedPowerUp = updatedState.powerUps.find((p) => p.id === 'powerup-retry');

      expect(updatedPowerUp?.status).toBe('available'); // Back to available
      expect(updatedPowerUp?.cooldownEndsAt).toBeUndefined();
    });
  });
});
