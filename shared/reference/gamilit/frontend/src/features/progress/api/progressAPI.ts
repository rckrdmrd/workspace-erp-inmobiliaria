/**
 * Progress API Integration
 *
 * API client for tracking student progress, exercise submissions,
 * and learning analytics.
 *
 * @module progressAPI
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Exercise submission request payload
 */
export interface SubmitExerciseRequest {
  exerciseId: string;
  userId: string;
  answers: unknown; // Type varies by exercise mechanic
  startedAt: number | Date; // Timestamp when user started the exercise
  hintsUsed?: number;
  powerupsUsed?: ('pistas' | 'vision_lectora' | 'segunda_oportunidad')[];
  sessionId?: string;
}

/**
 * Exercise submission response
 */
export interface SubmitExerciseResponse {
  attemptId: string;
  score: number; // 0-100
  isPerfect: boolean;
  correctAnswersCount: number;
  totalQuestions: number;
  rewards: {
    mlCoins: number;
    xp: number;
    bonuses: {
      perfectScore?: number;
      noHints?: number;
      speedBonus?: number;
      firstAttempt?: number;
    };
  };
  feedback: {
    overall: string;
    answerReview: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
      explanation?: string;
    }>;
  };
  achievements?: Array<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
  }>;
  rankUp?: {
    newRank: string;
    previousRank?: string;
    bonusMLCoins: number;
    newMultiplier: number;
  } | null;
  correctAnswers?: unknown; // Correct answers revealed after submission
  explanations?: Record<string, string>;
  createdAt: Date;
}

/**
 * User overall progress overview
 */
export interface UserProgressOverview {
  userId: string;
  overallProgress: {
    totalModules: number;
    completedModules: number;
    totalExercises: number;
    completedExercises: number;
    overallPercentage: number;
  };
  moduleProgress: ModuleProgressSummary[];
  recentActivity: Activity[];
  studyStreak: {
    currentStreak: number;
    longestStreak: number;
    lastStudyDate: Date;
  };
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
  exerciseProgress: Array<{
    exerciseId: string;
    exerciseTitle: string;
    attempts: number;
    bestScore: number;
    averageScore: number;
    completed: boolean;
    perfectScore: boolean;
    timeSpent: number;
    lastAttemptedAt: Date;
  }>;
  strengths: string[];
  weaknesses: string[];
  updatedAt: Date;
}

/**
 * Activity type
 */
export interface Activity {
  type: 'exercise_completed' | 'achievement_unlocked' | 'rank_advanced' | 'module_completed';
  description: string;
  timestamp: Date;
  metadata: unknown;
}

/**
 * Exercise attempt
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
  powerupsUsed: ('pistas' | 'vision_lectora' | 'segunda_oportunidad')[];
  answers: unknown;
  feedback: unknown;
  isPerfect: boolean;
  mlCoinsEarned: number;
  xpEarned: number;
  attemptNumber: number;
  startedAt: Date;
  completedAt: Date;
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

/**
 * User dashboard data
 */
export interface UserDashboard {
  currentModule: {
    moduleId: string;
    moduleName: string;
    progressPercentage: number;
  } | null;
  recentActivities: Activity[];
  upcomingExercises: Array<{
    exerciseId: string;
    title: string;
    moduleId: string;
    difficulty: string;
  }>;
  progressCharts: {
    moduleProgress: Array<{ moduleId: string; percentage: number }>;
    scoresTrend: Array<{ date: string; score: number }>;
    timeSpent: Array<{ date: string; minutes: number }>;
  };
  stats: {
    mlCoins: number;
    totalXP: number;
    currentRank: string;
    streakDays: number;
    exercisesCompleted: number;
    averageScore: number;
  };
}

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

/**
 * Mock submit exercise
 */
