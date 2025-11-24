/**
 * MissionGrid Component
 *
 * Responsive grid layout for mission cards with:
 * - Stagger animation on mount
 * - Loading skeleton
 * - Empty state
 * - Responsive columns (3/2/1)
 * - Filter handling
 *
 * ~200 lines
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search } from 'lucide-react';
import type { Mission, MissionStatus } from '../types/missionsTypes';
import { MissionCard } from './MissionCard';
import { cn } from '@shared/utils/cn';

interface MissionGridProps {
  missions: Mission[];
  loading?: boolean;
  statusFilter?: MissionStatus | 'all';
  onStartMission?: (missionId: string) => void;
  onClaimReward?: (missionId: string) => void;
  onTrackMission?: (missionId: string) => void;
  isTracked?: (missionId: string) => boolean;
  emptyMessage?: string;
}

export function MissionGrid({
  missions,
  loading = false,
  statusFilter = 'all',
  onStartMission,
  onClaimReward,
  onTrackMission,
  isTracked,
  emptyMessage = 'No hay misiones disponibles',
}: MissionGridProps) {
  // Filter missions by status
  const filteredMissions =
    statusFilter === 'all'
      ? missions
      : missions.filter(m => m.status === statusFilter);

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <MissionCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty state
  if (filteredMissions.length === 0) {
    return <MissionGridEmpty message={emptyMessage} />;
  }

  // Grid with missions
  return (
    <motion.div
      layout
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filteredMissions.map((mission, index) => (
          <motion.div
            key={mission.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              delay: index * 0.05,
              duration: 0.4,
            }}
          >
            <MissionCard
              mission={mission}
              onStart={onStartMission}
              onClaim={onClaimReward}
              onTrack={onTrackMission}
              isTracked={isTracked?.(mission.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Loading Skeleton
 */
function MissionCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-2 border-gray-200">
      <div className="animate-pulse">
        {/* Icon and Title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-xl" />
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-3 bg-gray-200 rounded-full" />
        </div>

        {/* Rewards */}
        <div className="flex gap-3 mb-4">
          <div className="h-10 bg-gray-200 rounded-lg w-24" />
          <div className="h-10 bg-gray-200 rounded-lg w-24" />
        </div>

        {/* Timer */}
        <div className="h-4 bg-gray-200 rounded mb-4 w-32" />

        {/* Button */}
        <div className="h-12 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Empty State
 */
interface MissionGridEmptyProps {
  message: string;
}

function MissionGridEmpty({ message }: MissionGridEmptyProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="mb-6"
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center">
            <Target className="w-16 h-16 text-orange-400" />
          </div>

          {/* Animated rings */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 border-4 border-orange-300 rounded-full"
          />
        </div>
      </motion.div>

      <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
        No hay misiones
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        {message}
      </p>

      {/* Decorative elements */}
      <div className="mt-8 flex items-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-2 h-2 bg-orange-400 rounded-full"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-3 h-3 bg-amber-400 rounded-full"
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="w-2 h-2 bg-orange-400 rounded-full"
        />
      </div>
    </motion.div>
  );
}
