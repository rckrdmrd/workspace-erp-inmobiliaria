/**
 * Student Progress API Service
 *
 * Provides methods to fetch and manage student progress data including
 * complete progress, overview, statistics, and teacher notes.
 *
 * All endpoints are prefixed with `/teacher/students` and require
 * authentication with admin_teacher or super_admin role.
 *
 * @module services/api/teacher/studentProgressApi
 */

import axiosInstance from '../axios.instance';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Query parameters for student progress
 */
export interface GetStudentProgressQueryDto {
  module_id?: string;
  start_date?: string;
  end_date?: string;
}

/**
 * Complete student progress data
 */
export interface StudentProgress {
  student_id: string;
  student_name: string;
  overall_progress: number;
  modules_completed: number;
  modules_total: number;
  exercises_completed: number;
  exercises_total: number;
  average_score: number;
  time_spent_minutes: number;
  last_activity: string;
  module_progress: Array<{
    module_id: string;
    module_name: string;
    progress_percentage: number;
    score: number;
    exercises_completed: number;
    exercises_total: number;
  }>;
}

/**
 * Student overview summary
 */
export interface StudentOverview {
  student_id: string;
  student_name: string;
  email: string;
  enrollment_date: string;
  current_module: string | null;
  current_exercise: string | null;
  last_activity: string;
  status: 'active' | 'inactive' | 'at_risk';
  performance_trend: 'improving' | 'stable' | 'declining';
  total_ml_coins: number;
  current_rank: string;
  achievements_count: number;
}

/**
 * Student statistics
 */
export interface StudentStats {
  student_id: string;
  total_sessions: number;
  average_session_duration: number;
  total_time_spent: number;
  exercises_attempted: number;
  exercises_completed: number;
  exercises_failed: number;
  average_score: number;
  highest_score: number;
  lowest_score: number;
  completion_rate: number;
  first_attempt_success_rate: number;
  powerups_used: number;
  hints_used: number;
  streak_current: number;
  streak_longest: number;
}

/**
 * Teacher note for a student
 */
export interface StudentNote {
  id: string;
  student_id: string;
  teacher_id: string;
  classroom_id: string;
  note: string;
  category?: 'behavior' | 'academic' | 'attendance' | 'general';
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * DTO for adding a teacher note
 */
export interface AddTeacherNoteDto {
  classroom_id: string;
  note: string;
  category?: 'behavior' | 'academic' | 'attendance' | 'general';
  is_private?: boolean;
}

// ============================================================================
// STUDENT PROGRESS API CLASS
// ============================================================================

/**
 * Student Progress API Service
 *
 * Handles all student progress-related API calls including progress tracking,
 * statistics, overview, and teacher notes management.
 */
class StudentProgressAPI {
  private readonly baseUrl = '/teacher/students';

  /**
   * Get complete student progress
   *
   * Returns detailed progress information including module completion,
   * exercise statistics, scores, and time spent.
   *
   * @param studentId - ID of the student
   * @param query - Optional query parameters (module_id, date range)
   * @returns Promise<StudentProgress> Complete student progress
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get all progress
   * const progress = await studentProgressApi.getStudentProgress('student-123');
   *
   * // Get progress for specific module
   * const moduleProgress = await studentProgressApi.getStudentProgress('student-123', {
   *   module_id: 'module-456'
   * });
   *
   * // Get progress for date range
   * const recentProgress = await studentProgressApi.getStudentProgress('student-123', {
   *   start_date: '2025-01-01',
   *   end_date: '2025-01-31'
   * });
   * ```
   */
  async getStudentProgress(
    studentId: string,
    query?: GetStudentProgressQueryDto
  ): Promise<StudentProgress> {
    try {
      const { data } = await axiosInstance.get<StudentProgress>(
        `${this.baseUrl}/${studentId}/progress`,
        { params: query }
      );
      return data;
    } catch (error) {
      console.error('[StudentProgressAPI] Error fetching student progress:', error);
      throw error;
    }
  }

