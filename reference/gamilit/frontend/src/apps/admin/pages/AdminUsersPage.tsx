import { useState, useEffect } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import { useUserManagement } from '../hooks/useUserManagement';
import { useUserGamification } from '@shared/hooks/useUserGamification';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Mail,
  Shield,
  RefreshCw,
} from 'lucide-react';

/**
 * AdminUsersPage - Gestión de usuarios de la plataforma
 * Updated: 2025-11-19 - Integrated with useUserManagement hook (FE-059)
 */
export default function AdminUsersPage() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  // Use useUserManagement hook for data management
  const {
    users,
    totalUsers,
    loading,
    error,
    filters,
    fetchUsers,
    suspendUser,
    unsuspendUser,
    deleteUser,
    setFilters,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
  } = useUserManagement();

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

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Update filters when search changes
  useEffect(() => {
    if (searchTerm) {
      setFilters({ ...filters, search: searchTerm });
    }
  }, [searchTerm]);

  // Handle user actions
  const handleSuspendUser = async (userId: string, name: string) => {
    if (confirm(`¿Suspender usuario ${name}?`)) {
      try {
        await suspendUser(userId);
        await fetchUsers(); // Refresh list
      } catch (err) {
        alert('Error al suspender usuario');
      }
    }
  };

  const handleUnsuspendUser = async (userId: string, name: string) => {
    if (confirm(`¿Reactivar usuario ${name}?`)) {
      try {
        await unsuspendUser(userId);
        await fetchUsers(); // Refresh list
      } catch (err) {
        alert('Error al reactivar usuario');
      }
    }
  };

  const handleDeleteUser = async (userId: string, name: string) => {
    if (confirm(`¿ELIMINAR usuario ${name}? Esta acción no se puede deshacer.`)) {
      try {
        await deleteUser(userId);
        await fetchUsers(); // Refresh list
      } catch (err) {
        alert('Error al eliminar usuario');
      }
    }
  };

  // Calculate stats from real data
  const stats = {
    total: totalUsers,
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    students: users.filter((u) => u.role === 'student').length,
    teachers: users.filter((u) => u.role === 'admin_teacher').length,
    admins: users.filter((u) => u.role === 'super_admin').length,
  };

  const getRoleBadge = (role: string) => {
    const roleColors: Record<string, string> = {
      student: 'bg-blue-100 text-blue-700',
      admin_teacher: 'bg-purple-100 text-purple-700',
      super_admin: 'bg-red-100 text-red-700',
    };

    const roleLabels: Record<string, string> = {
      student: 'Estudiante',
      admin_teacher: 'Profesor',
      super_admin: 'Super Admin',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-700'}`}>
        {roleLabels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">Activo</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-red-600">
        <XCircle className="w-4 h-4" />
        <span className="text-sm">Inactivo</span>
      </span>
    );
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
            <Users className="w-8 h-8 text-blue-500" />
            Gestión de Usuarios
          </h1>
          <p className="text-detective-text-secondary mt-1">
            Administra usuarios, roles y permisos de la plataforma
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Total</p>
              <p className="text-2xl font-bold text-detective-text">{stats.total}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Activos</p>
              <p className="text-2xl font-bold text-green-500">{stats.active}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Inactivos</p>
              <p className="text-2xl font-bold text-red-500">{stats.inactive}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Estudiantes</p>
              <p className="text-2xl font-bold text-blue-500">{stats.students}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Profesores</p>
              <p className="text-2xl font-bold text-purple-500">{stats.teachers}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Admins</p>
              <p className="text-2xl font-bold text-red-500">{stats.admins}</p>
            </div>
          </DetectiveCard>
        </div>

        {/* Filters and Search */}
        <DetectiveCard>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-detective-orange"
              />
            </div>

            {/* Filter by Role */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filters.role?.[0] || 'all'}
                onChange={(e) => setFilters({ ...filters, role: e.target.value === 'all' ? undefined : [e.target.value] })}
                className="px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
              >
                <option value="all">Todos los roles</option>
                <option value="student">Estudiantes</option>
                <option value="admin_teacher">Profesores</option>
                <option value="super_admin">Super Admins</option>
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-400" />
              <select
                value={filters.status?.[0] || 'all'}
                onChange={(e) => setFilters({ ...filters, status: e.target.value === 'all' ? undefined : [e.target.value] })}
                className="px-4 py-2 bg-detective-bg-secondary border border-gray-600 rounded-lg text-detective-text focus:outline-none focus:ring-2 focus:ring-detective-orange"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </div>

            {/* Refresh Button */}
            <DetectiveButton
              variant="secondary"
              onClick={() => fetchUsers()}
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </DetectiveButton>

            {/* Add User Button */}
            <DetectiveButton variant="primary" onClick={() => alert('Crear usuario - Próximamente')}>
              <UserPlus className="w-5 h-5" />
              Nuevo Usuario
            </DetectiveButton>
          </div>
        </DetectiveCard>

        {/* Error Message */}
        {error && (
          <DetectiveCard>
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-red-500">
              <p className="font-semibold">Error al cargar usuarios:</p>
              <p>{error}</p>
            </div>
          </DetectiveCard>
        )}

        {/* Users Table */}
        <DetectiveCard>
          {loading && users.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-detective-orange"></div>
              <p className="mt-4 text-detective-text-secondary">Cargando usuarios...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Usuario
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Rol
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Institución
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Último acceso
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-detective-text-secondary">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((usr) => (
                      <tr key={usr.id} className="border-b border-gray-700 hover:bg-detective-bg-secondary transition-colors">
                        <td className="px-4 py-3 text-sm text-detective-text font-medium">
                          {usr.full_name || usr.display_name || usr.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-detective-text-secondary flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {usr.email}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getRoleBadge(usr.role)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {getStatusBadge(usr.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-detective-text-secondary">
                          {usr.organizationName || usr.organizationId || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-detective-text-secondary">
                          {usr.lastLogin ? new Date(usr.lastLogin).toLocaleDateString('es-ES') : 'Nunca'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-1 hover:bg-detective-bg rounded text-blue-400 hover:text-blue-300"
                              onClick={() => alert(`Editar usuario: ${usr.full_name || usr.email} - Próximamente`)}
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {usr.status === 'active' ? (
                              <button
                                className="p-1 hover:bg-detective-bg rounded text-red-400 hover:text-red-300"
                                onClick={() => handleSuspendUser(usr.id, usr.full_name || usr.email)}
                                title="Suspender"
                                disabled={loading}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                className="p-1 hover:bg-detective-bg rounded text-green-400 hover:text-green-300"
                                onClick={() => handleUnsuspendUser(usr.id, usr.full_name || usr.email)}
                                title="Reactivar"
                                disabled={loading}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-1 hover:bg-detective-bg rounded text-red-400 hover:text-red-300"
                              onClick={() => handleDeleteUser(usr.id, usr.full_name || usr.email)}
                              title="Eliminar"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {users.length === 0 && !loading && (
                  <div className="text-center py-8 text-detective-text-secondary">
                    No se encontraron usuarios que coincidan con los filtros
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between border-t border-gray-700 pt-4">
                  <div className="text-sm text-detective-text-secondary">
                    Página {currentPage} de {totalPages} ({totalUsers} usuarios totales)
                  </div>
                  <div className="flex gap-2">
                    <DetectiveButton
                      variant="secondary"
                      onClick={prevPage}
                      disabled={currentPage === 1 || loading}
                    >
                      Anterior
                    </DetectiveButton>
                    <DetectiveButton
                      variant="secondary"
                      onClick={nextPage}
                      disabled={currentPage === totalPages || loading}
                    >
                      Siguiente
                    </DetectiveButton>
                  </div>
                </div>
              )}
            </>
          )}
        </DetectiveCard>
      </div>
    </AdminLayout>
  );
}
