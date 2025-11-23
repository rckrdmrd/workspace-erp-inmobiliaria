/**
 * LeaderboardFilters Component
 *
 * Advanced filtering options for leaderboard display
 * Features:
 * - Time period selector (All Time, Month, Week, Today)
 * - Metric selector (XP, Level, ML Coins, Achievements)
 * - User search
 * - Export button (CSV/PDF)
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  TrendingUp,
  Search,
  Download,
  X,
  Clock,
  Zap,
  Coins,
  Award,
  BarChart,
  Filter
} from 'lucide-react';
import { cn } from '@shared/utils/cn';

export type TimePeriod = 'all_time' | 'month' | 'week' | 'today';
export type Metric = 'xp' | 'level' | 'ml_coins' | 'achievements';

interface LeaderboardFiltersProps {
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  metric: Metric;
  onMetricChange: (metric: Metric) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onExport?: (format: 'csv' | 'pdf') => void;
  className?: string;
}

interface FilterOption<T> {
  value: T;
  label: string;
  icon: React.ElementType;
  description: string;
}

const timePeriodOptions: FilterOption<TimePeriod>[] = [
  {
    value: 'all_time',
    label: 'Todo el Tiempo',
    icon: Clock,
    description: 'Desde el inicio'
  },
  {
    value: 'month',
    label: 'Este Mes',
    icon: Calendar,
    description: 'Últimos 30 días'
  },
  {
    value: 'week',
    label: 'Esta Semana',
    icon: TrendingUp,
    description: 'Últimos 7 días'
  },
  {
    value: 'today',
    label: 'Hoy',
    icon: Zap,
    description: 'Solo hoy'
  },
];

const metricOptions: FilterOption<Metric>[] = [
  {
    value: 'xp',
    label: 'XP',
    icon: Zap,
    description: 'Ordenar por Experiencia'
  },
  {
    value: 'level',
    label: 'Nivel',
    icon: BarChart,
    description: 'Ordenar por Nivel'
  },
  {
    value: 'ml_coins',
    label: 'ML Coins',
    icon: Coins,
    description: 'Ordenar por Monedas'
  },
  {
    value: 'achievements',
    label: 'Logros',
    icon: Award,
    description: 'Ordenar por Logros'
  },
];

export const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  timePeriod,
  onTimePeriodChange,
  metric,
  onMetricChange,
  searchQuery,
  onSearchChange,
  onExport,
  className
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleExport = (format: 'csv' | 'pdf') => {
    onExport?.(format);
    setShowExportMenu(false);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Filters Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Time Period Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-detective-text mb-2">
            Período de Tiempo
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {timePeriodOptions.map((option) => {
              const Icon = option.icon;
              const isActive = timePeriod === option.value;

              return (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onTimePeriodChange(option.value)}
                  title={option.description}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-detective-orange text-white shadow-md'
                      : 'bg-white text-detective-text hover:bg-detective-bg border border-gray-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Metric Selector */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-detective-text mb-2">
            Métrica
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {metricOptions.map((option) => {
              const Icon = option.icon;
              const isActive = metric === option.value;

              return (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMetricChange(option.value)}
                  title={option.description}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all',
                    isActive
                      ? 'bg-detective-blue text-white shadow-md'
                      : 'bg-white text-detective-text hover:bg-detective-bg border border-gray-200'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{option.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search and Export Bar */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search Input */}
        <motion.div
          animate={{
            scale: isSearchFocused ? 1.02 : 1,
          }}
          className="flex-1 min-w-[250px] relative"
        >
          <div
            className={cn(
              'relative flex items-center bg-white rounded-lg border-2 transition-all',
              isSearchFocused
                ? 'border-detective-orange shadow-md'
                : 'border-gray-200'
            )}
          >
            <Search className="absolute left-3 w-5 h-5 text-detective-text-secondary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Buscar usuario..."
              className="w-full pl-10 pr-10 py-2.5 bg-transparent outline-none text-detective-text placeholder-detective-text-secondary"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                onClick={() => onSearchChange('')}
                className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-detective-text-secondary" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Export Button */}
        {onExport && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-detective-blue text-white rounded-lg font-semibold hover:bg-detective-blue-dark transition-colors shadow-md"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline">Exportar</span>
            </motion.button>

            {/* Export Menu */}
            {showExportMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
              >
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-detective-bg transition-colors text-left"
                >
                  <Download className="w-4 h-4 text-detective-orange" />
                  <div>
                    <div className="font-semibold text-detective-text">CSV</div>
                    <div className="text-xs text-detective-text-secondary">Formato de hoja de cálculo</div>
                  </div>
                </button>

                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-detective-bg transition-colors text-left border-t border-gray-100"
                >
                  <Download className="w-4 h-4 text-detective-orange" />
                  <div>
                    <div className="font-semibold text-detective-text">PDF</div>
                    <div className="text-xs text-detective-text-secondary">Documento portátil</div>
                  </div>
                </button>
              </motion.div>
            )}
          </div>
        )}

        {/* Active Filters Indicator */}
        {(searchQuery || timePeriod !== 'all_time' || metric !== 'xp') && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 px-3 py-2 bg-detective-orange/10 rounded-lg text-detective-orange text-sm font-semibold"
          >
            <Filter className="w-4 h-4" />
            <span>
              {searchQuery ? '1' : '0'}
              {' + '}
              {(timePeriod !== 'all_time' ? 1 : 0) + (metric !== 'xp' ? 1 : 0)}
              {' filtros activos'}
            </span>
          </motion.div>
        )}
      </div>

      {/* Clear All Filters */}
      {(searchQuery || timePeriod !== 'all_time' || metric !== 'xp') && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => {
            onSearchChange('');
            onTimePeriodChange('all_time');
            onMetricChange('xp');
          }}
          className="text-sm text-detective-orange hover:text-detective-orange-dark font-semibold transition-colors"
        >
          Limpiar todos los filtros
        </motion.button>
      )}
    </div>
  );
};
