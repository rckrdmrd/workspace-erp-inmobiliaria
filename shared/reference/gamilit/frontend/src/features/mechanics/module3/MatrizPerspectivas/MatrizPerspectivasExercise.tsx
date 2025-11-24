import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Grid3x3, Sparkles, Eye } from 'lucide-react';
import { DetectiveCard } from '@/shared/components/base/DetectiveCard';
import { DetectiveButton } from '@/shared/components/base/DetectiveButton';
import { FeedbackModal } from '@/shared/components/mechanics/FeedbackModal';
import { fetchMatrixExercise, getAIPerspectives } from './matrizPerspectivasAPI';
import type { MatrixExercise, Perspective } from './matrizPerspectivasTypes';
import { calculateTimeBonus, calculateCompletionBonus } from '@/shared/utils/scoring';
import { saveProgress as saveProgressUtil, loadProgress, clearProgress } from '@/shared/utils/storage';

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
}

interface ExerciseState {
  perspectives: any[];
  currentScore: number;
  perspectivesGenerated: boolean;
}

export const MatrizPerspectivasExercise: React.FC<ExerciseProps> = ({
  moduleId,
  lessonId,
  exerciseId,
  userId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  difficulty = 'medium'
}) => {
  const [exercise, setExercise] = useState<MatrixExercise | null>(null);
  const [perspectives, setPerspectives] = useState<any[]>(initialData?.perspectives || []);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentScore, setCurrentScore] = useState(initialData?.currentScore || 0);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const actionsRef = useRef<any>(null);

  useEffect(() => {
    loadExercise();
  }, []);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => clearInterval(interval);
  }, [perspectives, currentScore]);

  // Update progress
  useEffect(() => {
    if (!exercise) return;
    const progress = perspectives.length > 0 ? 100 : 0;
    onProgressUpdate?.(progress);

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);
  }, [perspectives, exercise]);

  const loadExercise = async () => {
    try {
      const data = await fetchMatrixExercise('matrix-1');
      setExercise(data);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = () => {
    const state: ExerciseState = {
      perspectives,
      currentScore,
      perspectivesGenerated: perspectives.length > 0
    };
    saveProgressUtil(exerciseId, state);
  };

  const handleGenerate = async () => {
    if (!exercise) return;
    setGenerating(true);
    try {
      const persp = await getAIPerspectives(exercise.topic, exercise.perspectiveCount);
      setPerspectives(persp);
      const newScore = 50; // Base score for generating perspectives
      setCurrentScore(newScore);
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = () => {
    setShowFeedback(true);
  };

  const calculateFinalScore = () => {
    const baseScore = currentScore;
    const timeBonus = calculateTimeBonus(startTime, new Date(), 20, 60);
    const completionBonus = calculateCompletionBonus(perspectives.length, exercise?.perspectiveCount || 3, 30);
    return Math.min(100, baseScore + timeBonus + completionBonus);
  };

  const handleReset = () => {
    setPerspectives([]);
    setCurrentScore(0);
  };

  // Attach actions ref
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck: handleComplete,
        getState: () => ({ perspectives, currentScore })
      };
    }
  }, [perspectives, currentScore]);

  if (loading || !exercise) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-detective-orange-50 to-detective-blue-50">
        <div className="text-detective-lg text-detective-text-secondary">Cargando ejercicio...</div>
      </div>
    );
  }

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-detective-blue to-detective-orange rounded-detective-lg p-6 text-white shadow-detective-lg"
          >
            <div className="flex items-center gap-3 mb-2">
              <Grid3x3 className="w-8 h-8" />
              <h1 className="text-detective-3xl font-bold">Matriz de Perspectivas</h1>
            </div>
            <p className="text-detective-lg mb-2">{exercise.topic}</p>
            <p className="text-detective-base opacity-90">{exercise.description}</p>
          </motion.div>

          {/* Generate Button */}
          <div className="text-center">
            <DetectiveButton
              variant="primary"

              onClick={handleGenerate}
              disabled={generating}
              loading={generating}
              icon={<Sparkles className="w-6 h-6" />}
            >
              {generating ? 'Generando Perspectivas...' : 'Generar Perspectivas con IA'}
            </DetectiveButton>
          </div>

          {/* Perspectives Grid */}
          {perspectives.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {perspectives.map((persp, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.15 }}
                >
                  <div className="bg-white rounded-detective p-6 border-2 border-detective-border-light hover:shadow-detective-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                      <Eye className="w-5 h-5 text-detective-orange" />
                      <h3 className="text-detective-lg font-semibold text-detective-blue">
                        {persp.perspective}
                      </h3>
                    </div>

                    {/* Viewpoint */}
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-detective-sm font-medium text-blue-900">
                        {persp.viewpoint}
                      </p>
                    </div>

                    {/* Arguments */}
                    <div className="mb-4">
                      <h4 className="text-detective-sm font-semibold text-detective-blue mb-2">
                        Argumentos
                      </h4>
                      <ul className="space-y-1">
                        {persp.arguments.map((arg: string, i: number) => (
                          <li key={i} className="text-detective-xs flex items-start gap-1">
                            <span className="text-green-600">+</span>
                            <span>{arg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Counter-arguments */}
                    <div className="mb-4">
                      <h4 className="text-detective-sm font-semibold text-detective-blue mb-2">
                        Contraargumentos
                      </h4>
                      <ul className="space-y-1">
                        {persp.counterarguments.map((counter: string, i: number) => (
                          <li key={i} className="text-detective-xs flex items-start gap-1">
                            <span className="text-red-600">−</span>
                            <span>{counter}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Biases */}
                    {persp.biases && persp.biases.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-detective-sm font-semibold text-detective-blue mb-2">
                          Sesgos Posibles
                        </h4>
                        <ul className="space-y-1">
                          {persp.biases.map((bias: string, i: number) => (
                            <li key={i} className="text-detective-xs text-yellow-800">
                              ⚠ {bias}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contextual Factors */}
                    {persp.contextualFactors && persp.contextualFactors.length > 0 && (
                      <div>
                        <h4 className="text-detective-sm font-semibold text-detective-blue mb-2">
                          Factores Contextuales
                        </h4>
                        <ul className="space-y-1">
                          {persp.contextualFactors.map((factor: string, i: number) => (
                            <li key={i} className="text-detective-xs text-gray-600">
                              • {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {perspectives.length === 0 && !generating && (
            <div className="bg-white rounded-detective p-12 border-2 border-detective-border-light text-center mt-6">
              <Grid3x3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-detective-base text-detective-text-secondary">
                Genera perspectivas con IA para comenzar el análisis
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            {onExit && (
              <DetectiveButton
                variant="secondary"

                onClick={onExit}
              >
                Salir
              </DetectiveButton>
            )}
            <DetectiveButton
              variant="gold"

              onClick={handleReset}
            >
              Reiniciar
            </DetectiveButton>
            <DetectiveButton
              variant="primary"

              onClick={handleComplete}
              disabled={perspectives.length === 0}
            >
              Completar Ejercicio
            </DetectiveButton>
          </div>
        </div>
      </DetectiveCard>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedback}
        feedback={{
          type: perspectives.length >= exercise.perspectiveCount ? 'success' : 'partial',
          title: perspectives.length >= exercise.perspectiveCount ? '¡Análisis Completo!' : 'Perspectivas Generadas',
          message: `Has generado ${perspectives.length} perspectiva(s) con ${currentScore} puntos.`,
          score: calculateFinalScore(),
          showConfetti: perspectives.length >= exercise.perspectiveCount
        }}
        onClose={() => {
          setShowFeedback(false);
          if (perspectives.length >= exercise.perspectiveCount) {
            onComplete?.(calculateFinalScore(), timeSpent);
          }
        }}
        onRetry={handleReset}
      />
    </>
  );
};

export default MatrizPerspectivasExercise;
