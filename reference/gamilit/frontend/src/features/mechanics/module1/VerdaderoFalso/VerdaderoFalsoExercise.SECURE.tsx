/**
 * VerdaderoFalsoExercise - SECURE VERSION
 *
 * SECURITY FEATURES:
 * - No local validation (all validation server-side)
 * - No correctAnswer in data (removed by backend)
 * - Uses useExerciseSubmission hook for secure submission
 * - Correct answers and explanations only shown AFTER server response
 * - Tracks hints/powerups for anti-cheat
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExerciseContainer } from '@shared/components/mechanics/ExerciseContainer';
import { ScoreDisplay } from '@shared/components/mechanics/ScoreDisplay';
import { TimerWidget } from '@shared/components/mechanics/TimerWidget';
import { ProgressTracker } from '@shared/components/mechanics/ProgressTracker';
import { HintSystem } from '@shared/components/mechanics/HintSystem';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { Check, CheckCircle, XCircle } from 'lucide-react';
import { useExerciseSubmission } from '@/features/mechanics/shared/hooks/useExerciseSubmission';
import { FeedbackData } from '@shared/components/mechanics/mechanicsTypes';

// ============================================================================
// TYPES (SECURE - No correctAnswer in statement)
// ============================================================================

interface VerdaderoFalsoStatement {
  id: string;
  statement: string;
  // NO correctAnswer - removed by backend sanitization
  // NO explanation - only shown after submission
  userAnswer?: boolean | null;
}

interface VerdaderoFalsoData {
  id: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  estimatedTime: number;
  topic: string;
  hints: Array<{
    id: string;
    text: string;
    cost: number;
  }>;
  statements: VerdaderoFalsoStatement[];
  contextText?: string;
}

export interface VerdaderoFalsoExerciseProps {
  exercise: VerdaderoFalsoData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const VerdaderoFalsoExercise: React.FC<VerdaderoFalsoExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate
}) => {
  // State for user answers (NO correctAnswer validation locally)
  const [statements, setStatements] = useState<VerdaderoFalsoStatement[]>(
    exercise.statements.map(stmt => ({ ...stmt, userAnswer: null }))
  );

  const [availableCoins, setAvailableCoins] = useState(100);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [currentScore, setCurrentScore] = useState(0);

  // SECURE: Submission result from server (includes correct answers)
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  // SECURE: Use submission hook
  const {
    submit,
    isSubmitting,
    data: serverResponse,
    recordHintUsed,
    getTimeElapsed
  } = useExerciseSubmission(exercise.id, {
    onSuccess: (result) => {
      // Server response includes correct answers and explanations
      setSubmissionResult(result);
      setShowResults(true);
      setCurrentScore(result.score);

      // Show feedback modal
      setFeedback({
        type: result.score >= 70 ? 'success' : 'partial',
        title: result.isPerfect ? '¡Perfecto!' : '¡Buen intento!',
        message: `Obtuviste ${result.score} puntos (${result.correctAnswers}/${result.totalQuestions} correctas)`,
        score: result.score,
        showConfetti: result.isPerfect
      });
      setShowFeedback(true);
    },
    onRateLimitError: (retryAfter) => {
      setFeedback({
        type: 'error',
        title: 'Demasiados intentos',
        message: `Por favor espera ${retryAfter} segundos antes de enviar de nuevo.`
      });
      setShowFeedback(true);
    },
    trackHints: true,
    trackPowerups: true
  });

  const answeredCount = statements.filter(s => s.userAnswer !== null).length;

  // Progress tracking
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate({
        currentStep: answeredCount,
        totalSteps: statements.length,
        score: currentScore,
        timeSpent: getTimeElapsed()
      });
    }
  }, [answeredCount, currentScore]);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleAnswer = (statementId: string, answer: boolean) => {
    if (showResults) return; // Lock answers after submission

    setStatements(prev =>
      prev.map(stmt =>
        stmt.id === statementId ? { ...stmt, userAnswer: answer } : stmt
      )
    );
  };

  const handleUseHint = (hint: { id: string; text: string; cost: number }) => {
    recordHintUsed();
    setAvailableCoins(prev => prev - hint.cost);
    alert(`Pista: ${hint.text}`);
  };

  /**
   * SECURE: Submit to server for validation
   */
  const handleCheck = () => {
    const allAnswered = statements.every(s => s.userAnswer !== null);

    if (!allAnswered) {
      setFeedback({
        type: 'error',
        title: 'Ejercicio Incompleto',
        message: `Has respondido ${answeredCount} de ${statements.length} preguntas. Responde todas antes de verificar.`
      });
      setShowFeedback(true);
      return;
    }

    // Build answers object
    const answers = statements.reduce((acc, stmt) => ({
      ...acc,
      [stmt.id]: stmt.userAnswer
    }), {});

    // SECURE: Submit to server (validation happens server-side)
    submit(answers);
  };

  const handleReset = () => {
    setStatements(exercise.statements.map(stmt => ({ ...stmt, userAnswer: null })));
    setShowResults(false);
    setCurrentScore(0);
    setSubmissionResult(null);
  };

  // ============================================================================
  // HELPER: Get statement status from server response
  // ============================================================================

  const getStatementResult = (statementId: string) => {
    if (!submissionResult || !showResults) return null;

    const userAnswer = statements.find(s => s.id === statementId)?.userAnswer;
    const correctAnswer = submissionResult.correctAnswers?.[statementId];
    const explanation = submissionResult.explanations?.[statementId];

    return {
      isCorrect: userAnswer === correctAnswer,
      correctAnswer,
      explanation
    };
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <ExerciseContainer exercise={exercise}>
      {/* Header Controls */}
      <DetectiveCard variant="default" padding="md" className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <TimerWidget startTime={Date.now()} isPaused={false} showSeconds={true} />
            <ProgressTracker
              currentStep={answeredCount}
              totalSteps={statements.length}
            />
          </div>
          <div className="flex items-center gap-3">
            <HintSystem
              hints={exercise.hints}
              onUseHint={handleUseHint}
              availableCoins={availableCoins}
            />
            <DetectiveButton
              variant="blue"
              onClick={handleReset}
              disabled={answeredCount === 0}
            >
              Reiniciar
            </DetectiveButton>
            <DetectiveButton
              variant="gold"
              onClick={handleCheck}
              icon={<Check className="w-5 h-5" />}
              disabled={answeredCount < statements.length || isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Verificar'}
            </DetectiveButton>
          </div>
        </div>
        {currentScore > 0 && (
          <div className="mt-4">
            <ScoreDisplay score={currentScore} maxScore={100} />
          </div>
        )}
      </DetectiveCard>

      {/* Context Text */}
      {exercise.contextText && (
        <DetectiveCard variant="info" padding="md" className="mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📖</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Contexto Histórico</h3>
              <p className="text-gray-700">{exercise.contextText}</p>
            </div>
          </div>
        </DetectiveCard>
      )}

      {/* Question Header */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {exercise.title}
        </h3>
      </div>

      {/* Statements */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <AnimatePresence>
          {statements.map((statement, index) => {
            const isAnswered = statement.userAnswer !== null;
            const result = getStatementResult(statement.id);
            const showResult = showResults && result;

            return (
              <motion.div
                key={statement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DetectiveCard
                  variant={
                    showResult
                      ? (result.isCorrect ? 'success' : 'danger')
                      : 'default'
                  }
                  padding="md"
                  className="transition-all duration-300"
                >
                  <div className="space-y-4">
                    {/* Statement */}
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <p className="flex-1 text-lg text-gray-800 pt-1">
                        {statement.statement}
                      </p>
                    </div>

                    {/* Answer Buttons */}
                    <div className="flex gap-4 ml-11">
                      <button
                        onClick={() => handleAnswer(statement.id, true)}
                        disabled={showResults}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                          statement.userAnswer === true
                            ? 'bg-green-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700'
                        } ${showResults ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'} flex items-center justify-center gap-2`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        Verdadero
                      </button>
                      <button
                        onClick={() => handleAnswer(statement.id, false)}
                        disabled={showResults}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                          statement.userAnswer === false
                            ? 'bg-red-500 text-white shadow-lg scale-105'
                            : 'bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700'
                        } ${showResults ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'} flex items-center justify-center gap-2`}
                      >
                        <XCircle className="w-5 h-5" />
                        Falso
                      </button>
                    </div>

                    {/* SECURE: Explanation shown ONLY after server response */}
                    {showResult && result.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="ml-11 mt-4 p-4 bg-white bg-opacity-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-2xl flex-shrink-0">
                            {result.isCorrect ? '✅' : '❌'}
                          </div>
                          <div>
                            <p className="text-gray-700 mb-2">{result.explanation}</p>
                            <p className="text-sm text-gray-600">
                              Respuesta correcta: <strong>{result.correctAnswer ? 'Verdadero' : 'Falso'}</strong>
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </DetectiveCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success') {
              onComplete?.();
            }
          }}
          onRetry={() => {
            setShowFeedback(false);
            handleReset();
          }}
        />
      )}
    </ExerciseContainer>
  );
};

export default VerdaderoFalsoExercise;
