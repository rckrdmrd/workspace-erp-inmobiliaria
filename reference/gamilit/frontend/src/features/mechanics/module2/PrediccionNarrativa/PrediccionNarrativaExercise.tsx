import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, XCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { calculateScore, saveProgress, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import type {
  PrediccionNarrativaExerciseProps,
  Scenario,
  ScenarioAnswer,
  PredictionOption,
} from './prediccionNarrativaTypes';
import { mockExerciseData } from './prediccionNarrativaMockData';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const PrediccionNarrativaExercise: React.FC<PrediccionNarrativaExerciseProps> = ({
  exercise = mockExerciseData,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  actionsRef,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize answers for all scenarios
  const [answers, setAnswers] = useState<ScenarioAnswer[]>(
    initialData?.answers || exercise.scenarios.map(s => ({
      scenarioId: s.id,
      selectedPredictionId: null,
      isCorrect: null,
    }))
  );
  const [showResults, setShowResults] = useState(initialData?.showResults || false);
  const [hintsUsed, setHintsUsed] = useState(initialData?.hintsUsed || 0);
  const [startTime] = useState(new Date());
  const [timeSpent, setTimeSpent] = useState(initialData?.timeSpent || 0);
  const [score, setScore] = useState(initialData?.score || 0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const currentScenario = exercise.scenarios[currentScenarioIndex];
  const currentAnswer = answers.find(a => a.scenarioId === currentScenario.id);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save progress
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveProgress(exercise.id, {
        answers,
        score,
        timeSpent,
        hintsUsed,
        showResults,
      });
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [answers, score, timeSpent, hintsUsed, showResults, exercise.id]);

  // FE-055 & FE-059: Progress update callback with user answers
  useEffect(() => {
    if (onProgressUpdate) {
      const answeredCount = answers.filter(a => a.selectedPredictionId !== null).length;

      // FE-059: Removed local correctCount calculation - uses sanitized isCorrect field

      // Prepare user answers in backend format
      // Backend expects: { scenarios: { s1: "pred_a" } }
      const userAnswers: Record<string, string> = {};
      answers.forEach(answer => {
        if (answer.selectedPredictionId) {
          userAnswers[answer.scenarioId] = answer.selectedPredictionId;
        }
      });

      onProgressUpdate({
        progress: {
          currentStep: answeredCount,
          totalSteps: exercise.scenarios.length,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed,
          timeSpent,
        },
        answers: { scenarios: userAnswers },
      });

      console.log('📊 [PrediccionNarrativa] Progress update sent:', {
        answered: answeredCount,
        totalScenarios: exercise.scenarios.length
      });
    }
  }, [answers, hintsUsed, timeSpent, onProgressUpdate, exercise.scenarios.length]);

  const handleSelectPrediction = (predictionId: string) => {
    if (showResults) return;

    setAnswers(prev =>
      prev.map(answer =>
        answer.scenarioId === currentScenario.id
          ? { ...answer, selectedPredictionId: predictionId, isCorrect: null }
          : answer
      )
    );
  };

  const handleCheck = async () => {
    // Check if all scenarios are answered
    const allAnswered = answers.every(a => a.selectedPredictionId !== null);

    if (!allAnswered) {
      const answeredCount = answers.filter(a => a.selectedPredictionId !== null).length;
      setFeedback({
        type: 'error',
        title: 'Ejercicio Incompleto',
        message: `Has respondido ${answeredCount} de ${exercise.scenarios.length} escenarios. Responde todos antes de verificar.`,
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
      // Prepare answers in backend DTO format: { scenarios: { s1: "pred_a" } }
      const userAnswers: Record<string, string> = {};
      answers.forEach(answer => {
        if (answer.selectedPredictionId) {
          userAnswers[answer.scenarioId] = answer.selectedPredictionId;
        }
      });

      // Submit to backend API
      const response = await submitExercise(exercise.id, user.id, { scenarios: userAnswers });

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has predicho ${response.correctAnswersCount} de ${response.totalQuestions} escenarios correctamente.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [PrediccionNarrativa] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [PrediccionNarrativa] Submission error:', error);
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
    setAnswers(
      exercise.scenarios.map(s => ({
        scenarioId: s.id,
        selectedPredictionId: null,
        isCorrect: null,
      }))
    );
    setShowResults(false);
    setScore(0);
    setFeedback(null);
    setShowFeedback(false);
    setCurrentScenarioIndex(0);
    setShowHint(false);
  };

  const handleNext = () => {
    if (currentScenarioIndex < exercise.scenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentScenarioIndex > 0) {
      setCurrentScenarioIndex(prev => prev - 1);
      setShowHint(false);
    }
  };

  const toggleHint = () => {
    setShowHint(prev => !prev);
    if (!showHint) {
      setHintsUsed(prev => prev + 1);
    }
  };

  // Expose actions to parent
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        getState: () => ({ answers, score, timeSpent, hintsUsed, showResults }),
        reset: handleReset,
        validate: async () => handleCheck(),
      };
    }
  }, [answers, score, timeSpent, hintsUsed, showResults, actionsRef]);

  // FE-059: Removed validation styling - isCorrect field no longer available
  const getOptionStyle = (prediction: PredictionOption) => {
    const isSelected = currentAnswer?.selectedPredictionId === prediction.id;

    // No correctness feedback until backend integration
    return isSelected
      ? 'border-detective-orange bg-detective-orange/10'
      : 'border-gray-300 hover:border-detective-orange hover:bg-detective-orange/5';
  };

  // FE-059: Removed validation icons - isCorrect field no longer available
  const getOptionIcon = (prediction: PredictionOption) => {
    // No correctness feedback until backend integration
    return null;
  };

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header - Detective Theme with Gradient */}
          <div
            className="rounded-detective p-6 shadow-detective-lg"
            style={{
              background: 'linear-gradient(to right, #1e3a8a, #f97316)',
              color: 'white'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8 text-white" />
              <h1 className="text-detective-3xl font-bold text-white">{exercise.title}</h1>
            </div>
            {exercise.subtitle && (
              <p className="text-detective-base text-white mb-4" style={{ opacity: 0.9 }}>
                {exercise.subtitle}
              </p>
            )}
            {exercise.description && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-detective-sm font-medium text-gray-900">Objetivo:</p>
                <p className="text-detective-base text-gray-900">{exercise.description}</p>
              </div>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-detective-sm text-detective-text-secondary">
            <span>
              Escenario {currentScenarioIndex + 1} de {exercise.scenarios.length}
            </span>
            <span>
              {answers.filter(a => a.selectedPredictionId !== null).length} de {exercise.scenarios.length} respondidos
            </span>
          </div>

          {/* Scenario Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScenario.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Context */}
              <div className="bg-blue-50 border-l-4 border-detective-blue p-4 rounded-detective">
                <h3 className="text-detective-base font-semibold text-detective-blue mb-2">
                  Contexto Histórico
                </h3>
                <p className="text-detective-sm text-detective-text">{currentScenario.context}</p>
              </div>

              {/* Beginning of narrative */}
              <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-detective">
                <h3 className="text-detective-lg font-semibold text-detective-blue mb-3">
                  Inicio de la Historia
                </h3>
                <p className="text-detective-base text-detective-text leading-relaxed italic">
                  "{currentScenario.beginning}"
                </p>
              </div>

              {/* Question */}
              <div className="text-center py-4">
                <h3 className="text-detective-xl font-bold text-detective-orange">
                  {currentScenario.question}
                </h3>
              </div>

              {/* Prediction Options */}
              <div className="space-y-4">
                {currentScenario.predictions.map((prediction, index) => (
                  <motion.button
                    key={prediction.id}
                    onClick={() => handleSelectPrediction(prediction.id)}
                    disabled={showResults}
                    whileHover={!showResults ? { scale: 1.02 } : {}}
                    whileTap={!showResults ? { scale: 0.98 } : {}}
                    className={`w-full text-left p-4 border-2 rounded-detective transition-all ${getOptionStyle(
                      prediction
                    )} ${!showResults ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-detective-orange/20 text-detective-orange font-bold flex items-center justify-center text-detective-sm">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <div className="flex-1">
                        <p className="text-detective-base text-detective-text">{prediction.text}</p>
                        {showResults && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 pt-3 border-t border-gray-300"
                          >
                            <p className="text-detective-sm text-detective-text-secondary">
                              {prediction.explanation}
                            </p>
                          </motion.div>
                        )}
                      </div>
                      {getOptionIcon(prediction)}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Contextual Hint */}
              {currentScenario.contextualHint && (
                <div className="mt-6">
                  <DetectiveButton
                    variant="secondary"
                    size="sm"
                    icon={<Lightbulb className="w-4 h-4" />}
                    onClick={toggleHint}
                  >
                    {showHint ? 'Ocultar Pista' : 'Ver Pista Contextual'}
                  </DetectiveButton>

                  <AnimatePresence>
                    {showHint && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-detective"
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <p className="text-detective-sm text-yellow-800">
                            {currentScenario.contextualHint}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-200">
            <div className="flex gap-2">
              <DetectiveButton
                variant="secondary"
                size="md"
                onClick={handlePrevious}
                disabled={currentScenarioIndex === 0}
              >
                ← Anterior
              </DetectiveButton>
              {currentScenarioIndex < exercise.scenarios.length - 1 && (
                <DetectiveButton
                  variant="secondary"
                  size="md"
                  onClick={handleNext}
                >
                  Siguiente →
                </DetectiveButton>
              )}
            </div>

            <div className="flex gap-2">
              {onExit && (
                <DetectiveButton variant="secondary" size="md" onClick={onExit}>
                  Salir
                </DetectiveButton>
              )}
              {!showResults ? (
                <DetectiveButton
                  variant="gold"
                  size="md"
                  onClick={handleCheck}
                  disabled={answers.some(a => a.selectedPredictionId === null)}
                >
                  Verificar Respuestas
                </DetectiveButton>
              ) : (
                <DetectiveButton variant="blue" size="md" onClick={handleReset}>
                  Intentar de Nuevo
                </DetectiveButton>
              )}
            </div>
          </div>
        </motion.div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success' && onComplete) {
              onComplete(score, timeSpent);
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

export default PrediccionNarrativaExercise;
