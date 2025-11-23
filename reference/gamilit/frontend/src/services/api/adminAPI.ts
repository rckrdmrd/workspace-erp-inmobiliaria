/**
 * Admin API Integration
 *
 * API client for admin portal including:
 * - Dashboard metrics and analytics
 * - User management (CRUD, activation, suspension)
 * - Organization management (institutions)
 * - Content moderation and approvals
 * - Roles and permissions
 * - Gamification configuration
 * - System monitoring and logs
 * - Settings and configuration
 * - Reports generation
 *
 * Created for FE-051 - Admin Portal Integration
 */

import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './apiConfig';
import { handleAPIError } from './apiErrorHandler';
import type { ApiResponse } from './apiTypes';
import type {
  // Dashboard
  DashboardData,
  // Organizations
  Organization,
  OrganizationFilters,
  OrganizationUser,
  // Content
  PendingContent,
  ContentFilters,
  MediaFile,
  ApprovalHistory,
  // Users
  User,
  UserFilters,
  UserDetails,
  // Roles
  Role,
  RolePermissions,
  Permission,
  AvailablePermission,
  // Gamification
  GamificationSettings,
  MayaRank,
  Achievement,
  EconomyConfig,
  GamificationStats,
  // Monitoring
  SystemHealth,
  SystemMetrics,
  LogEntry,
  LogFilters,
  MaintenanceMode,
  // Settings
  SystemConfig,
  SettingsCategory,
  GeneralSettings,
  EmailSettings,
  NotificationSettings,
  SecuritySettings,
  MaintenanceSettings,
  // Reports
  Report,
  GenerateReportParams,
  ReportListFilters,
  // Common
  PaginatedResponse,
} from './adminTypes';

// ============================================================================
// DASHBOARD
// ============================================================================

/**
 * Get admin dashboard data
 * Includes: stats, recent activity, growth data
 *
 * Status: Backend NOT implemented (P0)
 */
