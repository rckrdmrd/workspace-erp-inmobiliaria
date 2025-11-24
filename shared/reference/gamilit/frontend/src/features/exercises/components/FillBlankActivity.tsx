/**
 * FillBlankActivity Component
 *
 * ISSUE: #4.3 (P0) - Fill in the Blank Exercise Mechanic
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 * ESPECIFICACIÓN: US-ACT-003
 *
 * Ejercicio de completar espacios en blanco
 *
 * Features:
 * - Input de texto para llenar blanks
 * - Validación parcial (ignora mayúsculas/espacios)
 * - Múltiples blanks en un ejercicio
 * - Drag & drop desde banco de palabras (opcional)
 * - Autocorrección inteligente
 * - Feedback por cada blank
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, GripVertical, Check, X } from 'lucide-react';
import { ExerciseHeader } from './ExerciseHeader';
import { ExerciseFeedback } from './ExerciseFeedback';
import { useExerciseSubmission } from '../hooks/useExerciseSubmission';
import { useExerciseTimer } from '../hooks/useExerciseTimer';
import type {
  ExerciseComponentProps,
  ExerciseFeedback as FeedbackType,
} from '../types/exercise.types';

interface Blank {
  id: string;
  position: number;
  correctAnswer: string | string[]; // Multiple acceptable answers
  placeholder?: string;
}

interface WordBankItem {
  id: string;
  word: string;
  used: boolean;
}

export const FillBlankActivity: React.FC<ExerciseComponentProps> = ({
  exercise,
  userId,
  onComplete,
  onCancel,
  showTimer = true,
  allowHints = true,
}) => {
  // Parse blanks from exercise content
  // Expected format: correct_answer as JSON string with array of blanks
  const blanks: Blank[] = React.useMemo(() => {
    try {
      if (typeof exercise.content.correct_answer === 'string') {
        return JSON.parse(exercise.content.correct_answer);
      }
      // If it's already an array, treat each item as a blank
      if (Array.isArray(exercise.content.correct_answer)) {
        return exercise.content.correct_answer.map((answer, index) => ({
          id: `blank-${index}`,
          position: index,
          correctAnswer: answer,
        }));
      }
    } catch (e) {
      console.error('Failed to parse blanks:', e);
    }
    return [];
  }, [exercise.content.correct_answer]);

  // State
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [feedback, setFeedback] = useState<FeedbackType | null>(null);
  const [wordBank, setWordBank] = useState<WordBankItem[]>([]);
  const [useWordBank] = useState(false); // TODO: Make this configurable
  const [validationState, setValidationState] = useState<Record<string, boolean>>({});

  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Hooks
  const { submitExercise, isSubmitting, result } = useExerciseSubmission({
    onSuccess: (result) => {
      const feedbackData: FeedbackType = {
        type: result.is_correct ? 'success' : result.score_percentage >= 50 ? 'warning' : 'error',
        title: result.is_correct
          ? '¡Perfecto! 🎉'
          : result.score_percentage >= 50
          ? 'Parcialmente correcto 😊'
          : 'Incorrecto 😔',
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

  // Handle answer change
  const handleAnswerChange = (blankId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [blankId]: value }));

    // Clear validation state when user types
    setValidationState((prev) => {
      const newState = { ...prev };
      delete newState[blankId];
      return newState;
    });
  };

  // Normalize text for comparison
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/[.,;:!?]/g, ''); // Remove punctuation
  };

  // Check if answer is correct
  const isAnswerCorrect = (blankId: string, answer: string): boolean => {
    const blank = blanks.find((b) => b.id === blankId);
    if (!blank) return false;

    const normalizedAnswer = normalizeText(answer);
    const correctAnswers = Array.isArray(blank.correctAnswer)
      ? blank.correctAnswer
      : [blank.correctAnswer];

    return correctAnswers.some(
      (correct) => normalizeText(correct) === normalizedAnswer
    );
  };

  // Validate all answers before submission
  const validateAnswers = (): boolean => {
    const newValidationState: Record<string, boolean> = {};
    let allCorrect = true;

    blanks.forEach((blank) => {
      const answer = answers[blank.id] || '';
      const isCorrect = isAnswerCorrect(blank.id, answer);
      newValidationState[blank.id] = isCorrect;
      if (!isCorrect) allCorrect = false;
    });

    setValidationState(newValidationState);
    return allCorrect;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (isSubmitting || result) return;

    // Check if all blanks are filled
    const allFilled = blanks.every((blank) => answers[blank.id]?.trim());
    if (!allFilled) {
      setFeedback({
        type: 'warning',
        title: 'Campos incompletos',
        message: 'Por favor, completa todos los espacios en blanco antes de enviar.',
      });
      return;
    }

    const timeSpent = timer.stop();

    // Submit answers as JSON array
    const answersArray = blanks.map((blank) => answers[blank.id] || '');

    await submitExercise({
      exercise_id: exercise.id,
      user_id: userId,
      answer: JSON.stringify(answersArray),
      time_spent_seconds: timeSpent,
      hints_used: [],
      attempt_number: attemptNumber,
    });

    validateAnswers();
    setAttemptNumber((prev) => prev + 1);
  };

  // Split question text by blanks
  const renderQuestion = () => {
    const parts: React.ReactNode[] = [];
    const text = exercise.content.question;
    let lastIndex = 0;

    // Replace ___ or [blank] with input fields
    const blankRegex = /___+|\[blank\d*\]/gi;
    let match;
    let blankIndex = 0;

    while ((match = blankRegex.exec(text)) !== null) {
      // Add text before blank
      if (match.index > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      const blank = blanks[blankIndex];
      if (blank) {
        parts.push(renderBlankInput(blank));
        blankIndex++;
      }

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
    }

    return parts;
  };

  // Render blank input field
  const renderBlankInput = (blank: Blank) => {
    const value = answers[blank.id] || '';
    const isValidated = blank.id in validationState;
    const isCorrect = validationState[blank.id];

    return (
      <span key={blank.id} className="inline-flex items-center mx-1">
        <input
          ref={(el) => (inputRefs.current[blank.id] = el)}
          type="text"
          value={value}
          onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
          placeholder={blank.placeholder || '___'}
          disabled={result !== null || isSubmitting}
          className={`
            inline-block px-3 py-1 border-2 rounded-md text-center
            min-w-[120px] font-semibold transition-all
            ${
              !isValidated
                ? 'border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                : isCorrect
                ? 'border-green-500 bg-green-50 text-green-800'
                : 'border-red-500 bg-red-50 text-red-800'
            }
          `}
        />
        {isValidated && (
          <span className="ml-1">
            {isCorrect ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-red-600" />
            )}
          </span>
        )}
      </span>
    );
  };

  // Calculate completion percentage
  const filledBlanks = blanks.filter((blank) => answers[blank.id]?.trim()).length;
  const completionPercentage = blanks.length > 0
    ? Math.round((filledBlanks / blanks.length) * 100)
    : 0;

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

      {/* Question with blanks */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Completa los espacios en blanco:
            </h2>
            <span className="text-sm text-gray-600">
              {filledBlanks}/{blanks.length} completados ({completionPercentage}%)
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Question text with inputs */}
        <div className="text-xl leading-relaxed text-gray-900">
          {renderQuestion()}
        </div>

        {/* Media (if present) */}
        {exercise.content.media_url && exercise.content.media_type === 'image' && (
          <div className="mt-6 flex justify-center">
            <img
              src={exercise.content.media_url}
              alt="Exercise media"
              className="max-w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
        )}

        {/* Word bank (if enabled) */}
        {useWordBank && wordBank.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Banco de palabras:
            </h3>
            <div className="flex flex-wrap gap-2">
              {wordBank.map((item) => (
                <button
                  key={item.id}
                  disabled={item.used}
                  className={`
                    px-4 py-2 rounded-lg border-2 font-medium transition-all
                    ${
                      item.used
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400 cursor-move'
                    }
                  `}
                >
                  <GripVertical className="w-4 h-4 inline mr-1" />
                  {item.word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Hint text */}
        <p className="mt-6 text-sm text-gray-600 italic">
          💡 Tip: No te preocupes por mayúsculas o espacios extras, el sistema
          validará tu respuesta de forma inteligente.
        </p>
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

      {/* Correct answers (show after submission if incorrect) */}
      {result && !result.is_correct && (
        <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Respuestas correctas:
          </h3>
          <ul className="space-y-1">
            {blanks.map((blank, index) => {
              const correctAnswers = Array.isArray(blank.correctAnswer)
                ? blank.correctAnswer
                : [blank.correctAnswer];
              return (
                <li key={blank.id} className="text-sm text-blue-800">
                  <span className="font-semibold">Espacio {index + 1}:</span>{' '}
                  {correctAnswers.join(' o ')}
                </li>
              );
            })}
          </ul>
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
              Enviar respuesta
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
