/**
 * Progress Types
 * Type definitions for Progress Module API responses
 */

/**
 * Progress Status Enum
 */
export enum ProgressStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  MASTERED = 'mastered'
}

/**
 * Module Progress
 * Tracks user's progress in a specific module with complete metrics
 *
 * @see Database: progress_tracking.module_progress
 * @see Backend: modules/progress/entities/module-progress.entity.ts
 *
 * UPDATED: Added 25+ fields from Backend/Database for full feature parity
 * - Gamification rewards (XP, ML Coins)
 * - Advanced metrics (scores, attempts, hints)
 * - Classroom context (assignments, deadlines)
 * - Learning analytics (adaptive path, performance)
 * - Power-ups tracking (comodines)
 */
export interface ModuleProgress {
  // =====================================================
  // CORE IDENTIFIERS
  // =====================================================

  id: string;
  user_id: string;
  module_id: string;

  // =====================================================
  // PROGRESS TRACKING
  // =====================================================

  status: ProgressStatus;
  progress_percentage: number;

  // =====================================================
  // EXERCISE METRICS
  // =====================================================

  /**
   * Number of exercises completed
   */
  completed_exercises: number;

  /**
   * Total number of exercises in module
   */
  total_exercises: number;

  /**
   * Number of exercises skipped
   */
  skipped_exercises: number;

  // =====================================================
  // SCORE METRICS
  // =====================================================

  /**
   * Total score obtained across all exercises
   */
  total_score: number;

  /**
   * Maximum possible score in the module
   */
  max_possible_score?: number;

  /**
   * Average score across exercises (0-100)
   */
  average_score?: number;

  /**
   * Best score obtained in any exercise
   */
  best_score?: number;

  // =====================================================
  // GAMIFICATION REWARDS
  // =====================================================

  /**
   * Total XP earned in this module
   */
  total_xp_earned: number;

  /**
   * Total ML Coins earned in this module
   */
  total_ml_coins_earned: number;

  // =====================================================
  // TIME TRACKING
  // =====================================================

  /**
   * Total time spent in the module (PostgreSQL interval format or seconds)
   */
  time_spent: string | number;

  /**
   * Deprecated: Use time_spent instead
   * @deprecated
   */
  time_spent_seconds?: number;

  /**
   * Number of learning sessions
   */
  sessions_count: number;

  /**
   * Total number of exercise attempts
   */
  attempts_count: number;

  // =====================================================
  // POWER-UPS (COMODINES)
  // =====================================================

  /**
   * Total hints used in this module
   */
  hints_used_total: number;

  /**
   * Total power-ups (comodines) used
   */
  comodines_used_total: number;

  /**
   * Total cost in ML Coins of power-ups used
   */
  comodines_cost_total: number;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  /**
   * When the module was started
   */
  started_at?: string;

  /**
   * When the module was completed
   */
  completed_at?: string | null;

  /**
   * Last time the module was accessed
   */
  last_accessed_at?: string;

  /**
   * Deadline for completion (for assignments)
   */
  deadline?: string;

  /**
   * Record creation timestamp
   */
  created_at: string;

  /**
   * Record last update timestamp
   */
  updated_at: string;

  // =====================================================
  // CLASSROOM CONTEXT
  // =====================================================

  /**
   * Classroom ID (FK → social_features.classrooms)
   * Nullable - only set when module is done in classroom context
   */
  classroom_id?: string;

  /**
   * Assignment ID (FK → assignments table)
   * Nullable - only set when module is assigned by teacher
   */
  assignment_id?: string;

  // =====================================================
  // MODULE CONFIGURATION
  // =====================================================

  /**
   * Whether retrying exercises is allowed
   */
  allow_retry: boolean;

  /**
   * Whether exercises must be completed sequentially
   */
  sequential_completion: boolean;

  /**
   * Whether adaptive difficulty is enabled
   */
  adaptive_difficulty: boolean;

  // =====================================================
  // LEARNING ANALYTICS
  // =====================================================

  /**
   * Personalized learning path (JSONB array)
   * Adaptive system generates custom exercise sequence
   */
  learning_path: any[];

  /**
   * Performance analytics (JSONB)
   * Detailed metrics about user's performance patterns
   */
  performance_analytics: Record<string, any>;

  /**
   * System observations (JSONB)
   * AI/ML system observations about learning patterns
   */
  system_observations: Record<string, any>;

  // =====================================================
  // NOTES & FEEDBACK
  // =====================================================

  /**
   * Notes written by the student
   */
  student_notes?: string;

  /**
   * Notes written by the teacher
   */
  teacher_notes?: string;

  // =====================================================
  // METADATA
  // =====================================================

  /**
   * Additional metadata (JSONB)
   */
  metadata: Record<string, any>;
}

/**
 * Progress Summary
 * Overall progress summary for a user
 */
export interface ProgressSummary {
  user_id: string;
  total_modules: number;
  modules_not_started: number;
  modules_in_progress: number;
  modules_completed: number;
  modules_mastered: number;
  total_exercises_completed: number;
  total_time_spent_seconds: number;
  average_score: number;
  overall_progress_percentage: number;
}

/**
 * Learning Session
 * Represents a learning session
 */
export interface LearningSession {
  id: string;
  user_id: string;
  module_id: string;
  exercise_id: string | null;
  session_start: string;
  session_end: string | null;
  duration_seconds: number;
  activities_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Session Stats
 * Statistics for learning sessions over a period
 */
export interface SessionStats {
  user_id: string;
  period: 'daily' | 'weekly' | 'monthly';
  total_sessions: number;
  total_duration_seconds: number;
  average_session_duration_seconds: number;
  sessions_by_date: Array<{
    date: string;
    session_count: number;
    total_duration_seconds: number;
  }>;
}

/**
 * Exercise Attempt
 * Represents an attempt at an exercise
 */
export interface ExerciseAttempt {
  id: string;
  user_id: string;
  exercise_id: string;
  session_id: string | null;
  attempt_number: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  score: number;
  max_score: number;
  time_spent_seconds: number;
  started_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Exercise Submission
 * User's submission for an exercise
 */
export interface ExerciseSubmission {
  id: string;
  attempt_id: string;
  user_id: string;
  exercise_id: string;
  submission_data: Record<string, any>;
  score: number;
  max_score: number;
  is_correct: boolean;
  feedback: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Submission Stats
 * Statistics for exercise submissions
 */
export interface SubmissionStats {
  user_id: string;
  total_submissions: number;
  correct_submissions: number;
  incorrect_submissions: number;
  average_score: number;
  accuracy_percentage: number;
  submissions_by_exercise: Array<{
    exercise_id: string;
    attempt_count: number;
    best_score: number;
    average_score: number;
    is_completed: boolean;
  }>;
}