export async function getAdminDashboard(): Promise<DashboardData> {
  try {
    const response = await apiClient.get<ApiResponse<DashboardData>>(
      API_ENDPOINTS.admin.dashboard
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch admin dashboard');
  }
}

// ============================================================================
// ORGANIZATIONS (INSTITUTIONS)
// ============================================================================

/**
 * Get list of organizations with filters
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getOrganizations(
  filters?: OrganizationFilters
): Promise<PaginatedResponse<Organization>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Organization>>>(
      API_ENDPOINTS.admin.organizations.list,
      { params: filters }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch organizations');
  }
}

/**
 * Get organization details
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getOrganization(id: string): Promise<Organization> {
  try {
    const response = await apiClient.get<ApiResponse<Organization>>(
      API_ENDPOINTS.admin.organizations.get(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to fetch organization ${id}`);
  }
}

/**
 * Create new organization
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function createOrganization(
  data: Partial<Organization>
): Promise<Organization> {
  try {
    const response = await apiClient.post<ApiResponse<Organization>>(
      API_ENDPOINTS.admin.organizations.create,
      data
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to create organization');
  }
}

/**
 * Update organization
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function updateOrganization(
  id: string,
  updates: Partial<Organization>
): Promise<Organization> {
  try {
    const response = await apiClient.put<ApiResponse<Organization>>(
      API_ENDPOINTS.admin.organizations.update(id),
      updates
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update organization ${id}`);
  }
}

/**
 * Delete organization
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function deleteOrganization(id: string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.admin.organizations.delete(id));
  } catch (error) {
    throw handleAPIError(error, `Failed to delete organization ${id}`);
  }
}

/**
 * Get organization users
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getOrganizationUsers(
  id: string,
  page = 1
): Promise<PaginatedResponse<OrganizationUser>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<OrganizationUser>>>(
      API_ENDPOINTS.admin.organizations.users(id),
      { params: { page } }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to fetch users for organization ${id}`);
  }
}

/**
 * Update organization subscription
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function updateOrganizationSubscription(
  id: string,
  subscription: any
): Promise<Organization> {
  try {
    const response = await apiClient.patch<ApiResponse<Organization>>(
      API_ENDPOINTS.admin.organizations.updateSubscription(id),
      subscription
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update subscription for organization ${id}`);
  }
}

/**
 * Update organization features
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function updateOrganizationFeatures(
  id: string,
  features: string[]
): Promise<Organization> {
  try {
    const response = await apiClient.patch<ApiResponse<Organization>>(
      API_ENDPOINTS.admin.organizations.updateFeatures(id),
      { features }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update features for organization ${id}`);
  }
}

// ============================================================================
// CONTENT & APPROVALS
// ============================================================================

/**
 * Get pending content for moderation
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getPendingContent(
  filters?: ContentFilters
): Promise<PaginatedResponse<PendingContent>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<PendingContent>>>(
      API_ENDPOINTS.admin.approvals.pending,
      { params: filters }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch pending content');
  }
}

/**
 * Approve content
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function approveContent(id: string): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.admin.approvals.approve(id));
  } catch (error) {
    throw handleAPIError(error, `Failed to approve content ${id}`);
  }
}

/**
 * Reject content
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function rejectContent(id: string, reason?: string): Promise<void> {
  try {
    await apiClient.post(API_ENDPOINTS.admin.approvals.reject(id), { reason });
  } catch (error) {
    throw handleAPIError(error, `Failed to reject content ${id}`);
  }
}

/**
 * Get media library
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getMediaLibrary(
  filters?: any
): Promise<PaginatedResponse<MediaFile>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<MediaFile>>>(
      API_ENDPOINTS.admin.content.mediaLibrary,
      { params: filters }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch media library');
  }
}

/**
 * Delete media file
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function deleteMediaFile(id: string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.admin.content.deleteMedia(id));
  } catch (error) {
    throw handleAPIError(error, `Failed to delete media ${id}`);
  }
}

/**
 * Get approval history
 *
 * Status: Backend NOT implemented (P2)
 */
export async function getApprovalHistory(
  page = 1
): Promise<PaginatedResponse<ApprovalHistory>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ApprovalHistory>>>(
      API_ENDPOINTS.admin.approvals.history,
      { params: { page } }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch approval history');
  }
}

// ============================================================================
// USERS
// ============================================================================

/**
 * Get list of users with filters
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getUsers(
  filters?: UserFilters
): Promise<PaginatedResponse<User>> {
  try {
    // FE-062: Transform pagination params to match backend ListUsersDto
    // Backend expects 'limit' not 'pageSize', and doesn't support sortBy/sortOrder yet
    let transformedFilters: any = undefined;
    if (filters) {
      const { pageSize, sortBy, sortOrder, ...rest } = filters as any;
      transformedFilters = {
        ...rest,
        ...(pageSize && { limit: pageSize }),  // Map pageSize → limit
      };
    }

    // Backend returns different structure than expected
    // Need to check what actually comes back
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.admin.users.list,
      { params: transformedFilters }
    );

    const backendData = response.data.data;

    // FE-062: Handle different response structures from backend
    // Backend may return either a direct array or an object with data property
    let transformed: PaginatedResponse<User>;

    if (Array.isArray(backendData)) {
      // Backend returns array directly (no pagination info)
      transformed = {
        items: backendData,
        pagination: {
          page: 1,
          totalPages: 1,
          totalItems: backendData.length,
          limit: backendData.length,
        }
      };
    } else if (backendData && typeof backendData === 'object') {
      // Backend returns object with data property
      transformed = {
        items: backendData.data || [],
        pagination: {
          page: backendData.page || 1,
          totalPages: backendData.total_pages || 0,
          totalItems: backendData.total || 0,
          limit: backendData.limit || 20,
        }
      };
    } else {
      // Fallback for unexpected response structure
      transformed = {
        items: [],
        pagination: { page: 1, totalPages: 0, totalItems: 0, limit: 20 }
      };
    }

    return transformed;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch users');
  }
}

/**
 * Get user details
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getUser(id: string): Promise<UserDetails> {
  try {
    const response = await apiClient.get<ApiResponse<UserDetails>>(
      API_ENDPOINTS.admin.users.get(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to fetch user ${id}`);
  }
}

/**
 * Update user
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function updateUser(
  id: string,
  updates: Partial<User>
): Promise<User> {
  try {
    const response = await apiClient.put<ApiResponse<User>>(
      API_ENDPOINTS.admin.users.update(id),
      updates
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update user ${id}`);
  }
}

/**
 * Delete user
 *
 * Status: Backend NOT implemented (P0)
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.admin.users.delete(id));
  } catch (error) {
    throw handleAPIError(error, `Failed to delete user ${id}`);
  }
}

/**
 * Activate user
 *
 * Status: Backend NOT implemented (P0)
 */
