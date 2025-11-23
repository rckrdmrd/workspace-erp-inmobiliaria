/**
 * PowerUpEffects Component
 * Visual effects for power-up activations
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Shield,
  Star,
  Clock,
  Lightbulb,
  TrendingUp,
  Target,
} from 'lucide-react';

export type PowerUpEffectType =
  | 'time_freeze'
  | 'extra_hint'
  | 'double_xp'
  | 'shield_error'
  | 'instant_reveal'
  | 'score_boost';

interface PowerUpEffectsProps {
  effectType: PowerUpEffectType | null;
  onComplete?: () => void;
  duration?: number;
}

export const PowerUpEffects: React.FC<PowerUpEffectsProps> = ({
  effectType,
  onComplete,
  duration = 2000,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (effectType) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [effectType, duration, onComplete]);

  const getEffectConfig = (type: PowerUpEffectType) => {
    const configs = {
      time_freeze: {
        icon: Clock,
        color: 'from-blue-500 to-cyan-500',
        title: '¡Tiempo Congelado!',
        description: 'El cronómetro se ha detenido temporalmente',
        particles: '❄️',
      },
      extra_hint: {
        icon: Lightbulb,
        color: 'from-yellow-500 to-orange-500',
        title: '¡Pista Extra!',
        description: 'Has desbloqueado una pista adicional',
        particles: '💡',
      },
      double_xp: {
        icon: Star,
        color: 'from-purple-500 to-pink-500',
        title: '¡XP Doble!',
        description: 'Ganarás el doble de XP en este ejercicio',
        particles: '⭐',
      },
      shield_error: {
        icon: Shield,
        color: 'from-green-500 to-emerald-500',
        title: '¡Escudo Activado!',
        description: 'Tu próximo error no contará',
        particles: '🛡️',
      },
      instant_reveal: {
        icon: Target,
        color: 'from-orange-500 to-red-500',
        title: '¡Revelación Instantánea!',
        description: 'Se ha revelado parte de la solución',
        particles: '🎯',
      },
      score_boost: {
        icon: TrendingUp,
        color: 'from-detective-orange to-detective-gold',
        title: '¡Impulso de Puntuación!',
        description: '+25% de puntuación adicional',
        particles: '📈',
      },
    };
    return configs[type];
  };

  if (!effectType || !isVisible) return null;

  const config = getEffectConfig(effectType);
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Particles Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 overflow-hidden"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100,
                scale: 0,
              }}
              animate={{
                y: -100,
                scale: [0, 1.5, 0],
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
              className="absolute text-4xl"
            >
              {config.particles}
            </motion.div>
          ))}
        </motion.div>

        {/* Center Effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="relative"
          >
            {/* Glow Ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className={`absolute inset-0 bg-gradient-to-r ${config.color} rounded-full blur-3xl`}
            />

            {/* Main Card */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`relative bg-white dark:bg-gray-800 rounded-detective shadow-2xl p-8 min-w-[300px] border-4 border-transparent bg-gradient-to-r ${config.color}`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-detective p-6 text-center">
                {/* Icon with Pulse */}
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-detective-text mb-2"
                >
                  {config.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-detective-text-secondary"
                >
                  {config.description}
                </motion.p>

                {/* Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                      }}
                      animate={{
                        x: `${50 + Math.cos((i * Math.PI * 2) / 8) * 100}%`,
                        y: `${50 + Math.sin((i * Math.PI * 2) / 8) * 100}%`,
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.2 + i * 0.1,
                        ease: 'easeOut',
                      }}
                      className="absolute"
                    >
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Screen Flash */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 bg-gradient-to-r ${config.color}`}
        />
      </div>
    </AnimatePresence>
  );
};
