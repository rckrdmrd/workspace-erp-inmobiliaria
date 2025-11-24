/**
 * Auth Cleanup Utilities
 *
 * Centralized utilities for cleaning authentication data and performing logout.
 * Used by both AuthContext and authStore to ensure consistent behavior.
 *
 * @module authCleanup
 */

/**
 * Clear all authentication and session data from localStorage
 *
 * This function removes:
 * - auth-token (JWT access token)
 * - refresh-token (JWT refresh token)
 * - auth-storage (Zustand persist storage)
 * - Any keys starting with 'user-' or 'session-'
 *
 * Use this on logout or session expiration to ensure clean state.
 *
 * @example
 * ```typescript
 * clearAllAuthData();
 * console.log(localStorage.getItem('auth-token')); // null
 * ```
 */
export const clearAllAuthData = (): void => {
  // Clear auth tokens
  localStorage.removeItem('auth-token');
  localStorage.removeItem('refresh-token');

  // Clear Zustand persist storage
  localStorage.removeItem('auth-storage');

  // Clear any cached user/session data
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('user-') || key?.startsWith('session-')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(key => localStorage.removeItem(key));

  console.log('[authCleanup] All auth data cleared:', {
    tokensCleared: true,
    zustandCleared: true,
    additionalKeysCleared: keysToRemove.length,
  });
};

/**
 * Perform complete logout sequence
 *
 * This function:
 * 1. Attempts to call backend logout endpoint (if provided)
 * 2. Clears all local authentication data (regardless of backend success)
 * 3. Redirects to login page using window.location.href for reliability
 *
 * The logout ALWAYS succeeds locally, even if backend is unreachable.
 * This ensures users can always clear their session.
 *
 * @param backendLogout - Optional async function to call backend logout endpoint
 *
 * @example
 * ```typescript
 * // With backend call
 * await performLogout(async () => {
 *   await apiClient.post('/auth/logout');
 * });
 *
 * // Without backend call (offline logout)
 * await performLogout();
 * ```
 */
export const performLogout = async (
  backendLogout?: () => Promise<void>
): Promise<void> => {
  console.log('[authCleanup] Starting logout sequence...');

  // CRITICAL: Set logout flag FIRST to prevent race condition
  // This prevents AuthContext useEffect from restoring session during redirect
  localStorage.setItem('is_logging_out', 'true');
  console.log('[authCleanup] Set is_logging_out flag to prevent session restore');

  try {
    // Try to call backend logout
    if (backendLogout) {
      console.log('[authCleanup] Calling backend logout...');
      await backendLogout();
      console.log('[authCleanup] Backend logout successful');
    } else {
      console.log('[authCleanup] No backend logout function provided (offline mode)');
    }
  } catch (error) {
    console.error('[authCleanup] Backend logout failed:', error);
    // Continue with local cleanup even if backend fails
    console.log('[authCleanup] Continuing with local cleanup...');
  } finally {
    // Always clear local data
    clearAllAuthData();

    // Force redirect to login (reliable across all scenarios)
    // Using window.location.href instead of React Router navigate()
    // because it ensures a clean page reload and state reset
    console.log('[authCleanup] Redirecting to /login...');
    window.location.href = '/login';
  }
};

/**
 * Check if user is currently authenticated
 *
 * Checks for presence of auth-token in localStorage.
 * This is a simple check and does NOT validate token expiry.
 *
 * @returns true if auth-token exists, false otherwise
 *
 * @example
 * ```typescript
 * if (isAuthenticated()) {
 *   console.log('User has a token');
 * }
 * ```
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth-token');
};

/**
 * Get current auth token
 *
 * @returns auth-token string or null if not found
 *
 * @example
 * ```typescript
 * const token = getAuthToken();
 * if (token) {
 *   headers.Authorization = `Bearer ${token}`;
 * }
 * ```
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token');
};

/**
 * Get current refresh token
 *
 * @returns refresh-token string or null if not found
 *
 * @example
 * ```typescript
 * const refreshToken = getRefreshToken();
 * if (refreshToken) {
 *   await refreshAuthToken(refreshToken);
 * }
 * ```
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh-token');
};
