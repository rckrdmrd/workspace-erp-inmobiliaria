/**
 * MissionTabs Component
 *
 * Tab navigation for switching between mission types:
 * - Daily missions
 * - Weekly missions
 * - Special missions
 *
 * Features:
 * - Active tab indicator with animation
 * - Count badges for incomplete missions
 * - Filter by status (All, Active, Completed)
 * - Responsive design
 *
 * ~150 lines
 */

import React from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  CalendarRange,
  Star,
  Filter,
} from 'lucide-react';
import type { MissionType, MissionStatus, Mission } from '../types/missionsTypes';
import { cn } from '@shared/utils/cn';

interface MissionTabsProps {
  currentTab: MissionType;
  onTabChange: (tab: MissionType) => void;
  dailyMissions: Mission[];
  weeklyMissions: Mission[];
  specialMissions: Mission[];
  statusFilter: MissionStatus | 'all';
  onStatusFilterChange: (status: MissionStatus | 'all') => void;
}

export function MissionTabs({
  currentTab,
  onTabChange,
  dailyMissions,
  weeklyMissions,
  specialMissions,
  statusFilter,
  onStatusFilterChange,
}: MissionTabsProps) {
  // Count incomplete missions for badges
  const getIncompletCount = (missions: Mission[]) =>
    missions.filter(m => m.status !== 'claimed').length;

  const tabs = [
    {
      id: 'daily' as MissionType,
      label: 'Diarias',
      icon: Calendar,
      color: 'blue',
      count: getIncompletCount(dailyMissions),
    },
    {
      id: 'weekly' as MissionType,
      label: 'Semanales',
      icon: CalendarRange,
      color: 'purple',
      count: getIncompletCount(weeklyMissions),
    },
    {
      id: 'special' as MissionType,
      label: 'Especiales',
      icon: Star,
      color: 'orange',
      count: getIncompletCount(specialMissions),
    },
  ];

  const statusFilters = [
    { value: 'all' as const, label: 'Todas' },
    { value: 'in_progress' as const, label: 'En Progreso' },
    { value: 'completed' as const, label: 'Completadas' },
    { value: 'claimed' as const, label: 'Reclamadas' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      {/* Main Tabs */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;

            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative flex items-center gap-3 px-6 py-3 rounded-lg font-semibold',
                  'transition-all duration-300',
                  isActive
                    ? `bg-gradient-to-r ${getTabGradient(tab.color)} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>

                {/* Count Badge */}
                {tab.count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'flex items-center justify-center',
                      'min-w-[24px] h-6 px-2',
                      'rounded-full text-xs font-bold',
                      isActive
                        ? 'bg-white/30 text-white'
                        : `bg-${tab.color}-500 text-white`
                    )}
                  >
                    {tab.count}
                  </motion.span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/20 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={statusFilter}
            onChange={e => onStatusFilterChange(e.target.value as MissionStatus | 'all')}
            className={cn(
              'px-4 py-2 rounded-lg',
              'border-2 border-gray-200',
              'focus:border-orange-500 focus:outline-none',
              'bg-white text-gray-700',
              'font-semibold cursor-pointer',
              'transition-colors'
            )}
          >
            {statusFilters.map(filter => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tab Description */}
      <motion.div
        key={currentTab}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-gray-600"
      >
        {currentTab === 'daily' && (
          <p>
            <span className="font-semibold text-blue-600">Misiones Diarias:</span> Nuevas
            misiones cada día. ¡Completa todas para obtener un bonus especial!
          </p>
        )}
        {currentTab === 'weekly' && (
          <p>
            <span className="font-semibold text-purple-600">Misiones Semanales:</span>{' '}
            Desafíos que se renuevan cada semana. Más difíciles, mejores recompensas.
          </p>
        )}
        {currentTab === 'special' && (
          <p>
            <span className="font-semibold text-orange-600">Misiones Especiales:</span>{' '}
            Eventos limitados con recompensas únicas. ¡No las dejes pasar!
          </p>
        )}
      </motion.div>
    </div>
  );
}

/**
 * Helper: Get tab gradient colors
 */
function getTabGradient(color: string): string {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-amber-500',
  };
  return gradients[color] || gradients.blue;
}
