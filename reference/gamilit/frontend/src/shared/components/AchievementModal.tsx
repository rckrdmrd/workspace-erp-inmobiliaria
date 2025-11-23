import React, { useState } from 'react';
import { X, Trophy, Gift, Lock, CheckCircle, Loader } from 'lucide-react';
import { Modal } from './Modal';
import { cn } from '@shared/utils';
import { formatRelativeTime } from '@/shared/utils/format.util';
import type { Achievement, UserAchievement, AchievementStatus } from '@/shared/types/achievement.types';

/**
 * AchievementModal Props
 */
interface AchievementModalProps {
  achievement: Achievement;
  userAchievement?: UserAchievement;
  isOpen: boolean;
  onClose: () => void;
  onClaimRewards?: (achievementId: string) => Promise<void>;
}

/**
 * Get category color
 */
const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    progress: 'text-blue-600 bg-blue-100',
    streak: 'text-orange-600 bg-orange-100',
    completion: 'text-green-600 bg-green-100',
    social: 'text-purple-600 bg-purple-100',
    special: 'text-pink-600 bg-pink-100',
    mastery: 'text-yellow-600 bg-yellow-100',
    exploration: 'text-cyan-600 bg-cyan-100',
  };
  return colors[category] || 'text-gray-600 bg-gray-100';
};

/**
 * Get status from user achievement
 */
const getStatus = (userAchievement?: UserAchievement): AchievementStatus => {
  if (!userAchievement) return 'locked' as AchievementStatus;
  return userAchievement.status;
};

/**
 * AchievementModal Component
 *
 * Modal displaying full achievement details with claim rewards functionality.
 *
 * Features:
 * - Large icon/animation display
 * - Full name and detailed description
 * - Category and rarity badges
 * - Requirements breakdown (conditions)
 * - Progress tracking with visual progress bars
 * - Rewards preview (XP, ML Coins, items)
 * - "Claim Rewards" button for earned achievements
 * - Earned date and claimed date
 * - Close button and click-outside to close
 * - Escape key to close
 * - Loading state for claim action
 * - Success/error feedback
 */