const mockSubmitExercise = async (
  submission: SubmitExerciseRequest
): Promise<SubmitExerciseResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const score = Math.floor(Math.random() * 30) + 70; // 70-100
  const isPerfect = score === 100;
  const correctAnswers = Math.floor((score / 100) * 10);

  return {
    attemptId: `attempt_${Date.now()}`,
    score,
    isPerfect,
    correctAnswersCount: correctAnswers,
    totalQuestions: 10,
    rewards: {
      mlCoins: isPerfect ? 30 : 20,
      xp: isPerfect ? 150 : 100,
      bonuses: {
        perfectScore: isPerfect ? 50 : undefined,
        speedBonus: 25,
        noHints: submission.hintsUsed === 0 ? 15 : undefined,
      },
    },
    feedback: {
      overall: isPerfect
        ? 'Excelente trabajo!'
        : 'Buen intento! Sigue practicando.',
      answerReview: Array.from({ length: 10 }, (_, i) => ({
        questionId: `q${i + 1}`,
        isCorrect: i < correctAnswers,
        userAnswer: `Answer ${i + 1}`,
        correctAnswer: `Correct Answer ${i + 1}`,
        explanation: i >= correctAnswers ? 'Revisa este concepto' : undefined,
      })),
    },
    achievements: isPerfect
      ? [
          {
            id: 'perfect-score-001',
            name: 'Puntuacion Perfecta',
            icon: 'trophy',
            rarity: 'legendary',
          },
        ]
      : undefined,
    rankUp: null,
    createdAt: new Date(),
  };
};

/**
 * Mock get user progress
 */
const mockGetUserProgress = async (userId: string): Promise<UserProgressOverview> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    userId,
    overallProgress: {
      totalModules: 5,
      completedModules: 2,
      totalExercises: 50,
      completedExercises: 25,
      overallPercentage: 50,
    },
    moduleProgress: [
      {
        moduleId: 'module-1',
        moduleName: 'Comprension Literal',
        totalExercises: 10,
        completedExercises: 8,
        progressPercentage: 80,
        averageScore: 85,
        timeSpent: 120,
        lastActivityAt: new Date(),
      },
    ],
    recentActivity: [
      {
        type: 'exercise_completed',
        description: 'Completaste: Detective Textual',
        timestamp: new Date(),
        metadata: {},
      },
    ],
    studyStreak: {
      currentStreak: 5,
      longestStreak: 10,
      lastStudyDate: new Date(),
    },
  };
};

/**
 * Mock get module progress
 */
const mockGetModuleProgress = async (
  userId: string,
  moduleId: string
): Promise<ModuleProgressDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    userId,
    moduleId,
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    progressPercentage: 60,
    totalExercises: 10,
    completedExercises: 6,
    averageScore: 82,
    totalTimeSpent: 180,
    exerciseProgress: [
      {
        exerciseId: 'ex-1',
        exerciseTitle: 'Detective Textual',
        attempts: 2,
        bestScore: 90,
        averageScore: 85,
        completed: true,
        perfectScore: false,
        timeSpent: 30,
        lastAttemptedAt: new Date(),
      },
    ],
    strengths: ['Comprension literal', 'Analisis de contexto'],
    weaknesses: ['Inferencia', 'Vocabulario'],
    updatedAt: new Date(),
  };
};

// ============================================================================
// PROGRESS API FUNCTIONS
// ============================================================================

/**
 * Submit exercise answers
 *
 * @param exerciseId - Exercise ID
 * @param userId - User ID
 * @param answers - User answers in exercise-specific format
 * @returns Submission result with score, feedback, and rewards
 */
