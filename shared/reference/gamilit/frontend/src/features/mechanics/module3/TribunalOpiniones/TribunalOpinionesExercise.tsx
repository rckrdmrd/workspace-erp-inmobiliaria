import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import { DetectiveCard } from '@/shared/components/base/DetectiveCard';
import { FeedbackModal } from '@/shared/components/mechanics/FeedbackModal';
import { FeedbackData } from '@/shared/components/mechanics/mechanicsTypes';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type {
  TribunalOpinionesExerciseProps,
  StatementEvaluation,
  StatementClassification,
  StatementVerdict,
  TribunalOpinionesAnswers
} from './tribunalOpinionesTypes';
import { CLASSIFICATION_OPTIONS, VERDICT_OPTIONS } from './tribunalOpinionesTypes';

export const TribunalOpinionesExercise: React.FC<TribunalOpinionesExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef
}) => {
  const { user } = useAuth();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<Map<string, StatementEvaluation>>(new Map());
  const [currentClassification, setCurrentClassification] = useState<StatementClassification | null>(null);
  const [currentVerdict, setCurrentVerdict] = useState<StatementVerdict | null>(null);
  const [currentJustification, setCurrentJustification] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(new Date());
  const [hintsUsed] = useState(0);

  const statements = exercise.content?.statements || [];
  const currentStatement = statements[currentIndex];
  const totalStatements = statements.length;

  // Load existing evaluation when navigating
  useEffect(() => {
    if (currentStatement) {
      const existing = evaluations.get(currentStatement.id);
      if (existing) {
        setCurrentClassification(existing.classification);
        setCurrentVerdict(existing.verdict);
        setCurrentJustification(existing.justification || '');
      } else {
        setCurrentClassification(null);
        setCurrentVerdict(null);
        setCurrentJustification('');
      }
    }
  }, [currentIndex, currentStatement, evaluations]);

  // Progress updates
  useEffect(() => {
    if (onProgressUpdate) {
      const evaluatedCount = evaluations.size;
      const answers: TribunalOpinionesAnswers = {
        evaluations: Array.from(evaluations.values())
      };

      onProgressUpdate({
        progress: {
          currentStep: evaluatedCount,
          totalSteps: totalStatements,
          score: 0,
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
        },
        answers
      });
    }
  }, [evaluations, totalStatements, hintsUsed, onProgressUpdate, startTime]);

  // Save current evaluation
  const saveCurrentEvaluation = useCallback(() => {
    if (currentStatement && currentClassification && currentVerdict) {
      const evaluation: StatementEvaluation = {
        statementId: currentStatement.id,
        classification: currentClassification,
        verdict: currentVerdict,
        justification: currentJustification.trim() || undefined
      };
      setEvaluations(prev => new Map(prev).set(currentStatement.id, evaluation));
      return true;
    }
    return false;
  }, [currentStatement, currentClassification, currentVerdict, currentJustification]);

  // Navigation
  const handleNext = useCallback(() => {
    saveCurrentEvaluation();
    if (currentIndex < totalStatements - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, totalStatements, saveCurrentEvaluation]);

  const handlePrevious = useCallback(() => {
    saveCurrentEvaluation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex, saveCurrentEvaluation]);

  // Submit handler
  const handleCheck = useCallback(async () => {
    // Save current evaluation first
    saveCurrentEvaluation();

    // Validate all statements are evaluated
    const currentEvaluations = new Map(evaluations);
    if (currentStatement && currentClassification && currentVerdict) {
      currentEvaluations.set(currentStatement.id, {
        statementId: currentStatement.id,
        classification: currentClassification,
        verdict: currentVerdict,
        justification: currentJustification.trim() || undefined
      });
    }

    if (currentEvaluations.size < totalStatements) {
      setFeedback({
        type: 'error',
        title: 'Ejercicio Incompleto',
        message: `Has evaluado ${currentEvaluations.size} de ${totalStatements} afirmaciones. Evalúa todas antes de enviar.`
      });
      setShowFeedback(true);
      return;
    }

    if (!user?.id) {
      setFeedback({
        type: 'error',
        title: 'Error de Autenticación',
        message: 'Debes estar autenticado para enviar el ejercicio.'
      });
      setShowFeedback(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const answers: TribunalOpinionesAnswers = {
        evaluations: Array.from(currentEvaluations.values())
      };

      const response = await submitExercise(exercise.id, user.id, answers);

      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Excelente Juicio Crítico!' : response.score >= 70 ? '¡Buen Análisis!' : 'Sigue Practicando',
        message: response.feedback?.overall || `Has clasificado correctamente ${response.correctAnswersCount} de ${response.totalQuestions} afirmaciones.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);
    } catch (error) {
      console.error('[TribunalOpiniones] Submission error:', error);
      setFeedback({
        type: 'error',
        title: 'Error al Enviar',
        message: 'Hubo un problema al enviar tu respuesta. Intenta nuevamente.'
      });
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [evaluations, currentStatement, currentClassification, currentVerdict, currentJustification, totalStatements, user, exercise.id, saveCurrentEvaluation]);

  // Reset handler
  const handleReset = useCallback(() => {
    setEvaluations(new Map());
    setCurrentIndex(0);
    setCurrentClassification(null);
    setCurrentVerdict(null);
    setCurrentJustification('');
    setFeedback(null);
    setShowFeedback(false);
  }, []);

  // Expose actions to parent
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        getState: () => ({
          evaluations: Array.from(evaluations.values()),
          currentStatementIndex: currentIndex,
          score: 0,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
          hintsUsed,
          isComplete: evaluations.size === totalStatements
        }),
        reset: handleReset,
        validate: handleCheck
      };
    }
  }, [actionsRef, evaluations, currentIndex, startTime, hintsUsed, totalStatements, handleReset, handleCheck]);

  if (!currentStatement) {
    return (
      <DetectiveCard variant="default" padding="lg">
        <div className="text-center py-8">
          <p className="text-gray-500">No hay afirmaciones para evaluar.</p>
        </div>
      </DetectiveCard>
    );
  }

  const isCurrentComplete = currentClassification && currentVerdict;
  const evaluatedCount = evaluations.size + (isCurrentComplete && !evaluations.has(currentStatement.id) ? 1 : 0);

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-8 h-8" />
              <h1 className="text-2xl font-bold">Tribunal de Opiniones</h1>
            </div>
            <p className="text-white/90">
              Clasifica cada afirmación y evalúa si está bien fundamentada
            </p>
            <div className="mt-3 flex items-center gap-4 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">
                Afirmación {currentIndex + 1} de {totalStatements}
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full">
                {evaluatedCount} evaluadas
              </span>
            </div>
          </div>

          {/* Current Statement */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStatement.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Afirmación:</h3>
              <p className="text-xl text-gray-900 leading-relaxed">
                "{currentStatement.text}"
              </p>
              {currentStatement.source && (
                <p className="mt-2 text-sm text-gray-500 italic">
                  Fuente: {currentStatement.source}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Step 1: Classification */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Paso 1: ¿Qué tipo de afirmación es?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {CLASSIFICATION_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setCurrentClassification(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    currentClassification === option.value
                      ? `${option.color} ring-2 ring-offset-2 ring-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-bold">{option.label}</span>
                  </div>
                  <p className="text-sm opacity-80">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Verdict */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Paso 2: ¿Está bien fundamentada?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {VERDICT_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => setCurrentVerdict(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    currentVerdict === option.value
                      ? `${option.color} ring-2 ring-offset-2 ring-current`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-bold">{option.label}</span>
                  </div>
                  <p className="text-sm opacity-80">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Justification (Optional) */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Paso 3: Justifica tu decisión (opcional)
            </h3>
            <textarea
              value={currentJustification}
              onChange={(e) => setCurrentJustification(e.target.value)}
              placeholder="Explica en 2-3 líneas por qué clasificaste así esta afirmación..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none"
              rows={3}
              maxLength={300}
            />
            <p className="text-sm text-gray-500 text-right">
              {currentJustification.length}/300 caracteres
            </p>
          </div>

          {/* Navigation & Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < totalStatements - 1 ? (
                <button
                  onClick={handleNext}
                  disabled={!isCurrentComplete}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleCheck}
                  disabled={isSubmitting || evaluatedCount < totalStatements}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Evaluaciones'}
                  <Send className="w-5 h-5" />
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalStatements - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 pt-4">
            {statements.map((stmt, idx) => {
              const isEvaluated = evaluations.has(stmt.id) || (idx === currentIndex && isCurrentComplete);
              return (
                <button
                  key={stmt.id}
                  onClick={() => {
                    saveCurrentEvaluation();
                    setCurrentIndex(idx);
                  }}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentIndex
                      ? 'bg-indigo-600 scale-125'
                      : isEvaluated
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                  }`}
                  title={`Afirmación ${idx + 1}${isEvaluated ? ' (evaluada)' : ''}`}
                />
              );
            })}
          </div>
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success') onComplete?.();
          }}
          onRetry={handleReset}
        />
      )}
    </>
  );
};

export default TribunalOpinionesExercise;
