export interface CriteriaState {
  accuracy: boolean;
  clarity: boolean;
  depth: boolean;
  relevance: boolean;
  sources: boolean;
}

export interface ResenaCriticaState {
  title: string;
  rating: number;
  summary: string;
  analysis: string;
  recommendation: string;
  criteria: CriteriaState;
}

export interface ResenaCriticaData {
  id: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  estimatedTime: number;
  topic: string;
  works: string[];
  minSummaryLength: number;
  minAnalysisLength: number;
  minRecommendationLength: number;
  // Backend returns hints as string[]
  hints?: string[];
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise Actions Interface for Parent Control
export interface ResenaCriticaActions {
  getState: () => ResenaCriticaState & { timeSpent: number; hintsUsed: number };
  reset: () => void;
  validate: () => Promise<void>;
}

export interface ResenaCriticaExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: ResenaCriticaState;
  difficulty?: 'easy' | 'medium' | 'hard';
  exercise?: ResenaCriticaData;
  actionsRef?: React.MutableRefObject<ResenaCriticaActions | undefined>;
}

// Alias for generic import
export type ExerciseProps = ResenaCriticaExerciseProps;
