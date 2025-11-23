import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

/**
 * Custom hook for session management
 * Handles session validation and automatic token refresh
 */
export const useSession = () => {
  const {
    isAuthenticated,
    sessionExpiresAt,
    checkSession,
    refreshSession,
    logout
  } = useAuthStore();

  // Check session on mount and periodically
  useEffect(() => {
    if (isAuthenticated) {
      // Initial session check
      checkSession();

      // Check every minute
      const interval = setInterval(() => {
        const isValid = checkSession();

        // Refresh token if expiring soon (< 1 hour)
        if (sessionExpiresAt && sessionExpiresAt - Date.now() < 60 * 60 * 1000) {
          refreshSession().catch(() => {
            // If refresh fails, logout user
            logout();
          });
        }
      }, 60000); // 1 minute

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, sessionExpiresAt, checkSession, refreshSession, logout]);

  return {
    isAuthenticated,
    sessionExpiresAt,
    checkSession,
    refreshSession
  };
};
