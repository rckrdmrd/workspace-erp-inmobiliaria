import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface CrucigramaCell {
  row: number;
  col: number;
  letter: string;
  isBlack: boolean;
  number?: number;
  numbers?: number[]; // Support multiple clue numbers in same cell
  userInput?: string;
}

/**
 * ⚠️ FE-059: answer field is NEVER sent by backend (sanitized for security)
 */
export interface CrucigramaClue {
  id: string;
  number: number;
  direction: 'horizontal' | 'vertical';
  clue: string;
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  answer?: never;
  startRow: number;
  startCol: number;
}

export interface CrucigramaData extends BaseExercise {
  grid: CrucigramaCell[][];
  clues: CrucigramaClue[];
  rows: number;
  cols: number;
}

export interface CrucigramaProgress {
  exerciseId: string;
  grid: CrucigramaCell[][];
  completedClues: Set<string>;
  startTime: Date;
  hintsUsed: number;
}
