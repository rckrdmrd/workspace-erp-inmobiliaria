/**
 * Maya Ranks & Progression System - Zustand Store
 *
 * Global state management for user rank progression, multipliers, and prestige.
 * Uses Zustand with persistence middleware.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  UserRankProgress,
  MayaRank,
  MultiplierBreakdown,
  MultiplierSource,
  ProgressionHistoryEntry,
  RankUpEvent,
  XPEvent,
  PrestigeProgress,
  XPSource,
} from '../types/ranksTypes';
import {
  MAYA_RANKS,
  MOCK_USER_NACOM,
  getNextRank,
  calculateXPForLevel,
  getPrestigeBonusByLevel,
  calculateTotalMultiplier,
} from '../mockData/ranksMockData';
import { getCurrentRank } from '../api/ranksAPI';

// ============================================================================
// STORE STATE INTERFACE
// ============================================================================

interface RanksState {
  // Core progression state
  userProgress: UserRankProgress;
  prestigeProgress: PrestigeProgress;
  multiplierBreakdown: MultiplierBreakdown;
  progressionHistory: ProgressionHistoryEntry[];
  xpEvents: XPEvent[];

  // UI state
  isRankingUp: boolean;
  showRankUpModal: boolean;
  showPrestigeModal: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions - XP & Progression
  addXP: (amount: number, source: XPSource, description?: string) => Promise<void>;
  checkLevelUp: () => boolean;
  checkRankUp: () => boolean;
  levelUp: () => void;
  rankUp: () => void;

  // Actions - Prestige
  canPrestige: () => boolean;
  prestige: () => Promise<void>;
  openPrestigeModal: () => void;
  closePrestigeModal: () => void;

  // Actions - Multipliers
  updateMultipliers: () => void;
  addMultiplierSource: (source: MultiplierSource) => void;
  removeMultiplierSource: (type: string) => void;
  getActiveMultipliers: () => MultiplierSource[];

  // Actions - UI
  closeRankUpModal: () => void;
  resetProgress: () => void;

  // Actions - History
  addHistoryEntry: (entry: ProgressionHistoryEntry) => void;
  getRecentHistory: (limit: number) => ProgressionHistoryEntry[];

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Sync actions
  fetchUserProgress: () => Promise<void>;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialPrestigeProgress: PrestigeProgress = {
  level: 0,
  totalPrestiges: 0,
  totalXPAllTime: 0,
  totalMLCoinsAllTime: 0,
  lastPrestigeDate: null,
  activeBonuses: [],
  cumulativeMultiplier: 1.0,
};

const initialMultiplierBreakdown: MultiplierBreakdown = {
  base: 1.0,
  rank: {
    type: 'rank',
    name: 'Nacom',
    value: 1.0,
    isPermanent: true,
    description: 'Multiplicador base del rango',
  },
  sources: [],
  total: 1.0,
  hasExpiringSoon: false,
  expiringSoon: [],
};

// ============================================================================
// ZUSTAND STORE
// ============================================================================

export const useRanksStore = create<RanksState>()(
  persist(
    (set, get) => ({
      // Initial state
      userProgress: MOCK_USER_NACOM,
      prestigeProgress: initialPrestigeProgress,
      multiplierBreakdown: initialMultiplierBreakdown,
      progressionHistory: [],
      xpEvents: [],
      isRankingUp: false,
      showRankUpModal: false,
      showPrestigeModal: false,
      isLoading: false,
      error: null,

      // ========================================================================
      // XP & PROGRESSION ACTIONS
      // ========================================================================

      /**
       * Add XP to user and check for level/rank ups
       */
      addXP: async (amount: number, source: XPSource, description?: string) => {
        const state = get();
        const currentProgress = state.userProgress;

        // Create XP event
        const xpEvent: XPEvent = {
          id: crypto.randomUUID(),
          amount,
          source,
          timestamp: new Date(),
          description,
        };

        // Calculate new XP
        const newCurrentXP = currentProgress.currentXP + amount;
        const newTotalXP = currentProgress.totalXP + amount;

        // Update state
        set({
          userProgress: {
            ...currentProgress,
            currentXP: newCurrentXP,
            totalXP: newTotalXP,
            lastActivityDate: new Date(),
          },
          xpEvents: [...state.xpEvents, xpEvent],
        });

        // Check for level up
        if (get().checkLevelUp()) {
          get().levelUp();
        }

        // Check for rank up
        if (get().checkRankUp()) {
          get().rankUp();
        }

        // Update multipliers (streak might have changed)
        get().updateMultipliers();
      },

      /**
       * Check if user should level up
       */
      checkLevelUp: () => {
        const { currentXP, xpToNextLevel } = get().userProgress;
        return currentXP >= xpToNextLevel;
      },

      /**
       * Check if user can rank up
       */
      checkRankUp: () => {
        const { currentRank, mlCoinsEarned } = get().userProgress;
        const nextRank = getNextRank(currentRank);
        if (!nextRank) return false;
        return mlCoinsEarned >= nextRank.mlCoinsRequired;
      },

      /**
       * Level up the user
       */
      levelUp: () => {
        const state = get();
        const currentProgress = state.userProgress;
        const newLevel = currentProgress.currentLevel + 1;
        const xpForNextLevel = calculateXPForLevel(newLevel);
        const remainingXP = currentProgress.currentXP - currentProgress.xpToNextLevel;

        // Add history entry
        const historyEntry: ProgressionHistoryEntry = {
          id: crypto.randomUUID(),
          type: 'level_up',
          timestamp: new Date(),
          title: `Nivel ${newLevel} alcanzado`,
          description: `Has subido al nivel ${newLevel}. ¡Sigue así!`,
          rank: currentProgress.currentRank,
          xpSnapshot: currentProgress.totalXP,
          levelSnapshot: newLevel,
          multiplierSnapshot: currentProgress.multiplier,
        };

        set({
          userProgress: {
            ...currentProgress,
            currentLevel: newLevel,
            currentXP: Math.max(0, remainingXP),
            xpToNextLevel: xpForNextLevel,
          },
          progressionHistory: [...state.progressionHistory, historyEntry],
        });

        // Check for another level up (in case of large XP gain)
        if (get().checkLevelUp()) {
          get().levelUp();
        }
      },

      /**
       * Rank up the user
       */
      rankUp: () => {
        const state = get();
        const currentProgress = state.userProgress;
        const nextRank = getNextRank(currentProgress.currentRank);

        if (!nextRank) return;

        const newMultiplier = nextRank.multiplier;

        // Create rank up event
        const rankUpEvent: RankUpEvent = {
          fromRank: currentProgress.currentRank,
          toRank: nextRank.id,
          timestamp: new Date(),
          newBenefits: nextRank.benefits,
          newMultiplier,
          isPrestige: false,
        };

        // Add history entry
        const historyEntry: ProgressionHistoryEntry = {
          id: crypto.randomUUID(),
          type: 'rank_up',
          timestamp: new Date(),
          title: `Ascendido a ${nextRank.nameSpanish}`,
          description: `¡Has alcanzado el rango ${nextRank.name}! Nuevos beneficios desbloqueados.`,
          rank: nextRank.id,
          xpSnapshot: currentProgress.totalXP,
          levelSnapshot: currentProgress.currentLevel,
          multiplierSnapshot: newMultiplier,
        };

        set({
          userProgress: {
            ...currentProgress,
            currentRank: nextRank.id,
            multiplier: newMultiplier,
            lastRankUp: new Date(),
            canRankUp: false,
            nextRank: getNextRank(nextRank.id)?.id || null,
            canPrestige: nextRank.id === "K'uk'ulkan",
          },
          progressionHistory: [...state.progressionHistory, historyEntry],
          showRankUpModal: true,
          isRankingUp: true,
        });

        // Update multipliers
        get().updateMultipliers();
      },

      // ========================================================================
      // PRESTIGE ACTIONS
      // ========================================================================

      /**
       * Check if user can prestige
       */
      canPrestige: () => {
        const { currentRank, currentLevel } = get().userProgress;
        return currentRank === "K'uk'ulkan" && currentLevel >= 50;
      },

      /**
       * Prestige the user (reset to NACOM with bonuses)
       */
      prestige: async () => {
        const state = get();
        if (!get().canPrestige()) return;

        const currentProgress = state.userProgress;
        const currentPrestige = state.prestigeProgress;
        const newPrestigeLevel = currentPrestige.level + 1;
        const prestigeBonus = getPrestigeBonusByLevel(newPrestigeLevel);

        if (!prestigeBonus) return;

        // Calculate new cumulative multiplier
        const newCumulativeMultiplier =
          currentPrestige.cumulativeMultiplier + prestigeBonus.bonusMultiplier;

        // Reset to NACOM with prestige bonuses
        const prestigedProgress: UserRankProgress = {
          currentRank: 'Nacom',
          currentLevel: 1,
          currentXP: 0,
          xpToNextLevel: calculateXPForLevel(1),
          totalXP: currentProgress.totalXP, // Keep total XP
          mlCoinsEarned: 0, // Reset ML Coins for progression
          prestigeLevel: newPrestigeLevel,
          multiplier: 1.0 + prestigeBonus.bonusMultiplier,
          lastRankUp: new Date(),
          activityStreak: currentProgress.activityStreak, // Keep streak
          lastActivityDate: new Date(),
          canRankUp: false,
          nextRank: 'Ajaw',
          canPrestige: false,
        };

        // Update prestige progress
        const updatedPrestigeProgress: PrestigeProgress = {
          level: newPrestigeLevel,
          totalPrestiges: currentPrestige.totalPrestiges + 1,
          totalXPAllTime: currentProgress.totalXP,
          totalMLCoinsAllTime: currentProgress.mlCoinsEarned,
          lastPrestigeDate: new Date(),
          activeBonuses: [...currentPrestige.activeBonuses, prestigeBonus],
          cumulativeMultiplier: newCumulativeMultiplier,
        };

        // Add history entry
        const historyEntry: ProgressionHistoryEntry = {
          id: crypto.randomUUID(),
          type: 'prestige',
          timestamp: new Date(),
          title: `Prestige Nivel ${newPrestigeLevel}`,
          description: `¡Has prestigiado! Ahora tienes un multiplicador permanente de +${(prestigeBonus.bonusMultiplier * 100).toFixed(0)}%.`,
          rank: 'Nacom',
          xpSnapshot: currentProgress.totalXP,
          levelSnapshot: 1,
          multiplierSnapshot: 1.0 + prestigeBonus.bonusMultiplier,
        };

        set({
          userProgress: prestigedProgress,
          prestigeProgress: updatedPrestigeProgress,
          progressionHistory: [...state.progressionHistory, historyEntry],
          showPrestigeModal: false,
        });

        // Update multipliers
        get().updateMultipliers();
      },

      openPrestigeModal: () => set({ showPrestigeModal: true }),
      closePrestigeModal: () => set({ showPrestigeModal: false }),

      // ========================================================================
      // MULTIPLIER ACTIONS
      // ========================================================================

      /**
       * Update multiplier breakdown from all sources
       */
      updateMultipliers: () => {
        const state = get();
        const currentProgress = state.userProgress;
        const prestigeProgress = state.prestigeProgress;

        // Base rank multiplier
        const rankSource: MultiplierSource = {
          type: 'rank',
          name: `Rango ${MAYA_RANKS[currentProgress.currentRank].nameSpanish}`,
          value: MAYA_RANKS[currentProgress.currentRank].multiplier,
          isPermanent: true,
          description: 'Multiplicador base del rango actual',
        };

        const sources: MultiplierSource[] = [rankSource];

        // Add prestige multiplier if applicable
        if (prestigeProgress.level > 0) {
          sources.push({
            type: 'prestige',
            name: `Prestige Nivel ${prestigeProgress.level}`,
            value: 1.0 + prestigeProgress.cumulativeMultiplier,
            isPermanent: true,
            description: 'Bonus permanente por prestigio',
          });
        }

        // Add streak multiplier if applicable
        if (currentProgress.activityStreak >= 7) {
          const streakBonus = Math.min(0.5, currentProgress.activityStreak * 0.01);
          sources.push({
            type: 'streak',
            name: `Racha de ${currentProgress.activityStreak} días`,
            value: 1.0 + streakBonus,
            isPermanent: false,
            description: 'Bonus por actividad constante',
          });
        }

        // Add any additional sources from state
        const additionalSources = state.multiplierBreakdown.sources.filter(
          s => s.type !== 'rank' && s.type !== 'prestige' && s.type !== 'streak'
        );
        sources.push(...additionalSources);

        // Filter out expired multipliers
        const activeSources = sources.filter(s => {
          if (!s.expiresAt) return true;
          return new Date(s.expiresAt) > new Date();
        });

        // Calculate total
        const total = calculateTotalMultiplier(activeSources);

        // Find expiring soon (within 24 hours)
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        const expiringSoon = activeSources.filter(s => {
          if (!s.expiresAt) return false;
          return new Date(s.expiresAt) <= tomorrow;
        });

        set({
          multiplierBreakdown: {
            base: 1.0,
            rank: rankSource,
            sources: activeSources,
            total,
            hasExpiringSoon: expiringSoon.length > 0,
            expiringSoon,
          },
          userProgress: {
            ...currentProgress,
            multiplier: total,
          },
        });
      },

      /**
       * Add a new multiplier source
       */
      addMultiplierSource: (source: MultiplierSource) => {
        const state = get();
        const existingSources = state.multiplierBreakdown.sources.filter(
          s => s.type !== source.type || s.name !== source.name
        );

        set({
          multiplierBreakdown: {
            ...state.multiplierBreakdown,
            sources: [...existingSources, source],
          },
        });

        get().updateMultipliers();
      },

      /**
       * Remove a multiplier source by type
       */
      removeMultiplierSource: (type: string) => {
        const state = get();
        const filteredSources = state.multiplierBreakdown.sources.filter(
          s => s.type !== type
        );

        set({
          multiplierBreakdown: {
            ...state.multiplierBreakdown,
            sources: filteredSources,
          },
        });

        get().updateMultipliers();
      },

      /**
       * Get all active multipliers
       */
      getActiveMultipliers: () => {
        return get().multiplierBreakdown.sources;
      },

      // ========================================================================
      // UI ACTIONS
      // ========================================================================

      closeRankUpModal: () => {
        set({ showRankUpModal: false, isRankingUp: false });
      },

      resetProgress: () => {
        set({
          userProgress: MOCK_USER_NACOM,
          prestigeProgress: initialPrestigeProgress,
          multiplierBreakdown: initialMultiplierBreakdown,
          progressionHistory: [],
          xpEvents: [],
        });
      },

      // ========================================================================
      // HISTORY ACTIONS
      // ========================================================================

      addHistoryEntry: (entry: ProgressionHistoryEntry) => {
        const state = get();
        set({
          progressionHistory: [...state.progressionHistory, entry],
        });
      },

      getRecentHistory: (limit: number) => {
        const history = get().progressionHistory;
        return history
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .slice(0, limit);
      },

      // ========================================================================
      // UTILITY ACTIONS
      // ========================================================================

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // ========================================================================
      // API SYNC ACTIONS
      // ========================================================================

      /**
       * Fetch user progress from backend
       */
      fetchUserProgress: async () => {
        set({ isLoading: true, error: null });
        try {
          const userProgress = await getCurrentRank();
          set({
            userProgress,
            isLoading: false,
            error: null
          });
          // Update multipliers after fetching progress
          get().updateMultipliers();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user progress';
          set({
            isLoading: false,
            error: errorMessage
          });
          console.error('Error fetching user progress:', error);
        }
      },
    }),
    {
      name: 'ranks-storage',
      version: 1,
      // Serialize dates properly
      partialize: (state) => ({
        userProgress: state.userProgress,
        prestigeProgress: state.prestigeProgress,
        multiplierBreakdown: state.multiplierBreakdown,
        progressionHistory: state.progressionHistory,
        xpEvents: state.xpEvents,
      }),
    }
  )
);

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Select current user progress
 */
export const selectUserProgress = (state: RanksState) => state.userProgress;

/**
 * Select current rank
 */
export const selectCurrentRank = (state: RanksState) => state.userProgress.currentRank;

/**
 * Select multiplier breakdown
 */
export const selectMultiplierBreakdown = (state: RanksState) => state.multiplierBreakdown;

/**
 * Select prestige progress
 */
export const selectPrestigeProgress = (state: RanksState) => state.prestigeProgress;

/**
 * Select progression history
 */
export const selectProgressionHistory = (state: RanksState) => state.progressionHistory;

/**
 * Select if user can prestige
 */
export const selectCanPrestige = (state: RanksState) => state.userProgress.canPrestige;

/**
 * Select if user can rank up
 */
export const selectCanRankUp = (state: RanksState) => state.userProgress.canRankUp;
