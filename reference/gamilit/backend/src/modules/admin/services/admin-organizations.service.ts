import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThan } from 'typeorm';
import { Tenant } from '@modules/auth/entities/tenant.entity';
import { Membership } from '@modules/auth/entities/membership.entity';
import {
  ListOrganizationsDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationStatsDto,
  PaginatedOrganizationsDto,
  OrganizationDto,
  GetOrganizationUsersDto,
  PaginatedOrganizationUsersDto,
  UpdateSubscriptionDto,
  UpdateFeaturesDto,
} from '../dto/organizations';
import { MembershipStatusEnum } from '@shared/constants';
import { User } from '@modules/auth/entities/user.entity';
import { Profile } from '@modules/auth/entities/profile.entity';

@Injectable()
export class AdminOrganizationsService {
  constructor(
    @InjectRepository(Tenant, 'auth')
    private readonly tenantRepo: Repository<Tenant>,
    @InjectRepository(Membership, 'auth')
    private readonly membershipRepo: Repository<Membership>,
    @InjectRepository(User, 'auth')
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile, 'auth')
    private readonly profileRepo: Repository<Profile>,
  ) {}

  /**
   * List organizations with filters and pagination
   */
  async listOrganizations(
    query: ListOrganizationsDto,
  ): Promise<PaginatedOrganizationsDto> {
    const {
      search,
      subscription_tier,
      is_active,
      page = 1,
      limit = 20,
    } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.tenantRepo.createQueryBuilder('tenant');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(tenant.name ILIKE :search OR tenant.slug ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply subscription tier filter
    if (subscription_tier) {
      queryBuilder.andWhere('tenant.subscription_tier = :tier', {
        tier: subscription_tier,
      });
    }

    // Apply active status filter
    if (is_active !== undefined) {
      queryBuilder.andWhere('tenant.is_active = :is_active', { is_active });
    }

    // Pagination and ordering
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .orderBy('tenant.created_at', 'DESC')
      .getManyAndCount();

    return {
      items: data as any,
      pagination: {
        page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        limit,
      },
    };
  }

  /**
   * Get organization by ID
   */
  async getOrganization(id: string): Promise<OrganizationDto> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    return tenant as any;
  }

  /**
   * Create a new organization (tenant)
   */
  async createOrganization(
    createDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    // Check if slug already exists
    const existingSlug = await this.tenantRepo.findOne({
      where: { slug: createDto.slug },
    });

    if (existingSlug) {
      throw new ConflictException(
        `Organization with slug '${createDto.slug}' already exists`,
      );
    }

    // Create new tenant
    const tenant = this.tenantRepo.create({
      name: createDto.name,
      slug: createDto.slug,
      domain: createDto.domain || null,
      logo_url: createDto.logo_url || null,
      subscription_tier: createDto.subscription_tier,
      max_users: createDto.max_users || 100,
      max_storage_gb: createDto.max_storage_gb || 5,
      settings: createDto.settings || {
        theme: 'detective',
        features: {
          analytics_enabled: true,
          gamification_enabled: true,
          social_features_enabled: true,
        },
        language: 'es',
        timezone: 'America/Mexico_City',
      },
      metadata: createDto.metadata || {},
    });

    const saved = await this.tenantRepo.save(tenant);
    return saved as any;
  }

  /**
   * Update an existing organization
   */
  async updateOrganization(
    id: string,
    updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    // Update fields
    Object.assign(tenant, updateDto);

    const updated = await this.tenantRepo.save(tenant);
    return updated as any;
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(id: string): Promise<void> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    // Check if organization has active members
    const memberCount = await this.membershipRepo.count({
      where: { tenant_id: id, status: MembershipStatusEnum.ACTIVE },
    });

    if (memberCount > 0) {
      throw new BadRequestException(
        `Cannot delete organization with ${memberCount} active members. Remove or transfer members first.`,
      );
    }

    await this.tenantRepo.remove(tenant);
  }

  /**
   * Get statistics for a specific organization
   */
  async getOrganizationStats(id: string): Promise<OrganizationStatsDto> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    // Get membership counts
    const totalMembers = await this.membershipRepo.count({
      where: { tenant_id: id },
    });

    const activeMembers = await this.membershipRepo.count({
      where: { tenant_id: id, status: MembershipStatusEnum.ACTIVE },
    });

    const pendingMembers = await this.membershipRepo.count({
      where: { tenant_id: id, status: MembershipStatusEnum.PENDING },
    });

    const suspendedMembers = await this.membershipRepo.count({
      where: { tenant_id: id, status: MembershipStatusEnum.SUSPENDED },
    });

    // Get members added in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMembers = await this.membershipRepo
      .createQueryBuilder('membership')
      .where('membership.tenant_id = :tenant_id', { tenant_id: id })
      .andWhere('membership.joined_at > :date', { date: thirtyDaysAgo })
      .getCount();

    // Calculate trial info
    const now = new Date();
    const isTrial = tenant.trial_ends_at ? tenant.trial_ends_at > now : false;
    let trialDaysRemaining: number | null = null;

    if (isTrial && tenant.trial_ends_at) {
      const diffTime = tenant.trial_ends_at.getTime() - now.getTime();
      trialDaysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // TODO: Implement actual storage calculation from file uploads
    const storageUsedGb = 0; // Placeholder

    return {
      organization_id: tenant.id,
      organization_name: tenant.name,
      total_members: totalMembers,
      active_members: activeMembers,
      pending_members: pendingMembers,
      suspended_members: suspendedMembers,
      max_users: tenant.max_users,
      storage_used_gb: storageUsedGb,
      max_storage_gb: tenant.max_storage_gb,
      members_last_30_days: recentMembers,
      is_trial: isTrial,
      trial_days_remaining: trialDaysRemaining,
    };
  }

  /**
   * Get organization users with pagination and filters
   */
  async getOrganizationUsers(
    id: string,
    query: GetOrganizationUsersDto,
  ): Promise<PaginatedOrganizationUsersDto> {
    // Verify organization exists
    const tenant = await this.tenantRepo.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    const { page = 1, limit = 20, role, status } = query;
    const skip = (page - 1) * limit;

    // Build query with joins
    const queryBuilder = this.membershipRepo
      .createQueryBuilder('membership')
      .leftJoinAndSelect('membership.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('membership.tenant_id = :tenant_id', { tenant_id: id });

    // Apply role filter
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('membership.status = :status', { status });
    }

    // Pagination and ordering
    queryBuilder.skip(skip).take(limit).orderBy('membership.joined_at', 'DESC');

    const [memberships, total] = await queryBuilder.getManyAndCount();

    // Transform to DTOs
    const data = memberships.map((membership) => ({
      user_id: membership.user_id,
      email: membership.user?.email || '',
      full_name: undefined, // Profile relation not available due to cross-datasource limitation
      role: membership.user?.role || '',
      membership_role: membership.role,
      membership_status: membership.status,
      joined_at: membership.joined_at,
      last_active_at: membership.user?.last_sign_in_at || undefined,
    }));

    return {
      data,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  /**
   * Update organization subscription
   */
  async updateSubscription(
    id: string,
    updateDto: UpdateSubscriptionDto,
  ): Promise<OrganizationDto> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    // Update subscription fields
    if (updateDto.subscription_tier !== undefined) {
      tenant.subscription_tier = updateDto.subscription_tier;
    }

    if (updateDto.max_users !== undefined) {
      tenant.max_users = updateDto.max_users;
    }

    if (updateDto.max_storage_gb !== undefined) {
      tenant.max_storage_gb = updateDto.max_storage_gb;
    }

    if (updateDto.trial_ends_at !== undefined) {
      tenant.trial_ends_at = new Date(updateDto.trial_ends_at);
    }

    const updated = await this.tenantRepo.save(tenant);
    return updated as any;
  }

  /**
   * Update organization feature flags
   */
  async updateFeatures(
    id: string,
    updateDto: UpdateFeaturesDto,
  ): Promise<OrganizationDto> {
    const tenant = await this.tenantRepo.findOne({ where: { id } });

    if (!tenant) {
      throw new NotFoundException(`Organization ${id} not found`);
    }

    // Merge features into settings.features
    const currentSettings = tenant.settings || {};
    const currentFeatures = currentSettings.features || {};

    tenant.settings = {
      ...currentSettings,
      features: {
        ...currentFeatures,
        ...updateDto.features,
      },
    };

    const updated = await this.tenantRepo.save(tenant);
    return updated as any;
  }
}
