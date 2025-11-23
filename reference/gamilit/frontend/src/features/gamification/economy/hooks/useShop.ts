/**
 * useShop Hook - Shop Operations
 *
 * Custom hook for managing shop items, filters, and purchases
 */

import { useCallback, useMemo, useState } from 'react';
import type { ShopItem, ShopFilters, ShopSortBy } from '../types/economyTypes';

export const useShop = (shopItems: ShopItem[]) => {
  const [filters, setFilters] = useState<ShopFilters>({});
  const [sortBy, setSortBy] = useState<ShopSortBy>('newest');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Filter shop items based on current filters
   */
  const filteredItems = useMemo(() => {
    let items = [...shopItems];

    // Category filter
    if (filters.category) {
      items = items.filter((item) => item.category === filters.category);
    }

    // Rarity filter
    if (filters.rarity) {
      items = items.filter((item) => item.rarity === filters.rarity);
    }

    // Price range filter
    if (filters.priceMin !== undefined) {
      items = items.filter((item) => item.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      items = items.filter((item) => item.price <= filters.priceMax!);
    }

    // Owned filter
    if (filters.owned !== undefined) {
      items = items.filter((item) => item.isOwned === filters.owned);
    }

    // Available filter
    if (filters.available !== undefined) {
      items = items.filter((item) => item.isPurchasable === filters.available);
    }

    // Search query
    const query = searchQuery.toLowerCase();
    if (query) {
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      items = items.filter((item) =>
        filters.tags!.some((tag) => item.tags?.includes(tag))
      );
    }

    return items;
  }, [shopItems, filters, searchQuery]);

  /**
   * Sort filtered items
   */
  const sortedItems = useMemo(() => {
    const items = [...filteredItems];

    switch (sortBy) {
      case 'price_asc':
        return items.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return items.sort((a, b) => b.price - a.price);
      case 'name_asc':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return items.sort((a, b) => b.name.localeCompare(a.name));
      case 'rarity':
        const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
        return items.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
      case 'newest':
      default:
        return items;
    }
  }, [filteredItems, sortBy]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<ShopFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  /**
   * Get items by category
   */
  const getItemsByCategory = useCallback(
    (category: string) => {
      return shopItems.filter((item) => item.category === category);
    },
    [shopItems]
  );

  /**
   * Get items by rarity
   */
  const getItemsByRarity = useCallback(
    (rarity: string) => {
      return shopItems.filter((item) => item.rarity === rarity);
    },
    [shopItems]
  );

  /**
   * Search items
   */
  const searchItems = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return shopItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [shopItems]
  );

  /**
   * Get available items (purchasable and not owned)
   */
  const availableItems = useMemo(() => {
    return shopItems.filter((item) => item.isPurchasable && !item.isOwned);
  }, [shopItems]);

  /**
   * Get owned items
   */
  const ownedItems = useMemo(() => {
    return shopItems.filter((item) => item.isOwned);
  }, [shopItems]);

  /**
   * Get all unique tags
   */
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    shopItems.forEach((item) => {
      item.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [shopItems]);

  /**
   * Get price range
   */
  const priceRange = useMemo(() => {
    if (shopItems.length === 0) return { min: 0, max: 0 };
    const prices = shopItems.map((item) => item.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [shopItems]);

  /**
   * Get item by ID
   */
  const getItemById = useCallback(
    (id: string) => {
      return shopItems.find((item) => item.id === id);
    },
    [shopItems]
  );

  return {
    // Filtered and sorted data
    items: sortedItems,
    filteredItems,
    availableItems,
    ownedItems,

    // Filter state
    filters,
    searchQuery,
    sortBy,

    // Actions
    updateFilters,
    clearFilters,
    setSearchQuery,
    setSortBy,

    // Queries
    getItemsByCategory,
    getItemsByRarity,
    searchItems,
    getItemById,

    // Metadata
    allTags,
    priceRange,
    totalItems: shopItems.length,
    filteredCount: sortedItems.length,
  };
};
