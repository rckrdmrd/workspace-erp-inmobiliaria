import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Module } from '@modules/educational/entities/module.entity';
import { Exercise } from '@modules/educational/entities/exercise.entity';
import { ContentTemplate } from '@modules/content/entities/content-template.entity';
import { MediaFile } from '@modules/content/entities/media-file.entity';
import {
  ContentApproval,
  ContentApprovalStatus,
  ContentApprovalType
} from '@modules/educational/entities/content-approval.entity';
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
  ApprovalHistoryItemDto,
} from '../dto/content';
import { ContentStatusEnum } from '@shared/constants';
import { MediaFileResponseDto } from '@modules/content/dto/media-file-response.dto';

@Injectable()
export class AdminContentService {
  constructor(
    @InjectRepository(Module, 'educational')
    private readonly moduleRepo: Repository<Module>,
    @InjectRepository(Exercise, 'educational')
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(ContentTemplate, 'content')
    private readonly templateRepo: Repository<ContentTemplate>,
    @InjectRepository(MediaFile, 'content')
    private readonly mediaFileRepo: Repository<MediaFile>,
    @InjectRepository(ContentApproval, 'educational')
    private readonly contentApprovalRepo: Repository<ContentApproval>,
  ) {}

  /**
   * Get pending content for approval (modules, exercises, templates)
   */
  async getPendingContent(
    query: ListContentDto,
  ): Promise<PaginatedContentDto> {
    const {
      content_type,
      status = ContentStatusEnum.UNDER_REVIEW,
      search,
      created_by,
      page = 1,
      limit = 20,
    } = query;
    const skip = (page - 1) * limit;

    let data: any[] = [];
    let total = 0;

    // If specific content type is requested
    if (content_type === 'module') {
      const result = await this.getModules(
        status,
        search,
        created_by,
        skip,
        limit,
      );
      data = result.data.map((m) => this.mapModuleToContentDto(m));
      total = result.total;
    } else if (content_type === 'exercise') {
      const result = await this.getExercises(
        search,
        created_by,
        skip,
        limit,
      );
      data = result.data.map((e) => this.mapExerciseToContentDto(e));
      total = result.total;
    } else if (content_type === 'template') {
      const result = await this.getTemplates(
        search,
        created_by,
        skip,
        limit,
      );
      data = result.data.map((t) => this.mapTemplateToContentDto(t));
      total = result.total;
    } else {
      // Get all types (modules only for now, as exercises don't have status)
      const result = await this.getModules(
        status,
        search,
        created_by,
        skip,
        limit,
      );
      data = result.data.map((m) => this.mapModuleToContentDto(m));
      total = result.total;
    }

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Approve content by ID
   */
  async approveContent(
    id: string,
    approvalDto: ApproveContentDto,
    adminId: string,
  ): Promise<ContentDto> {
    // Try to find content in different repositories
    let content: any;
    let contentType: 'module' | 'exercise' | 'template';

    // Try Module first
    content = await this.moduleRepo.findOne({ where: { id } });
    if (content) {
      contentType = 'module';
    } else {
      // Try Exercise
      content = await this.exerciseRepo.findOne({ where: { id } });
      if (content) {
        contentType = 'exercise';
      } else {
        // Try ContentTemplate
        content = await this.templateRepo.findOne({ where: { id } });
        if (content) {
          contentType = 'template';
        } else {
          throw new NotFoundException(`Content ${id} not found`);
        }
      }
    }

    // Create approval history record
    const approvalRecord = this.contentApprovalRepo.create({
      content_type: contentType as any,
      content_id: id,
      submitted_by: content.created_by,
      submitted_at: content.created_at,
      reviewed_by: adminId,
      reviewed_at: new Date(),
      status: ContentApprovalStatus.APPROVED,
      reviewer_notes: approvalDto.approval_notes,
    });
    await this.contentApprovalRepo.save(approvalRecord);

    // Update content status and approval fields
    if (contentType === 'module') {
      content.status = ContentStatusEnum.PUBLISHED;
      content.approved_by = adminId;

      if (approvalDto.publish_immediately !== false) {
        content.is_published = true;
        content.published_at = new Date();
      }

      // Add approval notes to metadata
      if (approvalDto.approval_notes) {
        content.metadata = {
          ...content.metadata,
          approval_notes: approvalDto.approval_notes,
          approved_at: new Date().toISOString(),
        };
      }

      const updated = await this.moduleRepo.save(content);
      return this.mapModuleToContentDto(updated);
    } else if (contentType === 'exercise') {
      // Exercises don't have status enum, just mark as reviewed
      content.reviewed_by = adminId;
      content.is_active = true;

      content.metadata = {
        ...content.metadata,
        approved: true,
        approval_notes: approvalDto.approval_notes,
        approved_at: new Date().toISOString(),
      };

      const updated = await this.exerciseRepo.save(content);
      return this.mapExerciseToContentDto(updated);
    } else {
      // ContentTemplate approval
      content.is_public = approvalDto.publish_immediately !== false;
      content.metadata = {
        ...content.metadata,
        approved: true,
        approved_by: adminId,
        approval_notes: approvalDto.approval_notes,
        approved_at: new Date().toISOString(),
      };

      const updated = await this.templateRepo.save(content);
      return this.mapTemplateToContentDto(updated);
    }
  }

  /**
   * Reject content with reason
   */
  async rejectContent(
    id: string,
    rejectionDto: RejectContentDto,
    adminId: string,
  ): Promise<ContentDto> {
    // Try to find content in different repositories
    let content: any;
    let contentType: 'module' | 'exercise' | 'template';

    // Try Module first
    content = await this.moduleRepo.findOne({ where: { id } });
    if (content) {
      contentType = 'module';
    } else {
      // Try Exercise
      content = await this.exerciseRepo.findOne({ where: { id } });
      if (content) {
        contentType = 'exercise';
      } else {
        // Try ContentTemplate
        content = await this.templateRepo.findOne({ where: { id } });
        if (content) {
          contentType = 'template';
        } else {
          throw new NotFoundException(`Content ${id} not found`);
        }
      }
    }

    // Create rejection history record
    const approvalRecord = this.contentApprovalRepo.create({
      content_type: contentType as any,
      content_id: id,
      submitted_by: content.created_by,
      submitted_at: content.created_at,
      reviewed_by: adminId,
      reviewed_at: new Date(),
      status: ContentApprovalStatus.REJECTED,
      reviewer_notes: rejectionDto.rejection_reason,
    });
    await this.contentApprovalRepo.save(approvalRecord);

    // Update content to rejected state
    if (contentType === 'module') {
      content.status = ContentStatusEnum.DRAFT;
      content.reviewed_by = adminId;
      content.is_published = false;

      content.metadata = {
        ...content.metadata,
        rejection_reason: rejectionDto.rejection_reason,
        rejected_at: new Date().toISOString(),
        rejected_by: adminId,
      };

      const updated = await this.moduleRepo.save(content);
      return this.mapModuleToContentDto(updated);
    } else if (contentType === 'exercise') {
      content.reviewed_by = adminId;
      content.is_active = false;

      content.metadata = {
        ...content.metadata,
        approved: false,
        rejection_reason: rejectionDto.rejection_reason,
        rejected_at: new Date().toISOString(),
        rejected_by: adminId,
      };

      const updated = await this.exerciseRepo.save(content);
      return this.mapExerciseToContentDto(updated);
    } else {
      // ContentTemplate rejection
      content.is_public = false;
      content.metadata = {
        ...content.metadata,
        approved: false,
        rejection_reason: rejectionDto.rejection_reason,
        rejected_at: new Date().toISOString(),
        rejected_by: adminId,
      };

      const updated = await this.templateRepo.save(content);
      return this.mapTemplateToContentDto(updated);
    }
  }

  // =====================================================
  // PRIVATE HELPER METHODS
  // =====================================================

  private async getModules(
    status: ContentStatusEnum,
    search: string | undefined,
    createdBy: string | undefined,
    skip: number,
    limit: number,
  ): Promise<{ data: Module[]; total: number }> {
    const queryBuilder = this.moduleRepo.createQueryBuilder('module');

    queryBuilder.where('module.status = :status', { status });

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('module.title ILIKE :search', { search: `%${search}%` })
            .orWhere('module.description ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (createdBy) {
      queryBuilder.andWhere('module.created_by = :createdBy', { createdBy });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('module.created_at', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  private async getExercises(
    search: string | undefined,
    createdBy: string | undefined,
    skip: number,
    limit: number,
  ): Promise<{ data: Exercise[]; total: number }> {
    const queryBuilder = this.exerciseRepo.createQueryBuilder('exercise');

    // Exercises don't have status enum, filter by reviewed_by = null for pending
    queryBuilder.where('exercise.reviewed_by IS NULL');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('exercise.title ILIKE :search', { search: `%${search}%` })
            .orWhere('exercise.description ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (createdBy) {
      queryBuilder.andWhere('exercise.created_by = :createdBy', { createdBy });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('exercise.created_at', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  private async getTemplates(
    search: string | undefined,
    createdBy: string | undefined,
    skip: number,
    limit: number,
  ): Promise<{ data: ContentTemplate[]; total: number }> {
    const queryBuilder = this.templateRepo.createQueryBuilder('template');

    // Templates pending approval: not public and not system templates
    queryBuilder.where('template.is_public = false');
    queryBuilder.andWhere('template.is_system_template = false');

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('template.name ILIKE :search', { search: `%${search}%` })
            .orWhere('template.description ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    if (createdBy) {
      queryBuilder.andWhere('template.created_by = :createdBy', { createdBy });
    }

    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('template.created_at', 'DESC')
      .getManyAndCount();

    return { data, total };
  }

  // Mapping functions
  private mapModuleToContentDto(module: Module): ContentDto {
    return {
      id: module.id,
      content_type: 'module',
      title: module.title,
      description: module.description,
      status: module.status,
      is_published: module.is_published,
      created_by: module.created_by,
      reviewed_by: module.reviewed_by,
      approved_by: module.approved_by,
      version: module.version,
      created_at: module.created_at,
      updated_at: module.updated_at,
      published_at: module.published_at,
      metadata: module.metadata,
    } as ContentDto;
  }

  private mapExerciseToContentDto(exercise: Exercise): ContentDto {
    return {
      id: exercise.id,
      content_type: 'exercise',
      title: exercise.title,
      description: exercise.description,
      status: exercise.is_active ? ContentStatusEnum.PUBLISHED : ContentStatusEnum.DRAFT,
      is_published: exercise.is_active,
      created_by: exercise.created_by,
      reviewed_by: exercise.reviewed_by,
      approved_by: undefined,
      version: exercise.version,
      created_at: exercise.created_at,
      updated_at: exercise.updated_at,
      published_at: undefined,
      metadata: exercise.metadata,
    } as ContentDto;
  }

  private mapTemplateToContentDto(template: ContentTemplate): ContentDto {
    return {
      id: template.id,
      content_type: 'template',
      title: template.name,
      description: template.description,
      status: template.is_public ? ContentStatusEnum.PUBLISHED : ContentStatusEnum.DRAFT,
      is_published: template.is_public,
      created_by: template.created_by,
      reviewed_by: undefined,
      approved_by: undefined,
      version: 1,
      created_at: template.created_at,
      updated_at: template.updated_at,
      published_at: undefined,
      metadata: template.metadata,
    } as ContentDto;
  }

  // =====================================================
  // VERSION MANAGEMENT
  // =====================================================

  /**
   * Create a version snapshot of content (module, exercise, or template)
   * Stores version history in metadata JSONB field
   */
  async createVersion(
    dto: CreateVersionDto,
    adminId: string,
  ): Promise<VersionResponseDto> {
    const { content_id, content_type, version_notes, new_version } = dto;

    // 1. Find content by type
    let content: any;
    let repository: any;

    switch (content_type) {
      case 'module':
        content = await this.moduleRepo.findOne({
          where: { id: content_id },
        });
        repository = this.moduleRepo;
        break;
      case 'exercise':
        content = await this.exerciseRepo.findOne({
          where: { id: content_id },
        });
        repository = this.exerciseRepo;
        break;
      case 'template':
        content = await this.templateRepo.findOne({
          where: { id: content_id },
        });
        repository = this.templateRepo;
        break;
      default:
        throw new BadRequestException(`Invalid content_type: ${content_type}`);
    }

    if (!content) {
      throw new NotFoundException(
        `${content_type} with ID ${content_id} not found`,
      );
    }

    // 2. Get current version from metadata or default to 1.0.0
    const metadata = content.metadata || {};
    const current_version = metadata.current_version || '1.0.0';
    const versions = metadata.versions || [];

    // 3. Calculate new version (auto-increment or use provided)
    let calculated_new_version: string;
    if (new_version) {
      calculated_new_version = new_version;
    } else {
      // Auto-increment minor version (x.y.0 → x.(y+1).0)
      const [major, minor] = current_version.split('.').map(Number);
      calculated_new_version = `${major}.${minor + 1}.0`;
    }

    // 4. Create snapshot based on content type
    const snapshot = this.createSnapshot(content, content_type);

    // 5. Create version entry
    const version_entry = {
      version: calculated_new_version,
      created_at: new Date().toISOString(),
      created_by: adminId,
      version_notes: version_notes || '',
      snapshot,
    };

    // 6. Update metadata with new version
    const updated_metadata = {
      ...metadata,
      current_version: calculated_new_version,
      versions: [...versions, version_entry],
    };

    // 7. Save updated content
    content.metadata = updated_metadata;
    await repository.save(content);

    // 8. Return response
    return {
      content_id,
      content_type,
      old_version: current_version,
      new_version: calculated_new_version,
      version_notes: version_notes || '',
      created_at: version_entry.created_at,
      created_by: adminId,
      total_versions: updated_metadata.versions.length,
      snapshot,
    };
  }

  /**
   * Create snapshot of content based on type
   * @private
   */
  private createSnapshot(
    content: any,
    content_type: string,
  ): Record<string, any> {
    switch (content_type) {
      case 'module':
        return {
          title: content.title,
          description: content.description,
          order: content.order,
          estimated_duration: content.estimated_duration,
          is_published: content.is_published,
          published_at: content.published_at,
        };
      case 'exercise':
        return {
          title: content.title,
          description: content.description,
          exercise_type: content.exercise_type,
          content_data: content.content_data,
          is_published: content.is_active,
          estimated_time: content.estimated_time,
        };
      case 'template':
        return {
          template_name: content.name,
          template_type: content.type,
          template_structure: content.structure,
          is_active: content.is_active,
        };
      default:
        return {};
    }
  }

  // =====================================================
  // MEDIA LIBRARY MANAGEMENT
  // =====================================================

  /**
   * Get media library with filters and pagination
   */
  async getMediaLibrary(query: ListMediaDto): Promise<PaginatedMediaDto> {
    const {
      search,
      media_type,
      category,
      uploaded_by,
      page = 1,
      limit = 20,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.mediaFileRepo.createQueryBuilder('media');

    // Only show active files
    queryBuilder.where('media.is_active = true');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('media.filename ILIKE :search', { search: `%${search}%` })
            .orWhere('media.original_filename ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('media.description ILIKE :search', {
              search: `%${search}%`,
            })
            .orWhere('media.alt_text ILIKE :search', {
              search: `%${search}%`,
            });
        }),
      );
    }

    // Apply media type filter
    if (media_type) {
      queryBuilder.andWhere('media.media_type = :media_type', { media_type });
    }

    // Apply category filter
    if (category) {
      queryBuilder.andWhere('media.category = :category', { category });
    }

    // Apply uploaded_by filter
    if (uploaded_by) {
      queryBuilder.andWhere('media.uploaded_by = :uploaded_by', {
        uploaded_by,
      });
    }

    // Pagination and ordering
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('media.created_at', 'DESC')
      .getManyAndCount();

    return {
      data: data as any,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Delete media file (soft delete)
   */
  async deleteMediaFile(id: string): Promise<void> {
    const mediaFile = await this.mediaFileRepo.findOne({ where: { id } });

    if (!mediaFile) {
      throw new NotFoundException(`Media file ${id} not found`);
    }

    // Soft delete - set is_active to false
    mediaFile.is_active = false;
    await this.mediaFileRepo.save(mediaFile);
  }

  // =====================================================
  // APPROVAL HISTORY MANAGEMENT
  // =====================================================

  /**
   * Get approval history with filters and pagination
   */
  async getApprovalHistory(
    query: ListApprovalHistoryDto,
  ): Promise<PaginatedApprovalHistoryDto> {
    const {
      content_type,
      content_id,
      status,
      submitted_by,
      reviewed_by,
      search,
      page = 1,
      limit = 20,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.contentApprovalRepo
      .createQueryBuilder('approval')
      .leftJoinAndSelect('approval.submitter', 'submitter')
      .leftJoinAndSelect('approval.reviewer', 'reviewer');

    // Apply filters
    if (content_type) {
      queryBuilder.andWhere('approval.content_type = :content_type', {
        content_type,
      });
    }

    if (content_id) {
      queryBuilder.andWhere('approval.content_id = :content_id', {
        content_id,
      });
    }

    if (status) {
      queryBuilder.andWhere('approval.status = :status', { status });
    }

    if (submitted_by) {
      queryBuilder.andWhere('approval.submitted_by = :submitted_by', {
        submitted_by,
      });
    }

    if (reviewed_by) {
      queryBuilder.andWhere('approval.reviewed_by = :reviewed_by', {
        reviewed_by,
      });
    }

    if (search) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('approval.reviewer_notes ILIKE :search', {
            search: `%${search}%`,
          }).orWhere('approval.revision_notes ILIKE :search', {
            search: `%${search}%`,
          });
        }),
      );
    }

    // Pagination and ordering
    const [approvals, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('approval.created_at', 'DESC')
      .getManyAndCount();

    // Get content titles by querying respective repositories
    const data: ApprovalHistoryItemDto[] = await Promise.all(
      approvals.map(async (approval) => {
        let content_title: string | undefined;

        try {
          if (approval.content_type === ContentApprovalType.MODULE) {
            const module = await this.moduleRepo.findOne({
              where: { id: approval.content_id },
              select: ['title'],
            });
            content_title = module?.title;
          } else if (approval.content_type === ContentApprovalType.EXERCISE) {
            const exercise = await this.exerciseRepo.findOne({
              where: { id: approval.content_id },
              select: ['title'],
            });
            content_title = exercise?.title;
          } else if (approval.content_type === 'resource' as any) {
            // Template or resource
            const template = await this.templateRepo.findOne({
              where: { id: approval.content_id },
              select: ['name'],
            });
            content_title = template?.name;
          }
        } catch (error) {
          // Content might have been deleted, just leave title as undefined
          content_title = undefined;
        }

        return {
          id: approval.id,
          content_type: approval.content_type,
          content_id: approval.content_id,
          content_title,
          submitted_by: approval.submitted_by,
          submitter_email: undefined, // User relation removed due to cross-datasource limitation
          submitter_name: undefined,
          submitted_at: approval.submitted_at.toISOString(),
          reviewed_by: approval.reviewed_by,
          reviewer_email: undefined, // User relation removed due to cross-datasource limitation
          reviewer_name: undefined,
          reviewed_at: approval.reviewed_at?.toISOString(),
          status: approval.status,
          reviewer_notes: approval.reviewer_notes,
          revision_notes: approval.revision_notes,
          created_at: approval.created_at.toISOString(),
          updated_at: approval.updated_at.toISOString(),
        };
      }),
    );

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }
}
