/**
 * TrueFalseActivity Component
 *
 * ISSUE: #4.2 (P0) - True/False Exercise Mechanic
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 * ESPECIFICACIÓN: US-ACT-002
 *
 * Ejercicio de Verdadero/Falso con 2 opciones
 *
 * Features:
 * - 2 opciones (Verdadero/Falso)
 * - Validación inmediata
 * - Explicación de respuesta correcta
 * - Integración con gamificación (XP, ML Coins)
 * - Animaciones de éxito/error
 * - Timer opcional
 */

import React, { useState } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { ExerciseHeader } from './ExerciseHeader';
import { ExerciseFeedback } from './ExerciseFeedback';
import { useExerciseSubmission } from '../hooks/useExerciseSubmission';
import { useExerciseTimer } from '../hooks/useExerciseTimer';
import type {
  ExerciseComponentProps,
  ExerciseFeedback as FeedbackType,
} from '../types/exercise.types';

type TrueFalseAnswer = 'true' | 'false';

export const TrueFalseActivity: React.FC<ExerciseComponentProps> = ({
  exercise,
  userId,
  onComplete,
  onCancel,
  showTimer = true,
  allowHints = false, // True/False typically doesn't need hints
}) => {
  // State
  const [selectedAnswer, setSelectedAnswer] = useState<TrueFalseAnswer | null>(null);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);

  // Hooks
  const { submitExercise, isSubmitting, result } = useExerciseSubmission({
    onSuccess: (result) => {
      const feedbackData: FeedbackType = {
        type: result.is_correct ? 'success' : 'error',
        title: result.is_correct ? '¡Correcto! 🎉' : 'Incorrecto 😔',
        message: result.feedback,
        xpEarned: result.xp_earned,
        mlCoinsEarned: result.ml_coins_earned,
        showConfetti: result.is_correct,
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

  // Handle answer selection
  const handleAnswerSelect = (answer: TrueFalseAnswer) => {
    if (result || isSubmitting) return;
    setSelectedAnswer(answer);
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!selectedAnswer || isSubmitting || result) return;

    const timeSpent = timer.stop();

    await submitExercise({
      exercise_id: exercise.id,
      user_id: userId,
      answer: selectedAnswer,
      time_spent_seconds: timeSpent,
      hints_used: [],
      attempt_number: attemptNumber,
    });

    setAttemptNumber((prev) => prev + 1);
  };

  // Get correct answer
  const correctAnswer = exercise.content.correct_answer as string;

  // Get button style
  const getButtonStyle = (answer: TrueFalseAnswer, isTrue: boolean) => {
    const isSelected = selectedAnswer === answer;
    const isCorrectAnswer = correctAnswer === answer;

    if (!result) {
      // Before submission
      if (isSelected) {
        return isTrue
          ? 'bg-green-500 border-green-600 text-white ring-4 ring-green-200 scale-105'
          : 'bg-red-500 border-red-600 text-white ring-4 ring-red-200 scale-105';
      }
      return isTrue
        ? 'bg-white border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400'
        : 'bg-white border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400';
    }

    // After submission
    if (result.is_correct && isSelected) {
      return isTrue
        ? 'bg-green-500 border-green-600 text-white ring-4 ring-green-200'
        : 'bg-red-500 border-red-600 text-white ring-4 ring-red-200';
    }

    if (!result.is_correct && isSelected) {
      return 'bg-gray-500 border-gray-600 text-white opacity-60';
    }

    if (isCorrectAnswer) {
      return isTrue
        ? 'bg-green-100 border-green-500 text-green-800 ring-2 ring-green-300'
        : 'bg-red-100 border-red-500 text-red-800 ring-2 ring-red-300';
    }

    return 'bg-white border-gray-300 text-gray-500 opacity-50';
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
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          {exercise.content.question}
        </h2>

        {/* Media (if present) */}
        {exercise.content.media_url && exercise.content.media_type === 'image' && (
          <div className="mb-8 flex justify-center">
            <img
              src={exercise.content.media_url}
              alt="Exercise media"
              className="max-w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* True/False buttons */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* TRUE button */}
          <button
            onClick={() => handleAnswerSelect('true')}
            disabled={result !== null || isSubmitting || timer.isTimeExpired}
            className={`
              p-8 rounded-2xl border-3 transition-all duration-300
              flex flex-col items-center justify-center
              disabled:cursor-not-allowed
              transform hover:scale-105
              ${getButtonStyle('true', true)}
            `}
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-current opacity-20" />
            <Check className="w-12 h-12 mb-3" strokeWidth={3} />
            <span className="text-2xl font-bold">VERDADERO</span>
            {result && correctAnswer === 'true' && (
              <span className="mt-2 text-sm font-semibold">✓ Respuesta correcta</span>
            )}
          </button>

          {/* FALSE button */}
          <button
            onClick={() => handleAnswerSelect('false')}
            disabled={result !== null || isSubmitting || timer.isTimeExpired}
            className={`
              p-8 rounded-2xl border-3 transition-all duration-300
              flex flex-col items-center justify-center
              disabled:cursor-not-allowed
              transform hover:scale-105
              ${getButtonStyle('false', false)}
            `}
          >
            <div className="w-16 h-16 mb-4 rounded-full bg-current opacity-20" />
            <X className="w-12 h-12 mb-3" strokeWidth={3} />
            <span className="text-2xl font-bold">FALSO</span>
            {result && correctAnswer === 'false' && (
              <span className="mt-2 text-sm font-semibold">✓ Respuesta correcta</span>
            )}
          </button>
        </div>

        {/* Helper text */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          Selecciona tu respuesta y presiona "Enviar respuesta"
        </p>
      </div>

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
            !selectedAnswer ||
            isSubmitting ||
            result !== null ||
            timer.isTimeExpired
          }
          className={`
            px-8 py-3 rounded-lg font-semibold transition-all
            flex items-center text-lg
            ${
              selectedAnswer && !isSubmitting && !result && !timer.isTimeExpired
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
              Enviar respuesta
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
