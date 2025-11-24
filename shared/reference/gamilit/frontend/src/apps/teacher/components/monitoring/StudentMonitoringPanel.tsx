import React, { useState } from 'react';
import { Search, Filter, RefreshCw, Users } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { InputDetective } from '@shared/components/base/InputDetective';
import { StudentStatusCard } from './StudentStatusCard';
import { StudentDetailModal } from './StudentDetailModal';
import { useStudentMonitoring } from '../../hooks/useStudentMonitoring';
import type { StudentFilter, StudentMonitoring } from '../../types';

interface StudentMonitoringPanelProps {
  classroomId: string;
}

export function StudentMonitoringPanel({ classroomId }: StudentMonitoringPanelProps) {
  const [filters, setFilters] = useState<StudentFilter>({});
  const [selectedStudent, setSelectedStudent] = useState<StudentMonitoring | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { students, loading, error, autoRefresh, setAutoRefresh, refresh } = useStudentMonitoring(
    classroomId,
    filters
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters((prev) => ({ ...prev, search: value }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => {
      const currentStatuses = prev.status || [];
      const newStatuses = currentStatuses.includes(status as any)
        ? currentStatuses.filter((s) => s !== status)
        : [...currentStatuses, status as any];

      return {
        ...prev,
        status: newStatuses.length > 0 ? newStatuses : undefined,
      };
    });
  };

  const activeCount = students.filter((s) => s.status === 'active').length;
  const inactiveCount = students.filter((s) => s.status === 'inactive').length;
  const offlineCount = students.filter((s) => s.status === 'offline').length;

  if (error) {
    return (
      <DetectiveCard>
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
          <DetectiveButton onClick={refresh} variant="secondary" className="mt-4">
            Reintentar
          </DetectiveButton>
        </div>
      </DetectiveCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-detective-orange" />
          <div>
            <h2 className="text-2xl font-bold text-detective-text">Monitoreo de Estudiantes</h2>
            <p className="text-detective-text-secondary">Vista en tiempo real del aula</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-detective-text">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-detective-orange text-detective-orange focus:ring-detective-orange"
            />
            Auto-refresh
          </label>
          <DetectiveButton onClick={refresh} variant="secondary" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </DetectiveButton>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-detective-text">{students.length}</p>
              <p className="text-sm text-detective-text-secondary">Total Estudiantes</p>
            </div>
            <Users className="w-8 h-8 text-detective-orange" />
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-500">{activeCount}</p>
              <p className="text-sm text-detective-text-secondary">🟢 Activos</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-yellow-500">{inactiveCount}</p>
              <p className="text-sm text-detective-text-secondary">🟡 Inactivos</p>
            </div>
          </div>
        </DetectiveCard>

        <DetectiveCard hoverable={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-500">{offlineCount}</p>
              <p className="text-sm text-detective-text-secondary">🔴 Offline</p>
            </div>
          </div>
        </DetectiveCard>
      </div>

      {/* Search and Filters */}
      <DetectiveCard>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-detective-text-secondary" />
                <InputDetective
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <DetectiveButton
                variant={filters.status?.includes('active') ? 'primary' : 'secondary'}

                onClick={() => handleStatusFilter('active')}
              >
                🟢 Activos
              </DetectiveButton>
              <DetectiveButton
                variant={filters.status?.includes('inactive') ? 'primary' : 'secondary'}

                onClick={() => handleStatusFilter('inactive')}
              >
                🟡 Inactivos
              </DetectiveButton>
              <DetectiveButton
                variant={filters.status?.includes('offline') ? 'primary' : 'secondary'}

                onClick={() => handleStatusFilter('offline')}
              >
                🔴 Offline
              </DetectiveButton>
            </div>
          </div>
        </div>
      </DetectiveCard>

      {/* Students Grid */}
      {loading && !students.length ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-detective-orange animate-spin mx-auto mb-4" />
          <p className="text-detective-text-secondary">Cargando estudiantes...</p>
        </div>
      ) : students.length === 0 ? (
        <DetectiveCard>
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-detective-text-secondary mx-auto mb-4" />
            <p className="text-detective-text-secondary">No se encontraron estudiantes</p>
          </div>
        </DetectiveCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentStatusCard
              key={student.id}
              student={student}
              onClick={() => setSelectedStudent(student)}
            />
          ))}
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
