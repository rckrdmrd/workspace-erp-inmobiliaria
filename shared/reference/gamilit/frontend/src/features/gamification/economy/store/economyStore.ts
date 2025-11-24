/**
 * Economy Store - Zustand State Management
 *
 * Centralized state management for ML Coins economy system including:
 * - ML Coins balance
 * - Transaction history
 * - User inventory
 * - Shopping cart
 * - Purchase operations
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  MLCoinsBalance,
  Transaction,
  ShopItem,
  CartItem,
  PurchaseResult,
  EarningSource,
  TransactionFilters,
  EconomyStats,
} from '../types/economyTypes';
import { getBalance } from '../api/economyAPI';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * Economy Store State Interface
 */
interface EconomyState {
  // State
  balance: MLCoinsBalance;
  transactions: Transaction[];
  inventory: ShopItem[];
  shopItems?: ShopItem[];  // Legacy/alias for inventory
  cart: CartItem[];
  isLoading: boolean;
  error: string | null;

  // Coin Operations
  addCoins: (amount: number, source: EarningSource | string, description?: string) => void;
  spendCoins: (amount: number, itemName: string, itemId?: string) => Promise<boolean>;
  updateBalance: (balance: Partial<MLCoinsBalance>) => void;

  // Transaction Operations
  getTransactionHistory: (limit?: number, filters?: TransactionFilters) => Transaction[];
  clearTransactionHistory: () => void;
  getTransaction: (id: string) => Transaction | undefined;

  // Cart Operations
  addToCart: (item: ShopItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Purchase Operations
  purchaseItem: (itemId: string) => Promise<PurchaseResult>;
  purchaseCart: () => Promise<PurchaseResult>;
  canAfford: (amount: number) => boolean;

  // Inventory Operations
  addToInventory: (item: ShopItem) => void;
  removeFromInventory: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  getInventoryValue: () => number;

  // Statistics
  getEconomyStats: () => EconomyStats;

  // Utility
  reset: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Sync
  fetchBalance: () => Promise<void>;
}

/**
 * Initial State
 */
const initialBalance: MLCoinsBalance = {
  current: 0,
  lifetime: 0,
  spent: 0,
  pending: 0,
};

/**
 * Economy Store Implementation
 */
export const useEconomyStore = create<EconomyState>()(
  persist(
    (set, get) => ({
      // Initial State
      balance: initialBalance,
      transactions: [],
      inventory: [],
      cart: [],
      isLoading: false,
      error: null,

      // Add Coins (Earning)
      addCoins: (amount, source, description) => {
        const state = get();
        const newBalance = state.balance.current + amount;

        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: 'earn',
          amount,
          source,
          description: description || `Earned ${amount} ML from ${source}`,
          timestamp: new Date(),
          balanceAfter: newBalance,
        };

        set({
          balance: {
            ...state.balance,
            current: newBalance,
            lifetime: state.balance.lifetime + amount,
          },
          transactions: [transaction, ...state.transactions],
          error: null,
        });
      },

      // Spend Coins
      spendCoins: async (amount, itemName, itemId) => {
        const state = get();

        if (state.balance.current < amount) {
          set({ error: 'Insufficient ML Coins balance' });
          return false;
        }

        const newBalance = state.balance.current - amount;

        const transaction: Transaction = {
          id: crypto.randomUUID(),
          type: 'spend',
          amount: -amount,
          source: 'shop',
          description: `Purchased ${itemName}`,
          timestamp: new Date(),
          balanceAfter: newBalance,
          metadata: itemId ? { itemId } : undefined,
        };

        set({
          balance: {
            ...state.balance,
            current: newBalance,
            spent: state.balance.spent + amount,
          },
          transactions: [transaction, ...state.transactions],
          error: null,
        });

        return true;
      },

      // Update Balance
      updateBalance: (balanceUpdate) => {
        set((state) => ({
          balance: { ...state.balance, ...balanceUpdate },
        }));
      },

      // Get Transaction History
      getTransactionHistory: (limit, filters) => {
        let transactions = get().transactions;

        // Apply filters
        if (filters) {
          if (filters.type) {
            transactions = transactions.filter((t) => t.type === filters.type);
          }
          if (filters.source) {
            transactions = transactions.filter((t) => t.source === filters.source);
          }
          if (filters.dateFrom) {
            transactions = transactions.filter((t) => t.timestamp >= filters.dateFrom!);
          }
          if (filters.dateTo) {
            transactions = transactions.filter((t) => t.timestamp <= filters.dateTo!);
          }
          if (filters.minAmount !== undefined) {
            transactions = transactions.filter((t) => Math.abs(t.amount) >= filters.minAmount!);
          }
          if (filters.maxAmount !== undefined) {
            transactions = transactions.filter((t) => Math.abs(t.amount) <= filters.maxAmount!);
          }
        }

        return limit ? transactions.slice(0, limit) : transactions;
      },

      // Clear Transaction History
      clearTransactionHistory: () => {
        set({ transactions: [] });
      },

      // Get Single Transaction
      getTransaction: (id) => {
        return get().transactions.find((t) => t.id === id);
      },

      // Add to Cart
      addToCart: (item, quantity = 1) => {
        const state = get();
        const existingItem = state.cart.find((cartItem) => cartItem.id === item.id);

        if (existingItem) {
          // Update quantity if item exists
          set({
            cart: state.cart.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + quantity }
                : cartItem
            ),
          });
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...item,
            quantity,
            addedAt: new Date(),
          };
          set({ cart: [...state.cart, cartItem] });
        }
      },

