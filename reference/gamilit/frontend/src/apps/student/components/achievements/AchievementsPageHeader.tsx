/**
 * AchievementsPageHeader Component
 * Hero section with stats and progress visualization
 * ~150 lines
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Coins, Zap, Award, Lock, TrendingUp } from 'lucide-react';
import type { AchievementStatistics } from './types';

interface AchievementsPageHeaderProps {
  statistics: AchievementStatistics;
}

export const AchievementsPageHeader: React.FC<AchievementsPageHeaderProps> = ({
  statistics,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Progress circle SVG
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = statistics.completionRate;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative bg-gradient-to-br from-detective-orange via-orange-500 to-detective-gold text-white py-16 overflow-hidden"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
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
            <Sparkles className="w-4 h-4" />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Side - Title and Stats */}
          <motion.div variants={itemVariants} className="flex-1 text-center lg:text-left">
            {/* Title */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Trophy className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-2">
                  Tus Logros
                </h1>
                <p className="text-xl opacity-90">
                  Celebrando tus conquistas
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {/* Total Achievements */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md rounded-xl p-4 border-2 border-white/30"
              >
                <Award className="w-8 h-8 mb-2 mx-auto lg:mx-0" />
                <div className="text-3xl font-bold">
                  {statistics.unlocked}/{statistics.total}
                </div>
                <div className="text-sm opacity-90">Logros</div>
              </motion.div>

              {/* Completion Rate */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md rounded-xl p-4 border-2 border-white/30"
              >
                <TrendingUp className="w-8 h-8 mb-2 mx-auto lg:mx-0" />
                <div className="text-3xl font-bold">
                  {statistics.completionRate.toFixed(0)}%
                </div>
                <div className="text-sm opacity-90">Completado</div>
              </motion.div>

              {/* ML Coins Earned */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md rounded-xl p-4 border-2 border-white/30"
              >
                <Coins className="w-8 h-8 mb-2 mx-auto lg:mx-0" />
                <div className="text-3xl font-bold">
                  {statistics.mlCoinsEarned.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">ML Coins</div>
              </motion.div>

              {/* XP Earned */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                className="bg-white/20 backdrop-blur-md rounded-xl p-4 border-2 border-white/30"
              >
                <Zap className="w-8 h-8 mb-2 mx-auto lg:mx-0" />
                <div className="text-3xl font-bold">
                  {statistics.pointsEarned.toLocaleString()}
                </div>
                <div className="text-sm opacity-90">XP Ganado</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side - Circular Progress */}
          <motion.div
            variants={itemVariants}
            className="flex-shrink-0"
          >
            <div className="relative">
              <svg width="200" height="200" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeWidth="12"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  stroke="white"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </svg>

              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl font-bold">
                  {statistics.completionRate.toFixed(0)}%
                </div>
                <div className="text-sm opacity-90">Completado</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
