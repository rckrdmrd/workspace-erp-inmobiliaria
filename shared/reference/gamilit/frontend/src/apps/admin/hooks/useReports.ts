/**
 * useReports Hook
 *
 * Manages system reports generation, listing, and download.
 * Updated: 2025-11-19 - Created for AdminReportsPage integration (FE-059)
 */

import { useState, useCallback } from 'react';
import { adminAPI } from '@/services/api/adminAPI';

export interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  formats: string[];
}

export interface GeneratedReport {
  id: string;
  type: string;
  name: string;
  generatedAt: string;
  size: string;
  format: string;
  downloadUrl?: string;
}

export interface ReportGenerationParams {
  type: string;
  startDate: string;
  endDate: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  filters?: Record<string, any>;
}

export interface ReportStats {
  totalGenerated: number;
  downloadsThisMonth: number;
  lastReportTime: string;
  mostGenerated: string;
}

export interface UseReportsResult {
  // Data
  reports: GeneratedReport[];
  reportTypes: ReportType[];
  stats: ReportStats | null;

  // State
  loading: boolean;
  generating: boolean;
  error: string | null;

  // Actions
  fetchReports: () => Promise<void>;
  generateReport: (params: ReportGenerationParams) => Promise<void>;
  downloadReport: (reportId: string) => Promise<void>;
  deleteReport: (reportId: string) => Promise<void>;
}

// Mock report types until backend provides them
const DEFAULT_REPORT_TYPES: ReportType[] = [
  {
    id: 'users',
    name: 'Reporte de Usuarios',
    description: 'Información completa de usuarios registrados y actividad',
    icon: 'Users',
    color: 'text-blue-500',
    formats: ['pdf', 'excel', 'csv'],
  },
  {
    id: 'progress',
    name: 'Reporte de Progreso',
    description: 'Progreso de estudiantes por módulo y ejercicio',
    icon: 'TrendingUp',
    color: 'text-green-500',
    formats: ['pdf', 'excel'],
  },
  {
    id: 'exercises',
    name: 'Reporte de Ejercicios',
    description: 'Estadísticas de ejercicios completados y rendimiento',
    icon: 'BookOpen',
    color: 'text-purple-500',
    formats: ['pdf', 'excel', 'csv'],
  },
  {
    id: 'gamification',
    name: 'Reporte de Gamificación',
    description: 'Uso de logros, rangos y ML Coins',
    icon: 'Trophy',
    color: 'text-detective-gold',
    formats: ['pdf', 'excel'],
  },
  {
    id: 'usage',
    name: 'Reporte de Uso de Plataforma',
    description: 'Estadísticas de acceso y tiempo de uso',
    icon: 'Clock',
    color: 'text-orange-500',
    formats: ['pdf', 'excel', 'csv', 'json'],
  },
  {
    id: 'completion',
    name: 'Reporte de Completitud',
    description: 'Tasas de completitud por institución y módulo',
    icon: 'CheckCircle',
    color: 'text-green-500',
    formats: ['pdf', 'excel'],
  },
];

export function useReports(): UseReportsResult {
  // State
  const [reports, setReports] = useState<GeneratedReport[]>([]);
  const [reportTypes] = useState<ReportType[]>(DEFAULT_REPORT_TYPES);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch list of generated reports
   */
  const fetchReports = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminAPI.reports.list();
      setReports(response);

      // Calculate stats from reports
      if (response.length > 0) {
        const now = new Date();
        const thisMonth = response.filter(r => {
          const generatedDate = new Date(r.generatedAt);
          return generatedDate.getMonth() === now.getMonth() &&
                 generatedDate.getFullYear() === now.getFullYear();
        });

        // Count by type
        const typeCounts: Record<string, number> = {};
        response.forEach(r => {
          typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
        });
        const mostGenerated = Object.entries(typeCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

        const sortedByDate = [...response].sort((a, b) =>
          new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        );

        setStats({
          totalGenerated: response.length,
          downloadsThisMonth: thisMonth.length,
          lastReportTime: sortedByDate[0]?.generatedAt || 'N/A',
          mostGenerated: DEFAULT_REPORT_TYPES.find(t => t.id === mostGenerated)?.name || mostGenerated,
        });
      } else {
        setStats({
          totalGenerated: 0,
          downloadsThisMonth: 0,
          lastReportTime: 'Nunca',
          mostGenerated: 'N/A',
        });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar reportes';
      setError(message);
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generate a new report
   */
  const generateReport = useCallback(async (params: ReportGenerationParams): Promise<void> => {
    setGenerating(true);
    setError(null);
    try {
      await adminAPI.reports.generate(params);

      // Refresh report list
      await fetchReports();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al generar reporte';
      setError(message);
      console.error('Failed to generate report:', err);
      throw err;
    } finally {
      setGenerating(false);
    }
  }, [fetchReports]);

  /**
   * Download a report
   */
  const downloadReport = useCallback(async (reportId: string): Promise<void> => {
    try {
      await adminAPI.reports.download(reportId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al descargar reporte';
      setError(message);
      console.error('Failed to download report:', err);
      throw err;
    }
  }, []);

  /**
   * Delete a report
   */
  const deleteReport = useCallback(async (reportId: string): Promise<void> => {
    setError(null);
    try {
      await adminAPI.reports.delete(reportId);

      // Update local state
      setReports(prev => prev.filter(r => r.id !== reportId));

      // Refresh stats
      await fetchReports();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar reporte';
      setError(message);
      console.error('Failed to delete report:', err);
      throw err;
    }
  }, [fetchReports]);

  return {
    // Data
    reports,
    reportTypes,
    stats,

    // State
    loading,
    generating,
    error,

    // Actions
    fetchReports,
    generateReport,
    downloadReport,
    deleteReport,
  };
}
