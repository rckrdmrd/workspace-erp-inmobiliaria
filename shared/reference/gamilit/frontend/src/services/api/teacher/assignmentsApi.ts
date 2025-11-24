/**
 * Assignments API Service
 *
 * Provides methods to manage assignments and submissions.
 * Includes CRUD operations for assignments and submission management.
 *
 * @module services/api/teacher/assignmentsApi
 */

import axiosInstance from '../axios.instance';
import type { Assignment, Submission, Exercise } from '@apps/teacher/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * DTO for creating a new assignment
 */
export interface CreateAssignmentDto {
  title: string;
  description: string;
  type: 'practice' | 'quiz' | 'exam' | 'homework';
  due_date: string;
  classroom_id: string;
  exercise_ids: string[];
}

/**
 * DTO for updating an existing assignment
 */
export interface UpdateAssignmentDto {
  title?: string;
  description?: string;
  type?: 'practice' | 'quiz' | 'exam' | 'homework';
  due_date?: string;
  exercise_ids?: string[];
}

/**
 * DTO for grading a submission
 */
export interface GradeSubmissionDto {
  score: number;
  feedback?: string;
  grade?: string;
}

/**
 * Query parameters for fetching assignments
 */
export interface GetAssignmentsQueryDto {
  classroom_id?: string;
  status?: 'draft' | 'active' | 'completed' | 'expired';
  start_date?: string;
  end_date?: string;
}

/**
 * Query parameters for fetching submissions
 */
export interface GetSubmissionsQueryDto {
  assignment_id?: string;
  student_id?: string;
  status?: 'pending' | 'graded' | 'late';
}

// ============================================================================
// ASSIGNMENTS API CLASS
// ============================================================================

/**
 * Assignments API Service
 *
 * Handles assignment-related API calls including CRUD operations,
 * submission management, and grading.
 */
class AssignmentsAPI {
  private readonly baseUrl = '/assignments';
  private readonly submissionsUrl = '/submissions';

  /**
   * Get all assignments for the authenticated teacher
   *
   * Returns a list of assignments created by the teacher.
   * Supports filtering by classroom, status, and date range.
   *
   * @param query - Optional query parameters for filtering
   * @returns Promise<Assignment[]> List of assignments
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get all assignments
   * const assignments = await assignmentsApi.getAssignments();
   *
   * // Get assignments for specific classroom
   * const classroomAssignments = await assignmentsApi.getAssignments({
   *   classroom_id: 'classroom-123'
   * });
   *
   * // Get active assignments
   * const active = await assignmentsApi.getAssignments({ status: 'active' });
   * ```
   */
  async getAssignments(query?: GetAssignmentsQueryDto): Promise<Assignment[]> {
    try {
      const { data } = await axiosInstance.get<Assignment[]>(this.baseUrl, {
        params: query,
      });
      return data;
    } catch (error) {
      console.error('[AssignmentsAPI] Error fetching assignments:', error);
      throw error;
    }
  }

  /**
   * Get assignment by ID
   *
   * Returns detailed information about a specific assignment.
   *
   * @param assignmentId - ID of the assignment
   * @returns Promise<Assignment> Assignment details
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const assignment = await assignmentsApi.getAssignmentById('assignment-123');
   * console.log(`Title: ${assignment.title}`);
   * console.log(`Due date: ${assignment.end_date}`);
   * ```
   */
  async getAssignmentById(assignmentId: string): Promise<Assignment> {
    try {
      const { data } = await axiosInstance.get<Assignment>(
        `${this.baseUrl}/${assignmentId}`
      );
      return data;
    } catch (error) {
      console.error('[AssignmentsAPI] Error fetching assignment details:', error);
      throw error;
    }
  }

  /**
   * Create a new assignment
   *
   * Creates a new assignment with the provided information.
   *
   * @param data - Assignment creation data
   * @returns Promise<Assignment> Created assignment
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const assignment = await assignmentsApi.createAssignment({
   *   title: 'Week 5 Quiz',
   *   description: 'Quiz on chapters 4-5',
   *   type: 'quiz',
   *   due_date: '2025-12-01',
   *   classroom_id: 'classroom-123',
   *   exercise_ids: ['ex-1', 'ex-2', 'ex-3']
   * });
   * ```
   */
  async createAssignment(data: CreateAssignmentDto): Promise<Assignment> {
    try {
      const { data: responseData } = await axiosInstance.post<Assignment>(
        this.baseUrl,
        data
      );
      return responseData;
    } catch (error) {
      console.error('[AssignmentsAPI] Error creating assignment:', error);
      throw error;
    }
  }

