import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, getConnectionToken } from '@nestjs/typeorm';
import { Repository, Connection, SelectQueryBuilder } from 'typeorm';
import { AdminSystemService } from '../services/admin-system.service';
import { AuthAttempt } from '@modules/auth/entities/auth-attempt.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Tenant } from '@modules/auth/entities/tenant.entity';
import { Module } from '@modules/educational/entities/module.entity';
import { Exercise } from '@modules/educational/entities/exercise.entity';
import { SystemSetting } from '../entities/system-setting.entity';
import {
  AuditLogQueryDto,
  UpdateSystemConfigDto,
  ToggleMaintenanceDto,
} from '../dto/system';

describe('AdminSystemService', () => {
  let service: AdminSystemService;
  let authAttemptRepo: Repository<AuthAttempt>;
  let userRepo: Repository<User>;
  let tenantRepo: Repository<Tenant>;
  let moduleRepo: Repository<Module>;
  let exerciseRepo: Repository<Exercise>;
  let systemSettingRepo: Repository<SystemSetting>;
  let authConnection: Connection;
  let educationalConnection: Connection;
  let settingsStore: any[];

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getRawOne: jest.fn(),
    getRawMany: jest.fn(),
    getManyAndCount: jest.fn(),
  };

  const mockAuthAttemptRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockUserRepo = {
    count: jest.fn(),
  };

  const mockTenantRepo = {
    count: jest.fn(),
  };

  const mockModuleRepo = {
    count: jest.fn(),
  };

  const mockExerciseRepo = {
    count: jest.fn(),
  };

  const mockSystemSettingRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockAuthConnection = {
    query: jest.fn(),
    driver: {
      master: {
        poolSize: 10,
        activeCount: 3,
      },
    },
  };

  const mockEducationalConnection = {
    query: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminSystemService,
        {
          provide: getConnectionToken('auth'),
          useValue: mockAuthConnection,
        },
        {
          provide: getConnectionToken('educational'),
          useValue: mockEducationalConnection,
        },
        {
          provide: getRepositoryToken(AuthAttempt, 'auth'),
          useValue: mockAuthAttemptRepo,
        },
        {
          provide: getRepositoryToken(User, 'auth'),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Tenant, 'auth'),
          useValue: mockTenantRepo,
        },
        {
          provide: getRepositoryToken(Module, 'educational'),
          useValue: mockModuleRepo,
        },
        {
          provide: getRepositoryToken(Exercise, 'educational'),
          useValue: mockExerciseRepo,
        },
        {
          provide: getRepositoryToken(SystemSetting, 'auth'),
          useValue: mockSystemSettingRepo,
        },
      ],
    }).compile();

    service = module.get<AdminSystemService>(AdminSystemService);
    authAttemptRepo = module.get(getRepositoryToken(AuthAttempt, 'auth'));
    userRepo = module.get(getRepositoryToken(User, 'auth'));
    tenantRepo = module.get(getRepositoryToken(Tenant, 'auth'));
    moduleRepo = module.get(getRepositoryToken(Module, 'educational'));
    exerciseRepo = module.get(getRepositoryToken(Exercise, 'educational'));
    systemSettingRepo = module.get(getRepositoryToken(SystemSetting, 'auth'));
    authConnection = module.get(getConnectionToken('auth'));
    educationalConnection = module.get(getConnectionToken('educational'));

    jest.clearAllMocks();

    // Initialize settings store for each test
    settingsStore = [];
    let timestampCounter = 0;

    // Setup default mocks for system settings with stateful storage
    mockSystemSettingRepo.find.mockImplementation(() => Promise.resolve([...settingsStore]));
    mockSystemSettingRepo.findOne.mockImplementation((options) => {
      const key = options?.where?.setting_key;
      const setting = settingsStore.find(s => s.setting_key === key);
      return Promise.resolve(setting || null);
    });
    mockSystemSettingRepo.save.mockImplementation((setting) => {
      // Ensure updated_at is set with unique timestamp
      // Add milliseconds to ensure each save has a unique timestamp
      const now = new Date();
      now.setMilliseconds(now.getMilliseconds() + timestampCounter++);

      const savedSetting = {
        ...setting,
        updated_at: setting.updated_at || now,
        created_at: setting.created_at || now,
      };

      const index = settingsStore.findIndex(s => s.setting_key === setting.setting_key);
      if (index >= 0) {
        settingsStore[index] = savedSetting;
      } else {
        settingsStore.push(savedSetting);
      }
      return Promise.resolve(savedSetting);
    });
    mockSystemSettingRepo.create.mockImplementation((setting) => {
      const now = new Date();
      now.setMilliseconds(now.getMilliseconds() + timestampCounter++);
      return {
        ...setting,
        created_at: now,
        updated_at: now,
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getSystemHealth', () => {
    it('should return healthy status when all systems are operational', async () => {
      // Arrange
      mockAuthConnection.query.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe('healthy');
      expect(result.uptime_seconds).toBeGreaterThan(0);
      expect(result.timestamp).toBeDefined();
      expect(result.version).toBeDefined();
      expect(result.node_version).toBe(process.version);
      expect(result.database).toBeDefined();
      expect(result.memory).toBeDefined();
      expect(result.cpu).toBeDefined();
    });

    it('should return degraded status when database is slow', async () => {
      // Arrange
      mockAuthConnection.query.mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve([{ '?column?': 1 }]), 150),
          ),
      );

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.status).toBe('degraded');
      expect(result.database.status).toBe('degraded');
      expect(result.database.response_time_ms).toBeGreaterThan(100);
    });

    it('should return down status when database is unreachable', async () => {
      // Arrange
      mockAuthConnection.query.mockRejectedValue(
        new Error('Connection refused'),
      );

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.status).toBe('down');
      expect(result.database.status).toBe('down');
      expect(result.database.response_time_ms).toBe(-1);
    });

    it('should include memory metrics', async () => {
      // Arrange
      mockAuthConnection.query.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.memory).toBeDefined();
      expect(result.memory.used_mb).toBeGreaterThan(0);
      expect(result.memory.total_mb).toBeGreaterThan(0);
      expect(result.memory.usage_percent).toBeGreaterThanOrEqual(0);
      expect(result.memory.usage_percent).toBeLessThanOrEqual(100);
    });

    it('should include CPU metrics', async () => {
      // Arrange
      mockAuthConnection.query.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.cpu).toBeDefined();
      expect(result.cpu.usage_percent).toBeGreaterThanOrEqual(0);
      expect(result.cpu.usage_percent).toBeLessThanOrEqual(100);
    });

    it('should include database connection pool info', async () => {
      // Arrange
      mockAuthConnection.query.mockResolvedValue([{ '?column?': 1 }]);

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.database.pool_size).toBe(10);
      expect(result.database.active_connections).toBe(3);
    });

    it('should include environment information', async () => {
      // Arrange
      mockAuthConnection.query.mockResolvedValue([{ '?column?': 1 }]);
      process.env.NODE_ENV = 'test';

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.environment).toBeDefined();
      expect(['development', 'test', 'production']).toContain(
        result.environment,
      );
    });
  });

  describe('getSystemMetrics', () => {
    const mockMetricsData = {
      totalUsers: 150,
      totalModules: 5,
      totalExercises: 100,
      totalOrganizations: 10,
      activeUsers24h: 45,
      requestsLastHour: 500,
      failedLastHour: 25,
      exercisesCompleted24h: 200,
    };

    beforeEach(() => {
      mockUserRepo.count.mockResolvedValue(mockMetricsData.totalUsers);
      mockModuleRepo.count.mockResolvedValue(mockMetricsData.totalModules);
      mockExerciseRepo.count.mockResolvedValue(
        mockMetricsData.totalExercises,
      );
      mockTenantRepo.count.mockResolvedValue(
        mockMetricsData.totalOrganizations,
      );

      mockQueryBuilder.getRawOne.mockResolvedValue({
        count: mockMetricsData.activeUsers24h.toString(),
      });

      mockAuthAttemptRepo.count
        .mockResolvedValueOnce(mockMetricsData.requestsLastHour)
        .mockResolvedValueOnce(mockMetricsData.failedLastHour)
        .mockResolvedValueOnce(mockMetricsData.exercisesCompleted24h);

      mockQueryBuilder.getRawMany.mockResolvedValue([
        { error: 'Invalid credentials', count: '10' },
        { error: 'User not found', count: '5' },
      ]);
    });

    it('should return comprehensive system metrics', async () => {
      // Act
      const result = await service.getSystemMetrics();

      // Assert
      expect(result).toBeDefined();
      expect(result.timestamp).toBeDefined();
      expect(result.total_users).toBe(mockMetricsData.totalUsers);
      expect(result.total_modules).toBe(mockMetricsData.totalModules);
      expect(result.total_exercises).toBe(mockMetricsData.totalExercises);
      expect(result.total_organizations).toBe(
        mockMetricsData.totalOrganizations,
      );
      expect(result.active_users_24h).toBe(mockMetricsData.activeUsers24h);
    });

    it('should calculate error rate correctly', async () => {
      // Act
      const result = await service.getSystemMetrics();

      // Assert
      const expectedErrorRate =
        mockMetricsData.failedLastHour / mockMetricsData.requestsLastHour;
      expect(result.error_rate_last_hour).toBeCloseTo(expectedErrorRate, 4);
    });

    it('should handle zero requests gracefully', async () => {
      // Arrange
      mockAuthAttemptRepo.count.mockReset();
      mockAuthAttemptRepo.count
        .mockResolvedValueOnce(0) // requests
        .mockResolvedValueOnce(0) // failed
        .mockResolvedValueOnce(0); // exercises

      // Act
      const result = await service.getSystemMetrics();

      // Assert
      expect(result.error_rate_last_hour).toBe(0);
      expect(result.requests_last_hour).toBe(0);
    });

    it('should estimate database queries', async () => {
      // Arrange
      mockAuthAttemptRepo.count.mockReset();
      mockAuthAttemptRepo.count
        .mockResolvedValueOnce(mockMetricsData.requestsLastHour)
        .mockResolvedValueOnce(mockMetricsData.failedLastHour)
        .mockResolvedValueOnce(mockMetricsData.exercisesCompleted24h);

      // Act
      const result = await service.getSystemMetrics();

      // Assert
      expect(result.db_queries_last_hour).toBe(
        mockMetricsData.requestsLastHour * 3,
      );
    });

    it('should include top errors', async () => {
      // Act
      const result = await service.getSystemMetrics();

      // Assert
      expect(result.top_errors).toBeDefined();
      expect(result.top_errors).toHaveLength(2);
      expect(result.top_errors![0].error).toBe('Invalid credentials');
      expect(result.top_errors![0].count).toBe(10);
    });

    it('should return undefined for top_errors when none exist', async () => {
      // Arrange
      mockQueryBuilder.getRawMany.mockResolvedValue([]);

      // Act
      const result = await service.getSystemMetrics();

      // Assert
      expect(result.top_errors).toBeUndefined();
    });

    it('should estimate exercises completed', async () => {
      // Act
      const result = await service.getSystemMetrics();

      // Assert
      expect(result.exercises_completed_24h).toBe(
        Math.round(mockMetricsData.exercisesCompleted24h * 1.5),
      );
    });
  });

  describe('getAuditLog', () => {
    const mockAuditLogs = [
      {
        id: 'log-1',
        email: 'user1@example.com',
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0',
        success: true,
        failure_reason: null,
        attempted_at: new Date('2024-01-01'),
      },
      {
        id: 'log-2',
        email: 'user2@example.com',
        ip_address: '192.168.1.1',
        user_agent: 'Chrome',
        success: false,
        failure_reason: 'Invalid password',
        attempted_at: new Date('2024-01-02'),
      },
    ];

    beforeEach(() => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockAuditLogs,
        mockAuditLogs.length,
      ]);
    });

    it('should return paginated audit logs with default pagination', async () => {
      // Arrange
      const query: AuditLogQueryDto = {};

      // Act
      const result = await service.getAuditLog(query);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(50);
      expect(result.total_pages).toBe(1);
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const query: AuditLogQueryDto = { page: 2, limit: 10 };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10); // (page 2 - 1) * limit 10
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should filter by user_id', async () => {
      // Arrange
      const query: AuditLogQueryDto = { user_id: 'user-1' };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.user_id = :user_id',
        { user_id: 'user-1' },
      );
    });

    it('should filter by email with ILIKE', async () => {
      // Arrange
      const query: AuditLogQueryDto = { email: 'test@example.com' };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.email ILIKE :email',
        { email: '%test@example.com%' },
      );
    });

    it('should filter by IP address', async () => {
      // Arrange
      const query: AuditLogQueryDto = { ip_address: '127.0.0.1' };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.ip_address = :ip_address',
        { ip_address: '127.0.0.1' },
      );
    });

    it('should filter by success status', async () => {
      // Arrange
      const query: AuditLogQueryDto = { success: false };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.success = :success',
        { success: false },
      );
    });

    it('should filter by date range', async () => {
      // Arrange
      const query: AuditLogQueryDto = {
        start_date: '2024-01-01',
        end_date: '2024-01-31',
      };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.attempted_at BETWEEN :start AND :end',
        expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date),
        }),
      );
    });

    it('should filter by start_date only', async () => {
      // Arrange
      const query: AuditLogQueryDto = { start_date: '2024-01-01' };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.attempted_at >= :start',
        expect.objectContaining({ start: expect.any(Date) }),
      );
    });

    it('should filter by end_date only', async () => {
      // Arrange
      const query: AuditLogQueryDto = { end_date: '2024-01-31' };

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'attempt.attempted_at <= :end',
        expect.objectContaining({ end: expect.any(Date) }),
      );
    });

    it('should order by attempted_at DESC', async () => {
      // Arrange
      const query: AuditLogQueryDto = {};

      // Act
      await service.getAuditLog(query);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'attempt.attempted_at',
        'DESC',
      );
    });

    it('should map results to AuditLogDto format', async () => {
      // Arrange
      const query: AuditLogQueryDto = {};

      // Act
      const result = await service.getAuditLog(query);

      // Assert
      expect(result.data[0]).toEqual({
        id: 'log-1',
        email: 'user1@example.com',
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0',
        success: true,
        failure_reason: null,
        attempted_at: expect.any(Date),
      });
    });

    it('should calculate total_pages correctly', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockResolvedValue([mockAuditLogs, 125]);
      const query: AuditLogQueryDto = { limit: 50 };

      // Act
      const result = await service.getAuditLog(query);

      // Assert
      expect(result.total_pages).toBe(3); // 125 / 50 = 2.5 => 3
    });
  });

  describe('updateSystemConfig', () => {
    const updateDto: UpdateSystemConfigDto = {
      maintenance_mode: true,
      max_login_attempts: 10,
      lockout_duration_minutes: 60,
    };

    it('should update system configuration', async () => {
      // Act
      const result = await service.updateSystemConfig(updateDto, 'admin-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.maintenance_mode).toBe(true);
      expect(result.max_login_attempts).toBe(10);
      expect(result.lockout_duration_minutes).toBe(60);
      expect(result.updated_by).toBe('admin-1');
      expect(result.updated_at).toBeDefined();
    });

    it('should preserve existing config when partial update', async () => {
      // Arrange - First update
      await service.updateSystemConfig(
        { allow_registrations: false },
        'admin-1',
      );

      // Act - Second update
      const result = await service.updateSystemConfig(
        { max_login_attempts: 7 },
        'admin-2',
      );

      // Assert
      expect(result.allow_registrations).toBe(false); // Preserved
      expect(result.max_login_attempts).toBe(7); // Updated
      expect(result.updated_by).toBe('admin-2');
    });

    it('should update timestamp on each change', async () => {
      // Arrange
      const before = new Date().toISOString();

      // Act
      const result = await service.updateSystemConfig(updateDto, 'admin-1');

      // Assert
      expect(result.updated_at).toBeDefined();
      expect(new Date(result.updated_at).getTime()).toBeGreaterThanOrEqual(
        new Date(before).getTime(),
      );
    });

    it('should handle custom_settings updates', async () => {
      // Arrange
      const updateWithCustom: UpdateSystemConfigDto = {
        custom_settings: { feature_flags: { new_dashboard: true } },
      };

      // Act
      const result = await service.updateSystemConfig(
        updateWithCustom,
        'admin-1',
      );

      // Assert
      expect(result.custom_settings).toBeDefined();
      expect(result.custom_settings?.feature_flags).toEqual({
        new_dashboard: true,
      });
    });
  });

  describe('getSystemConfig', () => {
    it('should return current system configuration', async () => {
      // Act
      const result = await service.getSystemConfig();

      // Assert
      expect(result).toBeDefined();
      expect(result.maintenance_mode).toBeDefined();
      expect(result.allow_registrations).toBeDefined();
      expect(result.max_login_attempts).toBeDefined();
      expect(result.lockout_duration_minutes).toBeDefined();
      expect(result.session_timeout_minutes).toBeDefined();
    });

    it('should return default values on first call', async () => {
      // Act
      const result = await service.getSystemConfig();

      // Assert
      expect(result.maintenance_mode).toBe(false);
      expect(result.allow_registrations).toBe(true);
      expect(result.max_login_attempts).toBe(5);
      expect(result.lockout_duration_minutes).toBe(30);
      expect(result.session_timeout_minutes).toBe(60);
    });

    it('should reflect previous updates', async () => {
      // Arrange
      await service.updateSystemConfig(
        { maintenance_mode: true, max_login_attempts: 8 },
        'admin-1',
      );

      // Act
      const result = await service.getSystemConfig();

      // Assert
      expect(result.maintenance_mode).toBe(true);
      expect(result.max_login_attempts).toBe(8);
    });
  });

  describe('toggleMaintenance', () => {
    const toggleDto: ToggleMaintenanceDto = {
      enabled: true,
      message: 'System upgrade in progress',
    };

    it('should enable maintenance mode', async () => {
      // Act
      const result = await service.toggleMaintenance(toggleDto, 'admin-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.maintenance_mode).toBe(true);
      expect(result.maintenance_message).toBe('System upgrade in progress');
      expect(result.updated_by).toBe('admin-1');
      expect(result.updated_at).toBeDefined();
    });

    it('should disable maintenance mode', async () => {
      // Arrange
      const disableDto: ToggleMaintenanceDto = { enabled: false };

      // Act
      const result = await service.toggleMaintenance(disableDto, 'admin-1');

      // Assert
      expect(result.maintenance_mode).toBe(false);
    });

    it('should update maintenance message', async () => {
      // Act
      const result = await service.toggleMaintenance(toggleDto, 'admin-1');

      // Assert
      expect(result.maintenance_message).toBe('System upgrade in progress');
    });

    it('should preserve existing message if not provided', async () => {
      // Arrange - Set initial message
      await service.toggleMaintenance(
        { enabled: true, message: 'First message' },
        'admin-1',
      );

      // Act - Toggle without message
      const result = await service.toggleMaintenance(
        { enabled: false },
        'admin-2',
      );

      // Assert
      expect(result.maintenance_message).toBe('First message');
    });

    it('should update metadata on toggle', async () => {
      // Act
      const result = await service.toggleMaintenance(toggleDto, 'admin-123');

      // Assert
      expect(result.updated_by).toBe('admin-123');
      expect(result.updated_at).toBeDefined();
      expect(new Date(result.updated_at).getTime()).toBeGreaterThan(
        Date.now() - 1000,
      );
    });

    it('should persist maintenance state in system config', async () => {
      // Arrange
      await service.toggleMaintenance({ enabled: true }, 'admin-1');

      // Act
      const config = await service.getSystemConfig();

      // Assert
      expect(config.maintenance_mode).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should handle database connection errors gracefully', async () => {
      // Arrange
      mockAuthConnection.query.mockRejectedValue(
        new Error('Database connection lost'),
      );

      // Act
      const result = await service.getSystemHealth();

      // Assert
      expect(result.status).toBe('down');
      expect(result.database.status).toBe('down');
    });

    it('should handle repository errors in metrics', async () => {
      // Arrange
      mockUserRepo.count.mockRejectedValue(
        new Error('Repository error'),
      );

      // Act & Assert
      await expect(service.getSystemMetrics()).rejects.toThrow(
        'Repository error',
      );
    });

    it('should handle query builder errors in audit log', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('Query failed'),
      );

      // Act & Assert
      await expect(service.getAuditLog({})).rejects.toThrow('Query failed');
    });
  });
});
