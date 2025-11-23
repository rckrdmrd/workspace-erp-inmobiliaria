/**
 * Teacher Dashboard API Service
 *
 * Provides methods to fetch dashboard statistics, recent activities,
 * alerts, top performers, and module progress summaries for teachers.
 *
 * All endpoints are prefixed with `/teacher/dashboard` and require
 * authentication with admin_teacher or super_admin role.
 *
 * @module services/api/teacher/teacherApi
 */

import axiosInstance from '../axios.instance';
import type {
  TeacherDashboardStats,
  InterventionAlert,
  StudentPerformance,
  ModuleProgress,
} from '@apps/teacher/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Activity represents a recent classroom activity
 */
export interface Activity {
  id: string;
  type: 'submission' | 'assignment_created' | 'student_joined' | 'achievement_unlocked';
  student_id?: string;
  student_name?: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// TEACHER DASHBOARD API CLASS
// ============================================================================

/**
 * Teacher Dashboard API Service
 *
 * Handles all dashboard-related API calls for teachers including stats,
 * activities, alerts, performers, and module progress.
 */
class TeacherDashboardAPI {
  private readonly baseUrl = '/teacher/dashboard';

  /**
   * Get classroom statistics for the authenticated teacher
   *
   * Returns aggregated statistics including total/active students,
   * assignments count, pending alerts, average scores, completion rate,
   * and engagement rate.
   *
   * @returns Promise<TeacherDashboardStats> Dashboard statistics
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const stats = await teacherApi.getDashboardStats();
   * console.log(`Total students: ${stats.total_students}`);
   * console.log(`Average score: ${stats.average_class_score}%`);
   * ```
   */
  async getDashboardStats(): Promise<TeacherDashboardStats> {
    try {
      const { data } = await axiosInstance.get<TeacherDashboardStats>(
        `${this.baseUrl}/stats`
      );
      return data;
    } catch (error) {
      console.error('[TeacherAPI] Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Get recent activities from the classroom
   *
   * Returns a list of recent activities such as submissions, new assignments,
   * student joins, and achievements unlocked. Ordered by timestamp (most recent first).
   *
   * @param limit - Maximum number of activities to return (default: 10)
   * @returns Promise<Activity[]> List of recent activities
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get last 5 activities
   * const activities = await teacherApi.getRecentActivities(5);
   * activities.forEach(activity => {
   *   console.log(`${activity.type}: ${activity.description}`);
   * });
   * ```
   */
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      const { data } = await axiosInstance.get<Activity[]>(
        `${this.baseUrl}/activities`,
        {
          params: { limit },
        }
      );
      return data;
    } catch (error) {
      console.error('[TeacherAPI] Error fetching recent activities:', error);
      throw error;
    }
  }

  /**
   * Get student alerts requiring teacher intervention
   *
   * Returns a list of alerts for students who need attention such as:
   * - Students with no recent activity
   * - Students with low scores
   * - Students with declining performance trends
   * - Students with repeated failures
   *
   * @returns Promise<InterventionAlert[]> List of intervention alerts
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const alerts = await teacherApi.getStudentAlerts();
   * const criticalAlerts = alerts.filter(a => a.priority === 'critical');
   * console.log(`${criticalAlerts.length} critical alerts pending`);
   * ```
   */
  async getStudentAlerts(): Promise<InterventionAlert[]> {
    try {
      const { data} = await axiosInstance.get<InterventionAlert[]>(
        `${this.baseUrl}/alerts`
      );
      return data;
    } catch (error) {
      console.error('[TeacherAPI] Error fetching student alerts:', error);
      throw error;
    }
  }

  /**
   * Get top performing students in the classroom
   *
   * Returns a list of students with the highest overall performance
   * based on average scores, completion rate, and engagement.
   *
   * @param limit - Maximum number of performers to return (default: 5)
   * @returns Promise<StudentPerformance[]> List of top performers
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get top 10 students
   * const topStudents = await teacherApi.getTopPerformers(10);
   * topStudents.forEach((student, index) => {
   *   console.log(`#${index + 1}: ${student.student_name} - ${student.average_score}%`);
   * });
   * ```
   */
  async getTopPerformers(limit: number = 5): Promise<StudentPerformance[]> {
    try {
      const { data } = await axiosInstance.get<StudentPerformance[]>(
        `${this.baseUrl}/top-performers`,
        {
          params: { limit },
        }
      );
      return data;
    } catch (error) {
      console.error('[TeacherAPI] Error fetching top performers:', error);
      throw error;
    }
  }

  /**
   * Get module progress summary for all modules
   *
   * Returns progress statistics for each educational module including
   * completion percentage, average scores, student counts, and average time spent.
   *
   * @returns Promise<ModuleProgress[]> List of module progress summaries
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const moduleProgress = await teacherApi.getModuleProgressSummary();
   * moduleProgress.forEach(module => {
   *   console.log(`${module.module_name}: ${module.completion_percentage}% complete`);
   *   console.log(`Average score: ${module.average_score}%`);
   * });
   * ```
   */
  async getModuleProgressSummary(): Promise<ModuleProgress[]> {
    try {
      const { data } = await axiosInstance.get<ModuleProgress[]>(
        `${this.baseUrl}/module-progress`
      );
      return data;
    } catch (error) {
      console.error('[TeacherAPI] Error fetching module progress:', error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Singleton instance of TeacherDashboardAPI
 * Use this instance for all dashboard-related API calls
 *
 * @example
 * ```typescript
 * import { teacherApi } from '@services/api/teacher';
 *
 * const stats = await teacherApi.getDashboardStats();
 * const activities = await teacherApi.getRecentActivities();
 * ```
 */
export const teacherApi = new TeacherDashboardAPI();

/**
 * Export the class for testing purposes
 */
export { TeacherDashboardAPI };
