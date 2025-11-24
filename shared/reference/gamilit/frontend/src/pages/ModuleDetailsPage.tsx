import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, BookOpen, Clock, TrendingUp, Target } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { GamifiedHeader } from '@/shared/components/layout/GamifiedHeader';
import { ExerciseAttemptCard } from '@/shared/components/ExerciseAttemptCard';
import { progressApi } from '@/lib/api/progress.api';
import { educationalApi } from '@/lib/api/educational.api';
import type { Module, Exercise } from '@/shared/types/educational.types';
import type { ModuleProgress, ExerciseAttempt } from '@/shared/types/progress.types';
import {
  formatTimeSpent,
  formatProgressPercentage,
  getDifficultyBadgeColor,
  getStatusBadgeColor,
} from '@/shared/utils/formatters';

/**
 * ModuleDetailsPage Component
 * Detailed view of a module with exercises and progress
 *
 * Features:
 * - Module header with progress stats
 * - Learning objectives
 * - Exercises list with attempt history
 * - Navigate to exercise player
 * - Back navigation
 * - Loading states
 * - Error handling
 *
 * Route: /progress/modules/:moduleId
 */
export const ModuleDetailsPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseAttempts, setExerciseAttempts] = useState<Record<string, ExerciseAttempt[]>>({});

  // Loading states
  const [isLoadingModule, setIsLoadingModule] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isLoadingExercises, setIsLoadingExercises] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Combined loading
  const isLoading = isLoadingModule || isLoadingProgress || isLoadingExercises;

  // Fetch module data
  useEffect(() => {
    const loadModule = async () => {
      if (!moduleId) return;

      try {
        setIsLoadingModule(true);
        setError(null);
        const data = await educationalApi.getModuleById(moduleId);
        setModule(data);
      } catch (err) {
        console.error('Failed to load module:', err);
        setError('Failed to load module. Please try again.');
      } finally {
        setIsLoadingModule(false);
      }
    };

    loadModule();
  }, [moduleId]);

  // Fetch module progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!moduleId || !user?.id) return;

      try {
        setIsLoadingProgress(true);
        const data = await progressApi.getModuleProgress(user.id, moduleId);
        setProgress(data);
      } catch (err) {
        console.error('Failed to load progress:', err);
        // Progress might not exist yet, don't set error
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [moduleId, user?.id]);

  // Fetch exercises
  useEffect(() => {
    const loadExercises = async () => {
      if (!moduleId) return;

      try {
        setIsLoadingExercises(true);
        const data = await educationalApi.getModuleExercises(moduleId);
        setExercises(data);
      } catch (err) {
        console.error('Failed to load exercises:', err);
        setError('Failed to load exercises. Please try again.');
      } finally {
        setIsLoadingExercises(false);
      }
    };

    loadExercises();
  }, [moduleId]);

  // Fetch exercise attempts (on demand, when exercises are loaded)
  useEffect(() => {
    const loadAttempts = async () => {
      if (!user?.id || exercises.length === 0) return;

      const attemptsMap: Record<string, ExerciseAttempt[]> = {};

      // Load attempts for each exercise
      await Promise.all(
        exercises.map(async (exercise) => {
          try {
            const attempts = await progressApi.getExerciseAttempts(user.id, exercise.id);
            attemptsMap[exercise.id] = attempts;
          } catch (err) {
            console.error(`Failed to load attempts for exercise ${exercise.id}:`, err);
            attemptsMap[exercise.id] = [];
          }
        })
      );

      setExerciseAttempts(attemptsMap);
    };

    loadAttempts();
  }, [user?.id, exercises]);

  // Handle back navigation
  const handleBack = () => {
    navigate('/progress');
  };

  // Handle exercise start
  const handleExerciseStart = (exerciseId: string) => {
    // TODO: Navigate to exercise player
    navigate(`/exercises/${exerciseId}/player`);
  };

  // Retry loading
  const handleRetry = () => {
    window.location.reload();
  };

  // Calculate stats
  const progressPercentage = progress?.progress_percentage || 0;
  const status = progress?.status || 'not_started';
  const exercisesCompleted = progress?.completed_exercises || 0;
  const exercisesTotal = exercises.length;
  const timeSpent = progress?.time_spent_seconds || 0;
  const averageScore = progress?.average_score || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <GamifiedHeader user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Back Button */}
        <button
        onClick={handleBack}
        className="
          mb-6 inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900
          transition-colors focus:outline-none
        "
        aria-label="Back to progress"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Progress</span>
      </button>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Module Header */}
      {isLoadingModule ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 animate-pulse">
          <div className="h-8 w-2/3 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-full bg-gray-200 rounded mb-2" />
          <div className="h-4 w-3/4 bg-gray-200 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      ) : module ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          {/* Title and Badges */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">{module.title}</h1>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${getDifficultyBadgeColor(
                    module.difficulty
                  )}`}
                >
                  {module.difficulty}
                </span>
              </div>
              <p className="text-gray-600 text-lg">{module.description}</p>
            </div>

            {progress && (
              <span
                className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap ${getStatusBadgeColor(
                  status
                )}`}
              >
                {status.replace('_', ' ')}
              </span>
            )}
          </div>

          {/* Progress Bar */}
          {progress && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                <span className="text-sm font-semibold text-orange-600">
                  {formatProgressPercentage(progressPercentage)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-orange-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                  role="progressbar"
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Exercises Completed */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Exercises</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {exercisesCompleted}/{exercisesTotal}
              </p>
            </div>

            {/* Time Spent */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Time Spent</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatTimeSpent(timeSpent)}</p>
            </div>

            {/* Average Score */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Avg Score</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {averageScore > 0 ? `${Math.round(averageScore)}%` : 'N/A'}
              </p>
            </div>

            {/* Estimated Time */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Est. Time</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {module.estimated_time_minutes}m
              </p>
            </div>
          </div>

          {/* Learning Objectives */}
          {module.learning_objectives && module.learning_objectives.length > 0 && (
            <div className="pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {module.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : null}

      {/* Exercises Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Exercises</h2>

        {/* Loading Skeletons */}
        {isLoadingExercises && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                  <div className="flex-1">
                    <div className="h-6 w-2/3 bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                    <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
                    <div className="h-10 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Exercise Cards */}
        {!isLoadingExercises && exercises.length > 0 && (
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <ExerciseAttemptCard
                key={exercise.id}
                exercise={exercise}
                attempts={exerciseAttempts[exercise.id]}
                onStart={() => handleExerciseStart(exercise.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoadingExercises && exercises.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No exercises available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              This module doesn't have any exercises yet. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Progress Timeline - Placeholder */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Progress Timeline</h2>
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Progress Chart Coming Soon
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {/* TODO: Implement progress timeline chart showing progress over time */}
              Track your progress in this module over time with interactive charts.
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ModuleDetailsPage;
