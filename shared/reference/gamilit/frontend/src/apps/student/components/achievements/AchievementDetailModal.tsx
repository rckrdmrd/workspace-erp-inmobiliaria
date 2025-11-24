/**
 * AchievementDetailModal Component
 * Full-featured modal with achievement details, progress, and social sharing
 * ~320 lines
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Share2,
  Calendar,
  Coins,
  Zap,
  CheckCircle,
  Circle,
  Lock,
  Trophy,
  Copy,
  Check,
  Twitter,
  Facebook,
  Award,
} from 'lucide-react';
import type { Achievement } from '@/features/gamification/social/types/achievementsTypes';

interface AchievementDetailModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export const AchievementDetailModal: React.FC<AchievementDetailModalProps> = ({
  achievement,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyboard);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious]);

  if (!achievement) return null;

  // Rarity colors
  const rarityColors = {
    common: {
      bg: 'bg-gray-100',
      border: 'border-gray-400',
      text: 'text-gray-700',
      gradient: 'from-gray-400 to-gray-600',
    },
    rare: {
      bg: 'bg-green-100',
      border: 'border-green-400',
      text: 'text-green-700',
      gradient: 'from-green-400 to-green-600',
    },
    epic: {
      bg: 'bg-purple-100',
      border: 'border-purple-400',
      text: 'text-purple-700',
      gradient: 'from-purple-400 to-purple-600',
    },
    legendary: {
      bg: 'bg-yellow-100',
      border: 'border-yellow-400',
      text: 'text-yellow-700',
      gradient: 'from-yellow-400 to-detective-gold',
    },
  };

  const colors = rarityColors[achievement.rarity];
  const progressPercentage = achievement.progress
    ? (achievement.progress.current / achievement.progress.required) * 100
    : 100;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/achievements/${achievement.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSocialShare = (platform: 'twitter' | 'facebook') => {
    const shareUrl = `${window.location.origin}/achievements/${achievement.id}`;
    const text = `¡Acabo de desbloquear el logro "${achievement.title}" en GLIT Platform! 🏆`;

    let url = '';
    if (platform === 'twitter') {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Header with close button */}
              <div className={`relative ${colors.bg} ${colors.border} border-b-4 p-6`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Navigation Arrows */}
                {hasPrevious && (
                  <button
                    onClick={onPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-white/50 rounded-full transition-colors"
                    aria-label="Anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={onNext}
                    className="absolute right-16 top-1/2 -translate-y-1/2 p-2 hover:bg-white/50 rounded-full transition-colors"
                    aria-label="Siguiente"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}

                {/* Achievement Icon */}
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className={`relative p-8 rounded-full bg-gradient-to-br ${colors.gradient} shadow-2xl mb-4`}
                  >
                    <Trophy className="w-16 h-16 text-white" />
                    {achievement.isUnlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute -bottom-2 -right-2 bg-detective-success rounded-full p-2"
                      >
                        <CheckCircle className="w-6 h-6 text-white" />
                      </motion.div>
                    )}
                    {!achievement.isUnlocked && (
                      <div className="absolute -bottom-2 -right-2 bg-gray-400 rounded-full p-2">
                        <Lock className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </motion.div>

                  {/* Rarity Badge */}
                  <span className={`px-4 py-1 rounded-full text-sm font-bold ${colors.text} ${colors.bg} border-2 ${colors.border}`}>
                    {achievement.rarity.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {/* Title and Description */}
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold text-detective-text mb-2">
                    {achievement.isHidden && !achievement.isUnlocked ? '???' : achievement.title}
                  </h2>
                  <p className="text-lg text-detective-text-secondary">
                    {achievement.isHidden && !achievement.isUnlocked ? 'Logro oculto - Desbloquéalo para ver más detalles' : achievement.description}
                  </p>
                </div>

                {/* Progress Section (for locked achievements) */}
                {!achievement.isUnlocked && achievement.progress && (
                  <div className="mb-6 p-4 bg-detective-bg rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-detective-text">Progreso</span>
                      <span className="text-detective-text-secondary">
                        {achievement.progress.current} / {achievement.progress.required}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                      />
                    </div>
                    <div className="text-center mt-2 text-sm text-detective-text-secondary">
                      {progressPercentage.toFixed(0)}% completado
                    </div>
                  </div>
                )}

                {/* Requirements Checklist */}
                {achievement.requirements && (
                  <div className="mb-6">
                    <h3 className="font-bold text-detective-text mb-3 flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Requisitos
                    </h3>
                    <ul className="space-y-2">
                      {Object.entries(achievement.requirements).map(([key, value]) => (
                        <li key={key} className="flex items-start gap-2">
                          {achievement.isUnlocked ? (
                            <CheckCircle className="w-5 h-5 text-detective-success flex-shrink-0 mt-0.5" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          )}
                          <span className="text-detective-text">
                            {key}: {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : value}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Unlock Date */}
                {achievement.isUnlocked && achievement.unlockedAt && (
                  <div className="mb-6 p-4 bg-detective-success/10 border-2 border-detective-success/20 rounded-xl">
                    <div className="flex items-center gap-2 text-detective-success">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">Desbloqueado el:</span>
                      <span>
                        {new Date(achievement.unlockedAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {/* Rewards */}
                <div className="mb-6">
                  <h3 className="font-bold text-detective-text mb-3">Recompensas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-detective-gold/10 border-2 border-detective-gold/30 rounded-xl">
                      <Coins className="w-8 h-8 text-detective-gold" />
                      <div>
                        <div className="text-2xl font-bold text-detective-text">
                          {achievement.mlCoinsReward}
                        </div>
                        <div className="text-sm text-detective-text-secondary">ML Coins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-detective-orange/10 border-2 border-detective-orange/30 rounded-xl">
                      <Zap className="w-8 h-8 text-detective-orange" />
                      <div>
                        <div className="text-2xl font-bold text-detective-text">
                          {achievement.xpReward}
                        </div>
                        <div className="text-sm text-detective-text-secondary">XP</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Share (only for unlocked achievements) */}
                {achievement.isUnlocked && (
                  <div>
                    <h3 className="font-bold text-detective-text mb-3 flex items-center gap-2">
                      <Share2 className="w-5 h-5" />
                      Compartir
                    </h3>
                    <div className="flex gap-3">
                      <button
                        onClick={handleShare}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-detective-bg hover:bg-detective-bg-secondary rounded-xl transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5 text-detective-success" />
                            <span className="font-semibold text-detective-success">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5" />
                            <span className="font-semibold">Copiar enlace</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleSocialShare('twitter')}
                        className="p-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white rounded-xl transition-colors"
                        aria-label="Compartir en Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleSocialShare('facebook')}
                        className="p-3 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-xl transition-colors"
                        aria-label="Compartir en Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
