/**
 * ExerciseHeader Component
 *
 * ISSUE: #4 (P0) - Exercise Interfaces
 * FECHA: 2025-11-04
 * SPRINT: Sprint 1
 *
 * Header section for exercises showing title, difficulty, rewards
 */

import React from 'react';
import { Zap, Coins, Clock, AlertCircle } from 'lucide-react';
import type { Exercise } from '../types/exercise.types';

interface ExerciseHeaderProps {
  exercise: Exercise;
  attemptNumber?: number;
  formattedTime?: string;
  showTimer?: boolean;
  isTimeExpired?: boolean;
}

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-800 border-green-200',
  elementary: 'bg-green-100 text-green-800 border-green-200',
  pre_intermediate: 'bg-blue-100 text-blue-800 border-blue-200',
  intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  upper_intermediate: 'bg-orange-100 text-orange-800 border-orange-200',
  advanced: 'bg-orange-100 text-orange-800 border-orange-200',
  proficient: 'bg-red-100 text-red-800 border-red-200',
  native: 'bg-purple-100 text-purple-800 border-purple-200',
};

const DIFFICULTY_LABELS = {
  beginner: 'Principiante (A1)',
  elementary: 'Elemental (A2)',
  pre_intermediate: 'Pre-Intermedio (B1)',
  intermediate: 'Intermedio (B2)',
  upper_intermediate: 'Intermedio Avanzado (C1)',
  advanced: 'Avanzado (C2)',
  proficient: 'Competente (C2+)',
  native: 'Nativo',
};

export const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  exercise,
  attemptNumber = 1,
  formattedTime,
  showTimer = false,
  isTimeExpired = false,
}) => {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
      {/* Top row: Title and difficulty */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {exercise.title}
          </h1>
          {exercise.description && (
            <p className="text-gray-600">{exercise.description}</p>
          )}
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            DIFFICULTY_COLORS[exercise.difficulty]
          }`}
        >
          {DIFFICULTY_LABELS[exercise.difficulty]}
        </span>
      </div>

      {/* Instructions */}
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">
              Instrucciones
            </h3>
            <p className="text-sm text-blue-800">{exercise.instructions}</p>
          </div>
        </div>
      </div>

      {/* Bottom row: Stats and rewards */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          {/* XP Reward */}
          <span className="flex items-center text-purple-600 font-semibold">
            <Zap className="w-4 h-4 mr-1" />
            +{exercise.xp_reward} XP
          </span>

          {/* ML Coins Reward */}
          <span className="flex items-center text-yellow-600 font-semibold">
            <Coins className="w-4 h-4 mr-1" />
            +{exercise.ml_coins_reward} ML Coins
          </span>

          {/* Attempt Number */}
          {attemptNumber > 1 && (
            <span className="text-gray-600">
              Intento #{attemptNumber}
            </span>
          )}
        </div>

        {/* Timer */}
        {showTimer && formattedTime && (
          <div
            className={`flex items-center font-mono font-semibold ${
              isTimeExpired ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            <Clock className="w-4 h-4 mr-1" />
            {formattedTime}
          </div>
        )}
      </div>
    </div>
  );
};
