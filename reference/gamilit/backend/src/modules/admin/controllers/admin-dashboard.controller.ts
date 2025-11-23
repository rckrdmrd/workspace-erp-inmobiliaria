import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminDashboardService } from '../services/admin-dashboard.service';
import {
  DashboardDataDto,
  DashboardStatsDto,
  RecentActivityQueryDto,
  PaginatedActivityDto,
  UserStatsSummaryDto,
  OrganizationStatsSummaryDto,
  PaginatedModerationQueueDto,
  PaginatedClassroomOverviewDto,
  PaginatedAssignmentSubmissionStatsDto,
} from '../dto/dashboard';

@ApiTags('Admin - Dashboard')
@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get complete dashboard data',
    description:
      'Retrieve complete dashboard data including statistics and recent activity for the admin portal home page',
  })
  async getDashboard(): Promise<DashboardDataDto> {
    return await this.adminDashboardService.getDashboard();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get dashboard statistics only',
    description:
      'Retrieve only the dashboard statistics (users, organizations, exercises, etc.)',
  })
  async getDashboardStats(): Promise<DashboardStatsDto> {
    return await this.adminDashboardService.getDashboardStats();
  }

  @Get('recent-activity')
  @ApiOperation({
    summary: 'Get recent activity',
    description:
      'Retrieve recent user activity from the admin_dashboard.recent_activity view with configurable limit',
  })
  async getRecentActivity(
    @Query() query: RecentActivityQueryDto,
  ): Promise<PaginatedActivityDto> {
    return await this.adminDashboardService.getRecentActivity(query);
  }

  @Get('user-stats')
  @ApiOperation({
    summary: 'Get aggregated user statistics',
    description:
      'Retrieve aggregated user statistics from admin_dashboard.user_stats_summary view including total users, active users, role breakdowns, etc.',
  })
  async getUserStatsSummary(): Promise<UserStatsSummaryDto> {
    return await this.adminDashboardService.getUserStatsSummary();
  }

  @Get('organization-stats')
  @ApiOperation({
    summary: 'Get organization statistics',
    description:
      'Retrieve aggregated organization/tenant statistics from admin_dashboard.organization_stats_summary view',
  })
  async getOrganizationStatsSummary(): Promise<OrganizationStatsSummaryDto> {
    return await this.adminDashboardService.getOrganizationStatsSummary();
  }

  @Get('moderation-queue')
  @ApiOperation({
    summary: 'Get content moderation queue',
    description:
      'Retrieve pending content moderation items from admin_dashboard.moderation_queue view, prioritized by severity',
  })
  async getModerationQueue(): Promise<PaginatedModerationQueueDto> {
    return await this.adminDashboardService.getModerationQueue(50);
  }

  @Get('classroom-overview')
  @ApiOperation({
    summary: 'Get classroom overview',
    description:
      'Retrieve comprehensive classroom statistics from admin_dashboard.classroom_overview view including student counts, assignments, and progress',
  })
  async getClassroomOverview(): Promise<PaginatedClassroomOverviewDto> {
    return await this.adminDashboardService.getClassroomOverview(100);
  }

  @Get('assignment-stats')
  @ApiOperation({
    summary: 'Get assignment submission statistics',
    description:
      'Retrieve assignment submission statistics from admin_dashboard.assignment_submission_stats view including submission rates and scores',
  })
  async getAssignmentSubmissionStats(): Promise<PaginatedAssignmentSubmissionStatsDto> {
    return await this.adminDashboardService.getAssignmentSubmissionStats(100);
  }
}
