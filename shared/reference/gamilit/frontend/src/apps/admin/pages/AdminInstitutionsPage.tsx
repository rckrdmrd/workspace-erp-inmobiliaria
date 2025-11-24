import { useState } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { DataTable, Column } from '@shared/components/common/DataTable';
import { Modal } from '@shared/components/common/Modal';
import { FormField } from '@shared/components/common/FormField';
import { ConfirmDialog } from '@shared/components/common/ConfirmDialog';
import { Plus, Users, Settings, Trash2, Edit } from 'lucide-react';
import { useOrganizations } from '../hooks/useOrganizations';
import type { Organization } from '../types';

/**
 * AdminInstitutionsPage - Gestión de organizaciones/instituciones
 * Updated: 2025-11-19 - Migrated to use AdminLayout with sidebar
 */
export default function AdminInstitutionsPage() {
  const { user, logout } = useAuth();

  const {
    organizations,
    loading,
    error,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    toggleFeature,
  } = useOrganizations();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    plan: 'free' as 'free' | 'pro' | 'enterprise',
  });

  // TODO: Replace with useUserGamification hook when backend endpoint is ready
  const gamificationData = {
    userId: user?.id || 'mock-admin-id',
    level: 20,
    totalXP: 5000,
    mlCoins: 2500,
    rank: 'Super Admin',
    achievements: ['admin_master', 'org_manager'],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleCreateOrg = async () => {
    try {
      await createOrganization({
        name: formData.name,
        plan: formData.plan,
      });
      setIsCreateModalOpen(false);
      setFormData({ name: '', plan: 'free' });
    } catch (err) {
      console.error('Failed to create organization:', err);
    }
  };

  const handleEditOrg = async () => {
    if (!selectedOrg) return;
    try {
      await updateOrganization(selectedOrg.id, {
        name: formData.name,
        plan: formData.plan,
      });
      setIsEditModalOpen(false);
      setSelectedOrg(null);
      setFormData({ name: '', plan: 'free' });
    } catch (err) {
      console.error('Failed to update organization:', err);
    }
  };

  const handleDeleteOrg = async () => {
    if (!selectedOrg) return;
    try {
      await deleteOrganization(selectedOrg.id);
      setIsDeleteDialogOpen(false);
      setSelectedOrg(null);
    } catch (err) {
      console.error('Failed to delete organization:', err);
    }
  };

  const openEditModal = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({ name: org.name, plan: org.plan });
    setIsEditModalOpen(true);
  };

  const openFeaturesModal = (org: Organization) => {
    setSelectedOrg(org);
    setIsFeaturesModalOpen(true);
  };

  const handleToggleFeature = async (feature: string) => {
    if (!selectedOrg) return;
    try {
      await toggleFeature(selectedOrg.id, feature);

      // Update local selected org state with the new features
      const updatedFeatures = selectedOrg.features.includes(feature)
        ? selectedOrg.features.filter((f) => f !== feature)
        : [...selectedOrg.features, feature];
      setSelectedOrg({ ...selectedOrg, features: updatedFeatures });
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };

  const columns: Column<Organization>[] = [
    {
      key: 'name',
      label: 'Organización',
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-medium text-detective-text">{row.name}</p>
          <p className="text-xs text-gray-400">ID: {row.id}</p>
        </div>
      ),
    },
    {
      key: 'plan',
      label: 'Plan',
      sortable: true,
      render: (row) => {
        const planColors = {
          free: 'bg-gray-500/20 text-gray-500',
          pro: 'bg-blue-500/20 text-blue-500',
          enterprise: 'bg-purple-500/20 text-purple-500',
        };
        return (
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${planColors[row.plan]}`}>
            {row.plan.toUpperCase()}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (row) => {
        const statusColors = {
          active: 'bg-green-500/20 text-green-500',
          inactive: 'bg-gray-500/20 text-gray-500',
          suspended: 'bg-red-500/20 text-red-500',
        };
        return (
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[row.status]}`}>
            {row.status === 'active' ? 'Activo' : row.status === 'inactive' ? 'Inactivo' : 'Suspendido'}
          </span>
        );
      },
    },
    {
      key: 'userCount',
      label: 'Usuarios',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-detective-text">{row.userCount}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Fecha Creación',
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
              openEditModal(row);
            }}
            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openFeaturesModal(row);
            }}
            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-500 rounded-lg transition-colors"
            title="Feature Flags"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrg(row);
              setIsDeleteDialogOpen(true);
            }}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const availableFeatures = [
    { key: 'analytics', label: 'Analytics Avanzado', plans: ['pro', 'enterprise'] },
    { key: 'custom_branding', label: 'Branding Personalizado', plans: ['pro', 'enterprise'] },
    { key: 'api_access', label: 'Acceso API', plans: ['pro', 'enterprise'] },
    { key: 'white_label', label: 'White Label', plans: ['enterprise'] },
    { key: 'sso', label: 'Single Sign-On', plans: ['enterprise'] },
    { key: 'custom_reports', label: 'Reportes Personalizados', plans: ['enterprise'] },
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
          <h1 className="text-3xl font-bold text-detective-text">Gestión de Organizaciones</h1>
          <p className="text-detective-text-secondary mt-1">
            Gestiona organizaciones, planes y suscripciones de la plataforma
          </p>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <DetectiveButton variant="primary" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Crear Organización
          </DetectiveButton>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-500">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !organizations.length ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
            <p className="mt-4 text-detective-text-secondary">Cargando organizaciones...</p>
          </div>
        ) : (
          /* Organizations Table */
          <DataTable
            data={organizations}
            columns={columns}
            searchPlaceholder="Buscar organizaciones..."
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setFormData({ name: '', plan: 'free' });
        }}
        title="Crear Nueva Organización"
      >
        <div className="space-y-4">
          <FormField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Colegio San José"
            required
          />
          <FormField
            label="Plan"
            name="plan"
            type="select"
            value={formData.plan}
            onChange={(value) => setFormData({ ...formData, plan: value as any })}
            options={[
              { value: 'free', label: 'Free' },
              { value: 'pro', label: 'Pro' },
              { value: 'enterprise', label: 'Enterprise' },
            ]}
            required
          />
          <div className="flex gap-3 justify-end pt-4">
            <DetectiveButton
              variant="secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData({ name: '', plan: 'free' });
              }}
            >
              Cancelar
            </DetectiveButton>
            <DetectiveButton
              variant="primary"
              onClick={handleCreateOrg}
              disabled={!formData.name}
            >
              Crear
            </DetectiveButton>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrg(null);
          setFormData({ name: '', plan: 'free' });
        }}
        title="Editar Organización"
      >
        <div className="space-y-4">
          <FormField
            label="Nombre"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <FormField
            label="Plan"
            name="plan"
            type="select"
            value={formData.plan}
            onChange={(value) => setFormData({ ...formData, plan: value as any })}
            options={[
              { value: 'free', label: 'Free' },
              { value: 'pro', label: 'Pro' },
              { value: 'enterprise', label: 'Enterprise' },
            ]}
            required
          />
          <div className="flex gap-3 justify-end pt-4">
            <DetectiveButton
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedOrg(null);
                setFormData({ name: '', plan: 'free' });
              }}
            >
              Cancelar
            </DetectiveButton>
            <DetectiveButton variant="primary" onClick={handleEditOrg}>
              Guardar
            </DetectiveButton>
          </div>
        </div>
      </Modal>

      {/* Feature Flags Modal */}
      <Modal
        isOpen={isFeaturesModalOpen}
        onClose={() => {
          setIsFeaturesModalOpen(false);
          setSelectedOrg(null);
        }}
        title={`Feature Flags - ${selectedOrg?.name}`}

      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">
            Plan actual: <span className="font-bold text-detective-text">{selectedOrg?.plan.toUpperCase()}</span>
          </p>
          {availableFeatures.map((feature) => {
            const isEnabled = selectedOrg?.features.includes(feature.key);
            const isAvailable = selectedOrg && feature.plans.includes(selectedOrg.plan);
            return (
              <label
                key={feature.key}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isAvailable
                    ? 'border-gray-700 bg-detective-bg-secondary cursor-pointer hover:bg-opacity-80'
                    : 'border-gray-800 bg-gray-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <div>
                  <p className="text-detective-text font-medium">{feature.label}</p>
                  {!isAvailable && (
                    <p className="text-xs text-gray-500">
                      Requiere plan: {feature.plans.join(' o ')}
                    </p>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => handleToggleFeature(feature.key)}
                  disabled={!isAvailable}
                  className="w-5 h-5"
                />
              </label>
            );
          })}
        </div>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedOrg(null);
        }}
        onConfirm={handleDeleteOrg}
        title="Eliminar Organización"
        message={`¿Estás seguro de que deseas eliminar "${selectedOrg?.name}"? Esta acción no se puede deshacer y eliminará todos los usuarios asociados.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </AdminLayout>
  );
}
