/**
 * Rueda de Inferencias Exercise
 *
 * @description Main exercise component for Inference Wheel (Module 2.5)
 * Mechanic: Spin wheel → select category → write free-text inference (30 seconds)
 * @task FE-071
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Send, Book, CheckCircle2 } from 'lucide-react';
import { WheelSpinner } from './WheelSpinner';
import { CountdownTimer } from './CountdownTimer';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { submitExercise } from '@features/progress/api/progressAPI';
import type {
  RuedaInferenciasExerciseProps,
  RuedaInferenciasExercise as RuedaInferenciasExerciseType,
  InferenceCategory,
  FragmentState,
  RuedaInferenciasAnswers,
} from './ruedaInferenciasTypes';
import type { ExerciseFeedback } from '@shared/components/mechanics/mechanicsTypes';

// Mock data (will be replaced with real API call)
const mockExercise: RuedaInferenciasExerciseType = {
  id: 'ex-rueda-001',
  title: 'Rueda de Inferencias: Marie Curie',
  description: 'Analiza fragmentos del texto y escribe inferencias según la categoría seleccionada',
  difficulty_level: 'medium',
  max_score: 100,
  passing_score: 70,
  content: {
    categories: [
      {
        id: 'cat-literal',
        name: 'Literal',
        description: 'Información directa del texto',
        color: '#3B82F6',
        icon: '📖',
      },
      {
        id: 'cat-inferencial',
        name: 'Inferencial',
        description: 'Conclusiones basadas en pistas',
        color: '#10B981',
        icon: '🔍',
      },
      {
        id: 'cat-critico',
        name: 'Crítico',
        description: 'Análisis y evaluación',
        color: '#F59E0B',
        icon: '💡',
      },
      {
        id: 'cat-creativo',
        name: 'Creativo',
        description: 'Ideas originales relacionadas',
        color: '#8B5CF6',
        icon: '🎨',
      },
    ],
    fragments: [
      {
        id: 'frag-1',
        text: 'Marie Curie fue pionera en el estudio de la radiactividad, convirtiéndose en la primera mujer en ganar un Premio Nobel y la única persona en ganar en dos campos científicos diferentes.',
        difficulty: 'medium',
        hints: ['Piensa en logros', 'Considera el impacto histórico'],
      },
      {
        id: 'frag-2',
        text: 'A pesar de enfrentar discriminación por ser mujer en un campo dominado por hombres, Marie persistió en su investigación, trabajando en condiciones difíciles en un laboratorio improvisado.',
        difficulty: 'medium',
        hints: ['Considera el contexto social', 'Piensa en obstáculos'],
      },
      {
        id: 'frag-3',
        text: 'Los cuadernos de Marie Curie todavía son radiactivos y se guardan en cajas especiales de plomo. Las personas que quieren consultarlos deben firmar un descargo de responsabilidad.',
        difficulty: 'hard',
        hints: ['Piensa en consecuencias a largo plazo', 'Considera riesgos'],
      },
    ],
    settings: {
      timeLimit: 30,
      minTextLength: 20,
      maxTextLength: 200,
      wheelAnimation: true,
      showTimer: true,
      allowSkip: false,
    },
    instructions:
      '1. Gira la ruleta para seleccionar una categoría\n2. Lee el fragmento de texto\n3. Escribe una inferencia en 30 segundos\n4. Continúa con el siguiente fragmento',
  },
};

type GamePhase = 'intro' | 'spinning' | 'reading' | 'writing' | 'completed' | 'feedback';

export const RuedaInferenciasExercise: React.FC<RuedaInferenciasExerciseProps> = ({
  exerciseId,
  userId,
  onComplete,
  onProgressUpdate,
  initialData,
  actionsRef,
}) => {
  // Exercise data
  const [exercise] = useState<RuedaInferenciasExerciseType>(mockExercise);

  // Game state
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
  const [isWheelSpinning, setIsWheelSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<InferenceCategory | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Fragment states
  const [fragmentStates, setFragmentStates] = useState<FragmentState[]>(
    exercise.content.fragments.map((frag) => ({
      fragmentId: frag.id,
      categoryId: null,
      userText: '',
      timeSpent: 0,
      isComplete: false,
      startedAt: null,
    }))
  );

  // Current fragment text input
  const [currentText, setCurrentText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // Progress tracking
  const [totalTimeSpent, setTotalTimeSpent] = useState(initialData?.totalTimeSpent || 0);
  const [score, setScore] = useState(initialData?.score || 0);

  // Feedback modal
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null);

  // Submitting state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<Date | null>(null);

  // Current fragment
  const currentFragment = exercise.content.fragments[currentFragmentIndex];

  // Timer effect
  useEffect(() => {
    if (phase === 'writing' || phase === 'reading') {
      const interval = setInterval(() => {
        setTotalTimeSpent((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // Progress callback
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate({
        currentFragment: currentFragmentIndex + 1,
        totalFragments: exercise.content.fragments.length,
        score,
        hintsUsed: 0,
        timeSpent: totalTimeSpent,
      });
    }
  }, [currentFragmentIndex, score, totalTimeSpent, onProgressUpdate]);

  // Character count
  useEffect(() => {
    setCharacterCount(currentText.length);
  }, [currentText]);

  // Handle spin wheel
  const handleSpinWheel = () => {
    setIsWheelSpinning(true);
    setPhase('spinning');
  };

  // Handle wheel spin complete
  const handleWheelSpinComplete = (category: InferenceCategory) => {
    setSelectedCategory(category);
    setIsWheelSpinning(false);
    setPhase('reading');

    // Update fragment state
    setFragmentStates((prev) =>
      prev.map((state, idx) =>
        idx === currentFragmentIndex ? { ...state, categoryId: category.id } : state
      )
    );
  };

  // Handle start writing
  const handleStartWriting = () => {
    setPhase('writing');
    setIsTimerRunning(true);
    startTimeRef.current = new Date();
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Handle timer complete
  const handleTimerComplete = () => {
    setIsTimerRunning(false);
    handleSaveFragment();
  };

  // Handle save fragment
  const handleSaveFragment = useCallback(() => {
    const timeSpent = startTimeRef.current
      ? Math.floor((new Date().getTime() - startTimeRef.current.getTime()) / 1000)
      : 0;

    // Update fragment state
    setFragmentStates((prev) =>
      prev.map((state, idx) =>
        idx === currentFragmentIndex
          ? {
              ...state,
              userText: currentText,
              timeSpent,
              isComplete: true,
            }
          : state
      )
    );

    // Move to next fragment or complete
    if (currentFragmentIndex < exercise.content.fragments.length - 1) {
      setCurrentFragmentIndex((prev) => prev + 1);
      setPhase('intro');
      setSelectedCategory(null);
      setCurrentText('');
      setIsTimerRunning(false);
      startTimeRef.current = null;
    } else {
      setPhase('completed');
      handleSubmitExercise();
    }
  }, [currentFragmentIndex, currentText, exercise.content.fragments.length]);

  // Handle manual submit (before timer runs out)
  const handleManualSubmit = () => {
    if (characterCount < exercise.content.settings.minTextLength) {
      alert(
        `Tu respuesta debe tener al menos ${exercise.content.settings.minTextLength} caracteres. Actualmente tienes ${characterCount}.`
      );
      return;
    }

    setIsTimerRunning(false);
    handleSaveFragment();
  };

  // Handle submit exercise to backend
  const handleSubmitExercise = async () => {
    setIsSubmitting(true);

    try {
      // Prepare answers in backend format
      const answers: RuedaInferenciasAnswers = {
        fragments: fragmentStates.reduce((acc, state) => {
          acc[state.fragmentId] = state.userText;
          return acc;
        }, {} as Record<string, string>),
        categoryId: selectedCategory?.id,
        timeSpent: totalTimeSpent,
      };

      const response = await submitExercise(exerciseId, userId, answers);

      // Show feedback
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback.overall,
        score: response.score,
        xpEarned: response.rewards.xp,
        mlCoinsEarned: response.rewards.mlCoins,
        showConfetti: response.isPerfect,
        isCorrect: response.score >= exercise.passing_score,
      });

      setScore(response.score);
      setShowFeedback(true);
    } catch (error) {
      console.error('Error submitting exercise:', error);
      setFeedback({
        type: 'error',
        title: 'Error',
        message: 'Hubo un error al enviar tus respuestas. Por favor intenta de nuevo.',
        score: 0,
        isCorrect: false,
      });
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setCurrentFragmentIndex(0);
    setPhase('intro');
    setSelectedCategory(null);
    setCurrentText('');
    setIsTimerRunning(false);
    setIsWheelSpinning(false);
    setFragmentStates(
      exercise.content.fragments.map((frag) => ({
        fragmentId: frag.id,
        categoryId: null,
        userText: '',
        timeSpent: 0,
        isComplete: false,
        startedAt: null,
      }))
    );
    setTotalTimeSpent(0);
    setScore(0);
    setShowFeedback(false);
    setFeedback(null);
  };

  // Actions ref
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        getState: () => ({
          currentFragmentIndex,
          fragments: fragmentStates,
          totalTimeSpent,
          score,
          hintsUsed: 0,
          isWheelSpinning,
          selectedCategoryId: selectedCategory?.id || null,
        }),
        reset: handleReset,
        submit: handleSubmitExercise,
      };
    }
  }, [actionsRef, currentFragmentIndex, fragmentStates, totalTimeSpent, score, isWheelSpinning, selectedCategory]);

  // Validate text length
  const isTextValid =
    characterCount >= exercise.content.settings.minTextLength &&
    characterCount <= exercise.content.settings.maxTextLength;

  const getCharacterColor = () => {
    if (characterCount < exercise.content.settings.minTextLength) return 'text-red-600';
    if (characterCount > exercise.content.settings.maxTextLength) return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white shadow-lg">
            <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
            <p className="opacity-90 mb-4">{exercise.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <div>
                📊 Fragmento {currentFragmentIndex + 1} de {exercise.content.fragments.length}
              </div>
              <div>⏱️ Tiempo: {Math.floor(totalTimeSpent / 60)}:{String(totalTimeSpent % 60).padStart(2, '0')}</div>
              {score > 0 && <div>⭐ Puntuación: {score}/100</div>}
            </div>
          </div>

          {/* Instructions (Intro Phase) */}
          {phase === 'intro' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-6"
              >
                <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                  <Book className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">¿Cómo funciona?</h3>
                  <div className="text-left space-y-2 text-gray-700 max-w-2xl mx-auto">
                    {exercise.content.instructions.split('\n').map((line, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-semibold">{line}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSpinWheel}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <RotateCw className="w-6 h-6" />
                  Girar la Ruleta
                </button>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Wheel Spinning Phase */}
          {phase === 'spinning' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="spinning"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <WheelSpinner
                  categories={exercise.content.categories}
                  isSpinning={isWheelSpinning}
                  onSpinComplete={handleWheelSpinComplete}
                />
              </motion.div>
            </AnimatePresence>
          )}

          {/* Reading Phase */}
          {phase === 'reading' && selectedCategory && (
            <AnimatePresence mode="wait">
              <motion.div
                key="reading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Selected Category */}
                <div
                  className="rounded-lg p-6 text-white text-center shadow-lg"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  <div className="text-5xl mb-3">{selectedCategory.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{selectedCategory.name}</h3>
                  <p className="text-lg opacity-90">{selectedCategory.description}</p>
                </div>

                {/* Fragment Text */}
                <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-300">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Fragmento {currentFragmentIndex + 1}:</h4>
                  <p className="text-lg leading-relaxed text-gray-800">{currentFragment.text}</p>
                </div>

                <button
                  onClick={handleStartWriting}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transition-all transform hover:scale-105 flex items-center gap-3 mx-auto"
                >
                  <Send className="w-6 h-6" />
                  Comenzar a Escribir
                </button>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Writing Phase */}
          {phase === 'writing' && selectedCategory && (
            <AnimatePresence mode="wait">
              <motion.div
                key="writing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Timer */}
                <CountdownTimer
                  duration={exercise.content.settings.timeLimit}
                  isRunning={isTimerRunning}
                  onComplete={handleTimerComplete}
                />

                {/* Category Reminder */}
                <div
                  className="rounded-lg p-4 text-white text-center"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  <span className="text-2xl mr-2">{selectedCategory.icon}</span>
                  <span className="font-semibold">Escribe una inferencia {selectedCategory.name.toLowerCase()}</span>
                </div>

                {/* Fragment Text */}
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
                  <p className="text-base leading-relaxed text-gray-800">{currentFragment.text}</p>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <textarea
                    ref={textareaRef}
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder={`Escribe tu inferencia aquí (${exercise.content.settings.minTextLength}-${exercise.content.settings.maxTextLength} caracteres)...`}
                    className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none text-base"
                    maxLength={exercise.content.settings.maxTextLength}
                    disabled={!isTimerRunning}
                  />
                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-semibold ${getCharacterColor()}`}>
                      {characterCount} / {exercise.content.settings.maxTextLength} caracteres
                      {characterCount < exercise.content.settings.minTextLength &&
                        ` (mínimo ${exercise.content.settings.minTextLength})`}
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleManualSubmit}
                    disabled={!isTextValid || !isTimerRunning}
                    className={`font-bold py-4 px-8 rounded-lg shadow-lg transition-all flex items-center gap-3 ${
                      isTextValid && isTimerRunning
                        ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-6 h-6" />
                    Enviar Respuesta
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}

          {/* Completed Phase */}
          {phase === 'completed' && (
            <AnimatePresence mode="wait">
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
              >
                <div className="bg-green-50 rounded-lg p-8 border-2 border-green-300">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-900 mb-2">¡Ejercicio Completado!</h3>
                  <p className="text-gray-700">
                    {isSubmitting ? 'Enviando tus respuestas...' : 'Procesando resultados...'}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (onComplete) {
              onComplete(score, totalTimeSpent);
            }
          }}
          onRetry={handleReset}
        />
      )}
    </>
  );
};

export default RuedaInferenciasExercise;
