/**
 * useExerciseSubmission Hook
 *
 * ISSUE: #4 (P0) - Exercise Interfaces
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 *
 * Hook for submitting exercise answers and handling results
 */

import { useState } from 'react';
import apiClient from '@/lib/api/client';
import type {
  ExerciseSubmission,
  ExerciseSubmissionResult,
} from '../types/exercise.types';

interface UseExerciseSubmissionOptions {
  onSuccess?: (result: ExerciseSubmissionResult) => void;
  onError?: (error: Error) => void;
}

export const useExerciseSubmission = (options?: UseExerciseSubmissionOptions) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<ExerciseSubmissionResult | null>(null);

  const submitExercise = async (submission: ExerciseSubmission): Promise<ExerciseSubmissionResult | null> => {
    try {
      setIsSubmitting(true);
      setError(null);

      const { data } = await apiClient.post<ExerciseSubmissionResult>(
        '/progress/exercise-submissions',
        submission
      );

      setResult(data);
      options?.onSuccess?.(data);
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit exercise');
      setError(error);
      options?.onError?.(error);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setIsSubmitting(false);
    setError(null);
    setResult(null);
  };

  return {
    submitExercise,
    isSubmitting,
    error,
    result,
    reset,
  };
};
