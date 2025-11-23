/**
 * SeasonSelector Component
 * Time period selector for leaderboard data
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, TrendingUp, Trophy } from 'lucide-react';
import type { TimePeriod } from '../../types/leaderboardsTypes';

interface SeasonSelectorProps {
  selectedPeriod: TimePeriod;
  onPeriodChange: (period: TimePeriod) => void;
}

const periods: { value: TimePeriod; label: string; icon: React.ElementType }[] = [
  { value: 'daily', label: 'Hoy', icon: Clock },
  { value: 'weekly', label: 'Semana', icon: Calendar },
  { value: 'monthly', label: 'Mes', icon: TrendingUp },
  { value: 'all-time', label: 'Historico', icon: Trophy },
];

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {periods.map((period) => {
        const Icon = period.icon;
        const isActive = selectedPeriod === period.value;

        return (
          <motion.button
            key={period.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPeriodChange(period.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
              isActive
                ? 'bg-gradient-to-r from-detective-blue to-detective-blue-dark text-white shadow-md'
                : 'bg-white text-detective-text hover:bg-detective-bg shadow-sm'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{period.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
