/**
 * Gamification Types
 * Type definitions for Gamification Module API responses
 *
 * @see Backend: modules/gamification/controllers/user-stats.controller.ts
 * @see Database: gamification_system.user_stats
 */

/**
 * Maya Rank Enum
 * Matches database enum: gamification_system.maya_rank
 */
export enum MayaRank {
  AJAW = 'Ajaw',
  NACOM = 'Nacom',
  AH_KIN = "Ah K'in",
  HALACH_UINIC = 'Halach Uinic',
  KUKULKAN = "K'uk'ulkan"
}

/**
 * User Statistics
 * Complete user stats from gamification system
 * Synchronized with backend UserStats entity (37 fields)
 *
 * Backend source: /src/modules/gamification/entities/user-stats.entity.ts
 * Database table: gamification_system.user_stats
 */
export interface UserStats {
  /** User stats record ID (UUID) */
  id: string;

  /** User ID (FK → auth.users) */
  user_id: string;

  /** Tenant ID (FK → auth_management.tenants) */
  tenant_id?: string;

  // =====================================================
  // LEVEL & XP SYSTEM
  // =====================================================

  /** Current level (starts at 1) */
  level: number;

  /** Total XP accumulated */
  total_xp: number;

  /** XP needed to reach next level */
  xp_to_next_level: number;

  // =====================================================
  // MAYA RANK SYSTEM
  // =====================================================

  /** Current Maya rank (Ajaw, Nacom, Ah K'in, Halach Uinic, K'uk'ulkan) */
  current_rank: MayaRank | string;

  /** Progress towards next rank (0-100%) */
  rank_progress: number;

  // =====================================================
  // ML COINS SYSTEM
  // =====================================================

  /** Current ML Coins balance */
  ml_coins: number;

  /** Total ML Coins earned historically */
  ml_coins_earned_total: number;

  /** Total ML Coins spent historically */
  ml_coins_spent_total: number;

  /** ML Coins earned today (resets daily) */
  ml_coins_earned_today: number;

  /** Last ML Coins daily reset timestamp */
  last_ml_coins_reset?: string;

  // =====================================================
  // STREAK SYSTEM
  // =====================================================

  /** Current consecutive days active */
  current_streak: number;

  /** Maximum streak ever achieved */
  max_streak: number;

  /** When current streak started */
  streak_started_at?: string;

  /** Total days user has been active */
  days_active_total: number;

  // =====================================================
  // PROGRESS & COMPLETION METRICS
  // =====================================================

  /** Total exercises completed */
  exercises_completed: number;

  /** Total modules completed */
  modules_completed: number;

  /** Total cumulative score */
  total_score: number;

  /** Average score across all exercises (0-100) */
  average_score?: number;

  /** Number of exercises completed with perfect score (100%) */
  perfect_scores: number;

  // =====================================================
  // ACHIEVEMENTS & CERTIFICATES
  // =====================================================

  /** Total achievements earned */
  achievements_earned: number;

  /** Total certificates earned */
  certificates_earned: number;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  /** Total time spent on platform (interval string, e.g., "HH:MM:SS") */
  total_time_spent: string;

  /** Time spent in last week (interval string) */
  weekly_time_spent: string;

  /** Total number of learning sessions */
  sessions_count: number;

  // =====================================================
  // PERIODIC XP & ACTIVITY
  // =====================================================

  /** XP earned in last week */
  weekly_xp: number;

  /** XP earned in last month */
  monthly_xp: number;

  /** Exercises completed in last week */
  weekly_exercises: number;

  // =====================================================
  // RANKING POSITIONS (PRE-CALCULATED)
  // =====================================================

  /** Position in global leaderboard */
  global_rank_position?: number;

  /** Position in classroom leaderboard */
  class_rank_position?: number;

  /** Position in school leaderboard */
  school_rank_position?: number;

  // =====================================================
  // ACTIVITY TIMESTAMPS
  // =====================================================

  /** Last activity timestamp */
  last_activity_at?: string;

  /** Last login timestamp */
  last_login_at?: string;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /** Additional metadata (flexible JSONB) */
  metadata: Record<string, any>;

  /** Timestamp of record creation */
  created_at?: string;

  /** Timestamp of last update */
  updated_at?: string;
}