  /**
   * Update an existing assignment
   *
   * Updates assignment information. Only draft assignments can be modified.
   *
   * @param assignmentId - ID of the assignment
   * @param data - Partial assignment data to update
   * @returns Promise<Assignment> Updated assignment
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const updated = await assignmentsApi.updateAssignment('assignment-123', {
   *   due_date: '2025-12-05',
   *   title: 'Week 5 Quiz (Extended)'
   * });
   * ```
   */
  async updateAssignment(
    assignmentId: string,
    data: UpdateAssignmentDto
  ): Promise<Assignment> {
    try {
      const { data: responseData } = await axiosInstance.put<Assignment>(
        `${this.baseUrl}/${assignmentId}`,
        data
      );
      return responseData;
    } catch (error) {
      console.error('[AssignmentsAPI] Error updating assignment:', error);
      throw error;
    }
  }

  /**
   * Delete an assignment
   *
   * Deletes an assignment. Only draft assignments can be deleted.
   *
   * @param assignmentId - ID of the assignment
   * @returns Promise<void>
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * await assignmentsApi.deleteAssignment('assignment-123');
   * ```
   */
  async deleteAssignment(assignmentId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.baseUrl}/${assignmentId}`);
    } catch (error) {
      console.error('[AssignmentsAPI] Error deleting assignment:', error);
      throw error;
    }
  }

  /**
   * Get submissions for an assignment
   *
   * Returns all submissions for a specific assignment.
   * Includes student information and grading status.
   *
   * @param assignmentId - ID of the assignment
   * @param query - Optional query parameters for filtering
   * @returns Promise<Submission[]> List of submissions
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get all submissions
   * const submissions = await assignmentsApi.getAssignmentSubmissions('assignment-123');
   *
   * // Get only pending submissions
   * const pending = await assignmentsApi.getAssignmentSubmissions('assignment-123', {
   *   status: 'pending'
   * });
   *
   * submissions.forEach(sub => {
   *   console.log(`${sub.student_name}: ${sub.status}`);
   * });
   * ```
   */
  async getAssignmentSubmissions(
    assignmentId: string,
    query?: GetSubmissionsQueryDto
  ): Promise<Submission[]> {
    try {
      const { data } = await axiosInstance.get<Submission[]>(
        `${this.baseUrl}/${assignmentId}/submissions`,
        { params: query }
      );
      return data;
    } catch (error) {
      console.error('[AssignmentsAPI] Error fetching submissions:', error);
      throw error;
    }
  }

  /**
   * Get submission by ID
   *
   * Returns detailed information about a specific submission.
   *
   * @param submissionId - ID of the submission
   * @returns Promise<Submission> Submission details
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const submission = await assignmentsApi.getSubmissionById('submission-123');
   * console.log(`Student: ${submission.student_name}`);
   * console.log(`Score: ${submission.score}`);
   * ```
   */
  async getSubmissionById(submissionId: string): Promise<Submission> {
    try {
      const { data } = await axiosInstance.get<Submission>(
        `${this.submissionsUrl}/${submissionId}`
      );
      return data;
    } catch (error) {
      console.error('[AssignmentsAPI] Error fetching submission details:', error);
      throw error;
    }
  }

  /**
   * Grade a submission
   *
   * Submits a grade and optional feedback for a student submission.
   *
   * @param submissionId - ID of the submission
   * @param data - Grading data (score, feedback, grade)
   * @returns Promise<Submission> Updated submission with grade
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const graded = await assignmentsApi.gradeSubmission('submission-123', {
   *   score: 85,
   *   feedback: 'Good work! Pay attention to details.',
   *   grade: 'B'
   * });
   * ```
   */
  async gradeSubmission(
    submissionId: string,
    data: GradeSubmissionDto
  ): Promise<Submission> {
    try {
      const { data: responseData } = await axiosInstance.post<Submission>(
        `${this.submissionsUrl}/${submissionId}/grade`,
        data
      );
      return responseData;
    } catch (error) {
      console.error('[AssignmentsAPI] Error grading submission:', error);
      throw error;
    }
  }

  /**
   * Get available exercises for assignment creation
   *
   * Returns a list of exercises that can be added to assignments.
   * Filters by module, difficulty, or type.
   *
   * @returns Promise<Exercise[]> List of available exercises
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const exercises = await assignmentsApi.getAvailableExercises();
   * ```
   */
  async getAvailableExercises(): Promise<Exercise[]> {
    try {
      const { data } = await axiosInstance.get<Exercise[]>('/exercises');
      return data;
    } catch (error) {
      console.error('[AssignmentsAPI] Error fetching exercises:', error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Singleton instance of AssignmentsAPI
 * Use this instance for all assignment-related API calls
 *
 * @example
 * ```typescript
 * import { assignmentsApi } from '@services/api/teacher';
 *
 * const assignments = await assignmentsApi.getAssignments();
 * const assignment = await assignmentsApi.createAssignment({ ... });
 * const submissions = await assignmentsApi.getAssignmentSubmissions('assignment-123');
 * await assignmentsApi.gradeSubmission('submission-123', { score: 90 });
 * ```
 */
export const assignmentsApi = new AssignmentsAPI();

/**
 * Export the class for testing purposes
 */
export { AssignmentsAPI };
