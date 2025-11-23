import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/auth/entities/user.entity';
import { Profile } from '@modules/auth/entities/profile.entity';
import { Role } from '@modules/auth/entities/role.entity';
import { UserRole } from '@modules/auth/entities/user-role.entity';
import { Tenant } from '@modules/auth/entities/tenant.entity';
import { Membership } from '@modules/auth/entities/membership.entity';
import { AuthAttempt } from '@modules/auth/entities/auth-attempt.entity';
import { UserSuspension } from '@modules/auth/entities/user-suspension.entity';
import { Module as EducationalModule } from '@modules/educational/entities/module.entity';
import { Exercise } from '@modules/educational/entities/exercise.entity';
import { ContentApproval } from '@modules/educational/entities/content-approval.entity';
import { ContentTemplate } from '@modules/content/entities/content-template.entity';
import { MediaFile } from '@modules/content/entities/media-file.entity';
import { Classroom } from '@modules/social/entities/classroom.entity';
import { TeacherClassroom } from '@modules/social/entities/teacher-classroom.entity';
import { SystemSetting, FeatureFlag, NotificationSettings, BulkOperation } from './entities'; // ✨ NUEVO - P1/P2 (System Configuration + Bulk Ops)
import { AdminUsersController } from './controllers/admin-users.controller';
import { AdminOrganizationsController } from './controllers/admin-organizations.controller';
import { AdminContentController } from './controllers/admin-content.controller';
import { AdminSystemController } from './controllers/admin-system.controller';
import { AdminDashboardController } from './controllers/admin-dashboard.controller';
import { AdminRolesController } from './controllers/admin-roles.controller';
import { AdminReportsController } from './controllers/admin-reports.controller';
import { AdminLogsController } from './controllers/admin-logs.controller';
import { ClassroomAssignmentsController } from './controllers/classroom-assignments.controller';
import { AdminGamificationConfigController } from './controllers/admin-gamification-config.controller';
import { AdminBulkOperationsController } from './controllers/admin-bulk-operations.controller';
import { AdminUsersService } from './services/admin-users.service';
import { AdminOrganizationsService } from './services/admin-organizations.service';
import { AdminContentService } from './services/admin-content.service';
import { AdminSystemService } from './services/admin-system.service';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminRolesService } from './services/admin-roles.service';
import { AdminReportsService } from './services/admin-reports.service';
import { ClassroomAssignmentsService } from './services/classroom-assignments.service';
import { GamificationConfigService } from './services/gamification-config.service';
import { BulkOperationsService } from './services/bulk-operations.service';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Role, UserRole, Tenant, Membership, AuthAttempt, UserSuspension, SystemSetting, FeatureFlag, NotificationSettings, BulkOperation], 'auth'),
    TypeOrmModule.forFeature([EducationalModule, Exercise, ContentApproval], 'educational'),
    TypeOrmModule.forFeature([ContentTemplate, MediaFile], 'content'),
    TypeOrmModule.forFeature([Classroom, TeacherClassroom], 'social'),
  ],
  controllers: [
    AdminUsersController,
    AdminOrganizationsController,
    AdminContentController,
    AdminSystemController,
    AdminDashboardController,
    AdminRolesController,
    AdminReportsController,
    AdminLogsController,
    ClassroomAssignmentsController,
    AdminGamificationConfigController,
    AdminBulkOperationsController,
  ],
  providers: [
    AdminUsersService,
    AdminOrganizationsService,
    AdminContentService,
    AdminSystemService,
    AdminDashboardService,
    AdminRolesService,
    AdminReportsService,
    ClassroomAssignmentsService,
    GamificationConfigService,
    BulkOperationsService,
    AdminGuard,
  ],
  exports: [
    AdminUsersService,
    AdminOrganizationsService,
    AdminContentService,
    AdminSystemService,
    AdminDashboardService,
    AdminRolesService,
    AdminReportsService,
    ClassroomAssignmentsService,
    GamificationConfigService,
    BulkOperationsService,
  ],
})
export class AdminModule {}
