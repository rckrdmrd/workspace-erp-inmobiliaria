/**
 * Shared Scoring Utilities
 * Standardized score calculation for all exercises across the GLIT platform
 */

export interface ScoreCalculationParams {
  exerciseId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  correctAnswers: number;
  totalQuestions: number;
  hintsUsed?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  bonusPoints?: number;
}

/**
 * Calculate final score for an exercise
 * Formula: (baseScore + timeBonus + bonusPoints - hintPenalty) * difficultyMultiplier
 * Result: Clamped to 0-100 range
 */
export const calculateScore = async (params: ScoreCalculationParams): Promise<number> => {
  const {
    correctAnswers,
    totalQuestions,
    startTime,
    endTime,
    hintsUsed = 0,
    difficulty = 'medium',
    bonusPoints = 0
  } = params;

  // Base score (0-100)
  const baseScore = (correctAnswers / totalQuestions) * 100;

  // Time bonus (faster = more points, max 20 points)
  const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000; // seconds
  const timeBonus = Math.max(0, 20 - (timeSpent / 60));

  // Difficulty multiplier
  const difficultyMultiplier = {
    easy: 0.8,
    medium: 1.0,
    hard: 1.2
  }[difficulty];

  // Hint penalty (-5 points per hint)
  const hintPenalty = hintsUsed * 5;

  // Calculate final score
  const finalScore = Math.round(
    (baseScore + timeBonus + bonusPoints - hintPenalty) * difficultyMultiplier
  );

  return Math.max(0, Math.min(100, finalScore)); // Clamp to 0-100
};

/**
 * Calculate time bonus based on elapsed time
 * @param startTime - When the exercise started
 * @param endTime - When the exercise ended
 * @param maxBonus - Maximum bonus points (default: 20)
 * @param targetTimeSeconds - Target time for max bonus (default: 60 seconds)
 */
export const calculateTimeBonus = (
  startTime: Date,
  endTime: Date,
  maxBonus: number = 20,
  targetTimeSeconds: number = 60
): number => {
  const timeSpent = (endTime.getTime() - startTime.getTime()) / 1000;
  return Math.max(0, maxBonus - (timeSpent / targetTimeSeconds) * maxBonus);
};

/**
 * Calculate accuracy bonus based on correct/total ratio
 */
export const calculateAccuracyBonus = (
  correct: number,
  total: number,
  maxBonus: number = 20
): number => {
  const accuracy = correct / total;
  return Math.round(accuracy * maxBonus);
};

/**
 * Calculate completion bonus
 */
export const calculateCompletionBonus = (
  completed: number,
  total: number,
  maxBonus: number = 20
): number => {
  return completed === total ? maxBonus : 0;
};
