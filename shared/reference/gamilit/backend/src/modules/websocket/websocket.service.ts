/**
 * WebSocket Service
 *
 * Service layer for WebSocket operations
 * Provides clean API for other modules to emit real-time events
 */

import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { SocketEvent } from './types/websocket.types';

@Injectable()
export class WebSocketService {
  private readonly logger = new Logger(WebSocketService.name);

  constructor(private readonly gateway: NotificationsGateway) {}

  /**
   * Emit notification to specific user
   */
  emitNotificationToUser(userId: string, notification: any) {
    this.gateway.emitToUser(userId, SocketEvent.NEW_NOTIFICATION, {
      notification,
    });
    this.logger.debug(`Notification sent to user ${userId}`);
  }

  /**
   * Emit notification to multiple users
   */
  emitNotificationToUsers(userIds: string[], notification: any) {
    this.gateway.emitToUsers(userIds, SocketEvent.NEW_NOTIFICATION, {
      notification,
    });
    this.logger.debug(`Notification sent to ${userIds.length} users`);
  }

  /**
   * Emit unread count update to user
   */
  emitUnreadCountUpdate(userId: string, unreadCount: number) {
    this.gateway.emitToUser(userId, SocketEvent.UNREAD_COUNT_UPDATED, {
      unreadCount,
    });
    this.logger.debug(`Unread count (${unreadCount}) sent to user ${userId}`);
  }

  /**
   * Emit notification deleted event
   */
  emitNotificationDeleted(userId: string, notificationId: string) {
    this.gateway.emitToUser(userId, SocketEvent.NOTIFICATION_DELETED, {
      notificationId,
    });
    this.logger.debug(`Notification ${notificationId} deletion sent to user ${userId}`);
  }

  /**
   * Emit achievement unlocked to user
   */
  emitAchievementUnlocked(
    userId: string,
    achievement: {
      achievementId: string;
      title: string;
      description: string;
      icon: string;
    },
  ) {
    this.gateway.emitToUser(userId, SocketEvent.ACHIEVEMENT_UNLOCKED, achievement);
    this.logger.debug(`Achievement ${achievement.achievementId} unlocked for user ${userId}`);
  }

  /**
   * Emit rank update to user
   */
  emitRankUpdated(
    userId: string,
    rankData: {
      newRank: string;
      oldRank: string;
      xpRequired?: number;
    },
  ) {
    this.gateway.emitToUser(userId, SocketEvent.RANK_UPDATED, rankData);
    this.logger.debug(`Rank update sent to user ${userId}: ${rankData.oldRank} -> ${rankData.newRank}`);
  }

  /**
   * Emit XP gained to user
   */
  emitXpGained(
    userId: string,
    xpData: {
      amount: number;
      source: string;
      totalXp: number;
    },
  ) {
    this.gateway.emitToUser(userId, SocketEvent.XP_GAINED, xpData);
    this.logger.debug(`XP gained (${xpData.amount}) sent to user ${userId}`);
  }

  /**
   * Emit mission completed to user
   */
  emitMissionCompleted(
    userId: string,
    missionData: {
      missionId: string;
      title: string;
      xpReward: number;
      pointsReward: number;
    },
  ) {
    this.gateway.emitToUser(userId, SocketEvent.MISSION_COMPLETED, missionData);
    this.logger.debug(`Mission ${missionData.missionId} completed for user ${userId}`);
  }

  /**
   * Emit mission progress to user
   */
  emitMissionProgress(
    userId: string,
    progressData: {
      missionId: string;
      currentProgress: number;
      targetProgress: number;
      percentage: number;
    },
  ) {
    this.gateway.emitToUser(userId, SocketEvent.MISSION_PROGRESS, progressData);
    this.logger.debug(`Mission ${progressData.missionId} progress (${progressData.percentage}%) sent to user ${userId}`);
  }

  /**
   * Broadcast leaderboard update to all users
   */
  broadcastLeaderboardUpdate(leaderboard: any[]) {
    this.gateway.broadcast(SocketEvent.LEADERBOARD_UPDATED, {
      leaderboard,
    });
    this.logger.debug(`Leaderboard update broadcasted to all users`);
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.gateway.isUserConnected(userId);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.gateway.getConnectedUsersCount();
  }

  /**
   * Get user's socket count
   */
  getUserSocketCount(userId: string): number {
    return this.gateway.getUserSocketCount(userId);
  }
}
