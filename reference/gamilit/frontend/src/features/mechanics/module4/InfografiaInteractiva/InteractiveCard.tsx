import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoCard } from './infografiaInteractivaTypes';
import { Eye, EyeOff } from 'lucide-react';

export const InteractiveCard: React.FC<{ card: InfoCard; onClick: () => void }> = ({ card, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 cursor-pointer min-h-[200px] flex flex-col items-center justify-center text-white"
  >
    <div className="absolute top-2 right-2">
      {card.revealed ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
    </div>
    <h3 className="text-lg font-bold mb-2">{card.title}</h3>
    <AnimatePresence>
      {card.revealed && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-center"
        >
          {card.content}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);
