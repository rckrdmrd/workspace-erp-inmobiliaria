/**
 * useModules Hook
 * Custom hook for fetching module and exercise data from the API
 */

import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api';

interface Module {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  estimated_duration_minutes: number;
  xp_reward: number;
  ml_coins_reward: number;
  total_exercises?: number;
  completed_exercises?: number;
  progress?: number;
  completed?: boolean;
  [key: string]: any;
}

interface Exercise {
  id: string;
  module_id: string;
  title: string;
  description: string;
  exercise_type: string;
  difficulty_level: string;
  max_points: number;
  xp_reward: number;
  ml_coins_reward: number;
  order_index: number;
  completed?: boolean;
  [key: string]: any;
}

interface UseModuleDetailReturn {
  module: Module | null;
  exercises: Exercise[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a specific module and its exercises
 * @param moduleId - The ID of the module to fetch
 * @returns Object containing module, exercises, loading state, and error
 */
export function useModuleDetail(moduleId: string): UseModuleDetailReturn {
  const [module, setModule] = useState<Module | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moduleId) {
      setLoading(false);
      return;
    }

    const fetchModuleDetail = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('auth-token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Fetch module details
        const moduleResponse = await fetch(
          `${API_BASE_URL}/educational/modules/${moduleId}`,
          { headers }
        );

        if (!moduleResponse.ok) {
          throw new Error(`Failed to fetch module: ${moduleResponse.statusText}`);
        }

        const moduleData = await moduleResponse.json();
        setModule(moduleData);

        // Fetch all exercises (with completed field)
        const exercisesResponse = await fetch(
          `${API_BASE_URL}/educational/exercises`,
          { headers }
        );

        if (!exercisesResponse.ok) {
          throw new Error(`Failed to fetch exercises: ${exercisesResponse.statusText}`);
        }

        const allExercises = await exercisesResponse.json();

        // Filter exercises for this module and sort by order_index
        const moduleExercises = allExercises
          .filter((ex: Exercise) => ex.module_id === moduleId)
          .sort((a: Exercise, b: Exercise) => a.order_index - b.order_index);

        setExercises(moduleExercises);
      } catch (err) {
        console.error('Error fetching module detail:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchModuleDetail();
  }, [moduleId]);

  return {
    module,
    exercises,
    loading,
    error,
  };
}
