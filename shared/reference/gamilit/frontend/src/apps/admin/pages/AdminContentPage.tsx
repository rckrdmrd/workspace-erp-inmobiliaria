import { useState } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DataTable, Column } from '@shared/components/common/DataTable';
import { Modal } from '@shared/components/common/Modal';
import { FormField } from '@shared/components/common/FormField';
import { CheckCircle, XCircle, Upload, Trash2, Image, FileText, History } from 'lucide-react';
import { usePendingExercises, useMediaLibrary, useContentVersions } from '../hooks/useContentManagement';
import type { PendingExercise, MediaItem, ContentVersion } from '../types';

/**
 * AdminContentPage - Gestión y moderación de contenido
 * Updated: 2025-11-19 - Migrated to use AdminLayout with sidebar
 */
export default function AdminContentPage() {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'pending' | 'media' | 'versions'>('pending');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<PendingExercise | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Hooks for data management
  const {
    pendingExercises,
    loading: loadingPending,
    error: errorPending,
    approveExercise,
    rejectExercise,
  } = usePendingExercises();

  const {
    media: mediaItems,
    loading: loadingMedia,
    error: errorMedia,
    deleteMedia,
    uploadFile,
  } = useMediaLibrary();

  const {
    versions,
    loading: loadingVersions,
    error: errorVersions,
  } = useContentVersions();

  // TODO: Replace with useUserGamification hook when backend endpoint is ready
  const gamificationData = {
    userId: user?.id || 'mock-admin-id',
    level: 20,
    totalXP: 5000,
    mlCoins: 2500,
    rank: 'Super Admin',
    achievements: ['admin_master', 'content_moderator'],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleApproveExercise = async (exerciseId: string) => {
    try {
      await approveExercise(exerciseId);
    } catch (err) {
      console.error('Failed to approve exercise:', err);
    }
  };

  const handleRejectExercise = async () => {
    if (!selectedExercise) return;
    try {
      await rejectExercise(selectedExercise.id, rejectReason);
      setIsRejectModalOpen(false);
      setSelectedExercise(null);
      setRejectReason('');
    } catch (err) {
      console.error('Failed to reject exercise:', err);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      await deleteMedia(mediaId);
    } catch (err) {
      console.error('Failed to delete media:', err);
    }
  };

  const handleUploadMedia = () => {
    // Create file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*,audio/*';
    input.onchange = async (e: any) => {
      const file = e.target?.files?.[0];
      if (!file) return;

      try {
        await uploadFile(file);
      } catch (err) {
        console.error('Failed to upload file:', err);
      }
    };
    input.click();
  };

  const pendingColumns: Column<PendingExercise>[] = [
    {
      key: 'title',
      label: 'Título',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-detective-text">{row.title}</p>
          <p className="text-xs text-gray-400">{row.type}</p>
        </div>
      ),
    },
    {
      key: 'authorName',
      label: 'Autor',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExercise(row);
              setIsPreviewModalOpen(true);
            }}
            className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors text-sm"
          >
            Ver
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleApproveExercise(row.id);
            }}
            className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-500 rounded-lg transition-colors text-sm"
          >
            <CheckCircle className="w-4 h-4 inline mr-1" />
            Aprobar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExercise(row);
              setIsRejectModalOpen(true);
            }}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors text-sm"
          >
            <XCircle className="w-4 h-4 inline mr-1" />
            Rechazar
          </button>
        </div>
      ),
    },
  ];

  const mediaColumns: Column<MediaItem>[] = [
    {
      key: 'filename',
      label: 'Archivo',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          {row.type === 'image' ? (
            <Image className="w-5 h-5 text-blue-500" />
          ) : (
            <FileText className="w-5 h-5 text-purple-500" />
          )}
          <span className="text-detective-text">{row.filename}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      sortable: true,
      render: (row) => (
        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs">
          {row.type}
        </span>
      ),
    },
    {
      key: 'size',
      label: 'Tamaño',
      sortable: true,
      render: (row) => {
        const sizeInMB = (row.size / (1024 * 1024)).toFixed(2);
        return <span className="text-detective-text">{sizeInMB} MB</span>;
      },
    },
    {
      key: 'uploadedBy',
      label: 'Subido por',
      sortable: true,
    },
    {
      key: 'uploadedAt',
      label: 'Fecha',
      sortable: true,
      render: (row) => new Date(row.uploadedAt).toLocaleDateString('es-ES'),
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`¿Eliminar ${row.filename}?`)) {
              handleDeleteMedia(row.id);
            }
          }}
          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const versionColumns: Column<ContentVersion>[] = [
    {
      key: 'contentId',
      label: 'Contenido ID',
      sortable: true,
    },
    {
      key: 'version',
      label: 'Versión',
      sortable: true,
      render: (row) => <span className="font-bold text-detective-text">v{row.version}</span>,
    },
    {
      key: 'changes',
      label: 'Cambios',
      render: (row) => <span className="text-detective-text">{row.changes}</span>,
    },
    {
      key: 'createdBy',
      label: 'Modificado por',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Fecha',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleString('es-ES'),
    },
  ];

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
          <h1 className="text-3xl font-bold text-detective-text">Gestión de Contenido</h1>
          <p className="text-detective-text-secondary mt-1">
            Modera ejercicios, gestiona multimedia y controla versiones del sistema
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'pending'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
            }`}
          >
            <FileText className="w-5 h-5" />
            Pendientes ({pendingExercises.length})
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'media'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
            }`}
          >
            <Image className="w-5 h-5" />
            Multimedia ({mediaItems.length})
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'versions'
                ? 'bg-detective-orange text-white'
                : 'bg-detective-bg-secondary text-detective-text hover:bg-opacity-80'
            }`}
          >
            <History className="w-5 h-5" />
            Versiones ({versions.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pending' && (
          <div>
            {/* Error Message */}
            {errorPending && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500">
                <p className="font-semibold">Error:</p>
                <p>{errorPending}</p>
              </div>
            )}

            {/* Loading State */}
            {loadingPending && !pendingExercises.length ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
                <p className="mt-4 text-detective-text-secondary">Cargando ejercicios pendientes...</p>
              </div>
            ) : (
              <DataTable
                data={pendingExercises}
                columns={pendingColumns}
                searchPlaceholder="Buscar ejercicios..."
              />
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div>
            {/* Error Message */}
            {errorMedia && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500">
                <p className="font-semibold">Error:</p>
                <p>{errorMedia}</p>
              </div>
            )}

            <div className="mb-6">
              <DetectiveButton variant="primary" onClick={handleUploadMedia} disabled={loadingMedia}>
                <Upload className="w-5 h-5" />
                Subir Archivo
              </DetectiveButton>
            </div>

            {/* Loading State */}
            {loadingMedia && !mediaItems.length ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
                <p className="mt-4 text-detective-text-secondary">Cargando multimedia...</p>
              </div>
            ) : (
              <DataTable
                data={mediaItems}
                columns={mediaColumns}
                searchPlaceholder="Buscar archivos..."
              />
            )}
          </div>
        )}

        {activeTab === 'versions' && (
          <div>
            {/* Error Message */}
            {errorVersions && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500">
                <p className="font-semibold">Error:</p>
                <p>{errorVersions}</p>
              </div>
            )}

            {/* Loading State */}
            {loadingVersions && !versions.length ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
                <p className="mt-4 text-detective-text-secondary">Cargando versiones...</p>
              </div>
            ) : (
              <DataTable
                data={versions}
                columns={versionColumns}
                searchPlaceholder="Buscar versiones..."
              />
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedExercise(null);
        }}
        title={`Vista Previa - ${selectedExercise?.title}`}

      >
        {selectedExercise && (
          <div className="space-y-4">
            <div className="p-4 bg-detective-bg-secondary rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Tipo de Ejercicio</p>
              <p className="text-detective-text font-medium">{selectedExercise.type}</p>
            </div>
            <div className="p-4 bg-detective-bg-secondary rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Autor</p>
              <p className="text-detective-text">{selectedExercise.authorName}</p>
            </div>
            <div className="p-4 bg-detective-bg-secondary rounded-lg">
              <p className="text-sm text-gray-400 mb-2">Contenido del Ejercicio</p>
              <p className="text-detective-text">
                [Vista previa del ejercicio - integrar con componente específico]
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <DetectiveButton
                variant="primary"
                onClick={() => {
                  handleApproveExercise(selectedExercise.id);
                  setIsPreviewModalOpen(false);
                }}
              >
                <CheckCircle className="w-5 h-5" />
                Aprobar
              </DetectiveButton>
              <DetectiveButton
                variant="secondary"
                onClick={() => {
                  setIsPreviewModalOpen(false);
                  setIsRejectModalOpen(true);
                }}
              >
                <XCircle className="w-5 h-5" />
                Rechazar
              </DetectiveButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedExercise(null);
          setRejectReason('');
        }}
        title="Rechazar Ejercicio"
      >
        <div className="space-y-4">
          <p className="text-detective-text">
            ¿Por qué estás rechazando "{selectedExercise?.title}"?
          </p>
          <FormField
            label="Razón de Rechazo"
            name="reason"
            type="textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Explica por qué se rechaza este ejercicio..."
            required
          />
          <div className="flex gap-3 justify-end pt-4">
            <DetectiveButton
              variant="secondary"
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectReason('');
              }}
            >
              Cancelar
            </DetectiveButton>
            <DetectiveButton
              variant="primary"
              onClick={handleRejectExercise}
              disabled={!rejectReason}
            >
              Rechazar Ejercicio
            </DetectiveButton>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
