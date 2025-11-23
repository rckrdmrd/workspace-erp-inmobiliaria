import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RanksController } from './ranks.controller';
import { RanksService } from '../services/ranks.service';
import { UserRank } from '../entities';
import { MayaRank } from '@shared/constants/enums.constants';
import { CreateUserRankDto, UpdateUserRankDto } from '../dto/user-ranks';

describe('RanksController', () => {
  let controller: RanksController;
  let ranksService: RanksService;

  const mockRanksService = {
    getCurrentRank: jest.fn(),
    getUserRankHistory: jest.fn(),
    calculateRankProgress: jest.fn(),
    getAllRanksConfig: jest.fn(),
    findById: jest.fn(),
    createRank: jest.fn(),
    updateRank: jest.fn(),
    deleteRank: jest.fn(),
    getRankConfig: jest.fn(),
  };

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTenantId = '660e8400-e29b-41d4-a716-446655440000';

  const mockUserRank: Partial<UserRank> = {
    id: 'rank-id-1',
    user_id: mockUserId,
    tenant_id: mockTenantId,
    current_rank: MayaRank.AJAW,
    previous_rank: undefined,
    rank_progress_percentage: 50,
    xp_earned_for_rank: 500,
    ml_coins_bonus: 0,
    is_current: true,
    achieved_at: new Date('2024-01-01'),
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
  };

  const mockRankProgress = {
    current_rank: MayaRank.AJAW,
    next_rank: MayaRank.NACOM,
    progress_percentage: 50,
    xp_current: 500,
    xp_required: 1000,
    xp_remaining: 500,
    ml_coins_bonus_on_promotion: 500,
    is_max_rank: false,
  };

  const mockRankConfig = {
    xp_min: 0,
    xp_max: 999,
    ml_coins_bonus: 0,
    next_rank: MayaRank.NACOM,
    name: 'Ajaw',
    description: 'Señor - Nivel inicial',
    order: 1,
  };

  const mockRequest = {
    user: {
      sub: mockUserId,
      email: 'test@example.com',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RanksController],
      providers: [
        {
          provide: RanksService,
          useValue: mockRanksService,
        },
      ],
    }).compile();

    controller = module.get<RanksController>(RanksController);
    ranksService = module.get<RanksService>(RanksService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Controller Definition', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('GET /ranks - listRanks', () => {
    it('should return list of all ranks with metadata', async () => {
      const mockConfigs = [
        mockRankConfig,
        {
          xp_min: 1000,
          xp_max: 2999,
          ml_coins_bonus: 500,
          next_rank: MayaRank.AH_KIN,
          name: 'Nacom',
          description: 'Capitán de Guerra',
          order: 2,
        },
      ];
      mockRanksService.getAllRanksConfig.mockReturnValue(mockConfigs);

      const result = await controller.listRanks();

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        rank: 'Ajaw',
        name: 'Ajaw',
        xp_min: 0,
        xp_max: 999,
        ml_coins_bonus: 0,
        order: 1,
      });
      expect(mockRanksService.getAllRanksConfig).toHaveBeenCalled();
    });

    it('should handle Infinity xp_max by returning -1', async () => {
      const maxRankConfig = {
        ...mockRankConfig,
        xp_max: Infinity,
        name: "K'uk'ulkan",
        order: 5,
      };
      mockRanksService.getAllRanksConfig.mockReturnValue([maxRankConfig]);

      const result = await controller.listRanks();

      expect(result[0].xp_max).toBe(-1);
    });
  });

  describe('GET /ranks/current - getCurrentRank', () => {
    it('should return current rank for authenticated user', async () => {
      mockRanksService.getCurrentRank.mockResolvedValue(mockUserRank);

      const result = await controller.getCurrentRank(mockRequest);

      expect(result).toEqual(mockUserRank);
      expect(mockRanksService.getCurrentRank).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw NotFoundException if user has no rank', async () => {
      mockRanksService.getCurrentRank.mockRejectedValue(
        new NotFoundException('No current rank found'),
      );

      await expect(controller.getCurrentRank(mockRequest)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /ranks/:id - getRankDetails', () => {
    it('should return details of a rank by ID', async () => {
      mockRanksService.findById.mockResolvedValue(mockUserRank);

      const result = await controller.getRankDetails('rank-id-1');

      expect(result).toEqual(mockUserRank);
      expect(mockRanksService.findById).toHaveBeenCalledWith('rank-id-1');
    });

    it('should throw NotFoundException for invalid rank ID', async () => {
      mockRanksService.findById.mockRejectedValue(
        new NotFoundException('Rank record not found'),
      );

      await expect(controller.getRankDetails('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('GET /users/:userId/rank-progress - getUserRankProgress', () => {
    it('should return rank progress for user', async () => {
      mockRanksService.calculateRankProgress.mockResolvedValue(
        mockRankProgress,
      );

      const result = await controller.getUserRankProgress(mockUserId);

      expect(result).toEqual(mockRankProgress);
      expect(mockRanksService.calculateRankProgress).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should handle user at maximum rank', async () => {
      const maxRankProgress = {
        ...mockRankProgress,
        current_rank: MayaRank.KUKUKULKAN,
        next_rank: null,
        progress_percentage: 100,
        is_max_rank: true,
      };
      mockRanksService.calculateRankProgress.mockResolvedValue(maxRankProgress);

      const result = await controller.getUserRankProgress(mockUserId);

      expect(result.is_max_rank).toBe(true);
      expect(result.next_rank).toBeNull();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRanksService.calculateRankProgress.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(
        controller.getUserRankProgress('invalid-user'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET /users/:userId/rank-history - getUserRankHistory', () => {
    it('should return rank history for user', async () => {
      const mockHistory = [
        {
          ...mockUserRank,
          current_rank: MayaRank.NACOM,
          is_current: true,
        },
        {
          ...mockUserRank,
          id: 'rank-id-2',
          current_rank: MayaRank.AJAW,
          is_current: false,
        },
      ];
      mockRanksService.getUserRankHistory.mockResolvedValue(mockHistory);

      const result = await controller.getUserRankHistory(mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0].current_rank).toBe(MayaRank.NACOM);
      expect(mockRanksService.getUserRankHistory).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should return empty array if user has no history', async () => {
      mockRanksService.getUserRankHistory.mockResolvedValue([]);

      const result = await controller.getUserRankHistory(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('POST /admin/ranks - createRank', () => {
    const createDto: CreateUserRankDto = {
      user_id: mockUserId,
      tenant_id: mockTenantId,
      current_rank: MayaRank.NACOM,
      is_current: true,
    } as any;

    it('should create a new rank record (admin)', async () => {
      const newRank = {
        ...mockUserRank,
        current_rank: MayaRank.NACOM,
      };
      mockRanksService.createRank.mockResolvedValue(newRank);

      const result = await controller.createRank(createDto);

      expect(result).toEqual(newRank);
      expect(mockRanksService.createRank).toHaveBeenCalledWith(createDto);
    });

    it('should handle validation errors', async () => {
      mockRanksService.createRank.mockRejectedValue(
        new BadRequestException('Invalid rank data'),
      );

      await expect(controller.createRank(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('PUT /admin/ranks/:id - updateRank', () => {
    const updateDto: UpdateUserRankDto = {
      rank_progress_percentage: 75,
      ml_coins_bonus: 1000,
    };

    it('should update an existing rank record (admin)', async () => {
      const updatedRank = {
        ...mockUserRank,
        rank_progress_percentage: 75,
        ml_coins_bonus: 1000,
      };
      mockRanksService.updateRank.mockResolvedValue(updatedRank);

      const result = await controller.updateRank('rank-id-1', updateDto);

      expect(result).toEqual(updatedRank);
      expect(mockRanksService.updateRank).toHaveBeenCalledWith(
        'rank-id-1',
        updateDto,
      );
    });

    it('should throw NotFoundException for invalid rank ID', async () => {
      mockRanksService.updateRank.mockRejectedValue(
        new NotFoundException('Rank record not found'),
      );

      await expect(
        controller.updateRank('invalid-id', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle updating is_current flag', async () => {
      const updateWithCurrent = { ...updateDto, is_current: true };
      const updatedRank = {
        ...mockUserRank,
        ...updateWithCurrent,
      };
      mockRanksService.updateRank.mockResolvedValue(updatedRank);

      const result = await controller.updateRank('rank-id-1', updateWithCurrent);

      expect(result.is_current).toBe(true);
    });
  });

  describe('DELETE /admin/ranks/:id - deleteRank', () => {
    it('should delete a rank record (admin)', async () => {
      mockRanksService.deleteRank.mockResolvedValue(undefined);

      await controller.deleteRank('rank-id-1');

      expect(mockRanksService.deleteRank).toHaveBeenCalledWith('rank-id-1');
    });

    it('should throw NotFoundException for invalid rank ID', async () => {
      mockRanksService.deleteRank.mockRejectedValue(
        new NotFoundException('Rank record not found'),
      );

      await expect(controller.deleteRank('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException when trying to delete current rank', async () => {
      mockRanksService.deleteRank.mockRejectedValue(
        new BadRequestException('Cannot delete current rank'),
      );

      await expect(controller.deleteRank('rank-id-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.deleteRank('rank-id-1')).rejects.toThrow(
        'Cannot delete current rank',
      );
    });
  });

  describe('Error Handling', () => {
    it('should propagate service errors', async () => {
      mockRanksService.getCurrentRank.mockRejectedValue(
        new Error('Database connection error'),
      );

      await expect(controller.getCurrentRank(mockRequest)).rejects.toThrow(
        Error,
      );
    });

    it('should handle null/undefined user in request', async () => {
      const invalidRequest = { user: null };

      await expect(
        controller.getCurrentRank(invalidRequest as any),
      ).rejects.toThrow();
    });
  });

  describe('Data Transformation', () => {
    it('should transform rank config correctly for API response', async () => {
      const configs = [mockRankConfig];
      mockRanksService.getAllRanksConfig.mockReturnValue(configs);

      const result = await controller.listRanks();

      expect(result[0]).toMatchObject({
        rank: 'Ajaw',
        name: 'Ajaw',
        description: 'Señor - Nivel inicial',
        xp_min: 0,
        xp_max: 999,
        ml_coins_bonus: 0,
        order: 1,
      });
    });

    it('should preserve all fields from service response', async () => {
      mockRanksService.getCurrentRank.mockResolvedValue(mockUserRank);

      const result = await controller.getCurrentRank(mockRequest);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('user_id');
      expect(result).toHaveProperty('current_rank');
      expect(result).toHaveProperty('is_current');
      expect(result).toHaveProperty('achieved_at');
    });
  });
});
