/**
 * LeaderboardPodium Component
 *
 * Enhanced 3D podium visualization with animations for Top 3 players
 * Features:
 * - 3D podium effect with different heights
 * - Animated entrance (rise from bottom)
 * - Confetti animation for #1
 * - Medals and badges
 * - Responsive design (stacks on mobile)
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Medal, Award, Star, TrendingUp } from 'lucide-react';
import type { LeaderboardEntry } from '../../types/leaderboardsTypes';
import { cn } from '@shared/utils/cn';

interface LeaderboardPodiumProps {
  topThree: LeaderboardEntry[];
  className?: string;
}

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const PodiumPosition = ({
  entry,
  rank,
  height,
  gradient,
  delay
}: {
  entry: LeaderboardEntry;
  rank: number;
  height: string;
  gradient: string;
  delay: number;
}) => {
  const iconMap = {
    1: Crown,
    2: Medal,
    3: Award,
  };

  const Icon = iconMap[rank as keyof typeof iconMap];

  const avatarSize = rank === 1 ? 'w-24 h-24' : rank === 2 ? 'w-20 h-20' : 'w-18 h-18';
  const borderColor = rank === 1 ? 'border-yellow-400' : rank === 2 ? 'border-gray-400' : 'border-orange-400';
  const badgeSize = rank === 1 ? 'w-12 h-12 text-xl' : 'w-10 h-10 text-lg';
  const textSize = rank === 1 ? 'text-xl' : 'text-lg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        type: 'spring',
        bounce: 0.4
      }}
      className="flex flex-col items-center"
    >
      {/* Crown/Medal Icon Above Avatar */}
      {rank === 1 && (
        <motion.div
          animate={{
            rotate: [-5, 5, -5],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="mb-2"
        >
          <Crown className="w-10 h-10 text-yellow-400 drop-shadow-lg" fill="currentColor" />
        </motion.div>
      )}

      {/* Avatar */}
      <motion.div
        className="relative mb-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <motion.img
          src={entry.avatar}
          alt={entry.username}
          className={cn(
            avatarSize,
            'rounded-full border-4 object-cover shadow-2xl',
            borderColor
          )}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.username)}&background=${rank === 1 ? 'fbbf24' : rank === 2 ? '9ca3af' : 'fb923c'}&color=fff`;
          }}
          whileHover={{ rotate: 5 }}
        />

        {/* Rank Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.3, type: 'spring', bounce: 0.6 }}
          className={cn(
            'absolute -bottom-2 -right-2 rounded-full flex items-center justify-center text-white font-bold shadow-xl',
            `bg-gradient-to-br ${gradient}`,
            badgeSize,
            rank === 1 && 'ring-4 ring-yellow-200 ring-offset-2'
          )}
        >
          <Icon className="w-5 h-5" />
        </motion.div>

        {/* Glow Effect for #1 */}
        {rank === 1 && (
          <motion.div
            className="absolute inset-0 rounded-full blur-xl opacity-50 bg-gradient-to-r from-yellow-400 to-orange-500 -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        )}
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.4 }}
        className="text-center px-2 w-full"
      >
        <h3 className={cn(
          'font-bold text-detective-text mb-1 truncate',
          textSize,
          rank === 1 && 'text-detective-gold'
        )}>
          {entry.username}
        </h3>

        <p className="text-sm text-detective-text-secondary mb-2">
          {entry.rankBadge}
        </p>

        {/* Score */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.5, type: 'spring' }}
          className={cn(
            'font-bold mb-2',
            rank === 1 ? 'text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500' : 'text-xl text-detective-text'
          )}
        >
          {entry.score.toLocaleString()}
          <span className="text-sm ml-1 text-detective-text-secondary">XP</span>
        </motion.div>

        {/* Change Indicator */}
        {entry.change !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.6 }}
            className={cn(
              'flex items-center justify-center gap-1 text-sm font-semibold',
              entry.changeType === 'up' ? 'text-green-500' : entry.changeType === 'down' ? 'text-red-500' : 'text-gray-500'
            )}
          >
            <TrendingUp className={cn(
              'w-4 h-4',
              entry.changeType === 'down' && 'rotate-180'
            )} />
            <span>{entry.changeType === 'up' ? '+' : '-'}{Math.abs(entry.change)}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Podium Base */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.2 }}
        style={{ height }}
        className={cn(
          'w-full mt-4 rounded-t-lg shadow-xl relative overflow-hidden',
          `bg-gradient-to-b ${gradient}`
        )}
      >
        {/* Podium Number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.7, type: 'spring', bounce: 0.5 }}
            className="text-6xl font-bold text-white/20"
          >
            {rank}
          </motion.span>
        </div>

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-100, 300] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 1
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const Confetti = ({ show }: { show: boolean }) => {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#fbbf24', '#f97316', '#ef4444', '#ec4899', '#8b5cf6', '#3b82f6'];
      const newParticles: ConfettiParticle[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{
            x: `${particle.x}%`,
            y: `${particle.y}%`,
            rotate: particle.rotation,
            opacity: 1
          }}
          animate={{
            y: '120%',
            x: `${particle.x + (Math.random() - 0.5) * 30}%`,
            rotate: particle.rotation + 720,
            opacity: 0
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            ease: 'easeIn'
          }}
          style={{
            position: 'absolute',
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '2px',
          }}
        />
      ))}
    </div>
  );
};

export const LeaderboardPodium: React.FC<LeaderboardPodiumProps> = ({
  topThree,
  className
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti after podium animation
    const timer = setTimeout(() => setShowConfetti(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (topThree.length === 0) return null;

  // Ensure we have all three positions (pad with null if needed)
  const positions = [
    topThree.find(e => e.rank === 2),
    topThree.find(e => e.rank === 1),
    topThree.find(e => e.rank === 3),
  ];

  return (
    <div className={cn('relative', className)}>
      {/* Confetti for winner */}
      <Confetti show={showConfetti && !!positions[1]} />

      {/* Desktop/Tablet View */}
      <div className="hidden md:grid md:grid-cols-3 gap-8 items-end">
        {/* 2nd Place */}
        {positions[0] && (
          <PodiumPosition
            entry={positions[0]}
            rank={2}
            height="160px"
            gradient="from-gray-300 via-gray-400 to-gray-500"
            delay={0.2}
          />
        )}

        {/* 1st Place */}
        {positions[1] && (
          <PodiumPosition
            entry={positions[1]}
            rank={1}
            height="200px"
            gradient="from-yellow-400 via-yellow-500 to-orange-500"
            delay={0}
          />
        )}

        {/* 3rd Place */}
        {positions[2] && (
          <PodiumPosition
            entry={positions[2]}
            rank={3}
            height="120px"
            gradient="from-orange-300 via-orange-400 to-orange-600"
            delay={0.4}
          />
        )}
      </div>

      {/* Mobile View - Vertical Stack */}
      <div className="md:hidden space-y-6">
        {positions[1] && (
          <PodiumPosition
            entry={positions[1]}
            rank={1}
            height="160px"
            gradient="from-yellow-400 via-yellow-500 to-orange-500"
            delay={0}
          />
        )}
        {positions[0] && (
          <PodiumPosition
            entry={positions[0]}
            rank={2}
            height="120px"
            gradient="from-gray-300 via-gray-400 to-gray-500"
            delay={0.2}
          />
        )}
        {positions[2] && (
          <PodiumPosition
            entry={positions[2]}
            rank={3}
            height="100px"
            gradient="from-orange-300 via-orange-400 to-orange-600"
            delay={0.4}
          />
        )}
      </div>
    </div>
  );
};
