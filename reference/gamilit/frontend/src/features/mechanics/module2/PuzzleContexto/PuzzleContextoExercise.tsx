import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Puzzle, Check, GripVertical, RotateCcw } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import type { PuzzleContextoExerciseProps, Fragment, PuzzleContextoState } from './puzzleContextoTypes';
import { calculateScore, saveProgress, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { mockPuzzleData } from './puzzleContextoMockData';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const PuzzleContextoExercise: React.FC<PuzzleContextoExerciseProps> = ({
  exercise = mockPuzzleData,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  actionsRef,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Shuffle fragments initially
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const [fragments, setFragments] = useState<Fragment[]>(
    initialData?.currentOrder
      ? initialData.currentOrder.map(id => exercise.fragments.find(f => f.id === id)!).filter(Boolean)
      : shuffleArray(exercise.fragments)
  );
  const [showResults, setShowResults] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(initialData?.hintsUsed || 0);
  const [startTime] = useState(new Date());
  const [timeSpent, setTimeSpent] = useState(initialData?.timeSpent || 0);
  const [score, setScore] = useState(initialData?.score || 0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveProgress(exercise.id, {
        currentOrder: fragments.map(f => f.id),
        isComplete: showResults,
        score,
        timeSpent,
        hintsUsed,
      });
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [fragments, showResults, score, timeSpent, hintsUsed, exercise.id]);

  // Progress update callback
  useEffect(() => {
    if (onProgressUpdate) {
      // FE-059: Removed local validation - correctOrder field no longer available
      // Validation is now done server-side via backend API

      // BE-FE-062: Prepare user answers in backend DTO format
      // Backend expects: { questions: {"q1": "option_a", "q2": "option_b"} }
      // Convert fragment positions to string format
      const userAnswers: Record<string, string> = {};
      fragments.forEach((frag, index) => {
        userAnswers[frag.id] = String(index);
      });

      // FE-044 FIX: Use stage-based progress instead of fragment count
      // Stage 1: Ordering fragments (50%)
      // Stage 2: Verified/Completed (100%)
      const currentStage = showResults ? 2 : 1;
      const totalStages = 2;

      onProgressUpdate({
        progress: {
          currentStep: currentStage, // FE-044 FIX: 1=Ordering, 2=Verified
          totalSteps: totalStages,   // FE-044 FIX: 2 stages total
          score: showResults ? score : 0,
          hintsUsed,
          timeSpent,
        },
        answers: { questions: userAnswers },  // BE-FE-062: Wrap in questions object
      });
    }
  }, [fragments, showResults, score, hintsUsed, timeSpent, onProgressUpdate]);

  const handleCheck = async () => {
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

    try {
      // BE-FE-062: Prepare answers in backend DTO format
      // Backend expects: { questions: {"frag1": "0", "frag2": "1", ...} }
      const userAnswers: Record<string, string> = {};
      fragments.forEach((frag, index) => {
        userAnswers[frag.id] = String(index);
      });

      // Submit to backend API
      const response = await submitExercise(exercise.id, user.id, { questions: userAnswers });

      setShowResults(true);
      setScore(response.score);

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has ordenado ${response.correctAnswersCount} de ${response.totalQuestions} fragmentos correctamente.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [PuzzleContexto] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [PuzzleContexto] Submission error:', error);
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
    setFragments(shuffleArray(exercise.fragments));
    setShowResults(false);
    setScore(0);
    setFeedback(null);
    setShowFeedback(false);
  };

  // Expose actions to parent
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        getState: () => ({
          currentOrder: fragments.map(f => f.id),
          isComplete: showResults,
          score,
          timeSpent,
          hintsUsed,
        }),
        reset: handleReset,
        validate: async () => handleCheck(),
      };
    }
  }, [fragments, showResults, score, timeSpent, hintsUsed, actionsRef]);

  const getFragmentStyle = (fragment: Fragment, index: number) => {
    // FE-059: Removed visual validation - correctOrder field no longer available
    // Visual feedback disabled until backend integration
    return 'border-detective-orange/30 bg-white hover:border-detective-orange hover:shadow-lg';
  };

  const getFragmentIcon = (fragment: Fragment, index: number) => {
    // FE-059: Removed visual validation - correctOrder field no longer available
    // Icon feedback disabled until backend integration
    return null;
  };

  // Build the current inference from fragments
  const currentInference = fragments.map(f => f.text).join(' ');

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
              <Puzzle className="w-8 h-8 text-white" />
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

          {/* Instructions */}
          {exercise.instructions && (
            <div className="bg-blue-50 border-l-4 border-detective-blue p-4 rounded-detective">
              <p className="text-detective-sm text-detective-text leading-relaxed">
                <strong>Instrucciones:</strong> {exercise.instructions}
              </p>
            </div>
          )}

          {/* Fragments to Order */}
          <div>
            <h3 className="text-detective-lg font-semibold text-detective-blue mb-3">
              Fragmentos Desordenados
            </h3>
            <p className="text-detective-sm text-detective-text-secondary mb-4">
              Arrastra los fragmentos para ordenarlos correctamente
            </p>

            <Reorder.Group
              axis="y"
              values={fragments}
              onReorder={setFragments}
              className="space-y-3"
            >
              {fragments.map((fragment, index) => (
                <Reorder.Item key={fragment.id} value={fragment}>
                  <motion.div
                    whileHover={!showResults ? { scale: 1.02 } : {}}
                    whileTap={!showResults ? { scale: 0.98 } : {}}
                    className={`flex items-center gap-3 p-4 border-2 rounded-detective transition-all ${getFragmentStyle(
                      fragment,
                      index
                    )} ${!showResults ? 'cursor-move' : 'cursor-default'}`}
                  >
                    {!showResults && <GripVertical className="w-5 h-5 text-gray-400" />}
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-detective-orange/20 text-detective-orange font-bold flex items-center justify-center text-detective-sm">
                      {fragment.label}
                    </span>
                    <div className="flex-1">
                      <p className="text-detective-base text-detective-text">{fragment.text}</p>
                    </div>
                    {getFragmentIcon(fragment, index)}
                  </motion.div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {/* Current Inference Preview */}
          <div>
            <h3 className="text-detective-lg font-semibold text-detective-blue mb-3">
              Inferencia Actual
            </h3>
            <div className="bg-purple-50 border-2 border-purple-200 p-6 rounded-detective">
              <p className="text-detective-base text-detective-text leading-relaxed italic">
                "{currentInference}"
              </p>
            </div>
          </div>

          {/* Correct Inference (after validation) */}
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-detective-lg font-semibold text-green-600 mb-3">
                Inferencia Correcta
              </h3>
              <div className="bg-green-50 border-2 border-green-200 p-6 rounded-detective">
                <p className="text-detective-base text-detective-text leading-relaxed font-medium">
                  "{exercise.completeInference}"
                </p>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-6 border-t border-gray-200">
            {onExit && (
              <DetectiveButton variant="secondary" size="md" onClick={onExit}>
                Salir
              </DetectiveButton>
            )}
            {!showResults ? (
              <>
                <DetectiveButton
                  variant="secondary"
                  size="md"
                  icon={<RotateCcw className="w-5 h-5" />}
                  onClick={handleReset}
                >
                  Mezclar de Nuevo
                </DetectiveButton>
                <DetectiveButton
                  variant="gold"
                  size="md"
                  icon={<Check className="w-5 h-5" />}
                  onClick={handleCheck}
                >
                  Verificar Orden
                </DetectiveButton>
              </>
            ) : (
              <DetectiveButton variant="blue" size="md" onClick={handleReset}>
                Intentar de Nuevo
              </DetectiveButton>
            )}
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

export default PuzzleContextoExercise;
