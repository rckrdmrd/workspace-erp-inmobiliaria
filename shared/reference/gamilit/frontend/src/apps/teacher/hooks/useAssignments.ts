/**
 * useAssignments Hook - Manage assignments and submissions
 */

import { useState, useEffect, useCallback } from 'react';
import { assignmentsApi } from '@services/api/teacher';
import type { Assignment, Submission, Exercise } from '@apps/teacher/types';
import type {
  GetAssignmentsQueryDto,
  CreateAssignmentDto,
  UpdateAssignmentDto,
  GradeSubmissionDto,
} from '@services/api/teacher';

export interface UseAssignmentsReturn {
  assignments: Assignment[];
  exercises: Exercise[];
  loading: boolean;
  error: Error | null;
  getAssignmentById: (id: string) => Promise<Assignment>;
  createAssignment: (data: CreateAssignmentDto) => Promise<Assignment>;
  updateAssignment: (id: string, data: UpdateAssignmentDto) => Promise<Assignment>;
  deleteAssignment: (id: string) => Promise<void>;
  getSubmissions: (assignmentId: string) => Promise<Submission[]>;
  gradeSubmission: (submissionId: string, data: GradeSubmissionDto) => Promise<Submission>;
  refresh: () => Promise<void>;
}

export function useAssignments(filters?: GetAssignmentsQueryDto): UseAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [assignmentsData, exercisesData] = await Promise.all([
        assignmentsApi.getAssignments(filters),
        assignmentsApi.getAvailableExercises(),
      ]);

      setAssignments(assignmentsData);
      setExercises(exercisesData);
    } catch (err) {
      console.error('[useAssignments] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const getAssignmentById = useCallback(async (id: string) => {
    return await assignmentsApi.getAssignmentById(id);
  }, []);

  const createAssignment = useCallback(
    async (data: CreateAssignmentDto) => {
      try {
        const newAssignment = await assignmentsApi.createAssignment(data);
        await fetchAssignments(); // Refresh list
        return newAssignment;
      } catch (err) {
        console.error('[useAssignments] Error creating assignment:', err);
        throw err;
      }
    },
    [fetchAssignments]
  );

  const updateAssignment = useCallback(
    async (id: string, data: UpdateAssignmentDto) => {
      try {
        const updatedAssignment = await assignmentsApi.updateAssignment(id, data);
        await fetchAssignments(); // Refresh list
        return updatedAssignment;
      } catch (err) {
        console.error('[useAssignments] Error updating assignment:', err);
        throw err;
      }
    },
    [fetchAssignments]
  );

  const deleteAssignment = useCallback(
    async (id: string) => {
      try {
        await assignmentsApi.deleteAssignment(id);
        await fetchAssignments(); // Refresh list
      } catch (err) {
        console.error('[useAssignments] Error deleting assignment:', err);
        throw err;
      }
    },
    [fetchAssignments]
  );

  const getSubmissions = useCallback(async (assignmentId: string) => {
    try {
      return await assignmentsApi.getAssignmentSubmissions(assignmentId);
    } catch (err) {
      console.error('[useAssignments] Error fetching submissions:', err);
      throw err;
    }
  }, []);

  const gradeSubmission = useCallback(
    async (submissionId: string, data: GradeSubmissionDto) => {
      try {
        return await assignmentsApi.gradeSubmission(submissionId, data);
      } catch (err) {
        console.error('[useAssignments] Error grading submission:', err);
        throw err;
      }
    },
    []
  );

  return {
    assignments,
    exercises,
    loading,
    error,
    getAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    getSubmissions,
    gradeSubmission,
    refresh: fetchAssignments,
  };
}
