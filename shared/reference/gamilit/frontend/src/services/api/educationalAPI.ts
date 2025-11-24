/**
 * Educational API Integration
 *
 * API client for educational content including modules, exercises,
 * progress tracking, and analytics.
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from './apiConfig';
import { handleAPIError } from './apiErrorHandler';
import type { ApiResponse } from './apiTypes';
import type { Module, Exercise } from '@shared/types';
import { DifficultyLevel, ExerciseType } from '@shared/types/educational.types';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * User progress for a module
 */
export interface ModuleProgress {
  moduleId: string;
  progress: number;
  completedExercises: number;
  totalExercises: number;
  lastActivityAt?: Date;
}

/**
 * User progress for an exercise
 */
export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  attempts: number;
  bestScore: number;
  lastAttemptAt?: Date;
  timeSpent?: number;
}

/**
 * Exercise submission request
 */
export interface ExerciseSubmission {
  exerciseId: string;
  answers: unknown;
  startedAt: number; // Unix timestamp when exercise started
  hintsUsed?: number;
  powerupsUsed?: string[];
}

/**
 * Exercise submission response
 */
export interface ExerciseSubmissionResult {
  attemptId: string;
  score: number;
  isPerfect: boolean;
  correctAnswers: number;
  totalQuestions: number;
  rewards: {
    mlCoins: number;
    xp: number;
    bonuses?: Array<{
      type: string;
      amount: number;
      reason: string;
    }>;
  };
  feedback: {
    overall: string;
    answerReview: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: any;
      correctAnswer?: any;
      explanation?: string;
    }>;
  };
  achievements?: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
  rankUp?: {
    oldRank: string;
    newRank: string;
    unlockedFeatures: string[];
  } | null;
  createdAt: string;
  explanations?: Record<string, string>;
}

/**
 * User dashboard data
 */
export interface UserDashboardData {
  totalModules: number;
  completedModules: number;
  totalExercises: number;
  completedExercises: number;
  averageScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
}

/**
 * User analytics data
 */
export interface UserAnalytics {
  timeframe: string;
  exercisesCompleted: number;
  averageScore: number;
  totalTimeSpent: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  recommendations: string[];
}

/**
 * User activity data
 */
export interface UserActivity {
  id: string;
  type: 'exercise_completed' | 'achievement_unlocked' | 'streak_milestone' | 'level_up' | 'module_completed';
  title: string;
  description: string;
  timestamp: Date;
  metadata: {
    xp?: number;
    ml?: number;
    exerciseName?: string;
    moduleName?: string;
    achievementName?: string;
    streakDays?: number;
    score?: number;
  };
  category: string;
}

/**
 * Activity statistics
 */
export interface ActivityStats {
  totalActivities: number;
  exercisesCompleted: number;
  achievementsUnlocked: number;
  modulesCompleted: number;
  lastActivityAt: Date | null;
}

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

const mockModules: Module[] = [
  {
    id: '1',
    title: 'Los Primeros Pasos de Marie Curie',
    description: 'Descubre los inicios de la carrera científica de Marie Curie',
    order_index: 1,
    progress: 75,
    exercises_count: 20,
    completed_exercises: 15,
  },
  {
    id: '2',
    title: 'Descubrimientos Científicos',
    description: 'Explora los grandes descubrimientos de Marie Curie',
    order_index: 2,
    progress: 45,
    exercises_count: 18,
    completed_exercises: 8,
  },
  {
    id: '3',
    title: 'El Nobel de Química',
    description: 'Conoce el camino hacia el Premio Nobel',
    order_index: 3,
    progress: 20,
    exercises_count: 25,
    completed_exercises: 5,
  },
  {
    id: '4',
    title: 'Legado y Contribuciones',
    description: 'El impacto de Marie Curie en la ciencia moderna',
    order_index: 4,
    progress: 0,
    exercises_count: 15,
    completed_exercises: 0,
  },
];

