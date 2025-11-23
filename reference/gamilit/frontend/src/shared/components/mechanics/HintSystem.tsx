/**
 * Hint System Component
 * Provides hints for exercises
 *
 * TODO: Stub component - needs full implementation
 */

import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

export interface HintSystemProps {
  hints: string[];
  maxHints?: number;
  onHintUsed?: (hintIndex: number) => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({
  hints,
  maxHints = hints.length,
  onHintUsed,
}) => {
  const [revealedHints, setRevealedHints] = useState<number[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const revealNextHint = (): void => {
    const nextHintIndex = revealedHints.length;
    if (nextHintIndex < Math.min(hints.length, maxHints)) {
      setRevealedHints([...revealedHints, nextHintIndex]);
      onHintUsed?.(nextHintIndex);
      setIsExpanded(true);
    }
  };

  const availableHints = Math.min(hints.length, maxHints);
  const hintsRemaining = availableHints - revealedHints.length;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-yellow-100 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-800">
            Pistas ({revealedHints.length}/{availableHints})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-yellow-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-yellow-600" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="p-3 border-t border-yellow-200">
          {/* Revealed hints */}
          {revealedHints.map((hintIndex) => (
            <div key={hintIndex} className="mb-3 last:mb-0">
              <div className="flex items-start space-x-2">
                <span className="flex-shrink-0 w-6 h-6 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center text-xs font-bold">
                  {hintIndex + 1}
                </span>
                <p className="text-sm text-yellow-900">{hints[hintIndex]}</p>
              </div>
            </div>
          ))}

          {/* Reveal next hint button */}
          {hintsRemaining > 0 && (
            <button
              onClick={revealNextHint}
              className="mt-3 w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-medium rounded-lg transition-colors"
            >
              Revelar siguiente pista ({hintsRemaining} restantes)
            </button>
          )}

          {/* No more hints message */}
          {hintsRemaining === 0 && revealedHints.length > 0 && (
            <p className="text-sm text-yellow-700 italic mt-3">
              No hay más pistas disponibles
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HintSystem;
