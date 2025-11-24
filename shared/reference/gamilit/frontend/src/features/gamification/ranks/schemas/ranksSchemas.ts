/**
 * Maya Ranks & Progression System - Zod Validation Schemas
 *
 * Complete validation schemas for all rank-related data structures.
 */

import { z } from 'zod';

// ============================================================================
// MAYA RANK SCHEMAS
// ============================================================================

/**
 * Maya rank enum schema - Official names
 * @see /docs/01-requerimientos/gamificacion/01-RANGOS-MAYA.md
 */
export const MayaRankSchema = z.enum(['Ajaw', 'Nacom', 'Ah K\'in', 'Halach Uinic', 'K\'uk\'ulkan']);

/**
 * Rank definition schema
 */
export const RankDefinitionSchema = z.object({
  id: MayaRankSchema,
  name: z.string().min(1),
  nameSpanish: z.string().min(1),
  description: z.string().min(1),
  mlCoinsRequired: z.number().int().min(0),
  multiplier: z.number().min(1.0).max(10.0),
  colorFrom: z.string(),
  colorTo: z.string(),
  gradient: z.string(),
  icon: z.string(),
  benefits: z.array(z.string()),
  order: z.number().int().min(0).max(4),
});

// ============================================================================
// USER PROGRESSION SCHEMAS
// ============================================================================

/**
 * User rank progress schema
 */
export const UserRankProgressSchema = z.object({
  currentRank: MayaRankSchema,
  currentLevel: z.number().int().min(1),
  currentXP: z.number().int().min(0),
  xpToNextLevel: z.number().int().min(1),
  totalXP: z.number().int().min(0),
  mlCoinsEarned: z.number().int().min(0),
  prestigeLevel: z.number().int().min(0).max(10),
  multiplier: z.number().min(1.0),
  lastRankUp: z.date(),
  activityStreak: z.number().int().min(0),
  lastActivityDate: z.date(),
  canRankUp: z.boolean(),
  nextRank: MayaRankSchema.nullable(),
  canPrestige: z.boolean(),
});

/**
 * XP source enum schema
 */
export const XPSourceSchema = z.enum([
  'exercise_completion',
  'perfect_score',
  'streak_bonus',
  'achievement_unlock',
  'social_interaction',
  'daily_challenge',
  'guild_activity',
  'event_participation',
]);

/**
 * XP event schema
 */