const mockExercises: Partial<Exercise>[] = [
  {
    id: '1',
    module_id: '1',
    title: 'Crucigrama: Primeros Años',
    type: ExerciseType.CRUCIGRAMA, // Fixed: was 'crucigrama_cientifico'
    difficulty: DifficultyLevel.BEGINNER, // A1 - Easy
    points: 100,
    completed: true,
    description: 'Resuelve el crucigrama sobre los primeros años de Marie Curie',
    estimatedTime: 15,
  },
  {
    id: '2',
    module_id: '1',
    title: 'Línea de Tiempo: Juventud',
    type: ExerciseType.LINEA_TIEMPO, // Fixed: now uses enum
    difficulty: DifficultyLevel.INTERMEDIATE, // B2 - Medium
    points: 150,
    completed: true,
    description: 'Ordena los eventos de la juventud de Marie Curie',
    estimatedTime: 20,
  },
  {
    id: '3',
    module_id: '1',
    title: 'Sopa de Letras: Conceptos Científicos',
    type: ExerciseType.SOPA_LETRAS, // Fixed: now uses enum
    difficulty: DifficultyLevel.BEGINNER, // A1 - Easy
    points: 100,
    completed: false,
    description: 'Encuentra términos científicos importantes',
    estimatedTime: 10,
  },
];

// ============================================================================
// RESPONSE TRANSFORMERS
// ============================================================================

/**
 * Transform backend exercise response to frontend Exercise format
 * Handles field name mismatches between snake_case (backend) and camelCase/different names (frontend)
 */
function transformExercise(backendExercise: any): Exercise {
  return {
    ...backendExercise,
    // Map backend field names to frontend field names
    type: backendExercise.exercise_type || backendExercise.type,
    difficulty: backendExercise.difficulty_level || backendExercise.difficulty,
    estimatedTime: backendExercise.estimated_time_minutes || backendExercise.estimatedTime,
    timeLimit: backendExercise.time_limit_minutes || backendExercise.timeLimit,
    max_score: backendExercise.max_points || backendExercise.max_score,
    points: backendExercise.max_points || backendExercise.points || backendExercise.max_score,
  } as Exercise;
}

/**
 * Transform array of backend exercises to frontend format
 */
function transformExercises(backendExercises: any[]): Exercise[] {
  return backendExercises.map(transformExercise);
}

// ============================================================================
// MODULES API FUNCTIONS
// ============================================================================

/**
 * Get all modules
 *
 * @returns List of all modules
 */
export const getModules = async (): Promise<Module[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockModules;
    }

    // Backend returns modules array directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<Module[]>(
      API_ENDPOINTS.educational.modules
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get single module by ID
 *
 * @param moduleId - Module ID
 * @returns Module data
 */
export const getModule = async (moduleId: string): Promise<Module> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const module = mockModules.find((m) => m.id === moduleId);
      if (!module) throw new Error('Module not found');
      return module;
    }

    // Backend returns module directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<Module>(
      API_ENDPOINTS.educational.module(moduleId)
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Check if user has access to module
 *
 * @param moduleId - Module ID
 * @returns Access status
 */
export const checkModuleAccess = async (moduleId: string): Promise<boolean> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return true;
    }

    // Backend returns data directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<{ hasAccess: boolean }>(
      API_ENDPOINTS.educational.moduleAccess(moduleId)
    );

    return data.hasAccess;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get modules for a specific user with their progress
 *
 * @param userId - User ID
 * @returns List of modules with user-specific progress data
 */
