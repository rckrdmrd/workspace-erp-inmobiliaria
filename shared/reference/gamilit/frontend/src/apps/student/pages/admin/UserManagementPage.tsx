import React, { useState, useEffect } from 'react';
import { GamifiedHeader } from '@shared/components/layout/GamifiedHeader';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { UserTable } from '@features/auth/components/UserTable';
import { DeactivateUserModal } from '@features/admin/components/DeactivateUserModal';
import { ActivateUserModal } from '@features/admin/components/ActivateUserModal';
import { ToastContainer, useToast } from '@shared/components/base/Toast';
import { LoadingOverlay } from '@shared/components/base/LoadingOverlay';
import { adminAPI } from '@features/admin/api/adminAPI';
import type { User } from '@features/auth/types/auth.types';
import { Plus, Search, Filter, Download, Users, RefreshCw } from 'lucide-react';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Data state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal state
  const [deactivateModal, setDeactivateModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [activateModal, setActivateModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Toast notifications
  const { toasts, showToast } = useToast();

  // Current user (mock - replace with actual auth)
  const currentUser: User = {
    id: '3',
    email: 'admin@glit.com',
    fullName: 'Admin User',
    role: 'super_admin',
    emailVerified: true,
    isActive: true,
  };

  // Fetch users on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [searchQuery, filterRole, filterStatus]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const filters: any = {};

      if (searchQuery) filters.search = searchQuery;
      if (filterRole) filters.role = filterRole;
      if (filterStatus !== 'all') {
        filters.is_active = filterStatus === 'active';
      }

      const response = await adminAPI.getUsersList(filters);
      setUsers(response.users);
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error al cargar usuarios',
        message: error.message || 'No se pudieron cargar los usuarios',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchUsers();
      showToast({
        type: 'success',
        title: 'Lista actualizada',
        message: 'La lista de usuarios se ha actualizado correctamente',
      });
    } catch (error) {
      // Error already handled in fetchUsers
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleActivateClick = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setActivateModal({ isOpen: true, user });
    }
  };

  const handleDeactivateClick = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      // Prevent admin from deactivating themselves
      if (user.id === currentUser.id) {
        showToast({
          type: 'warning',
          title: 'Acción no permitida',
          message: 'No puedes desactivar tu propia cuenta',
        });
        return;
      }
      setDeactivateModal({ isOpen: true, user });
    }
  };

  const handleActivateConfirm = async (reason?: string) => {
    if (!activateModal.user) return;

    try {
      setIsModalLoading(true);
      const updatedUser = await adminAPI.activateUser(activateModal.user.id, { reason });

      // Update local state optimistically
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

      showToast({
        type: 'success',
        title: 'Usuario activado',
        message: `La cuenta de ${activateModal.user.fullName} ha sido activada correctamente`,
      });

      setActivateModal({ isOpen: false, user: null });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error al activar usuario',
        message: error.message || 'No se pudo activar el usuario',
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeactivateConfirm = async (reason: string) => {
    if (!deactivateModal.user) return;

    try {
      setIsModalLoading(true);
      const updatedUser = await adminAPI.deactivateUser(deactivateModal.user.id, { reason });

      // Update local state optimistically
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));

      showToast({
        type: 'success',
        title: 'Usuario desactivado',
        message: `La cuenta de ${deactivateModal.user.fullName} ha sido desactivada correctamente`,
      });

      setDeactivateModal({ isOpen: false, user: null });
    } catch (error: any) {
      showToast({
        type: 'error',
        title: 'Error al desactivar usuario',
        message: error.message || 'No se pudo desactivar el usuario',
      });
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedUsers.length === 0) {
      showToast({
        type: 'warning',
        title: 'Selección requerida',
        message: 'Por favor selecciona al menos un usuario',
      });
      return;
    }
    console.log(`Bulk ${action}:`, selectedUsers);
  };

  const handleExport = () => {
    console.log('Exporting users to CSV');
    showToast({
      type: 'info',
      title: 'Exportando datos',
      message: 'La exportación comenzará en breve',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-detective-bg to-detective-bg-secondary">
      <GamifiedHeader user={currentUser} />

      <main className="detective-container py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-detective-orange" />
            <div>
              <h1 className="text-detective-title">Gestión de Usuarios</h1>
              <p className="text-detective-small text-gray-400">
                {users.length} usuario{users.length !== 1 ? 's' : ''} encontrado{users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <DetectiveButton
              variant="blue"
              icon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              Actualizar
            </DetectiveButton>
            <DetectiveButton variant="blue" icon={<Download className="w-4 h-4" />} onClick={handleExport}>
              Export CSV
            </DetectiveButton>
            <DetectiveButton variant="primary" icon={<Plus className="w-4 h-4" />}>
              Nuevo Usuario
            </DetectiveButton>
          </div>
        </div>

        {/* Advanced Filters */}
        <DetectiveCard className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-detective-orange" />
            <h3 className="text-detective-subtitle">Filtros Avanzados</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar usuarios..."
                className="input-detective pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="input-detective"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Todos los roles</option>
              <option value="student">Estudiante</option>
              <option value="admin_teacher">Profesor</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <select
              className="input-detective"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>
        </DetectiveCard>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <DetectiveCard className="mb-6 bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center justify-between">
              <p className="text-detective-base">{selectedUsers.length} usuario(s) seleccionado(s)</p>
              <div className="flex gap-2">
                <DetectiveButton variant="green" onClick={() => handleBulkAction('activate')}>
                  Activar
                </DetectiveButton>
                <DetectiveButton variant="primary" onClick={() => handleBulkAction('deactivate')}>
                  Desactivar
                </DetectiveButton>
                <DetectiveButton
                  variant="primary"

                  onClick={() => handleBulkAction('delete')}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Eliminar
                </DetectiveButton>
              </div>
            </div>
          </DetectiveCard>
        )}

        <DetectiveCard>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-detective-orange animate-spin" />
                <p className="text-detective-base text-gray-400">Cargando usuarios...</p>
              </div>
            </div>
          ) : (
            <UserTable
              users={users}
              currentUserId={currentUser.id}
              onEdit={(id) => console.log('Edit', id)}
              onDelete={(id) => console.log('Delete', id)}
              onActivate={handleActivateClick}
              onDeactivate={handleDeactivateClick}
            />
          )}
        </DetectiveCard>
      </main>

      {/* Modals */}
      <DeactivateUserModal
        isOpen={deactivateModal.isOpen}
        onClose={() => setDeactivateModal({ isOpen: false, user: null })}
        onConfirm={handleDeactivateConfirm}
        userName={deactivateModal.user?.fullName || ''}
        isLoading={isModalLoading}
      />

      <ActivateUserModal
        isOpen={activateModal.isOpen}
        onClose={() => setActivateModal({ isOpen: false, user: null })}
        onConfirm={handleActivateConfirm}
        userName={activateModal.user?.fullName || ''}
        isLoading={isModalLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} position="top-right" />

      {/* Loading Overlay */}
      {isModalLoading && <LoadingOverlay isVisible={true} message="Procesando..." />}
    </div>
  );
}
