/**
 * Maya Ranks & Progression System - Type Definitions
 *
 * Complete type system for the GLIT Platform gamification ranks.
 * Features 5 Maya-themed ranks with prestige system and multipliers.
 */

// ============================================================================
// MAYA RANK TYPES
// ============================================================================

/**
 * The 5 Maya Ranks in order of progression
 * Official names according to /docs/01-requerimientos/gamificacion/01-RANGOS-MAYA.md
 */
export type MayaRank = 'Ajaw' | 'Nacom' | 'Ah K\'in' | 'Halach Uinic' | 'K\'uk\'ulkan';

/**
 * Complete definition of a rank tier
 */
export interface RankDefinition {
  /** Unique rank identifier */
  id: MayaRank;

  /** Maya name (original) */
  name: string;

  /** Spanish equivalent name */
  nameSpanish: string;

  /** Description of the rank */
  description: string;

  /** ML Coins required to reach this rank */
  mlCoinsRequired: number;

  /** Base multiplier for this rank */
  multiplier: number;

  /** Gradient start color (Tailwind class) */
  colorFrom: string;

  /** Gradient end color (Tailwind class) */
  colorTo: string;

  /** CSS gradient class */
  gradient: string;

  /** Icon identifier for Maya iconography */
  icon: string;

  /** List of benefits unlocked at this rank */
  benefits: string[];

  /** Order in hierarchy (0-4) */
  order: number;
}

// ============================================================================
// USER PROGRESSION TYPES
// ============================================================================

/**
 * User's current rank progress and statistics
 */
export interface UserRankProgress {
  /** Current rank */
  currentRank: MayaRank;

  /** Current level within rank (for sub-progression) */
  currentLevel: number;

  /** Current XP in current level */
  currentXP: number;

  /** XP needed to reach next level */
  xpToNextLevel: number;

  /** Total XP earned all-time */
  totalXP: number;

  /** Total ML Coins earned all-time */
  mlCoinsEarned: number;

  /** Current prestige level (0 = no prestige) */
  prestigeLevel: number;

  /** Current total multiplier (from all sources) */
  multiplier: number;

  /** Last time user ranked up */
  lastRankUp: Date;

  /** Current activity streak in days */
  activityStreak: number;

  /** Last activity date */
  lastActivityDate: Date;

  /** Whether user is eligible for next rank */
  canRankUp: boolean;

  /** Next rank (if applicable) */
  nextRank: MayaRank | null;

  /** Whether user is eligible for prestige */
  canPrestige: boolean;
}

/**
 * XP earning event
 */
export interface XPEvent {
  /** Unique event ID */
  id: string;

  /** XP amount earned */
  amount: number;

  /** Source of XP */
  source: XPSource;

  /** Timestamp of event */
  timestamp: Date;

  /** Optional description */
  description?: string;

  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Sources of XP earnings
 */
export type XPSource =
  | 'exercise_completion'
  | 'perfect_score'
  | 'streak_bonus'
  | 'achievement_unlock'
  | 'social_interaction'
  | 'daily_challenge'
  | 'guild_activity'
  | 'event_participation';

/**
 * Rank up event data
 */
export interface RankUpEvent {
  /** Previous rank */
  fromRank: MayaRank;

  /** New rank achieved */
  toRank: MayaRank;

  /** Timestamp of rank up */
  timestamp: Date;

  /** New benefits unlocked */
  newBenefits: string[];

  /** New multiplier value */
  newMultiplier: number;

  /** Whether this was after a prestige */
  isPrestige: boolean;
}

// ============================================================================
// PRESTIGE SYSTEM TYPES
// ============================================================================

/**
 * Prestige tier definition and bonuses
 */
export interface PrestigeBonus {
  /** Prestige level (1, 2, 3...) */
  level: number;

  /** Permanent multiplier bonus (additive) */
  bonusMultiplier: number;

  /** Features unlocked at this prestige level */
  unlockedFeatures: string[];

  /** Cosmetic rewards unlocked */
  cosmetics: string[];

