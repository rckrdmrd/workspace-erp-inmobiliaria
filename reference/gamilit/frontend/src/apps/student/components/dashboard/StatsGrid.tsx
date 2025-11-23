import React from 'react';
import { motion } from 'framer-motion';
import { Clock, BookOpen, TrendingUp, Flame } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { cn } from '@shared/utils/cn';

interface StatsGridProps {
  stats: {
    totalTime: number;
    completedModules: number;
    totalModules: number;
    averageScore: number;
    currentStreak: number;
  };
  loading?: boolean;
  error?: Error | null;
}

interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  gradient: string;
  iconColor: string;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  gradient,
  iconColor,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="relative group"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-xl p-6',
          'bg-gradient-to-br',
          gradient,
          'border border-white/20',
          'shadow-lg hover:shadow-xl',
          'transition-all duration-300'
        )}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

        {/* Icon */}
        <div
          className={cn(
            'inline-flex p-3 rounded-lg mb-4',
            'bg-white/20 backdrop-blur-sm',
            'group-hover:scale-110 transition-transform duration-300'
          )}
        >
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>

        {/* Value */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className="text-3xl md:text-4xl font-bold text-white mb-1"
          >
            {value}
          </motion.div>

          {/* Label */}
          <p className="text-sm text-white/90 font-medium">{label}</p>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      </div>
    </motion.div>
  );
};

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, loading, error }) => {
  // Format time from minutes to hours and minutes
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-detective-bg-secondary rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <DetectiveCard className="p-6">
        <div className="text-center">
          <p className="text-detective-danger font-medium">Error cargando estadísticas</p>
          <p className="text-sm text-detective-text-secondary mt-1">
            {error.message}
          </p>
        </div>
      </DetectiveCard>
    );
  }

  const statCards = [
    {
      icon: Clock,
      value: formatTime(stats.totalTime),
      label: 'Tiempo Total',
      gradient: 'from-purple-500 to-purple-700',
      iconColor: 'text-purple-100',
    },
    {
      icon: BookOpen,
      value: `${stats.completedModules}/${stats.totalModules}`,
      label: 'Módulos Completados',
      gradient: 'from-detective-orange to-orange-600',
      iconColor: 'text-orange-100',
    },
    {
      icon: TrendingUp,
      value: `${stats.averageScore.toFixed(1)}%`,
      label: 'Promedio de Puntuación',
      gradient: 'from-detective-blue to-blue-600',
      iconColor: 'text-blue-100',
    },
    {
      icon: Flame,
      value: `${stats.currentStreak}`,
      label: 'Racha Actual (días)',
      gradient: 'from-detective-gold to-yellow-600',
      iconColor: 'text-yellow-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statCards.map((card, index) => (
        <StatCard key={card.label} {...card} index={index} />
      ))}
    </div>
  );
};
