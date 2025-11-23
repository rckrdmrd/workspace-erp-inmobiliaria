/**
 * Content API Integration
 *
 * API client for educational content including modules, lessons, and exercises.
 * Connects frontend with backend educational endpoints.
 *
 * Backend Routes:
 * - GET /api/educational/modules
 * - GET /api/educational/modules/:moduleId
 * - GET /api/educational/modules/:moduleId/exercises
 * - GET /api/educational/modules/:moduleId/access
 * - GET /api/educational/modules/user/:userId
 * - GET /api/educational/exercises
 * - GET /api/educational/exercises/:exerciseId
 *
 * Note: No separate "lessons" endpoints exist in backend.
 * Backend uses modules and exercises directly.
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Exercise difficulty levels
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Exercise types (27 mechanics)
 */
export type ExerciseType =
  // Module 1 - Comprensión Literal
  | 'crucigrama'
  | 'linea_tiempo'
  | 'sopa_letras'
  | 'mapa_conceptual'
  | 'emparejamiento'
  // Module 2 - Comprensión Inferencial
  | 'detective_textual'
  | 'construccion_hipotesis'
  | 'prediccion_narrativa'
  | 'puzzle_contexto'
  | 'rueda_inferencias'
  // Module 3 - Comprensión Crítica
  | 'tribunal_opiniones'
  | 'debate_digital'
  | 'analisis_fuentes'
  | 'podcast_argumentativo'
  | 'matriz_perspectivas'
  // Module 4 - Lectura Digital
  | 'verificador_fake_news'
  | 'infografia_interactiva'
  | 'quiz_tiktok'
  | 'navegacion_hipertextual'
  | 'analisis_memes'
  // Module 5 - Producción Lectora
  | 'diario_multimedia'
  | 'comic_digital'
  | 'video_carta'
  // Auxiliares
  | 'comprension_auditiva'
  | 'collage_prensa'
  | 'texto_movimiento'
  | 'call_to_action'
  | 'verdadero_falso'
  | 'completar_espacios'
  | 'diario_interactivo'
  | 'resumen_visual';

/**
 * Maya rank enum - Official names
 * @see /docs/01-requerimientos/gamificacion/01-RANGOS-MAYA.md
 */
export type RangoMaya = 'Ajaw' | 'Nacom' | 'Ah K\'in' | 'Halach Uinic' | 'K\'uk\'ulkan';

/**
 * Module summary response
 */
export interface ModuleResponse {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  orderIndex: number;
  difficulty: DifficultyLevel;
  estimatedDurationMinutes: number;
  totalExercises: number;
  thumbnailUrl?: string;
  rangoMayaRequired?: RangoMaya;
  rangoMayaGranted?: RangoMaya;
  xpReward: number;
  mlCoinsReward: number;
  isPublished: boolean;
  learningObjectives?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Module detail response (with exercises)
 */
export interface ModuleDetailResponse extends ModuleResponse {
  longDescription?: string;
  objectives?: string[];
  prerequisites?: string[];
  exercises: ExerciseSummary[];
  completedExercises: number;
  progressPercentage: number;
}

/**
 * Exercise summary
 */
export interface ExerciseSummary {
  id: string;
  title: string;
  exerciseType: ExerciseType;
  orderIndex: number;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  pointsReward: number;
  isUnlocked: boolean;
}

/**
 * Exercise detail response
 */
export interface ExerciseResponse {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  instructions: string;
  exerciseType: ExerciseType;
  difficulty: DifficultyLevel;
  estimatedTimeMinutes: number;
  pointsReward: number;
  passingScore: number;
  mlCoinsReward: number;
  xpReward: number;
  content: ExerciseContent;
  hints?: string[];
  availablePowerups: string[];
  userProgress?: {
    attempts: number;
    bestScore: number;
    completed: boolean;
    lastAttemptedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Exercise content (structure varies by type)
 */
export interface ExerciseContent {
  question?: string;
  options?: any[];
  correctAnswers?: any[];
  explanations?: Record<string, string>;
  marieCurieContext?: Record<string, any>;
  resources?: any[];
  [key: string]: any; // Type-specific fields
}

/**
 * User module with progress
 */
export interface UserModuleResponse {
  id: string;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  totalExercises: number;
  completedExercises: number;
  progressPercentage: number;
  isUnlocked: boolean;
  thumbnailUrl?: string;
}

/**
 * Module access check response
 */
export interface ModuleAccessResponse {
  hasAccess: boolean;
  userRank: RangoMaya;
  requiredRank?: RangoMaya;
  reason?: string;
}

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

const mockModules: ModuleResponse[] = [
  {
    id: '1',
    title: 'Comprensión Literal',
    subtitle: 'Fundamentos de lectura',
    description: 'Aprende a identificar información explícita en textos',
    orderIndex: 1,
    difficulty: 'beginner',
    estimatedDurationMinutes: 120,
    totalExercises: 5,
    xpReward: 500,
    mlCoinsReward: 100,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockExercises: ExerciseSummary[] = [
  {
    id: '1',
    title: 'Crucigrama Científico',
    exerciseType: 'crucigrama',
    orderIndex: 1,
    difficulty: 'beginner',
    estimatedTimeMinutes: 15,
    pointsReward: 100,
    isUnlocked: true,
  },
];

// ============================================================================
// CONTENT API FUNCTIONS
// ============================================================================

/**
 * Get all modules with optional pagination and filtering
 *
 * Backend: GET /api/educational/modules
 *
 * @param params - Pagination and filter parameters
 * @returns Paginated list of modules
 */
export const getModules = async (
  params?: PaginationParams & { difficulty?: DifficultyLevel }
): Promise<PaginatedResponse<ModuleResponse>> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: mockModules,
        meta: {
          total: mockModules.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
          totalPages: 1,
        },
      };
    }

    const { data } = await apiClient.get<ApiResponse<ModuleResponse[]>>(
      API_ENDPOINTS.educational.modules,
      { params }
    );

    return {
      data: data.data,
      meta: {
        total: data.data.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 1,
      },
    };
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get single module by ID with detailed information
 *
 * Backend: GET /api/educational/modules/:moduleId
 *
 * @param moduleId - Module ID
 * @returns Module details with exercises and progress
 */
export const getModule = async (moduleId: string): Promise<ModuleDetailResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        ...mockModules[0],
        id: moduleId,
        exercises: mockExercises,
        completedExercises: 0,
        progressPercentage: 0,
      };
    }