export const XPEventSchema = z.object({
  id: z.string().uuid(),
  amount: z.number().int().min(1),
  source: XPSourceSchema,
  timestamp: z.date(),
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Rank up event schema
 */
export const RankUpEventSchema = z.object({
  fromRank: MayaRankSchema,
  toRank: MayaRankSchema,
  timestamp: z.date(),
  newBenefits: z.array(z.string()),
  newMultiplier: z.number().min(1.0),
  isPrestige: z.boolean(),
});

// ============================================================================
// PRESTIGE SYSTEM SCHEMAS
// ============================================================================

/**
 * Prestige bonus schema
 */
export const PrestigeBonusSchema = z.object({
  level: z.number().int().min(1).max(10),
  bonusMultiplier: z.number().min(0),
  unlockedFeatures: z.array(z.string()),
  cosmetics: z.array(z.string()),
  abilities: z.array(z.string()),
  badge: z.string(),
  color: z.string(),
});

/**
 * Prestige progress schema
 */
export const PrestigeProgressSchema = z.object({
  level: z.number().int().min(0).max(10),
  totalPrestiges: z.number().int().min(0),
  totalXPAllTime: z.number().int().min(0),
  totalMLCoinsAllTime: z.number().int().min(0),
  lastPrestigeDate: z.date().nullable(),
  activeBonuses: z.array(PrestigeBonusSchema),
  cumulativeMultiplier: z.number().min(1.0),
});

// ============================================================================
// MULTIPLIER SYSTEM SCHEMAS
// ============================================================================

/**
 * Multiplier source type schema
 */
export const MultiplierSourceTypeSchema = z.enum([
  'rank',
  'prestige',
  'streak',
  'time',
  'social',
  'guild',
  'achievement',
  'event',
]);

/**
 * Multiplier source schema
 */
export const MultiplierSourceSchema = z.object({
  type: MultiplierSourceTypeSchema,
  name: z.string().min(1),
  value: z.number().min(1.0),
  expiresAt: z.date().optional(),
  isPermanent: z.boolean(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

/**
 * Multiplier breakdown schema
 */
export const MultiplierBreakdownSchema = z.object({
  base: z.number().min(1.0),
  rank: MultiplierSourceSchema,
  sources: z.array(MultiplierSourceSchema),
  total: z.number().min(1.0),
  hasExpiringSoon: z.boolean(),
  expiringSoon: z.array(MultiplierSourceSchema),
});

// ============================================================================
// PROGRESSION HISTORY SCHEMAS
// ============================================================================

/**
 * Progression history entry type schema
 */
export const ProgressionHistoryEntryTypeSchema = z.enum([
  'rank_up',
  'prestige',
  'level_up',
  'milestone',
]);

/**
 * Progression history entry schema
 */
export const ProgressionHistoryEntrySchema = z.object({
  id: z.string().uuid(),
  type: ProgressionHistoryEntryTypeSchema,
  timestamp: z.date(),
  title: z.string().min(1),
  description: z.string().min(1),
  rank: MayaRankSchema.optional(),
  xpSnapshot: z.number().int().min(0),
  levelSnapshot: z.number().int().min(1),
  multiplierSnapshot: z.number().min(1.0),
});

/**
 * Progression statistics schema
 */
export const ProgressionStatsSchema = z.object({
  totalXP: z.number().int().min(0),
  totalMLCoins: z.number().int().min(0),
  totalRankUps: z.number().int().min(0),
  totalPrestiges: z.number().int().min(0),
  totalLevels: z.number().int().min(0),
  daysActive: z.number().int().min(0),
  bestStreak: z.number().int().min(0),
  currentStreak: z.number().int().min(0),
  avgXPPerDay: z.number().min(0),
  rankAchievements: z.record(z.string(), z.date().nullable()),
});

// ============================================================================
// API INTEGRATION SCHEMAS
// ============================================================================

/**
 * Add XP request schema
 */
export const AddXPRequestSchema = z.object({
  userId: z.string().uuid(),
  amount: z.number().int().min(1).max(10000),
  source: XPSourceSchema,
  description: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

/**
 * Add XP response schema
 */
export const AddXPResponseSchema = z.object({
  success: z.boolean(),
  newXP: z.number().int().min(0),
  newLevel: z.number().int().min(1),
  leveledUp: z.boolean(),
  rankedUp: z.boolean(),
  newRank: MayaRankSchema.optional(),
  rankUpEvent: RankUpEventSchema.optional(),
});

/**
 * Prestige request schema
 */
export const PrestigeRequestSchema = z.object({
  userId: z.string().uuid(),
  confirmed: z.boolean(),
});

/**
 * Prestige response schema
 */
export const PrestigeResponseSchema = z.object({
  success: z.boolean(),
  prestigeLevel: z.number().int().min(1).max(10),
  newRank: MayaRankSchema,
  bonuses: PrestigeBonusSchema,
  newMultiplier: z.number().min(1.0),
});

// ============================================================================
// DECAY & MAINTENANCE SCHEMAS
// ============================================================================

/**
 * Decay prevention status schema
 */
export const DecayPreventionStatusSchema = z.object({
  isActive: z.boolean(),
  daysUntilDecay: z.number().int().min(0),
  requiredActivity: z.string().min(1),
  lastActivityDate: z.date(),
  decayGracePeriodEnd: z.date(),
  inGracePeriod: z.boolean(),
});

/**
 * Activity penalty enum schema
 */
export const ActivityPenaltySchema = z.enum([
  'warning',
  'multiplier_reduction',
  'rank_demotion',
]);

/**
 * Activity requirement schema
 */
export const ActivityRequirementSchema = z.object({
  rank: MayaRankSchema,
  minActivitiesPerWeek: z.number().int().min(0),
  minXPPerWeek: z.number().int().min(0),
  gracePeriodDays: z.number().int().min(0),
  penalty: ActivityPenaltySchema,
});

// ============================================================================
// HELPER VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validates rank order progression - Official rank names
 * @see /docs/01-requerimientos/gamificacion/01-RANGOS-MAYA.md
 */
export function validateRankProgression(fromRank: string, toRank: string): boolean {
  const ranks = ['Ajaw', 'Nacom', 'Ah K\'in', 'Halach Uinic', 'K\'uk\'ulkan'];
  const fromIndex = ranks.indexOf(fromRank);
  const toIndex = ranks.indexOf(toRank);

  return toIndex === fromIndex + 1;
}

/**
 * Validates XP amount is reasonable for source
 */
export function validateXPAmount(amount: number, source: string): boolean {
  const maxXPBySource: Record<string, number> = {
    exercise_completion: 100,
    perfect_score: 200,
    streak_bonus: 50,
    achievement_unlock: 500,
    social_interaction: 25,
    daily_challenge: 150,
    guild_activity: 100,
    event_participation: 300,
  };

  return amount <= (maxXPBySource[source] || 100);
}

/**
 * Validates multiplier is within reasonable bounds
 */
export function validateMultiplier(multiplier: number): boolean {
  return multiplier >= 1.0 && multiplier <= 20.0;
}

/**
 * Validates prestige level is valid
 */
export function validatePrestigeLevel(level: number): boolean {
  return level >= 0 && level <= 10;
}

/**
 * Validates activity streak is reasonable
 */
export function validateActivityStreak(streak: number): boolean {
  return streak >= 0 && streak <= 365; // Max 1 year streak
}

// ============================================================================
// COMPOSITE VALIDATION SCHEMAS
// ============================================================================

/**
 * Complete user rank state schema (for storage)
 */
export const UserRankStateSchema = z.object({
  progress: UserRankProgressSchema,
  prestige: PrestigeProgressSchema,
  multipliers: MultiplierBreakdownSchema,
  history: z.array(ProgressionHistoryEntrySchema),
  stats: ProgressionStatsSchema,
  decay: DecayPreventionStatusSchema,
});

/**
 * Rank configuration schema (for system config)
 */
export const RankConfigSchema = z.object({
  ranks: z.array(RankDefinitionSchema),
  prestigeBonuses: z.array(PrestigeBonusSchema),
  activityRequirements: z.array(ActivityRequirementSchema),
  xpPerLevel: z.number().int().min(1),
  mlCoinsToXPRate: z.number().int().min(1),
  decayWarningDays: z.number().int().min(1),
  decayStartDays: z.number().int().min(1),
});