export const getUserModules = async (userId: string): Promise<Module[]> => {
  try {
    console.log('📡 [educationalAPI] getUserModules called', {
      userId,
      useMockData: FEATURE_FLAGS.USE_MOCK_DATA,
      endpoint: API_ENDPOINTS.educational.userModules(userId),
    });

    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      console.log('⚠️ [educationalAPI] Using MOCK DATA');
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockModules;
    }

    console.log('📡 [educationalAPI] Making HTTP GET request to backend...');
    const { data } = await apiClient.get<Module[]>(
      API_ENDPOINTS.educational.userModules(userId)
    );

    console.log('✅ [educationalAPI] Backend response received:', {
      isArray: Array.isArray(data),
      modulesCount: Array.isArray(data) ? data.length : 0,
      firstModule: Array.isArray(data) && data.length > 0 ? data[0] : null,
      responseStatus: 'success',
    });

    // Backend returns array directly, not wrapped in { data: {...} }
    return data;
  } catch (error) {
    console.error('❌ [educationalAPI] Error fetching user modules:', error);
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXERCISES API FUNCTIONS
// ============================================================================

/**
 * Get all exercises
 *
 * @param filters - Optional filters
 * @returns List of exercises
 */
export const getExercises = async (filters?: {
  moduleId?: string;
  type?: string;
  difficulty?: string;
}): Promise<Exercise[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      let exercises = [...mockExercises];

      if (filters?.moduleId) {
        exercises = exercises.filter((e) => e.module_id === filters.moduleId);
      }

      return exercises as Exercise[];
    }

    // Backend returns exercises array directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<any[]>(
      API_ENDPOINTS.educational.exercises,
      { params: filters }
    );

    // Transform backend response to frontend format
    return transformExercises(data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get exercises for a specific module
 *
 * @param moduleId - Module ID
 * @returns List of exercises in the module
 */
export const getModuleExercises = async (moduleId: string): Promise<Exercise[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockExercises.filter((e) => e.module_id === moduleId) as Exercise[];
    }

    // Backend returns exercises array directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<any[]>(
      API_ENDPOINTS.educational.moduleExercises(moduleId)
    );

    // Transform backend response to frontend format
    return transformExercises(data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get single exercise by ID
 *
 * @param exerciseId - Exercise ID
 * @returns Exercise data
 */
export const getExercise = async (exerciseId: string): Promise<Exercise> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const exercise = mockExercises.find((e) => e.id === exerciseId);
      if (!exercise) throw new Error('Exercise not found');
      return exercise as Exercise;
    }

    // Backend returns exercise directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<any>(
      API_ENDPOINTS.educational.exercise(exerciseId)
    );

    // Transform backend response to frontend format
    return transformExercise(data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Submit exercise answers
 *
 * @param exerciseId - Exercise ID
 * @param submission - Exercise submission data
 * @returns Submission result
 */
export const submitExercise = async (
  exerciseId: string,
  submission: Omit<ExerciseSubmission, 'exerciseId'>
): Promise<ExerciseSubmissionResult> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const score = Math.floor(Math.random() * 30) + 70;
      const isPerfect = score === 100;

      return {
        attemptId: `attempt_${Date.now()}`,
        score,
        isPerfect,
        correctAnswers: 8,
        totalQuestions: 10,
        rewards: {
          xp: isPerfect ? 150 : 100,
          mlCoins: isPerfect ? 30 : 20,
          bonuses: isPerfect ? [
            { type: 'perfect_score', amount: 50, reason: 'Perfect Score Bonus' }
          ] : undefined,
        },
        feedback: {
          overall: isPerfect ? '¡Excelente trabajo! Respuesta perfecta.' : 'Buen intento, sigue practicando.',
          answerReview: [
            { questionId: '1', isCorrect: true, userAnswer: 'respuesta1' },
            { questionId: '2', isCorrect: true, userAnswer: 'respuesta2' },
            { questionId: '3', isCorrect: true, userAnswer: 'respuesta3' },
            { questionId: '4', isCorrect: true, userAnswer: 'respuesta4' },
            { questionId: '5', isCorrect: true, userAnswer: 'respuesta5' },
            { questionId: '6', isCorrect: true, userAnswer: 'respuesta6' },
            { questionId: '7', isCorrect: true, userAnswer: 'respuesta7' },
            { questionId: '8', isCorrect: true, userAnswer: 'respuesta8' },
            { questionId: '9', isCorrect: false, userAnswer: 'respuesta9', correctAnswer: 'correcta9', explanation: 'Revisa el concepto de fotosíntesis' },
            { questionId: '10', isCorrect: false, userAnswer: 'respuesta10', correctAnswer: 'correcta10', explanation: 'La respuesta se encuentra en el segundo párrafo' },
          ],
        },
        achievements: isPerfect ? [
          { id: 'perfect-score', name: 'Perfect Score', description: 'Completaste el ejercicio con 100%', icon: 'trophy' }
        ] : undefined,
        rankUp: null,
        createdAt: new Date().toISOString(),
        explanations: {
          '9': 'Revisa el concepto de fotosíntesis',
          '10': 'La respuesta se encuentra en el segundo párrafo',
        },
      };
    }

    // Backend returns submission result directly, not wrapped in { data: {...} }
    const { data } = await apiClient.post<ExerciseSubmissionResult>(
      `${API_ENDPOINTS.educational.exercise(exerciseId)}/submit`,
      submission
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Save exercise progress
 *
 * @param exerciseId - Exercise ID
 * @param progressData - Progress data to save
 * @returns Success status
 */
export const saveExerciseProgress = async (
  exerciseId: string,
  progressData: {
    currentStep?: number;
    totalSteps?: number;
    score?: number;
    hintsUsed?: number;
    timeSpent?: number;
    answers?: unknown;
  }
): Promise<{ success: boolean }> => {
  try {
    // Save progress locally (localStorage)
    // Progress is automatically saved to DB when exercise is submitted
    const key = `exercise_progress_${exerciseId}`;
    localStorage.setItem(key, JSON.stringify({
      ...progressData,
      timestamp: new Date().toISOString(),
    }));

    // Return success immediately
    return { success: true };
  } catch (error) {
    console.warn('Failed to save progress locally:', error);
    return { success: false };
  }
};

/**
 * Get exercise hints
 *
 * @param exerciseId - Exercise ID
 * @returns List of hints available for the exercise
 */
export const getExerciseHints = async (
  exerciseId: string
): Promise<Array<{ id: string; text: string; cost: number; order: number }>> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return [
        { id: '1', text: 'Revisa las pistas horizontales primero', cost: 10, order: 1 },
        { id: '2', text: 'Las palabras científicas son clave', cost: 20, order: 2 },
        { id: '3', text: 'Piensa en los descubrimientos de Marie Curie', cost: 30, order: 3 },
      ];
    }

    // ✅ Fixed: Use correct exercises endpoint (not mechanics)
    // Backend returns: { hints: string[], cost_per_hint_ml_coins: number, hints_available: number }
    const { data } = await apiClient.get<{
      hints: string[];
      cost_per_hint_ml_coins: number;
      hints_available: number;
    }>(`/educational/exercises/${exerciseId}/hints`);

    // Transform backend response to frontend format
    return data.hints.map((text, index) => ({
      id: `${index + 1}`,
      text,
      cost: data.cost_per_hint_ml_coins,
      order: index + 1,
    }));
  } catch (error) {
    // If hints endpoint fails, return empty array (silent fail for optional feature)
    console.warn(`Failed to fetch hints for exercise ${exerciseId}:`, error);
    return [];
  }
};

