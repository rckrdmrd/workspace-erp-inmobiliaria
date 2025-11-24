/**
 * Progress API Module
 *
 * Centralized exports for progress tracking API
 *
 * @module progress/api
 */

// API functions
export {
  default as progressAPI,
  submitExercise,
  getProgress,
  getModuleProgress,
  getExerciseAttempts,
  getUserActivities,
  getActivityStats,
  getUserActivitiesByType,
  getUserDashboard,
} from './progressAPI';

// Types
export type {
  SubmitExerciseRequest,
  SubmitExerciseResponse,
  SubmissionRewards,
  SubmissionFeedback,
  AnswerReview,
  Achievement,
  RankUpInfo,
  UserProgressOverview,
  OverallProgress,
  ModuleProgressSummary,
  ModuleProgressDetail,
  ExerciseProgress,
  StudyStreak,
  Activity,
  ActivityStats,
  ExerciseAttempt,
  UserDashboard,
  CurrentModuleInfo,
  UpcomingExercise,
  ProgressCharts,
  DashboardStats,
  ExerciseAttemptFilters,
  ActivityFilters,
} from './progressTypes';

// Enums
export { ActivityType, PowerupType, DifficultyLevel, MayaRank } from './progressTypes';
