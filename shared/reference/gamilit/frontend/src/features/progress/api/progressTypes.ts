/**
 * Progress Module Types
 *
 * TypeScript interfaces and types for progress tracking,
 * exercise submissions, and learning analytics.
 *
 * @module progressTypes
 */

// Import shared enums
import { DifficultyLevel } from '@shared/types/educational.types';

// ============================================================================
// ENUMS
// ============================================================================

/**
 * Activity types
 */
export enum ActivityType {
  EXERCISE_COMPLETED = 'exercise_completed',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  RANK_ADVANCED = 'rank_advanced',
  MODULE_COMPLETED = 'module_completed',
}

/**
 * Powerup types (Comodines)
 */
export enum PowerupType {
  PISTAS = 'pistas',
  VISION_LECTORA = 'vision_lectora',
  SEGUNDA_OPORTUNIDAD = 'segunda_oportunidad',
}

/**
 * Difficulty levels - re-export from educational.types
 * Uses full CEFR standard (8 levels: A1-C2+)
 * @see @shared/types/educational.types
 */
// Removed duplicate enum - imported from educational.types instead

/**
 * Maya ranks - Official names
 * @see /docs/01-requerimientos/gamificacion/01-RANGOS-MAYA.md
 */
export enum MayaRank {
  AJAW = 'Ajaw',
  NACOM = 'Nacom',
  AH_KIN = 'Ah K\'in',
  HALACH_UINIC = 'Halach Uinic',
  KUKULKAN = 'K\'uk\'ulkan',
}

// ============================================================================
// SUBMISSION TYPES
// ============================================================================

/**
 * Exercise submission request
 */
export interface SubmitExerciseRequest {
  exerciseId: string;
  userId: string;
  answers: unknown; // Type varies by exercise mechanic
  startedAt: number | Date; // Timestamp when user started the exercise
  hintsUsed?: number;
  powerupsUsed?: PowerupType[];
  sessionId?: string;
}

/**
 * Submission response
 */
export interface SubmitExerciseResponse {
  attemptId: string;
  score: number; // 0-100
  isPerfect: boolean;
  correctAnswersCount: number;
  totalQuestions: number;
  rewards: SubmissionRewards;
  feedback: SubmissionFeedback;
  achievements?: Achievement[];
  rankUp?: RankUpInfo | null;
  correctAnswers?: unknown; // Correct answers revealed after submission
  explanations?: Record<string, string>;
  createdAt: Date;
}

/**
 * Submission rewards
 */
export interface SubmissionRewards {
  mlCoins: number;
  xp: number;
  bonuses: {
    perfectScore?: number;
    noHints?: number;
    speedBonus?: number;
    firstAttempt?: number;
  };
}

/**
 * Submission feedback
 */
export interface SubmissionFeedback {
  overall: string;
  answerReview: AnswerReview[];
}

/**
 * Answer review (per question)
 */
export interface AnswerReview {
  questionId: string;
  isCorrect: boolean;
  userAnswer: string;
  correctAnswer: string;
  explanation?: string;
}

/**
 * Achievement info
 */
export interface Achievement {
  id: string;
  name: string;
  icon: string;
  rarity: string;
}

/**
 * Rank up information
 */
export interface RankUpInfo {
  newRank: string;
  previousRank?: string;
  bonusMLCoins: number;
  newMultiplier: number;
}

// ============================================================================
// PROGRESS TYPES
// ============================================================================

/**
 * User progress overview
 */
export interface UserProgressOverview {
  userId: string;
  overallProgress: OverallProgress;
  moduleProgress: ModuleProgressSummary[];
  recentActivity: Activity[];
  studyStreak: StudyStreak;
}

/**
 * Overall progress summary
 */
export interface OverallProgress {
  totalModules: number;
  completedModules: number;
  totalExercises: number;
  completedExercises: number;
  overallPercentage: number;
}

/**
 * Module progress summary
 */
export interface ModuleProgressSummary {
  moduleId: string;
  moduleName: string;
  totalExercises: number;
  completedExercises: number;
  progressPercentage: number;
  averageScore: number;
  timeSpent: number; // minutes
  lastActivityAt: Date;
}

/**
 * Module progress detail
 */
export interface ModuleProgressDetail {
  userId: string;
  moduleId: string;
  startedAt: Date;
  completedAt?: Date;
  progressPercentage: number;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  totalTimeSpent: number;
  exerciseProgress: ExerciseProgress[];
  strengths: string[];
  weaknesses: string[];
  updatedAt: Date;
}

/**
 * Exercise progress within a module
 */
export interface ExerciseProgress {
  exerciseId: string;
  exerciseTitle: string;
  attempts: number;
  bestScore: number;
  averageScore: number;
  completed: boolean;
  perfectScore: boolean;
  timeSpent: number;
  lastAttemptedAt: Date;
}

/**
 * Study streak information
 */
export interface StudyStreak {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: Date;
}

// ============================================================================
// ACTIVITY TYPES
// ============================================================================

/**
 * Activity record
 */
export interface Activity {
  type: ActivityType;
  description: string;
  timestamp: Date;
  metadata: unknown;
}

/**
 * Activity statistics
 */
export interface ActivityStats {
  totalActivities: number;
  exercisesCompleted: number;
  achievementsUnlocked: number;
  modulesCompleted: number;
  recentActivities: Activity[];
}

// ============================================================================
// ATTEMPT TYPES
// ============================================================================

/**
 * Exercise attempt record
 */
export interface ExerciseAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  hintsUsed: number;
  powerupsUsed: PowerupType[];
  answers: unknown;
  feedback: unknown;
  isPerfect: boolean;
  mlCoinsEarned: number;
  xpEarned: number;
  attemptNumber: number;
  startedAt: Date;
  completedAt: Date;
}

// ============================================================================
// DASHBOARD TYPES
// ============================================================================

/**
 * User dashboard data
 */
export interface UserDashboard {
  currentModule: CurrentModuleInfo | null;
  recentActivities: Activity[];
  upcomingExercises: UpcomingExercise[];
  progressCharts: ProgressCharts;
  stats: DashboardStats;
}

/**
 * Current module information
 */
export interface CurrentModuleInfo {
  moduleId: string;
  moduleName: string;
  progressPercentage: number;
}

/**
 * Upcoming exercise
 */
export interface UpcomingExercise {
  exerciseId: string;
  title: string;
  moduleId: string;
  difficulty: string;
}

/**
 * Progress charts data
 */
export interface ProgressCharts {
  moduleProgress: Array<{ moduleId: string; percentage: number }>;
  scoresTrend: Array<{ date: string; score: number }>;
  timeSpent: Array<{ date: string; minutes: number }>;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  mlCoins: number;
  totalXP: number;
  currentRank: string;
  streakDays: number;
  exercisesCompleted: number;
  averageScore: number;
}

// ============================================================================
// FILTER TYPES
// ============================================================================

/**
 * Exercise attempt filters
 */
export interface ExerciseAttemptFilters {
  exerciseId?: string;
  moduleId?: string;
  startDate?: Date;
  endDate?: Date;
}

/**
 * Activity filters
 */
export interface ActivityFilters {
  type?: ActivityType;
  limit?: number;
  offset?: number;
}