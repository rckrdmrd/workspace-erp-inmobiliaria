/**
 * Analytics API Service
 *
 * Provides methods to fetch classroom analytics, engagement metrics,
 * and generate custom reports for teachers.
 *
 * All endpoints are prefixed with `/teacher/analytics` and require
 * authentication with admin_teacher or super_admin role.
 *
 * @module services/api/teacher/analyticsApi
 */

import axiosInstance from '../axios.instance';
import type {
  ClassroomAnalytics,
  EngagementMetrics,
  AnalyticsFilter,
} from '@apps/teacher/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Query parameters for analytics
 */
export interface GetAnalyticsQueryDto {
  classroom_id?: string;
  module_id?: string;
  start_date?: string;
  end_date?: string;
  student_ids?: string[];
}

/**
 * Query parameters for engagement metrics
 */
export interface GetEngagementMetricsDto {
  period?: 'daily' | 'weekly' | 'monthly';
  classroom_id?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Configuration for report generation
 */
export interface GenerateReportsDto {
  type: 'progress' | 'evaluation' | 'intervention' | 'custom';
  title: string;
  classroom_id?: string;
  student_ids?: string[];
  module_ids?: string[];
  start_date: string;
  end_date: string;
  format: 'pdf' | 'excel' | 'csv';
  include_charts?: boolean;
  include_recommendations?: boolean;
}

/**
 * Generated report response
 */
export interface Report {
  id: string;
  type: string;
  title: string;
  status: 'generating' | 'completed' | 'failed';
  file_url?: string;
  created_at: string;
  expires_at: string;
}

/**
 * Student Insights Response
 * AI-powered analytics for individual student performance
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

// ============================================================================
// ANALYTICS API CLASS
// ============================================================================

/**
 * Analytics API Service
 *
 * Handles all analytics-related API calls including classroom analytics,
 * engagement metrics, and report generation.
 */
class AnalyticsAPI {
  private readonly baseUrl = '/teacher/analytics';

  /**
   * Get classroom analytics
   *
   * Returns comprehensive analytics for classrooms including average scores,
   * completion rates, engagement metrics, module statistics, and student performance.
   *
   * @param query - Optional query parameters (classroom_id, module_id, date range, student_ids)
   * @returns Promise<ClassroomAnalytics> Classroom analytics data
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get analytics for all classrooms
   * const analytics = await analyticsApi.getClassroomAnalytics();
   *
   * // Get analytics for specific classroom
   * const classroomAnalytics = await analyticsApi.getClassroomAnalytics({
   *   classroom_id: 'classroom-123'
   * });
   *
   * // Get analytics for specific module and date range
   * const moduleAnalytics = await analyticsApi.getClassroomAnalytics({
   *   module_id: 'module-456',
   *   start_date: '2025-01-01',
   *   end_date: '2025-01-31'
   * });
   * ```
   */
  async getClassroomAnalytics(
    query?: GetAnalyticsQueryDto
  ): Promise<ClassroomAnalytics> {
    try {
      const { data } = await axiosInstance.get<ClassroomAnalytics>(
        this.baseUrl,
        { params: query }
      );
      return data;
    } catch (error) {
      console.error('[AnalyticsAPI] Error fetching classroom analytics:', error);
      throw error;
    }
  }

  /**
   * Get engagement metrics
   *
   * Returns engagement metrics including DAU (Daily Active Users), WAU (Weekly Active Users),
   * session duration, sessions per user, feature usage, and comparisons with previous periods.
   *
   * @param query - Optional query parameters (period, classroom_id, date range)
   * @returns Promise<EngagementMetrics> Engagement metrics data
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get daily engagement metrics
   * const dailyEngagement = await analyticsApi.getEngagementMetrics({
   *   period: 'daily'
   * });
   *
   * // Get weekly engagement for specific classroom
   * const weeklyEngagement = await analyticsApi.getEngagementMetrics({
   *   period: 'weekly',
   *   classroom_id: 'classroom-123'
   * });
   *
   * console.log(`DAU: ${dailyEngagement.dau}`);
   * console.log(`WAU: ${dailyEngagement.wau}`);
   * console.log(`Avg session: ${dailyEngagement.session_duration_avg} min`);
   * ```
   */
  async getEngagementMetrics(
    query?: GetEngagementMetricsDto
  ): Promise<EngagementMetrics> {
    try {
      const { data } = await axiosInstance.get<EngagementMetrics>(
        `${this.baseUrl}/engagement`,
        { params: query }
      );
      return data;
    } catch (error) {
      console.error('[AnalyticsAPI] Error fetching engagement metrics:', error);
      throw error;
    }
  }

