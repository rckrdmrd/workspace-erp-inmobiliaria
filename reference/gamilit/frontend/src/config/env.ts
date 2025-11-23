/**
 * Centralized Environment Configuration
 *
 * Single source of truth for all environment variables.
 * Provides type-safe access and validation.
 *
 * IMPORTANT: All environment variables must be prefixed with VITE_
 * to be accessible in the browser.
 */

// ============================================================================
// ENVIRONMENT VARIABLE VALIDATION
// ============================================================================

/**
 * Validates that required environment variables are present
 * Throws error if critical variables are missing in production
 */
function validateEnvironment(): void {
  const env = import.meta.env.MODE || 'development';

  // In production, ensure API_URL is not localhost
  if (env === 'production') {
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      console.error('❌ CRITICAL: VITE_API_URL is not defined in production');
      throw new Error('VITE_API_URL must be defined in production environment');
    }

    if (apiUrl.includes('localhost') || apiUrl.includes('127.0.0.1')) {
      console.error('❌ CRITICAL: VITE_API_URL points to localhost in production:', apiUrl);
      throw new Error('VITE_API_URL cannot point to localhost in production');
    }

    console.log('✅ Environment validation passed');
  }
}

// Run validation on module load
validateEnvironment();

// ============================================================================
// API CONFIGURATION
// ============================================================================

/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */
export const API_CONFIG = {
  /**
   * Base API URL
   * Required: Must be set via VITE_API_URL environment variable
   */
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3006/api',

  /**
   * WebSocket URL
   * Derived from VITE_WS_URL or VITE_API_URL
   */
  WS_URL:
    import.meta.env.VITE_WS_URL ||
    import.meta.env.VITE_API_URL?.replace('/api', '') ||
    'http://localhost:3006',

  /**
   * Request timeout in milliseconds
   */
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,

  /**
   * Enable debug logging for API calls
   */
  DEBUG: import.meta.env.VITE_DEBUG_API === 'true',
} as const;

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

/**
 * Application Configuration
 */
export const APP_CONFIG = {
  /**
   * Application name
   */
  NAME: import.meta.env.VITE_APP_NAME || 'GAMILIT Platform',

  /**
   * Application version
   */
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',

  /**
   * Application environment
   */
  ENV: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development',

  /**
   * Is production environment
   */
  IS_PRODUCTION: import.meta.env.MODE === 'production',

  /**
   * Is development environment
   */
  IS_DEVELOPMENT: import.meta.env.MODE === 'development',
} as const;

// ============================================================================
// FEATURE FLAGS
// ============================================================================

/**
 * Feature Flags
 * Control feature availability via environment variables
 */
export const FEATURE_FLAGS = {
  /**
   * Enable gamification features
   */
  GAMIFICATION: import.meta.env.VITE_ENABLE_GAMIFICATION !== 'false',

  /**
   * Enable social features (friends, guilds)
   */
  SOCIAL: import.meta.env.VITE_ENABLE_SOCIAL_FEATURES !== 'false',

  /**
   * Enable analytics tracking
   */
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',

  /**
   * Enable debug mode
   */
  DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',

  /**
   * Enable Storybook
   */
  STORYBOOK: import.meta.env.VITE_ENABLE_STORYBOOK === 'true',

  /**
   * Use mock data instead of real API
   */
  MOCK_API: import.meta.env.VITE_MOCK_API === 'true',

  /**
   * Use mock data for exercises and content
   */
  MOCK_DATA: import.meta.env.VITE_USE_MOCK_DATA === 'true',
} as const;

// ============================================================================
// AUTHENTICATION CONFIGURATION
// ============================================================================

/**
 * Authentication Configuration
 */
export const AUTH_CONFIG = {
  /**
   * JWT token expiration time
   */
  JWT_EXPIRATION: import.meta.env.VITE_JWT_EXPIRATION || '7d',
} as const;

// ============================================================================
// EXTERNAL SERVICES CONFIGURATION
// ============================================================================

/**
 * External Services Configuration
 */
export const EXTERNAL_SERVICES = {
  /**
   * Google Analytics ID
   */
  GOOGLE_ANALYTICS_ID: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || '',

  /**
   * Sentry DSN for error tracking
   */
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',

  /**
   * AI Service URL
   */
  AI_SERVICE_URL: import.meta.env.VITE_AI_SERVICE_URL || '',
} as const;

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log Level
 */
export const LOG_LEVEL = import.meta.env.VITE_LOG_LEVEL ||
  (APP_CONFIG.IS_PRODUCTION ? 'error' : 'info');

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Environment Configuration
 * Centralized export of all environment-based configuration
 */
export const ENV = {
  API: API_CONFIG,
  APP: APP_CONFIG,
  FEATURES: FEATURE_FLAGS,
  AUTH: AUTH_CONFIG,
  EXTERNAL: EXTERNAL_SERVICES,
  LOG_LEVEL,
} as const;

export default ENV;

// ============================================================================
// RUNTIME LOGGING
// ============================================================================

// Log configuration on load (development only)
if (APP_CONFIG.IS_DEVELOPMENT && FEATURE_FLAGS.DEBUG) {
  console.log('🔧 Environment Configuration Loaded:', {
    mode: import.meta.env.MODE,
    apiUrl: API_CONFIG.BASE_URL,
    wsUrl: API_CONFIG.WS_URL,
    features: FEATURE_FLAGS,
  });
}
