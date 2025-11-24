import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';

// Auth entities
import { Profile } from '@modules/auth/entities/profile.entity';
import { User } from '@modules/auth/entities/user.entity';

// Social entities
import { ClassroomMember } from '@modules/social/entities/classroom-member.entity';
import { TeacherClassroom } from '@modules/social/entities/teacher-classroom.entity';
import { Classroom } from '@modules/social/entities/classroom.entity';

// Progress entities
import { ExerciseSubmission } from '@modules/progress/entities/exercise-submission.entity';
import { ModuleProgress } from '@modules/progress/entities/module-progress.entity';

// Content entities
import { Assignment } from '@modules/assignments/entities/assignment.entity';
import { AssignmentSubmission } from '@modules/assignments/entities/assignment-submission.entity';

// Controllers
import { TeacherClassroomsController } from './controllers/teacher-classrooms.controller';
import { TeacherController } from './controllers/teacher.controller';

// Services
import {
  StudentBlockingService,
  TeacherDashboardService,
  StudentProgressService,
  GradingService,
  AnalyticsService,
  StudentRiskAlertService,
  ReportsService,
} from './services';

// Guards
import { TeacherGuard, ClassroomOwnershipGuard } from './guards';

/**
 * TeacherModule
 *
 * @description Comprehensive module for teacher functionalities
 * @module teacher
 *
 * Features:
 * - Student Blocking/Permissions
 * - Classroom Management
 * - Dashboard & Analytics
 * - Student Progress Tracking
 * - Grading & Feedback
 * - Student Insights (AI-powered)
 * - Risk Alerts & Monitoring
 * - Report Generation (PDF/Excel)
 *
 * Controllers:
 * - TeacherClassroomsController: Gestión de estudiantes en aulas
 * - TeacherController: Analytics, progress, grading, insights, reports
 *
 * Services:
 * - StudentBlockingService: Bloqueo y permisos de estudiantes
 * - TeacherDashboardService: Dashboard statistics and summaries
 * - StudentProgressService: Student progress tracking and notes
 * - GradingService: Exercise grading and feedback
 * - AnalyticsService: Analytics and student insights (with caching)
 * - StudentRiskAlertService: Automated risk monitoring (CRON)
 * - ReportsService: PDF/Excel report generation
 *
 * Guards:
 * - TeacherGuard: Verificar rol de profesor
 * - ClassroomOwnershipGuard: Verificar acceso a aula
 */
@Module({
  imports: [
    // Cache configuration for AnalyticsService
    CacheModule.register({
      ttl: 300, // 5 minutes default
      max: 100, // Maximum number of items in cache
      isGlobal: false,
    }),

    // Schedule module for StudentRiskAlertService CRON jobs
    ScheduleModule.forRoot(),

    // Entities from 'auth' datasource
    TypeOrmModule.forFeature([Profile, User], 'auth'),

    // Entities from 'social' datasource
    TypeOrmModule.forFeature([ClassroomMember, TeacherClassroom, Classroom], 'social'),

    // Entities from 'progress' datasource
    TypeOrmModule.forFeature([ExerciseSubmission, ModuleProgress], 'progress'),

    // Entities from 'content' datasource
    TypeOrmModule.forFeature([Assignment, AssignmentSubmission], 'content'),
  ],
  controllers: [TeacherClassroomsController, TeacherController],
  providers: [
    // Core services
    StudentBlockingService,
    TeacherDashboardService,
    StudentProgressService,
    GradingService,
    AnalyticsService,
    StudentRiskAlertService,
    ReportsService,

    // Guards
    TeacherGuard,
    ClassroomOwnershipGuard,
  ],
  exports: [
    StudentBlockingService,
    TeacherDashboardService,
    StudentProgressService,
    GradingService,
    AnalyticsService,
    ReportsService,
  ],
})
export class TeacherModule {}
