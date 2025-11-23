import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/providers/AuthContext';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import { EnhancedCard } from '@shared/components/base/EnhancedCard';
import { ColorfulCard } from '@shared/components/base/ColorfulCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { ProgressBar } from '@shared/components/base/ProgressBar';
import {
  ArrowLeft,
  Target,
  Clock,
  Star,
  AlertCircle,
  Trophy,
  Coins,
  TrendingUp,
  CheckCircle,
  Award,
  Lightbulb,
  BookOpen,
  Brain,
  Shield,
  Zap,
  Tag
} from 'lucide-react';
import { useModuleDetail } from '@shared/hooks/useModules';
import { getColorSchemeByIndex, getColorSchemeById } from '@shared/utils/colorPalette';
import { cn } from '@shared/utils/cn';
import type { Exercise } from '@shared/types';

// Difficulty labels - CEFR standard (outside component)
const DIFFICULTY_LABELS = {
  beginner: 'Principiante (A1)',
  elementary: 'Elemental (A2)',
  pre_intermediate: 'Pre-Intermedio (B1)',
  intermediate: 'Intermedio (B2)',
  upper_intermediate: 'Intermedio Alto (C1)',
  advanced: 'Avanzado (C2)',
  proficient: 'Competente (C2+)',
  native: 'Nativo',
  // Legacy Spanish mapping (backward compatibility)
  facil: 'Fácil',
  medio: 'Medio',
  dificil: 'Difícil',
  experto: 'Experto',
};

// Exercise Card Content Component (outside to avoid hook issues)
interface ExerciseCardContentProps {
  exercise: Exercise;
}

function ExerciseCardContent({ exercise }: ExerciseCardContentProps) {
  const colorScheme = useMemo(() => getColorSchemeById(exercise.id), [exercise.id]);

  return (
    <>
      {/* Header with large gradient icon and completion badge */}
      <div className="flex items-start justify-between mb-3">
        <motion.div
          className={cn(
            'w-16 h-16 rounded-xl flex items-center justify-center',
            'bg-gradient-to-br shadow-lg',
            colorScheme.iconGradient
          )}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Target className="w-8 h-8 text-white" />
        </motion.div>
        {exercise.completed && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            <CheckCircle className="w-4 h-4" />
            Completado
          </motion.span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-gray-900 mb-2">
        {exercise.title || 'Sin título'}
      </h3>

      {/* Description */}
      {exercise.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {exercise.description}
        </p>
      )}

      {/* Badges and Stats - More compact and colorful */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Difficulty Badge */}
        <motion.span
          whileHover={{ scale: 1.05 }}
          className={cn(
            'px-2.5 py-1 rounded-lg text-xs font-bold border-2 shadow-sm',
            // CEFR levels: beginner/elementary = easy, intermediate = medium, advanced+ = hard
            (exercise.difficulty === 'beginner' || exercise.difficulty === 'elementary')
              ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300' :
            (exercise.difficulty === 'pre_intermediate' || exercise.difficulty === 'intermediate')
              ? 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 border-yellow-300' :
            (exercise.difficulty === 'upper_intermediate' || exercise.difficulty === 'advanced')
              ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-300' :
            'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300'
          )}
        >
          {DIFFICULTY_LABELS[exercise.difficulty]?.toUpperCase() || exercise.difficulty?.toUpperCase() || 'DESCONOCIDO'}
        </motion.span>

        {/* Points Badge */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border-2 border-amber-300 shadow-sm"
        >
          <Star className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-700">{exercise.points ?? 0} pts</span>
        </motion.div>

        {/* Time Badge */}
        {exercise.estimatedTime && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-300 shadow-sm"
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">{exercise.estimatedTime} min</span>
          </motion.div>
        )}
      </div>

      {/* Action Button - Large and colorful */}
      <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'w-full py-3 rounded-xl font-bold text-white text-sm',
          'flex items-center justify-center gap-2',
          'bg-gradient-to-r shadow-lg transition-shadow hover:shadow-xl',
          exercise.completed ? 'from-blue-500 to-cyan-500' : colorScheme.buttonGradient
        )}
      >
        <Target className="w-4 h-4" />
        {exercise.completed ? 'Volver a intentar' : 'Comenzar Ejercicio'}
        <motion.span
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          →
        </motion.span>
      </motion.button>
    </>
  );
}

