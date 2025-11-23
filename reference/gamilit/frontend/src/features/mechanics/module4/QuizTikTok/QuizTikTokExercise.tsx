import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Menu, X, Save, Award } from 'lucide-react';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { TimerWidget } from '@shared/components/mechanics/TimerWidget';
import { ProgressTracker } from '@shared/components/mechanics/ProgressTracker';
import { ScoreDisplay } from '@shared/components/mechanics/ScoreDisplay';
import { TikTokCard } from './TikTokCard';
import { QuizTikTokData } from './quizTikTokTypes';
import { calculateScore, saveProgress, FeedbackData, DifficultyLevel } from '@shared/components/mechanics/mechanicsTypes';

interface ExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: number) => void;
  initialData?: ExerciseState;
  difficulty?: 'easy' | 'medium' | 'hard';
  exercise?: QuizTikTokData;
}

interface ExerciseState {
  currentIndex: number;
  answers: number[];
}

const getDefaultExercise = (exerciseId: string, difficulty: string): QuizTikTokData => ({
  id: exerciseId,
  title: 'Quiz TikTok',
  description: 'Responde las preguntas en formato TikTok',
  difficulty: difficulty as any,
  estimatedTime: 300,
  topic: 'Marie Curie',
  hints: [],
  questions: [
      {
        id: 'q1',
        question: '¿En qué año nació Marie Curie?',
        options: ['1867', '1875', '1880', '1890'],
        correctAnswer: 0,
        backgroundColor: '#1f2937'
      },
      {
        id: 'q2',
        question: '¿Cuántos Premios Nobel ganó Marie Curie?',
        options: ['1', '2', '3', '4'],
        correctAnswer: 1,
        backgroundColor: '#7c3aed'
      },
      {
        id: 'q3',
        question: '¿Qué elementos descubrió Marie Curie?',
        options: ['Uranio y Plutonio', 'Polonio y Radio', 'Helio y Neón', 'Oro y Plata'],
        correctAnswer: 1,
        backgroundColor: '#ea580c'
      },
      {
        id: 'q4',
        question: '¿Cuál fue la primera universidad en admitir a Marie Curie como profesora?',
        options: ['Universidad de Oxford', 'Universidad de Cambridge', 'Universidad de la Sorbona', 'Universidad de Berlín'],
        correctAnswer: 2,
        backgroundColor: '#2563eb'
      },
      {
        id: 'q5',
        question: '¿En qué campos ganó sus Premios Nobel?',
        options: ['Física y Medicina', 'Física y Química', 'Química y Medicina', 'Física y Literatura'],
        correctAnswer: 1,
        backgroundColor: '#059669'
      }
  ]
});

