/**
 * MatchingActivity Component
 *
 * ISSUE: #4.6 (P0) - Matching Exercise Mechanic
 * FECHA: 2025-11-04
 * SPRINT: Sprint 2
 * ESPECIFICACIÓN: US-ACT-006
 *
 * Ejercicio de emparejar elementos de dos columnas
 *
 * Features:
 * - Dos columnas (izquierda y derecha)
 * - Click para seleccionar y emparejar
 * - Líneas visuales conectando pares
 * - Validación de emparejamientos correctos
 * - Deshacer emparejamiento
 * - Shuffle de columna derecha
 * - Animaciones de conexión
 */

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, X, Link2, Check, Shuffle } from 'lucide-react';
import { ExerciseHeader } from './ExerciseHeader';
import { ExerciseFeedback } from './ExerciseFeedback';
import { useExerciseSubmission } from '../hooks/useExerciseSubmission';
import { useExerciseTimer } from '../hooks/useExerciseTimer';
import type {
  ExerciseComponentProps,
  ExerciseFeedback as FeedbackType,
} from '../types/exercise.types';

interface MatchItem {
  id: string;
  content: string;
  side: 'left' | 'right';
  correctMatchId: string; // ID of the correct pair
  imageUrl?: string;
}

interface Match {
  leftId: string;
  rightId: string;
  isCorrect?: boolean;
}

