import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface InfoCard {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  icon: string;
  revealed: boolean;
}

export interface InfografiaInteractivaData extends BaseExercise {
  cards: InfoCard[];
  backgroundImage?: string;
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise State for auto-save
export interface InfografiaInteractivaState {
  revealedCards: string[];
  score: number;
  timeSpent: number;
  hintsUsed: number;
}

// Exercise Actions Interface for Parent Control
export interface InfografiaInteractivaActions {
  getState: () => InfografiaInteractivaState;
  reset: () => void;
  validate: () => Promise<void>;
  revealCard?: (cardId: string) => void;
}

// Standardized Exercise Props Interface
export interface InfografiaInteractivaExerciseProps {
  moduleId: number;
  lessonId: number;
  exerciseId: string;
  userId: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: Partial<InfografiaInteractivaState>;
  difficulty?: 'easy' | 'medium' | 'hard';
  actionsRef?: React.MutableRefObject<InfografiaInteractivaActions | undefined>;
}
