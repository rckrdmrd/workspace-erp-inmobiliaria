/**
 * CompletionModal Component
 * Displays exercise completion with XP/ML Coins animations, achievements, and next steps
 */

import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useProgression } from '@/features/gamification/ranks/hooks/useProgression';
import { useCoins } from '@/features/gamification/economy/hooks/useCoins';
import { useAchievementsStore } from '@/features/gamification/social/store/achievementsStore';
import {
  Trophy,
  Star,
  Coins,
  RotateCcw,
  ChevronRight,
  ArrowLeft,
  Award,
  Target,
  Clock,
  Zap,
  Crown,
  Flame,
} from 'lucide-react';

/**
 * Achievement from backend API
 * Supports both legacy and new format
 */
interface Achievement {
  id: string;
  // Legacy format
  name?: string;
  description?: string;
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  // New format from backend (Sprint 2)
  key?: string;
  title?: string;
  mlCoinsReward?: number;
  xpReward?: number;
  iconUrl?: string;
}

interface CompletionModalProps {
  isOpen: boolean;
  success: boolean;
  score: number;
  maxScore: number;
  xpGained: number;
  mlCoinsGained: number;
  timeSpent: number;
  hintsUsed: number;
  achievements?: Achievement[];
  moduleId: string;
  exerciseId?: string;
  onClose: () => void;
  onRetry: () => void;
  onNextExercise?: () => void;
  // Sprint 2 - New fields
  rankUp?: {
    newRank: string;
    previousRank?: string;
    bonusMLCoins: number;
    newMultiplier: number;
  } | null;
  streakInfo?: {
    currentStreak: number;
    milestone: boolean;
    reward: number;
  };
}

