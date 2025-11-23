/**
 * ExerciseFeedback Component
 *
 * ISSUE: #4 (P0) - Exercise Interfaces
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 *
 * Feedback display for exercise results with animations
 */

import React from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, Zap, Coins } from 'lucide-react';
import type { ExerciseFeedback as FeedbackType } from '../types/exercise.types';

interface ExerciseFeedbackProps {
  feedback: FeedbackType;
  explanation?: string;
  onClose?: () => void;
  showActions?: boolean;
}

const FEEDBACK_STYLES = {
  success: {
    container: 'bg-green-50 border-green-200 text-green-900',
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    title: 'text-green-900',
    message: 'text-green-800',
  },
  error: {
    container: 'bg-red-50 border-red-200 text-red-900',
    icon: <XCircle className="w-6 h-6 text-red-600" />,
    title: 'text-red-900',
    message: 'text-red-800',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-900',
    icon: <Info className="w-6 h-6 text-blue-600" />,
    title: 'text-blue-900',
    message: 'text-blue-800',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    icon: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    title: 'text-yellow-900',
    message: 'text-yellow-800',
  },
};

export const ExerciseFeedback: React.FC<ExerciseFeedbackProps> = ({
  feedback,
  explanation,
  onClose,
  showActions = true,
}) => {
  const styles = FEEDBACK_STYLES[feedback.type];

  return (
    <div
      className={`rounded-xl border-2 p-6 ${styles.container} transition-all duration-300 animate-in slide-in-from-bottom-4`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start flex-1">
          <div className="flex-shrink-0">{styles.icon}</div>
          <div className="ml-3 flex-1">
            <h3 className={`text-lg font-bold ${styles.title} mb-1`}>
              {feedback.title}
            </h3>
            <p className={`text-base ${styles.message}`}>{feedback.message}</p>
          </div>
        </div>
      </div>

      {/* Rewards */}
      {(feedback.xpEarned !== undefined || feedback.mlCoinsEarned !== undefined) && (
        <div className="flex items-center gap-4 mb-4 p-3 bg-white bg-opacity-50 rounded-lg">
          {feedback.xpEarned !== undefined && feedback.xpEarned > 0 && (
            <div className="flex items-center text-purple-700 font-semibold">
              <Zap className="w-5 h-5 mr-1" />
              +{feedback.xpEarned} XP
            </div>
          )}
          {feedback.mlCoinsEarned !== undefined && feedback.mlCoinsEarned > 0 && (
            <div className="flex items-center text-yellow-700 font-semibold">
              <Coins className="w-5 h-5 mr-1" />
              +{feedback.mlCoinsEarned} ML Coins
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {explanation && (
        <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">
            Explicación:
          </h4>
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}

      {/* Actions */}
      {showActions && onClose && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              feedback.type === 'success'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-600 hover:bg-gray-700 text-white'
            }`}
          >
            Continuar
          </button>
        </div>
      )}

      {/* Confetti effect for success */}
      {feedback.showConfetti && feedback.type === 'success' && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Simple confetti animation with CSS */}
          <div className="confetti-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`,
                  backgroundColor: ['#10B981', '#667EEA', '#F59E0B', '#EF4444'][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