  /** Special abilities unlocked */
  abilities: string[];

  /** Badge/icon for this prestige level */
  badge: string;

  /** Color theme for prestige level */
  color: string;
}

/**
 * Prestige progression data
 */
export interface PrestigeProgress {
  /** Current prestige level */
  level: number;

  /** Total times prestiged */
  totalPrestiges: number;

  /** Total XP earned across all prestiges */
  totalXPAllTime: number;

  /** Total ML Coins earned across all prestiges */
  totalMLCoinsAllTime: number;

  /** Date of last prestige */
  lastPrestigeDate: Date | null;

  /** Bonus multiplier from prestige */
  bonusMultiplier?: number;

  /** All prestige bonuses currently active */
  activeBonuses: PrestigeBonus[];

  /** Cumulative multiplier from all prestiges */
  cumulativeMultiplier: number;
}

// ============================================================================
// MULTIPLIER SYSTEM TYPES
// ============================================================================

/**
 * Source of a multiplier bonus
 */
export type MultiplierSourceType =
  | 'rank'           // Base rank multiplier
  | 'prestige'       // Permanent prestige bonus
  | 'streak'         // Activity streak bonus
  | 'time'           // Time-limited event
  | 'social'         // Social interaction bonus
  | 'guild'          // Guild membership bonus
  | 'achievement'    // Achievement unlock bonus
  | 'event';         // Special event bonus

/**
 * Individual multiplier source
 */
export interface MultiplierSource {
  /** Type of multiplier */
  type: MultiplierSourceType;

  /** Name/label of multiplier */
  name: string;

  /** Multiplier value (e.g., 1.25 for 25% bonus) */
  value: number;

  /** Optional expiry time for temporary multipliers */
  expiresAt?: Date;

  /** Whether this is a permanent multiplier */
  isPermanent: boolean;

  /** Optional description */
  description?: string;

  /** Optional icon */
  icon?: string;
}

/**
 * Complete multiplier breakdown
 */
export interface MultiplierBreakdown {
  /** Base multiplier (always 1.0) */
  base: number;

  /** Current rank multiplier */
  rank: MultiplierSource;

  /** All active multipliers */
  sources: MultiplierSource[];

  /** Total multiplier (product of all sources) */
  total: number;

  /** Whether any multipliers are expiring soon */
  hasExpiringSoon: boolean;

  /** Multipliers expiring in next 24 hours */
  expiringSoon: MultiplierSource[];
}

// ============================================================================
// PROGRESSION HISTORY TYPES
// ============================================================================

/**
 * Historical progression entry
 */
export interface ProgressionHistoryEntry {
  /** Entry ID */
  id: string;

  /** Type of progression event */
  type: 'rank_up' | 'prestige' | 'level_up' | 'milestone';

  /** Timestamp */
  timestamp: Date;

  /** Title/summary */
  title: string;

  /** Detailed description */
  description: string;

  /** Additional details (legacy/alternative) */
  details?: string;

  /** Associated rank (if applicable) */
  rank?: MayaRank;

  /** XP at time of event */
  xpSnapshot: number;

  /** Level at time of event */
  levelSnapshot: number;

  /** Multiplier at time of event */
  multiplierSnapshot: number;
}

/**
 * Progression statistics
 */
export interface ProgressionStats {
  /** Total XP earned */
  totalXP: number;

  /** Total ML Coins earned */
  totalMLCoins: number;

  /** Total rank ups */
  totalRankUps: number;

  /** Total prestiges */
  totalPrestiges: number;

  /** Total levels gained */
  totalLevels: number;

  /** Days active */
  daysActive: number;

  /** Best activity streak */
  bestStreak: number;

  /** Current activity streak */
  currentStreak: number;

  /** Average XP per day */
  avgXPPerDay: number;

  /** Rank achievement dates */
  rankAchievements: Record<MayaRank, Date | null>;
}

// ============================================================================
// UI COMPONENT TYPES
// ============================================================================

/**
 * Rank badge display options
 */
export interface RankBadgeOptions {
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /** Show rank name */
  showName?: boolean;

