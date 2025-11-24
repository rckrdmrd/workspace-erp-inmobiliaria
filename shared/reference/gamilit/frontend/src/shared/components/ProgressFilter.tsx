import React from 'react';
import { X } from 'lucide-react';

export interface ProgressFilterState {
  status: 'all' | 'not_started' | 'in_progress' | 'completed' | 'mastered';
  difficulty: 'all' | 'beginner' | 'intermediate' | 'advanced';
  sortBy: 'progress' | 'name' | 'last_accessed';
}

interface ProgressFilterProps {
  currentFilter: ProgressFilterState;
  onFilterChange: (filter: ProgressFilterState) => void;
}

/**
 * ProgressFilter Component
 * Filter and sort controls for progress list
 *
 * Features:
 * - Status filter dropdown (all, not_started, in_progress, completed, mastered)
 * - Difficulty filter dropdown (all, beginner, intermediate, advanced)
 * - Sort by dropdown (progress, name, last_accessed)
 * - Clear filters button
 * - Responsive (horizontal on desktop, stacks on mobile)
 *
 * @param currentFilter - Current filter state
 * @param onFilterChange - Callback when filter changes
 */
export const ProgressFilter: React.FC<ProgressFilterProps> = ({
  currentFilter,
  onFilterChange,
}) => {
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilter,
      status: e.target.value as ProgressFilterState['status'],
    });
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilter,
      difficulty: e.target.value as ProgressFilterState['difficulty'],
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      ...currentFilter,
      sortBy: e.target.value as ProgressFilterState['sortBy'],
    });
  };

  const handleClearFilters = () => {
    onFilterChange({
      status: 'all',
      difficulty: 'all',
      sortBy: 'progress',
    });
  };

  const hasActiveFilters =
    currentFilter.status !== 'all' ||
    currentFilter.difficulty !== 'all' ||
    currentFilter.sortBy !== 'progress';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Status Filter */}
          <div className="flex-1 min-w-0">
            <label htmlFor="status-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={currentFilter.status}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="mastered">Mastered</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div className="flex-1 min-w-0">
            <label
              htmlFor="difficulty-filter"
              className="block text-xs font-medium text-gray-700 mb-1"
            >
              Difficulty
            </label>
            <select
              id="difficulty-filter"
              value={currentFilter.difficulty}
              onChange={handleDifficultyChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="all">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex-1 min-w-0">
            <label htmlFor="sort-filter" className="block text-xs font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort-filter"
              value={currentFilter.sortBy}
              onChange={handleSortChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
            >
              <option value="progress">Progress</option>
              <option value="name">Name (A-Z)</option>
              <option value="last_accessed">Recently Accessed</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="
                flex items-center space-x-1 px-3 py-2 text-sm font-medium
                text-gray-700 bg-gray-100 rounded-lg
                hover:bg-gray-200 transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-500
              "
              aria-label="Clear all filters"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* Active Filter Summary (Mobile) */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 sm:hidden">
          <div className="flex flex-wrap gap-2">
            {currentFilter.status !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                Status: {currentFilter.status.replace('_', ' ')}
              </span>
            )}
            {currentFilter.difficulty !== 'all' && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                Level: {currentFilter.difficulty}
              </span>
            )}
            {currentFilter.sortBy !== 'progress' && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded">
                Sort: {currentFilter.sortBy.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressFilter;
