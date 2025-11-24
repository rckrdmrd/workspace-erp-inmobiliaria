import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsUrl,
  IsObject,
  Matches,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionTierEnum } from '@shared/constants';

export class CreateOrganizationDto {
  @ApiProperty({
    description: 'Organization name',
    example: 'Universidad Nacional Autónoma de México',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiProperty({
    description: 'URL-friendly slug (lowercase, alphanumeric with hyphens)',
    example: 'unam-fes-aragon',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase alphanumeric with hyphens only',
  })
  @MaxLength(100)
  slug!: string;

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

  @ApiProperty({
    description: 'Subscription tier',
    enum: SubscriptionTierEnum,
    example: SubscriptionTierEnum.PROFESSIONAL,
    default: SubscriptionTierEnum.FREE,
  })
  @IsOptional()
  @IsEnum(SubscriptionTierEnum)
  subscription_tier?: SubscriptionTierEnum;

  @ApiPropertyOptional({
    description: 'Maximum number of users allowed',
    example: 500,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_users?: number;

  @ApiPropertyOptional({
    description: 'Maximum storage in GB',
    example: 50,
    default: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  max_storage_gb?: number;

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
