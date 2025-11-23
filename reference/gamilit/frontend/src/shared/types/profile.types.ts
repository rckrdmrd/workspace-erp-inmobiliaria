/**
 * Profile Types
 *
 * Type definitions for user profiles with complete information including
 * gamification stats, academic context, and user preferences.
 *
 * @see Database: auth_management.profiles
 * @see Backend: Backend does not have Profile entity (uses auth User)
 */

import { GamilityRoleEnum, UserStatusEnum } from '../constants/enums.constants';

/**
 * User Preferences
 * Configurable user settings and preferences
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'detective';
  language: 'es' | 'en';
  timezone: string;
  sound_enabled: boolean;
  notifications_enabled: boolean;
  email_notifications?: boolean;
  push_notifications?: boolean;
  sms_notifications?: boolean;
}

/**
 * Profile Interface
 * Complete user profile with personal information, academic context,
 * and system configuration
 *
 * Note: This represents auth_management.profiles table which has ~25 fields
 * Frontend was missing this type - now synced with Database
 */
export interface Profile {
  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  /**
   * Profile ID (UUID)
   */
  id: string;

  /**
   * Tenant ID for multi-tenancy support
   */
  tenant_id: string;

  /**
   * User ID (FK → auth.users)
   * Links to authentication user record
   */
  user_id?: string;

  // =====================================================
  // PERSONAL INFORMATION
  // =====================================================

  /**
   * Display name shown in UI
   */
  display_name?: string;

  /**
   * Full name of the user
   */
  full_name?: string;

  /**
   * First name
   */
  first_name?: string;

  /**
   * Last name(s)
   */
  last_name?: string;

  /**
   * Email address (unique)
   */
  email: string;

  /**
   * Avatar/profile picture URL
   */
  avatar_url?: string;

  /**
   * Biography or user description (max 500 chars)
   */
  bio?: string;

  /**
   * Phone number
   */
  phone?: string;

  /**
   * Date of birth
   */
  date_of_birth?: string; // ISO date string

  // =====================================================
  // ACADEMIC CONTEXT
  // =====================================================

  /**
   * School grade level (e.g., "6", "7", "8")
   */
  grade_level?: string;

  /**
   * Student ID number
   */
  student_id?: string;

  /**
   * School ID (FK → schools table)
   * Links to school the student belongs to
   */
  school_id?: string;

  // =====================================================
  // SYSTEM STATUS & ROLE
  // =====================================================

  /**
   * User role in the system
   * Values: student, admin_teacher, super_admin
   */
  role: GamilityRoleEnum;

  /**
   * Account status
   * Values: active, inactive, suspended, pending
   */
  status: UserStatusEnum;

  /**
   * Email verification status
   */
  email_verified: boolean;

  /**
   * Phone verification status
   */
  phone_verified: boolean;

  // =====================================================
  // PREFERENCES & CONFIGURATION
  // =====================================================

  /**
   * User preferences (theme, language, notifications, etc.)
   * Stored as JSONB in Database
   */
  preferences: UserPreferences;

  // =====================================================
  // ACTIVITY TRACKING
  // =====================================================

  /**
   * Last sign in timestamp
   */
  last_sign_in_at?: string; // ISO date string

  /**
   * Last activity timestamp
   */
  last_activity_at?: string; // ISO date string

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Additional metadata (JSONB)
   * Flexible field for storing extra information
   */
  metadata: Record<string, any>;

  /**
   * Profile creation timestamp
   */
  created_at: string; // ISO date string

  /**
   * Profile last update timestamp
   */
  updated_at: string; // ISO date string
}

/**
 * Profile with Stats
 * Extended profile with gamification statistics
 *
 * This is a composite type combining Profile with UserStats
 * (stats come from gamification_system.user_stats table)
 */
export interface ProfileWithStats extends Profile {
  stats?: {
    // XP & Ranking
    total_xp: number;
    current_rank: string; // MayaRank value
    rank_progress_percentage: number;
    next_rank?: string;
    xp_to_next_rank: number;

    // ML Coins & Gems
    coins_balance: number;
    gems_balance: number;
    lifetime_coins_earned: number;
    lifetime_coins_spent: number;

    // Progress Stats
    modules_completed: number;
    exercises_completed: number;
    achievements_count: number;
    total_study_time_minutes: number;
    streak_days: number;
    longest_streak: number;

    // Performance Stats
    average_score: number;
    highest_score: number;
    accuracy_percentage: number;

    // Social Stats
    friends_count: number;
    teams_count: number;
  };
}

/**
 * Create Profile DTO
 * Data required to create a new user profile
 */
export interface CreateProfileDto {
  tenant_id: string;
  email: string;
  role?: GamilityRoleEnum;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  grade_level?: string;
  school_id?: string;
  preferences?: Partial<UserPreferences>;
}

/**
 * Update Profile DTO
 * Data allowed to be updated in user profile
 */
export interface UpdateProfileDto {
  display_name?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  phone?: string;
  date_of_birth?: string;
  grade_level?: string;
  preferences?: Partial<UserPreferences>;
  metadata?: Record<string, any>;
}
