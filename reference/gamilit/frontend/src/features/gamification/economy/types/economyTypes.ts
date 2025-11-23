/**
 * Economy System Types - ML Coins Virtual Economy
 *
 * This file defines all TypeScript interfaces for the GLIT Platform economy system,
 * including ML Coins, shop items, transactions, and economic metrics.
 */

/**
 * Shop Categories - 5 main categories for the virtual economy
 */
export type ShopCategory = 'cosmetics' | 'profile' | 'guild' | 'premium' | 'social';

/**
 * Item Rarity Levels - Affects pricing and visual appearance
 */
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

/**
 * Transaction Types - For ML Coins flow tracking
 */
export type TransactionType = 'earn' | 'spend';

/**
 * Earning Sources - Where ML Coins can be earned from
 */
export type EarningSource =
  | 'exercise_completion'
  | 'streak_bonus'
  | 'perfect_score'
  | 'achievement_unlock'
  | 'daily_login'
  | 'guild_challenge'
  | 'leaderboard_reward'
  | 'referral_bonus'
  | 'admin_grant';

/**
 * Economic Health Status - For monitoring system
 */
export type EconomicHealthStatus = 'healthy' | 'warning' | 'critical';

/**
 * ML Coins Balance Information
 */
export interface MLCoinsBalance {
  current: number;          // Current available balance
  lifetime: number;         // Total coins earned lifetime
  spent: number;            // Total coins spent
  pending: number;          // Coins pending from ongoing activities
}

/**
 * Transaction Record
 * Tracks all ML Coins movements (earnings and spending)
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;           // Positive for earn, negative for spend
  source: EarningSource | string;  // Source of earn or item purchased
  description: string;      // Human-readable description
  timestamp: Date;
  balanceAfter: number;     // Balance after this transaction
  metadata?: {
    itemId?: string;        // If purchased item
    exerciseId?: string;    // If from exercise
    achievementId?: string; // If from achievement
  };
}

/**
 * Shop Item Requirements
 * Optional requirements to unlock purchase
 */
export interface ShopItemRequirements {
  rank?: string;            // Minimum rank required (e.g., "Ajaw", "Halach Uinic")
  level?: number;           // Minimum level required
  achievement?: string;     // Specific achievement required
  guildMember?: boolean;    // Must be in a guild
}

/**
 * Shop Item Definition
 * Represents a purchasable item in the shop
 */
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopCategory;
  price: number;            // Price in ML Coins
  icon: string;             // Lucide icon name or emoji
  image?: string;           // Optional image URL
  rarity: ItemRarity;
  tags?: string[];           // For search and filtering
  isOwned?: boolean;         // Whether user owns this item
  isPurchasable?: boolean;   // Whether can be purchased (not sold out, etc.)
  requirements?: ShopItemRequirements;
  previewData?: unknown;    // Category-specific preview data
  metadata?: {
    effectDescription?: string;  // What this item does
    duration?: number;            // If temporary effect (days)
    stackable?: boolean;          // Can own multiple
    tradeable?: boolean;          // Can trade with others
  };
  stock?: number;        // Remaining stock (for limited items)
  available?: boolean;   // Whether item is currently available
}

/**
 * Earning Source Breakdown
 * For analytics dashboard showing where coins came from
 */
export interface EarningSourceData {
  source: string;
  amount: number;
  percentage: number;
  color: string;            // For chart visualization
  icon: string;             // Lucide icon name
}

/**
 * Spending Category Data
 * For analytics dashboard showing spending patterns
 */
export interface SpendingCategoryData {
  category: ShopCategory;
  amount: number;
  percentage: number;
  itemCount: number;        // Number of items purchased
  color: string;
}

/**
 * Economic Metrics
 * For admin dashboard to monitor economy health
 */
export interface EconomicMetrics {
  inflationRate: number;    // Monthly inflation rate (%)
  mlVelocity: number;       // Circulation speed (0.8-1.2 healthy)
  totalSupply: number;      // Total ML Coins in circulation
  totalDemand: number;      // Total ML Coins spent in period
  activeUsers: number;      // Users transacting in period
  averageBalance: number;   // Average user balance
  healthStatus: EconomicHealthStatus;
  lastUpdated: Date;
}

/**
 * Shopping Cart Item
 */
export interface CartItem extends ShopItem {
  quantity: number;         // For stackable items
  addedAt: Date;
}

/**
 * Purchase Result
 */
export interface PurchaseResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  newBalance?: number;
  itemsAcquired?: ShopItem[];
}

/**
 * User Inventory
 */
export interface UserInventory {
  items: ShopItem[];
  totalValue: number;       // Total ML Coins value
  lastUpdated: Date;
}

/**
 * Economic Intervention Trigger
 * Alerts for when economy needs adjustment
 */
export interface InterventionTrigger {
  id: string;
  type: 'inflation' | 'deflation' | 'low_velocity' | 'high_velocity' | 'supply_shock';
  severity: 'low' | 'medium' | 'high';
  message: string;
  triggeredAt: Date;
  metrics: Partial<EconomicMetrics>;
  suggestedActions: string[];
}

/**
 * Time-based Analytics Period
 */
export type AnalyticsPeriod = '24h' | '7d' | '30d' | '90d' | 'all';

/**
 * Transaction History Filter Options
 */
export interface TransactionFilters {
  type?: TransactionType;
  source?: EarningSource | string;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Shop Filters
 */
export interface ShopFilters {
  category?: ShopCategory;
  rarity?: ItemRarity;
  priceMin?: number;
  priceMax?: number;
  owned?: boolean;
  available?: boolean;      // Can purchase
  searchQuery?: string;
  tags?: string[];
}

/**
 * Shop Sort Options
 */
export type ShopSortBy = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'rarity' | 'newest';

/**
 * Notification for economy events
 */
export interface EconomyNotification {
  id: string;
  type: 'purchase_success' | 'purchase_failed' | 'coins_earned' | 'achievement_reward';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

/**
 * Economy Statistics Summary
 */
export interface EconomyStats {
  totalEarned: number;
  totalSpent: number;
  currentBalance: number;
  netWorth: number;         // Balance + inventory value
  transactionCount: number;
  favoriteCategory: ShopCategory;
  biggestPurchase: {
    item: string;
    amount: number;
    date: Date;
  };
  topEarningSource: {
    source: string;
    amount: number;
  };
}
