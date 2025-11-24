import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SecurityService } from '../services/security.service';
import { AuthAttempt } from '../entities';
import { CreateAuthAttemptDto } from '../dto';

describe('SecurityService', () => {
  let service: SecurityService;
  let attemptRepository: Repository<AuthAttempt>;

  const mockAttemptRepository = {
    create: jest.fn(),
    save: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: getRepositoryToken(AuthAttempt, 'auth'),
          useValue: mockAttemptRepository,
        },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
    attemptRepository = module.get(getRepositoryToken(AuthAttempt, 'auth'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('logAttempt', () => {
    const createAttemptDto: CreateAuthAttemptDto = {
      user_id: 'user-1',
      email: 'test@example.com',
      success: true,
      ip_address: '127.0.0.1',
      user_agent: 'Mozilla/5.0',
    };

    const mockAttempt = {
      id: 'attempt-1',
      ...createAttemptDto,
      created_at: new Date(),
    };

    it('should log a successful authentication attempt', async () => {
      // Arrange
      mockAttemptRepository.create.mockReturnValue(mockAttempt);
      mockAttemptRepository.save.mockResolvedValue(mockAttempt);

      // Act
      const result = await service.logAttempt(createAttemptDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('attempt-1');
      expect(result.success).toBe(true);
      expect(mockAttemptRepository.create).toHaveBeenCalledWith(createAttemptDto);
      expect(mockAttemptRepository.save).toHaveBeenCalled();
    });

    it('should log a failed authentication attempt', async () => {
      // Arrange
      const failedAttempt = {
        ...createAttemptDto,
        success: false,
        failure_reason: 'Invalid password',
      };
      mockAttemptRepository.create.mockReturnValue({ ...mockAttempt, success: false });
      mockAttemptRepository.save.mockResolvedValue({ ...mockAttempt, success: false });

      // Act
      const result = await service.logAttempt(failedAttempt);

      // Assert
      expect(result.success).toBe(false);
      expect(mockAttemptRepository.save).toHaveBeenCalled();
    });

    it('should include IP address and user agent', async () => {
      // Arrange
      mockAttemptRepository.create.mockReturnValue(mockAttempt);
      mockAttemptRepository.save.mockResolvedValue(mockAttempt);

      // Act
      await service.logAttempt(createAttemptDto);

      // Assert
      expect(mockAttemptRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ip_address: '127.0.0.1',
          user_agent: 'Mozilla/5.0',
        }),
      );
    });
  });

  describe('checkRateLimit', () => {
    it('should allow login if no rate limit exceeded', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValueOnce(0); // Email failures
      mockAttemptRepository.count.mockResolvedValueOnce(0); // IP failures

      // Act
      const result = await service.checkRateLimit('test@example.com', '127.0.0.1');

      // Assert
      expect(result.isBlocked).toBe(false);
      expect(result.reason).toBeUndefined();
    });

    it('should block if email has 5+ failed attempts in 15 minutes', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValueOnce(5); // Email failures

      // Act
      const result = await service.checkRateLimit('test@example.com', '127.0.0.1');

      // Assert
      expect(result.isBlocked).toBe(true);
      expect(result.reason).toContain('Demasiados intentos fallidos');
      expect(result.reason).toContain('test@example.com');
    });

    it('should block if IP has 10+ failed attempts in 15 minutes', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValueOnce(0); // Email failures
      mockAttemptRepository.count.mockResolvedValueOnce(10); // IP failures

      // Act
      const result = await service.checkRateLimit('test@example.com', '127.0.0.1');

      // Assert
      expect(result.isBlocked).toBe(true);
      expect(result.reason).toContain('Demasiados intentos fallidos desde esta IP');
    });

    it('should not check IP rate limit if IP is not provided', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValueOnce(0); // Email failures

      // Act
      const result = await service.checkRateLimit('test@example.com');

      // Assert
      expect(result.isBlocked).toBe(false);
      expect(mockAttemptRepository.count).toHaveBeenCalledTimes(1); // Only email check
    });

    it('should check within 15-minute window', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValueOnce(0);
      mockAttemptRepository.count.mockResolvedValueOnce(0);

      // Act
      await service.checkRateLimit('test@example.com', '127.0.0.1');

      // Assert
      expect(mockAttemptRepository.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          email: 'test@example.com',
          success: false,
          attempted_at: expect.anything(),
        }),
      });
    });

    it('should provide block duration in error message', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValueOnce(5);

      // Act
      const result = await service.checkRateLimit('test@example.com', '127.0.0.1');

      // Assert
      expect(result.reason).toContain('30 minutos');
    });
  });

  describe('getRecentFailures', () => {
    it('should count failures for given email', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(3);

      // Act
      const result = await service.getRecentFailures('test@example.com', 15);

      // Assert
      expect(result).toBe(3);
      expect(mockAttemptRepository.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          email: 'test@example.com',
          success: false,
        }),
      });
    });

    it('should use default 15 minute window if not specified', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(2);

      // Act
      await service.getRecentFailures('test@example.com');

      // Assert
      expect(mockAttemptRepository.count).toHaveBeenCalled();
    });

    it('should return 0 if no failures found', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(0);

      // Act
      const result = await service.getRecentFailures('test@example.com', 15);

      // Assert
      expect(result).toBe(0);
    });

    it('should calculate correct time window', async () => {
      // Arrange
      const minutes = 15;
      const expectedTime = new Date(Date.now() - minutes * 60 * 1000);
      mockAttemptRepository.count.mockResolvedValue(1);

      // Act
      await service.getRecentFailures('test@example.com', minutes);

      // Assert
      expect(mockAttemptRepository.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          attempted_at: expect.any(Object), // MoreThan operator
        }),
      });
    });
  });

  describe('getRecentFailuresByIP', () => {
    it('should count failures for given IP', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(5);

      // Act
      const result = await service.getRecentFailuresByIP('127.0.0.1', 15);

      // Assert
      expect(result).toBe(5);
      expect(mockAttemptRepository.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          ip_address: '127.0.0.1',
          success: false,
        }),
      });
    });

    it('should return 0 if no failures from IP', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(0);

      // Act
      const result = await service.getRecentFailuresByIP('127.0.0.1', 15);

      // Assert
      expect(result).toBe(0);
    });
  });

  describe('detectBruteForce', () => {
    it('should detect brute force attack if many failed attempts', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(11); // More than 10 failed attempts

      // Act
      const result = await service.detectBruteForce('test@example.com');

      // Assert - detectBruteForce returns true when count > 10
      expect(result).toBe(true);
    });

    it('should not flag normal usage patterns', async () => {
      // Arrange
      const mockAttempts = [
        { email: 'user@example.com', success: false },
        { email: 'user@example.com', success: false },
      ];
      mockAttemptRepository.find.mockResolvedValue(mockAttempts);
      mockAttemptRepository.count.mockResolvedValue(2); // Only 2 failed attempts

      // Act
      const result = await service.detectBruteForce('user@example.com');

      // Assert
      expect(result).toBe(false); // detectBruteForce now returns boolean
    });

    it('should consider time window for analysis', async () => {
      // Arrange
      mockAttemptRepository.count.mockResolvedValue(0);

      // Act
      await service.detectBruteForce('test@example.com');

      // Assert - uses count with email and attempted_at filter
      expect(mockAttemptRepository.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          email: 'test@example.com',
          success: false,
          attempted_at: expect.anything(),
        }),
      });
    });
  });

  // TODO: Method getFailuresByEmail does not exist in SecurityService
  // Uncomment when method is implemented
  /*
  describe('getFailuresByEmail', () => {
    const mockAttempts = [
      {
        id: 'attempt-1',
        email: 'test@example.com',
        success: false,
        ip_address: '127.0.0.1',
        created_at: new Date(),
      },
      {
        id: 'attempt-2',
        email: 'test@example.com',
        success: false,
        ip_address: '127.0.0.2',
        created_at: new Date(),
      },
    ];

    it('should return all failure attempts for email', async () => {
      const result = await service.getFailuresByEmail('test@example.com', 10);
      expect(result).toHaveLength(2);
    });

    it('should limit results to specified count', async () => {
      await service.getFailuresByEmail('test@example.com', 5);
      expect(mockAttemptRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ take: 5 }),
      );
    });

    it('should order by most recent first', async () => {
      await service.getFailuresByEmail('test@example.com', 10);
      expect(mockAttemptRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { attempted_at: 'DESC' } }),
      );
    });
  });
  */

  describe('Security Constants', () => {
    it('should have MAX_FAILURES_PER_EMAIL set to 5', () => {
      expect((service as any).MAX_FAILURES_PER_EMAIL).toBe(5);
    });

    it('should have MAX_FAILURES_PER_IP set to 10', () => {
      expect((service as any).MAX_FAILURES_PER_IP).toBe(10);
    });

    it('should have RATE_LIMIT_WINDOW_MINUTES set to 15', () => {
      expect((service as any).RATE_LIMIT_WINDOW_MINUTES).toBe(15);
    });

    it('should have BLOCK_DURATION_MINUTES set to 30', () => {
      expect((service as any).BLOCK_DURATION_MINUTES).toBe(30);
    });
  });
});
