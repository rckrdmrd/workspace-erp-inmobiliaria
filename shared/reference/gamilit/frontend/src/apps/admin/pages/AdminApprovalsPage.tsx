import React, { useState } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  AlertCircle,
  BookOpen,
  Image,
  FileText,
} from 'lucide-react';

/**
 * AdminApprovalsPage - Gestión de aprobaciones de contenido
 */
export default function AdminApprovalsPage() {
  const { user, logout } = useAuth();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('pending');

  const gamificationData = {
    userId: user?.id || 'mock-admin-id',
    level: 20,
    totalXP: 5000,
    mlCoins: 2500,
    rank: 'Super Admin',
    achievements: ['admin_master', 'content_approver'],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Mock data de aprobaciones pendientes
  const mockApprovals = [
    {
      id: '1',
      type: 'exercise',
      title: 'Ejercicio de Comprensión Literal: Marie Curie',
      author: 'Prof. Carlos Méndez',
      authorEmail: 'carlos.mendez@school.edu',
      submittedAt: '2025-11-10 14:30',
      status: 'pending',
      module: 'Módulo 1',
      priority: 'high',
    },
    {
      id: '2',
      type: 'media',
      title: 'Imagen: Tabla Periódica Ilustrada',
      author: 'Prof. Ana García',
      authorEmail: 'ana.garcia@school.edu',
      submittedAt: '2025-11-10 10:15',
      status: 'pending',
      module: 'Recursos',
      priority: 'medium',
    },
    {
      id: '3',
      type: 'exercise',
      title: 'Ejercicio de Análisis Crítico: Frida Kahlo',
      author: 'Prof. María López',
      authorEmail: 'maria.lopez@school2.edu',
      submittedAt: '2025-11-09 16:45',
      status: 'pending',
      module: 'Módulo 3',
      priority: 'low',
    },
    {
      id: '4',
      type: 'content',
      title: 'Actualización de contenido: Leonardo da Vinci',
      author: 'Prof. Roberto Sánchez',
      authorEmail: 'roberto.sanchez@school.edu',
      submittedAt: '2025-11-11 09:00',
      status: 'pending',
      module: 'Módulo 2',
      priority: 'high',
    },
  ];

  const stats = {
    pending: mockApprovals.filter((a) => a.status === 'pending').length,
    approved: 15,
    rejected: 3,
    total: mockApprovals.length + 15 + 3,
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      exercise: <BookOpen className="w-5 h-5 text-blue-500" />,
      media: <Image className="w-5 h-5 text-purple-500" />,
      content: <FileText className="w-5 h-5 text-green-500" />,
    };
    return icons[type] || <FileText className="w-5 h-5 text-gray-500" />;
  };

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      exercise: { label: 'Ejercicio', className: 'bg-blue-100 text-blue-700' },
      media: { label: 'Media', className: 'bg-purple-100 text-purple-700' },
      content: { label: 'Contenido', className: 'bg-green-100 text-green-700' },
    };
    const badge = badges[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { className: string }> = {
      high: { className: 'bg-red-100 text-red-700' },
      medium: { className: 'bg-yellow-100 text-yellow-700' },
      low: { className: 'bg-gray-100 text-gray-700' },
    };
    const badge = badges[priority] || badges.medium;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
        {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
      </span>
    );
  };

  const filteredApprovals = mockApprovals.filter((a) => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesType && matchesStatus;
  });

  return (
    <AdminLayout
      user={user || undefined}
      gamificationData={gamificationData}
      organizationName="GAMILIT Platform Admin"
      onLogout={handleLogout}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-detective-text flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            Aprobaciones de Contenido
          </h1>
          <p className="text-detective-text-secondary mt-1">
            Revisa y aprueba contenido enviado por profesores
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <DetectiveCard hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-detective-text-secondary mb-1">Pendientes</p>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-orange-500 opacity-50" />
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-detective-text-secondary mb-1">Aprobadas</p>
                <p className="text-2xl font-bold text-green-500">{stats.approved}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-detective-text-secondary mb-1">Rechazadas</p>
                <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
              </div>
              <XCircle className="w-10 h-10 text-red-500 opacity-50" />
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-detective-text-secondary mb-1">Total</p>
                <p className="text-2xl font-bold text-detective-text">{stats.total}</p>
              </div>
              <AlertCircle className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </DetectiveCard>
        </div>

        {/* Filters */}
        <DetectiveCard>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-detective-text mb-2">
                Tipo de Contenido
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
              >
                <option value="all">Todos los tipos</option>
                <option value="exercise">Ejercicios</option>
                <option value="media">Media</option>
                <option value="content">Contenido</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-detective-text mb-2">
                Estado
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendientes</option>
                <option value="approved">Aprobadas</option>
                <option value="rejected">Rechazadas</option>
              </select>
            </div>
          </div>
        </DetectiveCard>

        {/* Approvals List */}
        <div className="space-y-4">
          {filteredApprovals.map((approval) => (
            <DetectiveCard key={approval.id}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {getTypeIcon(approval.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-detective-text mb-1">
                        {approval.title}
                      </h3>
                      <p className="text-sm text-detective-text-secondary">
                        Por {approval.author} ({approval.authorEmail})
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {getTypeBadge(approval.type)}
                      {getPriorityBadge(approval.priority)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-detective-text-secondary mb-4">
                    <span>Módulo: {approval.module}</span>
                    <span>•</span>
                    <span>Enviado: {approval.submittedAt}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <DetectiveButton
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`Ver detalles: ${approval.title}`)}
                    >
                      <Eye className="w-4 h-4" />
                      Ver Detalles
                    </DetectiveButton>
                    <DetectiveButton
                      variant="primary"
                      size="sm"
                      onClick={() => alert(`Aprobar: ${approval.title}`)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Aprobar
                    </DetectiveButton>
                    <DetectiveButton
                      variant="danger"
                      size="sm"
                      onClick={() => alert(`Rechazar: ${approval.title}`)}
                    >
                      <XCircle className="w-4 h-4" />
                      Rechazar
                    </DetectiveButton>
                  </div>
                </div>
              </div>
            </DetectiveCard>
          ))}

          {filteredApprovals.length === 0 && (
            <DetectiveCard>
              <div className="text-center py-8 text-detective-text-secondary">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No hay elementos que coincidan con los filtros</p>
              </div>
            </DetectiveCard>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
