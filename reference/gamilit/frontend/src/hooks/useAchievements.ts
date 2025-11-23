/**
 * useAchievements Hook
 *
 * ISSUE: #5 (P0) - Achievements Auto-Detection
 * FECHA: 2025-11-04
 * SPRINT: Sprint 3
 *
 * Hook para detección automática y desbloqueo de logros
 *
 * Resuelve: 95% de achievements no se desbloquean
 *
 * Features:
 * - Auto-detection de condiciones cumplidas
 * - Queue de logros desbloqueados
 * - Notificaciones automáticas
 * - Sincronización con backend
 * - Tracking de progreso hacia logros
 */

import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/lib/api/client';
import type { Achievement } from '@/components/achievements/AchievementNotification';

interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  ml_coins_reward: number;
  condition: AchievementCondition;
}

interface AchievementCondition {
  type:
    | 'exercises_completed'
    | 'streak_days'
    | 'xp_total'
    | 'ml_coins_total'
    | 'perfect_score'
    | 'module_completed'
    | 'login_days'
    | 'friend_count'
    | 'achievement_count';
  value: number;
  operator?: '>=' | '>' | '=' | '<' | '<=';
}

interface UserProgress {
  exercises_completed: number;
  current_streak: number;
  xp_total: number;
  ml_coins_total: number;
  perfect_scores: number;
  modules_completed: number;
  login_days: number;
  friend_count: number;
  achievements_unlocked: number;
}

interface UseAchievementsOptions {
  userId: string;
  autoCheck?: boolean;
  checkInterval?: number;
  onAchievementUnlocked?: (achievement: Achievement) => void;
}

// Achievement definitions
const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  // Ejercicios completados
  {
    id: 'first_steps',
    title: 'Primeros Pasos',
    description: 'Completa tu primer ejercicio',
    icon: '👣',
    rarity: 'common',
    xp_reward: 10,
    ml_coins_reward: 5,
    condition: { type: 'exercises_completed', value: 1, operator: '>=' },
  },
  {
    id: 'beginner',
    title: 'Principiante',
    description: 'Completa 10 ejercicios',
    icon: '🌱',
    rarity: 'common',
    xp_reward: 50,
    ml_coins_reward: 20,
    condition: { type: 'exercises_completed', value: 10, operator: '>=' },
  },
  {
    id: 'explorer',
    title: 'Explorador',
    description: 'Completa 50 ejercicios',
    icon: '🧭',
    rarity: 'rare',
    xp_reward: 200,
    ml_coins_reward: 50,
    condition: { type: 'exercises_completed', value: 50, operator: '>=' },
  },
  {
    id: 'master',
    title: 'Maestro',
    description: 'Completa 100 ejercicios',
    icon: '🎓',
    rarity: 'epic',
    xp_reward: 500,
    ml_coins_reward: 100,
    condition: { type: 'exercises_completed', value: 100, operator: '>=' },
  },

  // Racha (Streak)
  {
    id: 'dedicated',
    title: 'Dedicado',
    description: 'Mantén una racha de 7 días',
    icon: '🔥',
    rarity: 'rare',
    xp_reward: 100,
    ml_coins_reward: 30,
    condition: { type: 'streak_days', value: 7, operator: '>=' },
  },
  {
    id: 'unstoppable',
    title: 'Imparable',
    description: 'Mantén una racha de 30 días',
    icon: '⚡',
    rarity: 'epic',
    xp_reward: 500,
    ml_coins_reward: 150,
    condition: { type: 'streak_days', value: 30, operator: '>=' },
  },
  {
    id: 'legend',
    title: 'Leyenda',
    description: 'Mantén una racha de 100 días',
    icon: '👑',
    rarity: 'legendary',
    xp_reward: 2000,
    ml_coins_reward: 500,
    condition: { type: 'streak_days', value: 100, operator: '>=' },
  },

  // XP Total
  {
    id: 'rising_star',
    title: 'Estrella Emergente',
    description: 'Alcanza 1,000 XP',
    icon: '⭐',
    rarity: 'common',
    xp_reward: 50,
    ml_coins_reward: 20,
    condition: { type: 'xp_total', value: 1000, operator: '>=' },
  },
  {
    id: 'xp_champion',
    title: 'Campeón de XP',
    description: 'Alcanza 10,000 XP',
    icon: '🏆',
    rarity: 'epic',
    xp_reward: 500,
    ml_coins_reward: 200,
    condition: { type: 'xp_total', value: 10000, operator: '>=' },
  },

  // Puntuaciones perfectas
  {
    id: 'perfectionist',
    title: 'Perfeccionista',
    description: 'Obtén 10 puntuaciones perfectas (100%)',
    icon: '💯',
    rarity: 'rare',
    xp_reward: 150,
    ml_coins_reward: 50,
    condition: { type: 'perfect_score', value: 10, operator: '>=' },
  },

  // Módulos completados
  {
    id: 'module_master',
    title: 'Maestro de Módulos',
    description: 'Completa tu primer módulo',
    icon: '📚',
    rarity: 'rare',
    xp_reward: 200,
    ml_coins_reward: 75,
    condition: { type: 'module_completed', value: 1, operator: '>=' },
  },
  {
    id: 'knowledge_seeker',
    title: 'Buscador de Conocimiento',
    description: 'Completa 5 módulos',
    icon: '🔍',
    rarity: 'epic',
    xp_reward: 1000,
    ml_coins_reward: 300,
    condition: { type: 'module_completed', value: 5, operator: '>=' },
  },

  // Amigos
  {
    id: 'social_butterfly',
    title: 'Mariposa Social',
    description: 'Agrega 10 amigos',
    icon: '🦋',
    rarity: 'rare',
    xp_reward: 100,
    ml_coins_reward: 40,
    condition: { type: 'friend_count', value: 10, operator: '>=' },
  },
];