// ============================================================================
// PROGRESS API FUNCTIONS
// ============================================================================

/**
 * Get user's overall progress
 *
 * @param userId - User ID
 * @returns User progress data
 */
export const getUserProgress = async (userId: string): Promise<UserDashboardData> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        totalModules: 5,
        completedModules: 2,
        totalExercises: 63,
        completedExercises: 28,
        averageScore: 87.5,
        totalTimeSpent: 12450,
        currentStreak: 7,
        longestStreak: 14,
      };
    }

    // Backend returns user progress data directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<UserDashboardData>(
      API_ENDPOINTS.educational.userProgress(userId)
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's progress for a specific module
 *
 * @param userId - User ID
 * @param moduleId - Module ID
 * @returns Module progress data
 */
export const getModuleProgress = async (
  userId: string,
  moduleId: string
): Promise<ModuleProgress> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        moduleId,
        progress: 75,
        completedExercises: 15,
        totalExercises: 20,
        lastActivityAt: new Date(),
      };
    }

    // Backend returns module progress directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<ModuleProgress>(
      API_ENDPOINTS.educational.moduleProgress(userId, moduleId)
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's dashboard data
 *
 * @param userId - User ID
 * @returns Dashboard data with stats and recent activity
 */
export const getUserDashboard = async (userId: string): Promise<UserDashboardData> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        totalModules: 5,
        completedModules: 2,
        totalExercises: 63,
        completedExercises: 28,
        averageScore: 87.5,
        totalTimeSpent: 12450,
        currentStreak: 7,
        longestStreak: 14,
      };
    }

    // Backend returns dashboard data directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<UserDashboardData>(
      API_ENDPOINTS.educational.userDashboard(userId)
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's exercise attempts
 *
 * @param userId - User ID
 * @param exerciseId - Optional exercise ID filter
 * @returns List of exercise progress
 */
export const getExerciseAttempts = async (
  userId: string,
  exerciseId?: string
): Promise<ExerciseProgress[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          exerciseId: '1',
          completed: true,
          attempts: 2,
          bestScore: 95,
          lastAttemptAt: new Date(),
          timeSpent: 900,
        },
      ];
    }

    // Backend returns exercise attempts array directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<ExerciseProgress[]>(
      API_ENDPOINTS.educational.exerciseAttempts(userId),
      { params: { exerciseId } }
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// ANALYTICS API FUNCTIONS
// ============================================================================

