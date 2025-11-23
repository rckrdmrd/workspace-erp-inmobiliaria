/**
 * UserManagementTable Component
 *
 * Comprehensive user management table with CRUD operations.
 * Displays user list with filtering, searching, and bulk actions.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, UserCheck, UserX, Trash2, Key } from 'lucide-react';
import { DetectiveCard } from '@shared/components/base/DetectiveCard';
import { useUserManagement } from '../../hooks/useUserManagement';
import { getDetectiveRoleName, getDetectiveRoleBadge } from '@shared/utils/detectiveRoles';

export const UserManagementTable: React.FC = () => {
  const {
    users,
    loading,
    fetchUsers,
    suspendUser,
    unsuspendUser,
    deleteUser,
    resetPassword,
    setFilters,
  } = useUserManagement();

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DetectiveCard>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-detective-subtitle">User Management</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              onChange={(e) => setFilters({ search: e.target.value })}
              className="pl-10 pr-4 py-2 bg-detective-bg-secondary border border-gray-700 rounded-lg text-detective-text"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Email</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Detective</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Rango Detective</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Departamento</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-detective-small text-gray-400">Last Login</th>
              <th className="px-4 py-3 text-center text-detective-small text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  🔍 No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-800 hover:bg-detective-bg-secondary transition-colors"
                >
                  <td className="px-4 py-3 text-detective-small">{user.email}</td>
                  <td className="px-4 py-3 text-detective-small">
                    <span>🕵️ {user.full_name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-md text-xs">
                      {getDetectiveRoleBadge(user.role)} {getDetectiveRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.department || 'Sin asignar'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-md text-xs ${
                        user.status === 'active'
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      {user.status === 'active' ? '✅' : '❌'} {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-detective-small text-gray-400">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          user.status === 'active'
                            ? suspendUser(user.id)
                            : unsuspendUser(user.id)
                        }
                        className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                        title={user.status === 'active' ? 'Suspend user' : 'Unsuspend user'}
                      >
                        {user.status === 'active' ? (
                          <UserX className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <UserCheck className="w-4 h-4 text-green-500" />
                        )}
                      </button>
                      <button
                        onClick={() => resetPassword(user.id)}
                        className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                        title="Reset password"
                      >
                        <Key className="w-4 h-4 text-blue-500" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="p-2 hover:bg-detective-bg-tertiary rounded-lg transition-colors"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DetectiveCard>
  );
};
