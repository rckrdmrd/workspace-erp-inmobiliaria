import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { AuthService } from '../services/auth.service';
import { User, Profile, Tenant, UserSession, AuthAttempt } from '../entities';
import { GamilityRoleEnum } from '@shared/constants';

describe('AuthService - Derived Fields (emailVerified & isActive)', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

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
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockSessionRepository = {
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockAttemptRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
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
    userRepository = module.get<Repository<User>>(
      getRepositoryToken(User, 'auth'),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('toUserResponse - emailVerified field', () => {
    it('should set emailVerified to true when email_confirmed_at has value', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date('2025-11-10T10:00:00Z'),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.emailVerified).toBe(true);
      expect(result).not.toHaveProperty('encrypted_password');
    });

    it('should set emailVerified to false when email_confirmed_at is null', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'unverified@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: undefined,
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.emailVerified).toBe(false);
    });

    it('should set emailVerified to false when email_confirmed_at is undefined', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'unverified2@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: undefined,
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.emailVerified).toBe(false);
    });
  });

  describe('toUserResponse - isActive field', () => {
    it('should set isActive to true when user is not deleted and not banned', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'active@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date(),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.isActive).toBe(true);
    });

    it('should set isActive to false when user is deleted (deleted_at has value)', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'deleted@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date(),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: new Date('2025-11-09T10:00:00Z'),
        banned_until: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.isActive).toBe(false);
    });

    it('should set isActive to false when user is currently banned', async () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7); // Banned for 7 more days

      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'banned@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date(),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: futureDate,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.isActive).toBe(false);
    });

    it('should set isActive to true when ban has expired (banned_until in the past)', async () => {
      // Arrange
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 7); // Ban expired 7 days ago

      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'unbanned@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date(),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: pastDate,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.isActive).toBe(true);
    });

    it('should set isActive to false when user is both deleted and banned', async () => {
      // Arrange
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'deleted-and-banned@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date(),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: new Date(),
        banned_until: futureDate,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.isActive).toBe(false);
    });
  });

  describe('toUserResponse - security', () => {
    it('should NOT include encrypted_password in response', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        encrypted_password: 'super_secret_hash',
        role: GamilityRoleEnum.STUDENT,
        email_confirmed_at: new Date(),
        is_super_admin: false,
        raw_user_meta_data: {},
        deleted_at: undefined,
        banned_until: undefined,
        created_at: new Date(),
        updated_at: new Date(),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result).not.toHaveProperty('encrypted_password');
      expect(result.email).toBe('test@example.com');
    });

    it('should include all other user fields', async () => {
      // Arrange
      const mockUser = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'test@example.com',
        encrypted_password: 'hashed_password',
        role: GamilityRoleEnum.ADMIN_TEACHER,
        status: 'active',
        email_confirmed_at: new Date('2025-11-10T10:00:00Z'),
        phone: '+52123456789',
        phone_confirmed_at: new Date('2025-11-10T11:00:00Z'),
        is_super_admin: false,
        banned_until: undefined,
        last_sign_in_at: new Date('2025-11-11T09:00:00Z'),
        raw_user_meta_data: { timezone: 'America/Mexico_City' },
        deleted_at: undefined,
        created_at: new Date('2025-01-01T00:00:00Z'),
        updated_at: new Date('2025-11-11T09:00:00Z'),
      } as User;

      // Act
      const result = await service['toUserResponse'](mockUser);

      // Assert
      expect(result.id).toBe(mockUser.id);
      expect(result.email).toBe(mockUser.email);
      expect(result.role).toBe(GamilityRoleEnum.ADMIN_TEACHER);
      expect(result.email_confirmed_at).toEqual(mockUser.email_confirmed_at);
      expect(result.phone).toBe('+52123456789');
      expect(result.phone_confirmed_at).toEqual(mockUser.phone_confirmed_at);
      expect(result.is_super_admin).toBe(false);
      expect(result.last_sign_in_at).toEqual(mockUser.last_sign_in_at);
      expect(result.raw_user_meta_data).toEqual(mockUser.raw_user_meta_data);
      expect(result.created_at).toEqual(mockUser.created_at);
      expect(result.updated_at).toEqual(mockUser.updated_at);
      // Derived fields
      expect(result.emailVerified).toBe(true);
      expect(result.isActive).toBe(true);
    });
  });
});
