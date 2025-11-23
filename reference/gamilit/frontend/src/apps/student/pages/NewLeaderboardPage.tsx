/**
 * NewLeaderboardPage - Sprint 2 Enhanced Leaderboard Page
 *
 * Features new materialized view leaderboards:
 * - XP Leaderboard
 * - ML Coins Leaderboard
 * - Streaks Leaderboard
 * - Global Leaderboard (combined score)
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  TrendingUp,
  Users,
  Star,
  Coins,
  Flame,
  Crown,
  RefreshCw,
  Sparkles,
  Medal,
  ChevronUp,
} from 'lucide-react';
import { useNewLeaderboardsStore } from '@/features/gamification/social/store/newLeaderboardsStore';
import { cn } from '@shared/utils/cn';

export default function NewLeaderboardPage() {
  const {
    xpLeaderboard,
    coinsLeaderboard,
    streaksLeaderboard,
    globalLeaderboard,
    myXpRank,
    myCoinsRank,
    myStreaksRank,
    myGlobalRank,
    isLoading,
    error,
    lastUpdated,
    activeTab,
    setActiveTab,
    fetchAllLeaderboards,
    refreshCurrentLeaderboard
  } = useNewLeaderboardsStore();

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch all leaderboards on mount
  useEffect(() => {
    fetchAllLeaderboards();

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      refreshCurrentLeaderboard();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchAllLeaderboards, refreshCurrentLeaderboard]);

  // Get current leaderboard data based on active tab
  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case 'xp':
        return xpLeaderboard;
      case 'coins':
        return coinsLeaderboard;
      case 'streaks':
        return streaksLeaderboard;
      case 'global':
        return globalLeaderboard;
    }
  };

  // Get current user's rank
  const getMyRank = () => {
    switch (activeTab) {
      case 'xp':
        return myXpRank;
      case 'coins':
        return myCoinsRank;
      case 'streaks':
        return myStreaksRank;
      case 'global':
        return myGlobalRank;
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshCurrentLeaderboard();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Tab configuration
  const tabs = [
    { id: 'global', label: 'Global', icon: Trophy, color: 'from-yellow-400 to-orange-500' },
    { id: 'xp', label: 'Experience', icon: Star, color: 'from-blue-500 to-purple-500' },
    { id: 'coins', label: 'ML Coins', icon: Coins, color: 'from-yellow-500 to-amber-600' },
    { id: 'streaks', label: 'Streaks', icon: Flame, color: 'from-orange-500 to-red-500' }
  ] as const;

  const currentLeaderboard = getCurrentLeaderboard();
  const myRank = getMyRank();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20"
      >
        <div className="container mx-auto px-4 py-4">
          {/* Title and Refresh */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-detective-text">
                  Leaderboards
                </h1>
                {lastUpdated && (
                  <p className="text-sm text-detective-text-secondary">
                    Last updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-detective-orange text-white rounded-lg hover:bg-detective-orange-dark transition-colors disabled:opacity-50"
            >
              <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin")} />
              <span className="hidden md:inline">Refresh</span>
            </motion.button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap",
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                    : "bg-gray-100 dark:bg-gray-700 text-detective-text-secondary hover:bg-gray-200 dark:hover:bg-gray-600"
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && currentLeaderboard.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-detective-orange animate-spin mx-auto mb-4" />
              <p className="text-detective-text-secondary">Loading leaderboard...</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading || currentLeaderboard.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Leaderboard */}
            <main className="lg:col-span-3 space-y-6">
              {/* My Rank Card */}
              {myRank !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 text-white rounded-xl shadow-lg p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative p-4 bg-white/20 rounded-full">
                        <Crown className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-1">Your Rank</h2>
                        <p className="text-lg opacity-90">
                          {activeTab === 'global' && 'Global Leaderboard'}
                          {activeTab === 'xp' && 'Experience Points'}
                          {activeTab === 'coins' && 'ML Coins'}
                          {activeTab === 'streaks' && 'Activity Streaks'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold mb-1">#{myRank}</div>
                      <div className="text-sm opacity-90">
                        {currentLeaderboard.length > 0 && (
                          <>Top {Math.round((myRank / currentLeaderboard.length) * 100)}%</>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-detective-text-secondary">Players</span>
                  </div>
                  <div className="text-2xl font-bold text-detective-text">
                    {currentLeaderboard.length.toLocaleString()}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-detective-text-secondary">Top Score</span>
                  </div>
                  <div className="text-2xl font-bold text-detective-text">
                    {currentLeaderboard[0]?.score?.toLocaleString() || 0}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-detective-text-secondary">Avg Score</span>
                  </div>
                  <div className="text-2xl font-bold text-detective-text">
                    {currentLeaderboard.length > 0
                      ? Math.round(
                          currentLeaderboard.reduce((sum, entry) => sum + entry.score, 0) /
                            currentLeaderboard.length
                        ).toLocaleString()
                      : 0}
                  </div>
                </motion.div>
              </div>

              {/* Leaderboard Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-detective-text flex items-center gap-2">
                    <Medal className="w-6 h-6 text-detective-gold" />
                    Top Players
                  </h2>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence mode="wait">
                    {currentLeaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.userId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                          index < 3 && "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10"
                        )}
                      >
                        {/* Rank */}
                        <div className="flex-shrink-0 w-16 text-center">
                          {index === 0 && <span className="text-3xl">🥇</span>}
                          {index === 1 && <span className="text-3xl">🥈</span>}
                          {index === 2 && <span className="text-3xl">🥉</span>}
                          {index > 2 && (
                            <span className="text-lg font-bold text-detective-text-secondary">
                              #{entry.rankPosition}
                            </span>
                          )}
                        </div>

                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          {entry.avatarUrl ? (
                            <img
                              src={entry.avatarUrl}
                              alt={entry.fullName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                              onError={(e) => {
                                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.fullName)}&background=f97316&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-detective-orange to-orange-600 flex items-center justify-center text-white font-bold">
                              {entry.fullName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-detective-text truncate">
                            {entry.fullName}
                          </p>
                          {entry.mayaRank && (
                            <p className="text-sm text-detective-text-secondary">
                              {entry.mayaRank.toUpperCase()}
                            </p>
                          )}
                        </div>

                        {/* Score */}
                        <div className="text-right">
                          <p className="text-lg font-bold text-detective-text">
                            {activeTab === 'xp' && `${(entry as any).totalXp?.toLocaleString() || 0} XP`}
                            {activeTab === 'coins' && `${(entry as any).mlCoinsLifetime?.toLocaleString() || 0} 💰`}
                            {activeTab === 'streaks' && `${(entry as any).currentStreak || 0} days 🔥`}
                            {activeTab === 'global' && `${Math.round((entry as any).globalScore || entry.score)?.toLocaleString()} pts`}
                          </p>
                          {activeTab === 'xp' && (
                            <p className="text-sm text-detective-text-secondary">
                              Level {(entry as any).currentLevel || 0}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {currentLeaderboard.length === 0 && !isLoading && (
                    <div className="p-12 text-center text-detective-text-secondary">
                      No leaderboard data available yet
                    </div>
                  )}
                </div>
              </motion.div>
            </main>

            {/* Sidebar */}
            <aside className="hidden lg:block space-y-6">
              {/* Quick Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-800"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-bold text-detective-text">Tips to Climb</h3>
                </div>
                <ul className="space-y-2 text-sm text-detective-text-secondary">
                  <li className="flex items-start gap-2">
                    <ChevronUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Complete exercises daily to earn XP and ML Coins</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Maintain activity streaks for bonus rewards</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Unlock achievements to boost your global score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronUp className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span>Rank up to unlock better multipliers</span>
                  </li>
                </ul>
              </motion.div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
