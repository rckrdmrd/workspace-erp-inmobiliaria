/**
 * MotivationalBanner Component
 *
 * ISSUE: #2.3 (P0) - Dashboard Motivational Message
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 + Sprint 1 - Opción B
 *
 * Banner con mensaje motivacional personalizado
 */

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Award, Zap } from 'lucide-react';

interface MotivationalMessage {
  message: string;
  emoji: string;
  type: 'encouragement' | 'achievement' | 'streak' | 'challenge';
}

interface MotivationalBannerProps {
  userName?: string;
  userStats?: {
    current_rank: string;
    xp_total: number;
    ml_coins: number;
    exercises_completed_today: number;
    current_streak: number;
    achievements_unlocked_count: number;
  };
  customMessage?: string;
}

const MOTIVATIONAL_MESSAGES: MotivationalMessage[] = [
  {
    message: '¡Cada ejercicio te acerca más a tus metas!',
    emoji: '🎯',
    type: 'encouragement'
  },
  {
    message: '¡Tu dedicación está dando frutos increíbles!',
    emoji: '🌟',
    type: 'encouragement'
  },
  {
    message: '¡Estás haciendo un trabajo fantástico!',
    emoji: '🚀',
    type: 'achievement'
  },
  {
    message: '¡Sigue así! El conocimiento es tu mejor aliado.',
    emoji: '📚',
    type: 'encouragement'
  },
  {
    message: '¡Tu esfuerzo de hoy es el éxito de mañana!',
    emoji: '💪',
    type: 'encouragement'
  },
  {
    message: '¡Cada paso cuenta! Sigue avanzando.',
    emoji: '👣',
    type: 'encouragement'
  },
  {
    message: '¡Eres imparable! Continúa con ese ritmo.',
    emoji: '⚡',
    type: 'streak'
  },
  {
    message: '¡La constancia es la clave del éxito!',
    emoji: '🔑',
    type: 'streak'
  }
];

/**
 * Banner motivacional con mensaje personalizado basado en stats
 */
export const MotivationalBanner = ({
  userName,
  userStats,
  customMessage
}: MotivationalBannerProps) => {
  const [message, setMessage] = useState<MotivationalMessage | null>(null);

  useEffect(() => {
    // Si hay mensaje custom, usarlo
    if (customMessage) {
      setMessage({
        message: customMessage,
        emoji: '🎉',
        type: 'encouragement'
      });
      return;
    }

    // Generar mensaje basado en stats
    let selectedMessage: MotivationalMessage;

    if (userStats) {
      // Streak activo
      if (userStats.current_streak >= 7) {
        selectedMessage = {
          message: `¡${userStats.current_streak} días seguidos! ¡Eres una leyenda! 🔥`,
          emoji: '🔥',
          type: 'streak'
        };
      }
      // Ejercicios completados hoy
      else if (userStats.exercises_completed_today >= 5) {
        selectedMessage = {
          message: `¡${userStats.exercises_completed_today} ejercicios hoy! ¡Estás en llamas!`,
          emoji: '🔥',
          type: 'achievement'
        };
      }
      // Nuevo achievement
      else if (userStats.achievements_unlocked_count > 0) {
        selectedMessage = {
          message: `¡Has desbloqueado ${userStats.achievements_unlocked_count} logro${userStats.achievements_unlocked_count > 1 ? 's' : ''}!`,
          emoji: '🏆',
          type: 'achievement'
        };
      }
      // Mensaje aleatorio
      else {
        const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
        selectedMessage = MOTIVATIONAL_MESSAGES[randomIndex];
      }
    } else {
      // Sin stats, mensaje aleatorio
      const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
      selectedMessage = MOTIVATIONAL_MESSAGES[randomIndex];
    }

    setMessage(selectedMessage);
  }, [userStats, customMessage]);

  if (!message) {
    return null;
  }

  const getIcon = () => {
    switch (message.type) {
      case 'achievement':
        return <Award className="w-6 h-6" />;
      case 'streak':
        return <Zap className="w-6 h-6" />;
      case 'challenge':
        return <TrendingUp className="w-6 h-6" />;
      default:
        return <Sparkles className="w-6 h-6" />;
    }
  };

  const getGradient = () => {
    switch (message.type) {
      case 'achievement':
        return 'from-yellow-500 to-orange-500';
      case 'streak':
        return 'from-red-500 to-pink-500';
      case 'challenge':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  return (
    <div className={`
      relative overflow-hidden rounded-xl p-6
      bg-gradient-to-r ${getGradient()}
      text-white shadow-lg
    `}>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-3xl">{message.emoji}</span>
        </div>

        {/* Message */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">
            {userName ? `¡Hola, ${userName}!` : '¡Hola Detective!'}
          </h2>
          <p className="text-lg opacity-95">
            {message.message}
          </p>

          {/* Stats preview */}
          {userStats && (
            <div className="flex items-center gap-4 mt-3 text-sm opacity-90">
              {userStats.current_streak > 0 && (
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  {userStats.current_streak} día{userStats.current_streak !== 1 ? 's' : ''} seguido{userStats.current_streak !== 1 ? 's' : ''}
                </span>
              )}
              {userStats.exercises_completed_today > 0 && (
                <span className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {userStats.exercises_completed_today} ejercicio{userStats.exercises_completed_today !== 1 ? 's' : ''} hoy
                </span>
              )}
            </div>
          )}
        </div>

        {/* Decorative icon */}
        <div className="hidden md:block opacity-20">
          {getIcon()}
        </div>
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 transform -skew-x-12 animate-shine" />
    </div>
  );
};
