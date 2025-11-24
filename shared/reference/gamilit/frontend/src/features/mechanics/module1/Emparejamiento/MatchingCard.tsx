import React from 'react';
import { motion } from 'framer-motion';
import { MatchingCard as CardType } from './emparejamientoTypes';
import { cn } from '@shared/utils/cn';

export const MatchingCard: React.FC<{ card: CardType; isSelected: boolean; onClick: () => void }> = ({ card, isSelected, onClick }) => (
  <motion.div
    whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
    whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
    onClick={card.isMatched ? undefined : onClick}
    className={cn('p-6 rounded-lg text-center font-semibold cursor-pointer min-h-[120px] flex items-center justify-center',
      card.isMatched ? 'bg-green-100 text-green-800 opacity-50' : isSelected ? 'bg-blue-500 text-white ring-4 ring-blue-300' : card.type === 'question' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
    )}
  >
    {card.content}
  </motion.div>
);