  /**
   * Get student overview summary
   *
   * Returns a high-level overview of the student including enrollment info,
   * current activity, status, performance trend, and gamification data.
   *
   * @param studentId - ID of the student
   * @returns Promise<StudentOverview> Student overview
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const overview = await studentProgressApi.getStudentOverview('student-123');
   * console.log(`Status: ${overview.status}`);
   * console.log(`Performance trend: ${overview.performance_trend}`);
   * console.log(`Last activity: ${overview.last_activity}`);
   * ```
   */
  async getStudentOverview(studentId: string): Promise<StudentOverview> {
    try {
      const { data } = await axiosInstance.get<StudentOverview>(
        `${this.baseUrl}/${studentId}/overview`
      );
      return data;
    } catch (error) {
      console.error('[StudentProgressAPI] Error fetching student overview:', error);
      throw error;
    }
  }

  /**
   * Get student statistics
   *
   * Returns detailed statistics about student activity including sessions,
   * exercise attempts, completion rates, scores, and engagement metrics.
   *
   * @param studentId - ID of the student
   * @returns Promise<StudentStats> Student statistics
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const stats = await studentProgressApi.getStudentStats('student-123');
   * console.log(`Completion rate: ${stats.completion_rate}%`);
   * console.log(`Average score: ${stats.average_score}%`);
   * console.log(`Total sessions: ${stats.total_sessions}`);
   * console.log(`Current streak: ${stats.streak_current} days`);
   * ```
   */
  async getStudentStats(studentId: string): Promise<StudentStats> {
    try {
      const { data } = await axiosInstance.get<StudentStats>(
        `${this.baseUrl}/${studentId}/stats`
      );
      return data;
    } catch (error) {
      console.error('[StudentProgressAPI] Error fetching student stats:', error);
      throw error;
    }
  }

  /**
   * Get teacher notes for a student
   *
   * Returns all notes that the authenticated teacher has written about
   * the specified student across all classrooms.
   *
   * @param studentId - ID of the student
   * @returns Promise<StudentNote[]> List of teacher notes
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const notes = await studentProgressApi.getStudentNotes('student-123');
   * notes.forEach(note => {
   *   console.log(`[${note.category}] ${note.note}`);
   *   console.log(`Created: ${note.created_at}`);
   * });
   * ```
   */
  async getStudentNotes(studentId: string): Promise<StudentNote[]> {
    try {
      const { data } = await axiosInstance.get<StudentNote[]>(
        `${this.baseUrl}/${studentId}/notes`
      );
      return data;
    } catch (error) {
      console.error('[StudentProgressAPI] Error fetching student notes:', error);
      throw error;
    }
  }

  /**
   * Add or update teacher note for a student
   *
   * Creates a new note about a student in a specific classroom.
   * Notes can be categorized (behavior, academic, attendance, general)
   * and marked as private if needed.
   *
   * @param studentId - ID of the student
   * @param noteDto - Note data (classroom_id, note, category, is_private)
   * @returns Promise<StudentNote> Created note
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const newNote = await studentProgressApi.addStudentNote('student-123', {
   *   classroom_id: 'classroom-456',
   *   note: 'Student is struggling with Module 2 exercises. Recommend additional practice.',
   *   category: 'academic',
   *   is_private: true
   * });
   *
   * console.log(`Note created: ${newNote.id}`);
   * ```
   */
  async addStudentNote(
    studentId: string,
    noteDto: AddTeacherNoteDto
  ): Promise<StudentNote> {
    try {
      const { data } = await axiosInstance.post<StudentNote>(
        `${this.baseUrl}/${studentId}/note`,
        noteDto
      );
      return data;
    } catch (error) {
      console.error('[StudentProgressAPI] Error adding student note:', error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Singleton instance of StudentProgressAPI
 * Use this instance for all student progress-related API calls
 *
 * @example
 * ```typescript
 * import { studentProgressApi } from '@services/api/teacher';
 *
 * const progress = await studentProgressApi.getStudentProgress('student-123');
 * const overview = await studentProgressApi.getStudentOverview('student-123');
 * const stats = await studentProgressApi.getStudentStats('student-123');
 * const notes = await studentProgressApi.getStudentNotes('student-123');
 * ```
 */
export const studentProgressApi = new StudentProgressAPI();

/**
 * Export the class for testing purposes
 */
export { StudentProgressAPI };
