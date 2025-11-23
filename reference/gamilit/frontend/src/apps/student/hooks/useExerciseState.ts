/**
 * useExerciseState Hook
 * Manages all exercise state including submissions, time tracking, and localStorage persistence
 */

import { useState, useEffect, useCallback, useRef } from 'react';

export interface Exercise {
  id: string;
  module_id: string;
  mechanic_type: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'experto';
  xp_reward: number;
  ml_coins_reward: number;
  time_limit?: number;
  max_attempts: number;
  data: Record<string, any>;
}

export interface ExerciseAttempt {
  id: string;
  score: number;
  completed: boolean;
  time_spent: number;
  hints_used: number;
  powerups_used: string[];
  submitted_at: Date;
  answers?: any;
}

export interface ExerciseState {
  currentAttempt: number;
  score: number;
  timeElapsed: number;
  hintsUsed: number;
  powerupsActive: string[];
  answers: any;
  isCompleted: boolean;
  attempts: ExerciseAttempt[];
}

interface UseExerciseStateProps {
  exerciseId: string;
  onSubmit?: (attempt: ExerciseAttempt) => void;
  onComplete?: (attempt: ExerciseAttempt) => void;
  autoSave?: boolean;
}

export const useExerciseState = ({
  exerciseId,
  onSubmit,
  onComplete,
  autoSave = true,
}: UseExerciseStateProps) => {
  // State
  const [state, setState] = useState<ExerciseState>({
    currentAttempt: 1,
    score: 0,
    timeElapsed: 0,
    hintsUsed: 0,
    powerupsActive: [],
    answers: {},
    isCompleted: false,
    attempts: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Refs for timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Storage key
  const storageKey = `exercise_${exerciseId}_state`;

  // Load state from localStorage on mount
  useEffect(() => {
    const loadState = () => {
      try {
        const savedState = localStorage.getItem(storageKey);
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setState({
            ...parsed,
            attempts: parsed.attempts.map((a: any) => ({
              ...a,
              submitted_at: new Date(a.submitted_at),
            })),
          });
          startTimeRef.current = new Date(parsed.lastSavedAt || Date.now());
        }
      } catch (error) {
        console.error('Error loading exercise state:', error);
      }
    };

    loadState();
  }, [exerciseId, storageKey]);

  // Start timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setState((prev) => ({
        ...prev,
        timeElapsed: prev.timeElapsed + 1,
      }));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    if (!autoSave || !hasUnsavedChanges) return;

    const autoSaveInterval = setInterval(() => {
      saveToLocalStorage();
    }, 30000); // Save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [autoSave, hasUnsavedChanges, state]);

  // Save to localStorage
  const saveToLocalStorage = useCallback(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...state,
          lastSavedAt: new Date().toISOString(),
        })
      );
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [state, storageKey]);

  // Update answers
  const updateAnswers = useCallback((answers: any) => {
    setState((prev) => ({
      ...prev,
      answers,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Update score
  const updateScore = useCallback((score: number) => {
    setState((prev) => ({
      ...prev,
      score,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Use hint
  const useHint = useCallback(() => {
    setState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Activate power-up
  const activatePowerUp = useCallback((powerUpId: string) => {
    setState((prev) => ({
      ...prev,
      powerupsActive: [...prev.powerupsActive, powerUpId],
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Deactivate power-up
  const deactivatePowerUp = useCallback((powerUpId: string) => {
    setState((prev) => ({
      ...prev,
      powerupsActive: prev.powerupsActive.filter((id) => id !== powerUpId),
    }));
  }, []);

  // Pause timer
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Resume timer
  const resumeTimer = useCallback(() => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setState((prev) => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1,
        }));
      }, 1000);
    }
  }, []);

  // Submit attempt
  const submitAttempt = useCallback(
    async (answers: any, score: number) => {
      setIsSubmitting(true);

      try {
        const attempt: ExerciseAttempt = {
          id: `attempt_${Date.now()}`,
          score,
          completed: true,
          time_spent: state.timeElapsed,
          hints_used: state.hintsUsed,
          powerups_used: state.powerupsActive,
          submitted_at: new Date(),
          answers,
        };

        setState((prev) => ({
          ...prev,
          attempts: [...prev.attempts, attempt],
          currentAttempt: prev.currentAttempt + 1,
          isCompleted: true,
        }));

        // Save to localStorage
        saveToLocalStorage();

        // Call callbacks
        if (onSubmit) {
          onSubmit(attempt);
        }

        if (onComplete) {
          onComplete(attempt);
        }

        return attempt;
      } catch (error) {
        console.error('Error submitting attempt:', error);
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [state, onSubmit, onComplete, saveToLocalStorage]
  );

  // Reset exercise
  const resetExercise = useCallback(() => {
    setState({
      currentAttempt: state.currentAttempt + 1,
      score: 0,
      timeElapsed: 0,
      hintsUsed: 0,
      powerupsActive: [],
      answers: {},
      isCompleted: false,
      attempts: state.attempts,
    });
    startTimeRef.current = new Date();
    setHasUnsavedChanges(true);
  }, [state.attempts, state.currentAttempt]);

  // Clear state (completely reset)
  const clearState = useCallback(() => {
    localStorage.removeItem(storageKey);
    setState({
      currentAttempt: 1,
      score: 0,
      timeElapsed: 0,
      hintsUsed: 0,
      powerupsActive: [],
      answers: {},
      isCompleted: false,
      attempts: [],
    });
    startTimeRef.current = new Date();
    setHasUnsavedChanges(false);
  }, [storageKey]);

  return {
    // State
    state,
    isSubmitting,
    hasUnsavedChanges,

    // Actions
    updateAnswers,
    updateScore,
    useHint,
    activatePowerUp,
    deactivatePowerUp,
    pauseTimer,
    resumeTimer,
    submitAttempt,
    resetExercise,
    clearState,
    saveToLocalStorage,

    // Computed values
    bestScore: Math.max(0, ...state.attempts.map((a) => a.score)),
    averageScore:
      state.attempts.length > 0
        ? state.attempts.reduce((sum, a) => sum + a.score, 0) / state.attempts.length
        : 0,
    totalTimeSpent: state.attempts.reduce((sum, a) => sum + a.time_spent, 0) + state.timeElapsed,
  };
};