export const AchievementModal: React.FC<AchievementModalProps> = ({
  achievement,
  userAchievement,
  isOpen,
  onClose,
  onClaimRewards,
}) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const status = getStatus(userAchievement);
  const progress = userAchievement?.progress || 0;
  const isLocked = status === 'locked';
  const isEarned = status === 'earned';
  const isClaimed = status === 'claimed';
  const isInProgress = status === 'in_progress';
  const isHidden = achievement.isHidden && isLocked;

  /**
   * Handle claim rewards
   */
  const handleClaimRewards = async () => {
    if (!onClaimRewards || !isEarned) return;

    try {
      setIsClaiming(true);
      setClaimError(null);
      await onClaimRewards(achievement.id);
      // Modal will be closed by parent after successful claim
    } catch (error) {
      console.error('Failed to claim rewards:', error);
      setClaimError('Error al reclamar recompensas. Inténtalo de nuevo.');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Icon/Badge (Large) */}
        <div className="flex justify-center mb-6">
          <div
            className={cn(
              'w-24 h-24 rounded-full flex items-center justify-center text-5xl',
              isLocked ? 'bg-gray-200' : 'bg-gradient-to-br from-yellow-100 to-orange-100 shadow-lg'
            )}
          >
            {isHidden ? (
              <span className="text-gray-400">???</span>
            ) : isLocked ? (
              <Lock className="w-12 h-12 text-gray-400" />
            ) : (
              <span>{achievement.icon || '🏆'}</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h2
          className={cn(
            'text-2xl font-bold text-center mb-2',
            isLocked ? 'text-gray-500' : 'text-gray-900'
          )}
        >
          {isHidden ? 'Logro Oculto' : achievement.name}
        </h2>

        {/* Category & Rarity Badges */}
        <div className="flex justify-center space-x-2 mb-4">
          <span
            className={cn(
              'px-3 py-1 rounded-full text-xs font-semibold',
              getCategoryColor(achievement.category)
            )}
          >
            {achievement.category.toUpperCase()}
          </span>
          {achievement.rarity && !isHidden && (
            <span
              className={cn(
                'px-3 py-1 rounded-full text-xs font-semibold',
                achievement.rarity === 'legendary' && 'bg-yellow-100 text-yellow-800',
                achievement.rarity === 'epic' && 'bg-purple-100 text-purple-800',
                achievement.rarity === 'rare' && 'bg-blue-100 text-blue-800',
                achievement.rarity === 'common' && 'bg-gray-100 text-gray-600'
              )}
            >
              {achievement.rarity.toUpperCase()}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-center text-gray-600 mb-6">
          {isHidden
            ? 'Este es un logro oculto. Sigue jugando para descubrir cómo desbloquearlo.'
            : achievement.detailedDescription || achievement.description}
        </p>

        {/* Status Badge */}
        <div className="flex justify-center mb-6">
          {isLocked && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
              <Lock className="w-4 h-4 mr-2" />
              Bloqueado
            </span>
          )}
          {isInProgress && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              <Trophy className="w-4 h-4 mr-2" />
              En Progreso {Math.round(progress)}%
            </span>
          )}
          {isEarned && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <CheckCircle className="w-4 h-4 mr-2" />
              Ganado - Listo para Reclamar
            </span>
          )}
          {isClaimed && (
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              <Gift className="w-4 h-4 mr-2" />
              Reclamado
            </span>
          )}
        </div>

        {/* Progress Breakdown (if not hidden) */}
        {!isHidden && achievement.conditions && achievement.conditions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos</h3>
            <div className="space-y-3">
              {achievement.conditions.map((condition, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">{condition.description}</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {condition.current || 0} / {condition.target}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          ((condition.current || 0) / condition.target) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Overall Progress (if in progress) */}
        {isInProgress && !isHidden && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Progreso Total</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Completado</span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Rewards */}
        {!isHidden && achievement.rewards && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Recompensas</h3>
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
              <div className="flex justify-center space-x-6">
                {achievement.rewards.xp > 0 && (
                  <div className="text-center">
                    <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-yellow-600">
                      {achievement.rewards.xp}
                    </p>
                    <p className="text-sm text-gray-600">XP</p>
                  </div>
                )}
                {achievement.rewards.mlCoins > 0 && (
                  <div className="text-center">
                    <Gift className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-purple-600">
                      {achievement.rewards.mlCoins}
                    </p>
                    <p className="text-sm text-gray-600">ML Coins</p>
                  </div>
                )}
              </div>
              {achievement.rewards.rankPromotion && (
                <div className="mt-4 text-center">
                  <p className="text-sm font-semibold text-purple-600">
                    + Promoción de Rango: {achievement.rewards.rankPromotion}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dates */}
        {!isHidden && (isEarned || isClaimed) && (
          <div className="mb-6 text-center text-sm text-gray-500 space-y-1">
            {userAchievement?.earnedAt && (
              <p>Ganado {formatRelativeTime(userAchievement.earnedAt)}</p>
            )}
            {userAchievement?.claimedAt && (
              <p>Reclamado {formatRelativeTime(userAchievement.claimedAt)}</p>
            )}
          </div>
        )}

        {/* Claim Error */}
        {claimError && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {claimError}
          </div>
        )}

        {/* Claim Button */}
        {isEarned && onClaimRewards && (
          <button
            onClick={handleClaimRewards}
            disabled={isClaiming}
            className={cn(
              'w-full py-3 rounded-lg font-semibold text-white transition-all',
              'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center justify-center space-x-2'
            )}
          >
            {isClaiming ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Reclamando...</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>Reclamar Recompensas</span>
              </>
            )}
          </button>
        )}

        {/* Close Button (bottom) */}
        {!isEarned && (
          <button
            onClick={onClose}
            className="w-full py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        )}
      </div>
    </Modal>
  );
};

export default AchievementModal;
