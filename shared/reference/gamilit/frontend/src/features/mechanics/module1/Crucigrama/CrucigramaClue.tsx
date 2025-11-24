import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';
import { CrucigramaClue as CrucigramaClueType } from './crucigramaTypes';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { cn } from '@shared/utils/cn';

export interface CrucigramaClueProps {
  clues: CrucigramaClueType[];
  completedClues: Set<string>;
  direction?: 'horizontal' | 'vertical' | 'all';
}

export const CrucigramaClue: React.FC<CrucigramaClueProps> = ({
  clues,
  completedClues,
  direction = 'all'
}) => {
  // Filter clues based on direction
  const getFilteredClues = () => {
    if (direction === 'all') {
      return {
        horizontal: clues.filter((c) => c.direction === 'horizontal'),
        vertical: clues.filter((c) => c.direction === 'vertical')
      };
    }
    return {
      [direction]: clues.filter((c) => c.direction === direction)
    };
  };

  const filteredClues = getFilteredClues();

  // Single direction mode (legacy)
  if (direction !== 'all') {
    const directionClues = filteredClues[direction] || [];
    return (
      <DetectiveCard variant="default" padding="md" className="h-full">
        <h3 className="text-lg font-bold mb-4 text-detective-text capitalize">
          {direction === 'horizontal' ? 'Horizontales' : 'Verticales'}
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {directionClues.map((clue, index) => {
            const isCompleted = completedClues.has(clue.id);
            return (
              <motion.div
                key={clue.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  'flex items-start gap-3 p-3 rounded-lg transition-colors',
                  isCompleted ? 'bg-green-50' : 'bg-gray-50'
                )}
              >
                <div className="flex-shrink-0 pt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <span className="font-bold text-detective-orange mr-2">
                    {clue.number}.
                  </span>
                  <span className={cn(
                    'text-sm',
                    isCompleted ? 'text-green-700 line-through' : 'text-detective-text'
                  )}>
                    {clue.clue}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DetectiveCard>
    );
  }

  // Unified mode (all clues in one card)
  return (
    <DetectiveCard variant="default" padding="md" className="h-full">
      <h3 className="text-lg font-bold mb-4 text-detective-text">
        Pistas del Crucigrama
      </h3>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {/* Horizontales */}
        {filteredClues.horizontal && filteredClues.horizontal.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2 text-detective-orange">
              Horizontales
            </h4>
            <div className="space-y-2">
              {filteredClues.horizontal.map((clue, index) => {
                const isCompleted = completedClues.has(clue.id);
                return (
                  <motion.div
                    key={clue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-start gap-3 p-2 rounded-lg transition-colors',
                      isCompleted ? 'bg-green-50' : 'bg-gray-50'
                    )}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-detective-orange mr-2">
                        {clue.number}.
                      </span>
                      <span className={cn(
                        'text-sm',
                        isCompleted ? 'text-green-700 line-through' : 'text-detective-text'
                      )}>
                        {clue.clue}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Verticales */}
        {filteredClues.vertical && filteredClues.vertical.length > 0 && (
          <div>
            <h4 className="text-md font-semibold mb-2 text-detective-orange">
              Verticales
            </h4>
            <div className="space-y-2">
              {filteredClues.vertical.map((clue, index) => {
                const isCompleted = completedClues.has(clue.id);
                return (
                  <motion.div
                    key={clue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'flex items-start gap-3 p-2 rounded-lg transition-colors',
                      isCompleted ? 'bg-green-50' : 'bg-gray-50'
                    )}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-bold text-detective-orange mr-2">
                        {clue.number}.
                      </span>
                      <span className={cn(
                        'text-sm',
                        isCompleted ? 'text-green-700 line-through' : 'text-detective-text'
                      )}>
                        {clue.clue}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DetectiveCard>
  );
};
