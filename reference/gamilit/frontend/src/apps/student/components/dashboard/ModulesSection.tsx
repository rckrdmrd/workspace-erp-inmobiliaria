import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Lock,
  CheckCircle,
  Play,
  Clock,
  Target,
  Zap,
  Gift,
  Trophy,
  Construction
} from 'lucide-react';
import { cn } from '@shared/utils/cn';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';
import { getColorSchemeById } from '@shared/utils/colorPalette';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'experto';
  status: 'locked' | 'available' | 'in_progress' | 'completed' | 'backlog';
  progress: number; // 0-100
  totalExercises: number;
  completedExercises: number;
  estimatedTime: number; // in minutes
  xpReward: number;
  icon?: string;
  category: string;
  prerequisites?: string[];
  tags?: string[];
}

interface ModulesSectionProps {
  modules: ModuleData[];
  loading: boolean;
  error: Error | null;
  onModuleClick?: (moduleId: string) => void;
}

interface ModuleCardProps {
  module: ModuleData;
  index: number;
  onModuleClick?: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, index, onModuleClick }) => {
  const isClickable = module.status !== 'locked' && module.status !== 'backlog';

  // Get unique color scheme based on module ID (consistent across renders)
  const colorScheme = useMemo(() => getColorSchemeById(module.id), [module.id]);

  const getStatusIcon = () => {
    switch (module.status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-white" />;
      case 'in_progress':
        return <Play className="w-8 h-8 text-white" />;
      case 'available':
        return <BookOpen className="w-8 h-8 text-white" />;
      case 'locked':
        return <Lock className="w-8 h-8 text-white" />;
      case 'backlog':
        return <Construction className="w-8 h-8 text-white" />;
      default:
        return <BookOpen className="w-8 h-8 text-white" />;
    }
  };

  // Get status-based styling with random colors
  const getStatusStyles = () => {
    // For locked modules, use gray
    if (module.status === 'locked') {
      return {
        border: 'border-gray-300',
        shadow: '',
        background: 'bg-white',
        badge: 'bg-gray-400 text-white',
        iconGradient: 'from-gray-400 to-gray-500',
        progressGradient: 'from-gray-400 to-gray-500',
        buttonGradient: 'from-gray-400 to-gray-500',
        buttonHoverGradient: 'from-gray-500 to-gray-600',
      };
    }

    // For backlog modules, use amber/orange (construction theme)
    if (module.status === 'backlog') {
      return {
        border: 'border-amber-300',
        shadow: 'shadow-amber-100',
        background: 'bg-amber-50',
        badge: 'bg-amber-500 text-white',
        iconGradient: 'from-amber-400 to-orange-500',
        progressGradient: 'from-amber-400 to-orange-500',
        buttonGradient: 'from-amber-400 to-orange-500',
        buttonHoverGradient: 'from-amber-500 to-orange-600',
      };
    }

    // For all other statuses, use the random color scheme
    return {
      border: colorScheme.border,
      shadow: colorScheme.shadow,
      background: colorScheme.background,
      badge: colorScheme.badge,
      iconGradient: colorScheme.iconGradient,
      progressGradient: colorScheme.progressGradient,
      buttonGradient: colorScheme.buttonGradient,
      buttonHoverGradient: colorScheme.buttonHoverGradient,
    };
  };

  const getDifficultyColor = () => {
    switch (module.difficulty) {
      case 'facil':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'medio':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'dificil':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'experto':
        return 'bg-purple-100 text-purple-700 border border-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  const handleClick = () => {
    if (isClickable && onModuleClick) {
      onModuleClick(module.id);
    }
  };

  const statusStyles = getStatusStyles();
  const difficultyLabel = module.difficulty === 'facil' ? 'FÁCIL' : module.difficulty === 'medio' ? 'MEDIO' : module.difficulty === 'dificil' ? 'DIFÍCIL' : 'EXPERTO';
  const statusLabel = module.status === 'completed' ? 'Completado ✓' : module.status === 'in_progress' ? 'En Progreso' : module.status === 'available' ? 'Disponible' : module.status === 'backlog' ? '🚧 En Construcción' : 'Bloqueado';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={isClickable ? { y: -5 } : {}}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        "relative bg-white rounded-xl shadow-md overflow-hidden",
        "border-2 transition-all duration-300",
        statusStyles.border,
        statusStyles.shadow,
        (module.status === 'locked' || module.status === 'backlog') && "opacity-90",
        isClickable && "cursor-pointer"
      )}
      onClick={handleClick}
    >
      {/* Status Badge (Top Right) */}
      <div className="absolute top-3 right-3 z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-bold',
            statusStyles.badge
          )}
        >
          {statusLabel}
        </motion.div>
      </div>

      {/* Difficulty Badge (Top Left) */}
      <div className="absolute top-3 left-3 z-10">
        <div className={cn('px-2 py-1 rounded-md text-xs font-semibold', getDifficultyColor())}>
          {difficultyLabel}
        </div>
      </div>

      {/* Card Content */}
      <div className={cn('p-6', statusStyles.background)}>
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-4 mt-6">
          <div
            className={cn(
              'flex-shrink-0 w-16 h-16 rounded-xl',
              'flex items-center justify-center',
              'bg-gradient-to-br',
              statusStyles.iconGradient,
              'shadow-md'
            )}
          >
            {module.icon ? (
              <span className="text-3xl">{module.icon}</span>
            ) : (
              getStatusIcon()
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Title */}
            <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
              {module.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2">
              {module.description}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-semibold text-gray-700">Progreso</span>
            <span className="font-bold text-gray-800">
              {module.completedExercises} / {module.totalExercises} ejercicios
            </span>
          </div>

          {/* Progress Bar with gradient */}
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${module.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 + 0.5 }}
              className={cn(
                'h-full bg-gradient-to-r',
                statusStyles.progressGradient,
                'rounded-full'
              )}
            />
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">
            {module.progress}% completado
          </div>
        </div>

        {/* Rewards (like MissionCard) */}
        <div className="flex items-center gap-3 mb-4">
          {/* XP Reward */}
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-bold text-blue-700">
              {module.xpReward} XP
            </span>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center gap-2 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
            <Clock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-bold text-purple-700">
              {module.estimatedTime} min
            </span>
          </div>

          {/* Total Exercises Badge */}
          <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            <Target className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-bold text-amber-700">
              {module.totalExercises}
            </span>
          </div>
        </div>

        {/* Action Button (large and colorful like MissionCard) */}
        <div>
          {module.status === 'locked' ? (
            <div
              className={cn(
                'w-full py-3 rounded-lg font-semibold',
                'bg-gray-400 text-white',
                'flex items-center justify-center gap-2',
                'shadow-md cursor-not-allowed'
              )}
            >
              <Lock className="w-5 h-5" />
              Bloqueado
            </div>
          ) : module.status === 'backlog' ? (
            <div
              className={cn(
                'w-full py-3 rounded-lg font-semibold',
                'bg-gradient-to-r',
                statusStyles.buttonGradient,
                'text-white',
                'flex items-center justify-center gap-2',
                'shadow-md cursor-not-allowed'
              )}
            >
              <Construction className="w-5 h-5" />
              Próximamente Disponible
            </div>
          ) : module.status === 'completed' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full py-3 rounded-lg font-semibold',
                'bg-gradient-to-r',
                statusStyles.buttonGradient,
                'hover:' + statusStyles.buttonHoverGradient.split(' ').slice(1).join(' '),
                'text-white',
                'flex items-center justify-center gap-2',
                'shadow-lg'
              )}
              style={{
                background: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
            >
              <Trophy className="w-5 h-5" />
              Revisar Módulo
            </motion.button>
          ) : module.status === 'in_progress' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full py-3 rounded-lg font-semibold',
                'bg-gradient-to-r',
                statusStyles.buttonGradient,
                'text-white',
                'flex items-center justify-center gap-2',
                'shadow-lg'
              )}
            >
              <Play className="w-5 h-5" />
              Continuar
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full py-3 rounded-lg font-semibold',
                'bg-gradient-to-r',
                statusStyles.buttonGradient,
                'text-white',
                'flex items-center justify-center gap-2',
                'shadow-lg'
              )}
            >
              <Gift className="w-5 h-5" />
              Comenzar Módulo
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ModuleSkeleton: React.FC = () => (
  <EnhancedCard variant="primary" hover={false} padding="md">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
        </div>
      </div>
    </div>

    <div className="flex items-center gap-4 mb-4">
      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
    </div>

    <div className="space-y-3">
      <div className="h-2 w-full bg-gray-200 rounded-full animate-pulse"></div>
      <div className="h-8 w-full bg-gray-200 rounded animate-pulse"></div>
    </div>
  </EnhancedCard>
);

export const ModulesSection: React.FC<ModulesSectionProps> = ({
  modules,
  loading,
  error,
  onModuleClick
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
            <BookOpen className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Error al cargar módulos</h3>
            <p className="text-sm text-red-600">
              No se pudieron cargar los módulos educativos. Intenta actualizar.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Calculate summary stats
  const totalModules = modules.length;

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Módulos Detectivescos 🔍
          </h2>
          <p className="text-sm text-gray-600">
            {totalModules} módulos de investigación disponibles
          </p>
        </div>
      </motion.div>

      {/* Modules Grid - cada módulo ocupa 4 columnas (2 módulos por fila) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }, (_, i) => (
            <ModuleSkeleton key={i} />
          ))
        ) : modules.length === 0 ? (
          // Empty state
          <div className="col-span-full text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay módulos disponibles
            </h3>
            <p className="text-gray-600">
              Los módulos educativos aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        ) : (
          // Module cards
          modules.map((module, index) => (
            <ModuleCard
              key={module.id}
              module={module}
              index={index}
              onModuleClick={onModuleClick}
            />
          ))
        )}
      </div>

    </div>
  );
};

export default ModulesSection;
