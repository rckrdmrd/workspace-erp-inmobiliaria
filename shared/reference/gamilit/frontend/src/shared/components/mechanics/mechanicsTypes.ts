/**
 * Mechanics Types
 * Shared types for exercise mechanics and feedback
 *
 * TODO: This is a stub file created to unblock TypeScript compilation
 * Full implementation needed in Phase 2
 */

// Import DifficultyLevel enum from educational types (official standard)
import { DifficultyLevel as DifficultyLevelEnum } from '@shared/types/educational.types';

export interface ExerciseFeedback {
  type: 'success' | 'error' | 'info' | 'warning' | 'partial';
  title: string;
  message: string;
  score?: number;
  xpEarned?: number;
  mlCoinsEarned?: number;
  showConfetti?: boolean;
  explanation?: string;
  points?: number;
  // Legacy compatibility
  isCorrect?: boolean;
}

export interface ExerciseAttempt {
  attemptNumber: number;
  isCorrect: boolean;
  timeSpent: number;
  feedback: ExerciseFeedback;
}

export interface ExerciseResult {
  exerciseId: string;
  score: number;
  maxScore: number;
  attempts: ExerciseAttempt[];
  completedAt?: string;
}

export interface MechanicsProps {
  exerciseId: string;
  moduleId: string;
  onComplete?: (result: ExerciseResult) => void;
  onProgress?: (progress: number) => void;
}

export interface MechanicsState {
  currentAttempt: number;
  maxAttempts: number;
  timeStarted: number;
  hintsUsed: number;
  maxHints: number;
}

// Export both the enum and a type for it (uses CEFR levels)
export { DifficultyLevelEnum };
export type DifficultyLevel = DifficultyLevelEnum;

// Legacy Spanish difficulty levels (deprecated - use DifficultyLevel enum instead)
// @deprecated
export type DifficultyLevelES = 'facil' | 'medio' | 'dificil' | 'experto';

// English aliases for compatibility (deprecated - use DifficultyLevel enum instead)
// @deprecated
export type DifficultyLevelEN = 'easy' | 'medium' | 'hard' | 'expert';

export type ExerciseType =
  | 'multiple-choice'
  | 'fill-blanks'
  | 'matching'
  | 'ordering'
  | 'crossword'
  | 'timeline'
  | 'collage'
  | 'classification';

// Base exercise type
export interface BaseExercise {
  id: string;
  type?: ExerciseType;
  title: string;
  description?: string; // Optional description field for exercise details
  instructions?: string;
  maxAttempts?: number;
  timeLimit?: number;
  difficulty?: DifficultyLevel;
  estimatedTime?: number;
  topic?: string;
  /**
   * Optional array of hints to help users complete the exercise
   * Each hint includes an ID, text content, and cost in ML Coins
   * @example [{ id: 'hint-001', text: 'Check the first letter', cost: 15 }]
   */
  hints?: HintObject[];
}

// Hint type for exercise hints
export type Hint = string;

/**
 * Hint object with metadata for exercise hint system
 * Includes ID for tracking, text content, and optional cost in ML Coins
 */
export interface HintObject {
  id: string;
  text: string;
  cost: number;
}

// Feedback data type (alias)
export type FeedbackData = ExerciseFeedback;

/**
 * Progress data for exercise tracking
 * Supports both simple score tracking and detailed progress data
 */
export interface ProgressData {
  score?: number;
  data?: Record<string, any>;
  hintsUsed?: number;
  timeSpent?: number;
  // Mechanic-specific fields
  blanks?: any[];
  usedWords?: string[];
  matches?: any[];
  answers?: Record<string, any>;
  // Allow additional fields for future mechanics
  [key: string]: any;
}

// Utility functions (stubs)

/**
 * Calculates a percentage score from correct and total answers
 * @param correct - Number of correct answers
 * @param total - Total number of questions
 * @returns Percentage score (0-100)
 */
export const calculateScore = (correct: number, total: number): number => {
  return Math.round((correct / total) * 100);
};

/**
 * Saves exercise progress to local storage or backend
 * @param exerciseId - The unique identifier for the exercise
 * @param progress - Progress data (number for simple score, or object for detailed progress)
 * @returns Promise that resolves when progress is saved
 *
 * @example
 * // Simple score
 * saveProgress('exercise-1', 85);
 *
 * @example
 * // Detailed progress
 * saveProgress('exercise-1', {
 *   score: 85,
 *   hintsUsed: 2,
 *   timeSpent: 120,
 *   blanks: [...]
 * });
 */
export const saveProgress = async (
  exerciseId: string,
  progress: number | ProgressData
): Promise<void> => {
  // Normalize progress data
  const progressData: ProgressData = typeof progress === 'number'
    ? { score: progress }
    : progress;

  // TODO: Implement progress saving to backend
  console.log('Saving progress:', exerciseId, progressData);
};

/**
 * Progress update interface for exercise mechanics
 * Used by onProgressUpdate callbacks to track exercise completion status
 */
export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

/**
 * Normaliza un progreso simple (number) a ExerciseProgressUpdate completo
 *
 * Esta función permite a los componentes que calculan solo un score (number)
 * convertirlo a un objeto ExerciseProgressUpdate completo con valores default
 * para campos opcionales.
 *
 * @param progress - Score del ejercicio (0-100)
 * @param currentStep - Paso actual del ejercicio (default: 0)
 * @param totalSteps - Total de pasos del ejercicio (default: 1)
 * @param hintsUsed - Número de pistas usadas (default: 0)
 * @param timeSpent - Tiempo transcurrido en segundos (default: 0)
 * @returns Objeto ExerciseProgressUpdate completo
 *
 * @example
 * // Uso simple (solo score)
 * normalizeProgressUpdate(85)
 * // Returns: { currentStep: 0, totalSteps: 1, score: 85, hintsUsed: 0, timeSpent: 0 }
 *
 * @example
 * // Uso completo
 * normalizeProgressUpdate(85, 5, 10, 2, 120)
 * // Returns: { currentStep: 5, totalSteps: 10, score: 85, hintsUsed: 2, timeSpent: 120 }
 */
export function normalizeProgressUpdate(
  progress: number,
  currentStep: number = 0,
  totalSteps: number = 1,
  hintsUsed: number = 0,
  timeSpent: number = 0
): ExerciseProgressUpdate {
  return {
    currentStep,
    totalSteps,
    score: progress,
    hintsUsed,
    timeSpent,
  };
}
