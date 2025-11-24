import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { TimelineEvent } from './TimelineEvent';
import { TimelineData, TimelineEvent as TimelineEventType } from './timelineTypes';
import { calculateScore } from '@shared/components/mechanics/mechanicsTypes';
import { FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { Shuffle } from 'lucide-react';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export interface TimelineExerciseProps {
  exercise: TimelineData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
    specificActions?: Array<{
      label: string;
      icon?: React.ReactNode;
      onClick: () => void;
      variant?: 'primary' | 'secondary' | 'blue' | 'gold';
    }>;
  }>;
}

export const TimelineExercise: React.FC<TimelineExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef
}) => {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEventType[]>([...exercise.events].sort(() => Math.random() - 0.5));
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [availableCoins, setAvailableCoins] = useState(100);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // FE-059: Removed local correctOrder calculation - validation is done server-side
  // Frontend only tracks that user has ordered the events, not if they're correct

  // FE-055: Notify parent of progress updates WITH user answers
  React.useEffect(() => {
    if (onProgressUpdate) {
      const userOrder = events.map(e => e.id);

      // FE-044 FIX: Use stage-based progress instead of event count
      // Stage 1: Ordering events (50%)
      // Stage 2: Verified/Completed (100%)
      const currentStage = showFeedback ? 2 : 1;
      const totalStages = 2;

      // FE-059: No local validation - just track that events are ordered
      // Send both progress metadata AND user answers
      // BE-FE-062: Changed eventOrder → events to match backend DTO
      onProgressUpdate({
        progress: {
          currentStep: currentStage, // FE-044 FIX: 1=Ordering, 2=Verified
          totalSteps: totalStages,   // FE-044 FIX: 2 stages total
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { events: userOrder }
      });

      console.log('📊 [Timeline] Progress update sent:', {
        currentStage,
        totalStages,
        isVerified: showFeedback
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, hintsUsed, showFeedback, onProgressUpdate, startTime]);

  const handleCheck = async () => {
    const userOrder = events.map(e => e.id);

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
      // Submit to backend API with DTO format: { events: ["e1", "e2", "e3"] }
      const response = await submitExercise(exercise.id, user.id, { events: userOrder });

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has ordenado ${response.correctAnswersCount} de ${response.totalQuestions} eventos correctamente.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [Timeline] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [Timeline] Submission error:', error);
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
    setEvents([...exercise.events].sort(() => Math.random() - 0.5));
    setFeedback(null);
    setShowFeedback(false);
  };

  const handleShuffle = () => {
    setEvents([...events].sort(() => Math.random() - 0.5));
  };

  // Populate actionsRef for parent component
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        handleReset,
        handleCheck,
        specificActions: [
          {
            label: 'Mezclar',
            icon: React.createElement(Shuffle, { className: 'w-4 h-4' }),
            onClick: handleShuffle,
            variant: 'blue' as const
          }
        ]
      };
    }
  }, [actionsRef, handleReset, handleCheck, handleShuffle]);

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <h3 className="text-lg font-bold mb-4">Arrastra los eventos para ordenarlos cronológicamente</h3>
        <Reorder.Group axis="y" values={events} onReorder={setEvents} className="space-y-3">
          {events.map((event, index) => (
            <Reorder.Item key={event.id} value={event}>
              <TimelineEvent event={event} index={index} />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </DetectiveCard>

      {feedback && (
        <FeedbackModal
          isOpen={showFeedback}
          feedback={feedback}
          onClose={() => {
            setShowFeedback(false);
            if (feedback.type === 'success') onComplete?.();
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

export default TimelineExercise;
