/**
 * ActiveMissionTracker Component
 *
 * Sidebar component showing currently tracked missions with:
 * - Real-time progress display
 * - Quick claim button
 * - Remove tracking button
 * - Collapsible on tablet
 * - Max 3 tracked missions
 * - Empty state
 *
 * ~250 lines
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  EyeOff,
  Gift,
  X,
  ChevronDown,
  ChevronUp,
  Target,
  Coins,
  Zap,
} from 'lucide-react';
import type { Mission } from '../types/missionsTypes';
import { cn } from '@shared/utils/cn';

interface ActiveMissionTrackerProps {
  trackedMissions: Mission[];
  onClaim?: (missionId: string) => void;
  onUntrack?: (missionId: string) => void;
  maxTracked?: number;
}

export function ActiveMissionTracker({
  trackedMissions,
  onClaim,
  onUntrack,
  maxTracked = 3,
}: ActiveMissionTrackerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Empty state
  if (trackedMissions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 lg:sticky lg:top-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Eye className="w-5 h-5 text-orange-500" />
            Misiones Rastreadas
          </h3>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <EyeOff className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-600">
            No estás rastreando ninguna misión
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Haz clic en el ícono de ojo en una misión para rastrearla
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl shadow-lg border-2 border-orange-200 lg:sticky lg:top-6 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <h3 className="text-lg font-bold">Misiones Rastreadas</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold bg-white/20 px-2 py-1 rounded-full">
              {trackedMissions.length}/{maxTracked}
            </span>
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 lg:hidden" />
            </motion.div>
          </div>
        </button>
      </div>

      {/* Content */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-3">
              {trackedMissions.map((mission, index) => (
                <TrackedMissionItem
                  key={mission.id}
                  mission={mission}
                  index={index}
                  onClaim={onClaim}
                  onUntrack={onUntrack}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Individual Tracked Mission Item
 */
interface TrackedMissionItemProps {
  mission: Mission;
  index: number;
  onClaim?: (missionId: string) => void;
  onUntrack?: (missionId: string) => void;
}

function TrackedMissionItem({
  mission,
  index,
  onClaim,
  onUntrack,
}: TrackedMissionItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative p-4 rounded-lg border-2 transition-all',
        mission.status === 'completed'
          ? 'bg-green-50 border-green-300'
          : 'bg-blue-50 border-blue-300'
      )}
    >
      {/* Untrack Button */}
      <button
        onClick={() => onUntrack?.(mission.id)}
        className="absolute top-2 right-2 p-1 hover:bg-white/50 rounded-full transition-colors"
        title="Dejar de rastrear"
      >
        <X className="w-4 h-4 text-gray-600" />
      </button>

      {/* Title */}
      <h4 className="font-bold text-gray-800 mb-2 pr-6 text-sm line-clamp-1">
        {mission.title}
      </h4>

      {/* Progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-600 font-medium">Progreso</span>
          <span className="font-bold text-gray-800">
            {mission.currentValue}/{mission.targetValue}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-white rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${mission.progress}%` }}
            transition={{ duration: 0.5 }}
            className={cn(
              'h-full rounded-full',
              mission.status === 'completed'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            )}
          />
        </div>

        <div className="text-right text-xs text-gray-600 mt-1">
          {mission.progress}%
        </div>
      </div>

      {/* Rewards */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-amber-200">
          <Coins className="w-3 h-3 text-amber-600" />
          <span className="text-xs font-bold text-amber-700">
            {mission.mlCoinsReward}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-blue-200">
          <Zap className="w-3 h-3 text-blue-600" />
          <span className="text-xs font-bold text-blue-700">
            {mission.xpReward}
          </span>
        </div>
      </div>

      {/* Action Button */}
      {mission.status === 'completed' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onClaim?.(mission.id)}
          className={cn(
            'w-full py-2 rounded-lg font-semibold text-sm',
            'bg-gradient-to-r from-green-500 to-emerald-500',
            'hover:from-green-600 hover:to-emerald-600',
            'text-white flex items-center justify-center gap-2',
            'shadow-md transition-all'
          )}
        >
          <Gift className="w-4 h-4" />
          Reclamar
        </motion.button>
      )}

      {mission.status === 'in_progress' && (
        <div className="text-center py-2 text-xs font-semibold text-blue-600">
          En progreso...
        </div>
      )}
    </motion.div>
  );
}