export const MatchingActivity: React.FC<ExerciseComponentProps> = ({
  exercise,
  userId,
  onComplete,
  onCancel,
  showTimer = true,
  allowHints = true,
}) => {
  // Parse matching pairs from exercise content
  const { leftItems, rightItems } = React.useMemo(() => {
    try {
      // Expected format: content.options contains all items
      // Even indices = left, odd indices = right
      if (exercise.content.options) {
        const left: MatchItem[] = [];
        const right: MatchItem[] = [];

        exercise.content.options.forEach((opt, index) => {
          if (index % 2 === 0) {
            // Left item
            const rightPairId = exercise.content.options![index + 1]?.id || '';
            left.push({
              id: opt.id,
              content: opt.text,
              side: 'left',
              correctMatchId: rightPairId,
            });
          } else {
            // Right item
            const leftPairId = exercise.content.options![index - 1]?.id || '';
            right.push({
              id: opt.id,
              content: opt.text,
              side: 'right',
              correctMatchId: leftPairId,
            });
          }
        });

        // Shuffle right items
        const shuffled = [...right].sort(() => Math.random() - 0.5);

        return { leftItems: left, rightItems: shuffled };
      }
    } catch (e) {
      console.error('Failed to parse matching items:', e);
    }
    return { leftItems: [], rightItems: [] };
  }, [exercise.content.options]);

  // State
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { submitExercise, isSubmitting, result } = useExerciseSubmission({
    onSuccess: (result) => {
      const feedbackData: FeedbackType = {
        type: result.is_correct ? 'success' : result.score_percentage >= 50 ? 'warning' : 'error',
        title: result.is_correct
          ? '¡Emparejamiento perfecto! 🎉'
          : result.score_percentage >= 50
          ? 'Parcialmente correcto 😊'
          : 'Emparejamientos incorrectos 😔',
        message: result.feedback,
        xpEarned: result.xp_earned,
        mlCoinsEarned: result.ml_coins_earned,
        showConfetti: result.is_correct,
      };
      setFeedback(feedbackData);

      if (result.is_correct || result.score_percentage >= 70) {
        setTimeout(() => {
          onComplete(result);
        }, 3000);
      }
    },
    onError: (error) => {
      setFeedback({
        type: 'error',
        title: 'Error',
        message: 'Hubo un problema al enviar tu respuesta. Intenta de nuevo.',
      });
    },
  });

  const timer = useExerciseTimer({
    timeLimitSeconds: exercise.time_limit_seconds,
    onTimeExpired: () => {
      if (!result) {
        setFeedback({
          type: 'warning',
          title: 'Tiempo agotado ⏰',
          message: 'Se ha acabado el tiempo para este ejercicio.',
        });
      }
    },
    autoStart: true,
  });

  // Handle item selection
  const handleItemClick = (itemId: string, side: 'left' | 'right') => {
    if (result) return;

    // Check if item is already matched
    const isMatched = matches.some((m) => m.leftId === itemId || m.rightId === itemId);
    if (isMatched) return;

    if (side === 'left') {
      if (selectedLeft === itemId) {
        setSelectedLeft(null);
      } else {
        setSelectedLeft(itemId);

        // If right is selected, create match
        if (selectedRight) {
          createMatch(itemId, selectedRight);
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    } else {
      if (selectedRight === itemId) {
        setSelectedRight(null);
      } else {
        setSelectedRight(itemId);

        // If left is selected, create match
        if (selectedLeft) {
          createMatch(selectedLeft, itemId);
          setSelectedLeft(null);
          setSelectedRight(null);
        }
      }
    }
  };

  // Create a match
  const createMatch = (leftId: string, rightId: string) => {
    setMatches((prev) => [...prev, { leftId, rightId }]);
  };

  // Remove a match
  const removeMatch = (leftId: string, rightId: string) => {
    if (result) return;
    setMatches((prev) => prev.filter((m) => !(m.leftId === leftId && m.rightId === rightId)));
  };

  // Check if item is matched
  const isItemMatched = (itemId: string): boolean => {
    return matches.some((m) => m.leftId === itemId || m.rightId === itemId);
  };

  // Get match for item
  const getMatchForItem = (itemId: string): Match | undefined => {
    return matches.find((m) => m.leftId === itemId || m.rightId === itemId);
  };

  // Validate matches
  const validateMatches = () => {
    const validatedMatches = matches.map((match) => {
      const leftItem = leftItems.find((i) => i.id === match.leftId);
      const isCorrect = leftItem?.correctMatchId === match.rightId;
      return { ...match, isCorrect };
    });
    setMatches(validatedMatches);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (isSubmitting || result) return;

    // Check if all items are matched
    if (matches.length < leftItems.length) {
      setFeedback({
        type: 'warning',
        title: 'Emparejamientos incompletos',
        message: `Por favor, empareja todos los elementos. Faltan ${
          leftItems.length - matches.length
        } emparejamiento(s).`,
      });
      return;
    }

    const timeSpent = timer.stop();

    // Build answer as array of {left, right} pairs
    const answer = matches.map((m) => ({ left: m.leftId, right: m.rightId }));

    await submitExercise({
      exercise_id: exercise.id,
      user_id: userId,
      answer: JSON.stringify(answer),
      time_spent_seconds: timeSpent,
      hints_used: [],
      attempt_number: attemptNumber,
    });

    validateMatches();
    setAttemptNumber((prev) => prev + 1);
  };

  // Calculate completion
  const completionPercentage =
    leftItems.length > 0 ? Math.round((matches.length / leftItems.length) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <ExerciseHeader
        exercise={exercise}
        attemptNumber={attemptNumber}
        formattedTime={
          showTimer
            ? exercise.time_limit_seconds
              ? timer.formattedRemaining || '00:00'
              : timer.formattedElapsed
            : undefined
        }
        showTimer={showTimer}
        isTimeExpired={timer.isTimeExpired}
      />

      {/* Main content */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {exercise.content.question}
            </h2>
            <span className="text-sm text-gray-600">
              {matches.length}/{leftItems.length} emparejados ({completionPercentage}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          <p className="text-gray-600 mb-6">
            Haz clic en un elemento de cada columna para emparejarlos. Puedes deshacer
            haciendo clic en la ✕ de cada par.
          </p>
        </div>

        {/* Matching grid */}
        <div ref={containerRef} className="grid grid-cols-2 gap-8 relative">
          {/* Left column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Columna A:</h3>
            {leftItems.map((item) => {
              const isMatched = isItemMatched(item.id);
              const isSelected = selectedLeft === item.id;
              const match = getMatchForItem(item.id);
              const isValidated = match?.isCorrect !== undefined;
              const isCorrect = match?.isCorrect;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id, 'left')}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  disabled={result !== null}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all
                    ${
                      isValidated
                        ? isCorrect
                          ? 'bg-green-50 border-green-500'
                          : 'bg-red-50 border-red-500'
                        : isSelected
                        ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-200'
                        : isMatched
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-white border-gray-300 hover:border-purple-400 hover:shadow-md'
                    }
                    ${result ? 'cursor-default' : isMatched ? 'cursor-pointer' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.content}</span>
                    {isValidated && (
                      <span className="ml-2">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </span>
                    )}
                    {isMatched && !isValidated && (
                      <Link2 className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right column */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Columna B:</h3>
            {rightItems.map((item) => {
              const isMatched = isItemMatched(item.id);
              const isSelected = selectedRight === item.id;
              const match = getMatchForItem(item.id);
              const isValidated = match?.isCorrect !== undefined;
              const isCorrect = match?.isCorrect;

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id, 'right')}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  disabled={result !== null}
                  className={`
                    w-full p-4 rounded-lg border-2 text-left transition-all
                    ${
                      isValidated
                        ? isCorrect
                          ? 'bg-green-50 border-green-500'
                          : 'bg-red-50 border-red-500'
                        : isSelected
                        ? 'bg-purple-100 border-purple-500 ring-2 ring-purple-200'
                        : isMatched
                        ? 'bg-blue-50 border-blue-400'
                        : 'bg-white border-gray-300 hover:border-purple-400 hover:shadow-md'
                    }
                    ${result ? 'cursor-default' : isMatched ? 'cursor-pointer' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{item.content}</span>
                    {isValidated && (
                      <span className="ml-2">
                        {isCorrect ? (
                          <Check className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </span>
                    )}
                    {isMatched && !isValidated && (
                      <Link2 className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current matches */}
        {matches.length > 0 && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Emparejamientos actuales:
            </h3>
            <div className="space-y-2">
              {matches.map((match, index) => {
                const leftItem = leftItems.find((i) => i.id === match.leftId);
                const rightItem = rightItems.find((i) => i.id === match.rightId);
                const isValidated = match.isCorrect !== undefined;
                const isCorrect = match.isCorrect;

                return (
                  <div
                    key={`${match.leftId}-${match.rightId}`}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border
                      ${
                        isValidated
                          ? isCorrect
                            ? 'bg-green-50 border-green-300'
                            : 'bg-red-50 border-red-300'
                          : 'bg-white border-gray-300'
                      }
                    `}
                  >
                    <span className="font-medium text-gray-900 min-w-[40px]">
                      #{index + 1}
                    </span>
                    <span className="flex-1 text-gray-800">{leftItem?.content}</span>
                    <span className="text-gray-400">↔</span>
                    <span className="flex-1 text-gray-800">{rightItem?.content}</span>
                    {isValidated ? (
                      isCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )
                    ) : (
                      !result && (
                        <button
                          onClick={() => removeMatch(match.leftId, match.rightId)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                          title="Deshacer emparejamiento"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Helper text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Haz clic en un elemento de la Columna A y luego en un
            elemento de la Columna B para emparejarlos. Puedes cambiar los emparejamientos
            haciendo clic en la ✕.
          </p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mb-6">
          <ExerciseFeedback
            feedback={feedback}
            explanation={result?.explanation || exercise.content.explanation}
            onClose={
              result?.is_correct || (result && result.score_percentage >= 70)
                ? () => onComplete(result)
                : () => setFeedback(null)
            }
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        {onCancel && !result && (
          <button
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        )}

        <button
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            result !== null ||
            timer.isTimeExpired ||
            completionPercentage < 100
          }
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            flex items-center text-lg
            ${
              completionPercentage === 100 && !isSubmitting && !result && !timer.isTimeExpired
                ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          {isSubmitting ? (
            'Enviando...'
          ) : result ? (
            'Enviado'
          ) : (
            <>
              Verificar emparejamientos
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
