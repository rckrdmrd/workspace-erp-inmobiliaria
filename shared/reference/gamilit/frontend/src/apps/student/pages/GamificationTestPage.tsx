/**
 * GamificationTestPage
 *
 * Integration test page for Sprint 3 - Frontend Integration
 * Tests all new gamification features
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Trophy,
  Coins,
  Flame,
  Star,
  RefreshCw,
  Play,
} from 'lucide-react';
import { useNewLeaderboardsStore } from '@/features/gamification/social/store/newLeaderboardsStore';
import { useAchievementsStore } from '@/features/gamification/social/store/achievementsStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { useProgression } from '@/features/gamification/ranks/hooks/useProgression';
import { StreakIndicator } from '@/features/gamification/components/StreakIndicator';
import { cn } from '@shared/utils/cn';

type TestStatus = 'idle' | 'running' | 'success' | 'error';

interface TestResult {
  name: string;
  status: TestStatus;
  message: string;
  timestamp: Date;
}

export default function GamificationTestPage() {
  const { user } = useAuthStore();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);

  const newLeaderboards = useNewLeaderboardsStore();
  const achievements = useAchievementsStore();
  const progression = useProgression();

  const addResult = (name: string, status: TestStatus, message: string) => {
    setTestResults((prev) => [
      ...prev,
      { name, status, message, timestamp: new Date() },
    ]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Test Functions
  const testXPLeaderboard = async () => {
    addResult('XP Leaderboard', 'running', 'Fetching XP leaderboard...');
    try {
      await newLeaderboards.fetchXPLeaderboard(10);
      await newLeaderboards.fetchMyRank('xp');

      if (newLeaderboards.xpLeaderboard.length > 0) {
        addResult(
          'XP Leaderboard',
          'success',
          `Loaded ${newLeaderboards.xpLeaderboard.length} entries. Your rank: ${newLeaderboards.myXpRank || 'N/A'}`
        );
      } else {
        addResult('XP Leaderboard', 'error', 'No entries found');
      }
    } catch (error) {
      addResult('XP Leaderboard', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testCoinsLeaderboard = async () => {
    addResult('Coins Leaderboard', 'running', 'Fetching Coins leaderboard...');
    try {
      await newLeaderboards.fetchCoinsLeaderboard(10);
      await newLeaderboards.fetchMyRank('coins');

      if (newLeaderboards.coinsLeaderboard.length > 0) {
        addResult(
          'Coins Leaderboard',
          'success',
          `Loaded ${newLeaderboards.coinsLeaderboard.length} entries. Your rank: ${newLeaderboards.myCoinsRank || 'N/A'}`
        );
      } else {
        addResult('Coins Leaderboard', 'error', 'No entries found');
      }
    } catch (error) {
      addResult('Coins Leaderboard', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testStreaksLeaderboard = async () => {
    addResult('Streaks Leaderboard', 'running', 'Fetching Streaks leaderboard...');
    try {
      await newLeaderboards.fetchStreaksLeaderboard(10);
      await newLeaderboards.fetchMyRank('streaks');

      if (newLeaderboards.streaksLeaderboard.length > 0) {
        addResult(
          'Streaks Leaderboard',
          'success',
          `Loaded ${newLeaderboards.streaksLeaderboard.length} entries. Your rank: ${newLeaderboards.myStreaksRank || 'N/A'}`
        );
      } else {
        addResult('Streaks Leaderboard', 'error', 'No entries found');
      }
    } catch (error) {
      addResult('Streaks Leaderboard', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testGlobalLeaderboard = async () => {
    addResult('Global Leaderboard', 'running', 'Fetching Global leaderboard...');
    try {
      await newLeaderboards.fetchGlobalLeaderboard(10);
      await newLeaderboards.fetchMyRank('global');

      if (newLeaderboards.globalLeaderboard.length > 0) {
        addResult(
          'Global Leaderboard',
          'success',
          `Loaded ${newLeaderboards.globalLeaderboard.length} entries. Your rank: ${newLeaderboards.myGlobalRank || 'N/A'}`
        );
      } else {
        addResult('Global Leaderboard', 'error', 'No entries found');
      }
    } catch (error) {
      addResult('Global Leaderboard', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testAchievements = async () => {
    addResult('Achievements', 'running', 'Fetching achievements...');
    try {
      await achievements.fetchAchievements(user?.id || '');

      if (achievements.achievements.length > 0) {
        addResult(
          'Achievements',
          'success',
          `Loaded ${achievements.achievements.length} achievements. Unlocked: ${achievements.unlockedAchievements.length}`
        );
      } else {
        addResult('Achievements', 'error', 'No achievements found');
      }
    } catch (error) {
      addResult('Achievements', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testProgression = async () => {
    addResult('Progression', 'running', 'Checking progression data...');
    try {
      const { currentXP, currentLevel, totalXP, activityStreak } = progression;
      addResult(
        'Progression',
        'success',
        `Level ${currentLevel} | ${currentXP}/${progression.xpToNextLevel} XP | Total: ${totalXP} | Streak: ${activityStreak} days`
      );
    } catch (error) {
      addResult('Progression', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const testStreakIndicator = async () => {
    addResult('Streak Indicator', 'running', 'Rendering Streak Indicator...');
    try {
      // Check if userProgress exists
      if (progression.userProgress) {
        addResult(
          'Streak Indicator',
          'success',
          `Current streak: ${progression.activityStreak} days | Max: ${progression.userProgress.maxStreak || 0} days`
        );
      } else {
        addResult('Streak Indicator', 'error', 'No user progress data');
      }
    } catch (error) {
      addResult('Streak Indicator', 'error', error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const runAllTests = async () => {
    setIsTestingAll(true);
    clearResults();

    await testXPLeaderboard();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testCoinsLeaderboard();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testStreaksLeaderboard();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testGlobalLeaderboard();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testAchievements();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testProgression();
    await new Promise((resolve) => setTimeout(resolve, 500));

    await testStreakIndicator();

    setIsTestingAll(false);
  };

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-detective-text mb-2">
                Gamification Integration Tests
              </h1>
              <p className="text-detective-text-secondary">
                Sprint 3 - Frontend Integration Test Suite
              </p>
            </div>
            <Trophy className="w-12 h-12 text-detective-gold" />
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={runAllTests}
              disabled={isTestingAll}
              className="flex items-center gap-2 px-6 py-3 bg-detective-orange text-white rounded-lg font-semibold hover:bg-detective-orange-dark transition-colors disabled:opacity-50"
            >
              <Play className="w-5 h-5" />
              Run All Tests
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearResults}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-detective-text rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Clear Results
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Individual Tests */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-detective-text mb-4">Individual Tests</h2>

            {/* Test Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <TestButton
                icon={<Star className="w-5 h-5" />}
                label="XP Leaderboard"
                onClick={testXPLeaderboard}
                disabled={isTestingAll}
              />
              <TestButton
                icon={<Coins className="w-5 h-5" />}
                label="Coins Leaderboard"
                onClick={testCoinsLeaderboard}
                disabled={isTestingAll}
              />
              <TestButton
                icon={<Flame className="w-5 h-5" />}
                label="Streaks Leaderboard"
                onClick={testStreaksLeaderboard}
                disabled={isTestingAll}
              />
              <TestButton
                icon={<Trophy className="w-5 h-5" />}
                label="Global Leaderboard"
                onClick={testGlobalLeaderboard}
                disabled={isTestingAll}
              />
              <TestButton
                icon={<Trophy className="w-5 h-5" />}
                label="Achievements"
                onClick={testAchievements}
                disabled={isTestingAll}
              />
              <TestButton
                icon={<Star className="w-5 h-5" />}
                label="Progression"
                onClick={testProgression}
                disabled={isTestingAll}
              />
              <TestButton
                icon={<Flame className="w-5 h-5" />}
                label="Streak Indicator"
                onClick={testStreakIndicator}
                disabled={isTestingAll}
                className="col-span-2"
              />
            </div>

            {/* Live Preview - Streak Indicator */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-detective-text mb-4">
                Live Preview: Streak Indicator
              </h3>
              <div className="space-y-4">
                <StreakIndicator variant="compact" />
                <StreakIndicator variant="full" />
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-detective-text mb-4">Test Results</h2>

            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-center py-12 text-detective-text-secondary">
                  No tests run yet. Click "Run All Tests" or select individual tests.
                </div>
              ) : (
                testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 rounded-lg border-2",
                      result.status === 'success' && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
                      result.status === 'error' && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
                      result.status === 'running' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="font-semibold text-detective-text mb-1">
                          {result.name}
                        </div>
                        <div className="text-sm text-detective-text-secondary">
                          {result.message}
                        </div>
                        <div className="text-xs text-detective-text-secondary mt-1">
                          {result.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Summary */}
            {testResults.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {testResults.filter((r) => r.status === 'success').length}
                    </div>
                    <div className="text-xs text-detective-text-secondary">Passed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {testResults.filter((r) => r.status === 'error').length}
                    </div>
                    <div className="text-xs text-detective-text-secondary">Failed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {testResults.filter((r) => r.status === 'running').length}
                    </div>
                    <div className="text-xs text-detective-text-secondary">Running</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
interface TestButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const TestButton: React.FC<TestButtonProps> = ({
  icon,
  label,
  onClick,
  disabled,
  className
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "flex items-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-detective-orange transition-colors disabled:opacity-50",
      className
    )}
  >
    {icon}
    <span className="font-semibold text-detective-text">{label}</span>
  </motion.button>
);
