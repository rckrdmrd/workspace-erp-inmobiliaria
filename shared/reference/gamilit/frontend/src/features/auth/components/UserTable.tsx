import React from 'react';
import { Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import { StatusBadge, StatusType } from '@shared/components/base/StatusBadge';
import type { User } from '@features/auth/types/auth.types';

interface UserTableProps {
  users: User[];
  currentUserId?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  currentUserId,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
}) => {
  const getRoleBadge = (role: string) => {
    const colors = {
      'student': 'bg-blue-100 text-blue-800',
      'admin_teacher': 'bg-green-100 text-green-800',
      'super_admin': 'bg-purple-100 text-purple-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      'student': 'Estudiante',
      'admin_teacher': 'Profesor',
      'super_admin': 'Super Admin'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusType = (user: User): StatusType => {
    // Assuming suspended would be a separate field if needed
    return user.isActive === false ? 'inactive' : 'active';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left p-3 text-detective-body">Usuario</th>
            <th className="text-left p-3 text-detective-body">Email</th>
            <th className="text-left p-3 text-detective-body">Rol</th>
            <th className="text-left p-3 text-detective-body">Estado</th>
            <th className="text-left p-3 text-detective-body">Fecha Creación</th>
            <th className="text-right p-3 text-detective-body">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-detective-body text-gray-400">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            users.map((user) => {
              const isCurrentUser = user.id === currentUserId;
              const canActivateDeactivate = !isCurrentUser && (onActivate || onDeactivate);

              return (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3 text-detective-body font-medium">
                    {user.fullName}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-detective-orange font-normal">(Tú)</span>
                    )}
                  </td>
                  <td className="p-3 text-detective-small">{user.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${getRoleBadge(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="p-3">
                    <StatusBadge status={getStatusType(user)} />
                  </td>
                  <td className="p-3 text-detective-small">{formatDate(user.createdAt)}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {/* Activate/Deactivate buttons */}
                      {canActivateDeactivate && user.isActive === false && onActivate && (
                        <button
                          onClick={() => onActivate(user.id)}
                          className="p-2 hover:bg-green-50 rounded transition-colors"
                          title="Activar usuario"
                        >
                          <UserCheck className="w-4 h-4 text-green-600" />
                        </button>
                      )}
                      {canActivateDeactivate && user.isActive !== false && onDeactivate && (
                        <button
                          onClick={() => onDeactivate(user.id)}
                          className="p-2 hover:bg-red-50 rounded transition-colors"
                          title="Desactivar usuario"
                        >
                          <UserX className="w-4 h-4 text-red-600" />
                        </button>
                      )}

                      {/* Edit button */}
                      <button
                        onClick={() => onEdit(user.id)}
                        className="p-2 hover:bg-blue-50 rounded transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>

                      {/* Delete button - disabled for current user */}
                      <button
                        onClick={() => onDelete(user.id)}
                        disabled={isCurrentUser}
                        className={`p-2 rounded transition-colors ${
                          isCurrentUser
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-red-50'
                        }`}
                        title={isCurrentUser ? 'No puedes eliminar tu propia cuenta' : 'Eliminar usuario'}
                      >
                        <Trash2 className={`w-4 h-4 ${isCurrentUser ? 'text-gray-400' : 'text-red-600'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
