import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { CompletarEspaciosData, BlankSpace } from './completarEspaciosTypes';
import { calculateScore, saveProgress } from '@shared/components/mechanics/mechanicsTypes';
import { Check, X, Sparkles } from 'lucide-react';
import { FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface CompletarEspaciosExerciseProps {
  exercise: CompletarEspaciosData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
  }>;
}

export const CompletarEspaciosExercise: React.FC<CompletarEspaciosExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef
}) => {
  const { user } = useAuth();
  const [blanks, setBlanks] = useState<BlankSpace[]>(
    exercise.blanks.map(blank => ({ ...blank, userAnswer: '' }))
  );
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = blanks.filter(b => b.userAnswer && b.userAnswer.trim() !== '').length;

  // FE-059: Removed local validation - correctAnswer field no longer available
  // Validation is now done server-side via backend API
  // const correctCount = ... REMOVED

  // FE-055: Notify parent with progress AND user answers
  useEffect(() => {
    // Auto-save progress
    saveProgress(exercise.id, { blanks, hintsUsed, usedWords });

    // Notify parent component of progress WITH user answers
    if (onProgressUpdate) {
      // Prepare user answers: blank-id: user's answer
      const userAnswers: Record<string, string> = {};
      blanks.forEach(blank => {
        if (blank.userAnswer && blank.userAnswer.trim() !== '') {
          userAnswers[blank.id] = blank.userAnswer;
        }
      });

      // Send both progress metadata AND user answers
      onProgressUpdate({
        progress: {
          currentStep: answeredCount,
          totalSteps: blanks.length,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { blanks: userAnswers }
      });

      console.log('📊 [CompletarEspacios] Progress update sent:', {
        answered: answeredCount,
        totalBlanks: blanks.length
      });
    }
  }, [blanks, hintsUsed, usedWords, onProgressUpdate, answeredCount, startTime, exercise.id]);

  const handleWordSelect = (word: string) => {
    if (showResults) return;
    setSelectedWord(word === selectedWord ? null : word);
  };

  const handleBlankClick = (blankId: string) => {
    if (showResults || !selectedWord) return;

    setBlanks(prev =>
      prev.map(blank => {
        if (blank.id === blankId) {
          // If blank already has an answer, return that word to available pool
          if (blank.userAnswer && blank.userAnswer.trim() !== '') {
            setUsedWords(prevUsed => prevUsed.filter(w => w !== blank.userAnswer));
          }
          // Set the new answer
          setUsedWords(prevUsed => [...prevUsed, selectedWord]);
          setSelectedWord(null);
          return { ...blank, userAnswer: selectedWord };
        }
        return blank;
      })
    );
  };

  const handleClearBlank = (blankId: string) => {
    if (showResults) return;

    setBlanks(prev =>
      prev.map(blank => {
        if (blank.id === blankId && blank.userAnswer) {
          setUsedWords(prevUsed => prevUsed.filter(w => w !== blank.userAnswer));
          return { ...blank, userAnswer: '' };
        }
        return blank;
      })
    );
  };

  const handleCheck = async () => {
    const allAnswered = blanks.every(b => b.userAnswer && b.userAnswer.trim() !== '');

    if (!allAnswered) {
      setFeedback({
        type: 'error',
        title: 'Ejercicio Incompleto',
        message: `Has completado ${answeredCount} de ${blanks.length} espacios. Completa todos antes de verificar.`,
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
      // Prepare answers in backend DTO format: { blanks: { b1: "word1", b2: "word2" } }
      const answersObj: Record<string, string> = {};
      blanks.forEach(b => {
        if (b.userAnswer && b.userAnswer.trim() !== '') {
          answersObj[b.id] = b.userAnswer;
        }
      });

      // ✅ FIX BUG-005: Validate that at least one blank is filled
      if (Object.keys(answersObj).length === 0) {
        setIsSubmitting(false);
        setShowResults(false);
        setFeedback({
          type: 'error',
          title: '¡Espera!',
          message: 'Debes completar al menos un espacio en blanco antes de enviar.',
          score: 0
        });
        setShowFeedback(true);
        return;
      }

      console.log('📝 [CompletarEspacios] Submitting with answers:', {
        blankCount: Object.keys(answersObj).length,
        totalBlanks: blanks.length
      });

      // Submit to backend API
      const response = await submitExercise(exercise.id, user.id, { blanks: answersObj });

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has obtenido ${response.correctAnswersCount} de ${response.totalQuestions} respuestas correctas.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [CompletarEspacios] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [CompletarEspacios] Submission error:', error);
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
    setBlanks(exercise.blanks.map(blank => ({ ...blank, userAnswer: '' })));
    setUsedWords([]);
    setSelectedWord(null);
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

  // Split text into segments with blanks
  const renderTextWithBlanks = () => {
    const segments: JSX.Element[] = [];
    const parts = exercise.text.split('___');

    parts.forEach((part, index) => {
      segments.push(
        <span key={`text-${index}`} className="text-gray-800">
          {part}
        </span>
      );

      if (index < parts.length - 1) {
        const blank = blanks[index];

        // Safety check: skip if blank is undefined
        if (!blank) {
          console.warn(`[CompletarEspacios] Blank at index ${index} is undefined. Blanks length: ${blanks.length}, Parts length: ${parts.length}`);
          return;
        }

        const isAnswered = blank.userAnswer && blank.userAnswer.trim() !== '';

        // FE-059: Removed local validation - correctAnswer field no longer available
        // Visual feedback (green/red) disabled until backend integration
        const isCorrect = false; // Will be determined by backend
        const showResult = false; // Disabled for now

        segments.push(
          <motion.span
            key={`blank-${blank.id}`}
            className={`inline-flex items-center gap-2 mx-1 px-3 py-1 rounded-lg border-2 transition-all cursor-pointer ${
              showResult
                ? isCorrect
                  ? 'bg-green-100 border-green-500 text-green-800'
                  : 'bg-red-100 border-red-500 text-red-800'
                : isAnswered
                ? 'bg-blue-100 border-blue-500 text-blue-800'
                : 'bg-gray-100 border-dashed border-gray-400 text-gray-500'
            } ${!showResults && 'hover:border-blue-400'}`}
            onClick={() => !isAnswered && handleBlankClick(blank.id)}
            whileHover={!showResults ? { scale: 1.05 } : {}}
            whileTap={!showResults ? { scale: 0.95 } : {}}
          >
            {isAnswered ? (
              <>
                <span className="font-semibold">{blank.userAnswer}</span>
                {!showResults && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearBlank(blank.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {showResult && (
                  isCorrect ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <X className="w-4 h-4 text-red-600" />
                  )
                )}
              </>
            ) : (
              <span className="text-sm italic">___________</span>
            )}
          </motion.span>
        );
      }
    });

    return segments;
  };

  const availableWords = exercise.wordBank.filter(word => !usedWords.includes(word));

  return (
    <>

      {/* Scenario Text */}
      {exercise.scenarioText && (
        <DetectiveCard variant="info" padding="md" className="mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">📖</div>
            <div>
              <h3 className="font-bold text-lg mb-2">Contexto Histórico</h3>
              <p className="text-gray-700">{exercise.scenarioText}</p>
            </div>
          </div>
        </DetectiveCard>
      )}

      {/* Instructions */}
      <div className="mb-6 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          ✏️ {exercise.title}
        </h3>
        <p className="text-gray-600">
          Selecciona una palabra del banco y haz clic en el espacio que deseas completar
        </p>
      </div>

      {/* Text with Blanks */}
      <DetectiveCard variant="default" padding="lg" className="mb-6">
        <div className="text-lg leading-relaxed">
          {renderTextWithBlanks()}
        </div>
      </DetectiveCard>

      {/* Word Bank */}
      <DetectiveCard variant="default" padding="lg" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-bold text-gray-800">Banco de Palabras</h3>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {availableWords.map((word) => (
              <motion.button
                key={word}
                onClick={() => handleWordSelect(word)}
                disabled={showResults}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  selectedWord === word
                    ? 'bg-blue-500 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md'
                } ${showResults ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={!showResults ? { scale: 1.05 } : {}}
                whileTap={!showResults ? { scale: 0.95 } : {}}
              >
                {word}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        {availableWords.length === 0 && !showResults && (
          <div className="text-center text-gray-500 mt-4">
            <p className="text-sm italic">Todas las palabras han sido utilizadas</p>
          </div>
        )}
      </DetectiveCard>

      {/* FE-059: Results section removed - correct answers no longer available in frontend */}
      {/* Validation and feedback now provided by backend API */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <DetectiveCard variant="info" padding="lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📝 Tus Respuestas</h3>
            <div className="space-y-3">
              {blanks.map((blank, index) => (
                <div
                  key={blank.id}
                  className="p-3 rounded-lg border-l-4 bg-blue-50 border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 text-2xl">📝</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Espacio {index + 1}</p>
                      <p className="text-gray-600">
                        Tu respuesta: <span className="font-semibold">{blank.userAnswer || '(sin respuesta)'}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        La validación se procesará en el servidor
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </DetectiveCard>
        </motion.div>
      )}

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

export default CompletarEspaciosExercise;
