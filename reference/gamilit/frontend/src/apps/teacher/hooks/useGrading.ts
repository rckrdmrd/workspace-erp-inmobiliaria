/**
 * useGrading Hook - Manage submissions and grading operations
 */

import { useState, useEffect, useCallback } from 'react';
import { gradingApi } from '@services/api/teacher';
import type { Submission } from '@apps/teacher/types';
import type {
  GetSubmissionsQueryDto,
  SubmitFeedbackDto,
  BulkGradeDto,
  SubmissionDetail,
} from '@services/api/teacher';

export interface UseGradingReturn {
  submissions: Submission[];
  pendingCount: number;
  loading: boolean;
  error: Error | null;
  getSubmissionDetail: (id: string) => Promise<SubmissionDetail>;
  grade: (submissionId: string, feedback: SubmitFeedbackDto) => Promise<void>;
  bulkGrade: (data: BulkGradeDto) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useGrading(filters?: GetSubmissionsQueryDto): UseGradingReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await gradingApi.getSubmissions(filters);
      setSubmissions(data);

      const pending = data.filter((s) => s.status === 'pending').length;
      setPendingCount(pending);
    } catch (err) {
      console.error('[useGrading] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const getSubmissionDetail = useCallback(async (id: string) => {
    return await gradingApi.getSubmissionById(id);
  }, []);

  const grade = useCallback(
    async (submissionId: string, feedback: SubmitFeedbackDto) => {
      try {
        await gradingApi.submitFeedback(submissionId, feedback);
        await fetchSubmissions(); // Refresh list
      } catch (err) {
        console.error('[useGrading] Error grading:', err);
        throw err;
      }
    },
    [fetchSubmissions]
  );

  const bulkGrade = useCallback(
    async (data: BulkGradeDto) => {
      try {
        await gradingApi.bulkGrade(data);
        await fetchSubmissions(); // Refresh list
      } catch (err) {
        console.error('[useGrading] Error bulk grading:', err);
        throw err;
      }
    },
    [fetchSubmissions]
  );

  return {
    submissions,
    pendingCount,
    loading,
    error,
    getSubmissionDetail,
    grade,
    bulkGrade,
    refresh: fetchSubmissions,
  };
}
