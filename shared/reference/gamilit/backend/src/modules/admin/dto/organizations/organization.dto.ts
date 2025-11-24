import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SubscriptionTierEnum } from '@shared/constants';

export class OrganizationDto {
  @ApiProperty({ description: 'Organization ID (UUID)', example: 'abc123...' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Organization name', example: 'Universidad Nacional' })
  @Expose()
  name!: string;

  @ApiProperty({ description: 'URL-friendly slug', example: 'universidad-nacional' })
  @Expose()
  slug!: string;

  @ApiPropertyOptional({ description: 'Custom domain', example: 'universidad.gamilit.com' })
  @Expose()
  domain!: string | null;

  @ApiPropertyOptional({ description: 'Logo URL', example: 'https://cdn.gamilit.com/logo.png' })
  @Expose()
  logo_url!: string | null;

  @ApiProperty({
    description: 'Subscription tier',
    enum: SubscriptionTierEnum,
    example: SubscriptionTierEnum.PROFESSIONAL,
  })
  @Expose()
  subscription_tier!: SubscriptionTierEnum;

  @ApiProperty({ description: 'Maximum users allowed', example: 500 })
  @Expose()
  max_users!: number;

  @ApiProperty({ description: 'Maximum storage in GB', example: 50 })
  @Expose()
  max_storage_gb!: number;

  @ApiProperty({ description: 'Is organization active', example: true })
  @Expose()
  is_active!: boolean;

  @ApiPropertyOptional({ description: 'Trial end date', example: '2025-12-31T23:59:59Z' })
  @Expose()
  trial_ends_at!: Date | null;

  @ApiProperty({ description: 'Organization settings', example: { theme: 'detective' } })
  @Expose()
  settings!: Record<string, any>;

  @ApiProperty({ description: 'Organization metadata', example: { notes: '...' } })
  @Expose()
  metadata!: Record<string, any>;

  @ApiProperty({ description: 'Creation date', example: '2025-01-15T10:00:00Z' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ description: 'Last update date', example: '2025-11-02T12:00:00Z' })
  @Expose()
  updated_at!: Date;
}
