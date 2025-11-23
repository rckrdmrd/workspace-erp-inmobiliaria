/**
 * Scoring Utilities
 *
 * Sistema estandarizado de puntuación para ejercicios
 */

export interface ScoreCalculationOptions {
  baseScore: number;
  difficulty: 'easy' | 'medium' | 'hard';
  timeSpent: number; // en segundos
  maxTime?: number; // tiempo máximo esperado en segundos
  hintsUsed: number;
  accuracy: number; // 0-1 (porcentaje correcto)
  isPerfect?: boolean;
  isFirstAttempt?: boolean;
}

export interface ScoreResult {
  total: number;
  breakdown: {
    base: number;
    difficulty: number;
    time: number;
    accuracy: number;
    hints: number;
    perfect: number;
    firstAttempt: number;
  };
  multiplier: number;
}

/**
 * Multiplicadores base por dificultad
 */
const DIFFICULTY_MULTIPLIERS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

/**
 * Calcula el puntaje total de un ejercicio
 */
export function calculateScore(
  options: ScoreCalculationOptions,
): ScoreResult {
  const {
    baseScore,
    difficulty,
    timeSpent,
    maxTime,
    hintsUsed,
    accuracy,
    isPerfect = false,
    isFirstAttempt = false,
  } = options;

  // Multiplicador de dificultad
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty] || 1.0;
  const difficultyBonus = baseScore * (difficultyMultiplier - 1);

  // Bonus de tiempo (más rápido = más puntos)
  const timeBonus = calculateTimeBonus(baseScore, timeSpent, maxTime);

  // Bonus de precisión
  const accuracyBonus = calculateAccuracyBonus(baseScore, accuracy);

  // Penalización por pistas
  const hintsPenalty = hintsUsed * (baseScore * 0.1); // -10% por pista

  // Bonus por puntaje perfecto
  const perfectBonus = isPerfect ? baseScore * 0.5 : 0; // +50%

  // Bonus por primer intento exitoso
  const firstAttemptBonus = isFirstAttempt ? baseScore * 0.25 : 0; // +25%

  // Calcular total
  const total = Math.max(
    0,
    baseScore +
      difficultyBonus +
      timeBonus +
      accuracyBonus -
      hintsPenalty +
      perfectBonus +
      firstAttemptBonus,
  );

  // Redondear a entero
  const finalScore = Math.round(total);

  return {
    total: finalScore,
    breakdown: {
      base: baseScore,
      difficulty: Math.round(difficultyBonus),
      time: Math.round(timeBonus),
      accuracy: Math.round(accuracyBonus),
      hints: -Math.round(hintsPenalty),
      perfect: Math.round(perfectBonus),
      firstAttempt: Math.round(firstAttemptBonus),
    },
    multiplier: difficultyMultiplier,
  };
}

/**
 * Calcula bonus por rapidez
 * Más rápido que el tiempo esperado = bonus
 */
export function calculateTimeBonus(
  baseScore: number,
  timeSpent: number,
  maxTime?: number,
): number {
  if (!maxTime || maxTime === 0) {
    return 0;
  }

  // Si se excedió el tiempo, sin bonus
  if (timeSpent >= maxTime) {
    return 0;
  }

  // Porcentaje de tiempo usado
  const timePercentage = timeSpent / maxTime;

  // Bonus inversamente proporcional al tiempo usado
  // 0-25% tiempo = 50% bonus
  // 25-50% tiempo = 25% bonus
  // 50-75% tiempo = 10% bonus
  // 75-100% tiempo = 0% bonus
  let bonusPercentage = 0;
  if (timePercentage < 0.25) {
    bonusPercentage = 0.5;
  } else if (timePercentage < 0.5) {
    bonusPercentage = 0.25;
  } else if (timePercentage < 0.75) {
    bonusPercentage = 0.1;
  }

  return baseScore * bonusPercentage;
}

/**
 * Calcula bonus por precisión
 */
export function calculateAccuracyBonus(
  baseScore: number,
  accuracy: number,
): number {
  // accuracy debe estar entre 0 y 1
  const clampedAccuracy = Math.max(0, Math.min(1, accuracy));

  // Bonus proporcional a la precisión
  // 100% accuracy = +30% bonus
  // 90% accuracy = +20% bonus
  // 80% accuracy = +10% bonus
  // <80% accuracy = 0% bonus
  let bonusPercentage = 0;
  if (clampedAccuracy >= 1.0) {
    bonusPercentage = 0.3;
  } else if (clampedAccuracy >= 0.9) {
    bonusPercentage = 0.2;
  } else if (clampedAccuracy >= 0.8) {
    bonusPercentage = 0.1;
  }

  return baseScore * bonusPercentage;
}

/**
 * Calcula bonus por completar todo
 */
export function calculateCompletionBonus(
  baseScore: number,
  completed: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }

  const completionPercentage = completed / total;

  // Bonus solo si se completa todo
  if (completionPercentage >= 1.0) {
    return baseScore * 0.2; // +20%
  }

  return 0;
}

/**
 * Calcula ML Coins ganados basados en el score
 */
export function calculateMLCoinsEarned(
  score: number,
  baseCoinsRate: number = 0.1, // 10 puntos = 1 ML Coin por defecto
): number {
  const coins = score * baseCoinsRate;
  return Math.round(coins);
}

/**
 * Calcula XP ganado basado en el score
 */
export function calculateXPEarned(
  score: number,
  xpMultiplier: number = 1.0,
): number {
  const xp = score * xpMultiplier;
  return Math.round(xp);
}