export default function ModuleDetailPage() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Fetch module and exercises from API
  const {
    module,
    exercises,
    loading,
    error,
  } = useModuleDetail(moduleId || '');

  const difficultyColors: Record<string, string> = {
    beginner: 'text-green-600',
    elementary: 'text-green-600',
    pre_intermediate: 'text-yellow-600',
    intermediate: 'text-yellow-600',
    upper_intermediate: 'text-orange-600',
    advanced: 'text-red-600',
    proficient: 'text-purple-600',
    native: 'text-purple-600',
  };

  const difficultyLabels: Record<string, string> = {
    beginner: 'Principiante',
    elementary: 'Elemental',
    pre_intermediate: 'Pre-Intermedio',
    intermediate: 'Intermedio',
    upper_intermediate: 'Intermedio Alto',
    advanced: 'Avanzado',
    proficient: 'Competente',
    native: 'Nativo',
  };

  const difficultyBgColors: Record<string, string> = {
    beginner: 'bg-green-100',
    elementary: 'bg-green-100',
    pre_intermediate: 'bg-yellow-100',
    intermediate: 'bg-yellow-100',
    upper_intermediate: 'bg-orange-100',
    advanced: 'bg-red-100',
    proficient: 'bg-purple-100',
    native: 'bg-purple-100',
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <GamifiedHeader
          user={user ?? undefined}
          gamificationData={gamificationData}
          onLogout={async () => {
            await logout();
            // No need to navigate - performLogout() handles redirect
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !module) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
        <GamifiedHeader
          user={user ?? undefined}
          gamificationData={gamificationData}
          onLogout={async () => {
            await logout();
            // No need to navigate - performLogout() handles redirect
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <DetectiveButton
            variant="blue"

            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            Volver al Dashboard
          </DetectiveButton>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-2 border-red-300 text-red-800 rounded-lg p-4 mb-6"
          >
            <p className="font-semibold">Error al cargar el módulo</p>
            <p className="text-sm mt-1">
              {error?.message || 'No se pudo encontrar el módulo solicitado'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Reintentar
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage based on actual completed exercises
  const completedExercises = exercises.filter(ex => ex.completed).length;
  const totalExercises = exercises.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <GamifiedHeader
        user={user || undefined}
        gamificationData={gamificationData}
        onLogout={async () => {
          await logout();
          // No need to navigate - performLogout() handles redirect
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <DetectiveButton
          variant="blue"

          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          Volver al Dashboard
        </DetectiveButton>

        {/* Header Section - Compact */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {module.difficulty && (
              <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${difficultyBgColors[module.difficulty] || 'bg-gray-100'} ${difficultyColors[module.difficulty] || 'text-gray-600'}`}>
                {(difficultyLabels[module.difficulty] || module.difficulty || 'DESCONOCIDO').toUpperCase()}
              </span>
            )}
            {module.tags && module.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 bg-white/80 backdrop-blur-sm rounded-md text-xs font-semibold text-gray-700">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{module.title}</h1>
          {module.subtitle && (
            <p className="text-sm text-gray-600">{module.subtitle}</p>
          )}
        </div>

        {/* Main Content Card - Compact */}
        <EnhancedCard variant="primary" padding="md" hover={false} className="mb-6">
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-600" />
                Descripción
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {module.description}
              </p>
            </div>

            {/* Summary (if available) */}
            {module.summary && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-700 font-medium italic">
                  {module.summary}
                </p>
              </div>
            )}

            {/* Progress Bar */}
            <div className="pt-3">
              <ProgressBar
                progress={progressPercentage}
                showLabel={true}
                label={`${completedExercises} de ${totalExercises} ejercicios completados`}
              />
            </div>
          </div>
        </EnhancedCard>

        {/* Statistics Section with colorful cards - Compact */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {/* Duration */}
          {module.estimated_duration_minutes && (
            <ColorfulCard index={0} hover={false} padding="sm" className="text-center">
              <Clock className="w-6 h-6 text-white mx-auto mb-1 p-1 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500" />
              <p className="text-lg font-bold text-gray-900">
                {module.estimated_duration_minutes}min
              </p>
              <p className="text-xs text-gray-600">Duración</p>
            </ColorfulCard>
          )}

          {/* Difficulty */}
          {module.difficulty && (
            <ColorfulCard index={1} hover={false} padding="sm" className="text-center">
              <TrendingUp className="w-6 h-6 text-white mx-auto mb-1 p-1 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500" />
              <p className="text-lg font-bold text-gray-900">
                {difficultyLabels[module.difficulty] || module.difficulty}
              </p>
              <p className="text-xs text-gray-600">Dificultad</p>
            </ColorfulCard>
          )}

          {/* XP Reward */}
          {module.xp_reward && (
            <ColorfulCard index={2} hover={false} padding="sm" className="text-center">
              <Trophy className="w-6 h-6 text-white mx-auto mb-1 p-1 rounded-lg bg-gradient-to-br from-yellow-400 to-amber-400" />
              <p className="text-lg font-bold text-gray-900">
                +{module.xp_reward}
              </p>
              <p className="text-xs text-gray-600">XP</p>
            </ColorfulCard>
          )}

          {/* ML Coins Reward */}
          {module.ml_coins_reward && (
            <ColorfulCard index={3} hover={false} padding="sm" className="text-center">
              <Coins className="w-6 h-6 text-white mx-auto mb-1 p-1 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500" />
              <p className="text-lg font-bold text-gray-900">
                +{module.ml_coins_reward}
              </p>
              <p className="text-xs text-gray-600">ML Coins</p>
            </ColorfulCard>
          )}

          {/* Progress */}
          <ColorfulCard index={4} hover={false} padding="sm" className="text-center">
            <CheckCircle className="w-6 h-6 text-white mx-auto mb-1 p-1 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500" />
            <p className="text-lg font-bold text-gray-900">
              {Math.round(progressPercentage)}%
            </p>
            <p className="text-xs text-gray-600">Completo</p>
          </ColorfulCard>
        </div>

        {/* Learning Objectives Section - Compact */}
        {module.learning_objectives && module.learning_objectives.length > 0 && (
          <EnhancedCard variant="info" padding="sm" hover={false} className="mb-6">
            <h2 className="text-base font-bold text-detective-text mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-detective-orange" />
              Objetivos de Aprendizaje
            </h2>
            <ul className="space-y-2">
              {module.learning_objectives.map((objective: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-detective-gold mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-detective-text-secondary">{objective}</span>
                </li>
              ))}
            </ul>
          </EnhancedCard>
        )}

        {/* Competencies and Skills Section - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Competencies */}
          {module.competencies && module.competencies.length > 0 && (
            <EnhancedCard variant="default" hover={false} padding="sm" className="lg:col-span-2">
              <h2 className="text-base font-bold text-detective-text mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-detective-blue" />
                Competencias
              </h2>
              <ul className="space-y-1.5">
                {module.competencies.map((competency, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-detective-blue mt-0.5 text-sm">•</span>
                    <span className="text-detective-text-secondary text-xs">{competency}</span>
                  </li>
                ))}
              </ul>
            </EnhancedCard>
          )}

          {/* Skills Developed */}
          {module.skills_developed && module.skills_developed.length > 0 && (
            <EnhancedCard variant="default" hover={false} padding="sm" className="lg:col-span-2">
              <h2 className="text-base font-bold text-detective-text mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4 text-detective-purple" />
                Habilidades Desarrolladas
              </h2>
              <ul className="space-y-1.5">
                {module.skills_developed.map((skill: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-detective-purple mt-0.5 text-sm">•</span>
                    <span className="text-detective-text-secondary text-xs">{skill}</span>
                  </li>
                ))}
              </ul>
            </EnhancedCard>
          )}
        </div>

        {/* Prerequisites Section - Compact */}
        {module.prerequisites && module.prerequisites.length > 0 && (
          <EnhancedCard variant="warning" hover={false} padding="sm" className="mb-6">
            <h2 className="text-base font-bold text-detective-text mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-detective-blue" />
              Requisitos Previos
            </h2>
            <ul className="space-y-1.5">
              {module.prerequisites.map((prerequisite, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-detective-blue mt-0.5 flex-shrink-0" />
                  <span className="text-detective-text-secondary text-xs">{prerequisite}</span>
                </li>
              ))}
            </ul>
          </EnhancedCard>
        )}

        {/* Rango Maya Section */}
        {(module.rangoMayaRequired || module.rangoMayaGranted) && (
          <EnhancedCard variant="default" hover={false} padding="sm" className="bg-gradient-to-r from-amber-50 to-orange-50 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {module.rangoMayaRequired && (
                <div>
                  <h3 className="text-sm font-bold text-detective-text mb-1 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-600" />
                    Rango Requerido
                  </h3>
                  <p className="text-lg font-bold text-amber-700 capitalize">
                    {module.rangoMayaRequired}
                  </p>
                </div>
              )}
              {module.rangoMayaGranted && (
                <div>
                  <h3 className="text-sm font-bold text-detective-text mb-1 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-600" />
                    Rango Otorgado
                  </h3>
                  <p className="text-lg font-bold text-orange-700 capitalize">
                    {module.rangoMayaGranted}
                  </p>
                </div>
              )}
            </div>
          </EnhancedCard>
        )}

        {/* Exercises Section - Full Width */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-detective-text mb-1 flex items-center gap-2">
            <Target className="w-5 h-5 text-detective-orange" />
            Ejercicios del Módulo
          </h2>
          <p className="text-sm text-detective-text-secondary mb-3">
            {completedExercises} de {totalExercises} ejercicios completados
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercises.map((exercise, index) => (
              <ColorfulCard
                key={exercise.id}
                id={exercise.id}
                hover={true}
                padding="md"
                onClick={() => navigate(`/exercises/${exercise.id}`)}
                animationDelay={index * 0.1}
              >
                <ExerciseCardContent exercise={exercise} />
              </ColorfulCard>
            ))}
          </div>

          {/* No exercises message */}
          {exercises.length === 0 && (
            <EnhancedCard variant="default" hover={false} className="text-center py-12">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-detective-text-secondary text-lg">
                No hay ejercicios disponibles en este módulo todavía.
              </p>
            </EnhancedCard>
          )}
        </div>

        {/* Bottom Spacing */}
        <div className="h-16" />
      </div>
    </div>
  );
}
