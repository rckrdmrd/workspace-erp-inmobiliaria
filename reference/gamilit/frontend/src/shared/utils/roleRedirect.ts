/**
 * Role-Based Redirect Utilities
 *
 * Provides utilities for redirecting users to their appropriate portal
 * based on their role after authentication.
 *
 * @module roleRedirect
 */

/**
 * Get the appropriate dashboard route based on user role
 *
 * Maps user roles to their corresponding portal routes:
 * - super_admin → /admin/dashboard (Admin Portal)
 * - admin_teacher → /teacher/dashboard (Teacher Portal)
 * - student → /dashboard (Student Portal)
 * - unknown roles → /dashboard (fallback to student portal)
 *
 * @param role - The user's role from User.role field
 * @returns The dashboard route path for the given role
 *
 * @example
 * ```typescript
 * const adminRoute = getRoleBasedRedirect('super_admin');
 * // Returns: '/admin/dashboard'
 *
 * const teacherRoute = getRoleBasedRedirect('admin_teacher');
 * // Returns: '/teacher/dashboard'
 *
 * const studentRoute = getRoleBasedRedirect('student');
 * // Returns: '/dashboard'
 * ```
 */
export const getRoleBasedRedirect = (role: string): string => {
  console.log('[roleRedirect] Getting redirect for role:', role);

  switch (role) {
    case 'super_admin':
      console.log('[roleRedirect] Redirecting to admin portal');
      return '/admin/dashboard';

    case 'admin_teacher':
      console.log('[roleRedirect] Redirecting to teacher portal');
      return '/teacher/dashboard';

    case 'student':
      console.log('[roleRedirect] Redirecting to student portal');
      return '/dashboard';

    default:
      console.warn('[roleRedirect] Unknown role, defaulting to student portal:', role);
      return '/dashboard';
  }
};

/**
 * Check if a user has permission to access a specific portal
 *
 * @param userRole - The user's role
 * @param requiredRole - The required role for the portal
 * @returns true if user has access, false otherwise
 *
 * @example
 * ```typescript
 * const canAccessAdmin = hasPortalAccess('super_admin', 'super_admin');
 * // Returns: true
 *
 * const canStudentAccessAdmin = hasPortalAccess('student', 'super_admin');
 * // Returns: false
 * ```
 */
export const hasPortalAccess = (userRole: string, requiredRole: string): boolean => {
  // Exact match required for portal access
  return userRole === requiredRole;
};

/**
 * Get a human-readable portal name from role
 *
 * @param role - The user's role
 * @returns Human-readable portal name
 *
 * @example
 * ```typescript
 * const portalName = getPortalName('admin_teacher');
 * // Returns: 'Portal de Profesor'
 * ```
 */
export const getPortalName = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return 'Portal de Administrador';
    case 'admin_teacher':
      return 'Portal de Profesor';
    case 'student':
      return 'Portal de Estudiante';
    default:
      return 'Portal';
  }
};
