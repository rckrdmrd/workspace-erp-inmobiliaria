/**
 * useContentManagement Hook
 *
 * Comprehensive hook for managing content including pending exercises,
 * media library, and version control.
 *
 * Features:
 * - Pending exercises approval workflow
 * - Media library management
 * - Content version control
 * - Pagination and filtering
 * - Error handling and loading states
 *
 * Updated: 2025-11-19 - Integrated with adminAPI.ts (FE-059)
 * - Now uses adminAPI methods for content and media operations
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services/api/apiClient';
import * as adminAPI from '@/services/api/adminAPI';
import type { PendingExercise, MediaItem, ContentVersion, PaginatedResponse } from '../types';

// ============================================================================
// TYPES
// ============================================================================

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'facil' | 'medio' | 'dificil' | 'experto';
  points: number;
  type: string;
  instructions: string;
  content: any;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface UsePendingExercisesResult {
  pendingExercises: PendingExercise[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  fetchPendingExercises: (page?: number, pageSize?: number) => Promise<void>;
  approveExercise: (id: string) => Promise<void>;
  rejectExercise: (id: string, reason: string) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

export interface UseMediaLibraryResult {
  media: MediaItem[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
  storageUsed: number;
  storageLimit: number;
  fetchMedia: (page?: number, pageSize?: number) => Promise<void>;
  uploadFile: (file: File, tags?: string[]) => Promise<MediaItem>;
  deleteMedia: (id: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>; // Alias for deleteMedia
  bulkDelete: (ids: string[]) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  updateFile?: (id: string, updates: Partial<MediaItem>) => Promise<MediaItem>;
}

export interface UseContentVersionsResult {
  versions: ContentVersion[];
  loading: boolean;
  error: string | null;
  fetchVersions: (contentId?: string) => Promise<void>;
  createVersion: (contentId: string, changes: string) => Promise<void>;
}

// ============================================================================
// PENDING EXERCISES HOOK
// ============================================================================

export function usePendingExercises(): UsePendingExercisesResult {
  const [pendingExercises, setPendingExercises] = useState<PendingExercise[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const fetchPendingExercises = useCallback(
    async (newPage?: number, newPageSize?: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminAPI.getPendingContent({
          page: newPage || page,
          limit: newPageSize || pageSize,
        });

        // adminAPI returns { items: T[], pagination: {...} }
        setPendingExercises(response.items);
        setTotal(response.pagination.totalItems);
        if (newPage) setPage(newPage);
        if (newPageSize) setPageSize(newPageSize);
      } catch (err) {
        console.error('Failed to fetch pending exercises:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pending exercises');
        setPendingExercises([]);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const approveExercise = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await adminAPI.approveContent(id);

        // Remove from pending list
        setPendingExercises((prev) => prev.filter((ex) => ex.id !== id));
        setTotal((prev) => prev - 1);
      } catch (err) {
        console.error('Failed to approve exercise:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to approve exercise';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const rejectExercise = useCallback(
    async (id: string, reason: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await adminAPI.rejectContent(id, reason);

        // Remove from pending list
        setPendingExercises((prev) => prev.filter((ex) => ex.id !== id));
        setTotal((prev) => prev - 1);
      } catch (err) {
        console.error('Failed to reject exercise:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to reject exercise';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchPendingExercises();
  }, []);

  return {
    pendingExercises,
    loading,
    error,
    total,
    page,
    pageSize,
    fetchPendingExercises,
    approveExercise,
    rejectExercise,
    setPage,
    setPageSize,
  };
}

// ============================================================================
// MEDIA LIBRARY HOOK
// ============================================================================

export function useMediaLibrary(): UseMediaLibraryResult {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit, setStorageLimit] = useState(0);

  const fetchMedia = useCallback(
    async (newPage?: number, newPageSize?: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<{
          success: boolean;
          data: PaginatedResponse<MediaItem> & { storageUsed: number; storageLimit: number };
        }>(API_ENDPOINTS.admin.content.mediaLibrary, {
          params: {
            page: newPage || page,
            limit: newPageSize || pageSize,
          },
        });

        const data = response.data.success
          ? response.data.data
          : (response.data as unknown as PaginatedResponse<MediaItem> & { storageUsed: number; storageLimit: number });

        setMedia(data.data);
        setTotal(data.total);
        setStorageUsed(data.storageUsed || 0);
        setStorageLimit(data.storageLimit || 0);
        if (newPage) setPage(newPage);
        if (newPageSize) setPageSize(newPageSize);
      } catch (err) {
        console.error('Failed to fetch media:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch media');
        setMedia([]);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const uploadFile = useCallback(
    async (file: File, tags: string[] = []): Promise<MediaItem> => {
      setLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', JSON.stringify(tags));

        const response = await apiClient.post<{ success: boolean; data: MediaItem }>(
          API_ENDPOINTS.admin.content.mediaLibrary,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        const newMedia = response.data.success ? response.data.data : (response.data as unknown as MediaItem);

        // Refresh media list
        await fetchMedia();

        return newMedia;
      } catch (err) {
        console.error('Failed to upload file:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to upload file';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [fetchMedia]
  );

  const deleteMedia = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.delete(API_ENDPOINTS.admin.content.deleteMedia(id));

        // Remove from local state
        setMedia((prev) => prev.filter((m) => m.id !== id));
        setTotal((prev) => prev - 1);
      } catch (err) {
        console.error('Failed to delete media:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete media';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const bulkDelete = useCallback(
    async (ids: string[]): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all(ids.map((id) => apiClient.delete(API_ENDPOINTS.admin.content.deleteMedia(id))));

        // Remove from local state
        setMedia((prev) => prev.filter((m) => !ids.includes(m.id)));
        setTotal((prev) => prev - ids.length);
      } catch (err) {
        console.error('Failed to bulk delete media:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to bulk delete media';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchMedia();
  }, []);

  return {
    media,
    loading,
    error,
    total,
    page,
    pageSize,
    storageUsed,
    storageLimit,
    fetchMedia,
    uploadFile,
    deleteMedia,
    deleteFile: deleteMedia, // Alias for backward compatibility
    bulkDelete,
    setPage,
    setPageSize,
  };
}

// ============================================================================
// CONTENT VERSIONS HOOK
// ============================================================================

export function useContentVersions(): UseContentVersionsResult {
  const [versions, setVersions] = useState<ContentVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVersions = useCallback(async (contentId?: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ success: boolean; data: ContentVersion[] }>(
        API_ENDPOINTS.admin.content.createVersion,
        {
          params: contentId ? { contentId } : undefined,
        }
      );

      const data = response.data.success ? response.data.data : (response.data as unknown as ContentVersion[]);
      setVersions(data);
    } catch (err) {
      console.error('Failed to fetch versions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch versions');
      setVersions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const createVersion = useCallback(
    async (contentId: string, changes: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post<{ success: boolean; data: ContentVersion }>(
          API_ENDPOINTS.admin.content.createVersion,
          {
            contentId,
            changes,
          }
        );

        const newVersion = response.data.success ? response.data.data : (response.data as unknown as ContentVersion);

        // Add to versions list
        setVersions((prev) => [newVersion, ...prev]);
      } catch (err) {
        console.error('Failed to create version:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to create version';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    versions,
    loading,
    error,
    fetchVersions,
    createVersion,
  };
}

// ============================================================================
// APPROVALS HOOK
// ============================================================================

export interface ApprovalItem {
  id: string;
  type: 'exercise' | 'content' | 'media';
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  // Content data (varies by type)
  content?: Record<string, any>;
}

export interface UseApprovalsResult {
  approvals: ApprovalItem[];
  loading: boolean;
  error: string | null;
  approve: (id: string) => Promise<void>;
  reject: (id: string, reason: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useApprovals(): UseApprovalsResult {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApprovals = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/admin/approvals');
      const data = response.data.success ? response.data.data : response.data;
      setApprovals(data.approvals || []);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch approvals');
      setApprovals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const approve = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.post(`/admin/approvals/${id}/approve`);
        setApprovals((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Failed to approve item:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to approve item';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const reject = useCallback(
    async (id: string, reason: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await apiClient.post(`/admin/approvals/${id}/reject`, { reason });
        setApprovals((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error('Failed to reject item:', err);
        const errorMsg = err instanceof Error ? err.message : 'Failed to reject item';
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchApprovals();
  }, []);

  return {
    approvals,
    loading,
    error,
    approve,
    reject,
    refresh: fetchApprovals,
  };
}

// ============================================================================
// LEGACY EXPORTS (for backward compatibility)
// ============================================================================

export function useExercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    try {
      const response = await apiClient.get('/educational/exercises');
      const data = response.data.success ? response.data.data : response.data;
      setExercises(data.exercises || []);
    } catch (err) {
      console.error('Failed to fetch exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const createExercise = async (exercise: Partial<Exercise>) => {
    const response = await apiClient.post('/educational/exercises', exercise);
    await fetchExercises();
    return response.data.success ? response.data.data : response.data;
  };

  const updateExercise = async (id: string, updates: Partial<Exercise>) => {
    await apiClient.patch(`/educational/exercises/${id}`, updates);
    await fetchExercises();
  };

  const deleteExercise = async (id: string) => {
    await apiClient.delete(`/educational/exercises/${id}`);
    await fetchExercises();
  };

  const duplicateExercise = async (id: string) => {
    const exercise = exercises.find((e) => e.id === id);
    if (!exercise) return;

    const duplicate = { ...exercise, title: `${exercise.title} (Copy)`, id: undefined };
    await createExercise(duplicate);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return { exercises, loading, createExercise, updateExercise, deleteExercise, duplicateExercise, refresh: fetchExercises };
}
