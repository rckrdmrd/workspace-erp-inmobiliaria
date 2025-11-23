/**
 * useStudentProgress Hook - Fetch and manage individual student progress data
 */

import { useState, useEffect, useCallback } from 'react';
import { studentProgressApi } from '@services/api/teacher';
import type {
  StudentProgress,
  StudentOverview,
  StudentStats,
  StudentNote,
  AddTeacherNoteDto,
} from '@services/api/teacher';

export interface UseStudentProgressReturn {
  progress: StudentProgress | null;
  overview: StudentOverview | null;
  stats: StudentStats | null;
  notes: StudentNote[];
  loading: boolean;
  error: Error | null;
  addNote: (note: AddTeacherNoteDto) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useStudentProgress(studentId: string): UseStudentProgressReturn {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [overview, setOverview] = useState<StudentOverview | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [notes, setNotes] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudentData = useCallback(async () => {
    if (!studentId) return;

    try {
      setLoading(true);
      setError(null);

      const [progressData, overviewData, statsData, notesData] = await Promise.all([
        studentProgressApi.getStudentProgress(studentId),
        studentProgressApi.getStudentOverview(studentId),
        studentProgressApi.getStudentStats(studentId),
        studentProgressApi.getStudentNotes(studentId),
      ]);

      setProgress(progressData);
      setOverview(overviewData);
      setStats(statsData);
      setNotes(notesData);
    } catch (err) {
      console.error('[useStudentProgress] Error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const addNote = useCallback(
    async (note: AddTeacherNoteDto) => {
      try {
        const newNote = await studentProgressApi.addStudentNote(studentId, note);
        setNotes((prev) => [newNote, ...prev]);
      } catch (err) {
        console.error('[useStudentProgress] Error adding note:', err);
        throw err;
      }
    },
    [studentId]
  );

  return {
    progress,
    overview,
    stats,
    notes,
    loading,
    error,
    addNote,
    refresh: fetchStudentData,
  };
}
