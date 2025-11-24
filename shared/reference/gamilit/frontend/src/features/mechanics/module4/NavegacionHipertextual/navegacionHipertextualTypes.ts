import { BaseExercise, DifficultyLevel } from '@shared/components/mechanics/mechanicsTypes';

export interface HypertextNode {
  id: string;
  title: string;
  content: string;
  links: { targetId: string; label: string }[];
}

export interface NavegacionHipertextualData extends BaseExercise {
  nodes: HypertextNode[];
  startNodeId: string;
  targetNodeId: string;
}

export interface NavegacionHipertextualState {
  currentNodeId: string;
  visitedNodes: string[];
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise Actions Interface for Parent Control
export interface NavegacionHipertextualActions {
  getState: () => NavegacionHipertextualState & { score: number; timeSpent: number; hintsUsed: number };
  reset: () => void;
  validate: () => Promise<void>;
  navigateToNode?: (nodeId: string) => void;
}

export interface NavegacionHipertextualExerciseProps {
  moduleId?: number;
  lessonId?: number;
  exerciseId?: string;
  userId?: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: NavegacionHipertextualState;
  difficulty?: DifficultyLevel;
  exercise?: NavegacionHipertextualData;
  actionsRef?: React.MutableRefObject<NavegacionHipertextualActions | undefined>;
}

// Alias for generic import
export type ExerciseProps = NavegacionHipertextualExerciseProps;
