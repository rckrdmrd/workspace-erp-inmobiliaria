/**
 * Tasks Module
 *
 * Scheduled tasks and cron jobs for the application
 */

import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
// TODO: Uncomment when missions module is implemented
// import { MissionsModule } from '../missions/missions.module';
import { NotificationsModule } from '../notifications/notifications.module';
// import { MissionsCronService } from './services/missions-cron.service';
import { NotificationsCronService } from './services/notifications-cron.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // MissionsModule, // TODO: Uncomment when missions module is implemented
    NotificationsModule,
  ],
  providers: [
    // MissionsCronService, // TODO: Uncomment when missions module is implemented
    NotificationsCronService
  ],
  exports: [
    // MissionsCronService, // TODO: Uncomment when missions module is implemented
    NotificationsCronService
  ],
})
export class TasksModule {}
