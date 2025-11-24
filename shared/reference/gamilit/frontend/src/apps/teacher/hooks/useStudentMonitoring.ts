import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/apiClient';
import type { StudentMonitoring, StudentFilter } from '../types';

export function useStudentMonitoring(classroomId: string, filters?: StudentFilter) {
  const [students, setStudents] = useState<StudentMonitoring[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string> = {};
        if (filters?.status) {
          params.status = filters.status.join(',');
        }
        if (filters?.module_id) {
          params.module_id = filters.module_id;
        }
        if (filters?.score_range) {
          params.min_score = filters.score_range.min.toString();
          params.max_score = filters.score_range.max.toString();
        }
        if (filters?.search) {
          params.search = filters.search;
        }

        const response = await apiClient.get(`/progress/classroom/${classroomId}/students`, {
          params,
        });

        const { data } = response.data;
        setStudents(data.students || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching students:', err);
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchStudents();
    }
  }, [classroomId, filters]);

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh || !classroomId) return;

    const interval = setInterval(async () => {
      try {
        const response = await apiClient.get(`/progress/classroom/${classroomId}/students`);
        const { data } = response.data;
        setStudents(data.students || []);
      } catch (err) {
        console.error('Error in auto-refresh:', err);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [classroomId, autoRefresh]);

  const refresh = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);
      const response = await apiClient.get(`/progress/classroom/${classroomId}/students`);
      const { data } = response.data;
      setStudents(data.students || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    students,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    refresh,
  };
}
