import { useUser } from './useUser';

/**
 * Custom hook for role management
 * Provides convenient role checking utilities
 */
export const useRole = () => {
  const { user } = useUser();

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'admin_teacher';
  const isAdmin = user?.role === 'super_admin';

  /**
   * Check if user has a specific role
   */
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  return {
    role: user?.role,
    isStudent,
    isTeacher,
    isAdmin,
    hasRole
  };
};
