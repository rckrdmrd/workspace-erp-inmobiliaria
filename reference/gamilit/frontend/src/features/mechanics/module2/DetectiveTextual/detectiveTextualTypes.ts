/**
 * Detective Textual Types
 * Investigation interface with evidence board and AI hints
 */

export interface Evidence {
  id: string;
  type: 'document' | 'letter' | 'photo' | 'note' | 'artifact';
  title: string;
  content: string;
  date?: string;
  imageUrl?: string;
  discovered: boolean;
  relevance: number;
}

/**
 * ⚠️ FE-059: isCorrect is NEVER sent by backend (sanitized for security)
 */
export interface EvidenceConnection {
  id: string;
  fromEvidenceId: string;
  toEvidenceId: string;
  relationship: string;
  userCreated: boolean;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  isCorrect?: never;
}

/**
 * ⚠️ FE-059: correctConnections is NEVER sent by backend (sanitized for security)
 */
export interface Investigation {
  id: string;
  title: string;
  description: string;
  mystery: string;
  availableEvidence: Evidence[];
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  correctConnections?: never;
  difficulty: 'facil' | 'medio' | 'dificil' | 'experto';
}

export interface DetectiveProgress {
  investigationId: string;
  discoveredEvidence: string[];
  connections: EvidenceConnection[];
  hypotheses: string[];
  hintsUsed: number;
  timeSpent: number;
  score: number;
}

export interface MagnifyingGlassState {
  active: boolean;
  position: { x: number; y: number };
  zoomLevel: number;
  focusedText?: string;
}

export interface AIHint {
  id: string;
  type: 'connection' | 'evidence' | 'analysis';
  message: string;
  cost: number;
  revealed: boolean;
}

// Exercise State for auto-save
export interface DetectiveTextualState {
  discoveredEvidence: string[];
  connections: EvidenceConnection[];
  hypotheses: string[];
  hintsUsed: number;
  timeSpent: number;
  score: number;
}

// Exercise Actions Interface for Parent Control
export interface DetectiveTextualActions {
  getState: () => DetectiveTextualState;
  reset: () => void;
  validate: () => Promise<void>;
  discoverEvidence?: (evidenceId: string) => void;
  createConnection?: (fromId: string, toId: string, relationship: string) => Promise<void>;
}

// Exercise Progress Update Interface
export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Standardized Exercise Props Interface (Module 1 Pattern)
export interface DetectiveTextualExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<DetectiveProgress>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<DetectiveTextualActions | undefined>;
}
