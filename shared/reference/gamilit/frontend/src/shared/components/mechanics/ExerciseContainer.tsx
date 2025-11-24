/**
 * Exercise Container Component
 * Wrapper component for exercises with common functionality
 *
 * TODO: Stub component - needs full implementation
 */

import React from 'react';
import { BaseExercise } from './mechanicsTypes';

/**
 * Props for ExerciseContainer component
 * @property children - Child components to render inside the container
 * @property title - Optional title to display at the top
 * @property instructions - Optional instructions text
 * @property exercise - Optional exercise data (for future use in enhanced features)
 * @property onComplete - Optional callback when exercise is completed
 * @property className - Optional additional CSS classes
 */
export interface ExerciseContainerProps {
  children: React.ReactNode;
  title?: string;
  instructions?: string;
  exercise?: BaseExercise;
  onComplete?: () => void;
  className?: string;
}

export const ExerciseContainer: React.FC<ExerciseContainerProps> = ({
  children,
  title,
  instructions,
  className = '',
}) => {
  return (
    <div className={`exercise-container bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      )}
      {instructions && (
        <p className="text-gray-600 mb-6">{instructions}</p>
      )}
      <div className="exercise-content">{children}</div>
    </div>
  );
};

export default ExerciseContainer;
