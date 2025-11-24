/**
 * Score Display Component
 * Shows current score and progress
 *
 * TODO: Stub component - needs full implementation
 */

import React from 'react';
import { Trophy } from 'lucide-react';

export interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  showPercentage?: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore,
  showPercentage = true,
}) => {
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-lg">
      <Trophy className="w-5 h-5" />
      <div className="flex items-baseline space-x-1">
        <span className="text-lg font-bold">{score}</span>
        <span className="text-sm opacity-80">/ {maxScore}</span>
        {showPercentage && (
          <span className="text-sm opacity-80 ml-2">({percentage}%)</span>
        )}
      </div>
    </div>
  );
};

export default ScoreDisplay;
