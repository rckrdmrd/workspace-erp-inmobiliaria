import React from 'react';
import { Globe, School, Users } from 'lucide-react';
import { cn } from '@shared/utils';
import type { LeaderboardType, LEADERBOARD_TYPE_LABELS } from '@/shared/types/leaderboard.types';

/**
 * LeaderboardTabs Props
 */
interface LeaderboardTabsProps {
  activeTab: LeaderboardType;
  onTabChange: (tab: LeaderboardType) => void;
  counts?: {
    global?: number;
    school?: number;
    classroom?: number;
  };
  className?: string;
}

/**
 * Tab configuration
 */
const TABS: Array<{
  type: LeaderboardType;
  label: string;
  icon: React.ReactNode;
}> = [
  {
    type: 'global',
    label: 'Global',
    icon: <Globe className="w-5 h-5" />,
  },
  {
    type: 'school',
    label: 'Escuela',
    icon: <School className="w-5 h-5" />,
  },
  {
    type: 'classroom',
    label: 'Clase',
    icon: <Users className="w-5 h-5" />,
  },
];

/**
 * LeaderboardTabs Component
 *
 * Tab navigation for switching between different leaderboard types.
 *
 * Features:
 * - Three tabs: Global, School, Classroom
 * - Active tab highlighting with underline indicator
 * - Icons for each tab
 * - Optional counts display
 * - Keyboard navigation (Arrow keys, Enter, Space)
 * - Mobile responsive (horizontal scroll if needed)
 * - Smooth animations
 */
export const LeaderboardTabs: React.FC<LeaderboardTabsProps> = ({
  activeTab,
  onTabChange,
  counts,
  className,
}) => {
  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent, tab: LeaderboardType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onTabChange(tab);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      const currentIndex = TABS.findIndex((t) => t.type === activeTab);
      const nextIndex = (currentIndex + 1) % TABS.length;
      onTabChange(TABS[nextIndex].type);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const currentIndex = TABS.findIndex((t) => t.type === activeTab);
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      onTabChange(TABS[prevIndex].type);
    }
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200', className)}>
      {/* Tabs Container */}
      <div className="flex overflow-x-auto scrollbar-hide" role="tablist">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.type;
          const count = counts?.[tab.type];

          return (
            <button
              key={tab.type}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.type}-panel`}
              id={`${tab.type}-tab`}
              onClick={() => onTabChange(tab.type)}
              onKeyDown={(e) => handleKeyDown(e, tab.type)}
              className={cn(
                'flex-1 min-w-[120px] px-6 py-4 flex items-center justify-center space-x-2',
                'font-semibold text-sm transition-all duration-200',
                'border-b-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset',
                isActive
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {/* Icon */}
              <span className={cn('transition-colors', isActive ? 'text-orange-600' : 'text-gray-400')}>
                {tab.icon}
              </span>

              {/* Label */}
              <span>{tab.label}</span>

              {/* Count Badge (optional) */}
              {count !== undefined && count > 0 && (
                <span
                  className={cn(
                    'ml-2 px-2 py-0.5 rounded-full text-xs font-semibold',
                    isActive
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Indicator Line (animated) */}
      <div className="relative">
        <div
          className="absolute bottom-0 h-0.5 bg-orange-600 transition-all duration-300 ease-in-out"
          style={{
            width: `${100 / TABS.length}%`,
            left: `${(TABS.findIndex((t) => t.type === activeTab) * 100) / TABS.length}%`,
          }}
        />
      </div>
    </div>
  );
};

export default LeaderboardTabs;
