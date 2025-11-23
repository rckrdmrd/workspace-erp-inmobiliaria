/**
 * RankBadgeAdvanced Component
 *
 * Enhanced rank badge with animations, prestige stars, and interactive features.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { MayaIcon, PrestigeStarIcon } from './MayaIconography';
import { getRankById } from '../mockData/ranksMockData';
import type { MayaRank, RankBadgeOptions } from '../types/ranksTypes';

export interface RankBadgeAdvancedProps extends RankBadgeOptions {
  rank: MayaRank;
  prestigeLevel?: number;
  className?: string;
}

/**
 * Size configurations
 */
const sizeConfig = {
  xs: {
    container: 'px-2 py-1 text-xs',
    icon: 16,
    prestigeStar: 10,
    gap: 'gap-1',
  },
  sm: {
    container: 'px-2.5 py-1 text-sm',
    icon: 20,
    prestigeStar: 12,
    gap: 'gap-1.5',
  },
  md: {
    container: 'px-3 py-1.5 text-base',
    icon: 24,
    prestigeStar: 14,
    gap: 'gap-2',
  },
  lg: {
    container: 'px-4 py-2 text-lg',
    icon: 32,
    prestigeStar: 16,
    gap: 'gap-2',
  },
  xl: {
    container: 'px-5 py-2.5 text-xl',
    icon: 40,
    prestigeStar: 18,
    gap: 'gap-3',
  },
};

/**
 * RankBadgeAdvanced Component
 */
export const RankBadgeAdvanced: React.FC<RankBadgeAdvancedProps> = ({
  rank,
  prestigeLevel = 0,
  size = 'md',
  showName = true,
  showPrestige = true,
  animated = true,
  showGlow = false,
  showTooltip = false,
  onClick,
  className = '',
}) => {
  const rankData = getRankById(rank);
  const config = sizeConfig[size];

  // Animation variants
  const badgeVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
    },
    hover: {
      scale: 1.05,
    },
    tap: {
      scale: 0.95,
    },
  };

  const glowVariants = {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
    },
  };

  // Prestige stars array
  const prestigeStars = Array.from({ length: Math.min(prestigeLevel, 5) }, (_, i) => i);

  return (
    <motion.div
      initial={animated ? { scale: 0.95, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      whileHover={animated && onClick ? { scale: 1.05 } : undefined}
      whileTap={animated && onClick ? { scale: 0.95 } : undefined}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full font-semibold',
        'bg-gradient-to-r shadow-md',
        rankData.gradient,
        config.container,
        config.gap,
        'text-white',
        onClick && 'cursor-pointer',
        showGlow && 'shadow-lg',
        className
      )}
      title={showTooltip ? `${rankData.nameSpanish} (${rankData.name})` : undefined}
    >
      {/* Glow effect */}
      {showGlow && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-white opacity-20 blur-sm"
          style={{ zIndex: -1 }}
        />
      )}

      {/* Maya Icon */}
      <MayaIcon rank={rank} size={config.icon} className="flex-shrink-0" />

      {/* Rank Name */}
      {showName && (
        <span className="font-bold tracking-wide">{rankData.name}</span>
      )}

      {/* Prestige Stars */}
      {showPrestige && prestigeLevel > 0 && (
        <div className="flex items-center gap-0.5 ml-1">
          {prestigeStars.map((_, index) => (
            <motion.div
              key={index}
              initial={animated ? { scale: 0, rotate: -180 } : undefined}
              animate={animated ? { scale: 1, rotate: 0 } : undefined}
              transition={
                animated
                  ? {
                      delay: index * 0.1,
                      duration: 0.3,
                      ease: 'easeOut',
                    }
                  : undefined
              }
            >
              <PrestigeStarIcon
                size={config.prestigeStar}
                className="text-yellow-300"
              />
            </motion.div>
          ))}
          {prestigeLevel > 5 && (
            <span className="text-xs font-bold ml-0.5">+{prestigeLevel - 5}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

/**
 * RankBadgeSimple - Simplified version without animations
 */
export const RankBadgeSimple: React.FC<RankBadgeAdvancedProps> = (props) => {
  return <RankBadgeAdvanced {...props} animated={false} showGlow={false} />;
};

/**
 * RankBadgeGlow - Version with permanent glow effect
 */
export const RankBadgeGlow: React.FC<RankBadgeAdvancedProps> = (props) => {
  return <RankBadgeAdvanced {...props} showGlow={true} />;
};
