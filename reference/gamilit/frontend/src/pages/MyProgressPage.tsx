import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { GamifiedHeader } from '@/shared/components/layout/GamifiedHeader';
import { ProgressCard } from '@/shared/components/ProgressCard';
import { ProgressFilter, ProgressFilterState } from '@/shared/components/ProgressFilter';
import { StatsOverview } from '@/shared/components/StatsOverview';
import { progressApi } from '@/lib/api/progress.api';
import { educationalApi } from '@/lib/api/educational.api';
import type { Module } from '@/shared/types/educational.types';
import type { ModuleProgress, ProgressSummary } from '@/shared/types/progress.types';

/**
 * MyProgressPage Component
 * Main progress page showing all modules with user progress
 *
 * Features:
 * - Progress summary stats
 * - Filter/sort modules
 * - Grid of progress cards
 * - Empty states
 * - Loading states
 * - Error handling
 * - Navigate to module details
 *
 * Data Sources:
 * - getUserProgressSummary: Overall stats
 * - getUserProgress: All module progress
 * - getModules: All modules
 */
export const MyProgressPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [progressList, setProgressList] = useState<ModuleProgress[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [filter, setFilter] = useState<ProgressFilterState>({
    status: 'all',
    difficulty: 'all',
    sortBy: 'progress',
  });

  // Loading states
  const [isLoadingSummary, setIsLoadingSummary] = useState(true);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isLoadingModules, setIsLoadingModules] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Combined loading state
  const isLoading = isLoadingSummary || isLoadingProgress || isLoadingModules;

  // Fetch progress summary
  useEffect(() => {
    const loadSummary = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingSummary(true);
        setError(null);
        const data = await progressApi.getUserProgressSummary(user.id);
        setSummary(data);
      } catch (err) {
        console.error('Failed to load progress summary:', err);
        setError('Failed to load progress summary. Please try again.');
      } finally {
        setIsLoadingSummary(false);
      }
    };

    loadSummary();
  }, [user?.id]);

  // Fetch user progress
  useEffect(() => {
    const loadProgress = async () => {
      if (!user?.id) return;

      try {
        setIsLoadingProgress(true);
        const data = await progressApi.getUserProgress(user.id);
        setProgressList(data);
      } catch (err) {
        console.error('Failed to load user progress:', err);
        setError('Failed to load progress data. Please try again.');
      } finally {
        setIsLoadingProgress(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  // Fetch modules
  useEffect(() => {
    const loadModules = async () => {
      try {
        setIsLoadingModules(true);
        const data = await educationalApi.getModules();
        setModules(data);
      } catch (err) {
        console.error('Failed to load modules:', err);
        setError('Failed to load modules. Please try again.');
      } finally {
        setIsLoadingModules(false);
      }
    };

    loadModules();
  }, []);

  // Combine modules with progress
  const modulesWithProgress = useMemo(() => {
    return modules.map((module) => ({
      module,
      progress: progressList.find((p) => p.module_id === module.id),
    }));
  }, [modules, progressList]);

  // Filter and sort modules
  const filteredModules = useMemo(() => {
    let filtered = [...modulesWithProgress];

    // Filter by status
    if (filter.status !== 'all') {
      filtered = filtered.filter((item) => item.progress?.status === filter.status);
    }

    // Filter by difficulty
    if (filter.difficulty !== 'all') {
      filtered = filtered.filter((item) => item.module.difficulty === filter.difficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filter.sortBy) {
        case 'progress':
          return (
            (b.progress?.progress_percentage || 0) - (a.progress?.progress_percentage || 0)
          );
        case 'name':
          return a.module.title.localeCompare(b.module.title);
        case 'last_accessed':
          const aDate = a.progress?.last_accessed_at
            ? new Date(a.progress.last_accessed_at).getTime()
            : 0;
          const bDate = b.progress?.last_accessed_at
            ? new Date(b.progress.last_accessed_at).getTime()
            : 0;
          return bDate - aDate;
        default:
          return 0;
      }
    });

    return filtered;
  }, [modulesWithProgress, filter]);

  // Handle module click
  const handleModuleClick = (moduleId: string) => {
    navigate(`/progress/modules/${moduleId}`);
  };

  // Retry loading
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <GamifiedHeader user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-600 mt-2">
          Track your learning journey and see how far you've come.
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={handleRetry}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="mb-8">
        {isLoadingSummary ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 animate-pulse">
                <div className="h-10 w-10 bg-gray-200 rounded-lg mb-3" />
                <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                <div className="h-3 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : summary ? (
          <StatsOverview summary={summary} />
        ) : null}
      </div>

      {/* Filters */}
      {!isLoading && modules.length > 0 && (
        <ProgressFilter currentFilter={filter} onFilterChange={setFilter} />
      )}

      {/* Progress List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">All Modules</h2>
          {!isLoading && (
            <span className="text-sm text-gray-600">
              {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'}
            </span>
          )}
        </div>

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-32 bg-gray-200" />
                <div className="p-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
                  <div className="h-2 w-full bg-gray-200 rounded mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-200 rounded" />
                    <div className="h-12 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Progress Cards Grid */}
        {!isLoading && filteredModules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(({ module, progress }) => (
              <ProgressCard
                key={module.id}
                module={module}
                progress={progress}
                onClick={() => handleModuleClick(module.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredModules.length === 0 && modules.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No modules match your current filters. Try adjusting your filter settings.
            </p>
            <button
              onClick={() =>
                setFilter({ status: 'all', difficulty: 'all', sortBy: 'progress' })
              }
              className="mt-4 px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* No Modules Available */}
        {!isLoading && modules.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No modules available</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no learning modules available at the moment. Check back soon!
            </p>
          </div>
        )}
      </div>

      {/* Learning Path Section - Placeholder */}
      {!isLoading && modules.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Recommended Next</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Personalized Recommendations Coming Soon
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {/* TODO: Implement ML-based learning path recommendations */}
                Get AI-powered module recommendations based on your progress and learning style.
              </p>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MyProgressPage;
