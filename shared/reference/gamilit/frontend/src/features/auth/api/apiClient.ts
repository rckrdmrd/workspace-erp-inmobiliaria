import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * API Base URL from environment variables
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3006/api';

/**
 * Axios instance with base configuration
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000 // 30 seconds
});

/**
 * Request interceptor - Add authentication token to requests
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant-id header for multi-tenant support (EPIC-002 requirement)
    const user = useAuthStore.getState().user;
    if (user?.tenantId) {
      config.headers['X-Tenant-ID'] = user.tenantId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle token refresh and errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If 401 (Unauthorized) and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the session
        await useAuthStore.getState().refreshSession();

        // Get the new token
        const newToken = useAuthStore.getState().token;

        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        useAuthStore.getState().logout();

        // Redirect to login page
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other error responses
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.statusText;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No se pudo conectar con el servidor'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(error);
    }
  }
);
