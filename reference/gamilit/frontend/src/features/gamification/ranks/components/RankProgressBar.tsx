/**
 * RankProgressBar Component
 *
 * XP progress bar with smooth animations, milestones, and detailed stats.
 */

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Star, Target } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import type { ProgressMilestone } from '../types/ranksTypes';

export interface RankProgressBarProps {
  currentXP: number;
  xpToNextLevel: number;
  currentLevel: number;
  nextLevel?: number;
  showStats?: boolean;
  showMilestones?: boolean;
  milestones?: ProgressMilestone[];
  height?: 'sm' | 'md' | 'lg';
  color?: 'detective' | 'rank' | 'gold';
  className?: string;
}

/**
 * Height configurations
 */
const heightConfig = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

/**
 * Color configurations
 */
const colorConfig = {
  detective: {
    bg: 'bg-detective-bg-secondary',
    fill: 'bg-gradient-to-r from-detective-orange to-detective-orange-dark',
    text: 'text-detective-orange',
  },
  rank: {
    bg: 'bg-gray-200',
    fill: 'bg-gradient-to-r from-rank-detective-from to-rank-detective-to',
    text: 'text-blue-600',
  },
  gold: {
    bg: 'bg-amber-100',
    fill: 'bg-gradient-to-r from-rank-comisario-from to-rank-comisario-to',
    text: 'text-amber-600',
  },
};

/**
 * RankProgressBar Component
 */
export const RankProgressBar: React.FC<RankProgressBarProps> = ({
  currentXP,
  xpToNextLevel,
  currentLevel,
  nextLevel,
  showStats = true,
  showMilestones = false,
  milestones = [],
  height = 'md',
  color = 'detective',
  className = '',
}) => {
  // Calculate progress percentage
  const progress = useMemo(() => {
    const percentage = (currentXP / xpToNextLevel) * 100;
    return Math.min(100, Math.max(0, percentage));
  }, [currentXP, xpToNextLevel]);

  const colors = colorConfig[color];
  const heightClass = heightConfig[height];

  // Calculate XP remaining
  const xpRemaining = Math.max(0, xpToNextLevel - currentXP);

  // Sort milestones by XP
  const sortedMilestones = useMemo(
    () => [...milestones].sort((a, b) => a.xp - b.xp),
    [milestones]
  );

  return (
    <div className={cn('w-full space-y-2', className)}>
      {/* Stats Header */}
      {showStats && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className={cn('w-4 h-4', colors.text)} />
            <span className="font-medium text-detective-text">
              Nivel {currentLevel}
              {nextLevel && ` → ${nextLevel}`}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-detective-text-secondary">
              {currentXP.toLocaleString()} / {xpToNextLevel.toLocaleString()} XP
            </span>
            <span className={cn('font-semibold', colors.text)}>
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background */}
        <div className={cn('w-full rounded-full overflow-hidden', colors.bg, heightClass)}>
          {/* Animated Progress Fill */}
          <motion.div
            className={cn('h-full rounded-full', colors.fill, 'shadow-sm')}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              delay: 0.1,
            }}
          >
            {/* Shine effect */}
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </div>

        {/* Milestones */}
        {showMilestones && sortedMilestones.length > 0 && (
          <div className="absolute inset-0 pointer-events-none">
            {sortedMilestones.map((milestone, index) => {
              const milestoneProgress = (milestone.xp / xpToNextLevel) * 100;
              return (
                <motion.div
                  key={index}
                  className="absolute top-0 bottom-0 flex items-center"
                  style={{ left: `${milestoneProgress}%` }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="relative group">
                    {/* Milestone marker */}
                    <div
                      className={cn(
                        'w-1 h-6 rounded-full',
                        milestone.completed
                          ? 'bg-green-500'
                          : 'bg-gray-400 opacity-50'
                      )}
                    />

                    {/* Milestone icon (on completed) */}
                    {milestone.completed && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                      >
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      </motion.div>
                    )}

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
                      <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {milestone.label}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* XP Remaining */}
      {showStats && xpRemaining > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center gap-2 text-xs text-detective-text-secondary"
        >
          <Target className="w-3 h-3" />
          <span>
            {xpRemaining.toLocaleString()} XP restante para el siguiente nivel
          </span>
        </motion.div>
      )}
    </div>
  );
};

/**
 * CompactProgressBar - Minimal version without stats
 */
export const CompactProgressBar: React.FC<RankProgressBarProps> = (props) => {
  return <RankProgressBar {...props} showStats={false} showMilestones={false} />;
};

/**
 * DetailedProgressBar - Full version with all features
 */
export const DetailedProgressBar: React.FC<RankProgressBarProps> = (props) => {
  return <RankProgressBar {...props} showStats={true} showMilestones={true} />;
};
