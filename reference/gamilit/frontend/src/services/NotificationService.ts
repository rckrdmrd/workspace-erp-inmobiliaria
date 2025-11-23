import { apiClient } from '@/services/api/apiClient';

/**
 * Notification types
 */
export type NotificationType =
  | 'achievement'
  | 'level_up'
  | 'badge_unlocked'
  | 'quest_complete'
  | 'reminder'
  | 'message';

/**
 * Notification metadata
 */
export interface NotificationMetadata {
  xp?: number;
  ml?: number;
  badge?: string;
  quest?: string;
  progress?: number;
  total?: number;
  [key: string]: any;
}

/**
 * Notification interface
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: NotificationMetadata;
}

class NotificationService {
  /**
   * Get user notifications from API or generate from recent activities
   */
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      console.log('🔍 Loading notifications for user:', userId);

      // Try to fetch notifications from API (backend handles user from JWT token)
      const response = await apiClient.get<{ success: boolean; data: Notification[] }>(`/notifications`);

      if (response.data?.success && response.data.data && response.data.data.length > 0) {
        console.log('✅ Real notifications loaded from API:', response.data.data.length);
        return response.data.data.map(n => ({
          ...n,
          timestamp: this.getRelativeTime(n.timestamp)
        }));
      }

      // Fallback: Generate enhanced notifications
      console.log('📱 Generating fallback notifications...');
      return this.generateEnhancedFallbackNotifications(userId);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return this.generateEnhancedFallbackNotifications(userId);
    }
  }

  /**
   * Convert timestamp to relative time
   */
  private getRelativeTime(timestamp: string): string {
    if (timestamp.includes('hora') || timestamp.includes('día') || timestamp.includes('minuto')) {
      return timestamp; // Already relative
    }

    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
      } else if (diffInHours > 0) {
        return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
      } else if (diffInMinutes > 0) {
        return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
      } else {
        return 'Hace un momento';
      }
    } catch {
      return timestamp;
    }
  }

  /**
   * Default notifications for fallback
   */
  private getDefaultNotifications(): Notification[] {
    return [
      {
        id: 'welcome',
        type: 'achievement',
        title: '¡Bienvenido Detective!',
        message: 'Tu aventura de aprendizaje ha comenzado',
        timestamp: 'Hace 5 minutos',
        read: false,
        actionUrl: '/dashboard'
      },
      {
        id: 'daily_streak',
        type: 'reminder',
        title: 'Mantén tu racha',
        message: 'Resuelve un caso hoy para continuar tu racha de 5 días',
        timestamp: 'Hace 1 hora',
        read: false,
        actionUrl: '/dashboard'
      },
      {
        id: 'new_quest',
        type: 'quest_complete',
        title: 'Nueva misión disponible',
        message: 'Se ha desbloqueado "El Misterio del Teorema Perdido"',
        timestamp: 'Hace 2 horas',
        read: true,
        actionUrl: '/dashboard'
      }
    ];
  }

  /**
   * Generate dynamic notifications based on user activity simulation
   */
  private generateDynamicNotifications(userId: string): Notification[] {
    const now = new Date();
    const notifications: Notification[] = [];

    // Activity-based notifications
    const activities = [
      {
        type: 'case_solved' as const,
        title: '🕵️ Caso Resuelto',
        message: 'Completaste "El Enigma de los Números Primos". +75 XP ganados.',
        reward: { xp: 75, ml: 30 }
      },
      {
        type: 'module_progress' as const,
        title: '📖 Progreso en Módulo',
        message: 'Avanzaste 15% en "Comprensión Inferencial". ¡Excelente detective!',
        reward: { xp: 25, ml: 10 }
      },
      {
        type: 'level_milestone' as const,
        title: '🎯 Hito Alcanzado',
        message: 'Estás a solo 50 XP de subir al nivel 3. ¡Sigue investigando!',
        reward: undefined
      }
    ];

    // Create notifications from activities
    activities.forEach((activity, index) => {
      const timestamp = new Date(now.getTime() - (index + 1) * 2 * 60 * 60 * 1000); // 2h intervals
      notifications.push({
        id: `dynamic_${activity.type}_${index}`,
        type: activity.type === 'case_solved' ? 'achievement' :
              activity.type === 'level_milestone' ? 'reminder' : 'level_up',
        title: activity.title,
        message: activity.message,
        timestamp: this.getRelativeTime(timestamp.toISOString()),
        read: Math.random() > 0.5,
        actionUrl: '/dashboard',
        metadata: activity.reward || {}
      });
    });

    // Add quest notifications
    notifications.push({
      id: 'dynamic_quest_progress',
      type: 'quest_complete',
      title: '🎯 Misión en Progreso',
      message: 'Quest "Detective Master": 3/5 casos completados. ¡Ya casi!',
      timestamp: this.getRelativeTime(new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()),
      read: false,
      actionUrl: '/quests',
      metadata: {
        quest: 'detective_master',
        progress: 3,
        total: 5
      }
    });

    return notifications;
  }

  /**
   * Enhanced fallback for API failures
   */
  private generateEnhancedFallbackNotifications(userId: string): Notification[] {
    console.log('🔄 Generating enhanced fallback notifications...');

    // Combine static detective notifications with dynamic ones
    const staticNotifications = this.getDefaultNotifications();
    const dynamicNotifications = this.generateDynamicNotifications(userId);

    // Merge and sort by timestamp (most recent first)
    const allNotifications = [...staticNotifications, ...dynamicNotifications]
      .sort((a, b) => {
        const timeA = this.parseRelativeTime(a.timestamp);
        const timeB = this.parseRelativeTime(b.timestamp);
        return timeB - timeA; // Most recent first
      })
      .slice(0, 8); // Limit to 8 notifications

    return allNotifications;
  }

  /**
   * Parse relative time to timestamp for sorting
   */
  private parseRelativeTime(relativeTime: string): number {
    const now = Date.now();
    const match = relativeTime.match(/(\d+)\s*(minuto|hora|día)s?/);

    if (!match) return now;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 'minuto':
        return now - (value * 60 * 1000);
      case 'hora':
        return now - (value * 60 * 60 * 1000);
      case 'día':
        return now - (value * 24 * 60 * 60 * 1000);
      default:
        return now;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      // Try to update via API
      await apiClient.patch(`/notifications/${notificationId}/read`, {
        userId
      });

      console.log('✅ Notification marked as read');
    } catch (error) {
      console.log('Could not mark notification as read via API, storing locally');
      // Store in localStorage as fallback
      const readNotifications = JSON.parse(
        localStorage.getItem('glit_read_notifications') || '[]'
      );
      if (!readNotifications.includes(notificationId)) {
        readNotifications.push(notificationId);
        localStorage.setItem('glit_read_notifications', JSON.stringify(readNotifications));
      }
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const notifications = await this.getUserNotifications(userId);
      return notifications.filter(n => !n.read).length;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Create a new notification (for real-time updates)
   */
  async createNotification(
    userId: string,
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ): Promise<void> {
    try {
      await apiClient.post('/notifications/send', {
        userId,
        ...notification,
        timestamp: new Date().toISOString(),
        read: false
      });

      console.log('✅ Notification created via API');
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }
}

export const notificationService = new NotificationService();
