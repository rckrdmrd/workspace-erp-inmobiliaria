/**
 * useAnalytics Hook - Fetch and manage classroom analytics and engagement metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { analyticsApi } from '@services/api/teacher';
import type { ClassroomAnalytics, EngagementMetrics } from '@apps/teacher/types';
import type {
  GetAnalyticsQueryDto,
  GetEngagementMetricsDto,
  GenerateReportsDto,
  Report,
  StudentInsights as ApiStudentInsights,
} from '@services/api/teacher';

/**
 * Student Insights Interface
 * Represents detailed analytics and predictions for an individual student
 */
export interface StudentInsights {
  overall_score: number;
  modules_completed: number;
  modules_total: number;
  comparison_to_class: {
    score_percentile: number;
  };
  risk_level: 'low' | 'medium' | 'high';
  strengths: string[];
  weaknesses: string[];
  predictions: {
    completion_probability: number;
    dropout_risk: number;
  };
  recommendations: string[];
}

export interface UseStudentInsightsReturn {
  insights: StudentInsights | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export interface UseAnalyticsReturn {
  analytics: ClassroomAnalytics | null;
  engagement: EngagementMetrics | null;
  loading: boolean;
  error: Error | null;
  generateReport: (config: GenerateReportsDto) => Promise<Report>;
  refresh: () => Promise<void>;
}

export function useAnalytics(
  analyticsQuery?: GetAnalyticsQueryDto,
  engagementQuery?: GetEngagementMetricsDto
): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<ClassroomAnalytics | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [analyticsData, engagementData] = await Promise.all([
        analyticsApi.getClassroomAnalytics(analyticsQuery),
        analyticsApi.getEngagementMetrics(engagementQuery),
      ]);

      setAnalytics(analyticsData);
      setEngagement(engagementData);
    } catch (err) {
      console.error('[useAnalytics] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [analyticsQuery, engagementQuery]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const generateReport = useCallback(async (config: GenerateReportsDto) => {
    try {
      return await analyticsApi.generateReport(config);
    } catch (err) {
      console.error('[useAnalytics] Error generating report:', err);
      throw err;
    }
  }, []);

  return {
    analytics,
    engagement,
    loading,
    error,
    generateReport,
    refresh: fetchAnalytics,
  };
}

/**
 * useStudentInsights Hook
 * Fetches detailed insights and predictions for an individual student
 *
 * @param studentId - The ID of the student to analyze
 * @returns Student insights data, loading state, error state, and refresh function
 */
export function useStudentInsights(studentId: string): UseStudentInsightsReturn {
  const [insights, setInsights] = useState<StudentInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!studentId) {
      setInsights(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch insights from backend API
      const data = await analyticsApi.getStudentInsights(studentId);
      setInsights(data);
    } catch (err) {
      console.error('[useStudentInsights] Error:', err);
      setError(err as Error);

      // Set null insights on error instead of empty data
      setInsights(null);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  return {
    insights,
    loading,
    error,
    refresh: fetchInsights,
  };
}
