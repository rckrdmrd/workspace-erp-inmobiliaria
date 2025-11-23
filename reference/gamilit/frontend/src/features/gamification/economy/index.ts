/**
 * ML Coins Economy System - Main Exports
 *
 * Centralized export file for the economy feature
 */

// Types
export type * from './types/economyTypes';

// Schemas
export * from './schemas/economySchemas';

// Store
export { useEconomyStore } from './store/economyStore';

// Hooks
export { useCoins } from './hooks/useCoins';
export { useShop } from './hooks/useShop';
export { useTransactions } from './hooks/useTransactions';
export { useInventory } from './hooks/useInventory';

// Components - Wallet
export { CoinWallet } from './components/Wallet/CoinWallet';
export { CoinBalanceWidget } from './components/Wallet/CoinBalanceWidget';
export { TransactionHistory } from './components/Wallet/TransactionHistory';
export { EarningSourcesBreakdown } from './components/Wallet/EarningSourcesBreakdown';

// Components - Shop
export { ShopLayout } from './components/Shop/ShopLayout';
export { ShopNavigation } from './components/Shop/ShopNavigation';
export { ShopItem } from './components/Shop/ShopItem';
export { ShoppingCart } from './components/Shop/ShoppingCart';
export { PurchaseConfirmation } from './components/Shop/PurchaseConfirmation';

// Components - Inventory
export { UserInventory } from './components/Inventory/UserInventory';
export { InventoryItem } from './components/Inventory/InventoryItem';

// Components - Analytics
export { SpendingAnalytics } from './components/Analytics/SpendingAnalytics';
export { EconomicDashboard } from './components/Analytics/EconomicDashboard';

// Mock Data
export * from './mockData/shopItemsMockData';
export * from './mockData/economyMockData';
