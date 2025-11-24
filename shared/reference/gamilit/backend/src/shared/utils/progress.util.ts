/**
 * Progress Utilities
 *
 * Utilidades para reportar y calcular progreso de ejercicios
 */

export interface ProgressData {
  current: number;
  total: number;
  percentage: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export type ProgressCallback = (data: ProgressData) => void;

/**
 * Calcula el porcentaje de progreso
 */
export function calculateProgressPercentage(
  current: number,
  total: number,
): number {
  if (total === 0) {
    return 0;
  }

  const percentage = (current / total) * 100;
  return Math.min(100, Math.max(0, percentage)); // Clamp entre 0-100
}

/**
 * Determina el estado del progreso
 */
export function getProgressStatus(
  current: number,
  total: number,
): ProgressData['status'] {
  if (current === 0) {
    return 'not_started';
  }
  if (current >= total) {
    return 'completed';
  }
  return 'in_progress';
}

/**
 * Crea un objeto de datos de progreso
 */
export function createProgressData(
  current: number,
  total: number,
): ProgressData {
  return {
    current,
    total,
    percentage: calculateProgressPercentage(current, total),
    status: getProgressStatus(current, total),
  };
}

/**
 * Reporta progreso de manera segura (evita errores si callback es null)
 */
export function reportProgress(
  callback: ProgressCallback | undefined,
  current: number,
  total: number,
): void {
  if (typeof callback === 'function') {
    const data = createProgressData(current, total);
    callback(data);
  }
}

/**
 * Reporta solo el porcentaje (wrapper simplificado)
 */
export function reportPercentage(
  callback: ((percentage: number) => void) | undefined,
  current: number,
  total: number,
): void {
  if (typeof callback === 'function') {
    const percentage = calculateProgressPercentage(current, total);
    callback(percentage);
  }
}

/**
 * Calcula el progreso de un módulo basado en ejercicios completados
 */
export function calculateModuleProgress(
  completedExercises: number,
  totalExercises: number,
  requiredPercentage: number = 100, // % requerido para considerar completo
): {
  progress: ProgressData;
  isComplete: boolean;
  remainingExercises: number;
} {
  const progress = createProgressData(completedExercises, totalExercises);
  const isComplete = progress.percentage >= requiredPercentage;
  const remainingExercises = Math.max(0, totalExercises - completedExercises);

  return {
    progress,
    isComplete,
    remainingExercises,
  };
}

/**
 * Calcula el tiempo estimado restante
 */
export function estimateTimeRemaining(
  current: number,
  total: number,
  elapsedTime: number, // en segundos
): number | null {
  if (current === 0) {
    return null; // No hay suficiente información
  }

  const averageTimePerItem = elapsedTime / current;
  const remainingItems = total - current;
  const estimatedTime = averageTimePerItem * remainingItems;

  return Math.round(estimatedTime);
}

/**
 * Formatea tiempo en formato legible
 */
export function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (minutes < 60) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
