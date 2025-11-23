/**
 * useExerciseTimer Hook
 *
 * ISSUE: #4 (P0) - Exercise Interfaces
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 *
 * Hook for managing exercise timer with optional time limit
 */

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseExerciseTimerOptions {
  timeLimitSeconds?: number;
  onTimeExpired?: () => void;
  autoStart?: boolean;
}

export const useExerciseTimer = (options?: UseExerciseTimerOptions) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(options?.autoStart ?? false);
  const startTimeRef = useRef<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now() - (elapsedSeconds * 1000);
      setIsRunning(true);
    }
  }, [isRunning, elapsedSeconds]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
    startTimeRef.current = Date.now();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    pause();
    return elapsedSeconds;
  }, [pause, elapsedSeconds]);

  // Update timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        setElapsedSeconds(elapsed);

        // Check time limit
        if (options?.timeLimitSeconds && elapsed >= options.timeLimitSeconds) {
          pause();
          options.onTimeExpired?.();
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, options, pause]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate remaining time
  const remainingSeconds = options?.timeLimitSeconds
    ? Math.max(0, options.timeLimitSeconds - elapsedSeconds)
    : null;

  const isTimeExpired = remainingSeconds !== null && remainingSeconds === 0;

  return {
    elapsedSeconds,
    remainingSeconds,
    isRunning,
    isTimeExpired,
    start,
    pause,
    reset,
    stop,
    formatTime,
    formattedElapsed: formatTime(elapsedSeconds),
    formattedRemaining: remainingSeconds !== null ? formatTime(remainingSeconds) : null,
  };
};