export const CompletionModal: React.FC<CompletionModalProps> = ({
  isOpen,
  success,
  score,
  maxScore,
  xpGained,
  mlCoinsGained,
  timeSpent,
  hintsUsed,
  achievements = [],
  moduleId,
  exerciseId = 'unknown',
  onClose,
  onRetry,
  onNextExercise,
  rankUp,
  streakInfo,
}) => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [animatedXP, setAnimatedXP] = useState(0);
  const [animatedCoins, setAnimatedCoins] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Gamification hooks
  const { addXP, checkRankUp } = useProgression();
  const { earnCoins } = useCoins();
  const { unlockAchievement } = useAchievementsStore();

  // Ref to prevent duplicate reward application
  const rewardsApplied = useRef(false);

  /**
   * Apply gamification rewards (XP, ML Coins, Achievements)
   */
  const applyRewards = async () => {
    try {
      // Add XP
      if (xpGained > 0) {
        await addXP(xpGained, 'exercise_completion', exerciseId);
        console.log(`✅ XP Added: +${xpGained} XP`);
      }

      // Add ML Coins
      if (mlCoinsGained > 0) {
        earnCoins(mlCoinsGained, 'exercise_completion', exerciseId);
        console.log(`✅ ML Coins Added: +${mlCoinsGained} ML`);
      }

      // Check for rank up
      const didRankUp = checkRankUp();
      if (didRankUp) {
        console.log('🎉 ¡Felicidades! Has subido de rango. Revisa tu perfil para ver tu nuevo rango.');
      }

      // Unlock achievements
      if (achievements && achievements.length > 0) {
        achievements.forEach((achievement) => {
          unlockAchievement(achievement.id);
          console.log(`🏆 ¡Logro Desbloqueado: ${achievement.name}! - ${achievement.description}`);
        });
      }

      console.log('✅ Rewards applied successfully:', {
        xpGained,
        mlCoinsGained,
        achievementsUnlocked: achievements.length,
        exerciseId,
        didRankUp,
      });
    } catch (error) {
      console.error('❌ Error applying rewards:', error);
      console.error('Las recompensas pueden no haberse guardado correctamente');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isOpen && success) {
      setShowConfetti(true);

      // Animate XP counter
      const xpInterval = setInterval(() => {
        setAnimatedXP((prev) => {
          if (prev >= xpGained) {
            clearInterval(xpInterval);
            return xpGained;
          }
          return prev + Math.ceil(xpGained / 30);
        });
      }, 30);

      // Animate Coins counter
      const coinsInterval = setInterval(() => {
        setAnimatedCoins((prev) => {
          if (prev >= mlCoinsGained) {
            clearInterval(coinsInterval);
            return mlCoinsGained;
          }
          return prev + Math.ceil(mlCoinsGained / 30);
        });
      }, 30);

      // Stop confetti after 5 seconds
      const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);

      return () => {
        clearInterval(xpInterval);
        clearInterval(coinsInterval);
        clearTimeout(confettiTimer);
      };
    } else {
      setAnimatedXP(0);
      setAnimatedCoins(0);
      setShowConfetti(false);
    }
  }, [isOpen, success, xpGained, mlCoinsGained]);

  // Apply rewards when modal opens with success
  useEffect(() => {
    if (isOpen && success && !rewardsApplied.current) {
      applyRewards();
      rewardsApplied.current = true;
    }

    // Reset ref when modal closes
    if (!isOpen) {
      rewardsApplied.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, success]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScorePercentage = () => Math.round((score / maxScore) * 100);

  const getPerformanceMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 90) return '¡Excelente trabajo!';
    if (percentage >= 75) return '¡Muy bien hecho!';
    if (percentage >= 60) return '¡Buen trabajo!';
    if (percentage >= 50) return 'Aprobado';
    return 'Sigue intentando';
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-purple-500 to-pink-500';
      case 'epic':
        return 'from-purple-500 to-indigo-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  // Helper to get achievement display data (supports both formats)
  const getAchievementDisplay = (achievement: Achievement) => {
    return {
      name: achievement.title || achievement.name || 'Achievement',
      description: achievement.description || '',
      icon: achievement.iconUrl || achievement.icon || '🏆',
      rarity: achievement.rarity || 'common',
      mlCoinsReward: achievement.mlCoinsReward || 0,
      xpReward: achievement.xpReward || 0
    };
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Confetti */}
        {showConfetti && success && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.3}
          />
        )}

        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="relative bg-white dark:bg-gray-800 rounded-detective shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div
            className={`p-8 rounded-t-detective ${
              success
                ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                : 'bg-gradient-to-br from-orange-500 to-red-600'
            }`}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                {success ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <Target className="w-12 h-12 text-white" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {success ? '¡Ejercicio Completado!' : 'Ejercicio Enviado'}
              </h2>
              <p className="text-white/90 text-lg">{getPerformanceMessage()}</p>
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Score Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="relative inline-block">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    className="text-gray-200"
                  />
                  <motion.circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 70}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 70 * (1 - score / maxScore),
                    }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={success ? 'text-green-500' : 'text-orange-500'}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-detective-text">{score}</span>
                  <span className="text-sm text-detective-text-secondary">/ {maxScore}</span>
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-detective-text">
                {getScorePercentage()}%
              </p>
            </motion.div>

            {/* Rewards */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-4"
              >
                {/* XP Gained */}
                <div className="bg-gradient-to-br from-detective-orange to-orange-600 rounded-detective p-6 text-white text-center">
                  <Star className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">XP Ganado</p>
                  <motion.p
                    className="text-3xl font-bold"
                    key={animatedXP}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    +{animatedXP}
                  </motion.p>
                </div>

                {/* ML Coins Gained */}
                <div className="bg-gradient-to-br from-detective-gold to-yellow-600 rounded-detective p-6 text-white text-center">
                  <Coins className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90 mb-1">ML Coins</p>
                  <motion.p
                    className="text-3xl font-bold"
                    key={animatedCoins}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    +{animatedCoins}
                  </motion.p>
                </div>
              </motion.div>
            )}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-detective p-6 space-y-3"
            >
              <h3 className="font-bold text-detective-text mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-detective-orange" />
                Estadísticas del Ejercicio
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-detective-blue" />
                  <span className="text-detective-text-secondary">Tiempo:</span>
                  <span className="font-semibold text-detective-text ml-auto">
                    {formatTime(timeSpent)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-detective-gold" />
                  <span className="text-detective-text-secondary">Pistas usadas:</span>
                  <span className="font-semibold text-detective-text ml-auto">{hintsUsed}</span>
                </div>
              </div>
            </motion.div>

            {/* Rank Up Notification */}
            {rankUp && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-detective text-white"
              >
                <div className="text-center">
                  <Crown className="w-16 h-16 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">¡Rango Mejorado!</h3>
                  <p className="text-lg mb-3">
                    {rankUp.previousRank && <span className="opacity-75">{rankUp.previousRank} → </span>}
                    <span className="font-bold">{rankUp.newRank}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-sm opacity-90 mb-1">Bonus ML Coins</p>
                      <p className="text-2xl font-bold">+{rankUp.bonusMLCoins}</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-3">
                      <p className="text-sm opacity-90 mb-1">Nuevo Multiplicador</p>
                      <p className="text-2xl font-bold">{rankUp.newMultiplier}x</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Streak Milestone */}
            {streakInfo && streakInfo.milestone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, type: 'spring', stiffness: 200 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-detective text-white"
              >
                <div className="text-center">
                  <Flame className="w-16 h-16 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold mb-2">¡Racha Alcanzada!</h3>
                  <p className="text-3xl font-bold mb-2">{streakInfo.currentStreak} días</p>
                  <p className="text-lg mb-3">¡Sigue así!</p>
                  <div className="bg-white/20 rounded-lg p-3 mt-4">
                    <p className="text-sm opacity-90 mb-1">Recompensa de Racha</p>
                    <p className="text-2xl font-bold">+{streakInfo.reward} ML Coins</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <h3 className="font-bold text-detective-text flex items-center gap-2">
                  <Award className="w-5 h-5 text-detective-gold" />
                  ¡Logros Desbloqueados!
                </h3>
                <div className="space-y-2">
                  {achievements.map((achievement, index) => {
                    const display = getAchievementDisplay(achievement);
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + index * 0.1 }}
                        className={`bg-gradient-to-r ${getRarityColor(
                          display.rarity
                        )} p-4 rounded-detective text-white`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{display.icon}</span>
                          <div className="flex-1">
                            <p className="font-bold">{display.name}</p>
                            <p className="text-sm opacity-90">{display.description}</p>
                            <div className="flex gap-2 mt-2">
                              {display.mlCoinsReward > 0 && (
                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                  +{display.mlCoinsReward} 💰
                                </span>
                              )}
                              {display.xpReward > 0 && (
                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-semibold">
                                  +{display.xpReward} ⭐
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-3 pt-4"
            >
              <DetectiveButton
                variant="secondary"
                onClick={() => navigate(`/modules/${moduleId}`)}
                icon={<ArrowLeft className="w-4 h-4" />}
                className="flex-1"
              >
                Volver al Módulo
              </DetectiveButton>

              {!success && (
                <DetectiveButton
                  variant="blue"
                  onClick={onRetry}
                  icon={<RotateCcw className="w-4 h-4" />}
                  className="flex-1"
                >
                  Reintentar
                </DetectiveButton>
              )}

              {onNextExercise && (
                <DetectiveButton
                  variant="primary"
                  onClick={onNextExercise}
                  icon={<ChevronRight className="w-4 h-4" />}
                  className="flex-1"
                >
                  Siguiente Ejercicio
                </DetectiveButton>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
