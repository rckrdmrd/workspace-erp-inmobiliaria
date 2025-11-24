/**
 * AchievementNotification Component
 * Toast notification for achievement unlocks
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  BookOpen,
  Brain,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  Coins,
  Compass,
  Crown,
  Egg,
  Flag,
  Flame,
  Footprints,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Key,
  Layers,
  Link,
  Lock,
  Moon,
  Puzzle,
  Search,
  Shield,
  Sparkles,
  Star,
  Sunrise,
  Target,
  ThumbsUp,
  Timer,
  TrendingUp,
  Trophy,
  UserPlus,
  Users,
  UsersRound,
  X,
  Zap,
  Gem,
  type LucideIcon,
} from 'lucide-react';
import { useAchievements } from '../../hooks/useAchievements';

// Icon mapping for achievement icons
const achievementIconMap: Record<string, LucideIcon> = {
  'footprints': Footprints,
  'target': Target,
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  'compass': Compass,
  'trophy': Trophy,
  'zap': Zap,
  'star': Star,
  'flame': Flame,
  'award': Award,
  'sunrise': Sunrise,
  'moon': Moon,
  'calendar': Calendar,
  'trending-up': TrendingUp,
  'shield': Shield,
  'check-circle': CheckCircle,
  'sparkles': Sparkles,
  'search': Search,
  'timer': Timer,
  'link': Link,
  'check': Check,
  'crown': Crown,
  'brain': Brain,
  'layers': Layers,
  'focus': Target,
  'user-plus': UserPlus,
  'users': Users,
  'flag': Flag,
  'heart-handshake': HeartHandshake,
  'users-round': UsersRound,
  'thumbs-up': ThumbsUp,
  'handshake': Handshake,
  'egg': Egg,
  'clock': Clock,
  'key': Key,
  'puzzle': Puzzle,
  'gem': Gem,
};

export const AchievementNotification: React.FC = () => {
  const { recentUnlocks, dismissNotification } = useAchievements();

  useEffect(() => {
    if (recentUnlocks.length > 0) {
      const timer = setTimeout(() => {
        dismissNotification(recentUnlocks[0].achievement.id);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [recentUnlocks, dismissNotification]);

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2">
      <AnimatePresence>
        {recentUnlocks.slice(0, 3).map((unlock) => {
          const IconComponent = achievementIconMap[unlock.achievement.icon] || Award;

          return (
            <motion.div
              key={unlock.achievement.id}
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              className="bg-white rounded-detective shadow-detective-lg p-4 max-w-sm cursor-pointer hover:shadow-detective"
              onClick={() => dismissNotification(unlock.achievement.id)}
            >
              <div className="flex items-start gap-3">
                <div className="bg-gradient-to-br from-detective-gold to-detective-orange p-2 rounded-lg">
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-detective-sm font-semibold text-detective-orange mb-1">
                    Logro Desbloqueado!
                  </p>
                  <p className="text-detective-base font-bold text-detective-text">
                    {unlock.achievement.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-detective-sm text-detective-text-secondary flex items-center gap-1">
                      <Coins className="w-4 h-4 text-detective-gold" />
                      +{unlock.achievement.mlCoinsReward}
                    </span>
                    <span className="text-detective-sm text-detective-text-secondary flex items-center gap-1">
                      <Zap className="w-4 h-4 text-detective-orange" />
                      +{unlock.achievement.xpReward}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissNotification(unlock.achievement.id);
                  }}
                  className="text-detective-text-secondary hover:text-detective-text"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
