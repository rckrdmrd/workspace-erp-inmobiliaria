import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Sparkles } from 'lucide-react';
import type { AchievementData } from '../../hooks/useDashboardData';

interface AchievementToastProps {
  achievement: AchievementData;
  onClose: () => void;
  position?: number;
}

const rarityColors = {
  common: {
    bg: 'bg-rarity-common/10',
    border: 'border-rarity-common',
    text: 'text-rarity-common',
    glow: 'shadow-[0_0_15px_rgba(156,163,175,0.5)]',
  },
  rare: {
    bg: 'bg-rarity-rare/10',
    border: 'border-rarity-rare',
    text: 'text-rarity-rare',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]',
  },
  epic: {
    bg: 'bg-rarity-epic/10',
    border: 'border-rarity-epic',
    text: 'text-rarity-epic',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]',
  },
  legendary: {
    bg: 'bg-rarity-legendary/10',
    border: 'border-rarity-legendary',
    text: 'text-rarity-legendary',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.7)]',
  },
};

export function AchievementToast({
  achievement,
  onClose,
  position = 0,
}: AchievementToastProps) {
  const colors = rarityColors[achievement.rarity];

  React.useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 400, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`relative w-full max-w-sm ${colors.bg} ${colors.glow} border-2 ${colors.border} rounded-lg overflow-hidden`}
      style={{ marginTop: position * 8 }}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
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

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: 'easeInOut',
              }}
            >
              <Trophy className={`w-5 h-5 ${colors.text}`} />
            </motion.div>
            <div>
              <p className="text-xs font-semibold text-detective-text-secondary uppercase">
                Logro Desbloqueado
              </p>
              <p className={`text-xs font-bold ${colors.text} uppercase`}>
                {achievement.rarity}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center -m-2 text-detective-text-secondary hover:text-detective-text transition-colors"
            aria-label="Cerrar notificación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Achievement content */}
        <div className="flex items-start gap-4">
          <motion.div
            className={`text-4xl flex-shrink-0`}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
              ease: 'easeInOut',
            }}
          >
            {achievement.icon}
          </motion.div>

          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-bold text-detective-text mb-1">
              {achievement.name}
            </h4>
            <p className="text-sm text-detective-text-secondary">
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Sparkles decoration */}
        <div className="absolute top-2 right-2 pointer-events-none">
          <motion.div
            animate={{
              scale: [0, 1, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
            }}
          >
            <Sparkles className={`w-4 h-4 ${colors.text}`} />
          </motion.div>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className={`h-1 ${colors.text}`}
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 5, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  );
}

export function AchievementToastContainer({
  achievements,
  onRemove,
}: {
  achievements: AchievementData[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        <AnimatePresence mode="popLayout">
          {achievements.slice(0, 3).map((achievement, index) => (
            <AchievementToast
              key={achievement.id}
              achievement={achievement}
              onClose={() => onRemove(achievement.id)}
              position={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
