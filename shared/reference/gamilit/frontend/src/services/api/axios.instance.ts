/**
 * Axios Instance - Main API Client Export
 *
 * This file provides a clean export of the configured Axios instance
 * for API communication throughout the application.
 *
 * Features:
 * - JWT authentication via interceptors
 * - Automatic token refresh on 401
 * - Request/response logging (debug mode)
 * - Multi-tenant support via X-Tenant-Id header
 * - Centralized error handling
 *
 * @module axios.instance
 */

import { apiClient } from './apiClient';
import type { AxiosInstance } from 'axios';

// ============================================================================
// MAIN AXIOS INSTANCE EXPORT
// ============================================================================

/**
 * Pre-configured Axios instance with authentication and error handling
 *
 * @example
 * ```typescript
 * import axiosInstance from '@services/api/axios.instance';
 *
 * // GET request
 * const response = await axiosInstance.get('/users');
 *
 * // POST request
 * const response = await axiosInstance.post('/auth/login', {
 *   email: 'user@example.com',
 *   password: 'password'
 * });
 *
 * // Request with custom headers
 * const response = await axiosInstance.get('/data', {
 *   headers: { 'X-Custom-Header': 'value' }
 * });
 * ```
 */
const axiosInstance: AxiosInstance = apiClient;

// ============================================================================
// EXPORTS
// ============================================================================

export default axiosInstance;

/**
 * Named export for alternative import style
 */
export { axiosInstance };

/**
 * Re-export utility functions from apiClient
 */
export {
  setAuthToken,
  setRefreshToken,
  clearAuthTokens,
  getAuthToken,
  isAuthenticated,
} from './apiClient';
