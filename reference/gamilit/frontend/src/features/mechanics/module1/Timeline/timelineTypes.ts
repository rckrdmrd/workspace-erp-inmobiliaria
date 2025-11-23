import { BaseExercise } from '@shared/components/mechanics/mechanicsTypes';

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
}

/**
 * ⚠️ FE-059: correctOrder is NEVER sent by backend (sanitized for security)
 */
export interface TimelineData extends BaseExercise {
  events: TimelineEvent[];
  /**
   * @deprecated Backend sanitizes this field - never present. Validation is done server-side.
   */
  correctOrder?: never;
}

export interface DraggedEvent extends TimelineEvent {
  position: number;
}
