/**
 * useInventoryQuery Hook - React Query Integration for Inventory
 *
 * Custom hook for managing power-up inventory with react-query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import * as inventoryAPI from '../api/inventoryAPI';
import type {
  PowerUpInventory,
  PowerUpType,
  AvailablePowerUp,
} from '../api/inventoryAPI';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const inventoryKeys = {
  all: ['inventory'] as const,
  user: (userId: string) => [...inventoryKeys.all, 'user', userId] as const,
  available: () => [...inventoryKeys.all, 'available'] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Get user power-up inventory
 *
 * @param userId - User ID (optional, uses auth user by default)
 */
export const useInventoryQuery = (userId?: string) => {
  const authUser = useAuthStore((state) => state.user);
  const effectiveUserId = userId || authUser?.id;

  return useQuery({
    queryKey: inventoryKeys.user(effectiveUserId || ''),
    queryFn: () => inventoryAPI.getInventory(effectiveUserId!),
    enabled: !!effectiveUserId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
  });
};

/**
 * Get available power-ups
 */
export const useAvailablePowerUps = () => {
  return useQuery({
    queryKey: inventoryKeys.available(),
    queryFn: () => inventoryAPI.getAvailablePowerUps(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Purchase power-up mutation
 */
export const usePurchasePowerUp = () => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({
      powerupType,
      quantity = 1,
    }: {
      powerupType: PowerUpType;
      quantity?: number;
    }) => {
      if (!authUser?.id) {
        throw new Error('User not authenticated');
      }
      return inventoryAPI.purchasePowerUp(authUser.id, powerupType, quantity);
    },
    onSuccess: (data) => {
      // Update inventory cache with the new data
      if (authUser?.id) {
        queryClient.setQueryData(
          inventoryKeys.user(authUser.id),
          data.inventory
        );
        // Invalidate to refetch from server
        queryClient.invalidateQueries({
          queryKey: inventoryKeys.user(authUser.id),
        });
      }
    },
  });
};

/**
 * Use power-up mutation
 */
export const useUsePowerUp = () => {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: ({
      powerupType,
      exerciseId,
    }: {
      powerupType: PowerUpType;
      exerciseId: string;
    }) => {
      if (!authUser?.id) {
        throw new Error('User not authenticated');
      }
      return inventoryAPI.usePowerUp(authUser.id, powerupType, exerciseId);
    },
    onSuccess: (data) => {
      // Update inventory cache with the new data
      if (authUser?.id) {
        queryClient.setQueryData(
          inventoryKeys.user(authUser.id),
          data.remainingPowerups
        );
        // Invalidate to refetch from server
        queryClient.invalidateQueries({
          queryKey: inventoryKeys.user(authUser.id),
        });
      }
    },
  });
};

// ============================================================================
// HELPER HOOKS
// ============================================================================

/**
 * Complete inventory management hook
 *
 * Combines all inventory-related queries and mutations
 */
export const useInventoryManagement = (userId?: string) => {
  const authUser = useAuthStore((state) => state.user);
  const effectiveUserId = userId || authUser?.id;

  const inventoryQuery = useInventoryQuery(effectiveUserId);
  const availablePowerUpsQuery = useAvailablePowerUps();
  const purchaseMutation = usePurchasePowerUp();
  const useMutation = useUsePowerUp();

  /**
   * Get total power-ups count
   */
  const getTotalPowerUps = () => {
    if (!inventoryQuery.data) return 0;
    const { pistas, visionLectora, segundaOportunidad } = inventoryQuery.data;
    return pistas.available + visionLectora.available + segundaOportunidad.available;
  };

  /**
   * Get power-up by type
   */
  const getPowerUpByType = (type: PowerUpType) => {
    if (!inventoryQuery.data) return null;
    const typeMap: Record<PowerUpType, keyof PowerUpInventory> = {
      pistas: 'pistas',
      vision_lectora: 'visionLectora',
      segunda_oportunidad: 'segundaOportunidad',
    };
    return inventoryQuery.data[typeMap[type]];
  };

  /**
   * Check if user can afford power-up
   */
  const canAfford = (cost: number, userCoins: number) => {
    return userCoins >= cost;
  };

  /**
   * Check if power-up is available
   */
  const hasAvailable = (type: PowerUpType) => {
    const powerUp = getPowerUpByType(type);
    return powerUp ? powerUp.available > 0 : false;
  };

  return {
    // Queries
    inventory: inventoryQuery.data,
    availablePowerUps: availablePowerUpsQuery.data,
    isLoading: inventoryQuery.isLoading || availablePowerUpsQuery.isLoading,
    isError: inventoryQuery.isError || availablePowerUpsQuery.isError,
    error: inventoryQuery.error || availablePowerUpsQuery.error,

    // Mutations
    purchasePowerUp: purchaseMutation.mutate,
    usePowerUp: useMutation.mutate,
    isPurchasing: purchaseMutation.isPending,
    isUsing: useMutation.isPending,

    // Helper functions
    getTotalPowerUps,
    getPowerUpByType,
    canAfford,
    hasAvailable,

    // Refetch
    refetch: inventoryQuery.refetch,
  };
};
