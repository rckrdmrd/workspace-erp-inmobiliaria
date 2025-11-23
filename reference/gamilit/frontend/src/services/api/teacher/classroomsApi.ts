/**
 * Classrooms API Service
 *
 * Provides methods to fetch classroom data and student lists.
 * Full CRUD operations will be implemented in Phase 2.
 *
 * Note: This is the Phase 1 (Quick Wins) version with basic read operations.
 * Create, Update, Delete operations will be added in Phase 2 (Core Functionality).
 *
 * @module services/api/teacher/classroomsApi
 */

import axiosInstance from '../axios.instance';
import type { Classroom, StudentMonitoring } from '@apps/teacher/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Query parameters for fetching classrooms
 */
export interface GetClassroomsQueryDto {
  teacher_id?: string;
  status?: 'active' | 'archived';
  grade_level?: string;
  subject?: string;
}

/**
 * Query parameters for fetching classroom students
 */
export interface GetClassroomStudentsQueryDto {
  status?: 'active' | 'inactive';
  sort_by?: 'name' | 'progress' | 'score' | 'last_activity';
  sort_order?: 'asc' | 'desc';
}

// ============================================================================
// CLASSROOMS API CLASS
// ============================================================================

/**
 * Classrooms API Service
 *
 * Handles classroom-related API calls. Currently supports read operations.
 * Full CRUD will be available in Phase 2.
 */
class ClassroomsAPI {
  private readonly baseUrl = '/classrooms';

  /**
   * Get all classrooms for the authenticated teacher
   *
   * Returns a list of classrooms where the authenticated user is the teacher
   * or co-teacher. Supports filtering by status, grade level, and subject.
   *
   * @param query - Optional query parameters for filtering
   * @returns Promise<Classroom[]> List of classrooms
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get all classrooms
   * const classrooms = await classroomsApi.getClassrooms();
   *
   * // Get only active classrooms
   * const active = await classroomsApi.getClassrooms({ status: 'active' });
   *
   * // Get classrooms for specific grade and subject
   * const filtered = await classroomsApi.getClassrooms({
   *   grade_level: '5',
   *   subject: 'Math'
   * });
   *
   * classrooms.forEach(classroom => {
   *   console.log(`${classroom.name} - ${classroom.student_count} students`);
   * });
   * ```
   */
  async getClassrooms(query?: GetClassroomsQueryDto): Promise<Classroom[]> {
    try {
      const { data } = await axiosInstance.get<Classroom[]>(this.baseUrl, {
        params: query,
      });
      return data;
    } catch (error) {
      console.error('[ClassroomsAPI] Error fetching classrooms:', error);
      throw error;
    }
  }

  /**
   * Get classroom by ID
   *
   * Returns detailed information about a specific classroom including
   * metadata, settings, and enrollment information.
   *
   * @param classroomId - ID of the classroom
   * @returns Promise<Classroom> Classroom details
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const classroom = await classroomsApi.getClassroomById('classroom-123');
   *
   * console.log(`Name: ${classroom.name}`);
   * console.log(`Grade: ${classroom.grade_level}`);
   * console.log(`Students: ${classroom.student_count}`);
   * console.log(`Created: ${classroom.created_at}`);
   * ```
   */
  async getClassroomById(classroomId: string): Promise<Classroom> {
    try {
      const { data } = await axiosInstance.get<Classroom>(
        `${this.baseUrl}/${classroomId}`
      );
      return data;
    } catch (error) {
      console.error('[ClassroomsAPI] Error fetching classroom details:', error);
      throw error;
    }
  }

  /**
   * Get students in a classroom
   *
   * Returns a list of students enrolled in the specified classroom with
   * monitoring data including current activity, progress, scores, and status.
   *
   * @param classroomId - ID of the classroom
   * @param query - Optional query parameters for filtering and sorting
   * @returns Promise<StudentMonitoring[]> List of students with monitoring data
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get all students in classroom
   * const students = await classroomsApi.getClassroomStudents('classroom-123');
   *
   * // Get only active students, sorted by score
   * const activeStudents = await classroomsApi.getClassroomStudents('classroom-123', {
   *   status: 'active',
   *   sort_by: 'score',
   *   sort_order: 'desc'
   * });
   *
   * students.forEach(student => {
   *   console.log(`${student.full_name}: ${student.progress_percentage}% complete`);
   *   console.log(`Average score: ${student.score_average}%`);
   *   console.log(`Last activity: ${student.last_activity}`);
   * });
   * ```
   */
  async getClassroomStudents(
    classroomId: string,
    query?: GetClassroomStudentsQueryDto
  ): Promise<StudentMonitoring[]> {
    try {
      const { data } = await axiosInstance.get<StudentMonitoring[]>(
        `${this.baseUrl}/${classroomId}/students`,
        { params: query }
      );
      return data;
    } catch (error) {
      console.error('[ClassroomsAPI] Error fetching classroom students:', error);
      throw error;
    }
  }

