/**
 * MultipleChoiceActivity Component
 *
 * ISSUE: #4.1 (P0 - CRITICAL) - Multiple Choice Exercise Mechanic
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 * ESPECIFICACIÓN: US-ACT-001
 *
 * Ejercicio de opción múltiple con 4 opciones (A, B, C, D)
 *
 * Features:
 * - 4 opciones, solo 1 correcta
 * - Validación inmediata
 * - Feedback visual (verde/rojo)
 * - Integración con ML Coins y XP
 * - Pistas con costo en ML Coins
 * - Timer opcional
 * - Historial de respuestas
 * - Animaciones de éxito/error
 */

import React, { useState, useEffect } from 'react';
import { Lightbulb, Coins, Clock, ChevronRight, X } from 'lucide-react';
import { ExerciseHeader } from './ExerciseHeader';
import { ExerciseFeedback } from './ExerciseFeedback';
import { useExerciseSubmission } from '../hooks/useExerciseSubmission';
import { useExerciseTimer } from '../hooks/useExerciseTimer';
import { useExerciseRewards } from '../hooks/useExerciseRewards';
import type {
  Exercise,
  ExerciseComponentProps,
  ExerciseHint,
  ExerciseFeedback as FeedbackType,
} from '../types/exercise.types';

export const MultipleChoiceActivity: React.FC<ExerciseComponentProps> = ({
  exercise,
  userId,
  onComplete,
  onCancel,
  showTimer = true,
  allowHints = true,
}) => {
  // State
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [showHints, setShowHints] = useState(false);

  // Hooks
  const { submitExercise, isSubmitting, result } = useExerciseSubmission({
    onSuccess: (result) => {
      const feedbackData: FeedbackType = {
        type: result.is_correct ? 'success' : 'error',
        title: result.is_correct ? '¡Correcto! 🎉' : 'Incorrecto 😔',
        message: result.feedback,
        xpEarned: result.xp_earned,
        mlCoinsEarned: result.ml_coins_earned,
        showConfetti: result.is_correct && result.score_percentage === 100,
      };
      setFeedback(feedbackData);

      if (result.is_correct) {
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

  const rewards = useExerciseRewards({
    initialMLCoins: 100, // TODO: Get from user context
    onMLCoinsChange: (newBalance) => {
      console.log('ML Coins balance updated:', newBalance);
    },
  });

  // Get options from exercise content
  const options = exercise.content.options || [];

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (result || isSubmitting) return;
    setSelectedOption(optionId);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedOption || isSubmitting || result) return;

    const timeSpent = timer.stop();

    await submitExercise({
      exercise_id: exercise.id,
      user_id: userId,
      answer: selectedOption,
      time_spent_seconds: timeSpent,
      hints_used: rewards.unlockedHints,
      attempt_number: attemptNumber,
    });

    setAttemptNumber((prev) => prev + 1);
  };

  // Handle hint unlock
  const handleUnlockHint = (hint: ExerciseHint) => {
    const success = rewards.unlockHint(hint);
    if (!success) {
      setFeedback({
        type: 'warning',
        title: 'ML Coins insuficientes',
        message: `Necesitas ${hint.ml_coins_cost} ML Coins para desbloquear esta pista.`,
      });
    }
  };

  // Get option style based on state
  const getOptionStyle = (optionId: string, isCorrect: boolean) => {
    const isSelected = selectedOption === optionId;

    if (!result) {
      // Before submission
      return isSelected
        ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50';
    }

    // After submission
    if (result.is_correct && isSelected) {
      return 'border-green-500 bg-green-50 ring-2 ring-green-200';
    }

    if (!result.is_correct && isSelected) {
      return 'border-red-500 bg-red-50 ring-2 ring-red-200';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-50';
    }

    return 'border-gray-300 opacity-60';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      {/* Question */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {exercise.content.question}
        </h2>

        {/* Media (if present) */}
        {exercise.content.media_url && exercise.content.media_type === 'image' && (
          <div className="mb-6">
            <img
              src={exercise.content.media_url}
              alt="Exercise media"
              className="max-w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={result !== null || isSubmitting || timer.isTimeExpired}
              className={`
                w-full p-4 rounded-lg border-2 transition-all duration-200
                flex items-center text-left
                disabled:cursor-not-allowed
                ${getOptionStyle(option.id, option.is_correct)}
              `}
            >
              {/* Option label (A, B, C, D) */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-bold text-lg mr-4 flex-shrink-0
                  ${
                    selectedOption === option.id
                      ? result
                        ? result.is_correct
                          ? 'bg-green-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-purple-600 text-white'
                      : result && option.is_correct
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }
                `}
              >
                {option.label}
              </div>

              {/* Option text */}
              <span className="text-base font-medium text-gray-900 flex-1">
                {option.text}
              </span>

              {/* Check mark for correct answer */}
              {result && option.is_correct && (
                <span className="text-green-600 ml-2">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Hints Section */}
      {allowHints && exercise.hints && exercise.hints.length > 0 && (
        <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center">
              <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="font-semibold text-gray-900">
                Pistas ({exercise.hints.length})
              </span>
            </div>
            <span className="text-gray-500 text-sm">
              {showHints ? 'Ocultar' : 'Mostrar'}
            </span>
          </button>

          {showHints && (
            <div className="mt-4 space-y-3">
              {exercise.hints
                .sort((a, b) => a.order - b.order)
                .map((hint) => {
                  const isUnlocked = rewards.isHintUnlocked(hint.id);
                  const canAfford = rewards.canAffordHint(hint);

                  return (
                    <div
                      key={hint.id}
                      className="p-4 border-2 border-gray-200 rounded-lg"
                    >
                      {isUnlocked ? (
                        <div className="flex items-start">
                          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2 mt-0.5" />
                          <p className="text-gray-700">{hint.text}</p>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            Pista #{hint.order}
                          </span>
                          <button
                            onClick={() => handleUnlockHint(hint)}
                            disabled={!canAfford || result !== null}
                            className={`
                              flex items-center px-3 py-1 rounded-lg text-sm font-semibold
                              transition-colors
                              ${
                                canAfford && !result
                                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }
                            `}
                          >
                            <Coins className="w-4 h-4 mr-1" />
                            {hint.ml_coins_cost} ML Coins
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="mb-6">
          <ExerciseFeedback
            feedback={feedback}
            explanation={result?.explanation || exercise.content.explanation}
            onClose={
              result?.is_correct
                ? () => onComplete(result)
                : () => setFeedback(null)
            }
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          {/* ML Coins balance */}
          <span className="flex items-center text-yellow-600 font-semibold">
            <Coins className="w-4 h-4 mr-1" />
            {rewards.mlCoinsBalance} ML Coins
          </span>

          {rewards.mlCoinsSpent > 0 && (
            <span className="text-gray-600">
              ({rewards.mlCoinsSpent} gastados en pistas)
            </span>
          )}
        </div>

        <div className="flex gap-3">
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
              !selectedOption ||
              isSubmitting ||
              result !== null ||
              timer.isTimeExpired
            }
            className={`
              px-6 py-3 rounded-lg font-semibold transition-all
              flex items-center
              ${
                selectedOption && !isSubmitting && !result && !timer.isTimeExpired
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
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
                Enviar respuesta
                <ChevronRight className="w-5 h-5 ml-1" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
