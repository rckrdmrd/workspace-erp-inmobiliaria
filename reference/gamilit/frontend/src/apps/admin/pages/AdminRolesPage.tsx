import React, { useState } from 'react';
import { useAuth } from '@features/auth/hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { DetectiveButton } from '@shared/components/base/DetectiveButton';
import {
  ShieldCheck,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
} from 'lucide-react';

/**
 * AdminRolesPage - Gestión de roles y permisos
 */
export default function AdminRolesPage() {
  const { user, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const gamificationData = {
    userId: user?.id || 'mock-admin-id',
    level: 20,
    totalXP: 5000,
    mlCoins: 2500,
    rank: 'Super Admin',
    achievements: ['admin_master', 'permission_guardian'],
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  // Mock data de roles
  const mockRoles = [
    {
      id: 'student',
      name: 'Estudiante',
      description: 'Usuario estudiante con acceso a ejercicios y gamificación',
      userCount: 1250,
      color: 'bg-blue-500',
    },
    {
      id: 'admin_teacher',
      name: 'Profesor',
      description: 'Usuario profesor con capacidad de monitoreo y gestión de clase',
      userCount: 45,
      color: 'bg-purple-500',
    },
    {
      id: 'super_admin',
      name: 'Super Administrador',
      description: 'Acceso total al sistema con permisos de configuración',
      userCount: 3,
      color: 'bg-red-500',
    },
  ];

  // Permisos disponibles por módulo
  const permissions = {
    users: {
      name: 'Usuarios',
      items: [
        { id: 'users.view', label: 'Ver usuarios' },
        { id: 'users.create', label: 'Crear usuarios' },
        { id: 'users.edit', label: 'Editar usuarios' },
        { id: 'users.delete', label: 'Eliminar usuarios' },
      ],
    },
    content: {
      name: 'Contenido',
      items: [
        { id: 'content.view', label: 'Ver contenido' },
        { id: 'content.create', label: 'Crear contenido' },
        { id: 'content.edit', label: 'Editar contenido' },
        { id: 'content.approve', label: 'Aprobar contenido' },
        { id: 'content.delete', label: 'Eliminar contenido' },
      ],
    },
    gamification: {
      name: 'Gamificación',
      items: [
        { id: 'gamification.view', label: 'Ver gamificación' },
        { id: 'gamification.config', label: 'Configurar gamificación' },
        { id: 'gamification.awards', label: 'Otorgar premios' },
      ],
    },
    monitoring: {
      name: 'Monitoreo',
      items: [
        { id: 'monitoring.view', label: 'Ver reportes' },
        { id: 'monitoring.export', label: 'Exportar datos' },
        { id: 'monitoring.analytics', label: 'Ver analíticas' },
      ],
    },
    system: {
      name: 'Sistema',
      items: [
        { id: 'system.config', label: 'Configurar sistema' },
        { id: 'system.roles', label: 'Gestionar roles' },
        { id: 'system.logs', label: 'Ver logs del sistema' },
      ],
    },
  };

  // Matriz de permisos por rol (mock)
  const rolePermissions: Record<string, string[]> = {
    student: [
      'content.view',
      'gamification.view',
    ],
    admin_teacher: [
      'users.view',
      'content.view',
      'content.create',
      'content.edit',
      'gamification.view',
      'gamification.awards',
      'monitoring.view',
      'monitoring.export',
      'monitoring.analytics',
    ],
    super_admin: Object.values(permissions).flatMap((module) =>
      module.items.map((p) => p.id)
    ),
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    return rolePermissions[roleId]?.includes(permissionId) || false;
  };

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
            <ShieldCheck className="w-8 h-8 text-purple-500" />
            Roles y Permisos
          </h1>
          <p className="text-detective-text-secondary mt-1">
            Gestiona roles de usuario y asigna permisos de acceso
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="lg:col-span-1">
            <DetectiveCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-detective-text">Roles</h2>
                <DetectiveButton
                  variant="primary"
                  size="sm"
                  onClick={() => alert('Crear rol - Próximamente')}
                >
                  <Plus className="w-4 h-4" />
                </DetectiveButton>
              </div>

              <div className="space-y-3">
                {mockRoles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all ${
                      selectedRole === role.id
                        ? 'bg-detective-orange/20 border-2 border-detective-orange'
                        : 'bg-detective-bg-secondary hover:bg-detective-bg-secondary/70 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${role.color}`} />
                      <h3 className="font-bold text-detective-text">{role.name}</h3>
                    </div>
                    <p className="text-sm text-detective-text-secondary mb-2">
                      {role.description}
                    </p>
                    <p className="text-xs text-detective-text-secondary">
                      {role.userCount} usuarios
                    </p>
                  </button>
                ))}
              </div>
            </DetectiveCard>
          </div>

          {/* Permissions Matrix */}
          <div className="lg:col-span-2">
            <DetectiveCard>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-detective-text">
                  Permisos
                  {selectedRole && (
                    <span className="ml-2 text-detective-orange">
                      - {mockRoles.find((r) => r.id === selectedRole)?.name}
                    </span>
                  )}
                </h2>
                {selectedRole && (
                  <div className="flex gap-2">
                    <DetectiveButton
                      variant="outline"
                      size="sm"
                      onClick={() => alert('Editar rol - Próximamente')}
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </DetectiveButton>
                    <DetectiveButton
                      variant="danger"
                      size="sm"
                      onClick={() => alert('Eliminar rol - Próximamente')}
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </DetectiveButton>
                  </div>
                )}
              </div>

              {!selectedRole ? (
                <div className="text-center py-12 text-detective-text-secondary">
                  <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Selecciona un rol para ver sus permisos</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissions).map(([moduleKey, module]) => (
                    <div key={moduleKey}>
                      <h3 className="text-lg font-bold text-detective-text mb-3 flex items-center gap-2">
                        {module.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {module.items.map((permission) => {
                          const isGranted = hasPermission(selectedRole, permission.id);
                          return (
                            <div
                              key={permission.id}
                              className={`flex items-center justify-between p-3 rounded-lg ${
                                isGranted
                                  ? 'bg-green-900/20 border border-green-500/30'
                                  : 'bg-detective-bg-secondary border border-gray-700'
                              }`}
                            >
                              <span className="text-sm text-detective-text">
                                {permission.label}
                              </span>
                              {isGranted ? (
                                <Check className="w-5 h-5 text-green-500" />
                              ) : (
                                <X className="w-5 h-5 text-gray-500" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </DetectiveCard>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Total Roles</p>
              <p className="text-3xl font-bold text-detective-text">{mockRoles.length}</p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Total Usuarios</p>
              <p className="text-3xl font-bold text-blue-500">
                {mockRoles.reduce((sum, role) => sum + role.userCount, 0)}
              </p>
            </div>
          </DetectiveCard>
          <DetectiveCard hoverable={false}>
            <div className="text-center">
              <p className="text-sm text-detective-text-secondary mb-1">Total Permisos</p>
              <p className="text-3xl font-bold text-purple-500">
                {Object.values(permissions).reduce((sum, module) => sum + module.items.length, 0)}
              </p>
            </div>
          </DetectiveCard>
        </div>
      </div>
    </AdminLayout>
  );
}
