/**
 * ProgressTimeline Component
 *
 * Visualization of progression history with timeline view.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Star, Target } from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { useRanksStore } from '../store/ranksStore';
import { RankBadgeAdvanced } from './RankBadgeAdvanced';
import type { ProgressionHistoryEntry } from '../types/ranksTypes';

export interface ProgressTimelineProps {
  limit?: number;
  showAll?: boolean;
  className?: string;
}

/**
 * Get icon for entry type
 */
const getEntryIcon = (type: ProgressionHistoryEntry['type']) => {
  switch (type) {
    case 'rank_up':
      return Award;
    case 'prestige':
      return Star;
    case 'level_up':
      return TrendingUp;
    case 'milestone':
      return Target;
    default:
      return TrendingUp;
  }
};

/**
 * Get color for entry type
 */
const getEntryColor = (type: ProgressionHistoryEntry['type']) => {
  switch (type) {
    case 'rank_up':
      return 'bg-purple-500';
    case 'prestige':
      return 'bg-amber-500';
    case 'level_up':
      return 'bg-blue-500';
    case 'milestone':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

/**
 * Format date relative to now
 */
const formatRelativeDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));

  if (days > 0) return `Hace ${days} día${days !== 1 ? 's' : ''}`;
  if (hours > 0) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  if (minutes > 0) return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
  return 'Justo ahora';
};

/**
 * ProgressTimeline Component
 */
export const ProgressTimeline: React.FC<ProgressTimelineProps> = ({
  limit = 10,
  showAll = false,
  className = '',
}) => {
  const progressionHistory = useRanksStore(state => state.progressionHistory);
  const userProgress = useRanksStore(state => state.userProgress);

  // Sort history by timestamp (most recent first)
  const sortedHistory = [...progressionHistory].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  // Apply limit if not showing all
  const displayedHistory = showAll ? sortedHistory : sortedHistory.slice(0, limit);

  if (displayedHistory.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="text-detective-text-secondary">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Aún no hay historial de progresión</p>
          <p className="text-sm mt-1">
            Completa ejercicios para empezar tu viaje
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-detective-text">
          Historial de Progreso
        </h3>
        <div className="text-sm text-detective-text-secondary">
          {progressionHistory.length} evento{progressionHistory.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {/* Timeline entries */}
        <div className="space-y-6">
          {displayedHistory.map((entry, index) => {
            const Icon = getEntryIcon(entry.type);
            const iconColor = getEntryColor(entry.type);

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-16"
              >
                {/* Icon */}
                <div
                  className={cn(
                    'absolute left-0 w-12 h-12 rounded-full flex items-center justify-center',
                    iconColor,
                    'text-white shadow-md'
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-detective-text">
                          {entry.title}
                        </h4>
                        {entry.rank && (
                          <RankBadgeAdvanced
                            rank={entry.rank}

                            showPrestige={false}
                            animated={false}
                          />
                        )}
                      </div>
                      <p className="text-sm text-detective-text-secondary mb-2">
                        {entry.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-detective-text-secondary">
                        <span>{formatRelativeDate(entry.timestamp)}</span>
                        <span>•</span>
                        <span>Nivel {entry.levelSnapshot}</span>
                        <span>•</span>
                        <span>{entry.xpSnapshot.toLocaleString()} XP</span>
                        <span>•</span>
                        <span>{entry.multiplierSnapshot.toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Show more button */}
        {!showAll && progressionHistory.length > limit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6"
          >
            <button className="px-4 py-2 text-sm text-detective-orange hover:text-detective-orange-dark font-medium">
              Ver todos ({progressionHistory.length - limit} más)
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};
