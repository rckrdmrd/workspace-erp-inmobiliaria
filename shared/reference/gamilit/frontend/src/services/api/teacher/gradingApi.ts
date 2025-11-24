/**
 * Grading API Service
 *
 * Provides methods to fetch submissions, submit feedback, and perform
 * bulk grading operations for teachers.
 *
 * All endpoints are prefixed with `/teacher/submissions` and require
 * authentication with admin_teacher or super_admin role.
 *
 * @module services/api/teacher/gradingApi
 */

import axiosInstance from '../axios.instance';
import type { Submission } from '@apps/teacher/types';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Query parameters for fetching submissions
 */
export interface GetSubmissionsQueryDto {
  classroom_id?: string;
  assignment_id?: string;
  student_id?: string;
  status?: 'pending' | 'graded' | 'late';
  module_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

/**
 * DTO for submitting feedback on a submission
 */
export interface SubmitFeedbackDto {
  score: number;
  max_score: number;
  feedback: string;
  grade?: string; // 'A', 'B', 'C', 'D', 'F'
  is_approved: boolean;
}

/**
 * DTO for bulk grading multiple submissions
 */
export interface BulkGradeDto {
  submissions: Array<{
    submission_id: string;
    score: number;
    feedback?: string;
    grade?: string;
  }>;
}

/**
 * Detailed submission with student info and answers
 */
export interface SubmissionDetail extends Submission {
  classroom_id: string;
  classroom_name: string;
  assignment_title: string;
  student_email: string;
  answers: Array<{
    exercise_id: string;
    exercise_title: string;
    exercise_type: string;
    answer: any;
    is_correct?: boolean;
    points_earned?: number;
    max_points: number;
  }>;
  teacher_feedback?: string;
  graded_by?: string;
  attempt_number: number;
  max_attempts: number;
}

// ============================================================================
// GRADING API CLASS
// ============================================================================

/**
 * Grading API Service
 *
 * Handles all grading-related API calls including fetching submissions,
 * providing feedback, and bulk grading operations.
 */
class GradingAPI {
  private readonly baseUrl = '/teacher/submissions';

  /**
   * Get submissions with optional filters
   *
   * Returns a list of exercise submissions filtered by classroom, assignment,
   * student, status, module, or date range. Supports pagination.
   *
   * @param filters - Optional query parameters for filtering
   * @returns Promise<Submission[]> List of submissions
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * // Get all pending submissions
   * const pending = await gradingApi.getSubmissions({ status: 'pending' });
   *
   * // Get submissions for specific assignment
   * const assignmentSubs = await gradingApi.getSubmissions({
   *   assignment_id: 'assignment-123',
   *   limit: 20
   * });
   *
   * // Get submissions for specific student in date range
   * const studentSubs = await gradingApi.getSubmissions({
   *   student_id: 'student-456',
   *   start_date: '2025-01-01',
   *   end_date: '2025-01-31'
   * });
   * ```
   */
  async getSubmissions(filters?: GetSubmissionsQueryDto): Promise<Submission[]> {
    try {
      const { data } = await axiosInstance.get<Submission[]>(this.baseUrl, {
        params: filters,
      });
      return data;
    } catch (error) {
      console.error('[GradingAPI] Error fetching submissions:', error);
      throw error;
    }
  }

  /**
   * Get submission details by ID
   *
   * Returns detailed information about a specific submission including
   * student info, answers, exercise details, and previous feedback.
   *
   * @param submissionId - ID of the submission
   * @returns Promise<SubmissionDetail> Detailed submission data
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const submission = await gradingApi.getSubmissionById('submission-789');
   *
   * console.log(`Student: ${submission.student_name}`);
   * console.log(`Score: ${submission.score}/${submission.maxScore}`);
   * console.log(`Attempt: ${submission.attempt_number}/${submission.max_attempts}`);
   *
   * submission.answers.forEach((answer, idx) => {
   *   console.log(`Q${idx + 1}: ${answer.exercise_title}`);
   *   console.log(`Answer: ${JSON.stringify(answer.answer)}`);
   *   console.log(`Correct: ${answer.is_correct}`);
   * });
   * ```
   */
  async getSubmissionById(submissionId: string): Promise<SubmissionDetail> {
    try {
      const { data } = await axiosInstance.get<SubmissionDetail>(
        `${this.baseUrl}/${submissionId}`
      );
      return data;
    } catch (error) {
      console.error('[GradingAPI] Error fetching submission details:', error);
      throw error;
    }
  }

