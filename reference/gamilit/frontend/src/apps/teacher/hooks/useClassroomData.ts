import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/apiClient';
import type { ClassroomData, ModuleProgress } from '../types';

export function useClassroomData(classroomId: string) {
  const [data, setData] = useState<ClassroomData | null>(null);
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClassroomData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch classroom general data
        const classroomResponse = await apiClient.get(`/classroom/${classroomId}`);
        const classroomData = classroomResponse.data.data;

        // Fetch module progress
        const progressResponse = await apiClient.get(`/analytics/classroom/${classroomId}/modules`);
        const progressData = progressResponse.data.data;

        setData(classroomData);
        setModuleProgress(progressData.modules || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching classroom data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (classroomId) {
      fetchClassroomData();
    }
  }, [classroomId]);

  const refresh = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);
      const classroomResponse = await apiClient.get(`/classroom/${classroomId}`);
      const classroomData = classroomResponse.data.data;

      const progressResponse = await apiClient.get(`/analytics/classroom/${classroomId}/modules`);
      const progressData = progressResponse.data.data;

      setData(classroomData);
      setModuleProgress(progressData.modules || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    moduleProgress,
    loading,
    error,
    refresh,
  };
}
