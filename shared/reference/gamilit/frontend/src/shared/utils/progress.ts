/**
 * Shared Progress Utilities
 * Standardized progress reporting for all exercises across the GLIT platform
 */

export interface ProgressData {
  percentage: number;
  completedItems: number;
  totalItems: number;
  currentStep?: string;
}

/**
 * Report progress to parent component
 * Safely calls the onProgressUpdate callback if provided
 */
export const reportProgress = (
  onProgressUpdate: ((progress: ProgressData) => void) | undefined,
  data: ProgressData
): void => {
  if (onProgressUpdate) {
    onProgressUpdate(data);
  }
};

/**
 * Calculate progress percentage
 */
export const calculateProgressPercentage = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.min(100, Math.round((completed / total) * 100));
};

/**
 * Create progress data object
 */
export const createProgressData = (
  completed: number,
  total: number,
  currentStep?: string
): ProgressData => {
  return {
    percentage: calculateProgressPercentage(completed, total),
    completedItems: completed,
    totalItems: total,
    currentStep
  };
};

/**
 * Report simple percentage progress
 */
export const reportPercentage = (
  onProgressUpdate: ((progress: number) => void) | undefined,
  percentage: number
): void => {
  if (onProgressUpdate) {
    onProgressUpdate(Math.min(100, Math.max(0, percentage)));
  }
};
