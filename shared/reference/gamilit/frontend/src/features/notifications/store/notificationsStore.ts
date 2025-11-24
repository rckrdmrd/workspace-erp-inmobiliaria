/**
 * Notifications Store
 *
 * Centralized Zustand store for notifications.
 * Updated to use centralized notificationsAPI.
 */

import { create } from 'zustand';
import {
  notificationsAPI,
  Notification,
  NotificationPreference,
  UserDevice,
  UpdatePreferenceDto,
  UpdateMultiplePreferencesDto,
  RegisterDeviceDto,
} from '@/services/api/notificationsAPI';

interface NotificationsState {
  // Basic notifications
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Multi-channel (EXT-003)
  preferences: NotificationPreference[];
  devices: UserDevice[];
  preferencesLoading: boolean;
  devicesLoading: boolean;

  // Basic Actions
  fetchNotifications: (unreadOnly?: boolean) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearAll: () => Promise<void>;

  // Preferences Actions (Multi-Channel)
  fetchPreferences: () => Promise<void>;
  updatePreference: (
    notificationType: string,
    updates: UpdatePreferenceDto,
  ) => Promise<void>;
  updateMultiplePreferences: (dto: UpdateMultiplePreferencesDto) => Promise<void>;

  // Devices Actions (Push Notifications)
  fetchDevices: () => Promise<void>;
  registerDevice: (dto: RegisterDeviceDto) => Promise<void>;
  updateDeviceName: (deviceId: string, deviceName: string) => Promise<void>;
  deleteDevice: (deviceId: string) => Promise<void>;

  // Real-time updates (WebSocket)
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  // Basic notifications state
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  // Multi-channel state
  preferences: [],
  devices: [],
  preferencesLoading: false,
  devicesLoading: false,

  fetchNotifications: async (unreadOnly = false) => {
    set({ isLoading: true, error: null });
    try {
      const data = await notificationsAPI.getNotifications({
        limit: 50,
        status: unreadOnly ? 'unread' : 'all',
      });
      set({ notifications: data.notifications, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await notificationsAPI.getUnreadCount();
      set({ unreadCount: count });
    } catch (error: any) {
      console.error('Failed to fetch unread count:', error);
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      await notificationsAPI.markAsRead(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, status: 'read' as const } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, status: 'read' as const })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await notificationsAPI.deleteNotification(notificationId);
      set((state) => {
        const notification = state.notifications.find((n) => n.id === notificationId);
        const wasUnread = notification?.status === 'unread';
        return {
          notifications: state.notifications.filter((n) => n.id !== notificationId),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  clearAll: async () => {
    try {
      await notificationsAPI.clearAll();
      set({ notifications: [], unreadCount: 0 });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  // ========== PREFERENCES ACTIONS (Multi-Channel) ==========

  /**
   * Fetch user notification preferences
   *
   * If user has no preferences configured, returns empty array
   * (system will use defaults: in_app=true, email=true, push=false)
   */
  fetchPreferences: async () => {
    set({ preferencesLoading: true, error: null });
    try {
      const data = await notificationsAPI.getPreferences();
      set({ preferences: data.preferences, preferencesLoading: false });
    } catch (error: any) {
      set({ error: error.message, preferencesLoading: false });
      console.error('Failed to fetch preferences:', error);
    }
  },

  /**
   * Update preference for specific notification type
   *
   * @param notificationType - Type (e.g., 'achievement', 'friend_request')
   * @param updates - Channels to enable/disable
   */
  updatePreference: async (
    notificationType: string,
    updates: UpdatePreferenceDto,
  ) => {
    set({ preferencesLoading: true, error: null });
    try {
      const updatedPref = await notificationsAPI.updatePreference(
        notificationType,
        updates,
      );

      // Update local state
      set((state) => {
        const existingIndex = state.preferences.findIndex(
          (p) => p.notificationType === notificationType,
        );

        if (existingIndex >= 0) {
          // Update existing
          const newPreferences = [...state.preferences];
          newPreferences[existingIndex] = updatedPref;
          return { preferences: newPreferences, preferencesLoading: false };
        } else {
          // Add new
          return {
            preferences: [...state.preferences, updatedPref],
            preferencesLoading: false,
          };
        }
      });
    } catch (error: any) {
      set({ error: error.message, preferencesLoading: false });
      console.error('Failed to update preference:', error);
    }
  },

  /**
   * Update multiple preferences at once (batch update)
   *
   * @param dto - Array of preferences to update
   */
  updateMultiplePreferences: async (dto: UpdateMultiplePreferencesDto) => {
    set({ preferencesLoading: true, error: null });
    try {
      const data = await notificationsAPI.updateMultiplePreferences(dto);
      set({ preferences: data.preferences, preferencesLoading: false });
    } catch (error: any) {
      set({ error: error.message, preferencesLoading: false });
      console.error('Failed to update multiple preferences:', error);
    }
  },

  // ========== DEVICES ACTIONS (Push Notifications) ==========

  /**
   * Fetch user's registered devices
   */
  fetchDevices: async () => {
    set({ devicesLoading: true, error: null });
    try {
      const data = await notificationsAPI.getDevices();
      set({ devices: data.devices, devicesLoading: false });
    } catch (error: any) {
      set({ error: error.message, devicesLoading: false });
      console.error('Failed to fetch devices:', error);
    }
  },

  /**
   * Register device for push notifications
   *
   * @param dto - Device registration data (token, type, name)
   */
  registerDevice: async (dto: RegisterDeviceDto) => {
    set({ devicesLoading: true, error: null });
    try {
      const newDevice = await notificationsAPI.registerDevice(dto);

      // Add to local state
      set((state) => ({
        devices: [newDevice, ...state.devices],
        devicesLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, devicesLoading: false });
      console.error('Failed to register device:', error);
      throw error; // Re-throw so UI can handle it
    }
  },

  /**
   * Update device name
   *
   * @param deviceId - UUID of the device
   * @param deviceName - New device name
   */
  updateDeviceName: async (deviceId: string, deviceName: string) => {
    set({ devicesLoading: true, error: null });
    try {
      const updatedDevice = await notificationsAPI.updateDeviceName(deviceId, {
        deviceName,
      });

      // Update local state
      set((state) => ({
        devices: state.devices.map((d) =>
          d.id === deviceId ? updatedDevice : d,
        ),
        devicesLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, devicesLoading: false });
      console.error('Failed to update device name:', error);
      throw error;
    }
  },

  /**
   * Delete device
   *
   * @param deviceId - UUID of the device
   */
  deleteDevice: async (deviceId: string) => {
    set({ devicesLoading: true, error: null });
    try {
      await notificationsAPI.deleteDevice(deviceId);

      // Remove from local state
      set((state) => ({
        devices: state.devices.filter((d) => d.id !== deviceId),
        devicesLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, devicesLoading: false });
      console.error('Failed to delete device:', error);
      throw error;
    }
  },

  // ========== REAL-TIME UPDATES (WebSocket) ==========

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  updateNotification: (id: string, updates: Partial<Notification>) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, ...updates } : n
      ),
    }));
  },
}));
