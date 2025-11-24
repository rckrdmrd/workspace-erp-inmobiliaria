/**
 * Progress Tracker Component
 * Shows progress through exercise steps
 *
 * TODO: Stub component - needs full implementation
 */

import React from 'react';
import { Check } from 'lucide-react';

/**
 * Props for ProgressTracker component
 * @property currentStep - Current step number (1-indexed)
 * @property totalSteps - Total number of steps
 * @property stepLabels - Optional labels for each step
 * @property variant - Optional visual variant (e.g., 'tiktok', 'default')
 */
export interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
  variant?: string;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
}) => {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isCompleted = step <= currentStep;
          const isCurrent = step === currentStep;

          return (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              {stepLabels && stepLabels[i] && (
                <span className="text-xs text-gray-600 mt-1">
                  {stepLabels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
