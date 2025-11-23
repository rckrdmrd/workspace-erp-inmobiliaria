import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, Brackets } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { AdminContentService } from '../services/admin-content.service';
import { Module } from '@modules/educational/entities/module.entity';
import { Exercise } from '@modules/educational/entities/exercise.entity';
import { ContentTemplate } from '@modules/content/entities/content-template.entity';
import { MediaFile } from '@modules/content/entities/media-file.entity';
import { ContentApproval } from '@modules/educational/entities/content-approval.entity';
import {
  ListContentDto,
  ApproveContentDto,
  RejectContentDto,
  ListMediaDto,
} from '../dto/content';
import { ContentStatusEnum, MediaTypeEnum } from '@shared/constants';

describe('AdminContentService', () => {
  let service: AdminContentService;
  let moduleRepo: Repository<Module>;
  let exerciseRepo: Repository<Exercise>;
  let templateRepo: Repository<ContentTemplate>;
  let mediaFileRepo: Repository<MediaFile>;
  let contentApprovalRepo: Repository<ContentApproval>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  };

  const mockModuleRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockExerciseRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockTemplateRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockMediaFileRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockContentApprovalRepo = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminContentService,
        {
          provide: getRepositoryToken(Module, 'educational'),
          useValue: mockModuleRepo,
        },
        {
          provide: getRepositoryToken(Exercise, 'educational'),
          useValue: mockExerciseRepo,
        },
        {
          provide: getRepositoryToken(ContentTemplate, 'content'),
          useValue: mockTemplateRepo,
        },
        {
          provide: getRepositoryToken(MediaFile, 'content'),
          useValue: mockMediaFileRepo,
        },
        {
          provide: getRepositoryToken(ContentApproval, 'educational'),
          useValue: mockContentApprovalRepo,
        },
      ],
    }).compile();

    service = module.get<AdminContentService>(AdminContentService);
    moduleRepo = module.get(getRepositoryToken(Module, 'educational'));
    exerciseRepo = module.get(getRepositoryToken(Exercise, 'educational'));
    templateRepo = module.get(getRepositoryToken(ContentTemplate, 'content'));
    mediaFileRepo = module.get(getRepositoryToken(MediaFile, 'content'));
    contentApprovalRepo = module.get(getRepositoryToken(ContentApproval, 'educational'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getPendingContent', () => {
    const mockModules = [
      {
        id: 'module-1',
        title: 'Comprensión Literal',
        description: 'Módulo de comprensión literal',
        status: ContentStatusEnum.UNDER_REVIEW,
        is_published: false,
        created_by: 'creator-1',
        reviewed_by: null,
        approved_by: null,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: null,
        metadata: {},
      },
    ];

    const mockExercises = [
      {
        id: 'exercise-1',
        title: 'Ejercicio de comprensión',
        description: 'Descripción del ejercicio',
        is_active: false,
        created_by: 'creator-1',
        reviewed_by: null,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {},
      },
    ];

    const mockTemplates = [
      {
        id: 'template-1',
        name: 'Plantilla de preguntas',
        description: 'Plantilla para preguntas de opción múltiple',
        is_public: false,
        is_system_template: false,
        created_by: 'creator-1',
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {},
      },
    ];

    it('should get pending modules by default', async () => {
      // Arrange
      const query: ListContentDto = {};
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockModules, 1]);

      // Act
      const result = await service.getPendingContent(query);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(1);
      expect(result.data[0].content_type).toBe('module');
      expect(result.data[0].title).toBe('Comprensión Literal');
      expect(result.total).toBe(1);
    });

    it('should filter by content_type module', async () => {
      // Arrange
      const query: ListContentDto = { content_type: 'module' };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockModules, 1]);

      // Act
      const result = await service.getPendingContent(query);

      // Assert
      expect(result.data[0].content_type).toBe('module');
      expect(mockModuleRepo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should filter by content_type exercise', async () => {
      // Arrange
      const query: ListContentDto = { content_type: 'exercise' };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockExercises, 1]);

      // Act
      const result = await service.getPendingContent(query);

      // Assert
      expect(result.data[0].content_type).toBe('exercise');
      expect(mockExerciseRepo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should filter by content_type template', async () => {
      // Arrange
      const query: ListContentDto = { content_type: 'template' };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockTemplates, 1]);

      // Act
      const result = await service.getPendingContent(query);

      // Assert
      expect(result.data[0].content_type).toBe('template');
      expect(mockTemplateRepo.createQueryBuilder).toHaveBeenCalled();
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const query: ListContentDto = { page: 2, limit: 10 };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockModules, 25]);

      // Act
      const result = await service.getPendingContent(query);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10); // (page 2 - 1) * limit 10
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.page).toBe(2);
      expect(result.total_pages).toBe(3); // 25 / 10 = 2.5 => 3
    });

    it('should filter by status', async () => {
      // Arrange
      const query: ListContentDto = { status: ContentStatusEnum.PUBLISHED };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockModules, 1]);

      // Act
      await service.getPendingContent(query);

      // Assert
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'module.status = :status',
        { status: ContentStatusEnum.PUBLISHED },
      );
    });

    it('should filter by search term', async () => {
      // Arrange
      const query: ListContentDto = { search: 'comprensión' };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockModules, 1]);

      // Act
      await service.getPendingContent(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should filter by creator', async () => {
      // Arrange
      const query: ListContentDto = { created_by: 'creator-1' };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockModules, 1]);

      // Act
      await service.getPendingContent(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'module.created_by = :createdBy',
        { createdBy: 'creator-1' },
      );
    });

    it('should return empty array when no content found', async () => {
      // Arrange
      const query: ListContentDto = {};
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);

      // Act
      const result = await service.getPendingContent(query);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.total_pages).toBe(0);
    });
  });

  describe('approveContent', () => {
    const approvalDto: ApproveContentDto = {
      approval_notes: 'Content looks good',
      publish_immediately: true,
    };

    describe('Module approval', () => {
      const getMockModule = () => ({
        id: 'module-1',
        title: 'Test Module',
        description: 'Test Description',
        status: ContentStatusEnum.UNDER_REVIEW,
        is_published: false,
        created_by: 'creator-1',
        reviewed_by: null,
        approved_by: null,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: null,
        metadata: {},
      });

      it('should approve and publish module immediately', async () => {
        // Arrange
        const mockModule = getMockModule();
        mockModuleRepo.findOne.mockResolvedValue(mockModule);
        mockModuleRepo.save.mockResolvedValue({
          ...mockModule,
          status: ContentStatusEnum.PUBLISHED,
          is_published: true,
          approved_by: 'admin-1',
        });

        // Act
        const result = await service.approveContent(
          'module-1',
          approvalDto,
          'admin-1',
        );

        // Assert
        expect(result).toBeDefined();
        expect(result.content_type).toBe('module');
        expect(mockModuleRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            status: ContentStatusEnum.PUBLISHED,
            is_published: true,
            approved_by: 'admin-1',
          }),
        );
      });

      it('should add approval notes to module metadata', async () => {
        // Arrange
        const mockModule = getMockModule();
        mockModuleRepo.findOne.mockResolvedValue(mockModule);
        mockModuleRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        await service.approveContent('module-1', approvalDto, 'admin-1');

        // Assert
        expect(mockModuleRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: expect.objectContaining({
              approval_notes: 'Content looks good',
              approved_at: expect.any(String),
            }),
          }),
        );
      });

      it('should not publish immediately if publish_immediately is false', async () => {
        // Arrange
        const approvalDtoNoPublish: ApproveContentDto = {
          approval_notes: 'Approved but not ready to publish',
          publish_immediately: false,
        };
        const mockModule = getMockModule();
        mockModuleRepo.findOne.mockResolvedValue(mockModule);
        mockModuleRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        await service.approveContent('module-1', approvalDtoNoPublish, 'admin-1');

        // Assert
        expect(mockModuleRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            status: ContentStatusEnum.PUBLISHED,
            is_published: false, // Not published yet
          }),
        );
      });
    });

    describe('Exercise approval', () => {
      const mockExercise = {
        id: 'exercise-1',
        title: 'Test Exercise',
        description: 'Test Description',
        is_active: false,
        created_by: 'creator-1',
        reviewed_by: null,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {},
      };

      it('should approve exercise and set is_active to true', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(null); // Not a module
        mockExerciseRepo.findOne.mockResolvedValue(mockExercise);
        mockExerciseRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        const result = await service.approveContent(
          'exercise-1',
          approvalDto,
          'admin-1',
        );

        // Assert
        expect(result.content_type).toBe('exercise');
        expect(mockExerciseRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            is_active: true,
            reviewed_by: 'admin-1',
            metadata: expect.objectContaining({
              approved: true,
            }),
          }),
        );
      });

      it('should add approval notes to exercise metadata', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(null);
        mockExerciseRepo.findOne.mockResolvedValue(mockExercise);
        mockExerciseRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        await service.approveContent('exercise-1', approvalDto, 'admin-1');

        // Assert
        expect(mockExerciseRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: expect.objectContaining({
              approved: true,
              approval_notes: 'Content looks good',
              approved_at: expect.any(String),
            }),
          }),
        );
      });
    });

    describe('Template approval', () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Test Template',
        description: 'Test Description',
        is_public: false,
        is_system_template: false,
        created_by: 'creator-1',
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {},
      };

      it('should approve template and set is_public to true', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(null);
        mockExerciseRepo.findOne.mockResolvedValue(null);
        mockTemplateRepo.findOne.mockResolvedValue(mockTemplate);
        mockTemplateRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        const result = await service.approveContent(
          'template-1',
          approvalDto,
          'admin-1',
        );

        // Assert
        expect(result.content_type).toBe('template');
        expect(mockTemplateRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            is_public: true,
            metadata: expect.objectContaining({
              approved: true,
              approved_by: 'admin-1',
            }),
          }),
        );
      });
    });

    it('should throw NotFoundException if content not found', async () => {
      // Arrange
      mockModuleRepo.findOne.mockResolvedValue(null);
      mockExerciseRepo.findOne.mockResolvedValue(null);
      mockTemplateRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.approveContent('non-existent', approvalDto, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.approveContent('non-existent', approvalDto, 'admin-1'),
      ).rejects.toThrow('Content non-existent not found');
    });
  });

  describe('rejectContent', () => {
    const rejectionDto: RejectContentDto = {
      rejection_reason: 'Content needs improvement',
    };

    describe('Module rejection', () => {
      const mockModule = {
        id: 'module-1',
        title: 'Test Module',
        description: 'Test Description',
        status: ContentStatusEnum.UNDER_REVIEW,
        is_published: false,
        created_by: 'creator-1',
        reviewed_by: null,
        approved_by: null,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        published_at: null,
        metadata: {},
      };

      it('should reject module and set status to DRAFT', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(mockModule);
        mockModuleRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        const result = await service.rejectContent(
          'module-1',
          rejectionDto,
          'admin-1',
        );

        // Assert
        expect(result.content_type).toBe('module');
        expect(mockModuleRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            status: ContentStatusEnum.DRAFT,
            is_published: false,
            reviewed_by: 'admin-1',
          }),
        );
      });

      it('should add rejection reason to module metadata', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(mockModule);
        mockModuleRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        await service.rejectContent('module-1', rejectionDto, 'admin-1');

        // Assert
        expect(mockModuleRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            metadata: expect.objectContaining({
              rejection_reason: 'Content needs improvement',
              rejected_at: expect.any(String),
              rejected_by: 'admin-1',
            }),
          }),
        );
      });
    });

    describe('Exercise rejection', () => {
      const mockExercise = {
        id: 'exercise-1',
        title: 'Test Exercise',
        description: 'Test Description',
        is_active: false,
        created_by: 'creator-1',
        reviewed_by: null,
        version: 1,
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {},
      };

      it('should reject exercise and set is_active to false', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(null);
        mockExerciseRepo.findOne.mockResolvedValue(mockExercise);
        mockExerciseRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        const result = await service.rejectContent(
          'exercise-1',
          rejectionDto,
          'admin-1',
        );

        // Assert
        expect(result.content_type).toBe('exercise');
        expect(mockExerciseRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            is_active: false,
            reviewed_by: 'admin-1',
            metadata: expect.objectContaining({
              approved: false,
              rejection_reason: 'Content needs improvement',
            }),
          }),
        );
      });
    });

    describe('Template rejection', () => {
      const mockTemplate = {
        id: 'template-1',
        name: 'Test Template',
        description: 'Test Description',
        is_public: false,
        is_system_template: false,
        created_by: 'creator-1',
        created_at: new Date(),
        updated_at: new Date(),
        metadata: {},
      };

      it('should reject template and set is_public to false', async () => {
        // Arrange
        mockModuleRepo.findOne.mockResolvedValue(null);
        mockExerciseRepo.findOne.mockResolvedValue(null);
        mockTemplateRepo.findOne.mockResolvedValue(mockTemplate);
        mockTemplateRepo.save.mockImplementation((entity) =>
          Promise.resolve(entity),
        );

        // Act
        const result = await service.rejectContent(
          'template-1',
          rejectionDto,
          'admin-1',
        );

        // Assert
        expect(result.content_type).toBe('template');
        expect(mockTemplateRepo.save).toHaveBeenCalledWith(
          expect.objectContaining({
            is_public: false,
            metadata: expect.objectContaining({
              approved: false,
              rejection_reason: 'Content needs improvement',
            }),
          }),
        );
      });
    });

    it('should throw NotFoundException if content not found', async () => {
      // Arrange
      mockModuleRepo.findOne.mockResolvedValue(null);
      mockExerciseRepo.findOne.mockResolvedValue(null);
      mockTemplateRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.rejectContent('non-existent', rejectionDto, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMediaLibrary', () => {
    const mockMediaFiles = [
      {
        id: 'media-1',
        filename: 'image1.jpg',
        original_filename: 'photo.jpg',
        description: 'Test image',
        alt_text: 'A test photo',
        media_type: 'image',
        category: 'illustrations',
        uploaded_by: 'user-1',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 'media-2',
        filename: 'video1.mp4',
        original_filename: 'video.mp4',
        description: 'Test video',
        alt_text: null,
        media_type: 'video',
        category: 'educational',
        uploaded_by: 'user-2',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    beforeEach(() => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockMediaFiles,
        mockMediaFiles.length,
      ]);
    });

    it('should return media library with pagination', async () => {
      // Arrange
      const query: ListMediaDto = {};

      // Act
      const result = await service.getMediaLibrary(query);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should filter only active media files', async () => {
      // Arrange
      const query: ListMediaDto = {};

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'media.is_active = true',
      );
    });

    it('should filter by search term', async () => {
      // Arrange
      const query: ListMediaDto = { search: 'test' };

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalled();
    });

    it('should filter by media_type', async () => {
      // Arrange
      const query: ListMediaDto = { media_type: MediaTypeEnum.IMAGE };

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'media.media_type = :media_type',
        { media_type: 'image' },
      );
    });

    it('should filter by category', async () => {
      // Arrange
      const query: ListMediaDto = { category: 'illustrations' };

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'media.category = :category',
        { category: 'illustrations' },
      );
    });

    it('should filter by uploaded_by', async () => {
      // Arrange
      const query: ListMediaDto = { uploaded_by: 'user-1' };

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'media.uploaded_by = :uploaded_by',
        { uploaded_by: 'user-1' },
      );
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const query: ListMediaDto = { page: 3, limit: 15 };

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(30); // (3 - 1) * 15
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(15);
    });

    it('should order by created_at DESC', async () => {
      // Arrange
      const query: ListMediaDto = {};

      // Act
      await service.getMediaLibrary(query);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'media.created_at',
        'DESC',
      );
    });

    it('should return empty array when no media files found', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query: ListMediaDto = {};

      // Act
      const result = await service.getMediaLibrary(query);

      // Assert
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('deleteMediaFile', () => {
    const mockMediaFile = {
      id: 'media-1',
      filename: 'image1.jpg',
      original_filename: 'photo.jpg',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    it('should soft delete media file', async () => {
      // Arrange
      mockMediaFileRepo.findOne.mockResolvedValue(mockMediaFile);
      mockMediaFileRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.deleteMediaFile('media-1');

      // Assert
      expect(mockMediaFileRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'media-1' },
      });
      expect(mockMediaFileRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: false,
        }),
      );
    });

    it('should throw NotFoundException if media file not found', async () => {
      // Arrange
      mockMediaFileRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteMediaFile('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.deleteMediaFile('non-existent')).rejects.toThrow(
        'Media file non-existent not found',
      );
      expect(mockMediaFileRepo.save).not.toHaveBeenCalled();
    });

    it('should handle already deleted media file', async () => {
      // Arrange
      const deletedFile = { ...mockMediaFile, is_active: false };
      mockMediaFileRepo.findOne.mockResolvedValue(deletedFile);
      mockMediaFileRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.deleteMediaFile('media-1');

      // Assert
      expect(mockMediaFileRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          is_active: false,
        }),
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors in getPendingContent', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.getPendingContent({})).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle repository errors in getMediaLibrary', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.getMediaLibrary({})).rejects.toThrow(
        'Database error',
      );
    });
  });
});
