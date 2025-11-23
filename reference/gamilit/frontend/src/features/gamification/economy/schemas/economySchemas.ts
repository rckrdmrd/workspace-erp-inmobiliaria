/**
 * Economy System Zod Schemas - Validation & Type Safety
 *
 * Provides runtime validation for all economy-related data structures
 * using Zod for type-safe parsing and validation.
 */

import { z } from 'zod';

/**
 * Shop Category Schema
 */
export const shopCategorySchema = z.enum(['cosmetics', 'profile', 'guild', 'premium', 'social']);

/**
 * Item Rarity Schema
 */
export const itemRaritySchema = z.enum(['common', 'rare', 'epic', 'legendary']);

/**
 * Transaction Type Schema
 */
export const transactionTypeSchema = z.enum(['earn', 'spend']);

/**
 * Earning Source Schema
 */
export const earningSourceSchema = z.enum([
  'exercise_completion',
  'streak_bonus',
  'perfect_score',
  'achievement_unlock',
  'daily_login',
  'guild_challenge',
  'leaderboard_reward',
  'referral_bonus',
  'admin_grant',
]);

/**
 * ML Coins Balance Schema
 */
export const mlCoinsBalanceSchema = z.object({
  current: z.number().min(0, 'Balance cannot be negative'),
  lifetime: z.number().min(0),
  spent: z.number().min(0),
  pending: z.number().min(0),
});

/**
 * Transaction Schema
 */
export const transactionSchema = z.object({
  id: z.string().uuid(),
  type: transactionTypeSchema,
  amount: z.number(),
  source: z.string(),
  description: z.string().min(1).max(500),
  timestamp: z.date(),
  balanceAfter: z.number().min(0),
  metadata: z
    .object({
      itemId: z.string().optional(),
      exerciseId: z.string().optional(),
      achievementId: z.string().optional(),
    })
    .optional(),
});

/**
 * Shop Item Requirements Schema
 */
export const shopItemRequirementsSchema = z.object({
  rank: z.string().optional(),
  level: z.number().min(1).optional(),
  achievement: z.string().optional(),
  guildMember: z.boolean().optional(),
});

/**
 * Shop Item Schema
 */
export const shopItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  category: shopCategorySchema,
  price: z.number().min(0).max(10000, 'Price too high'),
  icon: z.string(),
  image: z.string().url().optional(),
  rarity: itemRaritySchema,
  tags: z.array(z.string()),
  isOwned: z.boolean(),
  isPurchasable: z.boolean(),
  requirements: shopItemRequirementsSchema.optional(),
  previewData: z.unknown().optional(),
  metadata: z
    .object({
      effectDescription: z.string().optional(),
      duration: z.number().optional(),
      stackable: z.boolean().optional(),
      tradeable: z.boolean().optional(),
    })
    .optional(),
});

/**
 * Earning Source Data Schema (for analytics)
 */
export const earningSourceDataSchema = z.object({
  source: z.string(),
  amount: z.number().min(0),
  percentage: z.number().min(0).max(100),
  color: z.string(),
  icon: z.string(),
});

/**
 * Spending Category Data Schema (for analytics)
 */
export const spendingCategoryDataSchema = z.object({
  category: shopCategorySchema,
  amount: z.number().min(0),
  percentage: z.number().min(0).max(100),
  itemCount: z.number().min(0),
  color: z.string(),
});

/**
 * Economic Metrics Schema
 */
export const economicMetricsSchema = z.object({
  inflationRate: z.number(),
  mlVelocity: z.number().min(0),
  totalSupply: z.number().min(0),
  totalDemand: z.number().min(0),
  activeUsers: z.number().min(0),
  averageBalance: z.number().min(0),
  healthStatus: z.enum(['healthy', 'warning', 'critical']),
  lastUpdated: z.date(),
});

/**
 * Cart Item Schema
 */
export const cartItemSchema = shopItemSchema.extend({
  quantity: z.number().min(1).max(99),
  addedAt: z.date(),
});

/**
 * Purchase Result Schema
 */
export const purchaseResultSchema = z.object({
  success: z.boolean(),
  transactionId: z.string().optional(),
  error: z.string().optional(),
  newBalance: z.number().optional(),
  itemsAcquired: z.array(shopItemSchema).optional(),
});

/**
 * Transaction Filters Schema
 */
export const transactionFiltersSchema = z.object({
  type: transactionTypeSchema.optional(),
  source: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

/**
 * Shop Filters Schema
 */
export const shopFiltersSchema = z.object({
  category: shopCategorySchema.optional(),
  rarity: itemRaritySchema.optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  owned: z.boolean().optional(),
  available: z.boolean().optional(),
  searchQuery: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Shop Sort Schema
 */
export const shopSortBySchema = z.enum([
  'price_asc',
  'price_desc',
  'name_asc',
  'name_desc',
  'rarity',
  'newest',
]);

/**
 * Purchase Request Schema
 */
export const purchaseRequestSchema = z.object({
  itemIds: z.array(z.string()).min(1, 'Must select at least one item'),
  totalAmount: z.number().min(0),
});

/**
 * Add Coins Request Schema (for earning)
 */
export const addCoinsRequestSchema = z.object({
  amount: z.number().min(1).max(1000, 'Cannot add more than 1000 coins at once'),
  source: earningSourceSchema,
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Economic Intervention Trigger Schema
 */
export const interventionTriggerSchema = z.object({
  id: z.string(),
  type: z.enum(['inflation', 'deflation', 'low_velocity', 'high_velocity', 'supply_shock']),
  severity: z.enum(['low', 'medium', 'high']),
  message: z.string(),
  triggeredAt: z.date(),
  metrics: economicMetricsSchema.partial(),
  suggestedActions: z.array(z.string()),
});

/**
 * Economy Stats Schema
 */
export const economyStatsSchema = z.object({
  totalEarned: z.number().min(0),
  totalSpent: z.number().min(0),
  currentBalance: z.number().min(0),
  netWorth: z.number().min(0),
  transactionCount: z.number().min(0),
  favoriteCategory: shopCategorySchema,
  biggestPurchase: z.object({
    item: z.string(),
    amount: z.number(),
    date: z.date(),
  }),
  topEarningSource: z.object({
    source: z.string(),
    amount: z.number(),
  }),
});

/**
 * Type inference from schemas
 */
export type ShopCategoryType = z.infer<typeof shopCategorySchema>;
export type ItemRarityType = z.infer<typeof itemRaritySchema>;
export type TransactionSchemaType = z.infer<typeof transactionSchema>;
export type ShopItemType = z.infer<typeof shopItemSchema>;
export type PurchaseRequestType = z.infer<typeof purchaseRequestSchema>;
export type AddCoinsRequestType = z.infer<typeof addCoinsRequestSchema>;
