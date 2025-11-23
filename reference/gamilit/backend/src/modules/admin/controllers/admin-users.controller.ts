import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminUsersService } from '../services/admin-users.service';
import { BulkOperationsService } from '../services/bulk-operations.service';
import {
  ListUsersDto,
  UpdateUserDto,
  SuspendUserDto,
  PaginatedUsersDto,
  UserStatsDto,
  ResetPasswordDto,
} from '../dto/users';
import {
  BulkSuspendUsersDto,
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkOperationStatusDto,
} from '../dto/bulk-operations';
import { User } from '@modules/auth/entities/user.entity';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminUsersController {
  constructor(
    private readonly adminUsersService: AdminUsersService,
    private readonly bulkOpsService: BulkOperationsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List users with filters and pagination' })
  async listUsers(@Query() query: ListUsersDto): Promise<PaginatedUsersDto> {
    return await this.adminUsersService.listUsers(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get user statistics' })
  async getUserStats(): Promise<UserStatsDto> {
    return await this.adminUsersService.getUserStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  async getUserDetails(@Param('id') id: string): Promise<User> {
    return await this.adminUsersService.getUserDetails(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user information' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ): Promise<User> {
    return await this.adminUsersService.updateUser(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user' })
  async deleteUser(@Param('id') id: string): Promise<void> {
    await this.adminUsersService.deleteUser(id);
  }

  @Post(':id/suspend')
  @ApiOperation({ summary: 'Suspend user account' })
  async suspendUser(
    @Param('id') id: string,
    @Body() suspendDto: SuspendUserDto,
  ): Promise<User> {
    return await this.adminUsersService.suspendUser(id, suspendDto);
  }

  @Post(':id/activate')
  @ApiOperation({ summary: 'Activate suspended user account' })
  async activateUser(@Param('id') id: string): Promise<User> {
    return await this.adminUsersService.activateUser(id);
  }

  @Post(':id/unsuspend')
  @ApiOperation({
    summary: 'Unsuspend user account',
    description: 'Removes suspension from a user account, restoring normal access. Alias for activate endpoint.',
  })
  async unsuspendUser(@Param('id') id: string): Promise<User> {
    return await this.adminUsersService.unsuspendUser(id);
  }

  @Post(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate user account',
    description: 'Temporarily deactivate a user account without full suspension. User can be reactivated later.',
  })
  async deactivateUser(
    @Param('id') id: string,
    @Body() deactivateDto: SuspendUserDto,
  ): Promise<User> {
    return await this.adminUsersService.deactivateUser(id, deactivateDto);
  }

  @Post(':id/reset-password')
  @ApiOperation({
    summary: 'Force password reset for user',
    description: 'Forces a user to reset their password on next login. Generates reset token and sends email.',
  })
  async resetPassword(
    @Param('id') id: string,
    @Body() resetDto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    return await this.adminUsersService.resetPassword(id, resetDto);
  }

  // ===============================================
  // BULK OPERATIONS (Aliases for compatibility)
  // ===============================================

  @Post('bulk/suspend')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Bulk suspend users',
    description: 'Suspend multiple users at once. Alias for /admin/bulk-operations/suspend-users',
  })
  async bulkSuspend(
    @Body() dto: BulkSuspendUsersDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.bulkOpsService.bulkSuspendUsers(dto, adminId);
  }

  @Post('bulk/delete')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Bulk delete users',
    description: 'Delete multiple users at once. Alias for /admin/bulk-operations/delete-users',
  })
  async bulkDelete(
    @Body() dto: BulkDeleteUsersDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.bulkOpsService.bulkDeleteUsers(dto, adminId);
  }

  @Post('bulk/update-role')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Bulk update user roles',
    description: 'Update role for multiple users at once. Alias for /admin/bulk-operations/update-role',
  })
  async bulkUpdateRole(
    @Body() dto: BulkUpdateRoleDto,
    @Request() req: any,
  ): Promise<BulkOperationStatusDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.bulkOpsService.bulkUpdateRole(dto, adminId);
  }
}
