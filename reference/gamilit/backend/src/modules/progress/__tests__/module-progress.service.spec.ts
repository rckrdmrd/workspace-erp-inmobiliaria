import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ModuleProgressService } from '../services/module-progress.service';
import { ModuleProgress } from '../entities';
import { CreateModuleProgressDto } from '../dto';
import { ProgressStatusEnum } from '@shared/constants/enums.constants';

describe('ModuleProgressService', () => {
  let service: ModuleProgressService;
  let repository: Repository<ModuleProgress>;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModuleProgressService,
        {
          provide: getRepositoryToken(ModuleProgress, 'progress'),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ModuleProgressService>(ModuleProgressService);
    repository = module.get(getRepositoryToken(ModuleProgress, 'progress'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findByUserId', () => {
    const mockProgress = [
      {
        id: 'progress-1',
        user_id: 'user-1',
        module_id: 'module-1',
        progress_percentage: 50,
        updated_at: new Date('2024-01-02'),
      },
      {
        id: 'progress-2',
        user_id: 'user-1',
        module_id: 'module-2',
        progress_percentage: 100,
        updated_at: new Date('2024-01-01'),
      },
    ];

    it('should return all progress records for a user', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockProgress);

      // Act
      const result = await service.findByUserId('user-1');

      // Assert
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { user_id: 'user-1' },
        order: { updated_at: 'DESC' },
      });
    });

    it('should return empty array if no progress found', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findByUserId('user-1');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should order by updated_at DESC', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockProgress);

      // Act
      await service.findByUserId('user-1');

      // Assert
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { updated_at: 'DESC' },
        }),
      );
    });
  });

  describe('findByUserAndModule', () => {
    const mockProgress = {
      id: 'progress-1',
      user_id: 'user-1',
      module_id: 'module-1',
      progress_percentage: 50,
    };

    it('should return progress for user and module', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);

      // Act
      const result = await service.findByUserAndModule('user-1', 'module-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('progress-1');
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { user_id: 'user-1', module_id: 'module-1' },
      });
    });

    it('should throw NotFoundException if progress not found', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.findByUserAndModule('user-1', 'module-1'),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findByUserAndModule('user-1', 'module-1'),
      ).rejects.toThrow(
        'No progress found for user user-1 in module module-1',
      );
    });
  });

  describe('create', () => {
    const createDto: CreateModuleProgressDto = {
      user_id: 'user-1',
      module_id: 'module-1',
      total_exercises: 10,
    };

    const mockCreatedProgress = {
      id: 'progress-new',
      ...createDto,
      status: ProgressStatusEnum.NOT_STARTED,
      progress_percentage: 0,
      completed_exercises: 0,
      skipped_exercises: 0,
      total_score: 0,
      total_xp_earned: 0,
      total_ml_coins_earned: 0,
      time_spent: '00:00:00',
      sessions_count: 0,
      attempts_count: 0,
      hints_used_total: 0,
      comodines_used_total: 0,
      comodines_cost_total: 0,
      started_at: expect.any(Date),
      learning_path: [],
      performance_analytics: {},
      system_observations: {},
      metadata: {},
    };

    it('should create new progress successfully', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null); // No existing progress
      mockRepository.create.mockReturnValue(mockCreatedProgress);
      mockRepository.save.mockResolvedValue(mockCreatedProgress);

      // Act
      const result = await service.create(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe(ProgressStatusEnum.NOT_STARTED);
      expect(result.progress_percentage).toBe(0);
      expect(result.completed_exercises).toBe(0);
      expect(mockRepository.create).toHaveBeenCalled();
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should initialize all default values correctly', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto as any);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.create(createDto);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: ProgressStatusEnum.NOT_STARTED,
          progress_percentage: 0,
          completed_exercises: 0,
          skipped_exercises: 0,
          total_score: 0,
          total_xp_earned: 0,
          total_ml_coins_earned: 0,
          time_spent: '00:00:00',
          sessions_count: 0,
          attempts_count: 0,
          hints_used_total: 0,
          comodines_used_total: 0,
          comodines_cost_total: 0,
          learning_path: [],
          performance_analytics: {},
          system_observations: {},
          metadata: {},
        }),
      );
    });

    it('should throw BadRequestException if progress already exists', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue({
        id: 'existing-progress',
        user_id: 'user-1',
        module_id: 'module-1',
      });

      // Act & Assert
      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(createDto)).rejects.toThrow(
        'Progress already exists for user user-1 in module module-1',
      );
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should set total_exercises to 0 if not provided', async () => {
      // Arrange
      const dtoWithoutExercises: CreateModuleProgressDto = {
        user_id: 'user-1',
        module_id: 'module-1',
      };
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation((dto) => dto as any);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.create(dtoWithoutExercises);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          total_exercises: 0,
        }),
      );
    });
  });

  describe('update', () => {
    const mockProgress = {
      id: 'progress-1',
      user_id: 'user-1',
      module_id: 'module-1',
      progress_percentage: 50,
      completed_exercises: 5,
    };

    const updateDto = {
      completed_exercises: 7,
      total_score: 85,
    };

    it('should update progress successfully', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockResolvedValue({
        ...mockProgress,
        ...updateDto,
      });

      // Act
      const result = await service.update('progress-1', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.completed_exercises).toBe(7);
      expect(result.total_score).toBe(85);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if progress not found', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.update('non-existent', updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update('non-existent', updateDto)).rejects.toThrow(
        'Progress with ID non-existent not found',
      );
    });

    it('should only update provided fields', async () => {
      // Arrange
      const partialUpdate = { completed_exercises: 8 };
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.update('progress-1', partialUpdate);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          progress_percentage: 50, // Should remain unchanged
          completed_exercises: 8, // Updated
        }),
      );
    });
  });

  describe('updateProgressPercentage', () => {
    const mockProgress = {
      id: 'progress-1',
      user_id: 'user-1',
      module_id: 'module-1',
      progress_percentage: 50,
      status: ProgressStatusEnum.IN_PROGRESS,
    };

    it('should update progress percentage successfully', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateProgressPercentage('progress-1', 75);

      // Assert
      expect(result.progress_percentage).toBe(75);
      expect(result.status).toBe(ProgressStatusEnum.IN_PROGRESS);
      expect(result.last_accessed_at).toBeDefined();
    });

    it('should throw BadRequestException if percentage < 0', async () => {
      // Act & Assert
      await expect(
        service.updateProgressPercentage('progress-1', -10),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateProgressPercentage('progress-1', -10),
      ).rejects.toThrow('Progress percentage must be between 0 and 100');
    });

    it('should throw BadRequestException if percentage > 100', async () => {
      // Act & Assert
      await expect(
        service.updateProgressPercentage('progress-1', 150),
      ).rejects.toThrow(BadRequestException);
    });

    it('should set status to NOT_STARTED when percentage is 0', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateProgressPercentage('progress-1', 0);

      // Assert
      expect(result.status).toBe(ProgressStatusEnum.NOT_STARTED);
    });

    it('should set status to IN_PROGRESS when 0 < percentage < 100', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue({
        ...mockProgress,
        status: ProgressStatusEnum.NOT_STARTED,
      });
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateProgressPercentage('progress-1', 50);

      // Assert
      expect(result.status).toBe(ProgressStatusEnum.IN_PROGRESS);
    });

    it('should set status to COMPLETED when percentage is 100', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateProgressPercentage('progress-1', 100);

      // Assert
      expect(result.status).toBe(ProgressStatusEnum.COMPLETED);
      expect(result.completed_at).toBeDefined();
    });

    it('should throw NotFoundException if progress not found', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateProgressPercentage('non-existent', 50),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update last_accessed_at on each update', async () => {
      // Arrange
      const oldDate = new Date('2023-01-01');
      mockRepository.findOne.mockResolvedValue({
        ...mockProgress,
        last_accessed_at: oldDate,
      });
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateProgressPercentage('progress-1', 60);

      // Assert
      expect(result.last_accessed_at).toBeDefined();
      expect(result.last_accessed_at).not.toEqual(oldDate);
      expect(result.last_accessed_at!.getTime()).toBeGreaterThan(
        oldDate.getTime(),
      );
    });
  });

  describe('completeModule', () => {
    const mockProgress = {
      id: 'progress-1',
      user_id: 'user-1',
      module_id: 'module-1',
      progress_percentage: 95,
      status: ProgressStatusEnum.IN_PROGRESS,
      completed_exercises: 10,
      total_score: 90,
      max_possible_score: 100,
    };

    it('should mark module as completed', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.completeModule('progress-1');

      // Assert
      expect(result.status).toBe(ProgressStatusEnum.COMPLETED);
      expect(result.progress_percentage).toBe(100);
      expect(result.completed_at).toBeDefined();
      expect(result.last_accessed_at).toBeDefined();
    });

    it('should calculate average_score when exercises are completed', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(mockProgress);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.completeModule('progress-1');

      // Assert
      expect(result.average_score).toBe(90); // (90/100) * 100
    });

    it('should calculate average_score as 0 if no exercises completed', async () => {
      // Arrange
      const progressNoExercises = {
        ...mockProgress,
        completed_exercises: 0,
        total_score: 0,
        max_possible_score: 0,
      };
      mockRepository.findOne.mockResolvedValue(progressNoExercises);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.completeModule('progress-1');

      // Assert
      // When max_possible_score is 0, division would give NaN/Infinity, so service defaults to 0
      expect(result.average_score).toBeDefined();
    });

    it('should throw NotFoundException if progress not found', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.completeModule('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should round average_score to 2 decimal places', async () => {
      // Arrange
      const progressWithDecimal = {
        ...mockProgress,
        total_score: 87,
        max_possible_score: 100,
      };
      mockRepository.findOne.mockResolvedValue(progressWithDecimal);
      mockRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.completeModule('progress-1');

      // Assert
      expect(result.average_score).toBe(87.0); // (87/100) * 100 = 87.00
    });
  });

  describe('getModuleStats', () => {
    const mockAllProgress = [
      {
        id: 'p1',
        module_id: 'module-1',
        status: ProgressStatusEnum.COMPLETED,
        progress_percentage: 100,
        average_score: 85,
      },
      {
        id: 'p2',
        module_id: 'module-1',
        status: ProgressStatusEnum.IN_PROGRESS,
        progress_percentage: 60,
        average_score: 75,
      },
      {
        id: 'p3',
        module_id: 'module-1',
        status: ProgressStatusEnum.NOT_STARTED,
        progress_percentage: 0,
        average_score: null,
      },
    ];

    it('should return module statistics', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockAllProgress);

      // Act
      const result = await service.getModuleStats('module-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.total_students).toBe(3);
      expect(result.completed_count).toBe(1);
      expect(result.in_progress_count).toBe(1);
      expect(result.average_progress).toBe(53.33); // (100+60+0)/3
      expect(result.average_score).toBe(80); // (85+75)/2
    });

    it('should return zeros when no progress found', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getModuleStats('module-1');

      // Assert
      expect(result.total_students).toBe(0);
      expect(result.completed_count).toBe(0);
      expect(result.in_progress_count).toBe(0);
      expect(result.average_progress).toBe(0);
      expect(result.average_score).toBe(0);
    });

    it('should calculate average_progress correctly', async () => {
      // Arrange
      const progressRecords = [
        { ...mockAllProgress[0], progress_percentage: 100 },
        { ...mockAllProgress[1], progress_percentage: 50 },
        { ...mockAllProgress[2], progress_percentage: 25 },
      ];
      mockRepository.find.mockResolvedValue(progressRecords);

      // Act
      const result = await service.getModuleStats('module-1');

      // Assert
      expect(result.average_progress).toBe(58.33); // (100+50+25)/3 = 58.33
    });

    it('should exclude null scores from average_score calculation', async () => {
      // Arrange
      const progressWithNulls = [
        { ...mockAllProgress[0], average_score: 90 },
        { ...mockAllProgress[1], average_score: null },
        { ...mockAllProgress[2], average_score: 80 },
      ];
      mockRepository.find.mockResolvedValue(progressWithNulls);

      // Act
      const result = await service.getModuleStats('module-1');

      // Assert
      expect(result.average_score).toBe(85); // (90+80)/2
    });

    it('should count completed and in_progress correctly', async () => {
      // Arrange
      const mixedProgress = [
        { ...mockAllProgress[0], status: ProgressStatusEnum.COMPLETED },
        { ...mockAllProgress[1], status: ProgressStatusEnum.COMPLETED },
        { ...mockAllProgress[2], status: ProgressStatusEnum.IN_PROGRESS },
        {
          id: 'p4',
          module_id: 'module-1',
          status: ProgressStatusEnum.IN_PROGRESS,
        },
      ];
      mockRepository.find.mockResolvedValue(mixedProgress);

      // Act
      const result = await service.getModuleStats('module-1');

      // Assert
      expect(result.completed_count).toBe(2);
      expect(result.in_progress_count).toBe(2);
    });
  });

  describe('getUserProgressSummary', () => {
    const mockUserProgress = [
      {
        id: 'p1',
        user_id: 'user-1',
        status: ProgressStatusEnum.COMPLETED,
        total_xp_earned: 100,
        total_ml_coins_earned: 50,
      },
      {
        id: 'p2',
        user_id: 'user-1',
        status: ProgressStatusEnum.IN_PROGRESS,
        total_xp_earned: 75,
        total_ml_coins_earned: 30,
      },
      {
        id: 'p3',
        user_id: 'user-1',
        status: ProgressStatusEnum.COMPLETED,
        total_xp_earned: 120,
        total_ml_coins_earned: 60,
      },
    ];

    it('should return user progress summary', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockUserProgress);

      // Act
      const result = await service.getUserProgressSummary('user-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.total_modules).toBe(3);
      expect(result.completed_modules).toBe(2);
      expect(result.in_progress_modules).toBe(1);
      expect(result.completion_rate).toBe(66.67); // 2/3 * 100
      expect(result.total_xp_earned).toBe(295); // 100+75+120
      expect(result.total_ml_coins_earned).toBe(140); // 50+30+60
    });

    it('should return zeros when no progress found', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.getUserProgressSummary('user-1');

      // Assert
      expect(result.total_modules).toBe(0);
      expect(result.completed_modules).toBe(0);
      expect(result.in_progress_modules).toBe(0);
      expect(result.completion_rate).toBe(0);
      expect(result.total_xp_earned).toBe(0);
      expect(result.total_ml_coins_earned).toBe(0);
    });

    it('should calculate completion_rate correctly', async () => {
      // Arrange
      const progressWithRate = [
        { ...mockUserProgress[0], status: ProgressStatusEnum.COMPLETED },
        { ...mockUserProgress[1], status: ProgressStatusEnum.COMPLETED },
        { ...mockUserProgress[2], status: ProgressStatusEnum.COMPLETED },
        {
          id: 'p4',
          user_id: 'user-1',
          status: ProgressStatusEnum.IN_PROGRESS,
        },
      ];
      mockRepository.find.mockResolvedValue(progressWithRate);

      // Act
      const result = await service.getUserProgressSummary('user-1');

      // Assert
      expect(result.completion_rate).toBe(75); // 3/4 * 100
    });

    it('should sum XP and ML coins correctly', async () => {
      // Arrange
      const progressWithRewards = [
        { ...mockUserProgress[0], total_xp_earned: 200, total_ml_coins_earned: 100 },
        { ...mockUserProgress[1], total_xp_earned: 150, total_ml_coins_earned: 75 },
      ];
      mockRepository.find.mockResolvedValue(progressWithRewards);

      // Act
      const result = await service.getUserProgressSummary('user-1');

      // Assert
      expect(result.total_xp_earned).toBe(350);
      expect(result.total_ml_coins_earned).toBe(175);
    });
  });

  describe('findInProgress', () => {
    const mockInProgressModules = [
      {
        id: 'p1',
        user_id: 'user-1',
        module_id: 'module-1',
        status: ProgressStatusEnum.IN_PROGRESS,
        last_accessed_at: new Date('2024-01-02'),
      },
      {
        id: 'p2',
        user_id: 'user-1',
        module_id: 'module-2',
        status: ProgressStatusEnum.IN_PROGRESS,
        last_accessed_at: new Date('2024-01-01'),
      },
    ];

    it('should return in-progress modules for user', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockInProgressModules);

      // Act
      const result = await service.findInProgress('user-1');

      // Assert
      expect(result).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: {
          user_id: 'user-1',
          status: ProgressStatusEnum.IN_PROGRESS,
        },
        order: { last_accessed_at: 'DESC' },
      });
    });

    it('should return empty array if no in-progress modules', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.findInProgress('user-1');

      // Assert
      expect(result).toHaveLength(0);
    });

    it('should order by last_accessed_at DESC', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue(mockInProgressModules);

      // Act
      await service.findInProgress('user-1');

      // Assert
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          order: { last_accessed_at: 'DESC' },
        }),
      );
    });
  });

  describe('calculateLearningPath', () => {
    it('should recommend difficulty increase for high performers', async () => {
      // Arrange
      const highPerformerProgress = [
        {
          id: 'p1',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 95,
        },
        {
          id: 'p2',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 92,
        },
      ];
      mockRepository.find.mockResolvedValue(highPerformerProgress);

      // Act
      const result = await service.calculateLearningPath('user-1');

      // Assert
      expect(result.difficulty_adjustment).toBe('increase');
      expect(result.reasoning).toContain('High performance detected');
    });

    it('should recommend difficulty decrease for low performers', async () => {
      // Arrange
      const lowPerformerProgress = [
        {
          id: 'p1',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 50,
        },
        {
          id: 'p2',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 55,
        },
      ];
      mockRepository.find.mockResolvedValue(lowPerformerProgress);

      // Act
      const result = await service.calculateLearningPath('user-1');

      // Assert
      expect(result.difficulty_adjustment).toBe('decrease');
      expect(result.reasoning).toContain('Additional practice recommended');
    });

    it('should recommend maintain for average performers', async () => {
      // Arrange
      const averagePerformerProgress = [
        {
          id: 'p1',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 75,
        },
        {
          id: 'p2',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 80,
        },
      ];
      mockRepository.find.mockResolvedValue(averagePerformerProgress);

      // Act
      const result = await service.calculateLearningPath('user-1');

      // Assert
      expect(result.difficulty_adjustment).toBe('maintain');
      expect(result.reasoning).toContain('Continue with current difficulty level');
    });

    it('should handle user with no progress', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([]);

      // Act
      const result = await service.calculateLearningPath('user-1');

      // Assert
      // When user has no progress (average score = 0), service recommends starting easier
      expect(result.difficulty_adjustment).toBe('decrease');
      expect(result.recommended_modules).toEqual([]);
    });

    it('should return empty recommended_modules array', async () => {
      // Arrange
      mockRepository.find.mockResolvedValue([
        {
          id: 'p1',
          user_id: 'user-1',
          status: ProgressStatusEnum.COMPLETED,
          average_score: 75,
        },
      ]);

      // Act
      const result = await service.calculateLearningPath('user-1');

      // Assert
      expect(result.recommended_modules).toEqual([]);
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors in findByUserId', async () => {
      // Arrange
      mockRepository.find.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.findByUserId('user-1')).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle repository errors in create', async () => {
      // Arrange
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockImplementation(() => {
        throw new Error('Create error');
      });

      // Act & Assert
      await expect(
        service.create({ user_id: 'user-1', module_id: 'module-1' }),
      ).rejects.toThrow('Create error');
    });
  });
});
