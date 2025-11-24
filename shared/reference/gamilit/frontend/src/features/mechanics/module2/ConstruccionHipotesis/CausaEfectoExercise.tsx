import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, XCircle, GripVertical } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { calculateScore, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import type {
  CausaEfectoExerciseProps,
  CauseMatches,
} from './causaEfectoTypes';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const CausaEfectoExercise: React.FC<CausaEfectoExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef,
}) => {
  const { user } = useAuth();
  const [matches, setMatches] = useState<CauseMatches>({});
  const [validated, setValidated] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [startTime] = useState(new Date());
  const [draggedConsequence, setDraggedConsequence] = useState<string | null>(null);
  const [dragOverCause, setDragOverCause] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { causes, consequences } = exercise.content;

  // Initialize empty matches for all causes
  useEffect(() => {
    const initialMatches: CauseMatches = {};
    causes.forEach(cause => {
      initialMatches[cause.id] = [];
    });
    setMatches(initialMatches);
  }, [causes]);

  // FE-055 & FE-059: Notify parent of progress updates with user answers
  useEffect(() => {
    if (onProgressUpdate) {
      const totalMatches = Object.values(matches).reduce((sum, arr) => sum + arr.length, 0);

      // FE-059: Prepare user answers in backend DTO format
      // Backend expects: { causes: { c1: ["cons1", "cons2"] } }
      const userAnswers: Record<string, string[]> = {};
      Object.keys(matches).forEach(causeId => {
        if (matches[causeId].length > 0) {
          userAnswers[causeId] = matches[causeId];
        }
      });

      // Send BOTH progress metadata AND user answers
      onProgressUpdate({
        progress: {
          currentStep: totalMatches,
          totalSteps: consequences.length, // All consequences should be matched
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed: 0,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { causes: userAnswers },
      });

      console.log('📊 [CausaEfecto] Progress update sent:', {
        totalMatches,
        totalConsequences: consequences.length
      });
    }
  }, [matches, startTime, onProgressUpdate, consequences.length]);

  // FE-059: Removed calculateCurrentScore() - uses sanitized correctCauseIds field
  // Scoring is now done server-side via backend API

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, consequenceId: string) => {
    if (validated) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('consequenceId', consequenceId);
    setDraggedConsequence(consequenceId);
  };

  const handleDragEnd = () => {
    setDraggedConsequence(null);
    setDragOverCause(null);
  };

  const handleDragOver = (e: React.DragEvent, causeId: string) => {
    if (validated) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCause(causeId);
  };

  const handleDragLeave = () => {
    setDragOverCause(null);
  };

  const handleDrop = (e: React.DragEvent, causeId: string) => {
    if (validated) return;
    e.preventDefault();
    const consequenceId = e.dataTransfer.getData('consequenceId');

    if (!consequenceId) return;

    setMatches(prev => {
      const newMatches = { ...prev };

      // Remove from all causes first
      Object.keys(newMatches).forEach(cId => {
        newMatches[cId] = newMatches[cId].filter(id => id !== consequenceId);
      });

      // Add to new cause
      newMatches[causeId] = [...newMatches[causeId], consequenceId];

      return newMatches;
    });

    setDraggedConsequence(null);
    setDragOverCause(null);
  };

  const handleRemoveConsequence = (causeId: string, consequenceId: string) => {
    if (validated) return;

    setMatches(prev => ({
      ...prev,
      [causeId]: prev[causeId].filter(id => id !== consequenceId),
    }));
  };

  const isConsequenceAssigned = (consequenceId: string): boolean => {
    return Object.values(matches).some(arr => arr.includes(consequenceId));
  };

  // FE-059: Removed getMatchCounts() - uses sanitized correctCauseIds field
  // Validation is now done server-side via backend API

  const handleCheck = useCallback(async () => {
    const totalMatches = Object.values(matches).reduce((sum, arr) => sum + arr.length, 0);
    const hasMatches = totalMatches > 0;

    if (!hasMatches) {
      setFeedback({
        type: 'error',
        title: 'Ejercicio Incompleto',
        message: 'Debes establecer al menos una relación causa-efecto antes de verificar.',
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
    setValidated(true);

    try {
      // Prepare answers in backend DTO format: { causes: { c1: ["cons1", "cons2"] } }
      const userAnswers: Record<string, string[]> = {};
      Object.keys(matches).forEach(causeId => {
        if (matches[causeId].length > 0) {
          userAnswers[causeId] = matches[causeId];
        }
      });

      // Submit to backend API
      const response = await submitExercise(exercise.id, user.id, { causes: userAnswers });

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has establecido ${response.correctAnswersCount} de ${response.totalQuestions} relaciones correctas.`,
        score: response.score,
        xpEarned: response.rewards?.xp,
        mlCoinsEarned: response.rewards?.mlCoins,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [CausaEfecto] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [CausaEfecto] Submission error:', error);
      setFeedback({
        type: 'error',
        title: 'Error al Enviar',
        message: 'Hubo un problema al enviar tu respuesta. Por favor, intenta nuevamente.',
      });
      setShowFeedback(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [matches, user, exercise.id]);

  const handleReset = useCallback(() => {
    const initialMatches: CauseMatches = {};
    causes.forEach(cause => {
      initialMatches[cause.id] = [];
    });
    setMatches(initialMatches);
    setValidated(false);
    setShowFeedback(false);
    setFeedback(null);
  }, [causes]);

  // Populate actionsRef for parent component
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck,
      };
    }
  }, [actionsRef, handleReset, handleCheck]);

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div
            className="rounded-detective p-6 shadow-detective-lg"
            style={{
              background: 'linear-gradient(to right, #1e3a8a, #f97316)',
              color: 'white'
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <ArrowRight className="w-8 h-8 text-white" />
              <h1 className="text-detective-3xl font-bold text-white">{exercise.title}</h1>
            </div>
            <p className="text-detective-base text-white" style={{ opacity: 0.9 }}>
              Conecta causas con sus consecuencias lógicas
            </p>
          </div>

          {/* Instructions */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
            <p className="text-detective-sm text-detective-text leading-relaxed font-semibold mb-2">
              📋 Cómo funciona:
            </p>
            <ul className="text-detective-sm text-detective-text leading-relaxed list-disc list-inside space-y-1">
              <li><strong>Arrastra</strong> las consecuencias desde la columna derecha</li>
              <li><strong>Suéltalas</strong> en la causa correspondiente en la columna izquierda</li>
              <li>Cada causa puede tener <strong>1-3 consecuencias</strong></li>
              <li>Piensa en efectos inmediatos, a largo plazo e impacto en otros</li>
            </ul>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between">
            <div className="text-detective-sm text-detective-text-secondary">
              Consecuencias asignadas: {Object.values(matches).reduce((sum, arr) => sum + arr.length, 0)} / {consequences.length}
            </div>
            {/* FE-059: Removed correctness display - validation is server-side only */}
          </div>

          {/* Two-column layout: Causes | Consequences */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT: Causes (drop zones) */}
            <div className="space-y-4">
              <h3 className="text-detective-lg font-bold text-detective-blue mb-4 flex items-center gap-2">
                <span className="text-2xl">←</span> CAUSAS (Suelta aquí)
              </h3>
              {causes.map((cause, idx) => {
                const matchedConsequences = matches[cause.id] || [];
                const isDragOver = dragOverCause === cause.id;

                return (
                  <motion.div
                    key={cause.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onDragOver={(e) => handleDragOver(e, cause.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, cause.id)}
                    className={`bg-white border-2 rounded-lg p-4 transition-all ${
                      isDragOver
                        ? 'border-orange-500 bg-orange-50 scale-105'
                        : 'border-blue-300'
                    } ${!validated ? 'min-h-[120px]' : ''}`}
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <span className="text-detective-2xl font-bold text-blue-600">
                        {idx + 1}
                      </span>
                      <p className="text-detective-sm font-medium text-detective-text flex-1">
                        {cause.text}
                      </p>
                    </div>

                    {/* Matched consequences */}
                    {matchedConsequences.length > 0 && (
                      <div className="mt-3 space-y-2 pl-8">
                        {matchedConsequences.map(cId => {
                          const consequence = consequences.find(c => c.id === cId);
                          if (!consequence) return null;

                          // FE-059: Removed correctness validation - correctCauseIds field not available
                          // Visual feedback disabled until backend integration

                          return (
                            <div
                              key={cId}
                              className="p-3 rounded-lg border-2 text-detective-xs relative group bg-orange-50 border-orange-300 text-orange-900"
                            >
                              <div className="flex items-center gap-2">
                                {/* FE-059: Removed CheckCircle/XCircle icons - no local validation */}
                                <span className="flex-1">{consequence.text}</span>
                                {!validated && (
                                  <button
                                    onClick={() => handleRemoveConsequence(cause.id, cId)}
                                    className="text-red-600 hover:text-red-800 opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Quitar"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {matchedConsequences.length === 0 && !validated && (
                      <div className="flex items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-lg mt-2">
                        <p className="text-detective-xs text-gray-400 italic text-center">
                          Arrastra consecuencias aquí →
                        </p>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* RIGHT: Consequences (draggable) */}
            <div className="space-y-4">
              <h3 className="text-detective-lg font-bold text-detective-orange mb-4 flex items-center gap-2">
                CONSECUENCIAS (Arrastra) <span className="text-2xl">→</span>
              </h3>
              <div className="space-y-3">
                {consequences.map((consequence, idx) => {
                  const isAssigned = isConsequenceAssigned(consequence.id);
                  const isDragging = draggedConsequence === consequence.id;

                  // Si ya está asignada, no la mostramos en la lista de disponibles
                  if (isAssigned) return null;

                  return (
                    <motion.div
                      key={consequence.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <div
                        draggable={!validated}
                        onDragStart={(e) => handleDragStart(e, consequence.id)}
                        onDragEnd={handleDragEnd}
                        className={`p-4 rounded-lg border-2 cursor-move transition-all ${
                          isDragging
                            ? 'opacity-50 scale-95'
                            : 'bg-white border-gray-300 hover:border-orange-400 hover:shadow-md'
                        } ${validated ? 'cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          {!validated && (
                            <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                          <span className="text-detective-sm text-detective-text flex-1">
                            {consequence.text}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {/* If all consequences are assigned */}
                {consequences.filter(c => !isConsequenceAssigned(c.id)).length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-detective-sm italic">
                    Todas las consecuencias han sido asignadas
                  </div>
                )}
              </div>
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
              const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
              onComplete(feedback.score || 0, timeSpent);
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

export default CausaEfectoExercise;
