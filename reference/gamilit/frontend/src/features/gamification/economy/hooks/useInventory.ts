/**
 * useInventory Hook - Inventory Management
 *
 * Custom hook for managing user's owned items and inventory operations
 */

import { useCallback, useMemo } from 'react';
import { useEconomyStore } from '../store/economyStore';
import type { ShopItem, ShopCategory } from '../types/economyTypes';

export const useInventory = () => {
  const inventory = useEconomyStore((state) => state.inventory);
  const addToInventory = useEconomyStore((state) => state.addToInventory);
  const removeFromInventory = useEconomyStore((state) => state.removeFromInventory);
  const hasItem = useEconomyStore((state) => state.hasItem);
  const getInventoryValue = useEconomyStore((state) => state.getInventoryValue);

  /**
   * Get items by category
   */
  const getItemsByCategory = useCallback(
    (category: ShopCategory): ShopItem[] => {
      return inventory.filter((item) => item.category === category);
    },
    [inventory]
  );

  /**
   * Get items by rarity
   */
  const getItemsByRarity = useCallback(
    (rarity: string): ShopItem[] => {
      return inventory.filter((item) => item.rarity === rarity);
    },
    [inventory]
  );

  /**
   * Get inventory count
   */
  const inventoryCount = useMemo(() => inventory.length, [inventory]);

  /**
   * Get inventory by category with counts
   */
  const inventoryByCategory = useMemo(() => {
    const categories: Record<ShopCategory, ShopItem[]> = {
      cosmetics: [],
      profile: [],
      guild: [],
      premium: [],
      social: [],
    };

    inventory.forEach((item) => {
      if (categories[item.category]) {
        categories[item.category].push(item);
      }
    });

    return categories;
  }, [inventory]);

  /**
   * Get category counts
   */
  const categoryCounts = useMemo(() => {
    return Object.entries(inventoryByCategory).map(([category, items]) => ({
      category: category as ShopCategory,
      count: items.length,
    }));
  }, [inventoryByCategory]);

  /**
   * Get rarity distribution
   */
  const rarityDistribution = useMemo(() => {
    const distribution: Record<string, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    inventory.forEach((item) => {
      distribution[item.rarity]++;
    });

    return distribution;
  }, [inventory]);

  /**
   * Get most valuable items
   */
  const getMostValuableItems = useCallback(
    (limit: number = 5): ShopItem[] => {
      return [...inventory].sort((a, b) => b.price - a.price).slice(0, limit);
    },
    [inventory]
  );

  /**
   * Get recently acquired items
   */
  const getRecentlyAcquired = useCallback(
    (limit: number = 10): ShopItem[] => {
      // In a real implementation, items would have acquisition dates
      // For now, return the last N items
      return inventory.slice(-limit).reverse();
    },
    [inventory]
  );

  /**
   * Search inventory
   */
  const searchInventory = useCallback(
    (query: string): ShopItem[] => {
      const lowerQuery = query.toLowerCase();
      return inventory.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [inventory]
  );

  /**
   * Get item by ID
   */
  const getItemById = useCallback(
    (id: string): ShopItem | undefined => {
      return inventory.find((item) => item.id === id);
    },
    [inventory]
  );

  /**
   * Check if inventory has items of category
   */
  const hasCategoryItems = useCallback(
    (category: ShopCategory): boolean => {
      return inventory.some((item) => item.category === category);
    },
    [inventory]
  );

  /**
   * Get inventory statistics
   */
  const inventoryStats = useMemo(() => {
    const totalValue = getInventoryValue();
    const avgValue = inventoryCount > 0 ? Math.round(totalValue / inventoryCount) : 0;

    return {
      totalItems: inventoryCount,
      totalValue,
      averageValue: avgValue,
      categoryCounts,
      rarityDistribution,
    };
  }, [inventoryCount, getInventoryValue, categoryCounts, rarityDistribution]);

  /**
   * Get equipped items (for cosmetics/profile items)
   * This would be expanded in a real implementation
   */
  const equippedItems = useMemo(() => {
    // Placeholder - in real implementation, items would have "equipped" status
    return inventory.filter((item) =>
      item.category === 'cosmetics' || item.category === 'profile'
    ).slice(0, 3);
  }, [inventory]);

  /**
   * Check if inventory is empty
   */
  const isEmpty = useMemo(() => inventoryCount === 0, [inventoryCount]);

  /**
   * Get completion percentage for collections
   * (If there's a total number of collectible items)
   */
  const getCollectionProgress = useCallback(
    (totalAvailable: number): number => {
      if (totalAvailable === 0) return 0;
      return Math.round((inventoryCount / totalAvailable) * 100);
    },
    [inventoryCount]
  );

  return {
    // State
    inventory,
    inventoryCount,
    isEmpty,

    // Categorized data
    inventoryByCategory,
    categoryCounts,
    rarityDistribution,
    equippedItems,

    // Queries
    getItemsByCategory,
    getItemsByRarity,
    getMostValuableItems,
    getRecentlyAcquired,
    searchInventory,
    getItemById,
    hasCategoryItems,
    hasItem,

    // Statistics
    inventoryStats,
    getInventoryValue,
    getCollectionProgress,

    // Actions
    addToInventory,
    removeFromInventory,
  };
};