  /**
   * Get classroom statistics
   *
   * Returns aggregated statistics for a classroom including average scores,
   * completion rates, engagement metrics, and activity trends.
   *
   * @param classroomId - ID of the classroom
   * @returns Promise<ClassroomStats> Classroom statistics
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const stats = await classroomsApi.getClassroomStats('classroom-123');
   *
   * console.log(`Average score: ${stats.average_score}%`);
   * console.log(`Completion rate: ${stats.completion_rate}%`);
   * console.log(`Active students: ${stats.active_students}/${stats.total_students}`);
   * ```
   */
  async getClassroomStats(classroomId: string): Promise<{
    classroom_id: string;
    total_students: number;
    active_students: number;
    average_score: number;
    completion_rate: number;
    engagement_rate: number;
    total_exercises: number;
    completed_exercises: number;
  }> {
    try {
      const { data } = await axiosInstance.get(
        `${this.baseUrl}/${classroomId}/stats`
      );
      return data;
    } catch (error) {
      console.error('[ClassroomsAPI] Error fetching classroom stats:', error);
      throw error;
    }
  }

  // ============================================================================
  // CRUD METHODS (Implemented)
  // ============================================================================

  /**
   * Create a new classroom
   *
   * Creates a new classroom with the provided information.
   * The authenticated teacher becomes the owner of the classroom.
   *
   * @param data - Classroom creation data
   * @returns Promise<Classroom> Created classroom
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const classroom = await classroomsApi.createClassroom({
   *   name: 'Math 101',
   *   subject: 'Mathematics',
   *   grade_level: '5th Grade'
   * });
   * ```
   */
  async createClassroom(data: {
    name: string;
    subject: string;
    grade_level: string;
  }): Promise<Classroom> {
    try {
      const { data: responseData } = await axiosInstance.post<Classroom>(
        this.baseUrl,
        data
      );
      return responseData;
    } catch (error) {
      console.error('[ClassroomsAPI] Error creating classroom:', error);
      throw error;
    }
  }

  /**
   * Update classroom information
   *
   * Updates an existing classroom's information.
   * Only the classroom owner can update it.
   *
   * @param id - Classroom ID
   * @param data - Partial classroom data to update
   * @returns Promise<Classroom> Updated classroom
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const updated = await classroomsApi.updateClassroom('classroom-123', {
   *   name: 'Advanced Math 101'
   * });
   * ```
   */
  async updateClassroom(
    id: string,
    data: Partial<{
      name: string;
      subject: string;
      grade_level: string;
    }>
  ): Promise<Classroom> {
    try {
      const { data: responseData } = await axiosInstance.put<Classroom>(
        `${this.baseUrl}/${id}`,
        data
      );
      return responseData;
    } catch (error) {
      console.error('[ClassroomsAPI] Error updating classroom:', error);
      throw error;
    }
  }

  /**
   * Delete a classroom
   *
   * Deletes or archives a classroom.
   * Only the classroom owner can delete it.
   *
   * @param id - Classroom ID
   * @returns Promise<void>
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * await classroomsApi.deleteClassroom('classroom-123');
   * ```
   */
  async deleteClassroom(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('[ClassroomsAPI] Error deleting classroom:', error);
      throw error;
    }
  }

  /**
   * Enroll student in classroom (Phase 2)
   *
   * @todo Implement in Phase 2 - Core Functionality
   */
  // async enrollStudent(classroomId: string, studentId: string): Promise<void> { ... }

  /**
   * Remove student from classroom (Phase 2)
   *
   * @todo Implement in Phase 2 - Core Functionality
   */
  // async removeStudent(classroomId: string, studentId: string): Promise<void> { ... }

  /**
   * Bulk enroll students (Phase 2)
   *
   * @todo Implement in Phase 2 - Core Functionality
   */
  // async bulkEnrollStudents(classroomId: string, studentIds: string[]): Promise<void> { ... }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Singleton instance of ClassroomsAPI
 * Use this instance for all classroom-related API calls
 *
 * @example
 * ```typescript
 * import { classroomsApi } from '@services/api/teacher';
 *
 * const classrooms = await classroomsApi.getClassrooms();
 * const classroom = await classroomsApi.getClassroomById('classroom-123');
 * const students = await classroomsApi.getClassroomStudents('classroom-123');
 * const stats = await classroomsApi.getClassroomStats('classroom-123');
 * ```
 */
export const classroomsApi = new ClassroomsAPI();

/**
 * Export the class for testing purposes
 */
export { ClassroomsAPI };
