/**
 * Shared Storage Utilities
 * Standardized localStorage management for all exercises across the GLIT platform
 */

/**
 * Save exercise progress to localStorage
 * @param exerciseId - Unique identifier for the exercise
 * @param state - State object to save
 */
export const saveProgress = <T>(exerciseId: string, state: T): void => {
  try {
    const key = `exercise_progress_${exerciseId}`;
    localStorage.setItem(key, JSON.stringify(state));
  } catch (error) {
    console.error(`Failed to save progress for ${exerciseId}:`, error);
  }
};

/**
 * Load exercise progress from localStorage
 * @param exerciseId - Unique identifier for the exercise
 * @returns Saved state or null if not found
 */
export const loadProgress = <T>(exerciseId: string): T | null => {
  try {
    const key = `exercise_progress_${exerciseId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Failed to load progress for ${exerciseId}:`, error);
    return null;
  }
};

/**
 * Clear exercise progress from localStorage
 * @param exerciseId - Unique identifier for the exercise
 */
export const clearProgress = (exerciseId: string): void => {
  try {
    const key = `exercise_progress_${exerciseId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to clear progress for ${exerciseId}:`, error);
  }
};

/**
 * Check if progress exists for an exercise
 * @param exerciseId - Unique identifier for the exercise
 */
export const hasProgress = (exerciseId: string): boolean => {
  try {
    const key = `exercise_progress_${exerciseId}`;
    return localStorage.getItem(key) !== null;
  } catch (error) {
    console.error(`Failed to check progress for ${exerciseId}:`, error);
    return false;
  }
};

/**
 * Save multiple exercise states at once
 * @param states - Map of exerciseId to state
 */
export const saveBulkProgress = <T>(states: Map<string, T>): void => {
  states.forEach((state, exerciseId) => {
    saveProgress(exerciseId, state);
  });
};

/**
 * Clear all exercise progress (use with caution)
 */
export const clearAllProgress = (): void => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith('exercise_progress_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all progress:', error);
  }
};
