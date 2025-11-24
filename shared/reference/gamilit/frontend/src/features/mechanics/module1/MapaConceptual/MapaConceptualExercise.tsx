import React, { useState, useEffect } from 'react';
import { ExerciseContainer } from '@shared/components/mechanics/ExerciseContainer';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { ConceptNode } from './ConceptNode';
import { ConnectionLine } from './ConnectionLine';
import { MapaConceptualData } from './mapaConceptualTypes';
import { Check } from 'lucide-react';

export interface MapaConceptualExerciseProps {
  exercise: MapaConceptualData;
  onComplete?: () => void;
  onProgressUpdate?: (progress: any) => void;
  actionsRef?: React.MutableRefObject<{
    handleReset?: () => void;
    handleCheck?: () => void;
  }>;
}

export const MapaConceptualExercise: React.FC<MapaConceptualExerciseProps> = ({
  exercise,
  onComplete,
  onProgressUpdate,
  actionsRef
}) => {
  const [connections, setConnections] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [startTime] = useState(new Date());
  const [hintsUsed] = useState(0);

  // Ensure nodes array exists with fallback
  const nodes = exercise?.nodes || [];
  const correctConnections = exercise?.correctConnections || [];

  // FE-055: Notify parent of progress updates WITH user answers
  useEffect(() => {
    if (onProgressUpdate) {
      const correctCount = connections.filter(conn => correctConnections.includes(conn)).length;

      // Send both progress metadata AND user answers
      onProgressUpdate({
        progress: {
          currentStep: correctCount,
          totalSteps: correctConnections.length,
          score: correctConnections.length > 0 ? Math.floor((correctCount / correctConnections.length) * 100) : 0,
          hintsUsed,
          timeSpent: Math.floor((new Date().getTime() - startTime.getTime()) / 1000),
        },
        answers: { connections }
      });

      console.log('📊 [MapaConceptual] Progress update sent:', {
        correctConnections: correctCount,
        totalExpected: correctConnections.length
      });
    }
  }, [connections, hintsUsed, onProgressUpdate, correctConnections, startTime]);

  const handleNodeClick = (nodeId: string) => {
    if (!selectedNode) {
      setSelectedNode(nodeId);
    } else if (selectedNode !== nodeId) {
      const connId = `${selectedNode}-${nodeId}`;
      setConnections(prev => [...prev, connId]);
      setSelectedNode(null);
    }
  };

  // If no nodes, show message
  if (nodes.length === 0) {
    return (
      <ExerciseContainer exercise={exercise}>
        <DetectiveCard variant="default" padding="lg">
          <p className="text-center text-detective-text-secondary">
            Este ejercicio aún no tiene contenido disponible. Por favor, contacta a tu profesor.
          </p>
        </DetectiveCard>
      </ExerciseContainer>
    );
  }

  return (
    <ExerciseContainer exercise={exercise}>
      <DetectiveCard variant="default" padding="lg">
        <div className="relative w-full h-[600px] bg-gray-50 rounded-lg">
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn, i) => {
              const [fromId, toId] = conn.split('-');
              const from = nodes.find(n => n.id === fromId);
              const to = nodes.find(n => n.id === toId);
              return from && to ? <ConnectionLine key={i} from={from} to={to} /> : null;
            })}
          </svg>
          {nodes.map(node => (
            <ConceptNode key={node.id} node={node} isSelected={selectedNode === node.id} onClick={() => handleNodeClick(node.id)} />
          ))}
        </div>
        <DetectiveButton variant="gold" icon={<Check />} className="mt-4">Verificar</DetectiveButton>
      </DetectiveCard>
    </ExerciseContainer>
  );
};

export default MapaConceptualExercise;