/**
 * User Rank Information
 * Complete rank progression tracking from gamification system
 * Synchronized with backend UserRank entity (20 fields)
 *
 * Backend source: /src/modules/gamification/entities/user-rank.entity.ts
 * Database table: gamification_system.user_ranks
 */
export interface UserRank {
  /** Rank record ID (UUID) */
  id: string;

  /** User ID (FK → auth.users) */
  user_id: string;

  /** Tenant ID (FK → auth_management.tenants) */
  tenant_id?: string;

  // =====================================================
  // RANK INFORMATION
  // =====================================================

  /** Current Maya rank (Ajaw, Nacom, Ah K'in, Halach Uinic, K'uk'ulkan) */
  current_rank: MayaRank | string;

  /** Previous Maya rank */
  previous_rank?: MayaRank | string;

  // =====================================================
  // PROGRESS & METRICS
  // =====================================================

  /** Progress towards next rank (0-100%) */
  rank_progress_percentage: number;

  /** Modules required to reach next rank */
  modules_required_for_next?: number;

  /** Modules completed for current rank */
  modules_completed_for_rank: number;

  /** XP required to reach next rank */
  xp_required_for_next?: number;

  /** XP earned for current rank */
  xp_earned_for_rank: number;

  /** ML Coins bonus awarded upon achieving this rank */
  ml_coins_bonus: number;

  // =====================================================
  // CERTIFICATES & BADGES
  // =====================================================

  /** Certificate URL obtained when achieving this rank */
  certificate_url?: string;

  /** Badge/insignia URL for this rank */
  badge_url?: string;

  // =====================================================
  // ACHIEVEMENT DATES
  // =====================================================

  /** When current rank was achieved */
  achieved_at?: string;

  /** When previous rank was achieved */
  previous_rank_achieved_at?: string;

  // =====================================================
  // STATUS CONTROL
  // =====================================================

  /** Whether this is the user's current active rank */
  is_current: boolean;

  /** Additional rank metadata (flexible JSONB) */
  rank_metadata: Record<string, any>;

  // =====================================================
  // AUDIT
  // =====================================================

  /** Timestamp of record creation */
  created_at?: string;

  /** Timestamp of last update */
  updated_at?: string;

  // =====================================================
  // COMPUTED FIELDS (optional, calculated client-side or server-side)
  // =====================================================

  /** Current level (may be computed from user_stats) */
  level?: number;

  /** Next rank name (computed) */
  next_rank?: MayaRank | string | null;

  /** Levels needed to reach next rank (computed) */
  levels_to_next_rank?: number;
}

/**
 * ML Coins Balance
 * Detailed ML Coins information
 */
export interface MLCoinsBalance {
  user_id: string;
  ml_coins: number;
  ml_coins_earned_total: number;
  ml_coins_spent_total: number;
}

/**
 * Stats Update DTO
 * Fields that can be updated via PATCH
 * Synchronized with UserStats interface (all fields optional for partial updates)
 */
export interface UpdateUserStatsDto {
  // Core identifiers
  tenant_id?: string;

  // Level & XP
  total_xp?: number;
  level?: number;

  // Rank system
  current_rank?: MayaRank | string;
  rank_progress?: number;

  // ML Coins
  ml_coins?: number;
  ml_coins_earned_total?: number;
  ml_coins_spent_total?: number;
  ml_coins_earned_today?: number;
  last_ml_coins_reset?: string;

  // Streak system
  current_streak?: number;
  max_streak?: number;
  streak_started_at?: string;
  days_active_total?: number;

  // Progress metrics
  exercises_completed?: number;
  modules_completed?: number;
  total_score?: number;
  average_score?: number;
  perfect_scores?: number;

  // Achievements
  achievements_earned?: number;
  certificates_earned?: number;

  // Time tracking
  total_time_spent?: string;
  weekly_time_spent?: string;
  sessions_count?: number;

  // Periodic activity
  weekly_xp?: number;
  monthly_xp?: number;
  weekly_exercises?: number;

  // Ranking positions
  global_rank_position?: number;
  class_rank_position?: number;
  school_rank_position?: number;

  // Activity timestamps
  last_activity_at?: string;
  last_login_at?: string;

  // Metadata
  metadata?: Record<string, any>;
}