      // Remove from Cart
      removeFromCart: (itemId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== itemId),
        }));
      },

      // Update Cart Item Quantity
      updateCartItemQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      // Clear Cart
      clearCart: () => {
        set({ cart: [] });
      },

      // Get Cart Total
      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      // Get Cart Item Count
      getCartItemCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Purchase Single Item
      purchaseItem: async (itemId) => {
        const state = get();
        const item = state.cart.find((i) => i.id === itemId);

        if (!item) {
          return {
            success: false,
            error: 'Item not found in cart',
          };
        }

        const totalCost = item.price * item.quantity;

        if (!state.canAfford(totalCost)) {
          return {
            success: false,
            error: `Insufficient balance. Need ${totalCost} ML, have ${state.balance.current} ML`,
          };
        }

        // Perform purchase
        const success = await state.spendCoins(totalCost, item.name, item.id);

        if (success) {
          // Add to inventory
          state.addToInventory(item);
          // Remove from cart
          state.removeFromCart(itemId);

          return {
            success: true,
            transactionId: state.transactions[0]?.id,
            newBalance: state.balance.current,
            itemsAcquired: [item],
          };
        }

        return {
          success: false,
          error: 'Purchase failed',
        };
      },

      // Purchase Entire Cart
      purchaseCart: async () => {
        const state = get();
        const totalCost = state.getCartTotal();

        if (state.cart.length === 0) {
          return {
            success: false,
            error: 'Cart is empty',
          };
        }

        if (!state.canAfford(totalCost)) {
          return {
            success: false,
            error: `Insufficient balance. Need ${totalCost} ML, have ${state.balance.current} ML`,
          };
        }

        // Perform purchase
        const itemNames = state.cart.map((item) => item.name).join(', ');
        const success = await state.spendCoins(totalCost, itemNames);

        if (success) {
          // Add all items to inventory
          const acquiredItems: ShopItem[] = [];
          state.cart.forEach((item) => {
            state.addToInventory(item);
            acquiredItems.push(item);
          });

          // Clear cart
          state.clearCart();

          return {
            success: true,
            transactionId: state.transactions[0]?.id,
            newBalance: state.balance.current,
            itemsAcquired: acquiredItems,
          };
        }

        return {
          success: false,
          error: 'Purchase failed',
        };
      },

      // Check if can afford
      canAfford: (amount) => {
        return get().balance.current >= amount;
      },

      // Add to Inventory
      addToInventory: (item) => {
        const state = get();
        // Prevent duplicates for non-stackable items
        if (!item.metadata?.stackable && state.hasItem(item.id)) {
          return;
        }

        set({
          inventory: [...state.inventory, { ...item, isOwned: true }],
        });
      },

      // Remove from Inventory
      removeFromInventory: (itemId) => {
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== itemId),
        }));
      },

      // Check if has item
      hasItem: (itemId) => {
        return get().inventory.some((item) => item.id === itemId);
      },

      // Get Inventory Value
      getInventoryValue: () => {
        return get().inventory.reduce((total, item) => total + item.price, 0);
      },

      // Get Economy Statistics
      getEconomyStats: () => {
        const state = get();
        const earnTransactions = state.transactions.filter((t) => t.type === 'earn');
        const spendTransactions = state.transactions.filter((t) => t.type === 'spend');

        // Calculate favorite category
        const categorySpending: Record<string, number> = {};
        state.inventory.forEach((item) => {
          categorySpending[item.category] = (categorySpending[item.category] || 0) + item.price;
        });
        const favoriteCategory = Object.entries(categorySpending).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0] || 'cosmetics';

        // Find biggest purchase
        const biggestTransaction = spendTransactions.sort(
          (a, b) => Math.abs(b.amount) - Math.abs(a.amount)
        )[0];

        // Find top earning source
        const sourceEarnings: Record<string, number> = {};
        earnTransactions.forEach((t) => {
          sourceEarnings[t.source] = (sourceEarnings[t.source] || 0) + t.amount;
        });
        const topSource = Object.entries(sourceEarnings).sort(([, a], [, b]) => b - a)[0];

        return {
          totalEarned: state.balance.lifetime,
          totalSpent: state.balance.spent,
          currentBalance: state.balance.current,
          netWorth: state.balance.current + state.getInventoryValue(),
          transactionCount: state.transactions.length,
          favoriteCategory: favoriteCategory as any,
          biggestPurchase: biggestTransaction
            ? {
                item: biggestTransaction.description,
                amount: Math.abs(biggestTransaction.amount),
                date: biggestTransaction.timestamp,
              }
            : {
                item: 'None',
                amount: 0,
                date: new Date(),
              },
          topEarningSource: topSource
            ? {
                source: topSource[0],
                amount: topSource[1],
              }
            : {
                source: 'None',
                amount: 0,
              },
        };
      },

      // Reset Store
      reset: () => {
        set({
          balance: initialBalance,
          transactions: [],
          inventory: [],
          cart: [],
          isLoading: false,
          error: null,
        });
      },

      // Set Loading
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Set Error
      setError: (error) => {
        set({ error });
      },

      // ========================================================================
      // API SYNC ACTIONS
      // ========================================================================

      /**
       * Fetch balance from backend
       */
      fetchBalance: async () => {
        set({ isLoading: true, error: null });
        try {
          // Get userId from auth store
          const userId = useAuthStore.getState().user?.id;
          if (!userId) {
            throw new Error('User not authenticated. Please login first.');
          }

          const balance = await getBalance(userId);
          set({
            balance,
            isLoading: false,
            error: null
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch balance';
          set({
            isLoading: false,
            error: errorMessage
          });
          console.error('Error fetching balance:', error);
        }
      },
    }),
    {
      name: 'glit-economy-storage',
      version: 1,
    }
  )
);
