import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  IsUrl,
  IsBoolean,
  IsObject,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionTierEnum } from '@shared/constants';

export class UpdateOrganizationDto {
  @ApiPropertyOptional({
    description: 'Organization name',
    example: 'Universidad Nacional Autónoma de México',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    description: 'Custom domain for the organization',
    example: 'unam.gamilit.com',
  })
  @IsOptional()
  @IsString()
  domain?: string;

  @ApiPropertyOptional({
    description: 'Logo URL for the organization',
    example: 'https://cdn.gamilit.com/logos/unam.png',
  })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiPropertyOptional({
    description: 'Subscription tier',
    enum: SubscriptionTierEnum,
    example: SubscriptionTierEnum.PROFESSIONAL,
  })
  @IsOptional()
  @IsEnum(SubscriptionTierEnum)
  subscription_tier?: SubscriptionTierEnum;

  @ApiPropertyOptional({
    description: 'Maximum number of users allowed',
    example: 500,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_users?: number;

  @ApiPropertyOptional({
    description: 'Maximum storage in GB',
    example: 50,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_storage_gb?: number;

  @ApiPropertyOptional({
    description: 'Is organization active',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({
    description: 'Organization settings (JSONB)',
    example: {
      theme: 'detective',
      features: { analytics_enabled: true },
      language: 'es',
    },
  })
  @IsOptional()
  @IsObject()
  settings?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Organization metadata (JSONB)',
    example: { billing_contact: 'admin@example.com', notes: 'Premium client' },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
