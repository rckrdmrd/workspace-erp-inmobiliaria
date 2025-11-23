/**
 * Notifications Integration Tests
 *
 * Tests for notifications system integrating store with API calls.
 *
 * Test Coverage:
 * - Store Initialization (2 tests): Initial state, structure
 * - Fetch Notifications (3 tests): Fetch all, fetch unread, error handling
 * - Fetch Unread Count (2 tests): Get count, handle errors
 * - Mark As Read (3 tests): Mark single, update unread count, error handling
 * - Mark All As Read (3 tests): Mark all, reset count, error handling
 * - Delete Notification (3 tests): Delete, update unread count, error handling
 * - Clear All (2 tests): Clear all notifications, reset count
 *
 * Total: 18 tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNotificationsStore } from '../store/notificationsStore';
import { notificationsAPI, Notification } from '@/services/api/notificationsAPI';

// Mock the API
vi.mock('@/services/api/notificationsAPI', () => ({
  notificationsAPI: {
    getNotifications: vi.fn(),
    getUnreadCount: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    deleteNotification: vi.fn(),
    clearAll: vi.fn(),
  },
}));

describe('Notifications Integration Tests', () => {
  // ============================================================================
  // SETUP & MOCK DATA
  // ============================================================================

  const mockNotification1: Notification = {
    id: 'notif-1',
    userId: 'user-1',
    type: 'achievement_unlocked',
    title: 'Logro Desbloqueado',
    message: 'Has desbloqueado "Maestro de Lectura"',
    status: 'unread',
    createdAt: new Date('2025-11-09T10:00:00Z').toISOString(),
  };

  const mockNotification2: Notification = {
    id: 'notif-2',
    userId: 'user-1',
    type: 'rank_promoted',
    title: 'Nuevo Rango',
    message: 'Has alcanzado el rango Ah Kin',
    status: 'unread',
    createdAt: new Date('2025-11-09T09:00:00Z').toISOString(),
  };

  const mockNotification3: Notification = {
    id: 'notif-3',
    userId: 'user-1',
    type: 'friend_request',
    title: 'Solicitud de Amistad',
    message: 'Luis quiere ser tu amigo',
    status: 'read',
    createdAt: new Date('2025-11-08T15:00:00Z').toISOString(),
  };

  const mockNotificationsResponse = {
    notifications: [mockNotification1, mockNotification2, mockNotification3],
    total: 3,
    page: 1,
    limit: 50,
    hasMore: false,
  };

  beforeEach(() => {
    // Reset store to initial state
    useNotificationsStore.setState({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,
    });

    // Clear all mocks
    vi.clearAllMocks();
  });

  // ============================================================================
  // STORE INITIALIZATION TESTS
  // ============================================================================

  describe('Store Initialization', () => {
    it('should initialize with correct structure', () => {
      const state = useNotificationsStore.getState();

      expect(state).toHaveProperty('notifications');
      expect(state).toHaveProperty('unreadCount');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('error');
      expect(state).toHaveProperty('fetchNotifications');
      expect(state).toHaveProperty('fetchUnreadCount');
      expect(state).toHaveProperty('markAsRead');
      expect(state).toHaveProperty('markAllAsRead');
      expect(state).toHaveProperty('deleteNotification');
      expect(state).toHaveProperty('clearAll');
    });

    it('should start with empty notifications', () => {
      const state = useNotificationsStore.getState();

      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  // ============================================================================
  // FETCH NOTIFICATIONS TESTS
  // ============================================================================

  describe('Fetch Notifications', () => {
    it('should fetch all notifications', async () => {
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);

      const { fetchNotifications } = useNotificationsStore.getState();

      await fetchNotifications();

      const state = useNotificationsStore.getState();

      expect(state.notifications).toHaveLength(3);
      expect(state.notifications[0].id).toBe('notif-1');
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should fetch only unread notifications', async () => {
      const unreadOnlyResponse = {
        ...mockNotificationsResponse,
        notifications: [mockNotification1, mockNotification2],
        total: 2,
      };

      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(unreadOnlyResponse);

      const { fetchNotifications } = useNotificationsStore.getState();

      await fetchNotifications(true); // unreadOnly = true

      expect(notificationsAPI.getNotifications).toHaveBeenCalledWith({
        limit: 50,
        status: 'unread',
      });

      const state = useNotificationsStore.getState();

      expect(state.notifications).toHaveLength(2);
      expect(state.notifications.every((n) => n.status === 'unread')).toBe(true);
    });

    it('should handle fetch errors', async () => {
      vi.mocked(notificationsAPI.getNotifications).mockRejectedValue(
        new Error('Network error')
      );

      const { fetchNotifications } = useNotificationsStore.getState();

      await fetchNotifications();

      const state = useNotificationsStore.getState();

      expect(state.error).toBe('Network error');
      expect(state.isLoading).toBe(false);
    });
  });

  // ============================================================================
  // FETCH UNREAD COUNT TESTS
  // ============================================================================

  describe('Fetch Unread Count', () => {
    it('should fetch unread count', async () => {
      vi.mocked(notificationsAPI.getUnreadCount).mockResolvedValue(5);

      const { fetchUnreadCount } = useNotificationsStore.getState();

      await fetchUnreadCount();

      const state = useNotificationsStore.getState();

      expect(state.unreadCount).toBe(5);
    });

    it('should handle unread count errors silently', async () => {
      vi.mocked(notificationsAPI.getUnreadCount).mockRejectedValue(
        new Error('Failed to fetch')
      );

      const { fetchUnreadCount } = useNotificationsStore.getState();

      await fetchUnreadCount();

      const state = useNotificationsStore.getState();

      // Should not update error state (silent failure)
      expect(state.error).toBeNull();
      expect(state.unreadCount).toBe(0);
    });
  });

  // ============================================================================
  // MARK AS READ TESTS
  // ============================================================================

  describe('Mark As Read', () => {
    it('should mark notification as read', async () => {
      // Setup: Load notifications first
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);
      await useNotificationsStore.getState().fetchNotifications();

      // Set unread count
      useNotificationsStore.setState({ unreadCount: 2 });

      vi.mocked(notificationsAPI.markAsRead).mockResolvedValue();

      const { markAsRead } = useNotificationsStore.getState();

      await markAsRead('notif-1');

      const state = useNotificationsStore.getState();
      const notification = state.notifications.find((n) => n.id === 'notif-1');

      expect(notification?.status).toBe('read');
    });

    it('should decrement unread count', async () => {
      // Setup
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);
      await useNotificationsStore.getState().fetchNotifications();
      useNotificationsStore.setState({ unreadCount: 2 });

      vi.mocked(notificationsAPI.markAsRead).mockResolvedValue();

      const { markAsRead } = useNotificationsStore.getState();

      await markAsRead('notif-1');

      const state = useNotificationsStore.getState();

      expect(state.unreadCount).toBe(1); // Decremented
    });

    it('should handle mark as read errors', async () => {
      vi.mocked(notificationsAPI.markAsRead).mockRejectedValue(new Error('Update failed'));

      const { markAsRead } = useNotificationsStore.getState();

      await markAsRead('notif-1');

      const state = useNotificationsStore.getState();

      expect(state.error).toBe('Update failed');
    });
  });

  // ============================================================================
  // MARK ALL AS READ TESTS
  // ============================================================================

  describe('Mark All As Read', () => {
    it('should mark all notifications as read', async () => {
      // Setup
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);
      await useNotificationsStore.getState().fetchNotifications();

      vi.mocked(notificationsAPI.markAllAsRead).mockResolvedValue(2);

      const { markAllAsRead } = useNotificationsStore.getState();

      await markAllAsRead();

      const state = useNotificationsStore.getState();

      expect(state.notifications.every((n) => n.status === 'read')).toBe(true);
    });

    it('should reset unread count to zero', async () => {
      // Setup
      useNotificationsStore.setState({ unreadCount: 5 });

      vi.mocked(notificationsAPI.markAllAsRead).mockResolvedValue(5);

      const { markAllAsRead } = useNotificationsStore.getState();

      await markAllAsRead();

      const state = useNotificationsStore.getState();

      expect(state.unreadCount).toBe(0);
    });

    it('should handle mark all as read errors', async () => {
      vi.mocked(notificationsAPI.markAllAsRead).mockRejectedValue(
        new Error('Batch update failed')
      );

      const { markAllAsRead } = useNotificationsStore.getState();

      await markAllAsRead();

      const state = useNotificationsStore.getState();

      expect(state.error).toBe('Batch update failed');
    });
  });

  // ============================================================================
  // DELETE NOTIFICATION TESTS
  // ============================================================================

  describe('Delete Notification', () => {
    it('should delete notification', async () => {
      // Setup
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);
      await useNotificationsStore.getState().fetchNotifications();

      vi.mocked(notificationsAPI.deleteNotification).mockResolvedValue();

      const { deleteNotification } = useNotificationsStore.getState();

      await deleteNotification('notif-1');

      const state = useNotificationsStore.getState();

      expect(state.notifications).toHaveLength(2);
      expect(state.notifications.find((n) => n.id === 'notif-1')).toBeUndefined();
    });

    it('should decrement unread count if notification was unread', async () => {
      // Setup
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);
      await useNotificationsStore.getState().fetchNotifications();
      useNotificationsStore.setState({ unreadCount: 2 });

      vi.mocked(notificationsAPI.deleteNotification).mockResolvedValue();

      const { deleteNotification } = useNotificationsStore.getState();

      await deleteNotification('notif-1'); // notif-1 is unread

      const state = useNotificationsStore.getState();

      expect(state.unreadCount).toBe(1); // Decremented
    });

    it('should handle delete errors', async () => {
      vi.mocked(notificationsAPI.deleteNotification).mockRejectedValue(
        new Error('Delete failed')
      );

      const { deleteNotification } = useNotificationsStore.getState();

      await deleteNotification('notif-1');

      const state = useNotificationsStore.getState();

      expect(state.error).toBe('Delete failed');
    });
  });

  // ============================================================================
  // CLEAR ALL TESTS
  // ============================================================================

  describe('Clear All', () => {
    it('should clear all notifications', async () => {
      // Setup
      vi.mocked(notificationsAPI.getNotifications).mockResolvedValue(mockNotificationsResponse);
      await useNotificationsStore.getState().fetchNotifications();

      vi.mocked(notificationsAPI.clearAll).mockResolvedValue(undefined);

      const { clearAll } = useNotificationsStore.getState();

      await clearAll();

      const state = useNotificationsStore.getState();

      expect(state.notifications).toEqual([]);
      expect(state.unreadCount).toBe(0);
    });

    it('should handle clear all errors', async () => {
      vi.mocked(notificationsAPI.clearAll).mockRejectedValue(new Error('Clear failed'));

      const { clearAll } = useNotificationsStore.getState();

      await clearAll();

      const state = useNotificationsStore.getState();

      expect(state.error).toBe('Clear failed');
    });
  });
});
