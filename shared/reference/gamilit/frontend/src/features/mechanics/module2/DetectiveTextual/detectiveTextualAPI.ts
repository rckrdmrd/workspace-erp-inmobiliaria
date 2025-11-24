/**
 * Detective Textual API - Mock AI service integration
 */

import { generateInferenceSuggestions, generateHint } from '../../shared/aiService';
import type { Investigation, DetectiveProgress, AIHint } from './detectiveTextualTypes';
import { mockInvestigation } from './detectiveTextualMockData';

export const fetchInvestigation = async (id: string): Promise<Investigation> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockInvestigation;
};

// FE-059: Mock validation function - no longer uses correctConnections (sanitized field)
// In real backend integration, validation will be done server-side
export const validateConnection = async (
  fromEvidenceId: string,
  toEvidenceId: string,
  relationship: string
): Promise<{ isCorrect: boolean; feedback: string; score: number }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // FE-059: Removed validation against correctConnections
  // Mock response - all connections accepted for now
  return {
    isCorrect: true, // Mock: accept all connections
    feedback: 'Conexión registrada. La validación final se hará en el servidor.',
    score: 10,
  };
};

export const requestAIHint = async (progress: DetectiveProgress): Promise<AIHint> => {
  const hint = await generateHint('detective', progress.discoveredEvidence.length);

  return {
    id: `hint-${Date.now()}`,
    type: 'connection',
    message: hint,
    cost: 10,
    revealed: true,
  };
};

export const getAIInferences = async (discoveredEvidence: string[]) => {
  return generateInferenceSuggestions(discoveredEvidence);
};

// FE-059: Mock submit function - no longer uses correctConnections (sanitized field)
// In real backend integration, validation will be done server-side
export const submitSolution = async (
  progress: DetectiveProgress
): Promise<{ score: number; feedback: string; completed: boolean }> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // FE-059: Removed validation against correctConnections
  // Mock scoring based on activity level only
  const hasConnections = progress.connections.length > 0;
  const hasDiscoveredEvidence = progress.discoveredEvidence.length > 1;

  return {
    score: 0, // Will be calculated by backend
    feedback: hasConnections && hasDiscoveredEvidence
      ? 'Has completado la investigación. La validación final se procesará en el servidor.'
      : 'Necesitas crear más conexiones entre las evidencias.',
    completed: hasConnections && hasDiscoveredEvidence,
  };
};
