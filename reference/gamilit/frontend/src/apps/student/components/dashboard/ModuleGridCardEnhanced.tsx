/**
 * ModuleGridCardEnhanced Component
 *
 * Enhanced version with useModuleAccess hook integration
 * - Computes lock state from DB configuration
 * - Shows detailed lock reasons
 * - Displays prerequisite progress
 * - NO hardcoded unlock logic
 */

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Star, Lock, Shield, TrendingUp } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { useModuleAccess } from '@shared/hooks/useModuleAccess';
import type { Module } from '@shared/types';

// ============================================================================
// TYPES
// ============================================================================

interface ModuleGridCardEnhancedProps {
  module: Module;
  userId: string;
  userRango?: string;
  completedModuleIds?: string[];
  onClick?: () => void;
  index?: number;
  showAccessDetails?: boolean; // Show detailed lock reason
}

// ============================================================================
// COMPONENT
// ============================================================================

export function ModuleGridCardEnhanced({
  module,
  userId,
  userRango,
  completedModuleIds = [],
  onClick,
  index = 0,
  showAccessDetails = true,
}: ModuleGridCardEnhancedProps) {
  // ========== Module Access Hook (configurable from DB) ==========
  const {
    isLocked,
    canAccess,
    lockReason,
    missingPrerequisites,
    requiredRango,
    currentRango,
    hasRangoAccess,
    prerequisitesProgress,
    getAccessMessage,
    isLoading,
  } = useModuleAccess({
    module,
    userId,
    userRango,
    completedModuleIds,
    onAccessDenied: (reason) => {
      console.log('Module access denied:', reason);
    },
  });

  // ========== Computed States ==========
  const progress = module.progress ?? 0;
  const isCompleted = progress === 100;
  const isInProgress = progress > 0 && progress < 100;
  const isClickable = canAccess && onClick;

  // ========== Render Loading State ==========
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 h-64 animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  // ========== Render Card ==========
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={isClickable ? { y: -4, scale: 1.02 } : undefined}
      whileTap={isClickable ? { scale: 0.98 } : undefined}
      className="relative"
    >
      <DetectiveCard
        onClick={isClickable ? onClick : undefined}
        className={`h-full flex flex-col touch-manipulation min-h-[44px] ${
          isClickable ? 'cursor-pointer' : 'cursor-not-allowed'
        } ${isLocked ? 'grayscale opacity-60' : ''} border-2 ${
          isCompleted
            ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50'
            : isLocked
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-200'
        }`}
      >
        {/* Lock Overlay - Enhanced with detailed info */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 rounded-xl z-10">
            <div className="text-center px-4">
              <div className="bg-gray-600 rounded-full p-4 mb-3 mx-auto w-fit">
                {lockReason === 'rango' ? (
                  <Shield className="w-8 h-8 text-white" />
                ) : (
                  <Lock className="w-8 h-8 text-white" />
                )}
              </div>

              <p className="text-sm font-semibold text-gray-800 mb-2">Módulo Bloqueado</p>

              {showAccessDetails && (
                <div className="text-xs text-gray-600 space-y-1">
                  <p>{getAccessMessage()}</p>

                  {/* Prerequisites Progress */}
                  {lockReason === 'prerequisites' && missingPrerequisites.length > 0 && (
                    <div className="mt-3 bg-white rounded-lg p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">Progreso</span>
                        <span className="text-xs font-bold text-orange-600">
                          {prerequisitesProgress}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                          style={{ width: `${prerequisitesProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {missingPrerequisites.length} módulo{missingPrerequisites.length > 1 ? 's' : ''} pendiente{missingPrerequisites.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}

                  {/* Rango Info */}
                  {lockReason === 'rango' && requiredRango && (
                    <div className="mt-3 bg-white rounded-lg p-2">
                      <div className="flex items-center justify-center gap-2 text-xs">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span className="font-semibold text-purple-700">
                          Requiere: {requiredRango}
                        </span>
                      </div>
                      {currentRango && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tu rango: {currentRango}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion Badge */}
        {isCompleted && (
          <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full p-3 shadow-lg shadow-yellow-300/50 z-20">
            <Star className="w-5 h-5 text-white fill-white" />
          </div>
        )}

        {/* Rango Badge (if required) */}
        {!isLocked && requiredRango && (
          <div className="absolute -top-2 -left-2 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 shadow-lg z-20">
            <Shield className="w-4 h-4 text-white" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`p-3 rounded-lg ${
                isCompleted
                  ? 'bg-detective-success/10'
                  : isInProgress
                  ? 'bg-detective-orange/10'
                  : 'bg-detective-bg-secondary'
              }`}
              whileHover={!isLocked ? { rotate: 360 } : undefined}
              transition={{ duration: 0.5 }}
            >
              <BookOpen
                className={`w-12 h-12 ${
                  isCompleted
                    ? 'text-detective-success'
                    : isInProgress
                    ? 'text-detective-orange'
                    : 'text-detective-text-secondary'
                }`}
              />
            </motion.div>

            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                <CheckCircle className="w-5 h-5 text-detective-success" />
              </motion.div>
            )}
          </div>

          <div className="flex items-center gap-2 px-2 py-1 bg-detective-bg-secondary rounded text-xs font-semibold text-detective-text">
            <Clock className="w-3 h-3" />
            <span>
              {module.completed_exercises}/{module.exercises_count}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 mb-4">
          <h3 className="text-lg font-bold text-detective-text mb-2 line-clamp-2">
            {module.title}
          </h3>
          {module.subtitle && (
            <p className="text-xs text-detective-text-secondary mb-2 line-clamp-1">
              {module.subtitle}
            </p>
          )}
          <p className="text-sm text-detective-text-secondary line-clamp-2">
            {module.description}
          </p>
        </div>

        {/* Rewards Info (if module has rewards) */}
        {(module.xp_reward || module.ml_coins_reward) && (
          <div className="flex items-center gap-3 mb-3 px-3 py-2 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
            {module.xp_reward && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-orange-600" />
                <span className="text-xs font-semibold text-orange-700">
                  {module.xp_reward} XP
                </span>
              </div>
            )}
            {module.ml_coins_reward && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-600" />
                <span className="text-xs font-semibold text-yellow-700">
                  {module.ml_coins_reward} ML
                </span>
              </div>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-detective-text">Progreso</span>
            <span className="text-xs font-bold text-detective-orange">{progress}%</span>
          </div>

          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className={`absolute inset-y-0 left-0 rounded-full ${
                isCompleted
                  ? 'bg-gradient-to-r from-detective-success to-detective-success'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-detective-bg-secondary">
          <div className="flex items-center gap-1 text-xs text-detective-text-secondary">
            <Star className="w-3 h-3 text-detective-gold fill-detective-gold" />
            <span>{Math.round((progress / 100) * 50)} pts</span>
          </div>

          {isInProgress && (
            <span className="px-2 py-1 bg-detective-orange/10 text-detective-orange rounded text-xs font-medium">
              En progreso
            </span>
          )}

          {isCompleted && (
            <span className="px-2 py-1 bg-detective-success/10 text-detective-success rounded text-xs font-medium">
              Completado
            </span>
          )}

          {!isInProgress && !isCompleted && !isLocked && (
            <span className="px-2 py-1 bg-detective-bg-secondary text-detective-text-secondary rounded text-xs font-medium">
              Sin iniciar
            </span>
          )}

          {isLocked && (
            <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Bloqueado
            </span>
          )}
        </div>
      </DetectiveCard>
    </motion.div>
  );
}
