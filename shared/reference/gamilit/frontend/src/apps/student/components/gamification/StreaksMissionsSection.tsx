/**
 * StreaksMissionsSection Component
 *
 * Displays user's current streak, longest streak, and daily missions with progress
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Flame,
  Trophy,
  Target,
  Check,
  Clock,
  Coins,
  Zap,
  Gift,
  Calendar,
} from 'lucide-react';
import type { StreakData, Mission } from '../../hooks/useGamificationData';

interface StreaksMissionsSectionProps {
  streaks: StreakData;
  missions: Mission[];
}

export function StreaksMissionsSection({ streaks, missions }: StreaksMissionsSectionProps) {
  const handleClaimReward = (missionId: string) => {
    console.log('Claiming reward for mission:', missionId);
    // TODO: Implement claim reward API call
  };

  const getMissionProgress = (mission: Mission) => {
    return Math.min((mission.progress / mission.required) * 100, 100);
  };

  const getMissionIcon = (type: Mission['type']) => {
    switch (type) {
      case 'daily':
        return Calendar;
      case 'weekly':
        return Trophy;
      case 'special':
        return Gift;
      default:
        return Target;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-detective-text flex items-center gap-2">
          <Flame className="w-7 h-7 text-orange-600" />
          Rachas y Misiones
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Streaks Section */}
        <div className="space-y-4">
          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 rounded-xl p-6 shadow-lg border-2 border-orange-300"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-detective-text flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-600" />
                Racha Actual
              </h3>
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              >
                <Flame className="w-8 h-8 text-orange-600" fill="currentColor" />
              </motion.div>
            </div>

            <div className="text-center mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, delay: 0.3 }}
                className="inline-flex items-baseline gap-2"
              >
                <span className="text-6xl font-bold text-orange-600">
                  {streaks.currentStreak}
                </span>
                <span className="text-2xl font-semibold text-orange-500">días</span>
              </motion.div>
            </div>

            <p className="text-center text-detective-text-secondary mb-4">
              ¡Sigue así! Completa al menos un ejercicio hoy para mantener tu racha.
            </p>

            {/* Streak Visualization */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const isActive = index < streaks.currentStreak;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`aspect-square rounded-lg flex items-center justify-center ${
                      isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {isActive ? (
                      <Flame className="w-4 h-4" fill="currentColor" />
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-orange-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-detective-text-secondary">Última actividad:</span>
                <span className="font-semibold text-detective-text">
                  {new Date(streaks.lastActivityDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Longest Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-detective-text flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-detective-gold" />
                  Mejor Racha
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-detective-gold">
                    {streaks.longestStreak}
                  </span>
                  <span className="text-lg font-semibold text-detective-text-secondary">
                    días
                  </span>
                </div>
              </div>
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              >
                <Trophy className="w-16 h-16 text-detective-gold" />
              </motion.div>
            </div>

            {streaks.currentStreak === streaks.longestStreak && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200"
              >
                <p className="text-sm font-medium text-yellow-800 flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  ¡Récord personal! Sigue así para superar tu mejor marca.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Daily Missions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-md border border-gray-200"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-detective-text flex items-center gap-2">
              <Target className="w-5 h-5 text-detective-orange" />
              Misiones Diarias
            </h3>
            <div className="flex items-center gap-1 text-xs text-detective-text-secondary">
              <Clock className="w-4 h-4" />
              <span>
                Renueva en{' '}
                {new Date(missions[0]?.expiresAt || new Date()).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {missions.slice(0, 3).map((mission, index) => {
              const Icon = getMissionIcon(mission.type);
              const progress = getMissionProgress(mission);
              const isCompleted = mission.completed;
              const isClaimed = mission.claimed;

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCompleted && !isClaimed
                      ? 'bg-green-50 border-green-300 shadow-md'
                      : isClaimed
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isCompleted
                          ? 'bg-green-500'
                          : 'bg-gradient-to-br from-detective-orange to-detective-gold'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <Icon className="w-5 h-5 text-white" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-detective-text mb-1">
                        {mission.title}
                      </h4>
                      <p className="text-sm text-detective-text-secondary mb-2">
                        {mission.description}
                      </p>

                      {/* Progress Bar */}
                      {!isClaimed && (
                        <>
                          <div className="flex items-center justify-between text-xs text-detective-text-secondary mb-2">
                            <span>Progreso</span>
                            <span className="font-semibold">
                              {mission.progress}/{mission.required}
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                            <motion.div
                              className={`h-full ${
                                isCompleted
                                  ? 'bg-green-500'
                                  : 'bg-gradient-to-r from-detective-orange to-detective-gold'
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                            />
                          </div>
                        </>
                      )}

                      {/* Rewards */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Coins className="w-4 h-4 text-detective-gold" />
                          <span className="font-semibold text-detective-text">
                            +{mission.reward.coins} ML
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Zap className="w-4 h-4 text-detective-orange" />
                          <span className="font-semibold text-detective-text">
                            +{mission.reward.xp} XP
                          </span>
                        </div>
                      </div>

                      {/* Claim Button */}
                      {isCompleted && !isClaimed && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleClaimReward(mission.id)}
                          className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Gift className="w-4 h-4" />
                          Reclamar Recompensa
                        </motion.button>
                      )}

                      {isClaimed && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <Check className="w-4 h-4" />
                          <span>Recompensa reclamada</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {missions.length === 0 && (
            <div className="text-center py-8 text-detective-text-secondary">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay misiones disponibles en este momento</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
