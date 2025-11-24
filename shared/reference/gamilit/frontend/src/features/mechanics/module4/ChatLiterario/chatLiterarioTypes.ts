import { BaseExercise, DifficultyLevel } from '@shared/components/mechanics/mechanicsTypes';

export interface Message {
  id: string;
  sender: 'user' | 'marie' | 'pierre';
  text: string;
  timestamp: Date;
}

export interface ChatLiterarioData extends BaseExercise {
  characters: {
    id: string;
    name: string;
    description: string;
    responses: string[];
  }[];
  minMessages: number;
  timeLimit?: number; // seconds
}

export interface ChatLiterarioState {
  messages: Message[];
  activeCharacter: 'marie' | 'pierre';
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise Actions Interface for Parent Control
export interface ChatLiterarioActions {
  getState: () => ChatLiterarioState & { score: number; timeSpent: number; hintsUsed: number };
  reset: () => void;
  validate: () => Promise<void>;
  sendMessage?: (message: string) => Promise<void>;
  switchCharacter?: (character: 'marie' | 'pierre') => void;
}

export interface ChatLiterarioExerciseProps {
  moduleId?: number;
  lessonId?: number;
  exerciseId?: string;
  userId?: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: ChatLiterarioState;
  difficulty?: DifficultyLevel;
  exercise?: ChatLiterarioData;
  actionsRef?: React.MutableRefObject<ChatLiterarioActions | undefined>;
}

// Alias for generic import
export type ExerciseProps = ChatLiterarioExerciseProps;
