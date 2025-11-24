/**
 * Notifications API
 *
 * API client for notifications endpoints.
 * Phase 4 implementation.
 */

import { apiClient } from './apiClient';

export interface Notification {
  id: string;
  userId: string;
  type:
    | 'achievement_unlocked'
    | 'rank_promoted'
    | 'mission_completed'
    | 'mission_expired'
    | 'friend_request'
    | 'friend_accepted'
    | 'assignment_created'
    | 'assignment_graded'
    | 'module_unlocked'
    | 'coins_received'
    | 'system_announcement';
  title: string;
  message: string;
  data?: Record<string, any>;
  status: 'unread' | 'read';
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ========== MULTI-CHANNEL TYPES (EXT-003) ==========

export interface NotificationPreference {
  id: string;
  userId: string;
  notificationType: string;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  pushEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PreferencesListResponse {
  preferences: NotificationPreference[];
}

export interface UpdatePreferenceDto {
  inAppEnabled?: boolean;
  emailEnabled?: boolean;
  pushEnabled?: boolean;
}

export interface UpdateMultiplePreferencesDto {
  preferences: Array<{
    notificationType: string;
    inAppEnabled?: boolean;
    emailEnabled?: boolean;
    pushEnabled?: boolean;
  }>;
}

export interface UserDevice {
  id: string;
  userId: string;
  deviceToken: string; // Masked for security
  deviceType: 'ios' | 'android' | 'web';
  deviceName?: string;
  isActive: boolean;
  lastUsedAt?: string;
  createdAt: string;
}

export interface DevicesListResponse {
  devices: UserDevice[];
}

export interface RegisterDeviceDto {
  deviceToken: string;
  deviceType: 'ios' | 'android' | 'web';
  deviceName?: string;
}

export interface UpdateDeviceNameDto {
  deviceName: string;
}

export const notificationsAPI = {
  // ========== BASIC NOTIFICATIONS (Sistema Básico) ==========

  /**
   * Get user notifications with optional filters
   */
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: 'unread' | 'read' | 'all';
  }): Promise<NotificationsResponse> => {
    const response = await apiClient.get('/notifications', { params });
    return response.data.data;
  },

  /**
   * Get count of unread notifications
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.data.count;
  },

  /**
   * Mark specific notification as read
   */
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<number> => {
    const response = await apiClient.post('/notifications/read-all');
    return response.data.data.marked;
  },

  /**
   * Delete specific notification
   */
  deleteNotification: async (id: string): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  /**
   * Clear all notifications
   */
  clearAll: async (): Promise<number> => {
    const response = await apiClient.delete('/notifications/clear-all');
    return response.data.data.deleted;
  },

  // ========== PREFERENCES (Multi-Channel EXT-003) ==========

  /**
   * Get user notification preferences
   *
   * Returns all configured preferences.
   * If user has no preferences configured, returns empty array
   * (system will use defaults: in_app=true, email=true, push=false)
   */
  getPreferences: async (): Promise<PreferencesListResponse> => {
    const response = await apiClient.get('/notifications/preferences');
    return response.data;
  },

  /**
   * Update preference for specific notification type
   *
   * Uses upsert pattern: creates if not exists, updates if exists
   *
   * @param notificationType - Type of notification (e.g., 'achievement', 'friend_request')
   * @param updates - Channels to enable/disable
   */
  updatePreference: async (
    notificationType: string,
    updates: UpdatePreferenceDto,
  ): Promise<NotificationPreference> => {
    const response = await apiClient.patch(
      `/notifications/preferences/${notificationType}`,
      updates,
    );
    return response.data;
  },

  /**
   * Update multiple preferences at once (batch update)
   *
   * Useful for settings page with multiple toggles
   *
   * @param dto - Array of preferences to update
   */
  updateMultiplePreferences: async (
    dto: UpdateMultiplePreferencesDto,
  ): Promise<PreferencesListResponse> => {
    const response = await apiClient.patch('/notifications/preferences', dto);
    return response.data;
  },

  // ========== DEVICES (Push Notifications EXT-003) ==========

  /**
   * Get user's registered devices
   *
   * Returns only active devices by default
   */
  getDevices: async (): Promise<DevicesListResponse> => {
    const response = await apiClient.get('/notifications/devices');
    return response.data;
  },

  /**
   * Register device for push notifications
   *
   * Flow:
   * 1. App obtains device token from Firebase Cloud Messaging (FCM)
   * 2. App calls this endpoint with token + metadata
   * 3. Backend registers with upsert pattern
   * 4. User is enabled to receive push notifications
   *
   * Uses upsert: if device already exists, updates last_used_at
   *
   * @param dto - Device registration data
   */
  registerDevice: async (dto: RegisterDeviceDto): Promise<UserDevice> => {
    const response = await apiClient.post('/notifications/devices', dto);
    return response.data;
  },

  /**
   * Update device name
   *
   * Allows user to customize device name for easier identification
   *
   * @param deviceId - UUID of the device
   * @param dto - New device name
   */
  updateDeviceName: async (
    deviceId: string,
    dto: UpdateDeviceNameDto,
  ): Promise<UserDevice> => {
    const response = await apiClient.patch(`/notifications/devices/${deviceId}`, dto);
    return response.data;
  },

  /**
   * Delete device
   *
   * Use cases:
   * - User no longer uses that device
   * - User wants to stop receiving push on that device
   * - Lost/stolen device
   *
   * IMPORTANT: Permanently deletes the record
   *
   * @param deviceId - UUID of the device
   */
  deleteDevice: async (deviceId: string): Promise<void> => {
    await apiClient.delete(`/notifications/devices/${deviceId}`);
  },
};
