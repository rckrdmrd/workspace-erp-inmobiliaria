/**
 * EconomyStore Tests
 *
 * Test Coverage:
 * - Initial State (5 tests): Default values, empty state
 * - Add Coins (5 tests): Earning flow, transaction creation, balance update
 * - Spend Coins (6 tests): Spending flow, insufficient balance, transactions
 * - Update Balance (2 tests): Partial balance updates
 * - Transaction History (5 tests): Filtering, limits, retrieval
 * - Cart Operations (8 tests): Add, remove, update quantity, totals
 * - Purchase Operations (7 tests): Single item, cart purchase, affordability
 * - Inventory Operations (5 tests): Add, remove, check ownership, value
 * - Economy Stats (4 tests): Various statistics calculations
 * - Fetch Balance (4 tests): API integration, error handling
 * - Utility Functions (3 tests): Reset, loading, error states
 *
 * Total: 54 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useEconomyStore } from '../economyStore';
import type { ShopItem, MLCoinsBalance, ShopCategory } from '../../types/economyTypes';
import * as economyAPI from '../../api/economyAPI';

// Mock the API module
vi.mock('../../api/economyAPI', () => ({
  getBalance: vi.fn(),
  addTransaction: vi.fn(),
  purchaseItem: vi.fn(),
}));

// Mock crypto.randomUUID
beforeEach(() => {
  let uuidCounter = 0;
  vi.stubGlobal('crypto', {
    randomUUID: () => `uuid-${++uuidCounter}`,
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Mock data
const mockShopItem: ShopItem = {
  id: 'item-1',
  name: 'Power Boost',
  description: 'Increase XP gain by 50% for 24 hours',
  price: 100,
  category: 'premium' as ShopCategory,
  icon: 'zap',
  isOwned: false,
  rarity: 'rare',
  tags: ['boost', 'xp'],
  isPurchasable: true,
};

const mockBalance: MLCoinsBalance = {
  current: 500,
  lifetime: 1000,
  spent: 500,
  pending: 0,
};

describe('EconomyStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useEconomyStore.getState().reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================
  // Initial State Tests
  // ============================================================

  describe('Initial State', () => {
    it('should have zero balance initially', () => {
      const state = useEconomyStore.getState();

      expect(state.balance.current).toBe(0);
      expect(state.balance.lifetime).toBe(0);
      expect(state.balance.spent).toBe(0);
      expect(state.balance.pending).toBe(0);
    });

    it('should have empty transactions initially', () => {
      const state = useEconomyStore.getState();

      expect(state.transactions).toEqual([]);
    });

    it('should have empty inventory initially', () => {
      const state = useEconomyStore.getState();

      expect(state.inventory).toEqual([]);
    });

    it('should have empty cart initially', () => {
      const state = useEconomyStore.getState();

      expect(state.cart).toEqual([]);
    });

    it('should NOT be loading initially and have no error', () => {
      const state = useEconomyStore.getState();

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // ============================================================
  // Add Coins Tests
  // ============================================================

  describe('Add Coins', () => {
    it('should add coins to current balance', () => {
      const { addCoins } = useEconomyStore.getState();

      addCoins(100, 'achievement', 'Completed First Steps');

      const state = useEconomyStore.getState();
      expect(state.balance.current).toBe(100);
    });

    it('should update lifetime balance', () => {
      const { addCoins } = useEconomyStore.getState();

      addCoins(100, 'achievement');
      addCoins(50, 'daily-reward');

      const state = useEconomyStore.getState();
      expect(state.balance.lifetime).toBe(150);
      expect(state.balance.current).toBe(150);
    });

    it('should create transaction for earning coins', () => {
      const { addCoins } = useEconomyStore.getState();

      addCoins(100, 'achievement', 'First Steps completed');

      const state = useEconomyStore.getState();
      expect(state.transactions).toHaveLength(1);
      expect(state.transactions[0].type).toBe('earn');
      expect(state.transactions[0].amount).toBe(100);
      expect(state.transactions[0].source).toBe('achievement');
      expect(state.transactions[0].description).toBe('First Steps completed');
    });

    it('should set default description if not provided', () => {
      const { addCoins } = useEconomyStore.getState();

      addCoins(50, 'daily-reward');

      const state = useEconomyStore.getState();
      expect(state.transactions[0].description).toMatch(/Earned 50 ML from daily-reward/);
    });

    it('should clear error when adding coins', () => {
      const { addCoins, setError } = useEconomyStore.getState();

      setError('Some error');
      expect(useEconomyStore.getState().error).toBe('Some error');

      addCoins(100, 'achievement');

      const state = useEconomyStore.getState();
      expect(state.error).toBeNull();
    });
  });

  // ============================================================
  // Spend Coins Tests
  // ============================================================

  describe('Spend Coins', () => {
    it('should spend coins and reduce balance', async () => {
      const { addCoins, spendCoins } = useEconomyStore.getState();

      addCoins(200, 'achievement');
      const success = await spendCoins(100, 'Power Boost', 'item-1');

      expect(success).toBe(true);
      expect(useEconomyStore.getState().balance.current).toBe(100);
    });

    it('should update spent balance', async () => {
      const { addCoins, spendCoins } = useEconomyStore.getState();

      addCoins(300, 'achievement');
      await spendCoins(100, 'Item 1');
      await spendCoins(50, 'Item 2');

      const state = useEconomyStore.getState();
      expect(state.balance.spent).toBe(150);
    });

    it('should create transaction for spending coins', async () => {
      const { addCoins, spendCoins } = useEconomyStore.getState();

      addCoins(200, 'achievement');
      await spendCoins(100, 'Power Boost', 'item-1');

      const state = useEconomyStore.getState();
      const spendTransaction = state.transactions.find((t) => t.type === 'spend');

      expect(spendTransaction).toBeDefined();
      expect(spendTransaction?.amount).toBe(-100);
      expect(spendTransaction?.description).toMatch(/Purchased Power Boost/);
    });

    it('should return false for insufficient balance', async () => {
      const { addCoins, spendCoins } = useEconomyStore.getState();

      addCoins(50, 'achievement');
      const success = await spendCoins(100, 'Expensive Item');

      expect(success).toBe(false);
      expect(useEconomyStore.getState().balance.current).toBe(50);
    });

    it('should set error for insufficient balance', async () => {
      const { addCoins, spendCoins } = useEconomyStore.getState();

      addCoins(50, 'achievement');
      await spendCoins(100, 'Expensive Item');

      const state = useEconomyStore.getState();
      expect(state.error).toBe('Insufficient ML Coins balance');
    });

    it('should include item metadata in transaction', async () => {
      const { addCoins, spendCoins } = useEconomyStore.getState();

      addCoins(200, 'achievement');
      await spendCoins(100, 'Power Boost', 'item-123');

      const state = useEconomyStore.getState();
      const spendTransaction = state.transactions.find((t) => t.type === 'spend');

      expect(spendTransaction?.metadata?.itemId).toBe('item-123');
    });
  });

  // ============================================================
  // Update Balance Tests
  // ============================================================

  describe('Update Balance', () => {
    it('should update balance partially', () => {
      const { updateBalance } = useEconomyStore.getState();

      updateBalance({ current: 150, lifetime: 300 });

      const state = useEconomyStore.getState();
      expect(state.balance.current).toBe(150);
      expect(state.balance.lifetime).toBe(300);
      expect(state.balance.spent).toBe(0); // Not updated
    });

    it('should merge with existing balance', () => {
      const { addCoins, updateBalance } = useEconomyStore.getState();

      addCoins(100, 'achievement');
      updateBalance({ pending: 50 });

      const state = useEconomyStore.getState();
      expect(state.balance.current).toBe(100); // Preserved
      expect(state.balance.pending).toBe(50); // Updated
    });
  });

  // ============================================================
  // Transaction History Tests
  // ============================================================

  describe('Transaction History', () => {
    it('should retrieve all transactions', () => {
      const { addCoins, getTransactionHistory } = useEconomyStore.getState();

      addCoins(100, 'achievement');
      addCoins(50, 'daily-reward');

      const transactions = getTransactionHistory();

      expect(transactions).toHaveLength(2);
    });

    it('should limit transactions when specified', () => {
      const { addCoins, getTransactionHistory } = useEconomyStore.getState();

      addCoins(100, 'source1');
      addCoins(50, 'source2');
      addCoins(25, 'source3');

      const transactions = getTransactionHistory(2);

      expect(transactions).toHaveLength(2);
    });

    it('should filter transactions by type', () => {
      const { addCoins, spendCoins, getTransactionHistory } =
        useEconomyStore.getState();

      addCoins(200, 'achievement');
      addCoins(100, 'daily-reward');
      spendCoins(50, 'Item');

      const earnTransactions = getTransactionHistory(undefined, { type: 'earn' });

      expect(earnTransactions).toHaveLength(2);
      expect(earnTransactions.every((t) => t.type === 'earn')).toBe(true);
    });

    it('should filter transactions by source', () => {
      const { addCoins, getTransactionHistory } = useEconomyStore.getState();

      addCoins(100, 'achievement');
      addCoins(50, 'achievement');
      addCoins(25, 'daily-reward');

      const achievementTransactions = getTransactionHistory(undefined, {
        source: 'achievement',
      });

      expect(achievementTransactions).toHaveLength(2);
      expect(achievementTransactions.every((t) => t.source === 'achievement')).toBe(
        true
      );
    });

    it('should clear transaction history', () => {
      const { addCoins, clearTransactionHistory } = useEconomyStore.getState();

      addCoins(100, 'achievement');
      addCoins(50, 'daily-reward');

      clearTransactionHistory();

      const state = useEconomyStore.getState();
      expect(state.transactions).toEqual([]);
    });
  });

  // ============================================================
  // Cart Operations Tests
  // ============================================================

  describe('Cart Operations', () => {
    it('should add item to cart', () => {
      const { addToCart } = useEconomyStore.getState();

      addToCart(mockShopItem);

      const state = useEconomyStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].id).toBe('item-1');
      expect(state.cart[0].quantity).toBe(1);
    });

    it('should add item with custom quantity', () => {
      const { addToCart } = useEconomyStore.getState();

      addToCart(mockShopItem, 3);

      const state = useEconomyStore.getState();
      expect(state.cart[0].quantity).toBe(3);
    });

    it('should increase quantity for existing item', () => {
      const { addToCart } = useEconomyStore.getState();

      addToCart(mockShopItem, 2);
      addToCart(mockShopItem, 1);

      const state = useEconomyStore.getState();
      expect(state.cart).toHaveLength(1);
      expect(state.cart[0].quantity).toBe(3);
    });

    it('should remove item from cart', () => {
      const { addToCart, removeFromCart } = useEconomyStore.getState();

      addToCart(mockShopItem);
      removeFromCart('item-1');

      const state = useEconomyStore.getState();
      expect(state.cart).toEqual([]);
    });

    it('should update cart item quantity', () => {
      const { addToCart, updateCartItemQuantity } = useEconomyStore.getState();

      addToCart(mockShopItem);
      updateCartItemQuantity('item-1', 5);

      const state = useEconomyStore.getState();
      expect(state.cart[0].quantity).toBe(5);
    });

    it('should remove item when quantity set to zero', () => {
      const { addToCart, updateCartItemQuantity } = useEconomyStore.getState();

      addToCart(mockShopItem);
      updateCartItemQuantity('item-1', 0);

      const state = useEconomyStore.getState();
      expect(state.cart).toEqual([]);
    });

    it('should calculate cart total correctly', () => {
      const { addToCart, getCartTotal } = useEconomyStore.getState();

      addToCart(mockShopItem, 2); // 100 * 2 = 200
      addToCart({ ...mockShopItem, id: 'item-2', price: 50 }, 3); // 50 * 3 = 150

      const total = getCartTotal();

      expect(total).toBe(350);
    });

    it('should calculate cart item count', () => {
      const { addToCart, getCartItemCount } = useEconomyStore.getState();

      addToCart(mockShopItem, 2);
      addToCart({ ...mockShopItem, id: 'item-2' }, 3);

      const count = getCartItemCount();

      expect(count).toBe(5); // 2 + 3
    });
  });

  // ============================================================
  // Purchase Operations Tests
  // ============================================================

  describe('Purchase Operations', () => {
    it('should purchase single item from cart', async () => {
      const { addCoins, addToCart, purchaseItem } = useEconomyStore.getState();

      addCoins(500, 'achievement');
      addToCart(mockShopItem);

      const result = await purchaseItem('item-1');

      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(400); // 500 - 100
    });

    it('should add purchased item to inventory', async () => {
      const { addCoins, addToCart, purchaseItem } = useEconomyStore.getState();

      addCoins(500, 'achievement');
      addToCart(mockShopItem);

      await purchaseItem('item-1');

      const state = useEconomyStore.getState();
      expect(state.inventory).toHaveLength(1);
      expect(state.inventory[0].id).toBe('item-1');
    });

    it('should remove purchased item from cart', async () => {
      const { addCoins, addToCart, purchaseItem } = useEconomyStore.getState();

      addCoins(500, 'achievement');
      addToCart(mockShopItem);

      await purchaseItem('item-1');

      const state = useEconomyStore.getState();
      expect(state.cart).toEqual([]);
    });

    it('should fail purchase with insufficient balance', async () => {
      const { addCoins, addToCart, purchaseItem } = useEconomyStore.getState();

      addCoins(50, 'achievement');
      addToCart(mockShopItem); // costs 100

      const result = await purchaseItem('item-1');

      expect(result.success).toBe(false);
      expect(result.error).toMatch(/Insufficient balance/);
    });

    it('should purchase entire cart', async () => {
      const { addCoins, addToCart, purchaseCart } = useEconomyStore.getState();

      addCoins(500, 'achievement');
      addToCart(mockShopItem, 2); // 200 total
      addToCart({ ...mockShopItem, id: 'item-2', price: 50 }, 1); // 50

      const result = await purchaseCart();

      expect(result.success).toBe(true);
      expect(result.newBalance).toBe(250); // 500 - 250
    });

    it('should fail cart purchase with empty cart', async () => {
      const { addCoins, purchaseCart } = useEconomyStore.getState();

      addCoins(500, 'achievement');

      const result = await purchaseCart();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Cart is empty');
    });

    it('should check affordability correctly', () => {
      const { addCoins, canAfford } = useEconomyStore.getState();

      addCoins(100, 'achievement');

      expect(canAfford(50)).toBe(true);
      expect(canAfford(100)).toBe(true);
      expect(canAfford(101)).toBe(false);
      expect(canAfford(200)).toBe(false);
    });
  });

  // ============================================================
  // Inventory Operations Tests
  // ============================================================

  describe('Inventory Operations', () => {
    it('should add item to inventory', () => {
      const { addToInventory } = useEconomyStore.getState();

      addToInventory(mockShopItem);

      const state = useEconomyStore.getState();
      expect(state.inventory).toHaveLength(1);
      expect(state.inventory[0].id).toBe('item-1');
      expect(state.inventory[0].isOwned).toBe(true);
    });

    it('should prevent duplicate non-stackable items', () => {
      const { addToInventory } = useEconomyStore.getState();

      const nonStackableItem = {
        ...mockShopItem,
        metadata: { stackable: false },
      };

      addToInventory(nonStackableItem);
      addToInventory(nonStackableItem); // Try to add again

      const state = useEconomyStore.getState();
      expect(state.inventory).toHaveLength(1);
    });

    it('should check if user has item', () => {
      const { addToInventory, hasItem } = useEconomyStore.getState();

      expect(hasItem('item-1')).toBe(false);

      addToInventory(mockShopItem);

      expect(hasItem('item-1')).toBe(true);
      expect(hasItem('item-2')).toBe(false);
    });

    it('should remove item from inventory', () => {
      const { addToInventory, removeFromInventory } = useEconomyStore.getState();

      addToInventory(mockShopItem);
      removeFromInventory('item-1');

      const state = useEconomyStore.getState();
      expect(state.inventory).toEqual([]);
    });

    it('should calculate inventory value', () => {
      const { addToInventory, getInventoryValue } = useEconomyStore.getState();

      addToInventory(mockShopItem); // price: 100
      addToInventory({ ...mockShopItem, id: 'item-2', price: 50 });
      addToInventory({ ...mockShopItem, id: 'item-3', price: 75 });

      const value = getInventoryValue();

      expect(value).toBe(225);
    });
  });

  // ============================================================
  // Economy Stats Tests
  // ============================================================

  describe('Economy Stats', () => {
    it('should calculate economy statistics', () => {
      const { addCoins, spendCoins, getEconomyStats } =
        useEconomyStore.getState();

      addCoins(500, 'achievement');
      spendCoins(100, 'Item');

      const stats = getEconomyStats();

      expect(stats.totalEarned).toBe(500);
      expect(stats.totalSpent).toBe(100);
      expect(stats.currentBalance).toBe(400);
    });

    it('should calculate net worth with inventory', () => {
      const { addCoins, addToInventory, getEconomyStats } =
        useEconomyStore.getState();

      addCoins(300, 'achievement');
      addToInventory(mockShopItem); // value: 100

      const stats = getEconomyStats();

      expect(stats.netWorth).toBe(400); // 300 current + 100 inventory
    });

    it('should track transaction count', () => {
      const { addCoins, spendCoins, getEconomyStats } =
        useEconomyStore.getState();

      addCoins(200, 'achievement');
      addCoins(100, 'daily-reward');
      spendCoins(50, 'Item');

      const stats = getEconomyStats();

      expect(stats.transactionCount).toBe(3);
    });

    it('should identify top earning source', () => {
      const { addCoins, getEconomyStats } = useEconomyStore.getState();

      addCoins(100, 'achievement');
      addCoins(50, 'achievement');
      addCoins(25, 'daily-reward');

      const stats = getEconomyStats();

      expect(stats.topEarningSource.source).toBe('achievement');
      expect(stats.topEarningSource.amount).toBe(150);
    });
  });

  // ============================================================
  // Fetch Balance Tests (API)
  // ============================================================

  describe('Fetch Balance (API)', () => {
    it('should set loading state during fetch', async () => {
      vi.mocked(economyAPI.getBalance).mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

      const { fetchBalance } = useEconomyStore.getState();
      const fetchPromise = fetchBalance();

      // Check loading state immediately
      expect(useEconomyStore.getState().isLoading).toBe(true);

      await fetchPromise;
    });

    it('should fetch and update balance from API', async () => {
      vi.mocked(economyAPI.getBalance).mockResolvedValue(mockBalance);

      const { fetchBalance } = useEconomyStore.getState();
      await fetchBalance();

      expect(economyAPI.getBalance).toHaveBeenCalled();

      const state = useEconomyStore.getState();
      expect(state.balance).toEqual(mockBalance);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle API errors', async () => {
      vi.mocked(economyAPI.getBalance).mockRejectedValue(
        new Error('Network error')
      );

      const { fetchBalance } = useEconomyStore.getState();
      await fetchBalance();

      const state = useEconomyStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Network error');
    });

    it('should set generic error for non-Error failures', async () => {
      vi.mocked(economyAPI.getBalance).mockRejectedValue('String error');

      const { fetchBalance } = useEconomyStore.getState();
      await fetchBalance();

      const state = useEconomyStore.getState();
      expect(state.error).toBe('Failed to fetch balance');
    });
  });

  // ============================================================
  // Utility Functions Tests
  // ============================================================

  describe('Utility Functions', () => {
    it('should reset store to initial state', () => {
      const { addCoins, addToCart, reset } = useEconomyStore.getState();

      addCoins(500, 'achievement');
      addToCart(mockShopItem);

      reset();

      const state = useEconomyStore.getState();
      expect(state.balance.current).toBe(0);
      expect(state.transactions).toEqual([]);
      expect(state.cart).toEqual([]);
      expect(state.inventory).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set loading state', () => {
      const { setLoading } = useEconomyStore.getState();

      setLoading(true);
      expect(useEconomyStore.getState().isLoading).toBe(true);

      setLoading(false);
      expect(useEconomyStore.getState().isLoading).toBe(false);
    });

    it('should set error state', () => {
      const { setError } = useEconomyStore.getState();

      setError('Test error');
      expect(useEconomyStore.getState().error).toBe('Test error');

      setError(null);
      expect(useEconomyStore.getState().error).toBeNull();
    });
  });
});
