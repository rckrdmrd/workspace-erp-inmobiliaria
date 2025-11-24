/**
 * ExerciseHeader Component
 * Header section with back button, title, difficulty, rewards, and stats
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  ArrowLeft,
  Clock,
  Star,
  Coins,
  Target,
  Timer,
  TrendingUp,
} from 'lucide-react';

interface ExerciseHeaderProps {
  moduleId: string;
  exerciseTitle: string;
  exerciseDescription: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'experto';
  xpReward: number;
  mlCoinsReward: number;
  timeLimit?: number;
  currentAttempt: number;
  maxAttempts: number;
  timeElapsed: number;
  score?: number;
}

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  moduleId,
  exerciseTitle,
  exerciseDescription,
  difficulty,
  xpReward,
  mlCoinsReward,
  timeLimit,
  currentAttempt,
  maxAttempts,
  timeElapsed,
  score,
}) => {
  const navigate = useNavigate();

  const getDifficultyConfig = (diff: 'facil' | 'medio' | 'dificil' | 'experto') => {
    const configs = {
      facil: {
        label: 'Fácil',
        color: 'bg-green-100 text-green-700 border-green-300',
        icon: '⭐',
      },
      medio: {
        label: 'Medio',
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        icon: '⭐⭐',
      },
      dificil: {
        label: 'Difícil',
        color: 'bg-red-100 text-red-700 border-red-300',
        icon: '⭐⭐⭐',
      },
      experto: {
        label: 'Experto',
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        icon: '⭐⭐⭐⭐',
      },
    };
    return configs[diff];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyConfig = getDifficultyConfig(difficulty);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 shadow-md border-b-4 border-detective-orange"
    >
      <div className="detective-container py-6">
        {/* Back Button */}
        <div className="mb-4">
          <DetectiveButton
            variant="blue"

            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate(`/modules/${moduleId}`)}
          >
            Volver al Módulo
          </DetectiveButton>
        </div>

        {/* Main Header Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Title and Description */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-3 mb-3">
              <Target className="w-8 h-8 text-detective-orange flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold text-detective-text">
                    {exerciseTitle}
                  </h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${difficultyConfig.color}`}
                  >
                    {difficultyConfig.icon} {difficultyConfig.label}
                  </span>
                </div>
                <p className="text-detective-text-secondary leading-relaxed">
                  {exerciseDescription}
                </p>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center gap-2 mt-4">
              <TrendingUp className="w-5 h-5 text-detective-orange" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-detective-text">
                    Intento {currentAttempt} de {maxAttempts}
                  </span>
                  <span className="text-xs text-detective-text-secondary">
                    {Math.round((currentAttempt / maxAttempts) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(currentAttempt / maxAttempts) * 100}%` }}
                    transition={{ duration: 0.5 }}
                    className="h-full bg-gradient-to-r from-detective-orange to-detective-gold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Stats Cards */}
          <div className="lg:col-span-1 grid grid-cols-2 lg:grid-cols-1 gap-3">
            {/* XP Reward */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-detective-orange to-orange-600 rounded-detective p-4 text-white shadow-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                  Recompensa XP
                </span>
              </div>
              <p className="text-3xl font-bold">{xpReward}</p>
              <p className="text-xs opacity-75 mt-1">Puntos de experiencia</p>
            </motion.div>

            {/* ML Coins Reward */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-detective-gold to-yellow-600 rounded-detective p-4 text-white shadow-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                  ML Coins
                </span>
              </div>
              <p className="text-3xl font-bold">{mlCoinsReward}</p>
              <p className="text-xs opacity-75 mt-1">Monedas de recompensa</p>
            </motion.div>

            {/* Timer */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-detective-blue to-blue-600 rounded-detective p-4 text-white shadow-lg"
            >
              <div className="flex items-center gap-2 mb-1">
                <Timer className="w-5 h-5" />
                <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                  {timeLimit ? 'Tiempo Límite' : 'Tiempo Transcurrido'}
                </span>
              </div>
              <p className="text-3xl font-bold">{formatTime(timeElapsed)}</p>
              {timeLimit && (
                <p className="text-xs opacity-75 mt-1">
                  Límite: {formatTime(timeLimit)}
                </p>
              )}
            </motion.div>

            {/* Score (if available) */}
            {score !== undefined && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-green-500 to-green-700 rounded-detective p-4 text-white shadow-lg"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5" />
                  <span className="text-xs font-semibold uppercase tracking-wide opacity-90">
                    Puntuación
                  </span>
                </div>
                <p className="text-3xl font-bold">{score}</p>
                <p className="text-xs opacity-75 mt-1">Puntos actuales</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
