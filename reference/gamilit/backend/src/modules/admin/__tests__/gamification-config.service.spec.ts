import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { GamificationConfigService } from '../services/gamification-config.service';
import { SystemSetting } from '../entities/system-setting.entity';
import {
  UpdateGamificationSettingsDto,
  PreviewImpactDto,
} from '../dto/gamification-config';

describe('GamificationConfigService', () => {
  let service: GamificationConfigService;
  let systemSettingRepository: Repository<SystemSetting>;

  const mockSystemSettingRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamificationConfigService,
        {
          provide: getRepositoryToken(SystemSetting, 'auth'),
          useValue: mockSystemSettingRepository,
        },
      ],
    }).compile();

    service = module.get<GamificationConfigService>(
      GamificationConfigService,
    );
    systemSettingRepository = module.get(
      getRepositoryToken(SystemSetting, 'auth'),
    );

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getGamificationSettings', () => {
    const mockSettings: Partial<SystemSetting>[] = [
      {
        setting_key: 'gamification.xp.base_per_exercise',
        setting_category: 'gamification',
        setting_subcategory: 'xp',
        setting_value: '10',
        value_type: 'number',
        default_value: '10',
        updated_at: new Date('2025-11-11T20:00:00.000Z'),
        updated_by: 'admin-1',
      },
      {
        setting_key: 'gamification.xp.completion_multiplier',
        setting_category: 'gamification',
        setting_subcategory: 'xp',
        setting_value: '1.5',
        value_type: 'number',
        default_value: '1.5',
        updated_at: new Date('2025-11-11T20:00:00.000Z'),
      },
      {
        setting_key: 'gamification.ranks.thresholds',
        setting_category: 'gamification',
        setting_subcategory: 'ranks',
        setting_value: JSON.stringify({
          novice: 0,
          beginner: 100,
          intermediate: 500,
          advanced: 1500,
          expert: 5000,
        }),
        value_type: 'json',
        default_value: JSON.stringify({
          novice: 0,
          beginner: 100,
          intermediate: 500,
          advanced: 1500,
          expert: 5000,
        }),
        updated_at: new Date('2025-11-11T19:00:00.000Z'),
      },
      {
        setting_key: 'gamification.coins.welcome_bonus',
        setting_category: 'gamification',
        setting_subcategory: 'coins',
        setting_value: '500',
        value_type: 'number',
        default_value: '500',
        updated_at: new Date('2025-11-11T18:00:00.000Z'),
      },
    ];

    it('should return settings when they exist', async () => {
      // Arrange
      mockSystemSettingRepository.count.mockResolvedValue(4);
      mockSystemSettingRepository.find.mockResolvedValue(
        mockSettings as SystemSetting[],
      );

      // Act
      const result = await service.getGamificationSettings();

      // Assert
      expect(result).toHaveProperty('xp');
      expect(result).toHaveProperty('ranks');
      expect(result).toHaveProperty('coins');
      expect(result).toHaveProperty('defaults');
      expect(result.xp.base_per_exercise).toBe(10);
      expect(result.xp.completion_multiplier).toBe(1.5);
      expect(result.ranks.novice).toBe(0);
      expect(result.ranks.expert).toBe(5000);
      expect(result.coins.welcome_bonus).toBe(500);
      expect(result.last_updated).toBe('2025-11-11T20:00:00.000Z');
      expect(result.updated_by).toBe('admin-1');
    });

    it('should create defaults if settings do not exist', async () => {
      // Arrange
      mockSystemSettingRepository.count.mockResolvedValue(0);
      mockSystemSettingRepository.save.mockResolvedValue({});
      mockSystemSettingRepository.find.mockResolvedValue(
        mockSettings as SystemSetting[],
      );

      // Act
      await service.getGamificationSettings();

      // Assert
      expect(mockSystemSettingRepository.save).toHaveBeenCalledWith(
        expect.any(Array),
      );
      expect(mockSystemSettingRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should parse JSON settings correctly', async () => {
      // Arrange
      mockSystemSettingRepository.count.mockResolvedValue(1);
      mockSystemSettingRepository.find.mockResolvedValue([
        mockSettings[2],
      ] as SystemSetting[]);

      // Act
      const result = await service.getGamificationSettings();

      // Assert
      expect(result.ranks).toEqual({
        novice: 0,
        beginner: 100,
        intermediate: 500,
        advanced: 1500,
        expert: 5000,
      });
    });

    it('should parse number settings correctly', async () => {
      // Arrange
      mockSystemSettingRepository.count.mockResolvedValue(2);
      mockSystemSettingRepository.find.mockResolvedValue([
        mockSettings[0],
        mockSettings[1],
      ] as SystemSetting[]);

      // Act
      const result = await service.getGamificationSettings();

      // Assert
      expect(typeof result.xp.base_per_exercise).toBe('number');
      expect(typeof result.xp.completion_multiplier).toBe('number');
      expect(result.xp.base_per_exercise).toBe(10);
      expect(result.xp.completion_multiplier).toBe(1.5);
    });

    it('should return defaults from DB', async () => {
      // Arrange
      mockSystemSettingRepository.count.mockResolvedValue(1);
      mockSystemSettingRepository.find.mockResolvedValue(
        mockSettings as SystemSetting[],
      );

      // Act
      const result = await service.getGamificationSettings();

      // Assert
      expect(result.defaults).toBeDefined();
      expect(result.defaults).toHaveProperty(
        ['gamification.xp.base_per_exercise'],
      );
      expect(result.defaults['gamification.xp.base_per_exercise']).toBe(10);
      expect(result.defaults['gamification.xp.completion_multiplier']).toBe(
        1.5,
      );
    });
  });

  describe('updateGamificationSettings', () => {
    const mockExistingSetting: Partial<SystemSetting> = {
      id: 'setting-1',
      setting_key: 'gamification.xp.base_per_exercise',
      setting_category: 'gamification',
      setting_subcategory: 'xp',
      setting_value: '10',
      value_type: 'number',
      default_value: '10',
      is_system: false,
      is_readonly: false,
      updated_at: new Date('2025-11-11T20:00:00.000Z'),
      updated_by: 'admin-1',
    };

    it('should update XP settings', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        xp: {
          base_per_exercise: 15,
          completion_multiplier: 2.0,
          perfect_score_bonus: 3.0,
        },
      };

      // Return different settings based on key
      mockSystemSettingRepository.findOne.mockImplementation(
        async (query: any) => {
          const key = query.where.setting_key;
          return {
            ...mockExistingSetting,
            setting_key: key,
          } as SystemSetting;
        },
      );
      mockSystemSettingRepository.save.mockImplementation(
        async (entity) => entity,
      );
      mockSystemSettingRepository.count.mockResolvedValue(1);
      mockSystemSettingRepository.find.mockResolvedValue([
        mockExistingSetting,
      ] as SystemSetting[]);

      // Act
      const result = await service.updateGamificationSettings(dto, 'admin-1');

      // Assert
      expect(mockSystemSettingRepository.save).toHaveBeenCalledTimes(3); // 3 xp fields
      const saveCall1 = mockSystemSettingRepository.save.mock.calls[0][0];
      expect(saveCall1.setting_key).toBe('gamification.xp.base_per_exercise');
      expect(saveCall1.setting_value).toBe('15');
      expect(saveCall1.updated_by).toBe('admin-1');
      expect(result).toHaveProperty('xp');
    });

    it('should update rank thresholds', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        ranks: {
          novice: 0,
          beginner: 150,
          intermediate: 600,
          advanced: 2000,
          expert: 6000,
        },
      };

      const rankSetting = {
        ...mockExistingSetting,
        setting_key: 'gamification.ranks.thresholds',
      };

      mockSystemSettingRepository.findOne.mockResolvedValue(
        rankSetting as SystemSetting,
      );
      mockSystemSettingRepository.save.mockResolvedValue(
        rankSetting as SystemSetting,
      );
      mockSystemSettingRepository.count.mockResolvedValue(1);
      mockSystemSettingRepository.find.mockResolvedValue([
        rankSetting,
      ] as SystemSetting[]);

      // Act
      const result = await service.updateGamificationSettings(dto, 'admin-1');

      // Assert
      expect(mockSystemSettingRepository.save).toHaveBeenCalledTimes(1);
      expect(mockSystemSettingRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          setting_value: JSON.stringify(dto.ranks),
          updated_by: 'admin-1',
        }),
      );
      expect(result).toHaveProperty('ranks');
    });

    it('should update coins settings', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        coins: {
          welcome_bonus: 1000,
          daily_login_reward: 100,
          exercise_completion_reward: 200,
        },
      };

      mockSystemSettingRepository.findOne.mockResolvedValue(
        mockExistingSetting as SystemSetting,
      );
      mockSystemSettingRepository.save.mockResolvedValue(
        mockExistingSetting as SystemSetting,
      );
      mockSystemSettingRepository.count.mockResolvedValue(1);
      mockSystemSettingRepository.find.mockResolvedValue([
        mockExistingSetting,
      ] as SystemSetting[]);

      // Act
      const result = await service.updateGamificationSettings(dto, 'admin-1');

      // Assert
      expect(mockSystemSettingRepository.save).toHaveBeenCalledTimes(3); // 3 coin fields
      expect(result).toHaveProperty('coins');
    });

    it('should validate rank thresholds are in ascending order', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        ranks: {
          novice: 0,
          beginner: 500, // Wrong: should be < intermediate
          intermediate: 500,
          advanced: 1500,
          expert: 5000,
        },
      };

      // Act & Assert
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow('ascending order');
    });

    it('should throw error if rank thresholds not strictly increasing', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        ranks: {
          novice: 0,
          beginner: 100,
          intermediate: 100, // Equal to previous
          advanced: 1500,
          expert: 5000,
        },
      };

      // Act & Assert
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw error if completion multiplier < 1', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        xp: {
          base_per_exercise: 10,
          completion_multiplier: 0.5, // Invalid: < 1
        },
      };

      // Act & Assert
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow('must be >= 1.0');
    });

    it('should throw error if setting is readonly', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        xp: {
          base_per_exercise: 15,
          completion_multiplier: 2.0,
        },
      };

      const readonlySetting = {
        ...mockExistingSetting,
        is_readonly: true,
      };

      mockSystemSettingRepository.findOne.mockResolvedValue(
        readonlySetting as SystemSetting,
      );

      // Act & Assert
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow('readonly');
    });

    it('should throw error if setting is system', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        xp: {
          base_per_exercise: 15,
          completion_multiplier: 2.0,
        },
      };

      const systemSetting = {
        ...mockExistingSetting,
        is_system: true,
      };

      mockSystemSettingRepository.findOne.mockResolvedValue(
        systemSetting as SystemSetting,
      );

      // Act & Assert
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow('system');
    });

    it('should throw NotFoundException if setting does not exist', async () => {
      // Arrange
      const dto: UpdateGamificationSettingsDto = {
        xp: {
          base_per_exercise: 15,
          completion_multiplier: 2.0,
        },
      };

      mockSystemSettingRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateGamificationSettings(dto, 'admin-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('previewImpact', () => {
    it('should calculate preview metrics', async () => {
      // Arrange
      const dto: PreviewImpactDto = {
        xp: {
          base_per_exercise: 20,
          completion_multiplier: 2.0,
        },
        sample_size: 1000,
      };

      // Act
      const result = await service.previewImpact(dto);

      // Assert
      expect(result).toHaveProperty('users_affected');
      expect(result).toHaveProperty('rank_changes');
      expect(result).toHaveProperty('xp_impact');
      expect(result).toHaveProperty('coins_impact');
      expect(result).toHaveProperty('preview_timestamp');
      expect(result.users_affected).toBeGreaterThan(0);
      expect(result.rank_changes.promotions).toBeGreaterThanOrEqual(0);
      expect(result.rank_changes.demotions).toBeGreaterThanOrEqual(0);
    });

    it('should respect sample size limits', async () => {
      // Arrange
      const dto: PreviewImpactDto = {
        xp: {
          base_per_exercise: 15,
          completion_multiplier: 1.8,
        },
        sample_size: 20000, // Exceeds max of 10000
      };

      // Act
      const result = await service.previewImpact(dto);

      // Assert
      // Should be capped at 10000 * 0.8 = 8000
      expect(result.users_affected).toBeLessThanOrEqual(10000);
    });

    it('should default to 1000 sample size if not provided', async () => {
      // Arrange
      const dto: PreviewImpactDto = {
        xp: {
          base_per_exercise: 15,
          completion_multiplier: 1.8,
        },
      };

      // Act
      const result = await service.previewImpact(dto);

      // Assert
      // Should use default of 1000 * 0.8 = 800
      expect(result.users_affected).toBeLessThanOrEqual(1000);
    });

    it('should calculate XP impact correctly', async () => {
      // Arrange
      const dto: PreviewImpactDto = {
        xp: {
          base_per_exercise: 20,
          completion_multiplier: 2.0,
        },
        sample_size: 100,
      };

      // Act
      const result = await service.previewImpact(dto);

      // Assert
      expect(result.xp_impact.avg_xp_change).toBeDefined();
      expect(result.xp_impact.total_xp_change).toBeDefined();
      expect(typeof result.xp_impact.avg_xp_change).toBe('number');
      expect(typeof result.xp_impact.total_xp_change).toBe('number');
    });

    it('should return zero XP impact if no XP changes', async () => {
      // Arrange
      const dto: PreviewImpactDto = {
        coins: {
          welcome_bonus: 1000,
          daily_login_reward: 100,
        },
        sample_size: 100,
      };

      // Act
      const result = await service.previewImpact(dto);

      // Assert
      expect(result.xp_impact.avg_xp_change).toBe(0);
      expect(result.xp_impact.total_xp_change).toBe(0);
    });
  });

  describe('restoreDefaults', () => {
    const mockSettingsForRestore: Partial<SystemSetting>[] = [
      {
        id: 'setting-1',
        setting_key: 'gamification.xp.base_per_exercise',
        setting_category: 'gamification',
        setting_value: '20', // Modified
        default_value: '10', // Original default
        is_system: false,
        is_readonly: false,
      },
      {
        id: 'setting-2',
        setting_key: 'gamification.xp.completion_multiplier',
        setting_category: 'gamification',
        setting_value: '2.5', // Modified
        default_value: '1.5', // Original default
        is_system: false,
        is_readonly: false,
      },
      {
        id: 'setting-3',
        setting_key: 'gamification.coins.welcome_bonus',
        setting_category: 'gamification',
        setting_value: '1000', // Modified
        default_value: '500', // Original default
        is_system: true, // System setting - should NOT be restored
        is_readonly: false,
      },
    ];

    it('should restore all non-system settings to defaults', async () => {
      // Arrange
      mockSystemSettingRepository.find.mockResolvedValue(
        mockSettingsForRestore as SystemSetting[],
      );
      mockSystemSettingRepository.save.mockImplementation(
        async (entity) => entity,
      );

      // Act
      const result = await service.restoreDefaults('admin-1');

      // Assert
      expect(result.settings_restored).toHaveLength(2); // Only 2 non-system settings
      expect(result.settings_restored).toContain(
        'gamification.xp.base_per_exercise',
      );
      expect(result.settings_restored).toContain(
        'gamification.xp.completion_multiplier',
      );
      expect(result.settings_restored).not.toContain(
        'gamification.coins.welcome_bonus',
      ); // System setting
      expect(mockSystemSettingRepository.save).toHaveBeenCalledTimes(2);
    });

    it('should not restore system settings', async () => {
      // Arrange
      mockSystemSettingRepository.find.mockResolvedValue([
        mockSettingsForRestore[2],
      ] as SystemSetting[]); // Only system setting

      // Act
      const result = await service.restoreDefaults('admin-1');

      // Assert
      expect(result.settings_restored).toHaveLength(0);
      expect(mockSystemSettingRepository.save).not.toHaveBeenCalled();
    });

    it('should update updated_by field', async () => {
      // Arrange
      mockSystemSettingRepository.find.mockResolvedValue([
        mockSettingsForRestore[0],
      ] as SystemSetting[]);
      mockSystemSettingRepository.save.mockImplementation(
        async (entity) => entity,
      );

      // Act
      await service.restoreDefaults('admin-2');

      // Assert
      expect(mockSystemSettingRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          updated_by: 'admin-2',
        }),
      );
    });

    it('should set setting_value to default_value', async () => {
      // Arrange
      mockSystemSettingRepository.find.mockResolvedValue([
        mockSettingsForRestore[0],
      ] as SystemSetting[]);
      mockSystemSettingRepository.save.mockImplementation(
        async (entity) => entity,
      );

      // Act
      await service.restoreDefaults('admin-1');

      // Assert
      expect(mockSystemSettingRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          setting_value: '10', // Restored to default
        }),
      );
    });

    it('should return timestamp and admin ID', async () => {
      // Arrange
      mockSystemSettingRepository.find.mockResolvedValue([
        mockSettingsForRestore[0],
      ] as SystemSetting[]);
      mockSystemSettingRepository.save.mockImplementation(
        async (entity) => entity,
      );

      // Act
      const result = await service.restoreDefaults('admin-3');

      // Assert
      expect(result.restored_at).toBeDefined();
      expect(result.restored_by).toBe('admin-3');
      expect(new Date(result.restored_at).getTime()).toBeLessThanOrEqual(
        Date.now(),
      );
    });
  });
});
