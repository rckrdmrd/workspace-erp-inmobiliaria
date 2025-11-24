/**
 * Mechanics API Integration
 *
 * API client for exercise mechanics including submission, progress tracking,
 * scoring, and hints system.
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Mechanic types available in the platform
 */
export type MechanicType =
  | 'detective-textual'
  | 'crucigrama'
  | 'wordoku'
  | 'sopa-letras'
  | 'ahorcado'
  | 'ordenar-oraciones'
  | 'comprension-lectora'
  | 'fill-blanks';

/**
 * Exercise difficulty levels
 */
export type DifficultyLevel = 'facil' | 'medio' | 'dificil' | 'experto';

/**
 * Exercise/Mechanic definition
 */
export interface Mechanic {
  id: string;
  type: MechanicType;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedTime: number; // in minutes
  xpReward: number;
  mlCoinsReward: number;
  content: unknown; // Type varies by mechanic
  metadata?: {
    moduleId?: string;
    lessonId?: string;
    tags?: string[];
    requiredRank?: string;
    requiredLevel?: number;
  };
}

/**
 * Exercise submission request
 */
export interface SubmissionRequest {
  mechanicId: string;
  answers: unknown; // Type varies by mechanic
  timeSpent: number; // in seconds
  hintsUsed: number;
  metadata?: {
    startedAt?: Date;
    deviceType?: string;
  };
}

/**
 * Exercise submission response
 */
export interface SubmissionResponse {
  success: boolean;
  score: number; // 0-100
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  mlCoinsEarned: number;
  bonuses?: {
    perfectScore?: boolean;
    speedBonus?: boolean;
    noHintsBonus?: boolean;
  };
  feedback: {
    correct: string[];
    incorrect: string[];
    explanations: Record<string, string>;
  };
  achievements?: string[]; // Achievement IDs unlocked
}

/**
 * User progress for mechanics
 */
export interface UserProgress {
  mechanicId: string;
  attempts: number;
  bestScore: number;
  completed: boolean;
  completedAt?: Date;
  timeSpent: number; // total seconds
  averageScore: number;
  lastAttemptAt: Date;
}

/**
 * Hint request
 */
export interface HintRequest {
  mechanicId: string;
  questionIndex?: number;
  hintLevel: number; // 1-3 (basic, intermediate, detailed)
}

/**
 * Hint response
 */
export interface HintResponse {
  hint: string;
  level: number;
  costML: number;
  remainingHints: number;
}

/**
 * Scoring criteria
 */
export interface ScoringCriteria {
  basePoints: number;
  timeBonus: number;
  accuracyMultiplier: number;
  penaltyPerHint: number;
  penaltyPerError: number;
  perfectScoreBonus: number;
}

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

const mockMechanics: Mechanic[] = [
  {
    id: '1',
    type: 'detective-textual',
    title: 'El Misterio del Científico',
    description: 'Resuelve el misterio usando pistas textuales',
    difficulty: 'medio',
    estimatedTime: 15,
    xpReward: 100,
    mlCoinsReward: 20,
    content: {},
  },
];

/**
 * Mock get mechanics
 */
const mockGetMechanics = async (): Promise<Mechanic[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return mockMechanics;
};

/**
 * Mock submit exercise
 */
const mockSubmitExercise = async (submission: SubmissionRequest): Promise<SubmissionResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate scoring
  const score = Math.floor(Math.random() * 30) + 70; // 70-100
  const isPerfect = score === 100;

  return {
    success: true,
    score,
    correctAnswers: 8,
    totalQuestions: 10,
    xpEarned: isPerfect ? 150 : 100,
    mlCoinsEarned: isPerfect ? 30 : 20,
    bonuses: {
      perfectScore: isPerfect,
      speedBonus: submission.timeSpent < 300,
      noHintsBonus: submission.hintsUsed === 0,
    },
    feedback: {
      correct: ['1', '2', '3', '4', '5', '6', '7', '8'],
      incorrect: ['9', '10'],
      explanations: {
        '9': 'La respuesta correcta es "fotosíntesis"',
        '10': 'Revisa el segundo párrafo para encontrar la clave',
      },
    },
    achievements: isPerfect ? ['perfect-score-001'] : undefined,
  };
};

// ============================================================================
// MECHANICS API FUNCTIONS
// ============================================================================

/**
 * Get all mechanics/exercises
 *
 * @param type - Optional filter by mechanic type
 * @param difficulty - Optional filter by difficulty
 * @returns List of mechanics
 */
