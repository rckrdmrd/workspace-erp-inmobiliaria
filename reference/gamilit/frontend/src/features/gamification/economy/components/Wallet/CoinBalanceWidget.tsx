/**
 * CoinBalanceWidget - Animated ML Coins Display
 *
 * Displays current ML Coins balance with smooth animations
 * Uses Framer Motion for spring animations
 */

import { motion, useSpring, useTransform } from 'framer-motion';
import { Coins } from 'lucide-react';
import { useEffect } from 'react';

interface CoinBalanceWidgetProps {
  balance: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const CoinBalanceWidget: React.FC<CoinBalanceWidgetProps> = ({
  balance,
  size = 'medium',
  showLabel = true,
  animated = true,
  className = '',
}) => {
  const animatedBalance = useSpring(0, {
    stiffness: 100,
    damping: 30,
  });

  const displayBalance = useTransform(animatedBalance, (latest) =>
    Math.floor(latest).toLocaleString('en-US')
  );

  useEffect(() => {
    if (animated) {
      animatedBalance.set(balance);
    }
  }, [balance, animated, animatedBalance]);

  const sizeClasses = {
    small: {
      container: 'px-3 py-1.5',
      icon: 'w-4 h-4',
      text: 'text-detective-sm',
      label: 'text-detective-xs',
    },
    medium: {
      container: 'px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-detective-lg font-semibold',
      label: 'text-detective-sm',
    },
    large: {
      container: 'px-6 py-3',
      icon: 'w-6 h-6',
      text: 'text-detective-2xl font-bold',
      label: 'text-detective-base',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <motion.div
      className={`
        flex items-center gap-2 bg-gradient-to-r from-detective-gold/10 to-detective-orange/10
        border-2 border-detective-gold rounded-detective
        shadow-gold transition-all duration-300
        hover:shadow-gold-lg hover:scale-105
        ${currentSize.container}
        ${className}
      `}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Coins className={`${currentSize.icon} text-detective-gold`} />
      </motion.div>

      <div className="flex flex-col">
        {showLabel && (
          <span className={`${currentSize.label} text-detective-text-secondary uppercase tracking-wide`}>
            ML Coins
          </span>
        )}
        <div className="flex items-baseline gap-1">
          <motion.span className={`${currentSize.text} text-detective-gold`}>
            {animated ? displayBalance : balance.toLocaleString('en-US')}
          </motion.span>
          <span className={`${currentSize.label} text-detective-text-secondary font-medium`}>
            ML
          </span>
        </div>
      </div>
    </motion.div>
  );
};
