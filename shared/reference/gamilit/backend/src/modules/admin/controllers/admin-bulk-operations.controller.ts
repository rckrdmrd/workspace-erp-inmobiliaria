import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { BulkOperationsService } from '../services/bulk-operations.service';
import {
  BulkSuspendUsersDto,
  BulkActivateUsersDto,
  BulkUpdateRoleDto,
  BulkDeleteUsersDto,
  BulkOperationStatusDto,
} from '../dto/bulk-operations';

/**
 * AdminBulkOperationsController
 *
 * @description Endpoints para operaciones bulk (masivas) sobre usuarios
 * @related EXT-002 (Admin Extendido - Bulk Operations)
 *
 * ENDPOINTS:
 * - POST /admin/bulk-operations/suspend-users
 * - POST /admin/bulk-operations/activate-users
 * - POST /admin/bulk-operations/update-role
 * - POST /admin/bulk-operations/delete-users
 * - GET  /admin/bulk-operations/:id
 * - GET  /admin/bulk-operations
 */
@ApiTags('Admin - Bulk Operations')
@Controller('admin/bulk-operations')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminBulkOperationsController {
  constructor(private readonly bulkOpsService: BulkOperationsService) {}

  /**
   * Suspende múltiples usuarios de forma masiva
   */
  @Post('suspend-users')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Suspend multiple users in bulk',
    description: 'Creates a bulk operation to suspend multiple users. Returns immediately with operation ID.',
  })
  @ApiResponse({
    status: 202,
    description: 'Bulk operation created and processing started',
    type: BulkOperationStatusDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async bulkSuspendUsers(
    @Body() dto: BulkSuspendUsersDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user.sub; // JWT payload contiene sub = user.id
    return await this.bulkOpsService.bulkSuspendUsers(dto, adminId);
  }

  /**
   * Activa múltiples usuarios de forma masiva
   */
  @Post('activate-users')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Activate multiple users in bulk',
    description: 'Creates a bulk operation to activate (unsuspend) multiple users.',
  })
  @ApiResponse({
    status: 202,
    description: 'Bulk operation created and processing started',
    type: BulkOperationStatusDto,
  })
  async bulkActivateUsers(
    @Body() dto: BulkActivateUsersDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user.sub;
    return await this.bulkOpsService.bulkActivateUsers(dto, adminId);
  }

  /**
   * Actualiza roles de múltiples usuarios
   */
  @Post('update-role')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Update role for multiple users in bulk',
    description: 'Creates a bulk operation to update the role of multiple users.',
  })
  @ApiResponse({
    status: 202,
    description: 'Bulk operation created and processing started',
    type: BulkOperationStatusDto,
  })
  async bulkUpdateRole(
    @Body() dto: BulkUpdateRoleDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user.sub;
    return await this.bulkOpsService.bulkUpdateRole(dto, adminId);
  }

  /**
   * Elimina múltiples usuarios (soft delete por defecto)
   */
  @Post('delete-users')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Delete multiple users in bulk',
    description: 'Creates a bulk operation to delete multiple users (soft delete by default).',
  })
  @ApiResponse({
    status: 202,
    description: 'Bulk operation created and processing started',
    type: BulkOperationStatusDto,
  })
  async bulkDeleteUsers(
    @Body() dto: BulkDeleteUsersDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user.sub;
    return await this.bulkOpsService.bulkDeleteUsers(dto, adminId);
  }

  /**
   * Obtiene el estado de una operación bulk
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Get bulk operation status',
    description: 'Retrieves the current status and progress of a bulk operation.',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk operation status retrieved',
    type: BulkOperationStatusDto,
  })
  @ApiResponse({ status: 404, description: 'Bulk operation not found' })
  async getBulkOperationStatus(@Param('id') id: string): Promise<BulkOperationStatusDto> {
    return await this.bulkOpsService.getBulkOperationStatus(id);
  }

  /**
   * Lista operaciones bulk recientes
   */
  @Get()
  @ApiOperation({
    summary: 'List recent bulk operations',
    description: 'Retrieves a list of recent bulk operations (last 100).',
  })
  @ApiResponse({
    status: 200,
    description: 'Bulk operations list retrieved',
    type: [BulkOperationStatusDto],
  })
  async listBulkOperations(): Promise<BulkOperationStatusDto[]> {
    return await this.bulkOpsService.listBulkOperations();
  }
}
