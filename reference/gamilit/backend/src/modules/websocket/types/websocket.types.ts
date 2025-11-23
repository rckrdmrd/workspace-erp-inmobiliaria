/**
 * WebSocket Types and Interfaces
 */

export enum SocketEvent {
  // Connection
  AUTHENTICATED = 'authenticated',
  ERROR = 'error',

  // Notifications
  NEW_NOTIFICATION = 'notification:new',
  NOTIFICATION_READ = 'notification:read',
  NOTIFICATION_DELETED = 'notification:deleted',
  UNREAD_COUNT_UPDATED = 'notification:unread_count',
  MARK_AS_READ = 'notification:mark_read',

  // Gamification
  ACHIEVEMENT_UNLOCKED = 'achievement:unlocked',
  RANK_UPDATED = 'rank:updated',
  XP_GAINED = 'xp:gained',

  // Leaderboard
  LEADERBOARD_UPDATED = 'leaderboard:updated',

  // Missions
  MISSION_COMPLETED = 'mission:completed',
  MISSION_PROGRESS = 'mission:progress',
}

export interface SocketUserData {
  userId: string;
  email: string;
  role: string;
  tenantId?: string;
}

export interface NotificationPayload {
  notification: any; // Will be typed from notifications module
  timestamp: string;
}

export interface AchievementPayload {
  achievementId: string;
  title: string;
  description: string;
  icon: string;
  timestamp: string;
}

export interface LeaderboardPayload {
  leaderboard: any[]; // Will be typed from gamification module
  timestamp: string;
}