    const { data } = await apiClient.get<ApiResponse<ModuleDetailResponse>>(
      API_ENDPOINTS.educational.module(moduleId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get all exercises in a module
 *
 * Backend: GET /api/educational/modules/:moduleId/exercises
 *
 * NOTE: Backend does not have a separate /lessons endpoint.
 * Use this method to get exercises directly from a module.
 *
 * @param moduleId - Module ID
 * @returns List of exercises in the module
 */
export const getModuleExercises = async (moduleId: string): Promise<ExerciseSummary[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockExercises;
    }

    const { data } = await apiClient.get<ApiResponse<ExerciseSummary[]>>(
      API_ENDPOINTS.educational.moduleExercises(moduleId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get exercises in a module (alias for backward compatibility)
 *
 * NOTE: Backend does not have a "lessons" concept.
 * This is an alias for getModuleExercises to maintain consistency.
 *
 * @deprecated Use getModuleExercises instead
 * @param moduleId - Module ID
 * @returns List of exercises in the module
 */
export const getLessons = async (moduleId: string): Promise<ExerciseSummary[]> => {
  console.warn('[contentAPI] getLessons is deprecated. Use getModuleExercises instead.');
  return getModuleExercises(moduleId);
};

/**
 * Get exercises for a "lesson" (module-level)
 *
 * NOTE: Backend does not have separate lessons.
 * This method maps to module exercises for backward compatibility.
 *
 * @deprecated Backend does not have lessons. Use getExercise or getModuleExercises
 * @param lessonId - Actually a module ID in backend
 * @returns List of exercises
 */
export const getExercises = async (lessonId: string): Promise<ExerciseSummary[]> => {
  console.warn('[contentAPI] getExercises(lessonId) is deprecated. Backend does not have lessons. Use getModuleExercises instead.');
  return getModuleExercises(lessonId);
};

/**
 * Get single exercise by ID
 *
 * Backend: GET /api/educational/exercises/:exerciseId
 *
 * @param exerciseId - Exercise ID
 * @returns Exercise details with content
 */
export const getExercise = async (exerciseId: string): Promise<ExerciseResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return {
        id: exerciseId,
        moduleId: '1',
        title: 'Crucigrama Científico',
        description: 'Completa el crucigrama con términos científicos',
        instructions: 'Lee las pistas y completa el crucigrama',
        exerciseType: 'crucigrama',
        difficulty: 'beginner',
        estimatedTimeMinutes: 15,
        pointsReward: 100,
        passingScore: 70,
        mlCoinsReward: 20,
        xpReward: 100,
        content: {
          question: 'Completa el crucigrama',
          options: [],
        },
        hints: ['Revisa el texto científico', 'Busca términos clave'],
        availablePowerups: ['pistas', 'vision_lectora'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    const { data } = await apiClient.get<ApiResponse<ExerciseResponse>>(
      API_ENDPOINTS.educational.exercise(exerciseId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get all exercises (global list)
 *
 * Backend: GET /api/educational/exercises
 *
 * @param params - Pagination and filter parameters
 * @returns Paginated list of exercises
 */
export const getAllExercises = async (
  params?: PaginationParams & { moduleId?: string; type?: ExerciseType; difficulty?: DifficultyLevel }
): Promise<PaginatedResponse<ExerciseSummary>> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        data: mockExercises,
        meta: {
          total: mockExercises.length,
          page: params?.page || 1,
          limit: params?.limit || 20,
          totalPages: 1,
        },
      };
    }

    const { data } = await apiClient.get<ApiResponse<ExerciseSummary[]>>(
      API_ENDPOINTS.educational.exercises,
      { params }
    );

    return {
      data: data.data,
      meta: {
        total: data.data.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
        totalPages: 1,
      },
    };
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Check if user has access to a module
 *
 * Backend: GET /api/educational/modules/:moduleId/access
 *
 * @param moduleId - Module ID
 * @returns Access information
 */
export const checkModuleAccess = async (moduleId: string): Promise<ModuleAccessResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        hasAccess: true,
        userRank: 'Nacom',
      };
    }

    const { data } = await apiClient.get<ApiResponse<ModuleAccessResponse>>(
      API_ENDPOINTS.educational.moduleAccess(moduleId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user's modules with progress
 *
 * Backend: GET /api/educational/modules/user/:userId
 *
 * @param userId - User ID
 * @returns List of user modules with progress
 */
export const getUserModules = async (userId: string): Promise<UserModuleResponse[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          title: 'Comprensión Literal',
          description: 'Fundamentos de lectura',
          difficulty: 'beginner',
          totalExercises: 5,
          completedExercises: 2,
          progressPercentage: 40,
          isUnlocked: true,
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<UserModuleResponse[]>>(
      API_ENDPOINTS.educational.userModules(userId)
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
  // Modules
  getModules,
  getModule,
  getUserModules,
  checkModuleAccess,

  // Exercises
  getAllExercises,
  getExercise,
  getModuleExercises,

  // Deprecated (for backward compatibility)
  getLessons,
  getExercises,
};
