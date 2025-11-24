/**
 * AchievementNotification Component
 *
 * ISSUE: #5.3 (P0) - Achievement Notifications
 * FECHA: 2025-11-04
 * SPRINT: Sprint 3
 *
 * Toast notification para logros desbloqueados
 *
 * Features:
 * - Animación de entrada/salida
 * - Confetti effect
 * - Auto-dismiss con timer
 * - Queue de múltiples logros
 * - Sound effect opcional
 * - Click to dismiss
 */

import React, { useEffect, useState } from 'react';
import { X, Award, Star, Zap } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward?: number;
  ml_coins_reward?: number;
}

interface AchievementNotificationProps {
  achievement: Achievement;
  onDismiss: () => void;
  autoDismiss?: boolean;
  dismissDelay?: number;
  showConfetti?: boolean;
  playSound?: boolean;
}

const RARITY_COLORS = {
  common: {
    gradient: 'from-gray-500 to-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-400',
    text: 'text-gray-900',
  },
  rare: {
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-400',
    text: 'text-blue-900',
  },
  epic: {
    gradient: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-400',
    text: 'text-purple-900',
  },
  legendary: {
    gradient: 'from-yellow-400 to-orange-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    text: 'text-yellow-900',
  },
};

const RARITY_LABELS = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
};

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss,
  autoDismiss = true,
  dismissDelay = 5000,
  showConfetti = true,
  playSound = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  const colors = RARITY_COLORS[achievement.rarity];

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss timer
    let dismissTimer: NodeJS.Timeout;
    let progressInterval: NodeJS.Timeout;

    if (autoDismiss) {
      dismissTimer = setTimeout(() => {
        handleDismiss();
      }, dismissDelay);

      // Update progress bar
      const intervalTime = 50;
      const decrement = (100 / dismissDelay) * intervalTime;
      progressInterval = setInterval(() => {
        setProgress((prev) => Math.max(0, prev - decrement));
      }, intervalTime);
    }

    // Play sound
    if (playSound) {
      // TODO: Add sound effect
      // const audio = new Audio('/sounds/achievement.mp3');
      // audio.play();
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
      clearInterval(progressInterval);
    };
  }, [autoDismiss, dismissDelay, playSound]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(onDismiss, 300); // Wait for exit animation
  };

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div
        className={`
          relative w-96 max-w-[calc(100vw-3rem)]
          rounded-xl shadow-2xl overflow-hidden
          ${colors.bg} border-2 ${colors.border}
        `}
      >
        {/* Gradient header */}
        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`
                flex-shrink-0 w-16 h-16 rounded-full
                bg-gradient-to-br ${colors.gradient}
                flex items-center justify-center
                shadow-lg transform rotate-12 hover:rotate-0 transition-transform
              `}
            >
              {achievement.icon ? (
                <span className="text-3xl">{achievement.icon}</span>
              ) : (
                <Award className="w-8 h-8 text-white" />
              )}
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold uppercase ${colors.text}`}>
                      🏆 ¡Logro Desbloqueado!
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full bg-gradient-to-r ${colors.gradient} text-white`}>
                      {RARITY_LABELS[achievement.rarity]}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 leading-tight">
                    {achievement.title}
                  </h4>
                </div>

                {/* Close button */}
                <button
                  onClick={handleDismiss}
                  className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <p className="text-sm text-gray-700 mb-3">
                {achievement.description}
              </p>

              {/* Rewards */}
              {(achievement.xp_reward || achievement.ml_coins_reward) && (
                <div className="flex items-center gap-3 text-sm font-semibold">
                  {achievement.xp_reward && (
                    <span className="flex items-center text-purple-600">
                      <Zap className="w-4 h-4 mr-1" />
                      +{achievement.xp_reward} XP
                    </span>
                  )}
                  {achievement.ml_coins_reward && (
                    <span className="flex items-center text-yellow-600">
                      <Star className="w-4 h-4 mr-1" />
                      +{achievement.ml_coins_reward} ML Coins
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        {autoDismiss && (
          <div className="h-1 bg-gray-200">
            <div
              className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-50 ease-linear`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Confetti effect */}
        {showConfetti && achievement.rarity !== 'common' && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="confetti-particle absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#10B981', '#667EEA', '#F59E0B', '#EF4444', '#8B5CF6'][
                    Math.floor(Math.random() * 5)
                  ],
                }}
              />
            ))}
          </div>
        )}

        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-shine pointer-events-none" />
      </div>

      {/* Confetti styles */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400%) rotate(360deg);
            opacity: 0;
          }
        }

        .confetti-particle {
          width: 8px;
          height: 8px;
          animation: confetti-fall 3s ease-out forwards;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-12deg);
          }
          100% {
            transform: translateX(200%) skewX(-12deg);
          }
        }

        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

/**
 * AchievementQueue Component
 * Manages multiple achievement notifications in a queue
 */

interface AchievementQueueProps {
  achievements: Achievement[];
  onAchievementsCleared?: () => void;
  maxVisible?: number;
}

export const AchievementQueue: React.FC<AchievementQueueProps> = ({
  achievements,
  onAchievementsCleared,
  maxVisible = 3,
}) => {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const [visible, setVisible] = useState<Achievement[]>([]);

  useEffect(() => {
    setQueue(achievements);
  }, [achievements]);

  useEffect(() => {
    if (queue.length > 0 && visible.length < maxVisible) {
      const next = queue[0];
      setVisible((prev) => [...prev, next]);
      setQueue((prev) => prev.slice(1));
    }
  }, [queue, visible, maxVisible]);

  useEffect(() => {
    if (queue.length === 0 && visible.length === 0 && onAchievementsCleared) {
      onAchievementsCleared();
    }
  }, [queue, visible, onAchievementsCleared]);

  const handleDismiss = (achievementId: string) => {
    setVisible((prev) => prev.filter((a) => a.id !== achievementId));
  };

  return (
    <>
      {visible.map((achievement, index) => (
        <div
          key={achievement.id}
          style={{
            transform: `translateY(-${index * 120}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        >
          <AchievementNotification
            achievement={achievement}
            onDismiss={() => handleDismiss(achievement.id)}
          />
        </div>
      ))}
    </>
  );
};
