/**
 * useExerciseSubmission Hook Tests
 *
 * Tests for exercise submission hook managing exercise answers and results.
 *
 * Test Coverage:
 * - Hook Initialization (3 tests): Initial state, hook structure
 * - Submit Exercise (5 tests): Success, API call, state updates
 * - Success Callback (3 tests): onSuccess triggered, result passed
 * - Error Handling (4 tests): API errors, onError callback, error state
 * - Loading States (3 tests): isSubmitting updates, concurrent calls
 * - Reset Functionality (2 tests): Reset state, clear results
 *
 * Total: 20 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useExerciseSubmission } from '../useExerciseSubmission';
import apiClient from '@/lib/api/client';
import type {
  ExerciseSubmission,
  ExerciseSubmissionResult,
} from '../../types/exercise.types';

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('useExerciseSubmission', () => {
  // ============================================================================
  // MOCK DATA
  // ============================================================================

  const mockSubmission: ExerciseSubmission = {
    exercise_id: 'ex-123',
    user_id: 'user-456',
    answer: 'B',
    time_spent_seconds: 45,
    hints_used: [],
    attempt_number: 1,
  };

  const mockResult: ExerciseSubmissionResult = {
    id: 'sub-789',
    exercise_id: 'ex-123',
    user_id: 'user-456',
    status: 'correct',
    is_correct: true,
    score_percentage: 100,
    xp_earned: 50,
    ml_coins_earned: 25,
    ml_coins_spent: 0,
    feedback: 'Excellent work!',
    correct_answer: 'B',
    explanation: 'Option B is correct because...',
    attempt_number: 1,
    time_spent_seconds: 45,
    submitted_at: new Date('2025-11-09T10:00:00Z'),
  };

  // ============================================================================
  // SETUP & TEARDOWN
  // ============================================================================

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // HOOK INITIALIZATION TESTS
  // ============================================================================

  describe('Hook Initialization', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useExerciseSubmission());

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
      expect(typeof result.current.submitExercise).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should have all required properties', () => {
      const { result } = renderHook(() => useExerciseSubmission());

      expect(result.current).toHaveProperty('submitExercise');
      expect(result.current).toHaveProperty('isSubmitting');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('result');
      expect(result.current).toHaveProperty('reset');
    });

    it('should accept options without crashing', () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(() =>
        useExerciseSubmission({ onSuccess, onError })
      );

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  // ============================================================================
  // SUBMIT EXERCISE TESTS
  // ============================================================================

  describe('Submit Exercise', () => {
    it('should submit exercise successfully', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      let returnedResult: ExerciseSubmissionResult | null = null;

      await act(async () => {
        returnedResult = await result.current.submitExercise(mockSubmission);
      });

      expect(returnedResult).toEqual(mockResult);
      expect(result.current.result).toEqual(mockResult);
      expect(result.current.error).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should call API with correct endpoint and data', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(apiClient.post).toHaveBeenCalledWith(
        '/progress/exercise-submissions',
        mockSubmission
      );
      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    it('should update isSubmitting during submission', async () => {
      vi.mocked(apiClient.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockResult }), 100))
      );

      const { result } = renderHook(() => useExerciseSubmission());

      expect(result.current.isSubmitting).toBe(false);

      act(() => {
        result.current.submitExercise(mockSubmission);
      });

      // Should be true during submission
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });

      // Should be false after completion
      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });

    it('should clear error before submission', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      // Set an initial error
      await act(async () => {
        vi.mocked(apiClient.post).mockRejectedValueOnce(new Error('Previous error'));
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.error).toBeTruthy();

      // Submit again successfully
      await act(async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.error).toBeNull();
    });

    it('should handle multiple submissions', async () => {
      const submission1Result: ExerciseSubmissionResult = {
        ...mockResult,
        id: 'sub-1',
        attempt_number: 1,
      };

      const submission2Result: ExerciseSubmissionResult = {
        ...mockResult,
        id: 'sub-2',
        attempt_number: 2,
      };

      vi.mocked(apiClient.post)
        .mockResolvedValueOnce({ data: submission1Result })
        .mockResolvedValueOnce({ data: submission2Result });

      const { result } = renderHook(() => useExerciseSubmission());

      // First submission
      await act(async () => {
        await result.current.submitExercise({ ...mockSubmission, attempt_number: 1 });
      });

      expect(result.current.result?.id).toBe('sub-1');

      // Second submission
      await act(async () => {
        await result.current.submitExercise({ ...mockSubmission, attempt_number: 2 });
      });

      expect(result.current.result?.id).toBe('sub-2');
      expect(apiClient.post).toHaveBeenCalledTimes(2);
    });
  });

  // ============================================================================
  // SUCCESS CALLBACK TESTS
  // ============================================================================

  describe('Success Callback', () => {
    it('should call onSuccess callback with result', async () => {
      const onSuccess = vi.fn();
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission({ onSuccess }));

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockResult);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });

    it('should not crash if onSuccess is not provided', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.result).toEqual(mockResult);
    });

    it('should call onSuccess for each successful submission', async () => {
      const onSuccess = vi.fn();
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission({ onSuccess }));

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
        await result.current.submitExercise(mockSubmission);
      });

      expect(onSuccess).toHaveBeenCalledTimes(2);
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  describe('Error Handling', () => {
    it('should handle API error', async () => {
      const apiError = new Error('Submission failed');
      vi.mocked(apiClient.post).mockRejectedValue(apiError);

      const { result } = renderHook(() => useExerciseSubmission());

      let returnedResult: ExerciseSubmissionResult | null = null;

      await act(async () => {
        returnedResult = await result.current.submitExercise(mockSubmission);
      });

      expect(returnedResult).toBeNull();
      expect(result.current.error).toEqual(apiError);
      expect(result.current.result).toBeNull();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('should call onError callback on failure', async () => {
      const onError = vi.fn();
      const apiError = new Error('Network error');
      vi.mocked(apiClient.post).mockRejectedValue(apiError);

      const { result } = renderHook(() => useExerciseSubmission({ onError }));

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(onError).toHaveBeenCalledWith(apiError);
      expect(onError).toHaveBeenCalledTimes(1);
    });

    it('should handle non-Error exceptions', async () => {
      vi.mocked(apiClient.post).mockRejectedValue('String error');

      const { result } = renderHook(() => useExerciseSubmission());

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Failed to submit exercise');
    });

    it('should reset isSubmitting on error', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Timeout'));

      const { result } = renderHook(() => useExerciseSubmission());

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  // ============================================================================
  // LOADING STATES TESTS
  // ============================================================================

  describe('Loading States', () => {
    it('should set isSubmitting to true during submission', async () => {
      vi.mocked(apiClient.post).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ data: mockResult }), 50))
      );

      const { result } = renderHook(() => useExerciseSubmission());

      act(() => {
        result.current.submitExercise(mockSubmission);
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(true);
      });
    });

    it('should set isSubmitting to false after successful submission', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.isSubmitting).toBe(false);
    });

    it('should set isSubmitting to false after failed submission', async () => {
      vi.mocked(apiClient.post).mockRejectedValue(new Error('Failed'));

      const { result } = renderHook(() => useExerciseSubmission());

      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.isSubmitting).toBe(false);
    });
  });

  // ============================================================================
  // RESET FUNCTIONALITY TESTS
  // ============================================================================

  describe('Reset Functionality', () => {
    it('should reset all state on reset()', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      // Submit first
      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.result).toEqual(mockResult);

      // Reset
      act(() => {
        result.current.reset();
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.result).toBeNull();
    });

    it('should allow new submission after reset', async () => {
      vi.mocked(apiClient.post).mockResolvedValue({ data: mockResult });

      const { result } = renderHook(() => useExerciseSubmission());

      // First submission
      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      // Reset
      act(() => {
        result.current.reset();
      });

      // Second submission
      await act(async () => {
        await result.current.submitExercise(mockSubmission);
      });

      expect(result.current.result).toEqual(mockResult);
      expect(apiClient.post).toHaveBeenCalledTimes(2);
    });
  });
});
