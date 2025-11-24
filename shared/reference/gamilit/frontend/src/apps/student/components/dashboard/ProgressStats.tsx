import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Flame,
  Award,
} from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import type { ProgressData } from '../../hooks/useDashboardData';

interface ProgressStatsProps {
  data: ProgressData | null;
  loading?: boolean;
}

export function ProgressStats({ data, loading }: ProgressStatsProps) {
  if (loading || !data) {
    return (
      <DetectiveCard className="h-full">
        <div className="animate-pulse">
          <div className="h-6 bg-detective-bg-secondary rounded w-1/2 mb-4" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-detective-bg-secondary rounded" />
            ))}
          </div>
        </div>
      </DetectiveCard>
    );
  }

  const stats = [
    {
      label: 'Módulos',
      value: `${data.completedModules}/${data.totalModules}`,
      icon: BookOpen,
      color: 'text-detective-orange',
      bgGradient: 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: 'border-detective-orange',
      progress: (data.completedModules / data.totalModules) * 100,
    },
    {
      label: 'Ejercicios',
      value: `${data.completedExercises}/${data.totalExercises}`,
      icon: Target,
      color: 'text-detective-blue',
      bgGradient: 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: 'border-detective-blue',
      progress: (data.completedExercises / data.totalExercises) * 100,
    },
    {
      label: 'Promedio',
      value: `${data.averageScore.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-detective-success',
      bgGradient: 'bg-gradient-to-br from-green-50 to-green-100',
      borderColor: 'border-detective-success',
      progress: data.averageScore,
    },
    {
      label: 'Tiempo',
      value: `${Math.floor(data.totalTimeSpent / 60)}h`,
      icon: Clock,
      color: 'text-purple-500',
      bgGradient: 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: 'border-purple-400',
    },
    {
      label: 'Racha actual',
      value: `${data.currentStreak} días`,
      icon: Flame,
      color: 'text-detective-gold',
      bgGradient: 'bg-gradient-to-br from-amber-50 to-amber-100',
      borderColor: 'border-detective-gold',
    },
    {
      label: 'Mejor racha',
      value: `${data.longestStreak} días`,
      icon: Award,
      color: 'text-detective-gold',
      bgGradient: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      borderColor: 'border-detective-gold',
    },
  ];

  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <DetectiveCard className="h-full">
      <h3 className="text-lg font-bold text-detective-text mb-4">
        Estadísticas de Progreso
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              transition={{
                delay: index * 0.05,
                duration: 0.2
              }}
              className={`p-4 ${stat.bgGradient} rounded-lg border-2 ${stat.borderColor} shadow-md hover:shadow-xl transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className={`p-2 rounded-lg bg-white/70 ${stat.color}`}>
                  <Icon className={`w-5 h-5`} />
                </div>
                {stat.progress !== undefined && (
                  <span className="text-xs font-bold text-detective-text bg-white/70 px-2 py-1 rounded-full">
                    {Math.round(stat.progress)}%
                  </span>
                )}
              </div>

              <p className="text-2xl font-bold text-detective-text mb-1">
                {stat.value}
              </p>
              <p className="text-xs text-detective-text-secondary font-medium">{stat.label}</p>

              {stat.progress !== undefined && (
                <div className="mt-3 h-2 bg-white/70 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className={`h-full ${stat.color.replace('text-', 'bg-')} rounded-full shadow-sm`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Streak bonus */}
      {data.currentStreak >= 7 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-gradient-to-r from-detective-gold/10 to-detective-orange/10 rounded-lg border border-detective-gold/20"
        >
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-detective-gold" />
            <div>
              <p className="text-sm font-semibold text-detective-text">
                ¡Racha impresionante!
              </p>
              <p className="text-xs text-detective-text-secondary">
                Mantén tu racha para ganar bonificaciones extras
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </DetectiveCard>
  );
}
