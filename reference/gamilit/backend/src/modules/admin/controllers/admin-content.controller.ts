import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminContentService } from '../services/admin-content.service';
import {
  ListContentDto,
  ApproveContentDto,
  RejectContentDto,
  ContentDto,
  PaginatedContentDto,
  ListMediaDto,
  PaginatedMediaDto,
  CreateVersionDto,
  VersionResponseDto,
  ListApprovalHistoryDto,
  PaginatedApprovalHistoryDto,
} from '../dto/content';
import { MediaFileResponseDto } from '@modules/content/dto/media-file-response.dto';

@ApiTags('Admin - Content')
@Controller('admin/content')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminContentController {
  constructor(private readonly adminContentService: AdminContentService) {}

  @Get('pending')
  @ApiOperation({
    summary: 'Get pending content for approval',
    description:
      'Retrieve a paginated list of content (modules, exercises, templates) pending approval or review',
  })
  async getPendingContent(
    @Query() query: ListContentDto,
  ): Promise<PaginatedContentDto> {
    return await this.adminContentService.getPendingContent(query);
  }

  @Get('exercises/pending')
  @ApiOperation({
    summary: 'Get pending exercises for approval (alias)',
    description: 'Alias for /admin/content/pending with exercises filter. For frontend compatibility.',
  })
  async getPendingExercises(
    @Query() query: ListContentDto,
  ): Promise<PaginatedContentDto> {
    // Filter only exercises
    return await this.adminContentService.getPendingContent({ ...query, content_type: 'exercise' });
  }

  @Post(':id/approve')
  @ApiOperation({
    summary: 'Approve content',
    description:
      'Approve content by ID. Changes status to published and optionally publishes immediately.',
  })
  async approveContent(
    @Param('id') id: string,
    @Body() approvalDto: ApproveContentDto,
    @Request() req: any,
  ): Promise<ContentDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminContentService.approveContent(
      id,
      approvalDto,
      adminId,
    );
  }

  @Post('exercises/:id/approve')
  @ApiOperation({
    summary: 'Approve exercise (alias)',
    description: 'Alias for /admin/content/:id/approve. For frontend compatibility.',
  })
  async approveExercise(
    @Param('id') id: string,
    @Body() approvalDto: ApproveContentDto,
    @Request() req: any,
  ): Promise<ContentDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminContentService.approveContent(
      id,
      approvalDto,
      adminId,
    );
  }

  @Post(':id/reject')
  @ApiOperation({
    summary: 'Reject content with reason',
    description:
      'Reject content by ID. Changes status back to draft and stores rejection reason.',
  })
  async rejectContent(
    @Param('id') id: string,
    @Body() rejectionDto: RejectContentDto,
    @Request() req: any,
  ): Promise<ContentDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminContentService.rejectContent(
      id,
      rejectionDto,
      adminId,
    );
  }

  @Post('exercises/:id/reject')
  @ApiOperation({
    summary: 'Reject exercise (alias)',
    description: 'Alias for /admin/content/:id/reject. For frontend compatibility.',
  })
  async rejectExercise(
    @Param('id') id: string,
    @Body() rejectionDto: RejectContentDto,
    @Request() req: any,
  ): Promise<ContentDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminContentService.rejectContent(
      id,
      rejectionDto,
      adminId,
    );
  }

  @Post('version')
  @ApiOperation({
    summary: 'Create version snapshot',
    description:
      'Create a version snapshot of content (module, exercise, or template). ' +
      'Stores version history in metadata field with incremental version numbers. ' +
      'Auto-increments minor version by default, or accepts custom version number.',
  })
  @ApiResponse({
    status: 201,
    description: 'Version created successfully',
    type: VersionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content_type or version format',
  })
  async createVersion(
    @Body() dto: CreateVersionDto,
    @Request() req: any,
  ): Promise<VersionResponseDto> {
    const adminId = req.user?.id || req.user?.sub;
    return await this.adminContentService.createVersion(dto, adminId);
  }

  @Get('media')
  @ApiOperation({
    summary: 'Get media library',
    description:
      'Retrieve a paginated list of media files with optional filters',
  })
  async getMediaLibrary(
    @Query() query: ListMediaDto,
  ): Promise<PaginatedMediaDto> {
    return await this.adminContentService.getMediaLibrary(query);
  }

  @Delete('media/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete media file',
    description:
      'Delete a media file by ID. This will soft-delete the file (set is_active = false).',
  })
  async deleteMediaFile(@Param('id') id: string): Promise<void> {
    await this.adminContentService.deleteMediaFile(id);
  }

  @Get('approval-history')
  @ApiOperation({
    summary: 'Get content approval history',
    description:
      'Retrieve paginated approval history for content (modules, exercises, templates) with filters for content type, status, submitter, reviewer, etc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Approval history retrieved successfully',
    type: PaginatedApprovalHistoryDto,
  })
  async getApprovalHistory(
    @Query() query: ListApprovalHistoryDto,
  ): Promise<PaginatedApprovalHistoryDto> {
    return await this.adminContentService.getApprovalHistory(query);
  }
}
