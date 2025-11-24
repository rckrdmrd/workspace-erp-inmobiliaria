/**
 * MissionsPageHero Component
 *
 * Hero section for the Missions page with:
 * - Gradient background with animated elements
 * - Page title and subtitle
 * - 4 stats cards (completed today, weekly progress, rewards, streak)
 * - Maya-themed decorative elements
 *
 * ~180 lines
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Target,
  TrendingUp,
  Coins,
  Flame,
  Sparkles,
  Zap,
} from 'lucide-react';
import type { MissionStats } from '../types/missionsTypes';
import { cn } from '@shared/utils/cn';

interface MissionsPageHeroProps {
  stats: MissionStats;
}

export function MissionsPageHero({ stats }: MissionsPageHeroProps) {
  const todayProgress = stats.todayTotal > 0
    ? Math.round((stats.todayCompleted / stats.todayTotal) * 100)
    : 0;

  const weekProgress = stats.weekTotal > 0
    ? Math.round((stats.weekCompleted / stats.weekTotal) * 100)
    : 0;

  const statsCards = [
    {
      icon: Target,
      label: 'Completadas Hoy',
      value: `${stats.todayCompleted}/${stats.todayTotal}`,
      subtext: `${todayProgress}% completado`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: TrendingUp,
      label: 'Progreso Semanal',
      value: `${stats.weekCompleted}/${stats.weekTotal}`,
      subtext: `${weekProgress}% completado`,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
    },
    {
      icon: Coins,
      label: 'Recompensas Totales',
      value: stats.totalMLCoinsEarned.toLocaleString(),
      subtext: `${stats.totalXPEarned.toLocaleString()} XP ganado`,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
    },
    {
      icon: Flame,
      label: 'Racha Actual',
      value: `${stats.currentStreak} días`,
      subtext: `Récord: ${stats.longestStreak} días`,
      color: 'from-red-500 to-orange-500',
      bgColor: 'from-red-50 to-orange-50',
      borderColor: 'border-red-200',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white py-12 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {i % 3 === 0 ? (
              <Target className="w-8 h-8" />
            ) : i % 3 === 1 ? (
              <Sparkles className="w-6 h-6" />
            ) : (
              <Zap className="w-7 h-7" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3">
            <Target className="w-10 h-10 md:w-12 md:h-12" />
            Misiones Diarias y Semanales
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Completa misiones para ganar recompensas increíbles
          </p>
        </motion.div>

        {/* Stats Cards Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statsCards.map((card, index) => {
            const Icon = card.icon;

            return (
              <motion.div
                key={card.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={cn(
                  'bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg',
                  'border-2',
                  card.borderColor,
                  'transition-all duration-300'
                )}
              >
                {/* Icon */}
                <div
                  className={cn(
                    'w-14 h-14 rounded-xl mb-4',
                    'bg-gradient-to-br',
                    card.color,
                    'flex items-center justify-center',
                    'shadow-md'
                  )}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Label */}
                <div className="text-sm font-semibold text-gray-600 mb-1">
                  {card.label}
                </div>

                {/* Value */}
                <div className="text-3xl font-bold text-gray-800 mb-2">
                  {card.value}
                </div>

                {/* Subtext */}
                <div className="text-xs text-gray-500">
                  {card.subtext}
                </div>

                {/* Progress Bar (for completed stats) */}
                {(index === 0 || index === 1) && (
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${index === 0 ? todayProgress : weekProgress}%`,
                        }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={cn(
                          'h-full bg-gradient-to-r',
                          card.color,
                          'rounded-full'
                        )}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Decorative Gradient Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent pointer-events-none" />
    </motion.section>
  );
}
