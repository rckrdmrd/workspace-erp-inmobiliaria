/**
 * StreakIndicator Component
 *
 * Displays user's current activity streak with visual feedback
 * Shows in profile/header to motivate daily engagement
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Zap } from 'lucide-react';
import { useProgression } from '@/features/gamification/ranks/hooks/useProgression';
import { cn } from '@shared/utils/cn';

interface StreakIndicatorProps {
  variant?: 'compact' | 'full';
  className?: string;
  showDetails?: boolean;
}

export const StreakIndicator: React.FC<StreakIndicatorProps> = ({
  variant = 'compact',
  className,
  showDetails = true
}) => {
  // Get user progress from store
  const { userProgress } = useProgression();

  const currentStreak = userProgress?.currentStreak || 0;
  const maxStreak = userProgress?.maxStreak || 0;

  // Don't show if no streak
  if (currentStreak === 0 && !showDetails) {
    return null;
  }

  // Determine streak level and colors
  const getStreakLevel = () => {
    if (currentStreak >= 30) return { level: 'legendary', color: 'from-purple-500 to-pink-500', icon: '🔥' };
    if (currentStreak >= 14) return { level: 'epic', color: 'from-orange-500 to-red-500', icon: '🔥' };
    if (currentStreak >= 7) return { level: 'rare', color: 'from-yellow-500 to-orange-500', icon: '🔥' };
    if (currentStreak >= 3) return { level: 'common', color: 'from-blue-500 to-cyan-500', icon: '⭐' };
    return { level: 'none', color: 'from-gray-400 to-gray-500', icon: '💫' };
  };

  const streakLevel = getStreakLevel();
  const isRecord = currentStreak === maxStreak && currentStreak > 0;

  // Compact variant for headers/navbars
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r shadow-md",
          streakLevel.color,
          className
        )}
      >
        <motion.span
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: currentStreak > 0 ? Infinity : 0, repeatDelay: 2 }}
          className="text-xl"
        >
          {streakLevel.icon}
        </motion.span>
        <div className="flex flex-col">
          <span className="text-white font-bold text-sm leading-tight">{currentStreak}</span>
          <span className="text-white/80 text-xs leading-tight">days</span>
        </div>
        {isRecord && (
          <Trophy className="w-4 h-4 text-yellow-300" />
        )}
      </motion.div>
    );
  }

  // Full variant for profile pages
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-detective-text flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Activity Streak
        </h3>
        {isRecord && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 rounded-full"
          >
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">
              Record!
            </span>
          </motion.div>
        )}
      </div>

      {/* Current Streak Display */}
      <div className="text-center mb-6">
        <motion.div
          animate={{
            scale: currentStreak > 0 ? [1, 1.05, 1] : 1
          }}
          transition={{
            duration: 2,
            repeat: currentStreak > 0 ? Infinity : 0,
            repeatDelay: 3
          }}
          className={cn(
            "inline-block p-6 rounded-full bg-gradient-to-br shadow-2xl mb-3",
            streakLevel.color
          )}
        >
          <motion.span
            animate={{ rotate: currentStreak > 0 ? [0, 15, -15, 0] : 0 }}
            transition={{
              duration: 0.6,
              repeat: currentStreak > 0 ? Infinity : 0,
              repeatDelay: 4
            }}
            className="text-6xl"
          >
            {streakLevel.icon}
          </motion.span>
        </motion.div>

        <div className="space-y-1">
          <motion.div
            key={currentStreak}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-detective-text"
          >
            {currentStreak}
          </motion.div>
          <div className="text-detective-text-secondary font-medium">
            {currentStreak === 1 ? 'day streak' : 'days streak'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-detective-bg dark:bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-detective-text mb-1">
            {maxStreak}
          </div>
          <div className="text-xs text-detective-text-secondary">
            Best Streak
          </div>
        </div>

        <div className="bg-detective-bg dark:bg-gray-900 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {streakLevel.level}
          </div>
          <div className="text-xs text-detective-text-secondary capitalize">
            Level
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-detective-text-secondary mb-3">
          Next Milestones
        </h4>
        {[
          { days: 3, label: 'Warm up', reached: currentStreak >= 3 },
          { days: 7, label: 'On fire', reached: currentStreak >= 7 },
          { days: 14, label: 'Unstoppable', reached: currentStreak >= 14 },
          { days: 30, label: 'Legend', reached: currentStreak >= 30 }
        ].map((milestone) => (
          <div
            key={milestone.days}
            className={cn(
              "flex items-center justify-between p-2 rounded-lg transition-colors",
              milestone.reached
                ? "bg-green-50 dark:bg-green-900/20"
                : "bg-gray-50 dark:bg-gray-900"
            )}
          >
            <div className="flex items-center gap-2">
              {milestone.reached ? (
                <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
              ) : (
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              )}
              <span className={cn(
                "text-sm font-medium",
                milestone.reached
                  ? "text-green-700 dark:text-green-300"
                  : "text-detective-text-secondary"
              )}>
                {milestone.label}
              </span>
            </div>
            <span className={cn(
              "text-sm font-bold",
              milestone.reached
                ? "text-green-600 dark:text-green-400"
                : "text-detective-text-secondary"
            )}>
              {milestone.days} days
            </span>
          </div>
        ))}
      </div>

      {/* Motivation Message */}
      {currentStreak > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
        >
          <p className="text-sm text-detective-text-secondary text-center">
            {currentStreak >= 30 && "You're a legend! Keep it up!"}
            {currentStreak >= 14 && currentStreak < 30 && "Amazing commitment! You're unstoppable!"}
            {currentStreak >= 7 && currentStreak < 14 && "You're on fire! Don't break the chain!"}
            {currentStreak >= 3 && currentStreak < 7 && "Great start! Keep the momentum going!"}
            {currentStreak < 3 && "Every day counts! Keep going!"}
          </p>
        </motion.div>
      )}

      {currentStreak === 0 && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
          <p className="text-sm text-detective-text-secondary mb-2">
            Start your streak today!
          </p>
          <p className="text-xs text-detective-text-secondary">
            Complete an exercise to begin
          </p>
        </div>
      )}
    </motion.div>
  );
};
