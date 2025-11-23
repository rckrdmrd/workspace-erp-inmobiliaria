/**
 * LeaderboardTabs Component
 * Tab navigation for different leaderboard types
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, School, Users, GraduationCap } from 'lucide-react';
import type { LeaderboardType } from '../../types/leaderboardsTypes';

interface LeaderboardTabsProps {
  selectedType: LeaderboardType;
  onTypeChange: (type: LeaderboardType) => void;
}

const tabs: { type: LeaderboardType; label: string; icon: React.ElementType }[] = [
  { type: 'global', label: 'Global', icon: Globe },
  { type: 'school', label: 'Escuela', icon: School },
  { type: 'grade', label: 'Grado', icon: GraduationCap },
  { type: 'friends', label: 'Amigos', icon: Users },
];

export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({ selectedType, onTypeChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = selectedType === tab.type;

        return (
          <motion.button
            key={tab.type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTypeChange(tab.type)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-detective-orange text-white shadow-orange'
                : 'bg-white text-detective-text hover:bg-detective-bg shadow-card'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};