  /**
   * Generate custom report
   *
   * Generates a custom report based on the provided configuration.
   * The report can be of type progress, evaluation, intervention, or custom.
   * Supports multiple formats: PDF, Excel, CSV.
   *
   * Returns a report object with status. If status is 'completed', the file_url
   * field will contain the download link. Reports expire after a certain period.
   *
   * @param config - Report configuration (type, title, filters, format, options)
   * @returns Promise<Report> Generated report metadata
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Generate progress report for classroom
   * const report = await analyticsApi.generateReport({
   *   type: 'progress',
   *   title: 'Classroom Progress Report - January 2025',
   *   classroom_id: 'classroom-123',
   *   start_date: '2025-01-01',
   *   end_date: '2025-01-31',
   *   format: 'pdf',
   *   include_charts: true,
   *   include_recommendations: true
   * });
   *
   * if (report.status === 'completed') {
   *   console.log(`Download: ${report.file_url}`);
   * } else {
   *   console.log(`Report generating... (ID: ${report.id})`);
   * }
   *
   * // Generate intervention report for specific students
   * const interventionReport = await analyticsApi.generateReport({
   *   type: 'intervention',
   *   title: 'At-Risk Students Report',
   *   student_ids: ['student-1', 'student-2', 'student-3'],
   *   start_date: '2025-01-01',
   *   end_date: '2025-01-31',
   *   format: 'excel',
   *   include_recommendations: true
   * });
   * ```
   */
  async generateReport(config: GenerateReportsDto): Promise<Report> {
    try {
      const { data } = await axiosInstance.post<Report>(
        `${this.baseUrl}/report`,
        config
      );
      return data;
    } catch (error) {
      console.error('[AnalyticsAPI] Error generating report:', error);
      throw error;
    }
  }

  /**
   * Get report status
   *
   * Checks the status of a previously generated report.
   * Useful for polling when report generation is asynchronous.
   *
   * @param reportId - ID of the report
   * @returns Promise<Report> Report metadata with current status
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const report = await analyticsApi.generateReport({ ... });
   *
   * // Poll for completion
   * const checkStatus = async () => {
   *   const status = await analyticsApi.getReportStatus(report.id);
   *   if (status.status === 'completed') {
   *     console.log(`Report ready: ${status.file_url}`);
   *   } else if (status.status === 'failed') {
   *     console.error('Report generation failed');
   *   } else {
   *     setTimeout(checkStatus, 2000); // Check again in 2s
   *   }
   * };
   *
   * checkStatus();
   * ```
   */
  async getReportStatus(reportId: string): Promise<Report> {
    try {
      const { data } = await axiosInstance.get<Report>(
        `${this.baseUrl}/report/${reportId}`
      );
      return data;
    } catch (error) {
      console.error('[AnalyticsAPI] Error fetching report status:', error);
      throw error;
    }
  }

  /**
   * Get comprehensive insights for an individual student
   *
   * Returns AI-powered insights including performance analysis, strengths,
   * weaknesses, predictions (completion probability, dropout risk), and
   * personalized recommendations.
   *
   * @param studentId - ID of the student to analyze
   * @returns Promise<StudentInsights> Comprehensive student insights
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const insights = await analyticsApi.getStudentInsights('student-123');
   *
   * console.log(`Overall Score: ${insights.overall_score}%`);
   * console.log(`Risk Level: ${insights.risk_level}`);
   * console.log(`Completion Probability: ${insights.predictions.completion_probability * 100}%`);
   *
   * insights.strengths.forEach(strength => {
   *   console.log(`✓ ${strength}`);
   * });
   *
   * insights.weaknesses.forEach(weakness => {
   *   console.log(`! ${weakness}`);
   * });
   *
   * insights.recommendations.forEach(rec => {
   *   console.log(`💡 ${rec}`);
   * });
   * ```
   */
  async getStudentInsights(studentId: string): Promise<StudentInsights> {
    try {
      const { data } = await axiosInstance.get<StudentInsights>(
        `/teacher/students/${studentId}/insights`
      );
      return data;
    } catch (error) {
      console.error('[AnalyticsAPI] Error fetching student insights:', error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Singleton instance of AnalyticsAPI
 * Use this instance for all analytics-related API calls
 *
 * @example
 * ```typescript
 * import { analyticsApi } from '@services/api/teacher';
 *
 * const analytics = await analyticsApi.getClassroomAnalytics();
 * const engagement = await analyticsApi.getEngagementMetrics({ period: 'weekly' });
 * const report = await analyticsApi.generateReport({ ... });
 * ```
 */
export const analyticsApi = new AnalyticsAPI();

/**
 * Export the class for testing purposes
 */
export { AnalyticsAPI };
