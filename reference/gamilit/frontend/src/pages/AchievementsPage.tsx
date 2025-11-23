import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, AlertCircle, Loader } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { GamifiedHeader } from '@/shared/components/layout/GamifiedHeader';
import { AchievementCard } from '@/shared/components/AchievementCard';
import { AchievementFilter } from '@/shared/components/AchievementFilter';
import { AchievementModal } from '@/shared/components/AchievementModal';
import { gamificationApi } from '@/lib/api/gamification.api';
import type {
  Achievement,
  UserAchievement,
  AchievementFilter as AchievementFilterType,
  AchievementSummary,
  AchievementStatus,
} from '@/shared/types/achievement.types';

/**
 * AchievementsPage Component
 *
 * Complete achievements page with filtering, sorting, and claim functionality.
 *
 * Features:
 * - Achievement summary stats (total, earned, completion %)
 * - Latest earned achievements showcase
 * - Achievement filtering by category, status, search
 * - Sorting by name, progress, date, rarity
 * - Achievement grid with responsive layout
 * - Modal for achievement details and claiming rewards
 * - Hidden achievements section
 * - Loading states with skeletons
 * - Error handling with retry
 * - Real-time filter/sort (client-side)
 */
export const AchievementsPage: React.FC = () => {
  const { user, logout } = useAuth();

  // State for data
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [summary, setSummary] = useState<AchievementSummary | null>(null);

  // Loading and error states
  const [isLoadingAchievements, setIsLoadingAchievements] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [filter, setFilter] = useState<AchievementFilterType>({
    category: 'all',
    status: 'all',
    sortBy: 'name',
    sortOrder: 'asc',
    searchQuery: '',
  });

  // Modal state
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedUserAchievement, setSelectedUserAchievement] = useState<
    UserAchievement | undefined
  >(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * Fetch all achievements
   */
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setIsLoadingAchievements(true);
        setError(null);
        const data = await gamificationApi.getAllAchievements();
        setAllAchievements(data);
      } catch (err) {
        console.error('Failed to load achievements:', err);
        setError('Error al cargar logros. Por favor, intenta de nuevo.');
      } finally {
        setIsLoadingAchievements(false);
      }
    };

    loadAchievements();
  }, []);

  /**
   * Fetch user achievements and summary
   */
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingUserData(true);
        const [userAchData, summaryData] = await Promise.all([
          gamificationApi.getUserAchievements(user.id),
          gamificationApi.getAchievementSummary(user.id).catch(() => null), // Optional endpoint
        ]);

        setUserAchievements(userAchData);
        if (summaryData) {
          setSummary(summaryData);
        }
      } catch (err) {
        console.error('Failed to load user achievements:', err);
      } finally {
        setIsLoadingUserData(false);
      }
    };

    loadUserData();
  }, [user?.id]);

  /**
   * Combine achievements with user progress
   */
  const combinedAchievements = useMemo(() => {
    const userAchMap = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));

    return allAchievements.map((achievement) => ({
      achievement,
      userAchievement: userAchMap.get(achievement.id),
    }));
  }, [allAchievements, userAchievements]);

  /**
   * Filter and sort achievements
   */
  const filteredAchievements = useMemo(() => {
    let filtered = combinedAchievements;

    // Filter by category
    if (filter.category && filter.category !== 'all') {
      filtered = filtered.filter((item) => item.achievement.category === filter.category);
    }

    // Filter by status
    if (filter.status && filter.status !== 'all') {
      filtered = filtered.filter((item) => {
        const status = item.userAchievement?.status || 'locked';
        return status === filter.status;
      });
    }

    // Filter by search query
    if (filter.searchQuery) {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.achievement.name.toLowerCase().includes(query) ||
          item.achievement.description.toLowerCase().includes(query)
      );
    }

    // Sort
    if (filter.sortBy) {
      filtered = [...filtered].sort((a, b) => {
        let compareResult = 0;

        switch (filter.sortBy) {
          case 'name':
            compareResult = a.achievement.name.localeCompare(b.achievement.name);
            break;
          case 'progress':
            compareResult = (a.userAchievement?.progress || 0) - (b.userAchievement?.progress || 0);
            break;
          case 'earnedDate':
            const dateA = a.userAchievement?.earnedAt
              ? new Date(a.userAchievement.earnedAt).getTime()
              : 0;
            const dateB = b.userAchievement?.earnedAt
              ? new Date(b.userAchievement.earnedAt).getTime()
              : 0;
            compareResult = dateA - dateB;
            break;
          case 'rarity':
            const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };
            const rarityA = rarityOrder[a.achievement.rarity || 'common'] || 0;
            const rarityB = rarityOrder[b.achievement.rarity || 'common'] || 0;
            compareResult = rarityA - rarityB;
            break;
        }

        return filter.sortOrder === 'asc' ? compareResult : -compareResult;
      });
    }

    return filtered;
  }, [combinedAchievements, filter]);

  /**
   * Separate hidden achievements
   */
  const { visibleAchievements, hiddenAchievements } = useMemo(() => {
    const visible: typeof filteredAchievements = [];
    const hidden: typeof filteredAchievements = [];

    filteredAchievements.forEach((item) => {
      const isLocked = !item.userAchievement || item.userAchievement.status === 'locked';
      if (item.achievement.isHidden && isLocked) {
        hidden.push(item);
      } else {
        visible.push(item);
      }
    });

    return { visibleAchievements: visible, hiddenAchievements: hidden };
  }, [filteredAchievements]);

  /**
   * Calculate summary if not provided by API
   */
  const displaySummary = useMemo(() => {
    if (summary) return summary;

    const total = allAchievements.length;
    const earned = userAchievements.filter((ua) => ua.status === 'earned' || ua.status === 'claimed').length;
    const claimed = userAchievements.filter((ua) => ua.status === 'claimed').length;
    const inProgress = userAchievements.filter((ua) => ua.status === 'in_progress').length;
    const locked = total - earned;
    const completionPercentage = total > 0 ? (earned / total) * 100 : 0;
    const recentlyEarned = userAchievements
      .filter((ua) => ua.earnedAt)
      .sort((a, b) => new Date(b.earnedAt!).getTime() - new Date(a.earnedAt!).getTime())
      .slice(0, 3);

    return {
      total,
      earned,
      claimed,
      inProgress,
      locked,
      completionPercentage,
      recentlyEarned,
    };
  }, [summary, allAchievements, userAchievements]);

  /**
   * Open achievement modal
   */
  const handleAchievementClick = (achievement: Achievement, userAchievement?: UserAchievement) => {
    setSelectedAchievement(achievement);
    setSelectedUserAchievement(userAchievement);
    setIsModalOpen(true);
  };

  /**
   * Close modal
   */
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAchievement(null);
    setSelectedUserAchievement(undefined);
  };

  /**
   * Claim achievement rewards
   */
  const handleClaimRewards = async (achievementId: string) => {
    if (!user?.id) return;

    try {
      const updatedAchievement = await gamificationApi.claimAchievement(user.id, achievementId);

      // Update local state
      setUserAchievements((prev) =>
        prev.map((ua) => (ua.achievementId === achievementId ? updatedAchievement : ua))
      );

      // Close modal
      handleCloseModal();

      // Optional: Show success message
      // TODO: Add toast notification
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      throw error; // Let modal handle the error
    }
  };

  /**
   * Retry loading
   */
  const handleRetry = () => {
    window.location.reload();
  };

  const isLoading = isLoadingAchievements || isLoadingUserData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <GamifiedHeader user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Trophy className="w-8 h-8 mr-3 text-yellow-600" />
          Logros
        </h1>
        <p className="text-gray-600 mt-2">
          Desbloquea logros completando desafíos y alcanzando metas. ¡Reclama tus recompensas!
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{displaySummary.total}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Ganados</p>
            <p className="text-3xl font-bold text-green-600">{displaySummary.earned}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Completado</p>
            <p className="text-3xl font-bold text-purple-600">
              {Math.round(displaySummary.completionPercentage)}%
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">En Progreso</p>
            <p className="text-3xl font-bold text-blue-600">{displaySummary.inProgress}</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">Bloqueados</p>
            <p className="text-3xl font-bold text-gray-400">{displaySummary.locked}</p>
          </div>
        </div>
      )}

      {/* Latest Earned (mini showcase) */}
      {!isLoading && displaySummary.recentlyEarned.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recientemente Ganados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displaySummary.recentlyEarned.map((userAch) => {
              const achievement = allAchievements.find((a) => a.id === userAch.achievementId);
              if (!achievement) return null;
              return (
                <AchievementCard
                  key={userAch.id}
                  achievement={achievement}
                  userAchievement={userAch}
                  onClick={() => handleAchievementClick(achievement, userAch)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6">
        <AchievementFilter currentFilter={filter} onFilterChange={setFilter} />
      </div>

      {/* Achievements Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Todos los Logros ({visibleAchievements.length})
        </h2>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader className="w-8 h-8 text-orange-600 animate-spin" />
            <span className="ml-3 text-gray-600">Cargando logros...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && visibleAchievements.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron logros</h3>
            <p className="text-gray-600">
              Intenta ajustar tus filtros para ver más logros.
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoading && visibleAchievements.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleAchievements.map((item) => (
              <AchievementCard
                key={item.achievement.id}
                achievement={item.achievement}
                userAchievement={item.userAchievement}
                onClick={() => handleAchievementClick(item.achievement, item.userAchievement)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hidden Achievements Section */}
      {!isLoading && hiddenAchievements.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Logros Ocultos ({hiddenAchievements.length})
          </h2>
          <p className="text-gray-600 mb-4">
            Estos logros están ocultos hasta que los desbloquees. ¡Sigue explorando!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hiddenAchievements.map((item) => (
              <AchievementCard
                key={item.achievement.id}
                achievement={item.achievement}
                userAchievement={item.userAchievement}
                onClick={() => handleAchievementClick(item.achievement, item.userAchievement)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Achievement Modal */}
      {selectedAchievement && (
        <AchievementModal
          achievement={selectedAchievement}
          userAchievement={selectedUserAchievement}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onClaimRewards={handleClaimRewards}
        />
      )}
      </div>
    </div>
  );
};

export default AchievementsPage;
