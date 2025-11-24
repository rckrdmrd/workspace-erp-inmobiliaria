import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  CheckCircle,
  Trophy,
  Star,
  BookOpen,
  Target,
  Zap,
  Award,
  Flame,
  Clock,
  Users,
  Play
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';

interface ActivityItem {
  id: string;
  type: 'exercise_completed' | 'achievement_unlocked' | 'level_up' | 'module_completed' | 'streak_milestone' | 'badge_earned' | 'social_interaction' | 'daily_goal_met';
  title: string;
  description: string;
  timestamp: Date;
  metadata?: {
    xp?: number;
    ml?: number;
    moduleName?: string;
    exerciseName?: string;
    achievementName?: string;
    level?: number;
    streakDays?: number;
    badgeName?: string;
  };
  icon?: string;
  category: string;
}

interface RecentActivityPanelProps {
  activities: ActivityItem[];
  loading: boolean;
  error: Error | null;
  maxItems?: number;
}

interface ActivityCardProps {
  activity: ActivityItem;
  index: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index }) => {
  const getActivityIcon = () => {
    if (activity.icon) return activity.icon;

    switch (activity.type) {
      case 'exercise_completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'achievement_unlocked':
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'level_up':
        return <Star className="w-4 h-4 text-blue-600" />;
      case 'module_completed':
        return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'streak_milestone':
        return <Flame className="w-4 h-4 text-red-600" />;
      case 'badge_earned':
        return <Award className="w-4 h-4 text-orange-600" />;
      case 'social_interaction':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'daily_goal_met':
        return <Target className="w-4 h-4 text-emerald-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityColor = () => {
    switch (activity.type) {
      case 'exercise_completed':
        return 'bg-green-50 border-green-200';
      case 'achievement_unlocked':
        return 'bg-yellow-50 border-yellow-200';
      case 'level_up':
        return 'bg-blue-50 border-blue-200';
      case 'module_completed':
        return 'bg-purple-50 border-purple-200';
      case 'streak_milestone':
        return 'bg-red-50 border-red-200';
      case 'badge_earned':
        return 'bg-orange-50 border-orange-200';
      case 'social_interaction':
        return 'bg-indigo-50 border-indigo-200';
      case 'daily_goal_met':
        return 'bg-emerald-50 border-emerald-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else {
      return 'Ahora mismo';
    }
  };

  const formatRewards = () => {
    const rewards: React.ReactNode[] = [];
    if (activity.metadata?.xp) {
      rewards.push(
        <span key="xp" className="inline-flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
          <Zap className="w-3 h-3" />
          +{activity.metadata.xp} XP
        </span>
      );
    }
    if (activity.metadata?.ml) {
      rewards.push(
        <span key="ml" className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
          <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">ML</span>
          </div>
          +{activity.metadata.ml}
        </span>
      );
    }
    return rewards;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <EnhancedCard
        variant="info"
        hover={true}
        padding="md"
        className={cn(getActivityColor())}
      >
        <div className="flex items-start gap-3">
          {/* Activity Icon */}
          <div className="flex-shrink-0 p-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            {getActivityIcon()}
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 text-sm leading-tight">
              {activity.title}
            </h4>
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {activity.description}
            </p>

            {/* Metadata */}
            {(activity.metadata?.moduleName || activity.metadata?.exerciseName || activity.metadata?.achievementName) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {activity.metadata.moduleName && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    📚 {activity.metadata.moduleName}
                  </span>
                )}
                {activity.metadata.exerciseName && (
                  <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                    🎯 {activity.metadata.exerciseName}
                  </span>
                )}
                {activity.metadata.achievementName && (
                  <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                    🏆 {activity.metadata.achievementName}
                  </span>
                )}
                {activity.metadata.level && (
                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                    ⭐ Nivel {activity.metadata.level}
                  </span>
                )}
                {activity.metadata.streakDays && (
                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    🔥 {activity.metadata.streakDays} días
                  </span>
                )}
                {activity.metadata.badgeName && (
                  <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    🥇 {activity.metadata.badgeName}
                  </span>
                )}
              </div>
            )}

            {/* Rewards */}
            {(activity.metadata?.xp || activity.metadata?.ml) && (
              <div className="flex items-center gap-2 mt-2">
                {formatRewards()}
              </div>
            )}
          </div>

          {/* Timestamp */}
          <div className="flex-shrink-0 text-right">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {getTimeAgo(activity.timestamp)}
            </div>
          </div>
        </div>
          </div>
        </div>
      </EnhancedCard>
    </motion.div>
  );
};

const ActivitySkeleton: React.FC = () => (
  <EnhancedCard variant="info" hover={false} padding="md">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-3 w-48 bg-gray-100 rounded animate-pulse"></div>
        <div className="flex gap-2">
          <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-5 w-12 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
    </div>
  </EnhancedCard>
);

export const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({
  activities,
  loading,
  error,
  maxItems = 5
}) => {
  // Handle error state
  if (error && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 border border-red-200 rounded-xl p-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Activity className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Error al cargar actividad</h3>
            <p className="text-sm text-red-600">
              No se pudo cargar tu actividad reciente. Intenta actualizar.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Limit activities to maxItems
  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-orange-600" />
            Actividad Reciente
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Tus logros recientes
          </p>
        </div>

        {/* Activity Counter */}
        {!loading && activities.length > 0 && (
          <div className="text-right">
            <div className="text-lg font-bold text-orange-600">
              {activities.length}
            </div>
            <div className="text-xs text-gray-600">total</div>
          </div>
        )}
      </motion.div>

      {/* Activities List */}
      <div className="space-y-3">
        {loading ? (
          // Loading skeletons
          Array.from({ length: maxItems }, (_, i) => (
            <ActivitySkeleton key={i} />
          ))
        ) : displayedActivities.length === 0 ? (
          // Empty state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8 bg-white rounded-xl border border-gray-200"
          >
            <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay actividad reciente
            </h3>
            <p className="text-gray-600 mb-4">
              ¡Comienza a resolver casos para ver tu progreso aquí!
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors">
              <Play className="w-4 h-4" />
              Comenzar ahora
            </button>
          </motion.div>
        ) : (
          // Activity cards
          displayedActivities.map((activity, index) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              index={index}
            />
          ))
        )}
      </div>

      {/* View More Link */}
      {!loading && activities.length > maxItems && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center pt-2"
        >
          <button className="text-orange-600 hover:text-orange-700 font-medium text-xs transition-colors">
            Ver todas (+{activities.length - maxItems})
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default RecentActivityPanel;
