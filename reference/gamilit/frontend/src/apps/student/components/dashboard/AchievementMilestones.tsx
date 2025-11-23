import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Star, Coins, Zap } from 'lucide-react';
import { cn } from '@shared/utils/cn';

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  completed: boolean;
  reward: {
    xp: number;
    mlCoins: number;
  };
  icon: 'target' | 'trophy' | 'star';
}

interface AchievementMilestonesProps {
  milestones: Milestone[];
}

const iconMap = {
  target: Target,
  trophy: Trophy,
  star: Star,
};

const MilestoneCard: React.FC<{ milestone: Milestone; index: number }> = ({
  milestone,
  index,
}) => {
  const Icon = iconMap[milestone.icon];
  const progressPercentage = (milestone.progress / milestone.total) * 100;
  const isCompleted = milestone.completed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-all duration-300',
        isCompleted ? 'border-green-200 bg-green-50/30' : 'border-orange-200'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={cn(
            'p-2.5 rounded-lg flex-shrink-0',
            isCompleted
              ? 'bg-green-100'
              : 'bg-orange-100'
          )}
        >
          <Icon
            className={cn(
              'w-5 h-5',
              isCompleted ? 'text-green-600' : 'text-orange-600'
            )}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title and Badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 text-sm mb-0.5">
                {milestone.title}
              </h4>
              <p className="text-xs text-gray-600">
                {milestone.description}
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={cn(
                'px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0',
                isCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              )}
            >
              {isCompleted ? 'Completado' : 'En progreso'}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-700">
                {milestone.progress} / {milestone.total}
              </span>
              <span className="text-xs font-semibold text-gray-900">
                {Math.round(progressPercentage)}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{
                  delay: index * 0.1 + 0.2,
                  duration: 0.8,
                  ease: 'easeOut',
                }}
                className={cn(
                  'h-full rounded-full',
                  isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600'
                )}
              />
            </div>
          </div>

          {/* Rewards */}
          <div className="flex items-center gap-3">
            {/* XP Reward */}
            {milestone.reward.xp > 0 && (
              <div className="flex items-center gap-1">
                <div className="p-1 bg-purple-100 rounded">
                  <Zap className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-xs font-medium text-purple-700">
                  +{milestone.reward.xp} XP
                </span>
              </div>
            )}

            {/* ML Coins Reward */}
            {milestone.reward.mlCoins > 0 && (
              <div className="flex items-center gap-1">
                <div className="p-1 bg-yellow-100 rounded">
                  <Coins className="w-3 h-3 text-yellow-600" />
                </div>
                <span className="text-xs font-medium text-yellow-700">
                  +{milestone.reward.mlCoins} ML Coins
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const AchievementMilestones: React.FC<AchievementMilestonesProps> = ({
  milestones,
}) => {
  if (!milestones || milestones.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <div className="text-center">
          <div className="p-3 bg-gray-100 rounded-lg inline-block mb-3">
            <Target className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">
            No hay objetivos disponibles
          </h3>
          <p className="text-sm text-gray-500">
            Los objetivos aparecerán mientras progresas
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2"
      >
        <div className="p-2 bg-orange-100 rounded-lg">
          <Target className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Próximos Objetivos
          </h2>
          <p className="text-xs text-gray-600">
            Completa estos hitos para ganar recompensas
          </p>
        </div>
      </motion.div>

      {/* Milestones List */}
      <div className="space-y-3">
        {milestones.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id}
            milestone={milestone}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default AchievementMilestones;
