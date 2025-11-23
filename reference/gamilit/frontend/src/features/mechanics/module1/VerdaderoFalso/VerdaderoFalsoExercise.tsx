import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { VerdaderoFalsoData, VerdaderoFalsoStatement } from './verdaderoFalsoTypes';
import { calculateScore, saveProgress } from '@shared/components/mechanics/mechanicsTypes';
import { CheckCircle, XCircle } from 'lucide-react';
import { FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface VerdaderoFalsoExerciseProps {
  exercise: VerdaderoFalsoData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
  }>;
}

export const VerdaderoFalsoExercise: React.FC<VerdaderoFalsoExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef
}) => {
  const { user } = useAuth(); // Get authenticated user
  const [statements, setStatements] = useState<VerdaderoFalsoStatement[]>(
    exercise.statements.map(stmt => ({ ...stmt, userAnswer: null }))
  );
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = statements.filter(s => s.userAnswer !== null).length;

  // FE-059: Removed local validation - correctAnswer field no longer available
  // Validation is now done server-side via backend API
  // const correctCount = ... REMOVED

  // FE-055: Notify parent with progress AND user answers
  useEffect(() => {
    // Auto-save progress
    saveProgress(exercise.id, { statements, hintsUsed });

    // Notify parent component of progress WITH user answers
    if (onProgressUpdate) {
      // Prepare user answers in backend format (statement-id: boolean)
      const userAnswers: Record<string, boolean> = {};
      statements.forEach(stmt => {
        if (stmt.userAnswer !== null) {
          // BE-FE-064: Ensure ID is string
          userAnswers[String(stmt.id)] = stmt.userAnswer;
        }
      });

      // Send both progress metadata AND user answers
      onProgressUpdate({
        progress: {
          currentStep: answeredCount,
          totalSteps: statements.length,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { statements: userAnswers }  // BE-FE-064: Wrap in 'statements' key to match DTO
      });

      console.log('📊 [VerdaderoFalso] Progress update sent:', {
        answered: answeredCount,
        totalQuestions: statements.length
      });
    }
  }, [statements, hintsUsed, onProgressUpdate, answeredCount, startTime, exercise.id]);

  const handleAnswer = (statementId: string, answer: boolean) => {
    if (showResults) return; // No cambiar respuestas después de verificar

    setStatements(prev =>
      prev.map(stmt =>
        stmt.id === statementId ? { ...stmt, userAnswer: answer } : stmt
      )
    );
  };

  const handleCheck = async () => {
    console.log('🔍 [VerdaderoFalso] handleCheck called - FILE VERSION: 2025-11-19-v2');
    console.log('🔍 [VerdaderoFalso] Statements data types:', {
      firstStatementId: statements[0]?.id,
      idType: typeof statements[0]?.id,
      sampleStatement: statements[0]
    });

    const allAnswered = statements.every(s => s.userAnswer !== null);

    if (!allAnswered) {
      setFeedback({
        type: 'error',
        title: 'Ejercicio Incompleto',
        message: `Has respondido ${answeredCount} de ${statements.length} preguntas. Responde todas antes de verificar.`,
      });
      setShowFeedback(true);
      return;
    }

    // Check if user is authenticated
    if (!user?.id) {
      setFeedback({
        type: 'error',
        title: 'Error de Autenticación',
        message: 'Debes estar autenticado para enviar el ejercicio.',
      });
      setShowFeedback(true);
      return;
    }

    setIsSubmitting(true);
    setShowResults(true);

    try {
      // Prepare answers in backend DTO format: { statements: { "1": true, "2": false } }
      const statementsAnswers: Record<string, boolean> = {};
      statements.forEach(s => {
        if (s.userAnswer !== null) {
          // BE-FE-064: Ensure ID is string (DB stores as number, need to convert)
          statementsAnswers[String(s.id)] = s.userAnswer;
        }
      });

      // FE-044 FIX: Wrap in 'statements' key to match backend DTO
      const answersObj = { statements: statementsAnswers };

      console.log('📝 [VerdaderoFalso] Submitting answers:', {
        answersCount: Object.keys(statementsAnswers).length,
        sampleIds: Object.keys(statementsAnswers).slice(0, 3),
        payload: answersObj
      });

      // Submit to backend API
      const response = await submitExercise(exercise.id, user.id, answersObj);

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has obtenido ${response.correctAnswersCount} de ${response.totalQuestions} respuestas correctas.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [VerdaderoFalso] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [VerdaderoFalso] Submission error:', error);
      setFeedback({
        type: 'error',
        title: 'Error al Enviar',
        message: 'Hubo un problema al enviar tu respuesta. Por favor, intenta nuevamente.',
      });
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStatements(exercise.statements.map(stmt => ({ ...stmt, userAnswer: null })));
    setShowResults(false);
    setFeedback(null);
    setShowFeedback(false);
  };

  // Populate actionsRef for parent component
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck
      };
    }
  }, [actionsRef, handleReset, handleCheck]);

  return (
    <>

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
          ❓ {exercise.title}
        </h3>
      </div>

      {/* Statements */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <AnimatePresence>
          {statements.map((statement, index) => {
            const isAnswered = statement.userAnswer !== null;

            // FE-059: Removed local validation - correctAnswer field no longer available
            // Visual feedback disabled until backend integration
            const isCorrect = false; // Will be determined by backend
            const showResult = false; // Disabled for now

            return (
              <motion.div
                key={statement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DetectiveCard
                  variant={showResult ? (isCorrect ? 'success' : 'danger') : 'default'}
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

                    {/* Explanation (shown after verification) */}
                    {showResult && statement.explanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="ml-11 mt-4 p-4 bg-white bg-opacity-50 rounded-lg border-l-4 border-blue-500"
                      >
                        <div className="flex items-start gap-2">
                          <div className="text-2xl flex-shrink-0">
                            {isCorrect ? '✅' : '❌'}
                          </div>
                          <p className="text-gray-700">{statement.explanation}</p>
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

    </>
  );
};

export default VerdaderoFalsoExercise;
