import React, { useState, useEffect } from 'react';
import { BookOpen, Navigation, CheckCircle } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { FeedbackModal } from '@shared/components/mechanics/FeedbackModal';
import { HypertextDocument } from './HypertextDocument';
import { NavigationBreadcrumbs } from './NavigationBreadcrumbs';
import { ExerciseProps, HypertextNode } from './navegacionHipertextualTypes';
import { FeedbackData, normalizeProgressUpdate } from '@shared/components/mechanics/mechanicsTypes';
import { saveProgress as saveProgressUtil } from '@/shared/utils/storage';

export const NavegacionHipertextualExercise: React.FC<ExerciseProps> = ({
  exerciseId,
  onComplete,
  onProgressUpdate,
  initialData,
  exercise,
}) => {
  // State management
  const [currentNodeId, setCurrentNodeId] = useState(initialData?.currentNodeId || exercise?.startNodeId || '');
  const [visitedNodes, setVisitedNodes] = useState<string[]>(initialData?.visitedNodes || [exercise?.startNodeId || '']);
  const [startTime] = useState(new Date());
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);

  const currentNode = exercise?.nodes.find((n: HypertextNode) => n.id === currentNodeId);

  // Calculate progress
  const calculateProgress = () => {
    if (!exercise) return 0;
    const uniqueVisited = new Set(visitedNodes).size;
    const totalNodes = exercise.nodes.length;
    return Math.round((uniqueVisited / totalNodes) * 100);
  };

  // Calculate score
  const calculateScore = () => {
    if (!exercise) return 0;
    const uniqueVisited = new Set(visitedNodes).size;
    const totalNodes = exercise.nodes.length;
    const targetReached = visitedNodes.includes(exercise.targetNodeId);
    const explorationScore = (uniqueVisited / totalNodes) * 60;
    const targetScore = targetReached ? 40 : 0;
    return Math.round(explorationScore + targetScore);
  };

  // Progress tracking
  useEffect(() => {
    const progress = calculateProgress();
    onProgressUpdate?.(
      normalizeProgressUpdate(progress, visitedNodes.length, exercise.nodes.length, 0, 0)
    );
  }, [visitedNodes]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      const currentState = {
        currentNodeId,
        visitedNodes,
      };
      saveProgressUtil(exerciseId, currentState);
    }, 30000); // Every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [currentNodeId, visitedNodes, exerciseId]);

  // Handle link navigation
  const handleLinkClick = (targetId: string) => {
    setCurrentNodeId(targetId);
    setVisitedNodes(prev => [...prev, targetId]);

    if (targetId === exercise?.targetNodeId) {
      // Target reached, show success after delay
      setTimeout(() => {
        handleCheck();
      }, 500);
    }
  };

  // Check/Verify handler
  const handleCheck = () => {
    if (!exercise) return;

    const score = calculateScore();
    const timeSpent = Math.floor(
      (new Date().getTime() - startTime.getTime()) / 1000
    );
    const uniqueVisited = new Set(visitedNodes).size;
    const targetReached = visitedNodes.includes(exercise.targetNodeId);

    if (!targetReached) {
      setFeedback({
        type: 'info',
        title: 'Objetivo no alcanzado',
        message: `Has visitado ${uniqueVisited} de ${exercise.nodes.length} nodos. Continúa navegando hasta encontrar el objetivo.`,
      });
      setShowFeedback(true);
      return;
    }

    setFeedback({
      type: 'success',
      title: '¡Objetivo Alcanzado!',
      message: `¡Excelente navegación! Has explorado el hipertexto y encontrado el destino.`,
      score: score,
      showConfetti: true,
    });
    setShowFeedback(true);
  };

  if (!exercise) {
    return (
      <DetectiveCard variant="default" padding="lg">
        <p className="text-detective-text">Cargando ejercicio...</p>
      </DetectiveCard>
    );
  }

  return (
    <>
      <DetectiveCard variant="default" padding="lg">
        <div className="space-y-6">
          {/* Exercise Description */}
          <div className="bg-gradient-to-r from-detective-blue to-detective-orange rounded-detective p-6 text-white shadow-detective-lg">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-8 h-8" />
              <h2 className="text-detective-2xl font-bold">Navegación Hipertextual</h2>
            </div>
            <p className="text-detective-base opacity-90">
              Explora el hipertexto navegando entre nodos hasta encontrar el objetivo.
            </p>
          </div>

          {/* Breadcrumbs */}
          <DetectiveCard variant="default" padding="md">
            <div className="flex items-center gap-2 mb-2">
              <Navigation className="w-5 h-5 text-detective-orange" />
              <h3 className="font-bold text-detective-text">Ruta de Navegación</h3>
            </div>
            <NavigationBreadcrumbs visitedNodes={visitedNodes} nodes={exercise.nodes} />
          </DetectiveCard>

          {/* Document */}
          <DetectiveCard variant="default" padding="lg">
            {currentNode && <HypertextDocument node={currentNode} onLinkClick={handleLinkClick} />}
          </DetectiveCard>

          {/* Progress Info */}
          <DetectiveCard variant="default" padding="md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-detective-text-secondary text-sm">Nodos visitados</p>
                <p className="text-2xl font-bold text-detective-text">
                  {new Set(visitedNodes).size} / {exercise.nodes.length}
                </p>
              </div>
              {visitedNodes.includes(exercise.targetNodeId) && (
                <div className="flex items-center gap-2 text-detective-success">
                  <CheckCircle className="w-6 h-6" />
                  <span className="font-medium">Objetivo alcanzado</span>
                </div>
              )}
            </div>
          </DetectiveCard>
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
              const timeSpent = Math.floor(
                (new Date().getTime() - startTime.getTime()) / 1000
              );
              onComplete(calculateScore(), timeSpent);
            }
          }}
          onRetry={() => {
            setShowFeedback(false);
          }}
        />
      )}
    </>
  );
};
