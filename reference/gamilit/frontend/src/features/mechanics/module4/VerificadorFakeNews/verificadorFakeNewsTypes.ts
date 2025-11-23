import { BaseExercise, DifficultyLevel } from '@shared/components/mechanics/mechanicsTypes';

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  source: string;
  date: string;
  url?: string;
}

export interface Claim {
  id: string;
  text: string;
  context: string;
  position: {
    start: number;
    end: number;
  };
}

export interface FactCheckResult {
  claimId: string;
  verdict: 'true' | 'false' | 'partially-true' | 'unverified' | 'misleading';
  confidence: number; // 0-1
  sources: SourceReference[];
  explanation: string;
}

export interface SourceReference {
  name: string;
  url: string;
  credibilityScore: number; // 0-100
  type: 'academic' | 'news' | 'government' | 'encyclopedia' | 'other';
}

export interface VerificationSession {
  articleId: string;
  claims: Claim[];
  results: FactCheckResult[];
  startTime: Date;
  endTime?: Date;
  score?: number;
}

export interface VerificadorExercise extends BaseExercise {
  articles: NewsArticle[];
  expectedClaims: Claim[];
  timeLimit?: number; // seconds
}

export interface VerificadorState {
  selectedArticleId: string;
  claims: Claim[];
  results: FactCheckResult[];
}

export interface ExerciseProgressUpdate {
  currentStep: number;
  totalSteps: number;
  score: number;
  hintsUsed: number;
  timeSpent: number;
}

// Exercise Actions Interface for Parent Control
export interface VerificadorFakeNewsActions {
  getState: () => VerificadorState & { score: number; timeSpent: number; hintsUsed: number };
  reset: () => void;
  validate: () => Promise<void>;
  addClaim?: (claim: Claim) => void;
  checkFact?: (claimId: string) => Promise<void>;
}

export interface VerificadorFakeNewsExerciseProps {
  moduleId?: number;
  lessonId?: number;
  exerciseId?: string;
  userId?: string;
  onComplete?: (score: number, timeSpent: number) => void;
  onExit?: () => void;
  onProgressUpdate?: (progress: ExerciseProgressUpdate) => void;
  initialData?: VerificadorState;
  difficulty?: DifficultyLevel;
  exercise?: VerificadorExercise;
  actionsRef?: React.MutableRefObject<VerificadorFakeNewsActions | undefined>;
}

// Alias for generic import
export type ExerciseProps = VerificadorFakeNewsExerciseProps;
