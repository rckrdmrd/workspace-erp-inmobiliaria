import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface MemeAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  category: 'texto' | 'contexto' | 'humor' | 'critica';
}

export interface AnalisisMemesData extends BaseExercise {
  memeUrl: string;
  memeTitle: string;
  expectedAnnotations: MemeAnnotation[];
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface AnalisisMemesState {
  annotations: MemeAnnotation[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface AnalisisMemesActions {
  getState: () => AnalisisMemesState;
  reset: () => void;
  validate: () => Promise<void>;
  addAnnotation?: (annotation: MemeAnnotation) => void;
}

// Standardized Exercise Props Interface
export interface AnalisisMemesExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<AnalisisMemesState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<AnalisisMemesActions | undefined>;
}