export const QuizTikTokExercise: React.FC<ExerciseProps> = ({
  moduleId,
  lessonId,
  exerciseId,
  userId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  difficulty = 'medium',
  exercise
}) => {
  const defaultExercise = getDefaultExercise(exerciseId, difficulty);
  const currentExercise = exercise || defaultExercise;
  const [currentIndex, setCurrentIndex] = useState(initialData?.currentIndex || 0);
  const [answers, setAnswers] = useState<number[]>(initialData?.answers || []);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [startTime] = useState(new Date());
  const [currentScore, setCurrentScore] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  const actionsRef = useRef<{
    handleReset?: () => void;
    handleCheck?: () => void;
    specificActions?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'blue' | 'gold';
    }>;
  }>({});

  // Calculate progress
  const calculateProgress = () => {
    return (answers.length / currentExercise.questions.length) * 100;
  };

  // Calculate current score
  const calculateCurrentScore = () => {
    const correct = answers.filter((ans, idx) => ans === currentExercise.questions[idx].correctAnswer).length;
    return Math.floor((correct / currentExercise.questions.length) * 100);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState: ExerciseState = { currentIndex, answers };
      saveProgress(exerciseId, currentState);
    }, 30000);

    return () => clearInterval(interval);
  }, [currentIndex, answers, exerciseId]);

  // Update progress
  useEffect(() => {
    const progress = calculateProgress();
    const score = calculateCurrentScore();
    setCurrentScore(score);

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);

    onProgressUpdate?.(progress);
  }, [answers, onProgressUpdate, startTime]);

  // Handle swipe navigation
  const handleSwipe = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentIndex < currentExercise.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  // Handle answer selection
  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);

    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentIndex < currentExercise.questions.length - 1) {
        handleSwipe('down');
      } else {
        // Last question answered, trigger check
        handleCheck(newAnswers);
      }
    }, 500);
  };

  // Handle check/verification
  const handleCheck = async (finalAnswers: number[] = answers) => {
    const correct = finalAnswers.filter((ans, idx) => ans === currentExercise.questions[idx].correctAnswer).length;

    if (finalAnswers.length < currentExercise.questions.length) {
      setFeedback({
        type: 'error',
        title: 'Quiz Incompleto',
        message: `Has respondido ${finalAnswers.length} de ${currentExercise.questions.length} preguntas.`,
        showConfetti: false
      });
      setShowFeedback(true);
      return;
    }

    const endTime = new Date();
    const timeSpentSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);

    const score = calculateScore(correct, currentExercise.questions.length);

    setFeedback({
      type: correct === currentExercise.questions.length ? 'success' : correct >= currentExercise.questions.length / 2 ? 'partial' : 'error',
      title: correct === currentExercise.questions.length ? '¡Perfect!' : correct >= currentExercise.questions.length / 2 ? 'Buen intento' : 'Sigue practicando',
      message: `Respondiste correctamente ${correct} de ${currentExercise.questions.length} preguntas (${Math.round((correct / currentExercise.questions.length) * 100)}%).`,
      score: correct >= currentExercise.questions.length / 2 ? score : undefined,
      showConfetti: correct === currentExercise.questions.length
    });
    setShowFeedback(true);
  };

  // Handle reset
  const handleReset = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setFeedback(null);
    setShowFeedback(false);
  };

  // Handle save
  const handleSave = () => {
    const currentState: ExerciseState = { currentIndex, answers };
    saveProgress(exerciseId, currentState);

    setFeedback({
      type: 'info',
      title: 'Progreso Guardado',
      message: 'Tu progreso ha sido guardado correctamente.',
      showConfetti: false
    });
    setShowFeedback(true);
  };

  // Attach actions to ref
  useEffect(() => {
    actionsRef.current = {
      handleReset,
      handleCheck: () => handleCheck(answers),
      specificActions: [
        {
          label: 'Guardar',
          icon: <Save className="w-4 h-4" />,
          onClick: handleSave,
          variant: 'blue'
        }
      ]
    };
  }, [currentIndex, answers]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Main TikTok-style vertical content */}
      <div className="relative w-full max-w-md h-screen mx-auto bg-black">
        <AnimatePresence mode="wait">
          <TikTokCard
            key={currentIndex}
            question={currentExercise.questions[currentIndex]}
            onAnswer={handleAnswer}
            selectedAnswer={answers[currentIndex]}
          />
        </AnimatePresence>

        {/* Navigation Controls - Bottom */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-4 z-20">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <DetectiveButton
              variant="secondary"
              onClick={() => handleSwipe('up')}
              disabled={currentIndex === 0}
              icon={<ChevronUp />}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white"
            >
              Anterior
            </DetectiveButton>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <DetectiveButton
              variant="secondary"
              onClick={() => handleSwipe('down')}
              disabled={currentIndex === currentExercise.questions.length - 1}
              icon={<ChevronDown />}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white"
            >
              Siguiente
            </DetectiveButton>
          </motion.div>
        </div>

        {/* Progress Indicator - Bottom */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm font-medium z-20 flex items-center justify-center gap-3">
          <span className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
            Pregunta {currentIndex + 1} / {currentExercise.questions.length}
          </span>
          <span className="bg-detective-orange/80 backdrop-blur-md px-4 py-2 rounded-full">
            {answers.length} respondidas
          </span>
        </div>

        {/* Sidebar Toggle Button - Top Right */}
        <div className="absolute top-4 right-4 z-30">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <DetectiveButton
              variant="gold"
              onClick={() => setShowSidebar(!showSidebar)}
              icon={showSidebar ? <X /> : <Menu />}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white"
            >
              {showSidebar ? 'Cerrar' : 'Menú'}
            </DetectiveButton>
          </motion.div>
        </div>

        {/* Exit Button - Top Left */}
        <div className="absolute top-4 left-4 z-30">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <DetectiveButton
              variant="secondary"
              onClick={onExit}
              className="bg-white/20 backdrop-blur-md border-white/30 text-white"
            >
              Salir
            </DetectiveButton>
          </motion.div>
        </div>
      </div>

      {/* Floating Sidebar (Bottom Sheet on mobile) */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-0 right-0 w-80 h-full bg-gradient-to-br from-detective-orange-50 to-detective-blue-50 shadow-detective-lg z-40 overflow-y-auto"
          >
            <div className="p-6 space-y-4">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-detective-2xl font-bold text-detective-text">Panel de Control</h2>
                <DetectiveButton
                  variant="secondary"

                  onClick={() => setShowSidebar(false)}
                  icon={<X />}
                >
                  Cerrar
                </DetectiveButton>
              </div>

              {/* Timer Widget */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <TimerWidget startTime={Date.now()} isPaused={false} showSeconds={true} />
              </motion.div>

              {/* Progress Tracker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ProgressTracker currentStep={calculateProgress()} totalSteps={100} variant="circular" />
              </motion.div>

              {/* Score Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <ScoreDisplay score={currentScore} maxScore={100} />
              </motion.div>

              {/* Question Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <DetectiveCard variant="default" padding="md">
                  <h3 className="font-bold text-detective-text mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-detective-orange" />
                    Estado de Preguntas
                  </h3>
                  <div className="space-y-2">
                    {currentExercise.questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2 rounded-detective transition-colors ${
                          idx === currentIndex
                            ? 'bg-detective-orange text-white'
                            : answers[idx] !== undefined
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span className="font-medium">Pregunta {idx + 1}</span>
                        <span className="text-xs">
                          {idx === currentIndex
                            ? 'Actual'
                            : answers[idx] !== undefined
                            ? 'Respondida'
                            : 'Pendiente'}
                        </span>
                      </div>
                    ))}
                  </div>
                </DetectiveCard>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <DetectiveCard variant="default" padding="md">
                  <div className="space-y-3">
                    <DetectiveButton
                      variant="blue"
                      icon={<Save />}
                      onClick={handleSave}
                      className="w-full"
                    >
                      Guardar Progreso
                    </DetectiveButton>
                    <DetectiveButton
                      variant="gold"
                      onClick={handleReset}
                      className="w-full"
                    >
                      Reiniciar Quiz
                    </DetectiveButton>
                    <DetectiveButton
                      variant="primary"
                      onClick={() => handleCheck(answers)}
                      className="w-full"
                      disabled={answers.length < currentExercise.questions.length}
                    >
                      Verificar Respuestas
                    </DetectiveButton>
                  </div>
                </DetectiveCard>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <DetectiveCard variant="default" padding="md">
                  <h3 className="font-bold text-detective-text mb-3">Instrucciones</h3>
                  <div className="space-y-2 text-detective-sm text-detective-text-secondary">
                    <p>• Selecciona una respuesta para cada pregunta</p>
                    <p>• Usa los botones para navegar entre preguntas</p>
                    <p>• Responde todas las preguntas para verificar</p>
                    <p>• ¡Intenta obtener el 100%!</p>
                  </div>
                </DetectiveCard>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success' && feedback.score) {
              onComplete?.(feedback.score, timeSpent);
            }
          }}
          onRetry={handleReset}
        />
      )}
    </div>
  );
};
