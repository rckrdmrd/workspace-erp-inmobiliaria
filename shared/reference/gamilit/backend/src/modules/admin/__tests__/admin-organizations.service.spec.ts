import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { AdminOrganizationsService } from '../services/admin-organizations.service';
import { Tenant } from '@modules/auth/entities/tenant.entity';
import { Membership } from '@modules/auth/entities/membership.entity';
import { User } from '@modules/auth/entities/user.entity';
import { Profile } from '@modules/auth/entities/profile.entity';
import {
  ListOrganizationsDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  GetOrganizationUsersDto,
  UpdateSubscriptionDto,
  UpdateFeaturesDto,
} from '../dto/organizations';
import { MembershipStatusEnum, GamilityRoleEnum, SubscriptionTierEnum } from '@shared/constants';

describe('AdminOrganizationsService', () => {
  let service: AdminOrganizationsService;
  let tenantRepo: Repository<Tenant>;
  let membershipRepo: Repository<Membership>;
  let userRepo: Repository<User>;
  let profileRepo: Repository<Profile>;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
    getCount: jest.fn(),
  };

  const mockTenantRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockMembershipRepo = {
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockUserRepo = {};
  const mockProfileRepo = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminOrganizationsService,
        {
          provide: getRepositoryToken(Tenant, 'auth'),
          useValue: mockTenantRepo,
        },
        {
          provide: getRepositoryToken(Membership, 'auth'),
          useValue: mockMembershipRepo,
        },
        {
          provide: getRepositoryToken(User, 'auth'),
          useValue: mockUserRepo,
        },
        {
          provide: getRepositoryToken(Profile, 'auth'),
          useValue: mockProfileRepo,
        },
      ],
    }).compile();

    service = module.get<AdminOrganizationsService>(
      AdminOrganizationsService,
    );
    tenantRepo = module.get(getRepositoryToken(Tenant, 'auth'));
    membershipRepo = module.get(getRepositoryToken(Membership, 'auth'));
    userRepo = module.get(getRepositoryToken(User, 'auth'));
    profileRepo = module.get(getRepositoryToken(Profile, 'auth'));

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('listOrganizations', () => {
    const mockOrganizations = [
      {
        id: 'org-1',
        name: 'UNAM',
        slug: 'unam',
        subscription_tier: SubscriptionTierEnum.PROFESSIONAL,
        is_active: true,
        created_at: new Date('2024-01-01'),
      },
      {
        id: 'org-2',
        name: 'ITAM',
        slug: 'itam',
        subscription_tier: SubscriptionTierEnum.BASIC,
        is_active: true,
        created_at: new Date('2024-01-02'),
      },
    ];

    beforeEach(() => {
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockOrganizations,
        mockOrganizations.length,
      ]);
    });

    it('should list organizations with default pagination', async () => {
      // Arrange
      const query: ListOrganizationsDto = {};

      // Act
      const result = await service.listOrganizations(query);

      // Assert
      expect(result).toBeDefined();
      expect(result.items).toHaveLength(2);
      expect(result.pagination.totalItems).toBe(2);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(20);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const query: ListOrganizationsDto = { page: 2, limit: 10 };
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockOrganizations,
        25,
      ]);

      // Act
      const result = await service.listOrganizations(query);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10); // (2 - 1) * 10
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.totalPages).toBe(3); // 25 / 10 = 2.5 => 3
    });

    it('should filter by search term', async () => {
      // Arrange
      const query: ListOrganizationsDto = { search: 'UNAM' };

      // Act
      await service.listOrganizations(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        '(tenant.name ILIKE :search OR tenant.slug ILIKE :search)',
        { search: '%UNAM%' },
      );
    });

    it('should filter by subscription tier', async () => {
      // Arrange
      const query: ListOrganizationsDto = { subscription_tier: SubscriptionTierEnum.PROFESSIONAL };

      // Act
      await service.listOrganizations(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'tenant.subscription_tier = :tier',
        { tier: 'professional' },
      );
    });

    it('should filter by is_active status', async () => {
      // Arrange
      const query: ListOrganizationsDto = { is_active: false };

      // Act
      await service.listOrganizations(query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'tenant.is_active = :is_active',
        { is_active: false },
      );
    });

    it('should order by created_at DESC', async () => {
      // Arrange
      const query: ListOrganizationsDto = {};

      // Act
      await service.listOrganizations(query);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'tenant.created_at',
        'DESC',
      );
    });

    it('should return empty array when no organizations found', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockResolvedValue([[], 0]);
      const query: ListOrganizationsDto = {};

      // Act
      const result = await service.listOrganizations(query);

      // Assert
      expect(result.items).toHaveLength(0);
      expect(result.pagination.totalItems).toBe(0);
    });
  });

  describe('getOrganization', () => {
    const mockOrganization = {
      id: 'org-1',
      name: 'UNAM',
      slug: 'unam',
      subscription_tier: SubscriptionTierEnum.PROFESSIONAL,
      is_active: true,
    };

    it('should return organization by ID', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);

      // Act
      const result = await service.getOrganization('org-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('org-1');
      expect(result.name).toBe('UNAM');
      expect(mockTenantRepo.findOne).toHaveBeenCalledWith({
        where: { id: 'org-1' },
      });
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getOrganization('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.getOrganization('non-existent')).rejects.toThrow(
        'Organization non-existent not found',
      );
    });
  });

  describe('createOrganization', () => {
    const createDto: CreateOrganizationDto = {
      name: 'Universidad de las Américas',
      slug: 'udlap',
      domain: 'udlap.mx',
      logo_url: 'https://example.com/logo.png',
      subscription_tier: SubscriptionTierEnum.PROFESSIONAL,
      max_users: 500,
      max_storage_gb: 50,
    };

    const mockCreatedOrg = {
      id: 'org-new',
      ...createDto,
      created_at: new Date(),
    };

    it('should create a new organization', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null); // No existing slug
      mockTenantRepo.create.mockReturnValue(mockCreatedOrg);
      mockTenantRepo.save.mockResolvedValue(mockCreatedOrg);

      // Act
      const result = await service.createOrganization(createDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe('org-new');
      expect(result.name).toBe('Universidad de las Américas');
      expect(mockTenantRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createDto.name,
          slug: createDto.slug,
          subscription_tier: createDto.subscription_tier,
        }),
      );
    });

    it('should set default values for optional fields', async () => {
      // Arrange
      const minimalDto: CreateOrganizationDto = {
        name: 'Test Org',
        slug: 'test-org',
        subscription_tier: SubscriptionTierEnum.BASIC,
      };
      mockTenantRepo.findOne.mockResolvedValue(null);
      mockTenantRepo.create.mockImplementation((dto) => dto as any);
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.createOrganization(minimalDto);

      // Assert
      expect(mockTenantRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          max_users: 100,
          max_storage_gb: 5,
          settings: expect.objectContaining({
            theme: 'detective',
            language: 'es',
            timezone: 'America/Mexico_City',
          }),
        }),
      );
    });

    it('should throw ConflictException if slug already exists', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue({
        id: 'org-existing',
        slug: 'udlap',
      });

      // Act & Assert
      await expect(service.createOrganization(createDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.createOrganization(createDto)).rejects.toThrow(
        "Organization with slug 'udlap' already exists",
      );
      expect(mockTenantRepo.save).not.toHaveBeenCalled();
    });

    it('should include default settings with features', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);
      mockTenantRepo.create.mockImplementation((dto) => dto as any);
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.createOrganization(createDto);

      // Assert
      expect(mockTenantRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            features: {
              analytics_enabled: true,
              gamification_enabled: true,
              social_features_enabled: true,
            },
          }),
        }),
      );
    });
  });

  describe('updateOrganization', () => {
    const mockOrganization = {
      id: 'org-1',
      name: 'UNAM',
      slug: 'unam',
      subscription_tier: SubscriptionTierEnum.BASIC,
    };

    const updateDto: UpdateOrganizationDto = {
      name: 'UNAM - Universidad Nacional',
      subscription_tier: SubscriptionTierEnum.PROFESSIONAL,
    };

    it('should update organization successfully', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockTenantRepo.save.mockResolvedValue({
        ...mockOrganization,
        ...updateDto,
      });

      // Act
      const result = await service.updateOrganization('org-1', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(result.name).toBe('UNAM - Universidad Nacional');
      expect(result.subscription_tier).toBe('professional');
      expect(mockTenantRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateOrganization('non-existent', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should only update provided fields', async () => {
      // Arrange
      const partialUpdate: UpdateOrganizationDto = {
        name: 'New Name',
      };
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.updateOrganization('org-1', partialUpdate);

      // Assert
      expect(mockTenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Name',
          slug: 'unam', // Should remain unchanged
        }),
      );
    });
  });

  describe('deleteOrganization', () => {
    const mockOrganization = {
      id: 'org-1',
      name: 'UNAM',
      slug: 'unam',
    };

    it('should delete organization successfully when no active members', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockMembershipRepo.count.mockResolvedValue(0); // No active members
      mockTenantRepo.remove.mockResolvedValue(mockOrganization);

      // Act
      await service.deleteOrganization('org-1');

      // Assert
      expect(mockTenantRepo.remove).toHaveBeenCalledWith(mockOrganization);
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deleteOrganization('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(mockTenantRepo.remove).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if organization has active members', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockMembershipRepo.count.mockResolvedValue(15); // 15 active members

      // Act & Assert
      await expect(service.deleteOrganization('org-1')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.deleteOrganization('org-1')).rejects.toThrow(
        'Cannot delete organization with 15 active members',
      );
      expect(mockTenantRepo.remove).not.toHaveBeenCalled();
    });

    it('should check for ACTIVE memberships only', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockMembershipRepo.count.mockResolvedValue(0);

      // Act
      await service.deleteOrganization('org-1');

      // Assert
      expect(mockMembershipRepo.count).toHaveBeenCalledWith({
        where: { tenant_id: 'org-1', status: MembershipStatusEnum.ACTIVE },
      });
    });
  });

  describe('getOrganizationStats', () => {
    const mockOrganization = {
      id: 'org-1',
      name: 'UNAM',
      max_users: 100,
      max_storage_gb: 10,
      trial_ends_at: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    };

    beforeEach(() => {
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockMembershipRepo.count
        .mockResolvedValueOnce(50) // total
        .mockResolvedValueOnce(40) // active
        .mockResolvedValueOnce(5) // pending
        .mockResolvedValueOnce(5); // suspended
      mockQueryBuilder.getCount.mockResolvedValue(12); // recent members
    });

    it('should return organization statistics', async () => {
      // Act
      const result = await service.getOrganizationStats('org-1');

      // Assert
      expect(result).toBeDefined();
      expect(result.organization_id).toBe('org-1');
      expect(result.organization_name).toBe('UNAM');
      expect(result.total_members).toBe(50);
      expect(result.active_members).toBe(40);
      expect(result.pending_members).toBe(5);
      expect(result.suspended_members).toBe(5);
      expect(result.max_users).toBe(100);
      expect(result.max_storage_gb).toBe(10);
      expect(result.members_last_30_days).toBe(12);
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getOrganizationStats('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should calculate trial status correctly when in trial', async () => {
      // Act
      const result = await service.getOrganizationStats('org-1');

      // Assert
      expect(result.is_trial).toBe(true);
      expect(result.trial_days_remaining).toBeGreaterThanOrEqual(9);
      expect(result.trial_days_remaining).toBeLessThanOrEqual(10);
    });

    it('should return false for is_trial when trial expired', async () => {
      // Arrange
      const expiredOrg = {
        ...mockOrganization,
        trial_ends_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      };
      mockTenantRepo.findOne.mockResolvedValue(expiredOrg);

      // Act
      const result = await service.getOrganizationStats('org-1');

      // Assert
      expect(result.is_trial).toBe(false);
      expect(result.trial_days_remaining).toBeNull();
    });

    it('should return false for is_trial when no trial_ends_at', async () => {
      // Arrange
      const noTrialOrg = {
        ...mockOrganization,
        trial_ends_at: null,
      };
      mockTenantRepo.findOne.mockResolvedValue(noTrialOrg);

      // Act
      const result = await service.getOrganizationStats('org-1');

      // Assert
      expect(result.is_trial).toBe(false);
      expect(result.trial_days_remaining).toBeNull();
    });

    it('should count recent members correctly', async () => {
      // Act
      await service.getOrganizationStats('org-1');

      // Assert
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'membership.tenant_id = :tenant_id',
        { tenant_id: 'org-1' },
      );
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'membership.joined_at > :date',
        expect.objectContaining({
          date: expect.any(Date),
        }),
      );
    });
  });

  describe('getOrganizationUsers', () => {
    const mockOrganization = {
      id: 'org-1',
      name: 'UNAM',
    };

    const mockMemberships = [
      {
        user_id: 'user-1',
        tenant_id: 'org-1',
        role: 'member',
        status: MembershipStatusEnum.ACTIVE,
        joined_at: new Date('2024-01-01'),
        user: {
          email: 'user1@unam.mx',
          role: GamilityRoleEnum.STUDENT,
          last_sign_in_at: new Date(),
          profile: {
            full_name: 'Juan Pérez',
          },
        },
      },
      {
        user_id: 'user-2',
        tenant_id: 'org-1',
        role: 'admin',
        status: MembershipStatusEnum.ACTIVE,
        joined_at: new Date('2024-01-02'),
        user: {
          email: 'admin@unam.mx',
          role: GamilityRoleEnum.ADMIN_TEACHER,
          last_sign_in_at: new Date(),
          profile: {
            full_name: 'María González',
          },
        },
      },
    ];

    beforeEach(() => {
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockQueryBuilder.getManyAndCount.mockResolvedValue([
        mockMemberships,
        mockMemberships.length,
      ]);
    });

    it('should return organization users with pagination', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = {};

      // Act
      const result = await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);
      const query: GetOrganizationUsersDto = {};

      // Act & Assert
      await expect(
        service.getOrganizationUsers('non-existent', query),
      ).rejects.toThrow(NotFoundException);
    });

    it('should filter by role', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = { role: GamilityRoleEnum.ADMIN_TEACHER };

      // Act
      await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'user.role = :role',
        { role: GamilityRoleEnum.ADMIN_TEACHER },
      );
    });

    it('should filter by membership status', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = {
        status: MembershipStatusEnum.PENDING,
      };

      // Act
      await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'membership.status = :status',
        { status: MembershipStatusEnum.PENDING },
      );
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = { page: 2, limit: 10 };

      // Act
      await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
    });

    it('should join user and profile tables', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = {};

      // Act
      await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'membership.user',
        'user',
      );
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith(
        'user.profile',
        'profile',
      );
    });

    it('should order by joined_at DESC', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = {};

      // Act
      await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith(
        'membership.joined_at',
        'DESC',
      );
    });

    it('should transform memberships to DTOs', async () => {
      // Arrange
      const query: GetOrganizationUsersDto = {};

      // Act
      const result = await service.getOrganizationUsers('org-1', query);

      // Assert
      expect(result.data[0]).toEqual({
        user_id: 'user-1',
        email: 'user1@unam.mx',
        full_name: 'Juan Pérez',
        role: GamilityRoleEnum.STUDENT,
        membership_role: 'member',
        membership_status: MembershipStatusEnum.ACTIVE,
        joined_at: expect.any(Date),
        last_active_at: expect.any(Date),
      });
    });
  });

  describe('updateSubscription', () => {
    const getMockOrganization = () => ({
      id: 'org-1',
      name: 'UNAM',
      subscription_tier: SubscriptionTierEnum.BASIC,
      max_users: 100,
      max_storage_gb: 5,
      trial_ends_at: null,
    });

    const updateDto: UpdateSubscriptionDto = {
      subscription_tier: SubscriptionTierEnum.PROFESSIONAL,
      max_users: 500,
      max_storage_gb: 50,
      trial_ends_at: '2024-12-31T00:00:00.000Z',
    };

    it('should update subscription successfully', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(getMockOrganization());
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateSubscription('org-1', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockTenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          subscription_tier: SubscriptionTierEnum.PROFESSIONAL,
          max_users: 500,
          max_storage_gb: 50,
          trial_ends_at: expect.any(Date),
        }),
      );
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateSubscription('non-existent', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update only provided fields', async () => {
      // Arrange
      const partialUpdate: UpdateSubscriptionDto = {
        max_users: 200,
      };
      mockTenantRepo.findOne.mockResolvedValue(getMockOrganization());
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.updateSubscription('org-1', partialUpdate);

      // Assert
      expect(mockTenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          subscription_tier: SubscriptionTierEnum.BASIC, // Should remain unchanged
          max_users: 200,
          max_storage_gb: 5, // Should remain unchanged
        }),
      );
    });
  });

  describe('updateFeatures', () => {
    const mockOrganization = {
      id: 'org-1',
      name: 'UNAM',
      settings: {
        theme: 'detective',
        features: {
          analytics_enabled: true,
          gamification_enabled: true,
          social_features_enabled: true,
        },
      },
    };

    const updateDto: UpdateFeaturesDto = {
      features: {
        analytics_enabled: false,
        custom_branding_enabled: true,
      },
    };

    it('should update feature flags successfully', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      const result = await service.updateFeatures('org-1', updateDto);

      // Assert
      expect(result).toBeDefined();
      expect(mockTenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            theme: 'detective', // Preserved
            features: expect.objectContaining({
              analytics_enabled: false, // Updated
              gamification_enabled: true, // Preserved
              social_features_enabled: true, // Preserved
              custom_branding_enabled: true, // New
            }),
          }),
        }),
      );
    });

    it('should throw NotFoundException if organization not found', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.updateFeatures('non-existent', updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle organization without existing settings', async () => {
      // Arrange
      const orgWithoutSettings = {
        id: 'org-1',
        name: 'UNAM',
        settings: null,
      };
      mockTenantRepo.findOne.mockResolvedValue(orgWithoutSettings);
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.updateFeatures('org-1', updateDto);

      // Assert
      expect(mockTenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            features: updateDto.features,
          }),
        }),
      );
    });

    it('should merge features without overwriting other settings', async () => {
      // Arrange
      mockTenantRepo.findOne.mockResolvedValue(mockOrganization);
      mockTenantRepo.save.mockImplementation((entity) =>
        Promise.resolve(entity),
      );

      // Act
      await service.updateFeatures('org-1', updateDto);

      // Assert
      expect(mockTenantRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          settings: expect.objectContaining({
            theme: 'detective', // Other settings preserved
          }),
        }),
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle repository errors in listOrganizations', async () => {
      // Arrange
      mockQueryBuilder.getManyAndCount.mockRejectedValue(
        new Error('Database error'),
      );

      // Act & Assert
      await expect(service.listOrganizations({})).rejects.toThrow(
        'Database error',
      );
    });

    it('should handle repository errors in getOrganizationStats', async () => {
      // Arrange
      mockTenantRepo.findOne.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.getOrganizationStats('org-1')).rejects.toThrow(
        'Database error',
      );
    });
  });
});
