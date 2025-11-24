export interface Perspective {
  id: string;
  viewpoint: string;
  arguments: string[];
  counterarguments: string[];
  biases: string[];
}

export interface MatrixExercise {
  id: string;
  topic: string;
  description: string;
  perspectiveCount: number;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface MatrizPerspectivasState {
  perspectives: Perspective[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface MatrizPerspectivasActions {
  getState: () => MatrizPerspectivasState;
  reset: () => void;
  validate: () => Promise<void>;
  addPerspective?: (perspective: Perspective) => void;
}

// Standardized Exercise Props Interface (Module 1 Pattern)
export interface MatrizPerspectivasExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<MatrizPerspectivasState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<MatrizPerspectivasActions | undefined>;
}
