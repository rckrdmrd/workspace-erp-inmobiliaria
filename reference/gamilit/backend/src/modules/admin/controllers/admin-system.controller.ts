import { Controller, Get, Post, Put, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminSystemService } from '../services/admin-system.service';
import {
  SystemHealthDto,
  SystemMetricsDto,
  AuditLogQueryDto,
  PaginatedAuditLogDto,
  UpdateSystemConfigDto,
  SystemConfigDto,
  ToggleMaintenanceDto,
  MaintenanceStatusDto,
  CleanupLogsDto,
  CleanupUserActivityDto,
  MaintenanceOperationResultDto,
  DatabaseOptimizationResultDto,
  CacheClearResultDto,
  SessionCleanupResultDto,
} from '../dto/system';

@ApiTags('Admin - System')
@Controller('admin/system')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminSystemController {
  constructor(private readonly adminSystemService: AdminSystemService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Get system health status',
    description:
      'Retrieve detailed health information including database, memory, CPU, and uptime metrics',
  })
  async getSystemHealth(): Promise<SystemHealthDto> {
    return await this.adminSystemService.getSystemHealth();
  }

  @Get('metrics')
  @ApiOperation({
    summary: 'Get system metrics',
    description:
      'Retrieve system performance metrics including user activity, request counts, error rates, and resource usage',
  })
  async getSystemMetrics(): Promise<SystemMetricsDto> {
    return await this.adminSystemService.getSystemMetrics();
  }

  @Get('audit-log')
  @ApiOperation({
    summary: 'Get audit log',
    description:
      'Retrieve authentication attempt logs with filtering options for security auditing',
  })
  async getAuditLog(
    @Query() query: AuditLogQueryDto,
  ): Promise<PaginatedAuditLogDto> {
    return await this.adminSystemService.getAuditLog(query);
  }

  @Post('config')
  @ApiOperation({
    summary: 'Update system configuration',
    description:
      'Update system-wide configuration settings including maintenance mode, login policies, and session timeouts',
  })
  async updateSystemConfig(
    @Body() configDto: UpdateSystemConfigDto,
    @Request() req: any,
  ): Promise<SystemConfigDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminSystemService.updateSystemConfig(configDto, adminId);
  }

  @Get('config')
  @ApiOperation({
    summary: 'Get current system configuration',
    description: 'Retrieve the current system configuration settings',
  })
  async getSystemConfig(): Promise<SystemConfigDto> {
    return await this.adminSystemService.getSystemConfig();
  }

  @Get('config/:category')
  @ApiOperation({
    summary: 'Get system configuration by category',
    description:
      'Retrieve system configuration settings filtered by category (general, email, notifications, security, maintenance)',
  })
  async getConfigByCategory(
    @Param('category') category: string,
  ): Promise<Record<string, any>> {
    return await this.adminSystemService.getConfigByCategory(category);
  }

  @Put('config/:category')
  @ApiOperation({
    summary: 'Update system configuration by category',
    description:
      'Update system configuration settings for a specific category',
  })
  async updateConfigByCategory(
    @Param('category') category: string,
    @Body() configDto: Record<string, any>,
    @Request() req: any,
  ): Promise<Record<string, any>> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminSystemService.updateConfigByCategory(
      category,
      configDto,
      adminId,
    );
  }

  @Post('maintenance')
  @ApiOperation({
    summary: 'Toggle maintenance mode',
    description:
      'Enable or disable maintenance mode. When enabled, all non-admin users will be blocked from accessing the system.',
  })
  async toggleMaintenance(
    @Body() toggleDto: ToggleMaintenanceDto,
    @Request() req: any,
  ): Promise<MaintenanceStatusDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminSystemService.toggleMaintenance(
      toggleDto,
      adminId,
    );
  }

  @Post('maintenance/cleanup-logs')
  @ApiOperation({
    summary: 'Cleanup old system logs',
    description:
      'Delete system log entries older than the specified retention period to free up database space and improve performance.',
  })
  async cleanupSystemLogs(
    @Body() dto: CleanupLogsDto,
  ): Promise<MaintenanceOperationResultDto> {
    return await this.adminSystemService.cleanupSystemLogs(dto);
  }

  @Post('maintenance/cleanup-activity')
  @ApiOperation({
    summary: 'Cleanup old user activity logs',
    description:
      'Delete user activity log entries older than the specified retention period.',
  })
  async cleanupUserActivity(
    @Body() dto: CleanupUserActivityDto,
  ): Promise<MaintenanceOperationResultDto> {
    return await this.adminSystemService.cleanupUserActivity(dto);
  }

  @Post('maintenance/optimize-database')
  @ApiOperation({
    summary: 'Optimize database',
    description:
      'Run VACUUM ANALYZE on critical tables to optimize database performance and reclaim disk space.',
  })
  async optimizeDatabase(): Promise<DatabaseOptimizationResultDto> {
    return await this.adminSystemService.optimizeDatabase();
  }

  @Post('maintenance/clear-cache')
  @ApiOperation({
    summary: 'Clear application cache',
    description:
      'Clear all application-level caches (Redis, in-memory, etc.).',
  })
  async clearCache(): Promise<CacheClearResultDto> {
    return await this.adminSystemService.clearCache();
  }

  @Post('maintenance/cleanup-sessions')
  @ApiOperation({
    summary: 'Cleanup expired sessions',
    description:
      'Remove expired user sessions from the system to free up resources.',
  })
  async cleanupSessions(): Promise<SessionCleanupResultDto> {
    return await this.adminSystemService.cleanupExpiredSessions();
  }
}
