/**
 * ExerciseHistory Component
 *
 * ISSUE: #5.1 (P0) - Exercise History & Feedback
 * FECHA: 2025-11-04
 * SPRINT: Sprint 3
 *
 * Muestra el historial de intentos de un ejercicio
 *
 * Features:
 * - Lista de todos los intentos
 * - Detalles por intento: fecha, score, tiempo
 * - Respuesta dada y respuesta correcta
 * - XP y ML Coins ganados
 * - Timeline visual
 * - Filtros por resultado
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, TrendingUp, Zap, Coins, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import type { ExerciseAttempt } from '@/features/exercises/types';

interface ExerciseHistoryProps {
  exerciseId: string;
  userId: string;
  maxAttempts?: number;
  showAnswers?: boolean;
}

interface AttemptWithDetails extends ExerciseAttempt {
  answer_given?: string | string[];
  correct_answer?: string | string[];
  expanded?: boolean;
  score_percentage?: number;
  // user_id inherited from ExerciseAttempt
  submitted_answers?: any;
  hints_used?: number;
  comodines_used?: any[];
  metadata?: any;
}

export const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({
  exerciseId,
  userId,
  maxAttempts = 10,
  showAnswers = true,
}) => {
  const [attempts, setAttempts] = useState<AttemptWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect'>('all');
  const [expandedAttempts, setExpandedAttempts] = useState<Set<string>>(new Set());

  // Fetch attempts
  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // const data = await progressApi.getExerciseAttempts(userId, exerciseId);

        // Mock data for demonstration
        const mockAttempts: AttemptWithDetails[] = [
          {
            id: '1',
            user_id: userId,
            exercise_id: exerciseId,
            attempt_number: 3,
            answer: 'option-c',
            is_correct: true,
            score_percentage: 100,
            xp_earned: 50,
            ml_coins_earned: 10,
            time_spent_seconds: 45,
            submitted_at: new Date('2025-11-04T10:30:00'),
            answer_given: 'C',
            correct_answer: 'C',
          },
          {
            id: '2',
            user_id: userId,
            exercise_id: exerciseId,
            attempt_number: 2,
            answer: 'option-b',
            is_correct: false,
            score_percentage: 0,
            xp_earned: 0,
            ml_coins_earned: 0,
            time_spent_seconds: 30,
            submitted_at: new Date('2025-11-04T10:25:00'),
            answer_given: 'B',
            correct_answer: 'C',
          },
          {
            id: '3',
            user_id: userId,
            exercise_id: exerciseId,
            attempt_number: 1,
            answer: 'option-a',
            is_correct: false,
            score_percentage: 0,
            xp_earned: 0,
            ml_coins_earned: 0,
            time_spent_seconds: 60,
            submitted_at: new Date('2025-11-04T10:20:00'),
            answer_given: 'A',
            correct_answer: 'C',
          },
        ];

        setAttempts(mockAttempts);
      } catch (error) {
        console.error('Failed to fetch attempts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttempts();
  }, [exerciseId, userId]);

  // Filter attempts
  const filteredAttempts = attempts.filter((attempt) => {
    if (filter === 'all') return true;
    if (filter === 'correct') return attempt.is_correct;
    if (filter === 'incorrect') return !attempt.is_correct;
    return true;
  });

  // Toggle attempt details
  const toggleExpanded = (attemptId: string) => {
    setExpandedAttempts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(attemptId)) {
        newSet.delete(attemptId);
      } else {
        newSet.add(attemptId);
      }
      return newSet;
    });
  };

  // Calculate statistics
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter((a) => a.is_correct).length;
  const successRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const bestScore = Math.max(...attempts.map((a) => a.score_percentage ?? 0), 0);
  const totalXP = attempts.reduce((sum, a) => sum + a.xp_earned, 0);

  // Format time
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-gray-600 mt-3">Cargando historial...</p>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin intentos aún</h3>
        <p className="text-gray-600">Este ejercicio no tiene intentos registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Historial de Intentos</h3>
        <p className="text-sm text-gray-600">{totalAttempts} intento(s) registrado(s)</p>
      </div>

      {/* Statistics */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{totalAttempts}</div>
            <div className="text-xs text-gray-600 mt-1">Total Intentos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <div className="text-xs text-gray-600 mt-1">Tasa de éxito</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{bestScore}%</div>
            <div className="text-xs text-gray-600 mt-1">Mejor puntuación</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{totalXP}</div>
            <div className="text-xs text-gray-600 mt-1">XP Total ganado</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-2">
        <span className="text-sm text-gray-600 font-semibold">Filtrar:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos ({attempts.length})
        </button>
        <button
          onClick={() => setFilter('correct')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            filter === 'correct'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Correctos ({correctAttempts})
        </button>
        <button
          onClick={() => setFilter('incorrect')}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            filter === 'incorrect'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Incorrectos ({totalAttempts - correctAttempts})
        </button>
      </div>

      {/* Timeline */}
      <div className="px-6 py-4 max-h-[500px] overflow-y-auto">
        <div className="space-y-3">
          {filteredAttempts.map((attempt, index) => {
            const isExpanded = expandedAttempts.has(attempt.id);
            const isLatest = index === 0;

            return (
              <div
                key={attempt.id}
                className={`
                  relative border-2 rounded-lg transition-all
                  ${
                    attempt.is_correct
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                  }
                  ${isLatest ? 'ring-2 ring-purple-400' : ''}
                `}
              >
                {/* Main info */}
                <button
                  onClick={() => toggleExpanded(attempt.id)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Status icon */}
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center
                          ${attempt.is_correct ? 'bg-green-600' : 'bg-red-600'}
                        `}
                      >
                        {attempt.is_correct ? (
                          <Check className="w-6 h-6 text-white" />
                        ) : (
                          <X className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* Attempt info */}
                      <div>
                        <div className="font-semibold text-gray-900">
                          Intento #{attempt.attempt_number}
                          {isLatest && (
                            <span className="ml-2 px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                              Más reciente
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(attempt.submitted_at)}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(attempt.time_spent_seconds ?? 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Score and rewards */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {attempt.score_percentage}%
                        </div>
                        {attempt.is_correct && (
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="flex items-center text-purple-600 font-semibold">
                              <Zap className="w-3 h-3 mr-0.5" />
                              +{attempt.xp_earned}
                            </span>
                            <span className="flex items-center text-yellow-600 font-semibold">
                              <Coins className="w-3 h-3 mr-0.5" />
                              +{attempt.ml_coins_earned}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Expand icon */}
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && showAnswers && (
                  <div className="px-4 pb-4 border-t border-gray-200 bg-white">
                    <div className="pt-4 space-y-3">
                      {/* Answer given */}
                      <div>
                        <div className="text-xs font-semibold text-gray-700 mb-1">
                          Respuesta dada:
                        </div>
                        <div
                          className={`
                            p-3 rounded-lg border-2 font-medium
                            ${
                              attempt.is_correct
                                ? 'bg-green-50 border-green-300 text-green-900'
                                : 'bg-red-50 border-red-300 text-red-900'
                            }
                          `}
                        >
                          {Array.isArray(attempt.answer_given)
                            ? attempt.answer_given.join(', ')
                            : attempt.answer_given}
                        </div>
                      </div>

                      {/* Correct answer (if incorrect) */}
                      {!attempt.is_correct && attempt.correct_answer && (
                        <div>
                          <div className="text-xs font-semibold text-gray-700 mb-1">
                            Respuesta correcta:
                          </div>
                          <div className="p-3 rounded-lg border-2 border-green-300 bg-green-50 text-green-900 font-medium">
                            {Array.isArray(attempt.correct_answer)
                              ? attempt.correct_answer.join(', ')
                              : attempt.correct_answer}
                          </div>
                        </div>
                      )}

                      {/* Additional stats */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600">Tiempo empleado</div>
                          <div className="font-semibold text-gray-900">
                            {formatTime(attempt.time_spent_seconds ?? 0)}
                          </div>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-600">Puntuación</div>
                          <div className="font-semibold text-gray-900">
                            {attempt.score_percentage}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      {filteredAttempts.length === 0 && filter !== 'all' && (
        <div className="px-6 py-4 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            No hay intentos que coincidan con el filtro seleccionado.
          </p>
        </div>
      )}
    </div>
  );
};
