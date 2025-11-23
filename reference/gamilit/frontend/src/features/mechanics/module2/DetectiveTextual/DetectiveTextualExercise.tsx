import React, { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { EvidenceBoard } from './EvidenceBoard';
import { MagnifyingGlass } from './MagnifyingGlass';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import {
  validateConnection,
  submitSolution,
} from './detectiveTextualAPI';
import type {
  Investigation,
  DetectiveProgress,
  Evidence,
  EvidenceConnection,
  DetectiveTextualExerciseProps,
  DetectiveTextualState,
} from './detectiveTextualTypes';
import { calculateScore, saveProgress, FeedbackData } from '@shared/components/mechanics/mechanicsTypes';
import { mockInvestigation } from './detectiveTextualMockData';
import { submitExercise } from '@/features/progress/api/progressAPI';
import { useAuth } from '@/features/auth/hooks/useAuth';

export const DetectiveTextualExercise: React.FC<DetectiveTextualExerciseProps> = ({
  exerciseId,
  onComplete,
  onProgressUpdate,
  initialData,
  actionsRef,
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load exercise data based on exerciseId
  const [investigation, setInvestigation] = useState<Investigation | null>(mockInvestigation);
  const [progress, setProgress] = useState<DetectiveProgress>({
    investigationId: exerciseId,
    discoveredEvidence: initialData?.discoveredEvidence || ['evidence-1'],
    connections: initialData?.connections || [],
    hypotheses: initialData?.hypotheses || [],
    hintsUsed: initialData?.hintsUsed || 0,
    timeSpent: initialData?.timeSpent || 0,
    score: initialData?.score || 0,
  });
  const [loading] = useState(false);
  const [selectedEvidence] = useState<Evidence | null>(null);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [availableCoins, setAvailableCoins] = useState(50); // Detective coins for hints/tools

  // Load investigation data on mount if needed
  useEffect(() => {
    if (!investigation) {
      setInvestigation(mockInvestigation);
      setProgress((prev) => ({ ...prev, investigationId: exerciseId }));
    }
  }, [exerciseId]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveProgress(investigation?.id || '', {
        discoveredEvidence: progress.discoveredEvidence,
        connections: progress.connections,
        hypotheses: progress.hypotheses,
        hintsUsed: progress.hintsUsed,
        timeSpent: progress.timeSpent,
        score: progress.score,
      });
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [progress, investigation]);

  // FE-055 & FE-059: Progress update callback with user answers
  useEffect(() => {
    if (onProgressUpdate && investigation) {
      // Prepare user answers for backend
      // Note: Backend DTO format for Detective Textual needs to be defined
      // TODO: Confirm DTO structure with backend - currently using questions format
      const userAnswers: Record<string, string> = {};
      progress.connections.forEach((conn, index) => {
        // Map connections to question format (placeholder)
        userAnswers[`q${index + 1}`] = `${conn.fromEvidenceId}-${conn.toEvidenceId}-${conn.relationship}`;
      });

      onProgressUpdate({
        progress: {
          currentStep: progress.discoveredEvidence.length,
          totalSteps: investigation.availableEvidence.length,
          score: 0, // FE-059: Score calculated by backend only
          hintsUsed: progress.hintsUsed,
          timeSpent: progress.timeSpent,
        },
        answers: { questions: userAnswers }  // BE-FE-062: Wrap in 'questions' key to match DTO
      });

      console.log('📊 [DetectiveTextual] Progress update sent:', {
        discoveredEvidence: progress.discoveredEvidence.length,
        connections: progress.connections.length
      });
    }
  }, [progress.discoveredEvidence.length, progress.connections, progress.hintsUsed, progress.timeSpent, investigation, onProgressUpdate]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => ({ ...prev, timeSpent: prev.timeSpent + 1 }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const handleDiscoverEvidence = (evidenceId: string) => {
    if (!progress.discoveredEvidence.includes(evidenceId)) {
      setProgress({
        ...progress,
        discoveredEvidence: [...progress.discoveredEvidence, evidenceId],
      });
      setAvailableCoins((prev) => prev + 5);
    }
  };

  const handleCreateConnection = async (
    fromId: string,
    toId: string,
    relationship: string
  ) => {
    // FE-059: Removed local validation - isCorrect field no longer available
    // Validation will be done server-side when solution is submitted

    const newConnection: EvidenceConnection = {
      id: `conn-${Date.now()}`,
      fromEvidenceId: fromId,
      toEvidenceId: toId,
      relationship,
      userCreated: true,
      // FE-059: No isCorrect field - validation is server-side only
    };

    setProgress({
      ...progress,
      connections: [...progress.connections, newConnection],
      // FE-059: No score update - calculated by backend only
    });

    // Award coins for creating connection (not based on correctness)
    setAvailableCoins((prev) => prev + 5);
  };

  const handleRemoveConnection = (connectionId: string) => {
    setProgress({
      ...progress,
      connections: progress.connections.filter((c) => c.id !== connectionId),
    });
  };

  const handleSubmitSolution = async () => {
    const hasConnections = progress.connections.length > 0;
    const hasDiscoveredEvidence = progress.discoveredEvidence.length > 1; // More than just the initial evidence

    if (!hasConnections || !hasDiscoveredEvidence) {
      setFeedback({
        type: 'error',
        title: 'Investigación Incompleta',
        message: 'Necesitas crear conexiones entre las evidencias antes de enviar tu solución.',
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

    try {
      // Prepare answers in backend DTO format
      // Format connections as serialized objects for backend validation
      const connectionsData = progress.connections.map(conn => ({
        from: conn.fromEvidenceId,
        to: conn.toEvidenceId,
        relationship: conn.relationship
      }));

      // Submit to backend API
      const response = await submitExercise(exerciseId, user.id, { connections: connectionsData });

      // Show backend response
      setFeedback({
        type: response.isPerfect ? 'success' : response.score >= 70 ? 'partial' : 'error',
        title: response.isPerfect ? '¡Perfecto!' : response.score >= 70 ? '¡Buen trabajo!' : 'Intenta de nuevo',
        message: response.feedback?.overall || `Has identificado ${response.correctAnswersCount} de ${response.totalQuestions} conexiones correctamente.`,
        score: response.score,
        showConfetti: response.isPerfect
      });
      setShowFeedback(true);

      console.log('✅ [DetectiveTextual] Submission successful:', {
        attemptId: response.attemptId,
        score: response.score,
        rewards: response.rewards
      });
    } catch (error) {
      console.error('❌ [DetectiveTextual] Submission error:', error);
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

  const handleReset = useCallback(() => {
    setProgress({
      investigationId: investigation?.id || '',
      discoveredEvidence: ['evidence-1'],
      connections: [],
      hypotheses: [],
      hintsUsed: 0,
      timeSpent: 0,
      score: 0,
    });
    setAvailableCoins(100);
    setFeedback(null);
    setShowFeedback(false);
  }, [investigation?.id]);

  // Get current state for parent component
  const getState = useCallback((): DetectiveTextualState => {
    return {
      discoveredEvidence: progress.discoveredEvidence,
      connections: progress.connections,
      hypotheses: progress.hypotheses,
      hintsUsed: progress.hintsUsed,
      timeSpent: progress.timeSpent,
      score: progress.score,
    };
  }, [progress]);

  // Populate actionsRef for parent component control
  useEffect(() => {
    if (actionsRef) {
      actionsRef.current = {
        getState,
        reset: handleReset,
        validate: handleSubmitSolution,
        discoverEvidence: handleDiscoverEvidence,
        createConnection: handleCreateConnection,
      };
    }

    return () => {
      if (actionsRef) {
        actionsRef.current = undefined;
      }
    };
  }, [actionsRef, getState, handleReset, handleSubmitSolution, handleDiscoverEvidence, handleCreateConnection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-detective-blue text-detective-xl">Cargando investigación...</div>
      </div>
    );
  }

  if (!investigation) {
    return <div>Error cargando investigación</div>;
  }

  return (
    <>
      {/* Main Exercise Content */}
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Exercise Description */}
          <div className="bg-gradient-to-r from-detective-blue to-detective-orange rounded-detective p-6 text-white shadow-detective-lg">
            <div className="flex items-center gap-3 mb-2">
              <Search className="w-8 h-8" />
              <h2 className="text-detective-2xl font-bold">{investigation.title}</h2>
            </div>
            <p className="text-detective-base opacity-90 mb-4">{investigation.description}</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <p className="font-medium text-gray-900">Misterio a resolver:</p>
              <p className="text-detective-base text-gray-900">{investigation.mystery}</p>
            </div>
          </div>

          {/* Evidence Board */}
          <EvidenceBoard
            evidence={investigation.availableEvidence}
            connections={progress.connections}
            onCreateConnection={handleCreateConnection}
            onRemoveConnection={handleRemoveConnection}
          />

          {/* Magnifying Glass Tool */}
          {selectedEvidence && (
            <MagnifyingGlass text={selectedEvidence.content} />
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
            if (feedback.type === 'success' && onComplete) {
              onComplete(progress.score, progress.timeSpent);
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

export default DetectiveTextualExercise;
