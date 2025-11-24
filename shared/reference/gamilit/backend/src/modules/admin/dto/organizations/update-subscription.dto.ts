import { IsEnum, IsOptional, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SubscriptionTierEnum } from '@shared/constants';

export class UpdateSubscriptionDto {
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
    description: 'Trial end date (ISO 8601)',
    example: '2025-12-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  trial_ends_at?: string;
}
