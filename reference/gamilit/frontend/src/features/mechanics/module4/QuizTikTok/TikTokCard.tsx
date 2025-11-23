import React from 'react';
import { motion } from 'framer-motion';
import { TikTokQuestion } from './quizTikTokTypes';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';

export const TikTokCard: React.FC<{ question: TikTokQuestion; onAnswer: (idx: number) => void; selectedAnswer?: number }> = ({ question, onAnswer, selectedAnswer }) => (
  <motion.div
    initial={{ y: window.innerHeight }}
    animate={{ y: 0 }}
    exit={{ y: -window.innerHeight }}
    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
    className="absolute inset-0 flex flex-col items-center justify-center p-8"
    style={{ backgroundColor: question.backgroundColor || '#1f2937' }}
  >
    <h2 className="text-2xl font-bold text-white text-center mb-8">{question.question}</h2>
    <div className="space-y-4 w-full">
      {question.options.map((option, idx) => (
        <DetectiveButton
          key={idx}
          variant={selectedAnswer === idx ? 'gold' : 'primary'}
          onClick={() => onAnswer(idx)}
          className="w-full py-4 text-lg"
        >
          {option}
        </DetectiveButton>
      ))}
    </div>
  </motion.div>
);
