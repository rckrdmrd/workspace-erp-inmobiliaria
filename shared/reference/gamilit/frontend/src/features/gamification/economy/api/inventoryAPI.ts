/**
 * Inventory API Integration
 *
 * API client for power-ups inventory endpoints including:
 * - Get user inventory
 * - Purchase power-ups
 * - Use power-ups
 * - Get available power-ups
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Power-up types available in the system
 */
export type PowerUpType = 'pistas' | 'vision_lectora' | 'segunda_oportunidad';

/**
 * Power-up item in inventory
 */
export interface PowerUpInventoryItem {
  available: number;
  purchased: number;
  used: number;
  cost: number;
}

/**
 * Complete user power-up inventory
 */
export interface PowerUpInventory {
  pistas: PowerUpInventoryItem;
  visionLectora: PowerUpInventoryItem;
  segundaOportunidad: PowerUpInventoryItem;
}

/**
 * Available power-up definition
 */
export interface AvailablePowerUp {
  id: string;
  type: PowerUpType;
  name: string;
  description: string;
  cost: number;
  icon: string;
  effect: {
    type: string;
    value: number;
    description: string;
  };
}

/**
 * Purchase result
 */
export interface PurchasePowerUpResult {
  message: string;
  totalCost: number;
  inventory: PowerUpInventory;
}

/**
 * Use power-up result
 */
export interface UsePowerUpResult {
  message: string;
  remainingPowerups: PowerUpInventory;
}

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

/**
 * Mock get inventory
 */
const mockGetInventory = async (userId: string): Promise<PowerUpInventory> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    pistas: {
      available: 3,
      purchased: 5,
      used: 2,
      cost: 50,
    },
    visionLectora: {
      available: 2,
      purchased: 4,
      used: 2,
      cost: 100,
    },
    segundaOportunidad: {
      available: 1,
      purchased: 2,
      used: 1,
      cost: 150,
    },
  };
};

/**
 * Mock purchase power-up
 */
const mockPurchasePowerUp = async (
  userId: string,
  powerupType: PowerUpType,
  quantity: number
): Promise<PurchasePowerUpResult> => {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const costs: Record<PowerUpType, number> = {
    pistas: 50,
    vision_lectora: 100,
    segunda_oportunidad: 150,
  };

  const totalCost = costs[powerupType] * quantity;

  return {
    message: `Purchased ${quantity} ${powerupType}`,
    totalCost,
    inventory: await mockGetInventory(userId),
  };
};

/**
 * Mock use power-up
 */
const mockUsePowerUp = async (
  userId: string,
  powerupType: PowerUpType,
  exerciseId: string
): Promise<UsePowerUpResult> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return {
    message: `Used ${powerupType} in exercise`,
    remainingPowerups: await mockGetInventory(userId),
  };
};

/**
 * Mock get available power-ups
 */
const mockGetAvailablePowerUps = async (): Promise<AvailablePowerUp[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return [
    {
      id: 'pistas',
      type: 'pistas',
      name: 'Pistas',
      description: 'Obtén pistas útiles para resolver ejercicios',
      cost: 50,
      icon: '💡',
      effect: {
        type: 'hint',
        value: 3,
        description: 'Revela 3 pistas útiles',
      },
    },
    {
      id: 'vision_lectora',
      type: 'vision_lectora',
      name: 'Visión Lectora',
      description: 'Mejora tu comprensión lectora temporalmente',
      cost: 100,
      icon: '👁️',
      effect: {
        type: 'reading_boost',
        value: 1,
        description: 'Mejora la comprensión lectora',
      },
    },
    {
      id: 'segunda_oportunidad',
      type: 'segunda_oportunidad',
      name: 'Segunda Oportunidad',
      description: 'Obtén una segunda oportunidad para intentar el ejercicio',
      cost: 150,
      icon: '🔄',
      effect: {
        type: 'retry',
        value: 1,
        description: 'Permite reintentar el ejercicio',
      },
    },
  ];
};

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Get user's power-up inventory
 *
 * @param userId - User ID
 * @returns Power-up inventory
 */
export const getInventory = async (userId: string): Promise<PowerUpInventory> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetInventory(userId);
    }

    const { data } = await apiClient.get<ApiResponse<PowerUpInventory>>(
      `/gamification/powerups/${userId}`
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Purchase power-up
 *
 * @param userId - User ID
 * @param powerupType - Type of power-up to purchase
 * @param quantity - Quantity to purchase (default: 1)
 * @returns Purchase result
 */
export const purchasePowerUp = async (
  userId: string,
  powerupType: PowerUpType,
  quantity: number = 1
): Promise<PurchasePowerUpResult> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockPurchasePowerUp(userId, powerupType, quantity);
    }

    const { data } = await apiClient.post<ApiResponse<PurchasePowerUpResult>>(
      API_ENDPOINTS.powerups.purchase,
      {
        userId,
        powerupType,
        quantity,
      }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Use power-up
 *
 * @param userId - User ID
 * @param powerupType - Type of power-up to use
 * @param exerciseId - Exercise ID where power-up is being used
 * @returns Use result
 */
export const usePowerUp = async (
  userId: string,
  powerupType: PowerUpType,
  exerciseId: string
): Promise<UsePowerUpResult> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockUsePowerUp(userId, powerupType, exerciseId);
    }

    const { data } = await apiClient.post<ApiResponse<UsePowerUpResult>>(
      API_ENDPOINTS.powerups.use,
      {
        userId,
        powerupType,
        exerciseId,
      }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get available power-ups
 *
 * @returns List of available power-ups
 */
export const getAvailablePowerUps = async (): Promise<AvailablePowerUp[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetAvailablePowerUps();
    }

    const { data } = await apiClient.get<ApiResponse<AvailablePowerUp[]>>(
      '/gamification/powerups/available'
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  getInventory,
  purchasePowerUp,
  usePowerUp,
  getAvailablePowerUps,
};
