import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Image, Plus, Trash2, Save } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { MemeAnnotator } from './MemeAnnotator';
import { AnalisisMemesData, MemeAnnotation } from './analisisMemesTypes';
import { calculateScore, saveProgress, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { DifficultyLevel } from '@shared/types/educational.types';

interface ExerciseProps {
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: number) => void;
  initialData?: ExerciseState;
  difficulty?: 'easy' | 'medium' | 'hard';
  exercise?: AnalisisMemesData;
}

interface ExerciseState {
  annotations: MemeAnnotation[];
}

const defaultExercise: AnalisisMemesData = {
  id: 'analisis-memes',
  title: 'Análisis de Memes',
  description: 'Analiza la imagen del meme e identifica elementos clave',
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedTime: 600,
  topic: 'Análisis de textos digitales',
  hints: [],
  memeUrl: 'https://via.placeholder.com/600x400?text=Meme+Example',
  memeTitle: 'Meme sobre Marie Curie',
  expectedAnnotations: []
};

export const AnalisisMemesExercise: React.FC<ExerciseProps> = ({
  exerciseId,
  userId,
  onComplete,
  onExit,
  onProgressUpdate,
  initialData,
  difficulty = 'medium',
  exercise = defaultExercise
}) => {
  const [annotations, setAnnotations] = useState<MemeAnnotation[]>(initialData?.annotations || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState<MemeAnnotation | null>(null);
  const [selectedAnnotation, setSelectedAnnotation] = useState<MemeAnnotation | null>(null);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);

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

  const categories: Array<'texto' | 'contexto' | 'humor' | 'critica'> = ['texto', 'contexto', 'humor', 'critica'];

  // Calculate progress
  const calculateProgress = () => {
    const minAnnotations = 3;
    return Math.min(100, (annotations.length / minAnnotations) * 100);
  };

  // Calculate score
  const calculateCurrentScore = () => {
    const progress = calculateProgress();
    const categoryBonus = new Set(annotations.map(a => a.category)).size * 5;
    return Math.min(100, Math.floor(progress + categoryBonus));
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const currentState: ExerciseState = { annotations };
      saveProgress(exerciseId, currentState);
    }, 30000);

    return () => clearInterval(interval);
  }, [annotations, exerciseId]);

  // Update progress
  useEffect(() => {
    const progress = calculateProgress();

    const elapsed = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
    setTimeSpent(elapsed);

    onProgressUpdate?.(progress);
  }, [annotations, onProgressUpdate, startTime]);

  // Handle add annotation
  const handleAddAnnotation = (x: number, y: number) => {
    const newAnnotation: MemeAnnotation = {
      id: `ann-${Date.now()}`,
      x,
      y,
      text: 'Nueva anotación',
      category: 'texto'
    };
    setAnnotations(prev => [...prev, newAnnotation]);
    setEditingAnnotation(newAnnotation);
    setIsAdding(false);
  };

  // Handle delete annotation
  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
    setEditingAnnotation(null);
  };

  // Handle update annotation
  const handleUpdateAnnotation = (id: string, updates: Partial<MemeAnnotation>) => {
    setAnnotations(prev =>
      prev.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  // Handle check/verification
  const handleCheck = async () => {
    if (annotations.length < 3) {
      setFeedback({
        type: 'error',
        title: 'Análisis Incompleto',
        message: 'Debes agregar al menos 3 anotaciones para completar el análisis.',
        showConfetti: false
      });
      setShowFeedback(true);
      return;
    }

    const endTime = new Date();

    const score = calculateScore(
      annotations.length,
      Math.max(3, exercise.expectedAnnotations?.length || 3)
    );

    setFeedback({
      type: 'success',
      title: '¡Análisis Completado!',
      message: `Has identificado ${annotations.length} elementos en el meme. Buen trabajo analizando los diferentes aspectos.`,
      score,
      showConfetti: true
    });
    setShowFeedback(true);
  };

  // Handle reset
  const handleReset = () => {
    setAnnotations([]);
    setIsAdding(false);
    setSelectedAnnotation(null);
    setEditingAnnotation(null);
    setFeedback(null);
    setShowFeedback(false);
  };

  // Handle save
  const handleSave = () => {
    const currentState: ExerciseState = { annotations };
    saveProgress(exerciseId, currentState);

    setFeedback({
      type: 'info',
      title: 'Progreso Guardado',
      message: 'Tu análisis ha sido guardado correctamente.',
      showConfetti: false
    });
    setShowFeedback(true);
  };

  // Attach actions to ref
  useEffect(() => {
    actionsRef.current = {
      handleReset,
      handleCheck,
      specificActions: [
        {
          label: 'Guardar',
          icon: <Save className="w-4 h-4" />,
          onClick: handleSave,
          variant: 'blue'
        }
      ]
    };
  }, [annotations]);

  return (
    <>
      <DetectiveCard variant="default" padding="lg" className="mb-6">
        <div className="bg-gradient-to-r from-detective-orange/10 to-detective-blue/10 p-6 rounded-detective mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Image className="w-8 h-8 text-detective-orange" />
            <h1 className="text-detective-3xl font-bold text-detective-text">{exercise.title}</h1>
          </div>
          <p className="text-detective-text-secondary mb-4">
            {exercise.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <DetectiveButton
              variant={isAdding ? 'secondary' : 'gold'}
              icon={<Plus />}
              onClick={() => setIsAdding(!isAdding)}
            >
              {isAdding ? 'Cancelar' : 'Añadir Anotación'}
            </DetectiveButton>
            {isAdding && (
              <p className="text-detective-text-secondary flex items-center">
                Click en la imagen para agregar una anotación
              </p>
            )}
          </div>
        </div>

        <MemeAnnotator
          memeUrl={exercise.memeUrl}
          annotations={annotations}
          onAddAnnotation={handleAddAnnotation}
          isAddingMode={isAdding}
        />

        {/* Annotations List */}
        {annotations.length > 0 && (
          <div className="mt-6">
            <h2 className="text-detective-lg font-bold text-detective-text mb-4">
              Anotaciones ({annotations.length})
            </h2>
            <div className="space-y-3">
              {annotations.map((annotation, idx) => (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-2 border-gray-200 rounded-detective p-4 hover:border-detective-orange transition-colors"
                >
                      {editingAnnotation?.id === annotation.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-detective-text font-medium mb-2 text-detective-sm">
                              Categoría:
                            </label>
                            <select
                              value={annotation.category}
                              onChange={(e) =>
                                handleUpdateAnnotation(annotation.id, {
                                  category: e.target.value as MemeAnnotation['category']
                                })
                              }
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-detective-text font-medium mb-2 text-detective-sm">
                              Texto:
                            </label>
                            <textarea
                              value={annotation.text}
                              onChange={(e) =>
                                handleUpdateAnnotation(annotation.id, { text: e.target.value })
                              }
                              rows={3}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-detective focus:border-detective-orange focus:outline-none resize-none"
                            />
                          </div>
                          <div className="flex gap-2">
                            <DetectiveButton
                              variant="primary"

                              onClick={() => setEditingAnnotation(null)}
                            >
                              Guardar
                            </DetectiveButton>
                            <DetectiveButton
                              variant="secondary"

                              onClick={() => setEditingAnnotation(null)}
                            >
                              Cancelar
                            </DetectiveButton>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-detective-orange text-white text-detective-xs rounded-full">
                                {annotation.category}
                              </span>
                            </div>
                            <p className="text-detective-text">{annotation.text}</p>
                          </div>
                          <div className="flex gap-2">
                            <DetectiveButton
                              variant="blue"

                              onClick={() => setEditingAnnotation(annotation)}
                            >
                              Editar
                            </DetectiveButton>
                            <DetectiveButton
                              variant="secondary"

                              icon={<Trash2 className="w-4 h-4" />}
                              onClick={() => handleDeleteAnnotation(annotation.id)}
                            >
                              Eliminar
                            </DetectiveButton>
                          </div>
                        </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <DetectiveButton variant="secondary" onClick={onExit}>
            Salir
          </DetectiveButton>
          <DetectiveButton variant="blue" icon={<Save />} onClick={handleSave}>
            Guardar Progreso
          </DetectiveButton>
          <DetectiveButton variant="gold" onClick={handleReset}>
            Reiniciar
          </DetectiveButton>
          <DetectiveButton variant="primary" onClick={handleCheck}>
            Verificar Análisis
          </DetectiveButton>
        </div>
      </DetectiveCard>

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
    </>
  );
};
