import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { User } from '@modules/auth/entities/user.entity';
import { Tenant } from '@modules/auth/entities/tenant.entity';
import { Module } from '@modules/educational/entities/module.entity';
import { Exercise } from '@modules/educational/entities/exercise.entity';
import {
  DashboardDataDto,
  DashboardStatsDto,
  AdminActionDto,
  RecentActivityQueryDto,
  PaginatedActivityDto,
  UserStatsSummaryDto,
  OrganizationStatsSummaryDto,
  ModerationQueueItemDto,
  PaginatedModerationQueueDto,
  ClassroomOverviewDto,
  PaginatedClassroomOverviewDto,
  AssignmentSubmissionStatsDto,
  PaginatedAssignmentSubmissionStatsDto,
} from '../dto/dashboard';

@Injectable()
export class AdminDashboardService {
  constructor(
    @InjectConnection('auth')
    private readonly authConnection: Connection,
    @InjectConnection('educational')
    private readonly educationalConnection: Connection,
    @InjectRepository(User, 'auth')
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tenant, 'auth')
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(Module, 'educational')
    private readonly moduleRepo: Repository<Module>,
    @InjectRepository(Exercise, 'educational')
    private readonly exerciseRepo: Repository<Exercise>,
  ) {}

  /**
   * Get complete dashboard data (stats + recent activity)
   */
  async getDashboard(): Promise<DashboardDataDto> {
    const [stats, recentActivity] = await Promise.all([
      this.getDashboardStats(),
      this.getRecentActivityInternal(10),
    ]);

    return {
      stats,
      recentActivity,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStatsDto> {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Execute all queries in parallel
    const [
      totalUsers,
      activeUsers24h,
      newUsersToday,
      totalOrganizations,
      totalExercises,
      totalModules,
      exercisesCompleted24h,
    ] = await Promise.all([
      this.userRepo.count(),
      this.getActiveUsers24h(oneDayAgo),
      this.userRepo.count({
        where: {
          created_at: MoreThanOrEqual(todayStart),
        },
      }),
      this.tenantRepo.count(),
      this.exerciseRepo.count(),
      this.moduleRepo.count(),
      this.getExercisesCompleted24h(oneDayAgo),
    ]);

    // Determine system health based on basic metrics
    const systemHealth = this.determineSystemHealth(activeUsers24h, totalUsers);

    return {
      totalUsers,
      activeUsers: activeUsers24h,
      newUsersToday,
      totalOrganizations,
      totalExercises,
      totalModules,
      exercisesCompleted24h,
      systemHealth,
      avgResponseTime: 125, // TODO: Implement actual response time tracking
    };
  }

  /**
   * Get recent activity from admin_dashboard.recent_activity view
   */
  async getRecentActivity(
    query: RecentActivityQueryDto,
  ): Promise<PaginatedActivityDto> {
    const limit = query.limit || 20;
    const activities = await this.getRecentActivityInternal(limit);

    // Get total count from activity log
    const countResult = await this.authConnection.query(
      'SELECT COUNT(*) as count FROM audit_logging.activity_log',
    );
    const total = parseInt(countResult[0]?.count || '0', 10);

    return {
      data: activities,
      total,
      limit,
    };
  }

  /**
   * Get aggregated user statistics from admin_dashboard.user_stats_summary view
   */
  async getUserStatsSummary(): Promise<UserStatsSummaryDto> {
    try {
      const [stats] = await this.authConnection.query(
        'SELECT * FROM admin_dashboard.user_stats_summary',
      );

      if (!stats) {
        // Return zero values if view returns no data
        return {
          total_users: 0,
          users_today: 0,
          users_this_week: 0,
          users_this_month: 0,
          active_users_today: 0,
          active_users_week: 0,
          total_students: 0,
          total_teachers: 0,
          total_admins: 0,
        };
      }

      return {
        total_users: parseInt(stats.total_users || '0', 10),
        users_today: parseInt(stats.users_today || '0', 10),
        users_this_week: parseInt(stats.users_this_week || '0', 10),
        users_this_month: parseInt(stats.users_this_month || '0', 10),
        active_users_today: parseInt(stats.active_users_today || '0', 10),
        active_users_week: parseInt(stats.active_users_week || '0', 10),
        total_students: parseInt(stats.total_students || '0', 10),
        total_teachers: parseInt(stats.total_teachers || '0', 10),
        total_admins: parseInt(stats.total_admins || '0', 10),
      };
    } catch (error) {
      console.error('Error fetching user stats summary:', error);
      throw error;
    }
  }

  /**
   * Get aggregated organization statistics from admin_dashboard.organization_stats_summary view
   */
  async getOrganizationStatsSummary(): Promise<OrganizationStatsSummaryDto> {
    try {
      const [stats] = await this.authConnection.query(
        'SELECT * FROM admin_dashboard.organization_stats_summary',
      );

      if (!stats) {
        return {
          total_organizations: 0,
          active_organizations: 0,
          new_organizations_month: 0,
        };
      }

      return {
        total_organizations: parseInt(stats.total_organizations || '0', 10),
        active_organizations: parseInt(stats.active_organizations || '0', 10),
        new_organizations_month: parseInt(stats.new_organizations_month || '0', 10),
      };
    } catch (error) {
      console.error('Error fetching organization stats summary:', error);
      throw error;
    }
  }

  /**
   * Get content moderation queue from admin_dashboard.moderation_queue view
   */
  async getModerationQueue(limit: number = 50): Promise<PaginatedModerationQueueDto> {
    try {
      const results = await this.authConnection.query(
        `SELECT
          id,
          content_type,
          content_id,
          content_preview,
          reason,
          priority,
          status,
          created_at,
          reporter_email,
          reporter_name
         FROM admin_dashboard.moderation_queue
         LIMIT $1`,
        [limit],
      );

      const data: ModerationQueueItemDto[] = results.map((row: any) => ({
        id: row.id,
        content_type: row.content_type,
        content_id: row.content_id,
        content_preview: row.content_preview,
        reason: row.reason,
        priority: row.priority,
        status: row.status,
        created_at: row.created_at instanceof Date
          ? row.created_at.toISOString()
          : row.created_at,
        reporter_email: row.reporter_email,
        reporter_name: row.reporter_name,
      }));

      // Get total count of pending moderation items
      const countResult = await this.authConnection.query(
        "SELECT COUNT(*) as count FROM content_management.flagged_content WHERE status = 'pending'",
      );
      const total = parseInt(countResult[0]?.count || '0', 10);

      return {
        data,
        total,
        limit,
      };
    } catch (error) {
      console.error('Error fetching moderation queue:', error);
      // Return empty queue if table doesn't exist
      return {
        data: [],
        total: 0,
        limit,
      };
    }
  }

  /**
   * Get classroom overview statistics from admin_dashboard.classroom_overview view
   */
  async getClassroomOverview(limit: number = 100): Promise<PaginatedClassroomOverviewDto> {
    try {
      const results = await this.authConnection.query(
        `SELECT
          classroom_id,
          classroom_name,
          classroom_description,
          teacher_id,
          teacher_name,
          total_students,
          active_students,
          inactive_students,
          total_assignments,
          pending_assignments,
          upcoming_deadline_assignments,
          total_exercises,
          avg_class_progress_percent,
          last_updated,
          classroom_created_at,
          classroom_status
         FROM admin_dashboard.classroom_overview
         ORDER BY classroom_name
         LIMIT $1`,
        [limit],
      );

      const data: ClassroomOverviewDto[] = results.map((row: any) => ({
        classroom_id: row.classroom_id,
        classroom_name: row.classroom_name,
        classroom_description: row.classroom_description,
        teacher_id: row.teacher_id,
        teacher_name: row.teacher_name,
        total_students: parseInt(row.total_students || '0', 10),
        active_students: parseInt(row.active_students || '0', 10),
        inactive_students: parseInt(row.inactive_students || '0', 10),
        total_assignments: parseInt(row.total_assignments || '0', 10),
        pending_assignments: parseInt(row.pending_assignments || '0', 10),
        upcoming_deadline_assignments: parseInt(row.upcoming_deadline_assignments || '0', 10),
        total_exercises: parseInt(row.total_exercises || '0', 10),
        avg_class_progress_percent: parseFloat(row.avg_class_progress_percent || '0'),
        last_updated: row.last_updated instanceof Date
          ? row.last_updated.toISOString()
          : row.last_updated,
        classroom_created_at: row.classroom_created_at instanceof Date
          ? row.classroom_created_at.toISOString()
          : row.classroom_created_at,
        classroom_status: row.classroom_status,
      }));

      // Get total count of classrooms
      const countResult = await this.authConnection.query(
        'SELECT COUNT(*) as count FROM social_features.classrooms WHERE is_deleted = FALSE',
      );
      const total = parseInt(countResult[0]?.count || '0', 10);

      return {
        data,
        total,
        limit,
      };
    } catch (error) {
      console.error('Error fetching classroom overview:', error);
      // Return empty list if view doesn't exist
      return {
        data: [],
        total: 0,
        limit,
      };
    }
  }

  /**
   * Get assignment submission statistics from admin_dashboard.assignment_submission_stats view
   */
  async getAssignmentSubmissionStats(limit: number = 100): Promise<PaginatedAssignmentSubmissionStatsDto> {
    try {
      const results = await this.authConnection.query(
        `SELECT
          assignment_id,
          assignment_title,
          assignment_type,
          assignment_max_points,
          classroom_id,
          classroom_name,
          total_submissions,
          completed_submissions,
          in_progress_submissions,
          not_started_submissions,
          graded_submissions,
          submission_rate_percent,
          avg_score,
          max_score_achieved,
          min_score_achieved,
          assignment_created_at,
          assignment_due_date,
          classroom_deadline_override,
          total_students_in_classroom
         FROM admin_dashboard.assignment_submission_stats
         ORDER BY assignment_created_at DESC
         LIMIT $1`,
        [limit],
      );

      const data: AssignmentSubmissionStatsDto[] = results.map((row: any) => ({
        assignment_id: row.assignment_id,
        assignment_title: row.assignment_title,
        assignment_type: row.assignment_type,
        assignment_max_points: row.assignment_max_points,
        classroom_id: row.classroom_id,
        classroom_name: row.classroom_name,
        total_submissions: parseInt(row.total_submissions || '0', 10),
        completed_submissions: parseInt(row.completed_submissions || '0', 10),
        in_progress_submissions: parseInt(row.in_progress_submissions || '0', 10),
        not_started_submissions: parseInt(row.not_started_submissions || '0', 10),
        graded_submissions: parseInt(row.graded_submissions || '0', 10),
        submission_rate_percent: row.submission_rate_percent ? parseFloat(row.submission_rate_percent) : null,
        avg_score: row.avg_score ? parseFloat(row.avg_score) : null,
        max_score_achieved: row.max_score_achieved,
        min_score_achieved: row.min_score_achieved,
        assignment_created_at: row.assignment_created_at instanceof Date
          ? row.assignment_created_at.toISOString()
          : row.assignment_created_at,
        assignment_due_date: row.assignment_due_date instanceof Date
          ? row.assignment_due_date.toISOString()
          : row.assignment_due_date,
        classroom_deadline_override: row.classroom_deadline_override instanceof Date
          ? row.classroom_deadline_override.toISOString()
          : row.classroom_deadline_override,
        total_students_in_classroom: parseInt(row.total_students_in_classroom || '0', 10),
      }));

      // Get total count of assignments
      const countResult = await this.authConnection.query(
        'SELECT COUNT(*) as count FROM educational_content.assignments WHERE is_published = TRUE',
      );
      const total = parseInt(countResult[0]?.count || '0', 10);

      return {
        data,
        total,
        limit,
      };
    } catch (error) {
      console.error('Error fetching assignment submission stats:', error);
      // Return empty list if view doesn't exist
      return {
        data: [],
        total: 0,
        limit,
      };
    }
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  /**
   * Get recent activity from DB view (internal)
   */
  private async getRecentActivityInternal(
    limit: number,
  ): Promise<AdminActionDto[]> {
    try {
      // Query the admin_dashboard.recent_activity view
      const results = await this.authConnection.query(
        `SELECT
          id,
          user_id,
          email,
          first_name,
          last_name,
          action_type,
          description,
          metadata,
          created_at
         FROM admin_dashboard.recent_activity
         ORDER BY created_at DESC
         LIMIT $1`,
        [limit],
      );

      return results.map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        action_type: row.action_type,
        description: row.description,
        metadata: row.metadata,
        created_at: row.created_at instanceof Date
          ? row.created_at.toISOString()
          : row.created_at,
      }));
    } catch (error) {
      console.error('Error fetching recent activity from view:', error);
      // Fallback to empty array if view doesn't exist or query fails
      return [];
    }
  }

  /**
   * Get active users in last 24 hours
   * Uses user_stats_summary view if available, otherwise counts from activity log
   */
  private async getActiveUsers24h(since: Date): Promise<number> {
    try {
      // Try using the user_stats_summary view
      const result = await this.authConnection.query(
        `SELECT COUNT(DISTINCT user_id) as count
         FROM audit_logging.activity_log
         WHERE created_at > $1`,
        [since],
      );
      return parseInt(result[0]?.count || '0', 10);
    } catch (error) {
      console.error('Error fetching active users:', error);
      return 0;
    }
  }

  /**
   * Get exercises completed in last 24 hours
   * This is an estimation based on activity log
   */
  private async getExercisesCompleted24h(since: Date): Promise<number> {
    try {
      const result = await this.authConnection.query(
        `SELECT COUNT(*) as count
         FROM audit_logging.activity_log
         WHERE action_type LIKE '%exercise%'
         AND created_at > $1`,
        [since],
      );
      return parseInt(result[0]?.count || '0', 10);
    } catch (error) {
      console.error('Error fetching exercises completed:', error);
      return 0;
    }
  }

  /**
   * Determine system health based on metrics
   */
  private determineSystemHealth(
    activeUsers: number,
    totalUsers: number,
  ): 'healthy' | 'warning' | 'critical' {
    if (totalUsers === 0) return 'warning';

    const activeRatio = activeUsers / totalUsers;

    if (activeRatio >= 0.2) return 'healthy';
    if (activeRatio >= 0.05) return 'warning';
    return 'critical';
  }
}