  /** Show prestige stars */
  showPrestige?: boolean;

  /** Animated effects */
  animated?: boolean;

  /** Show glow effect */
  showGlow?: boolean;

  /** Show tooltip with details */
  showTooltip?: boolean;

  /** Click handler */
  onClick?: () => void;
}

/**
 * Progress bar milestone
 */
export interface ProgressMilestone {
  /** Milestone XP value */
  xp: number;

  /** Label for milestone */
  label: string;

  /** Icon for milestone */
  icon?: string;

  /** Whether milestone is completed */
  completed: boolean;
}

/**
 * Rank comparison data
 */
export interface RankComparison {
  /** Current rank */
  current: RankDefinition;

  /** Target rank to compare */
  target: RankDefinition;

  /** XP difference needed */
  xpDifference: number;

  /** ML Coins difference needed */
  mlCoinsDifference: number;

  /** Multiplier increase */
  multiplierIncrease: number;

  /** New benefits that will be unlocked */
  newBenefits: string[];
}

// ============================================================================
// API INTEGRATION TYPES
// ============================================================================

/**
 * Request to add XP to user
 */
export interface AddXPRequest {
  /** User ID */
  userId: string;

  /** XP amount to add */
  amount: number;

  /** Source of XP */
  source: XPSource;

  /** Optional description */
  description?: string;

  /** Optional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Response from adding XP
 */
export interface AddXPResponse {
  /** Success status */
  success: boolean;

  /** New XP total */
  newXP: number;

  /** New level */
  newLevel: number;

  /** Whether user leveled up */
  leveledUp: boolean;

  /** Whether user ranked up */
  rankedUp: boolean;

  /** New rank (if ranked up) */
  newRank?: MayaRank;

  /** Rank up event data (if applicable) */
  rankUpEvent?: RankUpEvent;
}

/**
 * Request to prestige
 */
export interface PrestigeRequest {
  /** User ID */
  userId: string;

  /** Confirmation flag */
  confirmed: boolean;
}

/**
 * Response from prestige
 */
export interface PrestigeResponse {
  /** Success status */
  success: boolean;

  /** New prestige level */
  prestigeLevel: number;

  /** New starting rank */
  newRank: MayaRank;

  /** Prestige bonuses granted */
  bonuses: PrestigeBonus;

  /** New multiplier */
  newMultiplier: number;
}

// ============================================================================
// DECAY & MAINTENANCE TYPES
// ============================================================================

/**
 * Rank decay prevention status
 */
export interface DecayPreventionStatus {
  /** Whether rank decay is active */
  isActive: boolean;

  /** Days until decay begins */
  daysUntilDecay: number;

  /** Required activity to prevent decay */
  requiredActivity: string;

  /** Last activity date */
  lastActivityDate: Date;

  /** Decay grace period end date */
  decayGracePeriodEnd: Date;

  /** Whether in grace period */
  inGracePeriod: boolean;
}

/**
 * Activity requirement for rank maintenance
 */
export interface ActivityRequirement {
  /** Rank this applies to */
  rank: MayaRank;

  /** Minimum activities per week */
  minActivitiesPerWeek: number;

  /** Minimum XP per week */
  minXPPerWeek: number;

  /** Grace period in days */
  gracePeriodDays: number;

  /** Penalty for not meeting requirement */
  penalty: 'warning' | 'multiplier_reduction' | 'rank_demotion';
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * XP required per level (base formula: level * 100)
 */
export const XP_PER_LEVEL = 100;

/**
 * ML Coins to XP conversion rate
 */
export const ML_COINS_TO_XP_RATE = 5;

/**
 * Maximum prestige level
 */
export const MAX_PRESTIGE_LEVEL = 10;

/**
 * Days of inactivity before decay warning
 */
export const DECAY_WARNING_DAYS = 7;

/**
 * Days of inactivity before decay begins
 */
export const DECAY_START_DAYS = 14;
