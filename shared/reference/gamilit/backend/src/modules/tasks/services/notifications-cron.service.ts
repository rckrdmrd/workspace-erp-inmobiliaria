/**
 * Notifications Cron Service
 *
 * Scheduled tasks for notifications maintenance and cleanup
 */

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class NotificationsCronService {
  private readonly logger = new Logger(NotificationsCronService.name);

  constructor(
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Cleanup old read notifications
   *
   * Runs daily at 02:00 AM UTC
   * Cron: 0 2 * * *
   *
   * Deletes read notifications older than 30 days
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM, {
    name: 'notifications-cleanup',
    timeZone: 'UTC',
  })
  async handleNotificationsCleanup() {
    try {
      this.logger.log('[CRON] Starting notifications cleanup...');

      const startTime = Date.now();

      // Delete notifications older than 30 days
      const result = await this.notificationsService.deleteOldNotifications(30);

      const duration = Date.now() - startTime;

      this.logger.log(
        `[CRON] Notifications cleanup completed. Deleted ${result.deleted} notifications in ${duration}ms`,
      );
    } catch (error) {
      this.logger.error('[CRON] Error in notifications cleanup:', error);
    }
  }

  /**
   * Manual cleanup method for testing
   */
  async runCleanupNow(daysOld: number = 30): Promise<number> {
    try {
      this.logger.log(`[MANUAL] Running notifications cleanup (${daysOld} days old)...`);

      const result = await this.notificationsService.deleteOldNotifications(daysOld);

      this.logger.log(`[MANUAL] Cleanup completed. Deleted ${result.deleted} notifications`);

      return result.deleted;
    } catch (error) {
      this.logger.error('[MANUAL] Error in cleanup:', error);
      throw error;
    }
  }
}
