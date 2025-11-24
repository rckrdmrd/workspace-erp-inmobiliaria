import { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useReports } from '../hooks/useReports';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  Users,
  BookOpen,
  Trophy,
  Clock,
  CheckCircle,
} from 'lucide-react';

/**
 * AdminReportsPage - Generación de reportes del sistema
 * Updated: 2025-11-19 - Integrated with useReports hook (FE-059)
 */
export default function AdminReportsPage() {
  const { user, logout } = useAuth();
  const [startDate, setStartDate] = useState('2025-11-01');
  const [endDate, setEndDate] = useState('2025-11-19');
  const [reportType, setReportType] = useState('users');
  const [reportFormat, setReportFormat] = useState<'pdf' | 'excel' | 'csv' | 'json'>('pdf');

  // Use useReports hook
  const {
    reports,
    reportTypes,
    stats,
    loading,
    generating,
    error,
    fetchReports,
    generateReport,
    downloadReport,
  } = useReports();

  // Use useUserGamification hook (currently with mock data until backend endpoint is ready)
  const { gamificationData } = useUserGamification(user?.id);

  // Fallback gamification data in case hook fails or user is not loaded
  const displayGamificationData = gamificationData || {
    userId: user?.id || 'mock-admin-id',
    level: 1,
    totalXP: 0,
    mlCoins: 0,
    rank: 'Novato',
    achievements: [],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Fetch reports on mount
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // Icon mapping
  const iconMap: Record<string, any> = {
    Users,
    TrendingUp,
    BookOpen,
    Trophy,
    Clock,
    CheckCircle,
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport({
        type: reportType,
        startDate,
        endDate,
        format: reportFormat,
      });
      alert('Reporte generado correctamente');
    } catch (err) {
      alert('Error al generar reporte');
    }
  };

  return (
    <AdminLayout
      user={user || undefined}
      gamificationData={displayGamificationData}
      organizationName="GAMILIT Platform Admin"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-detective-text flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-500" />
            Reportes del Sistema
          </h1>
          <p className="text-detective-text-secondary mt-1">
            Genera y descarga reportes detallados de la plataforma
          </p>
        </div>

        {/* Generate Report Form */}
        <DetectiveCard>
          <h2 className="text-xl font-bold text-detective-text mb-4">Generar Nuevo Reporte</h2>

          <div className="space-y-4">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-detective-text mb-2">
                Tipo de Reporte
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {reportTypes.map((type) => {
                  const Icon = iconMap[type.icon] || FileText;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setReportType(type.id)}
                      className={`p-4 rounded-lg text-left transition-all ${
                        reportType === type.id
                          ? 'bg-detective-orange/20 border-2 border-detective-orange'
                          : 'bg-detective-bg-secondary hover:bg-detective-bg-secondary/70 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className={`w-6 h-6 ${type.color}`} />
                        <h3 className="font-bold text-detective-text text-sm">{type.name}</h3>
                      </div>
                      <p className="text-xs text-detective-text-secondary">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-detective-text mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-detective-text mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha Fin
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
                />
              </div>
            </div>

            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-detective-text mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Formato
              </label>
              <select
                value={reportFormat}
                onChange={(e) => setReportFormat(e.target.value as any)}
                className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel (XLSX)</option>
                <option value="csv">CSV</option>
                <option value="json">JSON</option>
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex gap-2">
              <DetectiveButton
                variant="primary"
                onClick={handleGenerateReport}
                disabled={generating}
                className="flex-1"
              >
                {generating ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generando...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Generar Reporte
                  </>
                )}
              </DetectiveButton>
              <DetectiveButton
                variant="outline"
                onClick={() => alert('Preview del reporte - Próximamente')}
                disabled={generating}
              >
                Vista Previa
              </DetectiveButton>
            </div>
          </div>
        </DetectiveCard>

        {/* Error Message */}
        {error && (
          <DetectiveCard>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-500">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          </DetectiveCard>
        )}

        {/* Generated Reports History */}
        <DetectiveCard>
          <h2 className="text-xl font-bold text-detective-text mb-4">Reportes Generados</h2>

          {loading && reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
              <p className="mt-4 text-detective-text-secondary">Cargando reportes...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-detective-text-secondary">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No hay reportes generados aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const reportTypeData = reportTypes.find((t) => t.id === report.type);
                const Icon = reportTypeData ? iconMap[reportTypeData.icon] || FileText : FileText;
                return (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 bg-detective-bg-secondary rounded-lg hover:bg-detective-bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={`w-6 h-6 ${reportTypeData?.color || 'text-gray-500'}`} />
                      <div>
                        <h3 className="font-bold text-detective-text">{report.name}</h3>
                        <p className="text-sm text-detective-text-secondary">
                          Generado: {new Date(report.generatedAt).toLocaleString('es-ES')} • {report.size} • {report.format}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <DetectiveButton
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id)}
                      >
                        <Download className="w-4 h-4" />
                        Descargar
                      </DetectiveButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DetectiveCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <FileText className="w-10 h-10 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-detective-text-secondary mb-1">Reportes Generados</p>
              <p className="text-2xl font-bold text-detective-text">{stats?.totalGenerated || 0}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <Download className="w-10 h-10 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-detective-text-secondary mb-1">Descargas Este Mes</p>
              <p className="text-2xl font-bold text-green-500">{stats?.downloadsThisMonth || 0}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <Clock className="w-10 h-10 text-orange-500 mx-auto mb-2" />
              <p className="text-sm text-detective-text-secondary mb-1">Último Reporte</p>
              <p className="text-sm font-bold text-orange-500">
                {stats?.lastReportTime && stats.lastReportTime !== 'Nunca'
                  ? new Date(stats.lastReportTime).toLocaleDateString('es-ES')
                  : 'Nunca'}
              </p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <TrendingUp className="w-10 h-10 text-purple-500 mx-auto mb-2" />
              <p className="text-sm text-detective-text-secondary mb-1">Más Generado</p>
              <p className="text-sm font-bold text-purple-500">{stats?.mostGenerated || 'N/A'}</p>
            </div>
          </DetectiveCard>
        </div>
      </div>
    </AdminLayout>
  );
}
