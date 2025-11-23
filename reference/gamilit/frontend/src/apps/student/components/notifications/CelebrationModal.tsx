import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Coins, Zap, Share2, ArrowRight } from 'lucide-react';

interface Reward {
  type: 'coins' | 'xp' | 'achievement';
  amount?: number;
  name?: string;
  icon?: string;
}

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'module' | 'rank' | 'achievement';
  title: string;
  subtitle?: string;
  rewards?: Reward[];
  onContinue?: () => void;
  onShare?: () => void;
}

export function CelebrationModal({
  isOpen,
  onClose,
  type,
  title,
  subtitle,
  rewards = [],
  onContinue,
  onShare,
}: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getTypeConfig = () => {
    switch (type) {
      case 'module':
        return {
          icon: '🎓',
          gradient: 'from-detective-orange to-detective-gold',
          particleColor: '#f97316',
        };
      case 'rank':
        return {
          icon: '👑',
          gradient: 'from-detective-gold to-detective-orange',
          particleColor: '#f59e0b',
        };
      case 'achievement':
        return {
          icon: '🏆',
          gradient: 'from-detective-blue to-detective-orange',
          particleColor: '#1e3a8a',
        };
      default:
        return {
          icon: '🎉',
          gradient: 'from-detective-orange to-detective-gold',
          particleColor: '#f97316',
        };
    }
  };

  const config = getTypeConfig();

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Confetti particles */}
          {showConfetti && (
            <div className="fixed inset-0 pointer-events-none z-50">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                    backgroundColor: ['#f97316', '#f59e0b', '#1e3a8a', '#10b981'][
                      Math.floor(Math.random() * 4)
                    ],
                  }}
                  initial={{ y: 0, opacity: 1, rotate: 0 }}
                  animate={{
                    y: window.innerHeight + 100,
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 720,
                    x: (Math.random() - 0.5) * 200,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    ease: 'easeOut',
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
            </div>
          )}

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full md:h-auto flex flex-col">
              {/* Header */}
              <div
                className={`relative p-8 bg-gradient-to-br ${config.gradient} overflow-hidden`}
              >
                {/* Animated background pattern */}
                <motion.div
                  className="absolute inset-0 opacity-10"
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
                      'repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 20px)',
                  }}
                />

                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="relative text-center">
                  <motion.div
                    className="text-7xl mb-4"
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: 'easeInOut',
                    }}
                  >
                    {config.icon}
                  </motion.div>

                  <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                  {subtitle && (
                    <p className="text-white/90 text-lg">{subtitle}</p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                {rewards.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-detective-text mb-4 text-center">
                      Recompensas Obtenidas
                    </h3>

                    <div className="space-y-3">
                      {rewards.map((reward, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-detective-bg rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {reward.type === 'coins' && (
                              <div className="w-10 h-10 bg-detective-gold/10 rounded-full flex items-center justify-center">
                                <Coins className="w-5 h-5 text-detective-gold" />
                              </div>
                            )}
                            {reward.type === 'xp' && (
                              <div className="w-10 h-10 bg-detective-orange/10 rounded-full flex items-center justify-center">
                                <Zap className="w-5 h-5 text-detective-orange" />
                              </div>
                            )}
                            {reward.type === 'achievement' && (
                              <div className="w-10 h-10 bg-detective-blue/10 rounded-full flex items-center justify-center">
                                <Trophy className="w-5 h-5 text-detective-blue" />
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-detective-text">
                                {reward.type === 'coins' && `${reward.amount} ML Coins`}
                                {reward.type === 'xp' && `${reward.amount} XP`}
                                {reward.type === 'achievement' && reward.name}
                              </p>
                              {reward.icon && (
                                <span className="text-sm text-detective-text-secondary">
                                  {reward.icon}
                                </span>
                              )}
                            </div>
                          </div>

                          {reward.amount && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: 'spring',
                                stiffness: 500,
                                delay: index * 0.1 + 0.2,
                              }}
                              className="text-2xl font-bold text-detective-orange"
                            >
                              +{reward.amount}
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  {onShare && (
                    <button
                      onClick={onShare}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-detective-bg hover:bg-detective-bg-secondary text-detective-text font-semibold rounded-lg transition-colors touch-manipulation"
                    >
                      <Share2 className="w-5 h-5" />
                      Compartir logro
                    </button>
                  )}

                  {onContinue && (
                    <button
                      onClick={onContinue}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-detective-orange to-detective-gold text-white font-semibold rounded-lg hover:shadow-lg transition-shadow touch-manipulation"
                    >
                      Continuar
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
