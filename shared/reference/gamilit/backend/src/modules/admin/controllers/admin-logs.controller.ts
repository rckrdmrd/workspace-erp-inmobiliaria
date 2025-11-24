import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminSystemService } from '../services/admin-system.service';
import { AuditLogQueryDto, PaginatedAuditLogDto } from '../dto/system';

/**
 * AdminLogsController
 *
 * Alias controller for /admin/logs endpoint to maintain frontend compatibility.
 * This is a simplified route that delegates to AdminSystemService.getAuditLog().
 *
 * Frontend expects: GET /admin/logs
 * Backend canonical route: GET /admin/system/audit-log
 *
 * Both routes are supported for compatibility.
 */
@ApiTags('Admin - Logs')
@Controller('admin/logs')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminLogsController {
  constructor(private readonly adminSystemService: AdminSystemService) {}

  @Get()
  @ApiOperation({
    summary: 'Get system logs (alias)',
    description:
      'Retrieve system audit logs with filtering options. This is an alias for /admin/system/audit-log for frontend compatibility.',
  })
  async getLogs(
    @Query() query: AuditLogQueryDto,
  ): Promise<PaginatedAuditLogDto> {
    return await this.adminSystemService.getAuditLog(query);
  }
}
