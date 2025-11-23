/**
 * RankChangeIndicator Component
 *
 * Visual indicator showing rank changes
 * Features:
 * - Arrow icons (up, down, same)
 * - Color coded (green up, red down, gray same)
 * - Position change number display
 * - Tooltip with detailed information
 * - Animation on mount
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import type { RankChange } from '../../types/leaderboardsTypes';
import { cn } from '@shared/utils/cn';

interface RankChangeIndicatorProps {
  change: number;
  changeType: RankChange;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  tooltipPosition?: 'top' | 'bottom' | 'left' | 'right';
}

const sizeConfig = {
  sm: {
    icon: 'w-3 h-3',
    text: 'text-xs',
    container: 'gap-0.5'
  },
  md: {
    icon: 'w-4 h-4',
    text: 'text-sm',
    container: 'gap-1'
  },
  lg: {
    icon: 'w-5 h-5',
    text: 'text-base',
    container: 'gap-1.5'
  }
};

const getChangeColor = (changeType: RankChange): string => {
  switch (changeType) {
    case 'up':
      return 'text-green-500';
    case 'down':
      return 'text-red-500';
    case 'new':
      return 'text-detective-gold';
    case 'same':
    default:
      return 'text-gray-400';
  }
};

const getChangeIcon = (changeType: RankChange) => {
  switch (changeType) {
    case 'up':
      return TrendingUp;
    case 'down':
      return TrendingDown;
    case 'new':
      return Sparkles;
    case 'same':
    default:
      return Minus;
  }
};

const getTooltipMessage = (change: number, changeType: RankChange): string => {
  switch (changeType) {
    case 'up':
      return `Subió ${Math.abs(change)} posicion${Math.abs(change) > 1 ? 'es' : ''} desde el último periodo`;
    case 'down':
      return `Bajó ${Math.abs(change)} posicion${Math.abs(change) > 1 ? 'es' : ''} desde el último periodo`;
    case 'new':
      return 'Nueva entrada en el leaderboard';
    case 'same':
    default:
      return 'Sin cambios desde el último periodo';
  }
};

export const RankChangeIndicator: React.FC<RankChangeIndicatorProps> = ({
  change,
  changeType,
  showLabel = true,
  size = 'md',
  className,
  tooltipPosition = 'top'
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = getChangeIcon(changeType);
  const color = getChangeColor(changeType);
  const config = sizeConfig[size];
  const tooltipMessage = getTooltipMessage(change, changeType);

  const tooltipPositionStyles = {
    top: '-top-12 left-1/2 -translate-x-1/2',
    bottom: '-bottom-12 left-1/2 -translate-x-1/2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const tooltipArrowStyles = {
    top: '-bottom-1 left-1/2 -translate-x-1/2 rotate-45',
    bottom: '-top-1 left-1/2 -translate-x-1/2 rotate-45',
    left: '-right-1 top-1/2 -translate-y-1/2 rotate-45',
    right: '-left-1 top-1/2 -translate-y-1/2 rotate-45'
  };

  return (
    <div
      className={cn('relative inline-flex items-center', config.container, className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Icon with Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={cn(color)}
      >
        <Icon className={config.icon} />
      </motion.div>

      {/* Change Value */}
      {showLabel && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'font-semibold',
            config.text,
            color
          )}
        >
          {changeType === 'new' ? 'NEW' :
           changeType === 'same' ? '-' :
           Math.abs(change) > 0 ? Math.abs(change) : '-'}
        </motion.span>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: tooltipPosition === 'top' ? 5 : -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none shadow-xl',
              tooltipPositionStyles[tooltipPosition]
            )}
          >
            {tooltipMessage}

            {/* Tooltip Arrow */}
            <div
              className={cn(
                'absolute w-2 h-2 bg-gray-900',
                tooltipArrowStyles[tooltipPosition]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
