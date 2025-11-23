/**
 * Migrate localStorage keys
 * Migrates old token keys to new standardized keys
 *
 * Created: 2025-11-11
 * Reason: Fix token authentication inconsistency (FE-047)
 */

/**
 * Migrates old localStorage keys to new ones
 * This ensures backward compatibility for users with existing sessions
 */
export function migrateLocalStorage(): void {
  try {
    // Migrate 'access_token' to 'auth-token'
    const oldAccessToken = localStorage.getItem('access_token');
    if (oldAccessToken && !localStorage.getItem('auth-token')) {
      console.log('[LocalStorage Migration] Migrating access_token → auth-token');
      localStorage.setItem('auth-token', oldAccessToken);
      localStorage.removeItem('access_token');
    }

    // Migrate 'refresh_token' to 'refresh-token'
    const oldRefreshToken = localStorage.getItem('refresh_token');
    if (oldRefreshToken && !localStorage.getItem('refresh-token')) {
      console.log('[LocalStorage Migration] Migrating refresh_token → refresh-token');
      localStorage.setItem('refresh-token', oldRefreshToken);
      localStorage.removeItem('refresh_token');
    }

    console.log('[LocalStorage Migration] Migration completed');
  } catch (error) {
    console.error('[LocalStorage Migration] Error during migration:', error);
  }
}

/**
 * Run migration on app initialization
 * Call this in your app entry point (main.tsx or App.tsx)
 */
export function runMigrations(): void {
  migrateLocalStorage();
}
