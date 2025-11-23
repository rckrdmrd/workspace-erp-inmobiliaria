/**
 * API Client - Base Axios Instance
 *
 * Centralized HTTP client for all API requests with interceptors
 * for authentication, error handling, and request/response transformation.
 */

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Get API base URL from environment variables
 * Defaults to localhost:3006 for development
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api';

/**
 * Default timeout for API requests (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

/**
 * Base Axios instance with default configuration
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

/**
 * Request interceptor to add authentication tokens and tenant headers
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add JWT token from localStorage
    const token = localStorage.getItem('auth-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant-id header for multi-tenant support
    const tenantId = localStorage.getItem('tenant-id');
    if (tenantId && config.headers) {
      config.headers['X-Tenant-Id'] = tenantId;
    }

    // Log request in debug mode
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.log('[API Request]', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

/**
 * Response interceptor to handle errors and token refresh
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in debug mode
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.log('[API Response]', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh
        const refreshToken = localStorage.getItem('refresh-token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Save new token
        localStorage.setItem('auth-token', data.token);

        // Update the authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.token}`;
        }

        // Retry original request with new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect to login
        localStorage.removeItem('auth-token');
        localStorage.removeItem('refresh-token');
        localStorage.removeItem('auth-storage');

        // Only redirect if not already on login page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('[API] Access forbidden:', error.response.data);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      // Silent fail for optional endpoints (hints, avatars, etc.)
      const url = error.config?.url || '';
      const optionalEndpoints = ['/hints', '/avatar', '/profile-picture', '/badges'];
      const isOptional = optionalEndpoints.some(endpoint => url.includes(endpoint));

      if (!isOptional) {
        console.error('[API] Resource not found:', error.config.url);
      }
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('[API] Server error:', error.response.data);
    }

    // Log error in debug mode
    if (import.meta.env.VITE_DEBUG_API === 'true') {
      console.error('[API Error]', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Set authentication token
 */
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth-token', token);
};

/**
 * Set refresh token
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem('refresh-token', token);
};

/**
 * Clear authentication tokens
 */
export const clearAuthTokens = (): void => {
  localStorage.removeItem('auth-token');
  localStorage.removeItem('refresh-token');
};

/**
 * Get current authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth-token');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// ============================================================================
// EXPORTS
// ============================================================================

export default apiClient;
