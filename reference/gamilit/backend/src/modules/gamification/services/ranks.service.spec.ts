import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RanksService } from './ranks.service';
import { UserRank } from '../entities';
import { UserStatsService } from './user-stats.service';
import { MLCoinsService } from './ml-coins.service';
import { MayaRank, TransactionTypeEnum } from '@shared/constants/enums.constants';
import { DB_SCHEMAS } from '@shared/constants/database.constants';

describe('RanksService', () => {
  let service: RanksService;
  let userRankRepo: Repository<UserRank>;
  let userStatsService: UserStatsService;
  let mlCoinsService: MLCoinsService;

  const mockUserRankRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockUserStatsService = {
    findByUserId: jest.fn(),
    updateStats: jest.fn(),
  };

  const mockMLCoinsService = {
    addCoins: jest.fn(),
  };

  const mockUserId = '550e8400-e29b-41d4-a716-446655440000';
  const mockTenantId = '660e8400-e29b-41d4-a716-446655440000';

  const mockCurrentRank: Partial<UserRank> = {
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

  const mockUserStats = {
    user_id: mockUserId,
    total_xp: 500,
    level: 5,
    current_rank: MayaRank.AJAW,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RanksService,
        {
          provide: getRepositoryToken(UserRank, 'gamification'),
          useValue: mockUserRankRepository,
        },
        {
          provide: UserStatsService,
          useValue: mockUserStatsService,
        },
        {
          provide: MLCoinsService,
          useValue: mockMLCoinsService,
        },
      ],
    }).compile();

    service = module.get<RanksService>(RanksService);
    userRankRepo = module.get(getRepositoryToken(UserRank, 'gamification'));
    userStatsService = module.get<UserStatsService>(UserStatsService);
    mlCoinsService = module.get<MLCoinsService>(MLCoinsService);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Definition', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });

  describe('getCurrentRank', () => {
    it('should return the current rank of a user', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);

      const result = await service.getCurrentRank(mockUserId);

      expect(result).toEqual(mockCurrentRank);
      expect(mockUserRankRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id: mockUserId,
          is_current: true,
        },
      });
    });

    it('should throw NotFoundException if user has no current rank', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(null);

      await expect(service.getCurrentRank(mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getCurrentRank(mockUserId)).rejects.toThrow(
        `No current rank found for user ${mockUserId}`,
      );
    });
  });

  describe('getUserRankHistory', () => {
    it('should return rank history ordered by date', async () => {
      const mockHistory = [
        { ...mockCurrentRank, current_rank: MayaRank.NACOM, is_current: true },
        { ...mockCurrentRank, current_rank: MayaRank.AJAW, is_current: false },
      ];
      mockUserRankRepository.find.mockResolvedValue(mockHistory);

      const result = await service.getUserRankHistory(mockUserId);

      expect(result).toEqual(mockHistory);
      expect(mockUserRankRepository.find).toHaveBeenCalledWith({
        where: { user_id: mockUserId },
        order: { achieved_at: 'DESC' },
      });
    });

    it('should return empty array if user has no rank history', async () => {
      mockUserRankRepository.find.mockResolvedValue([]);

      const result = await service.getUserRankHistory(mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('getRankConfig', () => {
    it('should return config for Ajaw rank', () => {
      const config = service.getRankConfig(MayaRank.AJAW);

      expect(config).toMatchObject({
        xp_min: 0,
        xp_max: 499,
        ml_coins_bonus: 0,
        next_rank: MayaRank.NACOM,
        name: 'Ajaw',
        order: 1,
      });
    });

    it('should return config for Nacom rank', () => {
      const config = service.getRankConfig(MayaRank.NACOM);

      expect(config).toMatchObject({
        xp_min: 500,
        xp_max: 999,
        ml_coins_bonus: 100,
        next_rank: MayaRank.AH_KIN,
        name: 'Nacom',
        order: 2,
      });
    });

    it('should return config for maximum rank (K\'uk\'ulkan)', () => {
      const config = service.getRankConfig(MayaRank.KUKUKULKAN);

      expect(config).toMatchObject({
        xp_min: 2250,
        xp_max: Infinity,
        ml_coins_bonus: 1000,
        next_rank: null,
        name: "K'uk'ulkan",
        order: 5,
      });
    });

    it('should throw BadRequestException for invalid rank', () => {
      expect(() => service.getRankConfig('invalid_rank' as MayaRank)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAllRanksConfig', () => {
    it('should return all ranks ordered by order field', () => {
      const configs = service.getAllRanksConfig();

      expect(configs).toHaveLength(5);
      expect(configs[0].order).toBe(1);
      expect(configs[0].name).toBe('Ajaw');
      expect(configs[4].order).toBe(5);
      expect(configs[4].name).toBe("K'uk'ulkan");
    });
  });

  describe('calculateRankProgress', () => {
    it('should calculate progress for user in Ajaw rank', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 250, // Mid-progress in Ajaw (xp_min: 0, xp_max: 499)
      });

      const result = await service.calculateRankProgress(mockUserId);

      expect(result).toMatchObject({
        current_rank: MayaRank.AJAW,
        next_rank: MayaRank.NACOM,
        xp_current: 250,
        xp_required: 500, // Nacom xp_min
        xp_remaining: 250, // 500 - 250
        ml_coins_bonus_on_promotion: 100, // Nacom bonus
        is_max_rank: false,
      });
      expect(result.progress_percentage).toBeGreaterThanOrEqual(0);
      expect(result.progress_percentage).toBeLessThanOrEqual(100);
    });

    it('should calculate progress for user ready to promote', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 1000,
      });

      const result = await service.calculateRankProgress(mockUserId);

      expect(result.xp_remaining).toBe(0);
      expect(result.progress_percentage).toBe(100);
    });

    it('should handle maximum rank (K\'uk\'ulkan)', async () => {
      mockUserRankRepository.findOne.mockResolvedValue({
        ...mockCurrentRank,
        current_rank: MayaRank.KUKUKULKAN,
      });
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 15000,
      });

      const result = await service.calculateRankProgress(mockUserId);

      expect(result).toMatchObject({
        current_rank: MayaRank.KUKUKULKAN,
        next_rank: null,
        progress_percentage: 100,
        xp_remaining: 0,
        ml_coins_bonus_on_promotion: 0,
        is_max_rank: true,
      });
    });
  });

  describe('checkPromotionEligibility', () => {
    it('should return true when user has enough XP', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 1000,
      });

      const result = await service.checkPromotionEligibility(mockUserId);

      expect(result).toBe(true);
    });

    it('should return false when user does not have enough XP', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 499, // Not enough XP for Nacom (xp_min: 500)
      });

      const result = await service.checkPromotionEligibility(mockUserId);

      expect(result).toBe(false);
    });

    it('should return false when user is at maximum rank', async () => {
      mockUserRankRepository.findOne.mockResolvedValue({
        ...mockCurrentRank,
        current_rank: MayaRank.KUKUKULKAN,
      });
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 20000,
      });

      const result = await service.checkPromotionEligibility(mockUserId);

      expect(result).toBe(false);
    });

    it('should return false on error', async () => {
      mockUserRankRepository.findOne.mockRejectedValue(
        new Error('Database error'),
      );

      const result = await service.checkPromotionEligibility(mockUserId);

      expect(result).toBe(false);
    });
  });

  describe('promoteToNextRank', () => {
    beforeEach(() => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 1000,
      });
      mockUserRankRepository.save.mockImplementation((entity) =>
        Promise.resolve({ ...entity, id: 'new-rank-id' }),
      );
      mockUserRankRepository.create.mockImplementation((dto) => ({ ...dto, id: 'new-rank-id' }));
      mockMLCoinsService.addCoins.mockResolvedValue({
        balance: 1500,
        transaction: {},
      });
      mockUserStatsService.updateStats.mockResolvedValue({});
    });

    it('should promote user to next rank', async () => {
      const result = await service.promoteToNextRank(mockUserId);

      expect(result.current_rank).toBe(MayaRank.NACOM);
      expect(result.previous_rank).toBe(MayaRank.AJAW);
      expect(result.is_current).toBe(true);
      expect(mockUserRankRepository.save).toHaveBeenCalledTimes(2); // Old rank + new rank
    });

    it('should award ML Coins bonus on promotion', async () => {
      await service.promoteToNextRank(mockUserId);

      expect(mockMLCoinsService.addCoins).toHaveBeenCalledWith(
        mockUserId,
        100, // Nacom bonus (actual rank config value)
        TransactionTypeEnum.EARNED_RANK,
        expect.stringContaining('Nacom'),
        expect.any(String),
        'user_rank',
      );
    });

    it('should update user stats with new rank', async () => {
      await service.promoteToNextRank(mockUserId);

      expect(mockUserStatsService.updateStats).toHaveBeenCalledWith(mockUserId, {
        current_rank: MayaRank.NACOM,
      });
    });

    it('should throw BadRequestException if not eligible', async () => {
      mockUserStatsService.findByUserId.mockResolvedValue({
        ...mockUserStats,
        total_xp: 499, // Not enough XP for Nacom (xp_min: 500)
      });

      await expect(service.promoteToNextRank(mockUserId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.promoteToNextRank(mockUserId)).rejects.toThrow(
        'is not eligible for promotion',
      );
    });

    it('should throw BadRequestException if already at max rank', async () => {
      mockUserRankRepository.findOne.mockResolvedValue({
        ...mockCurrentRank,
        current_rank: MayaRank.KUKUKULKAN,
      });
      // Mock de checkPromotionEligibility para que retorne false (max rank)
      jest.spyOn(service, 'checkPromotionEligibility').mockResolvedValue(false);

      await expect(service.promoteToNextRank(mockUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findById', () => {
    it('should return rank by ID', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);

      const result = await service.findById('rank-id-1');

      expect(result).toEqual(mockCurrentRank);
      expect(mockUserRankRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'rank-id-1' },
      });
    });

    it('should throw NotFoundException if rank not found', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createRank (Admin)', () => {
    const createDto = {
      user_id: mockUserId,
      tenant_id: mockTenantId,
      current_rank: MayaRank.NACOM,
      is_current: true,
    };

    beforeEach(() => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      mockUserRankRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockUserRankRepository.create.mockImplementation((dto) => dto);
      mockUserRankRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );
    });

    it('should create a new rank record', async () => {
      const result = await service.createRank(createDto as any);

      expect(mockUserRankRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockUserRankRepository.save).toHaveBeenCalled();
    });

    it('should mark other ranks as not current if is_current=true', async () => {
      await service.createRank(createDto as any);

      expect(mockUserRankRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('updateRank (Admin)', () => {
    const updateDto = {
      rank_progress_percentage: 75,
      ml_coins_bonus: 1000,
    };

    beforeEach(() => {
      const mockQueryBuilder = {
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({ affected: 1 }),
      };
      mockUserRankRepository.createQueryBuilder.mockReturnValue(
        mockQueryBuilder,
      );
      mockUserRankRepository.findOne.mockResolvedValue(mockCurrentRank);
      mockUserRankRepository.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );
    });

    it('should update an existing rank record', async () => {
      const result = await service.updateRank('rank-id-1', updateDto);

      expect(mockUserRankRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'rank-id-1' },
      });
      expect(mockUserRankRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if rank not found', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(null);

      await expect(service.updateRank('invalid-id', updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update is_current flag if requested', async () => {
      const updateWithCurrent = { ...updateDto, is_current: true };

      await service.updateRank('rank-id-1', updateWithCurrent);

      expect(mockUserRankRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('deleteRank (Admin)', () => {
    it('should delete a rank record', async () => {
      mockUserRankRepository.findOne.mockResolvedValue({
        ...mockCurrentRank,
        is_current: false,
      });
      mockUserRankRepository.delete.mockResolvedValue({ affected: 1 });

      await service.deleteRank('rank-id-1');

      expect(mockUserRankRepository.delete).toHaveBeenCalledWith({
        id: 'rank-id-1',
      });
    });

    it('should throw NotFoundException if rank not found', async () => {
      mockUserRankRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteRank('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if trying to delete current rank', async () => {
      mockUserRankRepository.findOne.mockResolvedValue({
        ...mockCurrentRank,
        is_current: true,
      });

      await expect(service.deleteRank('rank-id-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.deleteRank('rank-id-1')).rejects.toThrow(
        'Cannot delete current rank',
      );
    });
  });
});
