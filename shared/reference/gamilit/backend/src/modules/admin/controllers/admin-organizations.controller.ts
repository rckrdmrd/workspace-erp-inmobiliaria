import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { AdminOrganizationsService } from '../services/admin-organizations.service';
import {
  ListOrganizationsDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
  OrganizationDto,
  PaginatedOrganizationsDto,
  OrganizationStatsDto,
  GetOrganizationUsersDto,
  PaginatedOrganizationUsersDto,
  UpdateSubscriptionDto,
  UpdateFeaturesDto,
} from '../dto/organizations';

@ApiTags('Admin - Organizations')
@Controller('admin/organizations')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminOrganizationsController {
  constructor(
    private readonly adminOrganizationsService: AdminOrganizationsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List organizations with filters and pagination',
    description:
      'Retrieve a paginated list of organizations (tenants) with optional filters',
  })
  async listOrganizations(
    @Query() query: ListOrganizationsDto,
  ): Promise<PaginatedOrganizationsDto> {
    return await this.adminOrganizationsService.listOrganizations(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get organization by ID',
    description: 'Retrieve details of a specific organization by its ID',
  })
  async getOrganization(@Param('id') id: string): Promise<OrganizationDto> {
    return await this.adminOrganizationsService.getOrganization(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new organization',
    description: 'Create a new tenant/organization in the system',
  })
  async createOrganization(
    @Body() createDto: CreateOrganizationDto,
  ): Promise<OrganizationDto> {
    return await this.adminOrganizationsService.createOrganization(createDto);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an organization',
    description: 'Update an existing organization by ID',
  })
  async updateOrganization(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganizationDto,
  ): Promise<OrganizationDto> {
    return await this.adminOrganizationsService.updateOrganization(
      id,
      updateDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete an organization',
    description:
      'Delete an organization. Fails if organization has active members.',
  })
  async deleteOrganization(@Param('id') id: string): Promise<void> {
    await this.adminOrganizationsService.deleteOrganization(id);
  }

  @Get(':id/stats')
  @ApiOperation({
    summary: 'Get organization statistics',
    description:
      'Retrieve detailed statistics for a specific organization including member counts, storage usage, and trial info',
  })
  async getOrganizationStats(
    @Param('id') id: string,
  ): Promise<OrganizationStatsDto> {
    return await this.adminOrganizationsService.getOrganizationStats(id);
  }

  @Get(':id/users')
  @ApiOperation({
    summary: 'Get organization users',
    description:
      'Retrieve a paginated list of users belonging to a specific organization with their membership details',
  })
  async getOrganizationUsers(
    @Param('id') id: string,
    @Query() query: GetOrganizationUsersDto,
  ): Promise<PaginatedOrganizationUsersDto> {
    return await this.adminOrganizationsService.getOrganizationUsers(id, query);
  }

  @Patch(':id/subscription')
  @ApiOperation({
    summary: 'Update organization subscription',
    description:
      'Update subscription tier, limits, and trial information for an organization',
  })
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateDto: UpdateSubscriptionDto,
  ): Promise<OrganizationDto> {
    return await this.adminOrganizationsService.updateSubscription(id, updateDto);
  }

  @Patch(':id/features')
  @ApiOperation({
    summary: 'Update organization feature flags',
    description:
      'Enable or disable specific features for an organization',
  })
  async updateFeatures(
    @Param('id') id: string,
    @Body() updateDto: UpdateFeaturesDto,
  ): Promise<OrganizationDto> {
    return await this.adminOrganizationsService.updateFeatures(id, updateDto);
  }
}
