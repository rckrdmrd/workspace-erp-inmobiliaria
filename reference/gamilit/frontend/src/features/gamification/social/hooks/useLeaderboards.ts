/**
 * useLeaderboards Hook
 */

import { useLeaderboardsStore } from '../store/leaderboardsStore';
import type { LeaderboardType, TimePeriod } from '../types/leaderboardsTypes';

export const useLeaderboards = () => {
  const {
    currentLeaderboard,
    selectedType,
    selectedPeriod,
    setLeaderboardType,
    setTimePeriod,
    refreshLeaderboard,
  } = useLeaderboardsStore();

  const getUserPosition = () => {
    return currentLeaderboard.userRank || null;
  };

  const getTopThree = () => {
    return currentLeaderboard.entries.slice(0, 3);
  };

  const getUserEntry = () => {
    return currentLeaderboard.entries.find((e) => e.isCurrentUser);
  };

  const isUserInTop10 = () => {
    const userRank = currentLeaderboard.userRank;
    return userRank ? userRank <= 10 : false;
  };

  return {
    currentLeaderboard,
    selectedType,
    selectedPeriod,
    setLeaderboardType,
    setTimePeriod,
    refreshLeaderboard,
    getUserPosition,
    getTopThree,
    getUserEntry,
    isUserInTop10,
  };
};
