import { useState, useEffect } from 'react';
import { apiClient } from '@/services/api/apiClient';

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface ErrorLog {
  id: string;
  type: string;
  message: string;
  endpoint: string;
  stackTrace?: string;
  affectedUsers: number;
  frequency: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
}

export function useUserActivity(filters?: { role?: string; dateFrom?: string; action?: string }) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [activeSessions, setActiveSessions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const params = new URLSearchParams(filters as any);
        const response = await apiClient.get(`/admin/activity?${params}`);
        const data = response.data.success ? response.data.data : response.data;

        setActivities(data.activities || []);
        setOnlineUsers(data.onlineUsers || 0);
        setActiveSessions(data.activeSessions || 0);
      } catch (err) {
        console.error('Failed to fetch activity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
    const interval = setInterval(fetchActivity, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [JSON.stringify(filters)]);

  return { activities, onlineUsers, activeSessions, loading };
}

export function useErrorTracking(filters?: { severity?: string; resolved?: boolean }) {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchErrors = async () => {
    try {
      const params = new URLSearchParams(filters as any);
      const response = await apiClient.get(`/admin/errors?${params}`);
      const data = response.data.success ? response.data.data : response.data;
      setErrors(data.errors || []);
    } catch (err) {
      console.error('Failed to fetch errors:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsResolved = async (errorId: string) => {
    try {
      await apiClient.patch(`/admin/errors/${errorId}/resolve`);
      fetchErrors(); // Refresh list
    } catch (err) {
      console.error('Failed to mark error as resolved:', err);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, [JSON.stringify(filters)]);

  return { errors, loading, markAsResolved, refresh: fetchErrors };
}

export function useExportData() {
  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map((row) => headers.map((header) => JSON.stringify(row[header] || '')).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return { exportToCSV };
}
