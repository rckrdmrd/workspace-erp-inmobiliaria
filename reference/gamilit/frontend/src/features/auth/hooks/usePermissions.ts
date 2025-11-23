import { useUser } from './useUser';

/**
 * Custom hook for permission management
 * Implements RBAC permission checking based on user role
 */
export const usePermissions = () => {
  const { user } = useUser();

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Role-based permissions mapping
    // Based on EPIC-002 RBAC specifications
    const rolePermissions: Record<string, string[]> = {
      'super_admin': ['*'], // All permissions
      'admin_teacher': [
        'read',
        'write',
        'manage_students',
        'view_analytics',
        'create_exercises',
        'edit_exercises',
        'delete_exercises',
        'view_progress',
        'export_data'
      ],
      'student': [
        'read',
        'submit_exercises',
        'view_own_progress',
        'update_profile'
      ]
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes('*') || userPermissions.includes(permission);
  };

  /**
   * Check if user has any of the specified permissions
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(p => hasPermission(p));
  };

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(p => hasPermission(p));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
};
