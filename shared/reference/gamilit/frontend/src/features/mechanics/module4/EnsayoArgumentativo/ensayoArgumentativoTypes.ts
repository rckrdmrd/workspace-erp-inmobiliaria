import { DifficultyLevel } from '@shared/components/mechanics/mechanicsTypes';

export interface EssaySection {
  title: string;
  content: string;
  wordCount: number;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface EnsayoArgumentativoState {
  topic: string;
  thesis: string;
  introduction: string;
  argument1: string;
  argument2: string;
  argument3: string;
  conclusion: string;
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface EnsayoArgumentativoActions {
  getState: () => EnsayoArgumentativoState;
  reset: () => void;
  validate: () => Promise<void>;
  saveSection?: (section: keyof EnsayoArgumentativoState, content: string) => void;
}

// Standardized Exercise Props Interface
export interface EnsayoArgumentativoExerciseProps {
  moduleId?: number;
  lessonId?: number;
  exerciseId?: string;
  userId?: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<EnsayoArgumentativoState>;
  difficulty?: DifficultyLevel;
  actionsRef?: React.MutableRefObject<EnsayoArgumentativoActions | undefined>;
}