  /**
   * Submit feedback for a submission
   *
   * Grades a submission by providing a score, feedback, and optional letter grade.
   * Updates the submission status to 'graded' and records the grading timestamp.
   *
   * @param submissionId - ID of the submission to grade
   * @param feedback - Feedback data (score, feedback text, grade, approval)
   * @returns Promise<Submission> Updated submission
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const graded = await gradingApi.submitFeedback('submission-789', {
   *   score: 85,
   *   max_score: 100,
   *   feedback: 'Great work! Your analysis was thorough. Consider adding more examples in question 3.',
   *   grade: 'B',
   *   is_approved: true
   * });
   *
   * console.log(`Graded: ${graded.student_name} - ${graded.grade}`);
   * ```
   */
  async submitFeedback(
    submissionId: string,
    feedback: SubmitFeedbackDto
  ): Promise<Submission> {
    try {
      const { data } = await axiosInstance.post<Submission>(
        `${this.baseUrl}/${submissionId}/feedback`,
        feedback
      );
      return data;
    } catch (error) {
      console.error('[GradingAPI] Error submitting feedback:', error);
      throw error;
    }
  }

  /**
   * Grade multiple submissions at once (bulk grading)
   *
   * Allows grading multiple submissions in a single operation.
   * Useful for grading similar assignments or auto-grading simple exercises.
   *
   * @param bulkData - Bulk grading data with array of submission grades
   * @returns Promise<void>
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * await gradingApi.bulkGrade({
   *   submissions: [
   *     {
   *       submission_id: 'sub-1',
   *       score: 90,
   *       feedback: 'Excellent work!',
   *       grade: 'A'
   *     },
   *     {
   *       submission_id: 'sub-2',
   *       score: 75,
   *       feedback: 'Good effort, review question 2.',
   *       grade: 'C'
   *     },
   *     {
   *       submission_id: 'sub-3',
   *       score: 95,
   *       grade: 'A'
   *     }
   *   ]
   * });
   *
   * console.log('Bulk grading completed!');
   * ```
   */
  async bulkGrade(bulkData: BulkGradeDto): Promise<void> {
    try {
      await axiosInstance.post(`${this.baseUrl}/bulk-grade`, bulkData);
    } catch (error) {
      console.error('[GradingAPI] Error performing bulk grade:', error);
      throw error;
    }
  }

  /**
   * Get pending submissions count
   *
   * Returns the count of submissions waiting to be graded.
   * Useful for showing badge counts in UI.
   *
   * @param classroomId - Optional classroom filter
   * @returns Promise<number> Count of pending submissions
   * @throws Error if request fails
   *
   * @example
   * ```typescript
   * const pendingCount = await gradingApi.getPendingCount();
   * console.log(`${pendingCount} submissions waiting for review`);
   *
   * // For specific classroom
   * const classroomPending = await gradingApi.getPendingCount('classroom-123');
   * ```
   */
  async getPendingCount(classroomId?: string): Promise<number> {
    try {
      const submissions = await this.getSubmissions({
        status: 'pending',
        classroom_id: classroomId,
      });
      return submissions.length;
    } catch (error) {
      console.error('[GradingAPI] Error fetching pending count:', error);
      throw error;
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Singleton instance of GradingAPI
 * Use this instance for all grading-related API calls
 *
 * @example
 * ```typescript
 * import { gradingApi } from '@services/api/teacher';
 *
 * const submissions = await gradingApi.getSubmissions({ status: 'pending' });
 * const detail = await gradingApi.getSubmissionById('sub-123');
 * await gradingApi.submitFeedback('sub-123', { score: 85, feedback: '...' });
 * ```
 */
export const gradingApi = new GradingAPI();

/**
 * Export the class for testing purposes
 */
export { GradingAPI };
