import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface MatchingCard {
  id: string;
  content: string;
  matchId: string;
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

export interface EmparejamientoData extends BaseExercise {
  cards: MatchingCard[];
}
