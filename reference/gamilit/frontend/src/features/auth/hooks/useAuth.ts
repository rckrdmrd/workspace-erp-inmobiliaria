import { useAuthStore } from '../store/authStore';

/**
 * Custom hook for authentication
 * Provides access to auth state and actions
 */
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    refreshSession,
    clearError,
    checkSession
  } = useAuthStore();

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    refreshSession,
    clearError,
    checkSession
  };
};
