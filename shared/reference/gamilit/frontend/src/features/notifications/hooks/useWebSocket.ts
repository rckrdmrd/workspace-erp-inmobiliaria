/**
 * useWebSocket Hook
 *
 * React hook for managing WebSocket connections for real-time notifications
 */

import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useNotificationsStore } from '../store/notificationsStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { getAuthToken } from '@/services/api/apiClient';

// Use VITE_WS_URL if available, otherwise derive from VITE_API_URL
const WEBSOCKET_URL = import.meta.env.VITE_WS_URL ||
                     import.meta.env.VITE_API_URL?.replace('/api', '') ||
                     'http://localhost:3006';

/**
 * Check if JWT token is valid (not expired)
 */
function isTokenValid(token: string): boolean {
  try {
    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split('.')[1]));

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    return false;
  }
}

export interface WebSocketNotification {
  notification: {
    id: string;
    userId: string;
    type: 'achievement_unlocked' | 'rank_up' | 'streak_milestone' | 'coins_earned' | 'xp_earned';
    title: string;
    message: string;
    metadata?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
  };
  timestamp: string;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (event: string, data: any) => void;
  disconnect: () => void;
}

/**
 * Hook for WebSocket connection
 */
export function useWebSocket(): UseWebSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);
  const { user } = useAuthStore();
  const { addNotification, fetchUnreadCount } = useNotificationsStore();

  /**
   * Initialize WebSocket connection
   */
  const connect = useCallback(async () => {
    if (socketRef.current?.connected) {
      console.log('✅ WebSocket already connected');
      return;
    }

    if (!user?.id) {
      console.log('⚠️ No user ID available, skipping WebSocket connection');
      return;
    }

    console.log('🔌 Connecting to WebSocket server:', WEBSOCKET_URL);

    // Get authentication token
    let token = getAuthToken();

    if (!token) {
      console.log('ℹ️ No authentication token available, skipping WebSocket connection');
      return;
    }

    // Validate token before connecting - attempt refresh if expired
    if (!isTokenValid(token)) {
      console.log('⚠️ Token expired, attempting to refresh...');

      try {
        // Attempt to refresh the token
        const { refreshToken } = useAuthStore.getState();
        await refreshToken();

        // Get the new token after refresh
        token = getAuthToken();

        if (!token || !isTokenValid(token)) {
          console.log('ℹ️ Token refresh failed. Please login to enable real-time notifications.');
          return;
        }

        console.log('✅ Token refreshed successfully');
      } catch (error) {
        console.error('❌ Token refresh error:', error);
        console.log('ℹ️ Please login to enable real-time notifications.');
        return;
      }
    }

    const socket = io(WEBSOCKET_URL, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        token: token
      }
    });

    // Connection events
    socket.on('connect', () => {
      console.log('✅ WebSocket connected:', socket.id);
      isConnectedRef.current = true;
    });

    socket.on('authenticated', (data: any) => {
      console.log('✅ WebSocket authenticated:', data);
    });

    socket.on('disconnect', (reason: string) => {
      console.log('❌ WebSocket disconnected:', reason);
      isConnectedRef.current = false;
    });

    socket.on('connect_error', (error: Error) => {
      // Only log if it's not an authentication error (which is expected when not logged in)
      if (!error.message.includes('Authentication') && !error.message.includes('authentication')) {
        console.error('❌ WebSocket connection error:', error);
      } else {
        console.log('ℹ️ WebSocket authentication required. Please login to enable real-time notifications.');
      }
      isConnectedRef.current = false;
    });

    socket.on('error', (error: any) => {
      console.error('❌ WebSocket error:', error);
    });

    // Listen for new notifications
    socket.on('new_notification', (data: WebSocketNotification) => {
      console.log('📨 New notification received via WebSocket:', data);

      // Transform to match Notification type
      const notification = {
        ...data.notification,
        data: data.notification.metadata || {},
        readAt: null,
        createdAt: new Date(data.notification.createdAt),
        expiresAt: null,
        status: 'unread' as const
      };

      // Add to notifications store (automatically increments unreadCount)
      addNotification(notification);

      // Show browser notification if permission granted
      showBrowserNotification(data.notification);
    });

    // Listen for notification read events
    socket.on('notification_read', (data: { notificationId: string; timestamp: string }) => {
      console.log('✅ Notification marked as read:', data.notificationId);
    });

    // Listen for notification deleted events
    socket.on('notification_deleted', (data: { notificationId: string; timestamp: string }) => {
      console.log('🗑️ Notification deleted:', data.notificationId);
    });

    // Listen for unread count updates
    socket.on('unread_count_updated', (data: { count: number; timestamp: string }) => {
      console.log('🔢 Unread count updated:', data.count);
      // The store will be updated via fetchUnreadCount
      fetchUnreadCount();
    });

    socketRef.current = socket;
  }, [user?.id, addNotification, fetchUnreadCount]);

  /**
   * Disconnect WebSocket
   */
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      console.log('🔌 Disconnecting WebSocket...');
      socketRef.current.disconnect();
      socketRef.current = null;
      isConnectedRef.current = false;
    }
  }, []);

  /**
   * Send message to WebSocket server
   */
  const sendMessage = useCallback((event: string, data: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('⚠️ Cannot send message: WebSocket not connected');
    }
  }, []);

  /**
   * Show browser notification
   */
  const showBrowserNotification = (notification: WebSocketNotification['notification']) => {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      return;
    }

    // Check permission
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png', // Add your logo path
        tag: notification.id,
        requireInteraction: false
      });
    } else if (Notification.permission !== 'denied') {
      // Request permission
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo.png',
            tag: notification.id,
            requireInteraction: false
          });
        }
      });
    }
  };

  /**
   * Connect on mount, disconnect on unmount
   * Only connect if user is authenticated with a valid token
   */
  useEffect(() => {
    const token = getAuthToken();

    if (user?.id && token) {
      connect();
    } else {
      console.log('⚠️ Skipping WebSocket connection: User not authenticated or token missing');
    }

    return () => {
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return {
    isConnected: isConnectedRef.current,
    sendMessage,
    disconnect
  };
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('⚠️ Browser does not support notifications');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  const permission = await Notification.requestPermission();
  console.log('🔔 Notification permission:', permission);
  return permission;
}
