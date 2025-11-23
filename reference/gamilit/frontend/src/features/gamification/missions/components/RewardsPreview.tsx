/**
 * RewardsPreview Component
 *
 * Bottom banner showing potential rewards with:
 * - Total potential XP and ML Coins
 * - Earned rewards
 * - Bonus rewards display
 * - Animated coin and XP icons
 * - Motivational text
 * - Progress toward bonus rewards
 *
 * ~180 lines
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  Zap,
  TrendingUp,
  Gift,
  Star,
  Sparkles,
} from 'lucide-react';
import type { MissionRewardsSummary } from '../types/missionsTypes';
import { cn } from '@shared/utils/cn';

interface RewardsPreviewProps {
  summary: MissionRewardsSummary;
  currentTab: string;
}

export function RewardsPreview({ summary, currentTab }: RewardsPreviewProps) {
  const { potential, earned, bonus } = summary;

  const hasBonusAvailable = bonus.allDailyComplete || bonus.allWeeklyComplete;
  const totalPotentialXP = potential.xp + bonus.bonusXP;
  const totalPotentialCoins = potential.mlCoins + bonus.bonusMLCoins;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl shadow-xl p-6 relative overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 2 === 0 ? (
              <Coins className="w-6 h-6" />
            ) : (
              <Zap className="w-5 h-5" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Title & Motivation */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Gift className="w-6 h-6" />
              <h3 className="text-2xl font-bold">
                Recompensas Potenciales
              </h3>
            </div>
            <p className="text-white/90 text-sm">
              {potential.xp === 0 && potential.mlCoins === 0 ? (
                '¡Ya reclamaste todas las recompensas! Vuelve mañana.'
              ) : (
                <>
                  {hasBonusAvailable ? (
                    <span className="font-semibold">
                      ¡Completa todas las misiones {currentTab === 'daily' ? 'diarias' : 'semanales'} para obtener un BONUS increíble!
                    </span>
                  ) : (
                    'Completa misiones para ganar estas recompensas'
                  )}
                </>
              )}
            </p>
          </div>

          {/* Right: Rewards Display */}
          <div className="flex items-center gap-6">
            {/* Earned Rewards */}
            <div className="text-center">
              <div className="text-xs font-semibold mb-2 opacity-90">
                Ya Ganado
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  <Coins className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {earned.mlCoins.toLocaleString()}
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg"
                >
                  <Zap className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {earned.xp.toLocaleString()}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-16 w-px bg-white/30" />

            {/* Potential Rewards */}
            <div className="text-center">
              <div className="text-xs font-semibold mb-2 opacity-90">
                Disponible
              </div>
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
                >
                  <Coins className="w-6 h-6" />
                  <span className="text-2xl font-bold">
                    {totalPotentialCoins.toLocaleString()}
                  </span>
                  {bonus.bonusMLCoins > 0 && (
                    <Star className="w-4 h-4 text-yellow-300" />
                  )}
                </motion.div>

                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                  className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg"
                >
                  <Zap className="w-6 h-6" />
                  <span className="text-2xl font-bold">
                    {totalPotentialXP.toLocaleString()}
                  </span>
                  {bonus.bonusXP > 0 && (
                    <Star className="w-4 h-4 text-yellow-300" />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bonus Section */}
        {(bonus.bonusXP > 0 || bonus.bonusMLCoins > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-6 border-t border-white/30"
          >
            <div className="flex items-center justify-center gap-3">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-lg">
                Bonus por completar todas las misiones:
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-lg border border-yellow-300/30">
                  <Coins className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold">+{bonus.bonusMLCoins}</span>
                </div>
                <div className="flex items-center gap-1 bg-yellow-400/20 px-3 py-1 rounded-lg border border-yellow-300/30">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="font-bold">+{bonus.bonusXP}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
