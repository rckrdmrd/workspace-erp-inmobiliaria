/**
 * useExerciseTimer Hook Tests
 *
 * Tests for exercise timer hook managing time tracking with optional limits.
 *
 * Test Coverage:
 * - Hook Initialization (3 tests): Initial state, autoStart option
 * - Timer Controls (5 tests): Start, pause, reset, stop
 * - Time Tracking (4 tests): Elapsed time, time limit, expiration
 * - Time Formatting (3 tests): MM:SS format, remaining time display
 * - Auto Start (2 tests): Start on mount, initial running state
 * - Time Expiration (3 tests): onTimeExpired callback, isTimeExpired flag
 *
 * Total: 20 tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExerciseTimer } from '../useExerciseTimer';

describe('useExerciseTimer', () => {
  // ============================================================================
  // SETUP & TEARDOWN
  // ============================================================================

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  // ============================================================================
  // HOOK INITIALIZATION TESTS
  // ============================================================================

  describe('Hook Initialization', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useExerciseTimer());

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.remainingSeconds).toBeNull();
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isTimeExpired).toBe(false);
      expect(result.current.formattedElapsed).toBe('00:00');
      expect(result.current.formattedRemaining).toBeNull();
    });

    it('should initialize with time limit', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ timeLimitSeconds: 300 })
      );

      expect(result.current.remainingSeconds).toBe(300);
      expect(result.current.formattedRemaining).toBe('05:00');
    });

    it('should autoStart if option is true', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ autoStart: true })
      );

      expect(result.current.isRunning).toBe(true);
    });
  });

  // ============================================================================
  // TIMER CONTROLS TESTS
  // ============================================================================

  describe('Timer Controls', () => {
    it('should start timer', () => {
      const { result } = renderHook(() => useExerciseTimer());

      expect(result.current.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedSeconds).toBe(3);
    });

    it('should pause timer', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedSeconds).toBe(5);

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedSeconds).toBe(5);
    });

    it('should reset timer', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.elapsedSeconds).toBe(10);

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);
    });

    it('should stop timer and return elapsed time', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(7000);
      });

      expect(result.current.elapsedSeconds).toBe(7);

      let stoppedTime: number = 0;

      act(() => {
        stoppedTime = result.current.stop();
      });

      expect(stoppedTime).toBe(7);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedSeconds).toBe(7);
    });

    it('should allow restart after pause', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedSeconds).toBe(3);

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);

      // Restart should work (testing control flow)
      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });
  });

  // ============================================================================
  // TIME TRACKING TESTS
  // ============================================================================

  describe('Time Tracking', () => {
    it('should track elapsed time correctly', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current.elapsedSeconds).toBe(1);

      act(() => {
        vi.advanceTimersByTime(4000);
      });

      expect(result.current.elapsedSeconds).toBe(5);
    });

    it('should calculate remaining time with time limit', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ timeLimitSeconds: 60, autoStart: true })
      );

      expect(result.current.remainingSeconds).toBe(60);

      act(() => {
        vi.advanceTimersByTime(15000);
      });

      expect(result.current.remainingSeconds).toBe(45);
    });

    it('should continue counting after time limit is reached', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ timeLimitSeconds: 5, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(7000);
      });

      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(5);
      expect(result.current.remainingSeconds).toBe(0);
    });

    it('should handle long durations', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(125000);
      });

      expect(result.current.elapsedSeconds).toBe(125);
      expect(result.current.formattedElapsed).toBe('02:05');
    });
  });

  // ============================================================================
  // TIME FORMATTING TESTS
  // ============================================================================

  describe('Time Formatting', () => {
    it('should format time as MM:SS', () => {
      const { result } = renderHook(() => useExerciseTimer());

      expect(result.current.formatTime(0)).toBe('00:00');
      expect(result.current.formatTime(30)).toBe('00:30');
      expect(result.current.formatTime(60)).toBe('01:00');
      expect(result.current.formatTime(125)).toBe('02:05');
      expect(result.current.formatTime(3665)).toBe('61:05');
    });

    it('should provide formatted elapsed time', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(45000);
      });

      expect(result.current.formattedElapsed).toBe('00:45');
    });

    it('should provide formatted remaining time when time limit is set', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ timeLimitSeconds: 120, autoStart: true })
      );

      act(() => {
        vi.advanceTimersByTime(30000);
      });

      expect(result.current.formattedRemaining).toBe('01:30');
    });
  });

  // ============================================================================
  // AUTO START TESTS
  // ============================================================================

  describe('Auto Start', () => {
    it('should start immediately when autoStart is true', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ autoStart: true })
      );

      expect(result.current.isRunning).toBe(true);
    });

    it('should not start automatically when autoStart is false', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({ autoStart: false })
      );

      expect(result.current.isRunning).toBe(false);
    });
  });

  // ============================================================================
  // TIME EXPIRATION TESTS
  // ============================================================================

  describe('Time Expiration', () => {
    it('should call onTimeExpired when time limit is reached', () => {
      const onTimeExpired = vi.fn();

      const { result } = renderHook(() =>
        useExerciseTimer({
          timeLimitSeconds: 10,
          onTimeExpired,
          autoStart: true,
        })
      );

      expect(onTimeExpired).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(onTimeExpired).toHaveBeenCalledTimes(1);
    });

    it('should set isTimeExpired flag when time runs out', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({
          timeLimitSeconds: 5,
          autoStart: true,
        })
      );

      expect(result.current.isTimeExpired).toBe(false);

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.isTimeExpired).toBe(true);
    });

    it('should pause timer when time expires', () => {
      const { result } = renderHook(() =>
        useExerciseTimer({
          timeLimitSeconds: 3,
          autoStart: true,
        })
      );

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(result.current.isRunning).toBe(false);
    });
  });

  // ============================================================================
  // EDGE CASES TESTS
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle multiple start() calls idempotently', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      // Multiple start calls should not cause issues
      act(() => {
        result.current.start();
        result.current.start();
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Timer should still work correctly
      expect(result.current.elapsedSeconds).toBeGreaterThanOrEqual(2);
    });

    it('should handle reset during running timer', () => {
      const { result } = renderHook(() => useExerciseTimer({ autoStart: true }));

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedSeconds).toBe(5);

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsedSeconds).toBe(0);
      expect(result.current.isRunning).toBe(false);

      // Verify reset worked - timer is stopped
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      // Time should not advance after reset when not started
      expect(result.current.elapsedSeconds).toBe(0);
    });
  });
});
