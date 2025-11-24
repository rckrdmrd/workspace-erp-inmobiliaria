/**
 * Example: Dashboard Component using Auth State Management
 * This demonstrates how to use multiple auth hooks together
 */

import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useRole } from '../hooks/useRole';
import { usePermissions } from '../hooks/usePermissions';
import { useSession } from '../hooks/useSession';
import { useNavigate } from 'react-router-dom';

export const DashboardExample = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const { isStudent, isTeacher, isAdmin, role } = useRole();
  const { hasPermission } = usePermissions();
  const { sessionExpiresAt } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatExpirationTime = (timestamp: number | null) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString('es-MX', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* User Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información del Usuario</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Nombre</p>
              <p className="text-lg font-medium">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Rol</p>
              <p className="text-lg font-medium capitalize">{role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email Verificado</p>
              <p className="text-lg font-medium">
                {user?.emailVerified ? (
                  <span className="text-green-600">Sí</span>
                ) : (
                  <span className="text-red-600">No</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Session Info Card */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Información de Sesión</h2>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="text-gray-600">Sesión expira:</span>{' '}
              <span className="font-medium">
                {formatExpirationTime(sessionExpiresAt)}
              </span>
            </p>
            <p className="text-xs text-gray-500">
              La sesión se renovará automáticamente si estás activo
            </p>
          </div>
        </div>

        {/* Role-Based Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Student View */}
          {isStudent && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Vista de Estudiante
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>Ver ejercicios disponibles</li>
                <li>Enviar soluciones</li>
                <li>Ver tu progreso personal</li>
                <li>Ganar ML Coins y XP</li>
              </ul>
            </div>
          )}

          {/* Teacher View */}
          {isTeacher && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                Vista de Profesor
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li>Gestionar estudiantes</li>
                <li>Crear y editar ejercicios</li>
                <li>Ver progreso de todos</li>
                <li>Exportar datos y analíticas</li>
              </ul>
            </div>
          )}

          {/* Admin View */}
          {isAdmin && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-3">
                Vista de Administrador
              </h3>
              <ul className="space-y-2 text-sm text-purple-800">
                <li>Acceso completo al sistema</li>
                <li>Gestionar usuarios y roles</li>
                <li>Configuración de la plataforma</li>
                <li>Auditoría y seguridad</li>
              </ul>
            </div>
          )}

          {/* Permissions Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Tus Permisos
            </h3>
            <div className="space-y-2">
              <PermissionBadge
                hasPermission={hasPermission('read')}
                label="Lectura"
              />
              <PermissionBadge
                hasPermission={hasPermission('write')}
                label="Escritura"
              />
              <PermissionBadge
                hasPermission={hasPermission('create_exercises')}
                label="Crear Ejercicios"
              />
              <PermissionBadge
                hasPermission={hasPermission('manage_students')}
                label="Gestionar Estudiantes"
              />
              <PermissionBadge
                hasPermission={hasPermission('view_analytics')}
                label="Ver Analíticas"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Disponibles</h2>
          <div className="flex flex-wrap gap-3">
            {hasPermission('submit_exercises') && (
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Enviar Ejercicio
              </button>
            )}
            {hasPermission('create_exercises') && (
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Crear Ejercicio
              </button>
            )}
            {hasPermission('manage_students') && (
              <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                Gestionar Estudiantes
              </button>
            )}
            {hasPermission('view_analytics') && (
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Ver Analíticas
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper component for permission badges
const PermissionBadge: React.FC<{ hasPermission: boolean; label: string }> = ({
  hasPermission,
  label
}) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    {hasPermission ? (
      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
        Concedido
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
        Denegado
      </span>
    )}
  </div>
);
