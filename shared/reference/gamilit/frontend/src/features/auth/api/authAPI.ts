/**
 * Auth API Integration
 *
 * API client for authentication endpoints including login, register,
 * logout, token refresh, password recovery, and email verification.
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  SessionInfo,
  UserSessionInfo,
} from '../types/auth.types';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map backend user response to frontend User type
 * Now matches backend structure exactly - no transformation needed
 */
const mapBackendUserToFrontend = (backendUser: any): User => {
  return {
    id: backendUser.id,
    email: backendUser.email,
    role: backendUser.role,
    firstName: backendUser.firstName,
    lastName: backendUser.lastName,
    displayName: backendUser.displayName,
  };
};

/**
 * Map backend auth response to frontend AuthResponse
 * Backend returns 'accessToken' but frontend expects 'token'
 */
const mapBackendAuthResponse = (backendResponse: any): AuthResponse => {
  console.log('🔄 [authAPI] Mapping backend response:', {
    hasAccessToken: !!backendResponse.accessToken,
    hasToken: !!backendResponse.token,
    hasRefreshToken: !!backendResponse.refreshToken,
    hasUser: !!backendResponse.user,
  });

  return {
    user: mapBackendUserToFrontend(backendResponse.user),
    token: backendResponse.accessToken || backendResponse.token, // Backend uses 'accessToken'
    refreshToken: backendResponse.refreshToken,
    expiresIn: backendResponse.expiresIn,
  };
};

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

/**
 * Mock login function for development
 */
const mockLogin = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Test credentials
  if (
    (credentials.email === 'admin@gamilit.com' || credentials.email === 'detective@gamilit.com') &&
    credentials.password === 'Password123!'
  ) {
    return {
      user: {
        id: '1',
        email: credentials.email,
        role: 'student',
        firstName: 'Admin',
        lastName: 'User',
        displayName: 'Admin User',
      },
      token: 'mock-jwt-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: '7d',
    };
  }

  throw new Error('Credenciales inválidas');
};

/**
 * Mock register function for development
 */
const mockRegister = async (data: RegisterData): Promise<AuthResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (data.password !== data.confirmPassword) {
    throw new Error('Las contraseñas no coinciden');
  }

  if (!data.acceptTerms) {
    throw new Error('Debes aceptar los términos y condiciones');
  }

  const nameParts = data.fullName.trim().split(' ');
  const firstName = nameParts[0] || data.fullName;
  const lastName = nameParts.slice(1).join(' ') || '';

  return {
    user: {
      id: '2',
      email: data.email,
      role: 'student',
      firstName: firstName,
      lastName: lastName,
      displayName: data.fullName,
    },
    token: 'mock-jwt-token-' + Date.now(),
    refreshToken: 'mock-refresh-token-' + Date.now(),
    expiresIn: '7d',
  };
};

// ============================================================================
// AUTH API FUNCTIONS
// ============================================================================

/**
 * Login user
 *
 * @param credentials - User login credentials
 * @returns AuthResponse with user data and tokens
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockLogin(credentials);
    }

    // Real API call
    const response = await apiClient.post<any>(
      API_ENDPOINTS.auth.login,
      credentials
    );

    console.log('✅ [authAPI] Login response received:', {
      hasData: !!response.data,
      dataKeys: response.data ? Object.keys(response.data) : [],
      hasUser: !!response.data?.user,
      hasAccessToken: !!response.data?.accessToken,
    });

    // Backend returns data directly, not wrapped in { data: {...} }
    return mapBackendAuthResponse(response.data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Register new user
 *
 * @param registerData - User registration data
 * @returns AuthResponse with user data and tokens
 */
export const register = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockRegister(registerData);
    }

    // Map frontend register data to backend format
    // Backend expects firstName and lastName separately
    const nameParts = registerData.fullName.trim().split(' ');
    const firstName = nameParts[0] || registerData.fullName;
    const lastName = nameParts.slice(1).join(' ') || registerData.fullName;

    const backendRegisterData = {
      email: registerData.email,
      password: registerData.password,
      first_name: firstName,
      last_name: lastName,
      // role removed - Backend assigns 'student' automatically
    };

    // Real API call
    const response = await apiClient.post<any>(
      API_ENDPOINTS.auth.register,
      backendRegisterData
    );

    console.log('✅ [authAPI] Register response received:', {
      hasData: !!response.data,
      hasUser: !!response.data?.user,
      hasAccessToken: !!response.data?.accessToken,
    });

    // Backend returns data directly, not wrapped in { data: {...} }
    return mapBackendAuthResponse(response.data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Logout user
 *
 * @returns Success status
 */
export const logout = async (): Promise<void> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    // Real API call
    await apiClient.post(API_ENDPOINTS.auth.logout);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Refresh authentication token
 *
 * @param refreshToken - Refresh token
 * @returns New access token
 */
export const refreshToken = async (refreshToken: string): Promise<{ token: string }> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { token: 'new-mock-jwt-token-' + Date.now() };
    }

    // Real API call
    const response = await apiClient.post<ApiResponse<{ token: string }>>(
      API_ENDPOINTS.auth.refresh,
      { refreshToken }
    );

    // Extract data from wrapped response
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Verify email address
 *
 * @deprecated Since 2025-10 - Email verification is now disabled.
 * All users are automatically verified upon registration.
 * This function is kept for backward compatibility only.
 *
 * @param token - Email verification token
 * @returns Success status
 */
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    // Real API call (backend endpoint is also deprecated)
    await apiClient.post(API_ENDPOINTS.auth.verifyEmail, { token });
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Request password reset email
 *
 * @param request - Email to send reset link to
 * @returns Success status
 */