export const getMechanics = async (
  type?: MechanicType,
  difficulty?: DifficultyLevel
): Promise<Mechanic[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetMechanics();
    }

    const { data } = await apiClient.get<ApiResponse<Mechanic[]>>(
      API_ENDPOINTS.mechanics.list,
      { params: { type, difficulty } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get single mechanic by ID
 *
 * @param mechanicId - Mechanic ID
 * @returns Mechanic data
 */
export const getMechanic = async (mechanicId: string): Promise<Mechanic> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockMechanics[0];
    }

    const { data } = await apiClient.get<ApiResponse<Mechanic>>(
      API_ENDPOINTS.mechanics.get(mechanicId)
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Submit exercise answers
 *
 * @param submission - Exercise submission data
 * @returns Submission result with score and feedback
 */
export const submitExercise = async (
  submission: SubmissionRequest
): Promise<SubmissionResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockSubmitExercise(submission);
    }

    // Transform frontend submission to backend format
    // Ensure startedAt is not in the future (account for clock skew)
    const calculatedStartedAt = submission.metadata?.startedAt
      ? submission.metadata.startedAt.getTime()
      : Date.now() - (submission.timeSpent * 1000);

    const backendPayload = {
      answers: submission.answers,
      startedAt: Math.min(calculatedStartedAt, Date.now() - 1000), // Ensure it's at least 1 second in the past
      hintsUsed: submission.hintsUsed || 0,
      powerupsUsed: [] // TODO: Add powerups support
    };

    console.log('[submitExercise] Sending payload:', JSON.stringify(backendPayload, null, 2));

    const { data } = await apiClient.post<ApiResponse<SubmissionResponse>>(
      `/educational/exercises/${submission.mechanicId}/submit`,
      backendPayload
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get user progress for mechanics
 *
 * @param mechanicId - Optional filter by mechanic ID
 * @returns User progress data
 */
export const getUserProgress = async (mechanicId?: string): Promise<UserProgress[]> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          mechanicId: '1',
          attempts: 3,
          bestScore: 85,
          completed: true,
          completedAt: new Date(),
          timeSpent: 900,
          averageScore: 78,
          lastAttemptAt: new Date(),
        },
      ];
    }

    const { data } = await apiClient.get<ApiResponse<UserProgress[]>>(
      API_ENDPOINTS.mechanics.progress,
      { params: { mechanicId } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get hint for exercise
 *
 * @param request - Hint request data
 * @returns Hint response
 */
export const getHint = async (request: HintRequest): Promise<HintResponse> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const hints = [
        'Busca pistas en el primer párrafo',
        'Presta atención a las palabras clave relacionadas con el tiempo',
        'La respuesta se encuentra en la tercera oración del segundo párrafo',
      ];

      return {
        hint: hints[request.hintLevel - 1] || hints[0],
        level: request.hintLevel,
        costML: request.hintLevel * 5,
        remainingHints: 3 - request.hintLevel,
      };
    }

    const { data } = await apiClient.post<ApiResponse<HintResponse>>(
      API_ENDPOINTS.mechanics.hints(request.mechanicId),
      { questionIndex: request.questionIndex, level: request.hintLevel }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get scoring criteria for mechanic
 *
 * @param mechanicId - Mechanic ID
 * @returns Scoring criteria
 */
export const getScoringCriteria = async (mechanicId: string): Promise<ScoringCriteria> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        basePoints: 100,
        timeBonus: 50,
        accuracyMultiplier: 1.2,
        penaltyPerHint: -5,
        penaltyPerError: -10,
        perfectScoreBonus: 50,
      };
    }

    const { data } = await apiClient.get<ApiResponse<ScoringCriteria>>(
      API_ENDPOINTS.mechanics.scoring,
      { params: { mechanicId } }
    );

    return data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Validate answer before submission
 *
 * @param mechanicId - Mechanic ID
 * @param answer - Answer to validate
 * @returns Validation result
 */
export const validateAnswer = async (
  mechanicId: string,
  answer: unknown
): Promise<{ isValid: boolean; message?: string }> => {
  try {
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { isValid: true };
    }

    const { data } = await apiClient.post<ApiResponse<{ isValid: boolean; message?: string }>>(
      API_ENDPOINTS.mechanics.validate,
      { mechanicId, answer }
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
  getMechanics,
  getMechanic,
  submitExercise,
  getUserProgress,
  getHint,
  getScoringCriteria,
  validateAnswer,
};
