/**
 * useUserModules Hook
 *
 * Custom hook for fetching user-specific modules data with progress
 * from the educational API.
 */

import { useState, useEffect, useCallback } from 'react';
import { getUserModules } from '@/services/api/educationalAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { Module } from '@shared/types';

export interface UserModuleData {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'in_progress' | 'available' | 'locked' | 'backlog';
  progress: number; // 0-100
  totalExercises: number;
  completedExercises: number;
  estimatedTime: number; // minutos
  xpReward: number;
  icon: string;
  category: string;
  mlCoinsReward?: number;
}

interface UseUserModulesReturn {
  modules: UserModuleData[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  isRefreshing: boolean;
}

/**
 * Hook to fetch user-specific modules with progress
 */
export function useUserModules(): UseUserModulesReturn {
  const { user, isAuthenticated } = useAuth();
  const [modules, setModules] = useState<UserModuleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUserModules = useCallback(async (isRefresh = false) => {
    console.log('🔍 [useUserModules] fetchUserModules called', {
      isRefresh,
      isAuthenticated,
      userId: user?.id,
      userEmail: user?.email,
    });

    // Don't fetch if no user is authenticated
    if (!isAuthenticated || !user?.id) {
      console.warn('⚠️ [useUserModules] No user authenticated, skipping fetch');
      setLoading(false);
      return;
    }

    console.log('✅ [useUserModules] User authenticated, fetching modules for userId:', user.id);

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      console.log('📡 [useUserModules] Calling getUserModules API...');
      const data = await getUserModules(user.id);
      console.log('✅ [useUserModules] API response received:', {
        modulesCount: data.length,
        firstModule: data[0],
      });

      // Helper function to map backend difficulty to frontend difficulty
      const mapDifficulty = (backendDifficulty: string): 'easy' | 'medium' | 'hard' => {
        const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
          'beginner': 'easy',
          'intermediate': 'medium',
          'advanced': 'hard',
          'easy': 'easy',
          'medium': 'medium',
          'hard': 'hard',
        };
        return difficultyMap[backendDifficulty] || 'medium';
      };

      // Transform the data to match the expected UserModuleData interface
      const transformedData: UserModuleData[] = data.map((module: any) => ({
        id: module.id,
        title: module.title,
        description: module.description,
        difficulty: mapDifficulty(module.difficulty || 'medium'),
        status: module.status || 'available',
        progress: module.progress || 0,
        totalExercises: module.totalExercises || 0,
        completedExercises: module.completedExercises || 0,
        estimatedTime: module.estimatedTime || 60,
        xpReward: module.xpReward || 100,
        icon: module.icon || '📚',
        category: Array.isArray(module.category) ? module.category.join(', ') : (module.category || 'science'),
        mlCoinsReward: module.mlCoinsReward || 50,
      }));

      console.log('✅ [useUserModules] Data transformed, setting modules:', transformedData.length);
      setModules(transformedData);
    } catch (err) {
      console.error('❌ [useUserModules] Error fetching user modules:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user modules'));
      // Set empty array on error instead of using mock data
      setModules([]);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
      console.log('🏁 [useUserModules] Fetch completed');
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchUserModules();
  }, [fetchUserModules]);

  const refresh = useCallback(() => {
    return fetchUserModules(true);
  }, [fetchUserModules]);

  return {
    modules,
    loading,
    error,
    refresh,
    isRefreshing,
  };
}