export const requestPasswordReset = async (
  request: PasswordResetRequest
): Promise<void> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    // Real API call
    await apiClient.post(API_ENDPOINTS.auth.requestPasswordReset, request);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Reset password with token
 *
 * @param request - Password reset token and new password
 * @returns Success status
 */
export const resetPassword = async (request: PasswordResetConfirm): Promise<void> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    // Real API call
    await apiClient.post(API_ENDPOINTS.auth.resetPassword, request);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Change password for authenticated user
 *
 * @param currentPassword - Current password
 * @param newPassword - New password
 * @returns Success status
 */
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return;
    }

    // Real API call - Backend uses PUT method
    await apiClient.put(API_ENDPOINTS.auth.changePassword, {
      currentPassword,
      newPassword,
    });
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get current authenticated user
 *
 * @returns Current user data
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        id: '1',
        email: 'detective@gamilit.com',
        role: 'student',
        firstName: 'Detective',
        lastName: 'GAMILIT',
        displayName: 'Detective GAMILIT',
      };
    }

    // Real API call - backend returns { success: true, data: { user: {...} } }
    const response = await apiClient.get<ApiResponse<{ user: any }>>(
      API_ENDPOINTS.auth.getCurrentUser
    );

    // Extract and map user from backend format to frontend format
    return mapBackendUserToFrontend(response.data.data.user);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Update user profile
 *
 * @param updates - Partial user updates
 * @returns Updated user data
 */
export const updateProfile = async (updates: Partial<User>): Promise<User> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: '1',
        email: 'detective@gamilit.com',
        role: 'student',
        firstName: updates.firstName || 'Detective',
        lastName: updates.lastName || 'GAMILIT',
        displayName: updates.displayName || 'Detective GAMILIT',
      };
    }

    // Map frontend updates to backend format
    const backendUpdates: any = {};
    if (updates.firstName) {
      backendUpdates.firstName = updates.firstName;
    }
    if (updates.lastName) {
      backendUpdates.lastName = updates.lastName;
    }
    if (updates.displayName) {
      backendUpdates.displayName = updates.displayName;
    }

    // Real API call
    const response = await apiClient.patch<ApiResponse<any>>(
      API_ENDPOINTS.auth.updateProfile,
      backendUpdates
    );

    // Extract and map backend response to frontend format
    return mapBackendUserToFrontend(response.data.data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Check session validity
 *
 * @returns Session information
 */
export const checkSession = async (): Promise<SessionInfo> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      return {
        expiresAt,
        isValid: true,
        needsRefresh: false,
      };
    }

    // Real API call
    const response = await apiClient.get<ApiResponse<SessionInfo>>(
      '/auth/session'
    );

    // Extract data from wrapped response
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Get all active sessions for current user
 *
 * @returns List of user sessions
 */
export const getSessions = async (): Promise<UserSessionInfo[]> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [
        {
          id: '1',
          deviceType: 'desktop',
          browser: 'Chrome',
          os: 'Windows',
          ipAddress: '192.168.1.100',
          location: 'Mexico City, Mexico',
          createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          isCurrent: true,
        },
        {
          id: '2',
          deviceType: 'mobile',
          browser: 'Safari',
          os: 'iOS',
          ipAddress: '192.168.1.101',
          location: 'Mexico City, Mexico',
          createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          isCurrent: false,
        },
        {
          id: '3',
          deviceType: 'desktop',
          browser: 'Firefox',
          os: 'macOS',
          ipAddress: '192.168.1.102',
          location: 'Mexico City, Mexico',
          createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          lastActivity: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          isCurrent: false,
        },
      ];
    }

    // Real API call
    const response = await apiClient.get<ApiResponse<{ sessions: UserSessionInfo[] }>>(
      API_ENDPOINTS.auth.getSessions
    );

    // Extract and return sessions from wrapped response
    return response.data.data.sessions;
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Revoke specific session
 *
 * @param sessionId - Session ID to revoke
 * @returns Success status
 */
export const revokeSession = async (sessionId: string): Promise<void> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    // Real API call
    await apiClient.delete(API_ENDPOINTS.auth.revokeSession(sessionId));
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export const authAPI = {
  login,
  register,
  logout,
  refreshToken,
  verifyEmail,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getCurrentUser,
  updateProfile,
  checkSession,
  getSessions,
  revokeSession,
};

export default authAPI;
