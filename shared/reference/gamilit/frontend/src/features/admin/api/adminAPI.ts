/**
 * Admin API Integration
 *
 * API client for admin endpoints including user management,
 * user activation/deactivation, and user filtering.
 */

import { apiClient } from '@/services/api/apiClient';
import { API_ENDPOINTS, FEATURE_FLAGS } from '@/services/api/apiConfig';
import { handleAPIError } from '@/services/api/apiErrorHandler';
import type { User } from '@features/auth/types/auth.types';
import type { ApiResponse } from '@/services/api/apiTypes';

// ============================================================================
// TYPES
// ============================================================================

export interface UserListFilters {
  search?: string;
  role?: 'student' | 'admin_teacher' | 'super_admin';
  is_active?: boolean | 'all';
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ActivateUserRequest {
  reason?: string;
}

export interface DeactivateUserRequest {
  reason: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Map backend user response to frontend User type
 */
const mapBackendUserToFrontend = (backendUser: any): User => {
  const fullName = backendUser.displayName ||
                   `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() ||
                   backendUser.email.split('@')[0];

  return {
    id: backendUser.id,
    email: backendUser.email,
    fullName: fullName,
    role: backendUser.role || 'student',
  };
};

// ============================================================================
// MOCK DATA (for development)
// ============================================================================

/**
 * Mock users list for development
 */
const mockGetUsersList = async (filters?: UserListFilters): Promise<UserListResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'student1@glit.com',
      fullName: 'Ana García',
      role: 'student',
      emailVerified: true,
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      email: 'teacher1@glit.com',
      fullName: 'Carlos Pérez',
      role: 'admin_teacher',
      emailVerified: true,
      isActive: true,
      createdAt: '2024-01-10T10:00:00Z'
    },
    {
      id: '3',
      email: 'admin@glit.com',
      fullName: 'María López',
      role: 'super_admin',
      emailVerified: true,
      isActive: true,
      createdAt: '2024-01-05T10:00:00Z'
    },
    {
      id: '4',
      email: 'student2@glit.com',
      fullName: 'Pedro Martínez',
      role: 'student',
      emailVerified: true,
      isActive: false,
      createdAt: '2024-02-01T10:00:00Z'
    },
    {
      id: '5',
      email: 'teacher2@glit.com',
      fullName: 'Laura González',
      role: 'admin_teacher',
      emailVerified: true,
      isActive: true,
      createdAt: '2024-02-15T10:00:00Z'
    },
    {
      id: '6',
      email: 'student3@glit.com',
      fullName: 'Juan Rodríguez',
      role: 'student',
      emailVerified: false,
      isActive: false,
      createdAt: '2024-03-01T10:00:00Z'
    },
  ];

  // Apply filters
  let filtered = [...mockUsers];

  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(u =>
      (u.fullName ?? '').toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower)
    );
  }

  if (filters?.role) {
    filtered = filtered.filter(u => u.role === filters.role);
  }

  if (filters?.is_active !== undefined && filters?.is_active !== 'all') {
    filtered = filtered.filter(u => u.isActive === filters.is_active);
  }

  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    users: paginated,
    total: filtered.length,
    page,
    limit,
  };
};

/**
 * Mock activate user for development
 */
const mockActivateUser = async (userId: string, request?: ActivateUserRequest): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: userId,
    email: 'user@glit.com',
    fullName: 'Test User',
    role: 'student',
  };
};

/**
 * Mock deactivate user for development
 */
const mockDeactivateUser = async (userId: string, request: DeactivateUserRequest): Promise<User> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!request.reason || request.reason.length < 10) {
    throw new Error('La razón debe tener al menos 10 caracteres');
  }

  return {
    id: userId,
    email: 'user@glit.com',
    fullName: 'Test User',
    role: 'student',
  };
};

// ============================================================================
// ADMIN API FUNCTIONS
// ============================================================================

/**
 * Get list of users with optional filters
 *
 * @param filters - Optional filters for user list
 * @returns UserListResponse with users and pagination info
 */
export const getUsersList = async (filters?: UserListFilters): Promise<UserListResponse> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockGetUsersList(filters);
    }

    // Build query params
    const params: any = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.role) params.role = filters.role;
    if (filters?.is_active !== undefined && filters?.is_active !== 'all') {
      params.is_active = filters.is_active;
    }
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;

    // Real API call
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.admin.users.list,
      { params }
    );

    // Extract and map backend response to frontend format
    const data = response.data.data;
    return {
      users: data.users.map(mapBackendUserToFrontend),
      total: data.total || data.users.length,
      page: data.page || filters?.page || 1,
      limit: data.limit || filters?.limit || 20,
    };
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Activate a user account
 *
 * @param userId - User ID to activate
 * @param request - Optional activation request with reason
 * @returns Updated user data
 */
export const activateUser = async (
  userId: string,
  request?: ActivateUserRequest
): Promise<User> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockActivateUser(userId, request);
    }

    // Real API call
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.admin.users.activate(userId),
      request || {}
    );

    // Extract and map backend response to frontend format
    return mapBackendUserToFrontend(response.data.data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

/**
 * Deactivate a user account
 *
 * @param userId - User ID to deactivate
 * @param request - Deactivation request with reason
 * @returns Updated user data
 */
export const deactivateUser = async (
  userId: string,
  request: DeactivateUserRequest
): Promise<User> => {
  try {
    // Use mock data if feature flag is enabled
    if (FEATURE_FLAGS.USE_MOCK_DATA) {
      return await mockDeactivateUser(userId, request);
    }

    // Real API call
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.admin.users.deactivate(userId),
      request
    );

    // Extract and map backend response to frontend format
    return mapBackendUserToFrontend(response.data.data);
  } catch (error) {
    throw handleAPIError(error);
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export const adminAPI = {
  getUsersList,
  activateUser,
  deactivateUser,
};

export default adminAPI;
