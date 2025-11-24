import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../services/auth.service';
import { User, Profile, Tenant, UserSession, AuthAttempt } from '../entities';
import { RegisterUserDto } from '../dto';
import { GamilityRoleEnum, UserStatusEnum, SubscriptionTierEnum } from '@shared/constants';

// Mock bcrypt globally
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let profileRepository: Repository<Profile>;
  let tenantRepository: Repository<Tenant>;
  let sessionRepository: Repository<UserSession>;
  let attemptRepository: Repository<AuthAttempt>;
  let jwtService: JwtService;

  // Mock repositories
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockProfileRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTenantRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockAttemptRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User, 'auth'),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Profile, 'auth'),
          useValue: mockProfileRepository,
        },
        {
          provide: getRepositoryToken(Tenant, 'auth'),
          useValue: mockTenantRepository,
        },
        {
          provide: getRepositoryToken(UserSession, 'auth'),
          useValue: mockSessionRepository,
        },
        {
          provide: getRepositoryToken(AuthAttempt, 'auth'),
          useValue: mockAttemptRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User, 'auth'));
    profileRepository = module.get(getRepositoryToken(Profile, 'auth'));
    tenantRepository = module.get(getRepositoryToken(Tenant, 'auth'));
    sessionRepository = module.get(getRepositoryToken(UserSession, 'auth'));
    attemptRepository = module.get(getRepositoryToken(AuthAttempt, 'auth'));
    jwtService = module.get<JwtService>(JwtService);

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterUserDto = {
      email: 'test@example.com',
      password: 'Password123!',
      first_name: 'Test',
      last_name: 'User',
    };

    const mockTenant = {
      id: 'tenant-1',
      name: 'test-personal',
      slug: 'test-1234567890',
      subscription_tier: SubscriptionTierEnum.FREE,
      is_active: true,
    };

    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      encrypted_password: 'hashed_password',
      role: GamilityRoleEnum.STUDENT,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const mockProfile = {
      id: 'profile-1',
      user_id: 'user-1',
      tenant_id: 'tenant-1',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: GamilityRoleEnum.STUDENT,
      status: UserStatusEnum.ACTIVE,
      email_verified: false,
    };

    it('should register a new user successfully', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null); // Email no existe
      mockTenantRepository.findOne.mockResolvedValue(mockTenant); // Main tenant exists
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockProfileRepository.create.mockReturnValue(mockProfile);
      mockProfileRepository.save.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Act
      const result = await service.register(registerDto, '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      // Tenant is reused from existing main tenant, so create/save are not called
      expect(mockTenantRepository.findOne).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(mockProfileRepository.create).toHaveBeenCalled();
      expect(mockProfileRepository.save).toHaveBeenCalled();
      expect(mockAttemptRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('test@example.com');
      // Password should not be exposed in response
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser); // Email ya existe

      // Act & Assert
      await expect(service.register(registerDto, '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto, '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        'Email ya registrado',
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockTenantRepository.create).not.toHaveBeenCalled();
    });

    it('should hash password with bcrypt cost 10', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      mockTenantRepository.findOne.mockResolvedValue(mockTenant); // Main tenant exists
      mockTenantRepository.create.mockReturnValue(mockTenant);
      mockTenantRepository.save.mockResolvedValue(mockTenant);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockProfileRepository.create.mockReturnValue(mockProfile);
      mockProfileRepository.save.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Act
      await service.register(registerDto, '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should use existing tenant when registering', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      mockTenantRepository.findOne.mockResolvedValue(mockTenant); // Main tenant exists
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockProfileRepository.create.mockReturnValue(mockProfile);
      mockProfileRepository.save.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Act
      await service.register(registerDto, '127.0.0.1', 'Test UserAgent');

      // Assert - uses existing tenant, doesn't create new one
      expect(mockTenantRepository.findOne).toHaveBeenCalled();
      expect(mockTenantRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should create profile with user details', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      mockTenantRepository.findOne.mockResolvedValue(mockTenant); // Main tenant exists
      mockTenantRepository.create.mockReturnValue(mockTenant);
      mockTenantRepository.save.mockResolvedValue(mockTenant);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockProfileRepository.create.mockReturnValue(mockProfile);
      mockProfileRepository.save.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Act
      await service.register(registerDto, '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(mockProfileRepository.create).toHaveBeenCalledWith({
        id: mockUser.id,
        user_id: mockUser.id,
        tenant_id: mockTenant.id,
        email: mockUser.email,
        first_name: registerDto.first_name,
        last_name: registerDto.last_name,
        role: GamilityRoleEnum.STUDENT,
        status: UserStatusEnum.ACTIVE,
        email_verified: false,
      });
    });

    it('should log successful auth attempt', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      mockTenantRepository.findOne.mockResolvedValue(mockTenant); // Main tenant exists
      mockTenantRepository.create.mockReturnValue(mockTenant);
      mockTenantRepository.save.mockResolvedValue(mockTenant);
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      mockProfileRepository.create.mockReturnValue(mockProfile);
      mockProfileRepository.save.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Act
      await service.register(registerDto, '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(mockAttemptRepository.create).toHaveBeenCalled();
      expect(mockAttemptRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      encrypted_password: '$2b$10$abc123', // Mock hashed password
      role: GamilityRoleEnum.STUDENT,
      deleted_at: null,
    };

    const mockProfile = {
      id: 'profile-1',
      user_id: 'user-1',
      tenant_id: 'tenant-1',
      email: 'test@example.com',
      role: GamilityRoleEnum.STUDENT,
    };

    it('should login user successfully with valid credentials', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});
      mockSessionRepository.create.mockReturnValue({});
      mockSessionRepository.save.mockResolvedValue({});
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');


      // Act
      const result = await service.login('test@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(result).toBeDefined();
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe('user-1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(mockSessionRepository.save).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if user does not exist', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Act & Assert
      await expect(service.login('nonexistent@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login('nonexistent@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        'Credenciales inválidas',
      );
      expect(mockAttemptRepository.save).toHaveBeenCalled(); // Failed attempt logged
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});

      // Override bcrypt.compare to return false for this test
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      // Act & Assert
      await expect(service.login('test@example.com', 'WrongPassword', '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAttemptRepository.save).toHaveBeenCalled(); // Failed attempt logged
    });

    it('should throw UnauthorizedException if user is deleted', async () => {
      // Arrange
      const deletedUser = { ...mockUser, deleted_at: new Date() };
      mockUserRepository.findOne.mockResolvedValue(deletedUser);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});


      // Act & Assert
      await expect(service.login('test@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login('test@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent')).rejects.toThrow(
        'Usuario no activo',
      );
    });

    it('should generate access token with 15 minutes expiration', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});
      mockSessionRepository.create.mockReturnValue({});
      mockSessionRepository.save.mockResolvedValue({});
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');


      // Act
      await service.login('test@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        1,
        { sub: mockUser.id, email: mockUser.email, role: mockUser.role },
        { expiresIn: '15m' },
      );
    });

    it('should generate refresh token with 7 days expiration', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});
      mockSessionRepository.create.mockReturnValue({});
      mockSessionRepository.save.mockResolvedValue({});
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');


      // Act
      await service.login('test@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(mockJwtService.sign).toHaveBeenNthCalledWith(
        2,
        { sub: mockUser.id, email: mockUser.email, role: mockUser.role },
        { expiresIn: '7d' },
      );
    });

    it('should create session with correct data', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});
      mockSessionRepository.create.mockReturnValue({});
      mockSessionRepository.save.mockResolvedValue({});
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');


      // Act
      await service.login('test@example.com', 'Password123!', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0)');

      // Assert
      expect(mockSessionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: mockProfile.id,
          tenant_id: mockProfile.tenant_id,
          ip_address: '127.0.0.1',
          user_agent: 'Mozilla/5.0 (Windows NT 10.0)',
          is_active: true,
        }),
      );
    });

    it('should log successful auth attempt', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockProfileRepository.findOne.mockResolvedValue(mockProfile);
      mockAttemptRepository.create.mockReturnValue({});
      mockAttemptRepository.save.mockResolvedValue({});
      mockSessionRepository.create.mockReturnValue({});
      mockSessionRepository.save.mockResolvedValue({});
      mockJwtService.sign.mockReturnValueOnce('access_token').mockReturnValueOnce('refresh_token');


      // Act
      await service.login('test@example.com', 'Password123!', '127.0.0.1', 'Test UserAgent');

      // Assert
      expect(mockAttemptRepository.save).toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    const mockUser = {
      id: 'user-1',
      email: 'test@example.com',
      role: GamilityRoleEnum.STUDENT,
      deleted_at: null,
    };

    it('should return user if exists and not deleted', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      const result = await service.validateUser('user-1');

      // Assert
      expect(result).toBeDefined();
      expect(result!.id).toBe('user-1');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
    });

    it('should return null if user does not exist', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act
      const result = await service.validateUser('non-existent-user');

      // Assert
      expect(result).toBeNull();
    });

    it('should return null if user is deleted', async () => {
      // Arrange
      const deletedUser = { ...mockUser, deleted_at: new Date() };
      mockUserRepository.findOne.mockResolvedValue(deletedUser);

      // Act
      const result = await service.validateUser('user-1');

      // Assert
      expect(result).toBeNull();
    });
  });
});
