import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '@shared/utils';
import type {
  AchievementFilter as AchievementFilterType,
  AchievementCategory,
  AchievementStatus,
  ACHIEVEMENT_CATEGORY_LABELS,
} from '@/shared/types/achievement.types';

/**
 * AchievementFilter Props
 */
interface AchievementFilterProps {
  currentFilter: AchievementFilterType;
  onFilterChange: (filter: AchievementFilterType) => void;
  className?: string;
}

/**
 * Category options with labels
 */
const CATEGORY_OPTIONS: Array<{ value: AchievementCategory | 'all'; label: string }> = [
  { value: 'all', label: 'Todas' },
  { value: 'progress', label: 'Progreso' },
  { value: 'streak', label: 'Rachas' },
  { value: 'completion', label: 'Completado' },
  { value: 'social', label: 'Social' },
  { value: 'special', label: 'Especial' },
  { value: 'mastery', label: 'Maestría' },
  { value: 'exploration', label: 'Exploración' },
];

/**
 * Status options with labels
 */
const STATUS_OPTIONS: Array<{ value: AchievementStatus | 'all'; label: string }> = [
  { value: 'all', label: 'Todos' },
  { value: 'earned', label: 'Ganados' },
  { value: 'in_progress', label: 'En Progreso' },
  { value: 'locked', label: 'Bloqueados' },
];

/**
 * Sort options
 */
const SORT_OPTIONS: Array<{
  value: 'name' | 'progress' | 'earnedDate' | 'rarity';
  label: string;
}> = [
  { value: 'name', label: 'Nombre' },
  { value: 'progress', label: 'Progreso' },
  { value: 'earnedDate', label: 'Fecha de Obtención' },
  { value: 'rarity', label: 'Rareza' },
];

/**
 * AchievementFilter Component
 *
 * Provides filtering and sorting controls for achievements.
 *
 * Features:
 * - Category filter dropdown
 * - Status filter dropdown
 * - Sort by dropdown
 * - Sort order toggle (asc/desc)
 * - Search input (filter by name/description)
 * - Clear all filters button
 * - Responsive layout (stacks vertically on mobile)
 */
export const AchievementFilter: React.FC<AchievementFilterProps> = ({
  currentFilter,
  onFilterChange,
  className,
}) => {
  const [searchInput, setSearchInput] = React.useState(currentFilter.searchQuery || '');

  /**
   * Handle category change
   */
  const handleCategoryChange = (category: AchievementCategory | 'all') => {
    onFilterChange({
      ...currentFilter,
      category,
    });
  };

  /**
   * Handle status change
   */
  const handleStatusChange = (status: AchievementStatus | 'all') => {
    onFilterChange({
      ...currentFilter,
      status,
    });
  };

  /**
   * Handle sort by change
   */
  const handleSortByChange = (sortBy: 'name' | 'progress' | 'earnedDate' | 'rarity') => {
    onFilterChange({
      ...currentFilter,
      sortBy,
    });
  };

  /**
   * Toggle sort order
   */
  const toggleSortOrder = () => {
    onFilterChange({
      ...currentFilter,
      sortOrder: currentFilter.sortOrder === 'asc' ? 'desc' : 'asc',
    });
  };

  /**
   * Handle search input change (debounced)
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Debounce search query update
    const timeoutId = setTimeout(() => {
      onFilterChange({
        ...currentFilter,
        searchQuery: value,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  /**
   * Clear search
   */
  const clearSearch = () => {
    setSearchInput('');
    onFilterChange({
      ...currentFilter,
      searchQuery: '',
    });
  };

  /**
   * Clear all filters
   */
  const clearAllFilters = () => {
    setSearchInput('');
    onFilterChange({
      category: 'all',
      status: 'all',
      sortBy: 'name',
      sortOrder: 'asc',
      searchQuery: '',
    });
  };

  /**
   * Check if any filters are active
   */
  const hasActiveFilters =
    currentFilter.category !== 'all' ||
    currentFilter.status !== 'all' ||
    currentFilter.searchQuery ||
    currentFilter.sortBy !== 'name' ||
    currentFilter.sortOrder !== 'asc';

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Limpiar Filtros
          </button>
        )}
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            id="category-filter"
            value={currentFilter.category || 'all'}
            onChange={(e) =>
              handleCategoryChange(e.target.value as AchievementCategory | 'all')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="status-filter"
            value={currentFilter.status || 'all'}
            onChange={(e) => handleStatusChange(e.target.value as AchievementStatus | 'all')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700 mb-1">
            Ordenar Por
          </label>
          <select
            id="sort-by"
            value={currentFilter.sortBy || 'name'}
            onChange={(e) =>
              handleSortByChange(e.target.value as 'name' | 'progress' | 'earnedDate' | 'rarity')
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 mb-1">
            Orden
          </label>
          <button
            id="sort-order"
            onClick={toggleSortOrder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left font-medium"
          >
            {currentFilter.sortOrder === 'asc' ? '↑ Ascendente' : '↓ Descendente'}
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="mt-4">
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="search"
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          {searchInput && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Limpiar búsqueda"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AchievementFilter;