export const useAchievements = (options: UseAchievementsOptions) => {
  const { userId, autoCheck = true, checkInterval = 30000, onAchievementUnlocked } = options;

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Set<string>>(new Set());
  const [pendingNotifications, setPendingNotifications] = useState<Achievement[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  // Fetch user progress and unlocked achievements
  const fetchProgress = useCallback(async () => {
    try {
      // Fetch user stats
      const { data: stats } = await apiClient.get(`/gamification/users/${userId}/stats`);

      // Fetch unlocked achievements
      const { data: achievements } = await apiClient.get(`/gamification/users/${userId}/achievements`);

      const progress: UserProgress = {
        exercises_completed: stats.exercises_completed || 0,
        current_streak: stats.current_streak || 0,
        xp_total: stats.xp_total || 0,
        ml_coins_total: stats.ml_coins || 0,
        perfect_scores: stats.perfect_scores || 0,
        modules_completed: stats.modules_completed || 0,
        login_days: stats.login_days || 0,
        friend_count: stats.friend_count || 0,
        achievements_unlocked: achievements.filter((a: any) => a.isUnlocked).length,
      };

      setUserProgress(progress);

      // Store already unlocked achievement IDs
      const unlocked = new Set(
        achievements.filter((a: any) => a.isUnlocked).map((a: any) => a.achievement_id)
      );
      setUnlockedAchievements(unlocked);
    } catch (error) {
      console.error('Failed to fetch user progress:', error);
    }
  }, [userId]);

  // Check if condition is met
  const checkCondition = (condition: AchievementCondition, progress: UserProgress): boolean => {
    const operator = condition.operator || '>=';
    let currentValue = 0;

    switch (condition.type) {
      case 'exercises_completed':
        currentValue = progress.exercises_completed;
        break;
      case 'streak_days':
        currentValue = progress.current_streak;
        break;
      case 'xp_total':
        currentValue = progress.xp_total;
        break;
      case 'ml_coins_total':
        currentValue = progress.ml_coins_total;
        break;
      case 'perfect_score':
        currentValue = progress.perfect_scores;
        break;
      case 'module_completed':
        currentValue = progress.modules_completed;
        break;
      case 'login_days':
        currentValue = progress.login_days;
        break;
      case 'friend_count':
        currentValue = progress.friend_count;
        break;
      case 'achievement_count':
        currentValue = progress.achievements_unlocked;
        break;
      default:
        return false;
    }

    switch (operator) {
      case '>=':
        return currentValue >= condition.value;
      case '>':
        return currentValue > condition.value;
      case '=':
        return currentValue === condition.value;
      case '<':
        return currentValue < condition.value;
      case '<=':
        return currentValue <= condition.value;
      default:
        return false;
    }
  };

  // Check and unlock achievements
  const checkAchievements = useCallback(async () => {
    if (!userProgress || isChecking) return;

    setIsChecking(true);

    try {
      const newlyUnlocked: Achievement[] = [];

      for (const definition of ACHIEVEMENT_DEFINITIONS) {
        // Skip if already unlocked
        if (unlockedAchievements.has(definition.id)) continue;

        // Check if condition is met
        if (checkCondition(definition.condition, userProgress)) {
          // Unlock achievement via API
          try {
            await apiClient.post(`/gamification/users/${userId}/achievements/${definition.id}/unlock`);

            // Add to unlocked set
            setUnlockedAchievements((prev) => new Set([...prev, definition.id]));

            // Add to notifications queue
            const achievement: Achievement = {
              id: definition.id,
              title: definition.title,
              description: definition.description,
              icon: definition.icon,
              rarity: definition.rarity,
              xp_reward: definition.xp_reward,
              ml_coins_reward: definition.ml_coins_reward,
            };

            newlyUnlocked.push(achievement);

            // Trigger callback
            onAchievementUnlocked?.(achievement);
          } catch (error) {
            console.error(`Failed to unlock achievement ${definition.id}:`, error);
          }
        }
      }

      if (newlyUnlocked.length > 0) {
        setPendingNotifications((prev) => [...prev, ...newlyUnlocked]);
      }
    } finally {
      setIsChecking(false);
    }
  }, [userProgress, unlockedAchievements, userId, onAchievementUnlocked, isChecking]);

  // Manual check trigger
  const checkNow = useCallback(async () => {
    await fetchProgress();
    await checkAchievements();
  }, [fetchProgress, checkAchievements]);

  // Clear pending notifications
  const clearNotifications = useCallback(() => {
    setPendingNotifications([]);
  }, []);

  // Get progress towards an achievement
  const getProgress = useCallback(
    (achievementId: string): number => {
      if (!userProgress) return 0;

      const definition = ACHIEVEMENT_DEFINITIONS.find((d) => d.id === achievementId);
      if (!definition) return 0;

      const condition = definition.condition;
      let currentValue = 0;

      switch (condition.type) {
        case 'exercises_completed':
          currentValue = userProgress.exercises_completed;
          break;
        case 'streak_days':
          currentValue = userProgress.current_streak;
          break;
        case 'xp_total':
          currentValue = userProgress.xp_total;
          break;
        case 'ml_coins_total':
          currentValue = userProgress.ml_coins_total;
          break;
        case 'perfect_score':
          currentValue = userProgress.perfect_scores;
          break;
        case 'module_completed':
          currentValue = userProgress.modules_completed;
          break;
        case 'login_days':
          currentValue = userProgress.login_days;
          break;
        case 'friend_count':
          currentValue = userProgress.friend_count;
          break;
        default:
          return 0;
      }

      return Math.min(100, Math.round((currentValue / condition.value) * 100));
    },
    [userProgress]
  );

  // Initial fetch
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  // Auto-check interval
  useEffect(() => {
    if (!autoCheck) return;

    checkAchievements();

    const interval = setInterval(() => {
      fetchProgress();
      checkAchievements();
    }, checkInterval);

    return () => clearInterval(interval);
  }, [autoCheck, checkInterval, fetchProgress, checkAchievements]);

  return {
    userProgress,
    unlockedAchievements: Array.from(unlockedAchievements),
    pendingNotifications,
    isChecking,
    checkNow,
    clearNotifications,
    getProgress,
    definitions: ACHIEVEMENT_DEFINITIONS,
  };
};
