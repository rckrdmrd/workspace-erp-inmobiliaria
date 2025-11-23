/**
 * GamificationHero Component
 *
 * Hero section displaying user's current rank, XP progress, ML Coins balance, and stats
 * Features animations and gradient backgrounds following detective theme
 */

import React from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Coins, Zap, TrendingUp, Award, Star } from 'lucide-react';
import type { RankData, MLCoinsData } from '../../hooks/useDashboardData';

interface GamificationHeroProps {
  user: {
    id: string;
    email: string;
    full_name: string;
    avatar?: string;
  };
  rankData: RankData;
  mlCoins: number;
  currentXP: number;
  nextRankXP: number;
}

const MAYA_RANKS = {
  Ajaw: {
    name: 'Ajaw - Señor',
    icon: '🏹',
    color: 'from-gray-600 to-gray-800',
    level: 1
  },
  Nacom: {
    name: 'Nacom - Capitán de Guerra',
    icon: '🔍',
    color: 'from-blue-600 to-blue-800',
    level: 2
  },
  'Ah K\'in': {
    name: 'Ah K\'in - Sacerdote del Sol',
    icon: '🗡️',
    color: 'from-purple-600 to-purple-800',
    level: 3
  },
  'Halach Uinic': {
    name: 'Halach Uinic - Hombre Verdadero',
    icon: '⚔️',
    color: 'from-orange-600 to-red-700',
    level: 4
  },
  'K\'uk\'ulkan': {
    name: 'K\'uk\'ulkan - Serpiente Emplumada',
    icon: '👑',
    color: 'from-yellow-500 to-orange-600',
    level: 5
  },
};

export function GamificationHero({
  user,
  rankData,
  mlCoins,
  currentXP,
  nextRankXP,
}: GamificationHeroProps) {
  const rankInfo = MAYA_RANKS[rankData.currentRank as keyof typeof MAYA_RANKS] || MAYA_RANKS.Nacom;
  const progressPercent = (currentXP / nextRankXP) * 100;
  const xpRemaining = nextRankXP - currentXP;

  // Animated counters
  const coinsSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  const xpSpring = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  React.useEffect(() => {
    coinsSpring.set(mlCoins);
    xpSpring.set(currentXP);
  }, [mlCoins, currentXP, coinsSpring, xpSpring]);

  const displayCoins = useTransform(coinsSpring, (value) =>
    Math.round(value).toLocaleString()
  );

  const displayXP = useTransform(xpSpring, (value) =>
    Math.round(value).toLocaleString()
  );

  return (
    <div className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-orange-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: 'linear',
          }}
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
          {/* Left: Rank Badge */}
          <div className="flex flex-col items-center text-center lg:w-1/4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 0],
                transition: { duration: 0.5 }
              }}
              className="relative mb-4"
            >
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${rankInfo.color} flex items-center justify-center text-6xl shadow-2xl border-4 border-white/30`}>
                {rankInfo.icon}
              </div>

              {/* Floating particles */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  initial={{
                    x: 0,
                    y: 0,
                    opacity: 0
                  }}
                  animate={{
                    x: [0, Math.random() * 40 - 20],
                    y: [0, Math.random() * 40 - 20],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2 + i,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              {rankInfo.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 text-sm"
            >
              Nivel {rankInfo.level} • {rankData.currentRank}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full flex items-center gap-2"
            >
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-bold">{rankData.multiplier}x Multiplicador</span>
            </motion.div>
          </div>

          {/* Center: XP Progress */}
          <div className="flex-1 lg:w-1/2 w-full">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-white/90 text-lg mb-2 font-semibold">
                Tu Progreso de un Vistazo
              </h3>

              {/* XP Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80 text-sm">
                    Progreso al siguiente rango
                  </span>
                  <span className="text-white font-bold text-lg">
                    {Math.round(progressPercent)}%
                  </span>
                </div>

                <div className="relative h-8 bg-black/30 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-end pr-4"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{
                      type: 'spring',
                      stiffness: 100,
                      damping: 20,
                      delay: 0.5,
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                      }}
                    >
                      <Star className="w-5 h-5 text-white" fill="white" />
                    </motion.div>

                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear',
                        repeatDelay: 1,
                      }}
                    />
                  </motion.div>

                  {/* XP text inside bar */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-sm drop-shadow-lg">
                      <motion.span>{displayXP}</motion.span> / {nextRankXP.toLocaleString()} XP
                    </span>
                  </div>
                </div>

                <p className="text-white/70 text-sm mt-2">
                  {xpRemaining.toLocaleString()} XP restantes para subir de rango
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-green-300" />
                    <span className="text-white/80 text-xs">Nivel</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{rankInfo.level}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span className="text-white/80 text-xs">XP Total</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    <motion.span>{displayXP}</motion.span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-purple-300" />
                    <span className="text-white/80 text-xs">Multiplicador</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{rankData.multiplier}x</p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right: ML Coins */}
          <div className="lg:w-1/4 w-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-2xl p-6 shadow-2xl border-4 border-white/30"
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3,
                    ease: 'easeInOut',
                  }}
                >
                  <Coins className="w-12 h-12 text-white drop-shadow-lg" />
                </motion.div>
              </div>

              <h3 className="text-white/90 text-sm text-center mb-2 font-semibold">
                Saldo ML Coins
              </h3>

              <motion.div
                className="text-center"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  delay: 0.6,
                }}
              >
                <motion.p className="text-5xl font-bold text-white drop-shadow-lg mb-1">
                  <motion.span>{displayCoins}</motion.span>
                </motion.p>
                <p className="text-white/80 text-lg font-semibold">ML</p>
              </motion.div>

              {/* Floating coin animation */}
              <div className="relative mt-4 h-8">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 transform -translate-x-1/2"
                    initial={{ y: 0, opacity: 0 }}
                    animate={{
                      y: [-30, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      delay: i * 0.3,
                      ease: 'easeOut',
                    }}
                  >
                    <Coins className="w-6 h-6 text-white" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
    </div>
  );
}
