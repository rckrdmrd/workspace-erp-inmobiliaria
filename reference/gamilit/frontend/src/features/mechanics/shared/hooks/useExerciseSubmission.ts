/**
 * useExerciseSubmission Hook
 *
 * Secure exercise submission hook that:
 * - Validates answers client-side with Zod before sending
 * - Tracks submission timing for anti-cheat
 * - Handles rate limiting errors gracefully
 * - Returns correct answers ONLY after server validation
 *
 * SECURITY: Never validate answers locally. Always submit to server.
 */

import { useState, useRef, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { apiClient } from '@/services/api/apiClient';
import { toast } from 'react-hot-toast';

// ============================================================================
// ZOD SCHEMAS (match backend validation)
// ============================================================================

/**
 * Submission payload schema (matches backend DTO)
 */
export const SubmitExerciseSchema = z.object({
  answers: z.record(z.string(), z.any()).refine(
    (answers) => Object.keys(answers).length > 0,
    { message: 'At least one answer is required' }
  ),
  startedAt: z.number().int().positive(),
  hintsUsed: z.number().int().min(0).max(10).default(0),
  powerupsUsed: z.array(
    z.enum(['pistas', 'vision_lectora', 'segunda_oportunidad'])
  ).default([]),
  sessionId: z.string().uuid().optional(),
});

export type SubmitExercisePayload = z.infer<typeof SubmitExerciseSchema>;

/**
 * Submission result from server (includes correct answers)
 */
export interface SubmissionResult {
  attemptId: string;
  score: number;
  isPerfect: boolean;
  correctAnswersCount: number;
  totalQuestions: number;
  rewards: {
    mlCoins: number;
    xp: number;
    bonuses: {
      perfectScore?: number;
      noHints?: number;
      speedBonus?: number;
      firstAttempt?: number;
    };
  };
  feedback: {
    overall: string;
    answerReview: Array<{
      questionId: string;
      isCorrect: boolean;
      userAnswer: string;
      correctAnswer: string;
      explanation?: string;
    }>;
  };
  achievements: Array<{
    id: string;
    name: string;
    icon: string;
    rarity: string;
  }>;
  // SECURITY: These are ONLY available after submission
  correctAnswers: Record<string, any>;
  explanations: Record<string, string>;
  createdAt: string;
}

// ============================================================================
// HOOK OPTIONS
// ============================================================================

export interface UseExerciseSubmissionOptions {
  onSuccess?: (result: SubmissionResult) => void;
  onError?: (error: any) => void;
  onRateLimitError?: (retryAfter: number) => void;
  trackHints?: boolean;
  trackPowerups?: boolean;
}

// ============================================================================
// MAIN HOOK
// ============================================================================

/**
 * Hook for secure exercise submission
 *
 * @param exerciseId - ID of the exercise being submitted
 * @param options - Callback options
 * @returns Mutation state and helper functions
 */
export function useExerciseSubmission(
  exerciseId: string,
  options: UseExerciseSubmissionOptions = {}
) {
  // Track when user started the exercise
  const [startTime] = useState(() => Date.now());

  // Track hints and powerups used
  const hintsUsedRef = useRef(0);
  const powerupsUsedRef = useRef<Array<'pistas' | 'vision_lectora' | 'segunda_oportunidad'>>([]);

  // Generate session ID for anti-cheat tracking
  const [sessionId] = useState(() => crypto.randomUUID());

  /**
   * Submit exercise mutation
   */
  const mutation = useMutation({
    mutationFn: async (answers: Record<string, any>) => {
      // 1. CLIENT-SIDE VALIDATION with Zod
      const payload: SubmitExercisePayload = {
        answers,
        startedAt: startTime,
        hintsUsed: options.trackHints ? hintsUsedRef.current : 0,
        powerupsUsed: options.trackPowerups ? powerupsUsedRef.current : [],
        sessionId
      };

      // Validate payload before sending
      try {
        SubmitExerciseSchema.parse(payload);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(`Validation error: ${error.issues[0].message}`);
        }
        throw error;
      }

      // 2. SUBMIT TO SERVER (validation happens server-side)
      const response = await apiClient.post<{
        success: boolean;
        data: SubmissionResult;
        error?: any;
      }>(`/educational/exercises/${exerciseId}/submit`, payload);

      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Submission failed');
      }

      return response.data.data;
    },

    onSuccess: (result) => {
      // Call custom success handler
      if (options.onSuccess) {
        options.onSuccess(result);
      }

      // Show success toast
      toast.success(`Score: ${result.score}%`, {
        icon: result.isPerfect ? '🎉' : '✅',
        duration: 3000,
      });
    },

    onError: (error: any) => {
      // Handle rate limiting errors
      if (error.response?.status === 429) {
        const retryAfter = error.response.data?.error?.retryAfter || 5;

        if (options.onRateLimitError) {
          options.onRateLimitError(retryAfter);
        } else {
          toast.error(
            `Too many attempts. Please wait ${retryAfter} seconds.`,
            { duration: retryAfter * 1000 }
          );
        }
        return;
      }

      // Handle validation errors
      if (error.response?.status === 400) {
        const errorCode = error.response.data?.error?.code;

        if (errorCode === 'SUBMISSION_TOO_FAST') {
          toast.error('Please take time to complete the exercise.');
        } else if (errorCode === 'SESSION_EXPIRED') {
          toast.error('Session expired. Please refresh and try again.');
        } else if (errorCode === 'VALIDATION_ERROR') {
          toast.error('Invalid submission data. Please try again.');
        } else {
          toast.error(error.response.data?.error?.message || 'Submission failed');
        }
        return;
      }

      // Call custom error handler
      if (options.onError) {
        options.onError(error);
      } else {
        toast.error('Failed to submit exercise. Please try again.');
      }

      console.error('[Exercise Submission Error]', error);
    },
  });

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Record that user used a hint
   */
  const recordHintUsed = useCallback(() => {
    if (options.trackHints) {
      hintsUsedRef.current += 1;
    }
  }, [options.trackHints]);

  /**
   * Record that user used a powerup
   */
  const recordPowerupUsed = useCallback(
    (powerup: 'pistas' | 'vision_lectora' | 'segunda_oportunidad') => {
      if (options.trackPowerups && !powerupsUsedRef.current.includes(powerup)) {
        powerupsUsedRef.current.push(powerup);
      }
    },
    [options.trackPowerups]
  );

  /**
   * Get time elapsed since start (in seconds)
   */
  const getTimeElapsed = useCallback(() => {
    return Math.floor((Date.now() - startTime) / 1000);
  }, [startTime]);

  /**
   * Reset tracking (useful for retry)
   */
  const resetTracking = useCallback(() => {
    hintsUsedRef.current = 0;
    powerupsUsedRef.current = [];
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // Mutation state
    submit: mutation.mutate,
    submitAsync: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
    reset: mutation.reset,

    // Helper functions
    recordHintUsed,
    recordPowerupUsed,
    getTimeElapsed,
    resetTracking,

    // Tracking data
    hintsUsed: hintsUsedRef.current,
    powerupsUsed: powerupsUsedRef.current,
    sessionId,
    startTime,
  };
}

/**
 * Example usage:
 *
 * const {
 *   submit,
 *   isSubmitting,
 *   data,
 *   recordHintUsed
 * } = useExerciseSubmission('exercise-123', {
 *   onSuccess: (result) => {
 *     console.log('Score:', result.score);
 *     console.log('Correct answers:', result.correctAnswers);
 *   },
 *   trackHints: true,
 *   trackPowerups: true
 * });
 *
 * // When user uses a hint
 * recordHintUsed();
 *
 * // When user submits answers
 * submit({ q1: true, q2: false, q3: true });
 */