export async function activateUser(id: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.admin.users.activate(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to activate user ${id}`);
  }
}

/**
 * Deactivate user
 *
 * Status: Backend NOT implemented (P0)
 */
export async function deactivateUser(id: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.admin.users.deactivate(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to deactivate user ${id}`);
  }
}

/**
 * Suspend user
 *
 * Status: Backend NOT implemented (P0)
 */
export async function suspendUser(id: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.admin.users.suspend(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to suspend user ${id}`);
  }
}

/**
 * Unsuspend user
 *
 * Status: Backend NOT implemented (P0)
 */
export async function unsuspendUser(id: string): Promise<User> {
  try {
    const response = await apiClient.post<ApiResponse<User>>(
      API_ENDPOINTS.admin.users.unsuspend(id)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to unsuspend user ${id}`);
  }
}

// ============================================================================
// ROLES & PERMISSIONS
// ============================================================================

/**
 * Get list of roles
 *
 * Status: Backend NOT implemented (P0)
 */
export async function getRoles(): Promise<Role[]> {
  try {
    const response = await apiClient.get<ApiResponse<Role[]>>(
      API_ENDPOINTS.admin.roles.list
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch roles');
  }
}

/**
 * Get role with permissions
 *
 * Status: Backend NOT implemented (P0)
 */
export async function getRolePermissions(roleId: string): Promise<RolePermissions> {
  try {
    const response = await apiClient.get<ApiResponse<RolePermissions>>(
      API_ENDPOINTS.admin.roles.permissions(roleId)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to fetch permissions for role ${roleId}`);
  }
}

/**
 * Update role permissions
 *
 * Status: Backend NOT implemented (P0)
 */
export async function updateRolePermissions(
  roleId: string,
  permissions: Permission[]
): Promise<RolePermissions> {
  try {
    const response = await apiClient.put<ApiResponse<RolePermissions>>(
      API_ENDPOINTS.admin.roles.updatePermissions(roleId),
      { permissions }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update permissions for role ${roleId}`);
  }
}

/**
 * Get all available permissions
 *
 * Status: Backend NOT implemented (P0)
 */
export async function getAvailablePermissions(): Promise<AvailablePermission[]> {
  try {
    const response = await apiClient.get<ApiResponse<AvailablePermission[]>>(
      API_ENDPOINTS.admin.roles.availablePermissions
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch available permissions');
  }
}

// ============================================================================
// GAMIFICATION
// ============================================================================

/**
 * Get gamification settings
 *
 * Status: Backend NOT implemented (P1)
 */
export async function getGamificationSettings(): Promise<GamificationSettings> {
  try {
    const response = await apiClient.get<ApiResponse<GamificationSettings>>(
      API_ENDPOINTS.admin.gamification.settings
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch gamification settings');
  }
}

/**
 * Update gamification settings
 *
 * Status: Backend NOT implemented (P1)
 */
export async function updateGamificationSettings(
  category: 'ranks' | 'achievements' | 'economy',
  data: any
): Promise<GamificationSettings> {
  try {
    const response = await apiClient.put<ApiResponse<GamificationSettings>>(
      API_ENDPOINTS.admin.gamification.updateSettings,
      { category, data }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update gamification ${category}`);
  }
}

/**
 * Preview gamification changes impact
 *
 * Status: Backend NOT implemented (P1)
 */
export async function previewGamificationChanges(changes: any): Promise<any> {
  try {
    const response = await apiClient.post<ApiResponse<any>>(
      API_ENDPOINTS.admin.gamification.previewChanges,
      { changes }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to preview gamification changes');
  }
}

/**
 * Restore gamification defaults
 *
 * Status: Backend NOT implemented (P1)
 */
export async function restoreGamificationDefaults(): Promise<GamificationSettings> {
  try {
    const response = await apiClient.post<ApiResponse<GamificationSettings>>(
      API_ENDPOINTS.admin.gamification.restoreDefaults
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to restore gamification defaults');
  }
}

// ============================================================================
// MONITORING
// ============================================================================

/**
 * Get system health
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getSystemHealth(): Promise<SystemHealth> {
  try {
    const response = await apiClient.get<ApiResponse<SystemHealth>>(
      API_ENDPOINTS.admin.system.health
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch system health');
  }
}

/**
 * Get system metrics
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getSystemMetrics(): Promise<SystemMetrics> {
  try {
    const response = await apiClient.get<ApiResponse<SystemMetrics>>(
      API_ENDPOINTS.admin.system.metrics
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch system metrics');
  }
}

/**
 * Get system logs
 *
 * Status: Backend NOT implemented (P1)
 */
export async function getSystemLogs(
  filters?: LogFilters
): Promise<PaginatedResponse<LogEntry>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<LogEntry>>>(
      API_ENDPOINTS.admin.system.logs,
      { params: filters }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch system logs');
  }
}

/**
 * Toggle maintenance mode
 *
 * Status: Backend PARTIAL (needs completion - P1)
 */
export async function toggleMaintenanceMode(
  enabled: boolean,
  message?: string
): Promise<MaintenanceMode> {
  try {
    const response = await apiClient.post<ApiResponse<MaintenanceMode>>(
      API_ENDPOINTS.admin.system.maintenance,
      { enabled, message }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to toggle maintenance mode');
  }
}

// ============================================================================
// SETTINGS
// ============================================================================

/**
 * Get system configuration
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function getSystemConfig(): Promise<SystemConfig> {
  try {
    const response = await apiClient.get<ApiResponse<SystemConfig>>(
      API_ENDPOINTS.admin.system.config
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch system config');
  }
}

/**
 * Update system configuration
 *
 * Status: Backend IMPLEMENTED ✅
 */
export async function updateSystemConfig(config: SystemConfig): Promise<SystemConfig> {
  try {
    const response = await apiClient.post<ApiResponse<SystemConfig>>(
      API_ENDPOINTS.admin.system.config,
      config
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to update system config');
  }
}

/**
 * Get config categories
 *
 * Status: Backend NOT implemented (P1)
 */
export async function getConfigCategories(): Promise<SettingsCategory[]> {
  try {
    const response = await apiClient.get<ApiResponse<SettingsCategory[]>>(
      API_ENDPOINTS.admin.system.configCategories
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch config categories');
  }
}

/**
 * Get category configuration
 *
 * Status: Backend NOT implemented (P1)
 */
export async function getCategoryConfig(category: SettingsCategory): Promise<any> {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.admin.system.categoryConfig(category)
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to fetch config for category ${category}`);
  }
}

/**
 * Update category configuration
 *
 * Status: Backend NOT implemented (P1)
 */
export async function updateCategoryConfig(
  category: SettingsCategory,
  settings: any
): Promise<any> {
  try {
    const response = await apiClient.put<ApiResponse<any>>(
      API_ENDPOINTS.admin.system.categoryConfig(category),
      settings
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to update config for category ${category}`);
  }
}

/**
 * Validate configuration
 *
 * Status: Backend NOT implemented (P1)
 */
export async function validateConfig(
  category: SettingsCategory,
  settings: any
): Promise<{ valid: boolean; errors?: any[] }> {
  try {
    const response = await apiClient.post<ApiResponse<{ valid: boolean; errors?: any[] }>>(
      API_ENDPOINTS.admin.system.validateConfig,
      { category, settings }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to validate config');
  }
}

// ============================================================================
// REPORTS
// ============================================================================

/**
 * Generate report
 *
 * Status: Backend NOT implemented (P2)
 */
export async function generateReport(params: GenerateReportParams): Promise<Report> {
  try {
    const response = await apiClient.post<ApiResponse<Report>>(
      API_ENDPOINTS.admin.reports.generate,
      params
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to generate report');
  }
}

/**
 * Get list of reports
 *
 * Status: Backend NOT implemented (P2)
 */
export async function getReports(
  filters?: ReportListFilters
): Promise<PaginatedResponse<Report>> {
  try {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Report>>>(
      API_ENDPOINTS.admin.reports.list,
      { params: filters }
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, 'Failed to fetch reports');
  }
}

/**
 * Download report
 *
 * Status: Backend NOT implemented (P2)
 */
export async function downloadReport(reportId: string): Promise<Blob> {
  try {
    const response = await apiClient.get(
      API_ENDPOINTS.admin.reports.download(reportId),
      { responseType: 'blob' }
    );
    return response.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to download report ${reportId}`);
  }
}

/**
 * Delete report
 *
 * Status: Backend NOT implemented (P2)
 */
export async function deleteReport(reportId: string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.admin.reports.delete(reportId));
  } catch (error) {
    throw handleAPIError(error, `Failed to delete report ${reportId}`);
  }
}

/**
 * Schedule report
 *
 * Status: Backend NOT implemented (P2)
 */
export async function scheduleReport(
  reportId: string,
  schedule: any
): Promise<Report> {
  try {
    const response = await apiClient.post<ApiResponse<Report>>(
      API_ENDPOINTS.admin.reports.schedule(reportId),
      schedule
    );
    return response.data.data;
  } catch (error) {
    throw handleAPIError(error, `Failed to schedule report ${reportId}`);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

/**
 * Admin API service object
 * Organizes all admin API functions by module
 */
export const adminAPI = {
  // Dashboard
  getDashboard: getAdminDashboard,

  // Organizations
  organizations: {
    list: getOrganizations,
    get: getOrganization,
    create: createOrganization,
    update: updateOrganization,
    delete: deleteOrganization,
    getUsers: getOrganizationUsers,
    updateSubscription: updateOrganizationSubscription,
    updateFeatures: updateOrganizationFeatures,
  },

  // Content & Approvals
  content: {
    getPending: getPendingContent,
    approve: approveContent,
    reject: rejectContent,
    getMediaLibrary,
    deleteMedia: deleteMediaFile,
    getApprovalHistory,
  },

  // Users
  users: {
    list: getUsers,
    get: getUser,
    update: updateUser,
    delete: deleteUser,
    activate: activateUser,
    deactivate: deactivateUser,
    suspend: suspendUser,
    unsuspend: unsuspendUser,
  },

  // Roles
  roles: {
    list: getRoles,
    getPermissions: getRolePermissions,
    updatePermissions: updateRolePermissions,
    getAvailablePermissions,
  },

  // Gamification
  gamification: {
    getSettings: getGamificationSettings,
    updateSettings: updateGamificationSettings,
    previewChanges: previewGamificationChanges,
    restoreDefaults: restoreGamificationDefaults,
  },

  // Monitoring
  monitoring: {
    getHealth: getSystemHealth,
    getMetrics: getSystemMetrics,
    getLogs: getSystemLogs,
    toggleMaintenance: toggleMaintenanceMode,
  },

  // Settings
  settings: {
    getConfig: getSystemConfig,
    updateConfig: updateSystemConfig,
    getCategories: getConfigCategories,
    getCategoryConfig,
    updateCategoryConfig,
    validateConfig,
  },

  // Reports
  reports: {
    generate: generateReport,
    list: getReports,
    download: downloadReport,
    delete: deleteReport,
    schedule: scheduleReport,
  },
};

export default adminAPI;