export const submitExercise = async (
  exerciseId: string,
  userId: string,
  answers: unknown
): Promise<SubmitExerciseResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockSubmitExercise({ exerciseId, userId, answers, startedAt: Date.now() });
    }

    // Backend endpoint: POST /api/v1/progress/submissions/submit
    // Expected format: { userId, exerciseId, answers }
    const backendPayload = {
      userId,
      exerciseId,
      answers,
    };

    const { data } = await apiClient.post<ApiResponse<SubmitExerciseResponse>>(
      '/v1/progress/submissions/submit',
      backendPayload
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get overall progress for a user
 *
 * @param userId - User ID
 * @returns User progress overview
 */
export const getProgress = async (userId: string): Promise<UserProgressOverview> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetUserProgress(userId);
    }

    const { data } = await apiClient.get<ApiResponse<UserProgressOverview>>(
      API_ENDPOINTS.educational.userProgress(userId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get progress for a specific module
 *
 * @param userId - User ID
 * @param moduleId - Module ID
 * @returns Module progress detail
 */
export const getModuleProgress = async (
  userId: string,
  moduleId: string
): Promise<ModuleProgressDetail> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetModuleProgress(userId, moduleId);
    }

    const { data } = await apiClient.get<ApiResponse<ModuleProgressDetail>>(
      API_ENDPOINTS.educational.moduleProgress(userId, moduleId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user exercise attempts
 *
 * @param userId - User ID
 * @param filters - Optional filters (exerciseId, moduleId)
 * @returns List of exercise attempts
 */
export const getExerciseAttempts = async (
  userId: string,
  filters?: { exerciseId?: string; moduleId?: string }
): Promise<ExerciseAttempt[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          id: 'attempt-1',
          userId,
          exerciseId: 'ex-1',
          exerciseTitle: 'Detective Textual',
          score: 85,
          maxScore: 100,
          percentage: 85,
          timeSpent: 300,
          hintsUsed: 1,
          powerupsUsed: [],
          answers: {},
          feedback: {},
          isPerfect: false,
          mlCoinsEarned: 20,
          xpEarned: 100,
          attemptNumber: 1,
          startedAt: new Date(Date.now() - 1000 * 60 * 10),
          completedAt: new Date(),
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<ExerciseAttempt[]>>(
      API_ENDPOINTS.educational.exerciseAttempts(userId),
      { params: filters }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user activities (recent actions)
 *
 * @param userId - User ID
 * @param limit - Optional limit (default: 10)
 * @returns List of recent activities
 */
export const getUserActivities = async (
  userId: string,
  limit = 10
): Promise<Activity[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [
        {
          type: 'exercise_completed',
          description: 'Completaste: Detective Textual',
          timestamp: new Date(),
          metadata: { exerciseId: 'ex-1' },
        },
        {
          type: 'achievement_unlocked',
          description: 'Desbloqueaste: Primera Victoria',
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          metadata: { achievementId: 'ach-1' },
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<Activity[]>>(
      API_ENDPOINTS.educational.userActivities(userId),
      { params: { limit } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get activity statistics for a user
 *
 * @param userId - User ID
 * @returns Activity statistics
 */
export const getActivityStats = async (userId: string): Promise<ActivityStats> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        totalActivities: 50,
        exercisesCompleted: 25,
        achievementsUnlocked: 10,
        modulesCompleted: 2,
        recentActivities: [],
      };
    }

    const { data } = await apiClient.get<ApiResponse<ActivityStats>>(
      API_ENDPOINTS.educational.activityStats(userId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user activities by type
 *
 * @param userId - User ID
 * @param type - Activity type
 * @param limit - Optional limit (default: 10)
 * @returns List of activities filtered by type
 */
export const getUserActivitiesByType = async (
  userId: string,
  type: 'exercise_completed' | 'achievement_unlocked' | 'module_completed',
  limit = 10
): Promise<Activity[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [];
    }

    const { data } = await apiClient.get<ApiResponse<Activity[]>>(
      API_ENDPOINTS.educational.activitiesByType(userId, type),
      { params: { limit } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user dashboard data (consolidated progress view)
 *
 * @param userId - User ID
 * @returns Dashboard data with progress, activities, and stats
 */
export const getUserDashboard = async (userId: string): Promise<UserDashboard> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        currentModule: {
          moduleId: 'module-1',
          moduleName: 'Comprension Literal',
          progressPercentage: 80,
        },
        recentActivities: [],
        upcomingExercises: [],
        progressCharts: {
          moduleProgress: [],
          scoresTrend: [],
          timeSpent: [],
        },
        stats: {
          mlCoins: 500,
          totalXP: 2500,
          currentRank: 'Nacom',
          streakDays: 5,
          exercisesCompleted: 25,
          averageScore: 85,
        },
      };
    }

    const { data } = await apiClient.get<ApiResponse<UserDashboard>>(
      API_ENDPOINTS.educational.userDashboard(userId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  submitExercise,
  getProgress,
  getModuleProgress,
  getExerciseAttempts,
  getUserActivities,
  getActivityStats,
  getUserActivitiesByType,
  getUserDashboard,
};