/**
 * Get user analytics
 *
 * @param userId - User ID
 * @param timeframe - Timeframe for analytics (day, week, month, all)
 * @returns User analytics data
 */
export const getUserAnalytics = async (
  userId: string,
  timeframe: string = 'month'
): Promise<UserAnalytics> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        timeframe,
        exercisesCompleted: 28,
        averageScore: 87.5,
        totalTimeSpent: 12450,
        strengthAreas: ['Comprensión Literal', 'Análisis de Textos'],
        weaknessAreas: ['Comprensión Crítica'],
        recommendations: [
          'Practica más ejercicios de comprensión crítica',
          'Intenta completar ejercicios más difíciles',
        ],
      };
    }

    // Backend returns analytics data directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<UserAnalytics>(
      API_ENDPOINTS.educational.userAnalytics(userId),
      { params: { timeframe } }
    );

    return data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// ACTIVITIES API FUNCTIONS
// ============================================================================

/**
 * Get recent activities for a user
 *
 * @param userId - User ID
 * @param limit - Maximum number of activities to return
 * @returns List of recent activities
 */
export const getUserActivities = async (userId: string, limit: number = 10): Promise<UserActivity[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Return empty array for mock - real data will come from backend
      return [];
    }

    const { data } = await apiClient.get<any[]>(
      API_ENDPOINTS.educational.userActivities(userId),
      { params: { limit } }
    );

    // Backend returns array directly, not wrapped in { data: {...} }
    // Transform backend format to frontend format
    return data.map((activity: any) => ({
      id: activity.id,
      type: mapActivityAction(activity.action),
      title: activity.entity_name || activity.description,
      description: activity.description,
      timestamp: new Date(activity.created_at),
      metadata: activity.metadata || {},
      category: activity.entity_type || 'general',
    }));
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Map backend action to frontend activity type
 */
function mapActivityAction(action: string): UserActivity['type'] {
  const actionMap: Record<string, UserActivity['type']> = {
    'completed_exercise': 'exercise_completed',
    'completed_module': 'module_completed',
    'unlocked_achievement': 'achievement_unlocked',
    'reached_streak': 'streak_milestone',
    'leveled_up': 'level_up',
  };
  return actionMap[action] || 'exercise_completed';
}

/**
 * Get activity statistics for a user
 *
 * @param userId - User ID
 * @returns Activity statistics
 */
export const getActivityStats = async (userId: string): Promise<ActivityStats> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        totalActivities: 0,
        exercisesCompleted: 0,
        achievementsUnlocked: 0,
        modulesCompleted: 0,
        lastActivityAt: null,
      };
    }

    const { data } = await apiClient.get<ApiResponse<ActivityStats>>(
      API_ENDPOINTS.educational.activityStats(userId)
    );

    return {
      ...data.data,
      lastActivityAt: data.data.lastActivityAt ? new Date(data.data.lastActivityAt) : null,
    };
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get activities filtered by type
 *
 * @param userId - User ID
 * @param type - Activity type filter
 * @param limit - Maximum number of activities
 * @returns Filtered activities
 */
export const getUserActivitiesByType = async (
  userId: string,
  type: 'exercise_completed' | 'achievement_unlocked' | 'module_completed',
  limit: number = 10
): Promise<UserActivity[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return [];
    }

    // Backend returns activities array directly, not wrapped in { data: {...} }
    const { data } = await apiClient.get<UserActivity[]>(
      API_ENDPOINTS.educational.activitiesByType(userId, type),
      { params: { limit } }
    );

    return data.map(activity => ({
      ...activity,
      timestamp: new Date(activity.timestamp),
    }));
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Modules
  getModules,
  getModule,
  checkModuleAccess,
  getUserModules,

  // Exercises
  getExercises,
  getModuleExercises,
  getExercise,
  submitExercise,
  saveExerciseProgress,
  getExerciseHints,

  // Progress
  getUserProgress,
  getModuleProgress,
  getUserDashboard,
  getExerciseAttempts,

  // Analytics
  getUserAnalytics,

  // Activities
  getUserActivities,
  getActivityStats,
  getUserActivitiesByType,
};
