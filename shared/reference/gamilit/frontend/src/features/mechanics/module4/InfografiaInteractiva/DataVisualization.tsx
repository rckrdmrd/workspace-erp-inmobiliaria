import React from 'react';
import { motion } from 'framer-motion';
import { InfoCard } from './infografiaInteractivaTypes';
import { ProgressTracker } from '@shared/components/mechanics/ProgressTracker';

export const DataVisualization: React.FC<{ cards: InfoCard[]; onCardClick: (id: string) => void }> = ({ cards, onCardClick }) => {
  const revealedCount = cards.filter(c => c.revealed).length;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-4">Progreso de Exploración</h3>
      <ProgressTracker currentStep={revealedCount} totalSteps={cards.length} />
      <div className="relative w-full h-64 bg-gray-100 rounded-lg mt-4 overflow-hidden">
        {cards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ scale: 0 }}
            animate={{ scale: card.revealed ? 1 : 0.5, opacity: card.revealed ? 1 : 0.3 }}
            style={{ position: 'absolute', left: card.position.x, top: card.position.y }}
            onClick={() => onCardClick(card.id)}
            className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
          >
            {idx + 1}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
