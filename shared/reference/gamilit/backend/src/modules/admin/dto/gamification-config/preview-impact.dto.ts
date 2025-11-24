import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';
import { UpdateGamificationSettingsDto } from './update-gamification-settings.dto';

/**
 * Preview Impact DTO
 *
 * @description Request DTO for previewing impact of new settings
 * @extends UpdateGamificationSettingsDto with additional preview options
 */
export class PreviewImpactDto extends UpdateGamificationSettingsDto {
  @ApiPropertyOptional({
    description:
      'Sample size for preview calculation (max 10000). Larger samples take longer but are more accurate.',
    example: 1000,
    minimum: 100,
    maximum: 10000,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(10000)
  sample_size?: number;
}

/**
 * Rank Changes DTO
 *
 * @description Estimated rank changes from new thresholds
 */
export class RankChangesDto {
  @ApiProperty({
    description: 'Number of users who would be promoted to higher rank',
    example: 45,
  })
  promotions!: number;

  @ApiProperty({
    description: 'Number of users who would be demoted to lower rank',
    example: 12,
  })
  demotions!: number;
}

/**
 * XP Impact DTO
 *
 * @description Estimated XP changes from new configuration
 */
export class XpImpactDto {
  @ApiProperty({
    description: 'Average XP change per user',
    example: 15.5,
  })
  avg_xp_change!: number;

  @ApiProperty({
    description: 'Total XP change across all affected users',
    example: 19000,
  })
  total_xp_change!: number;
}

/**
 * Coins Impact DTO
 *
 * @description Estimated ML Coins changes from new configuration
 */
export class CoinsImpactDto {
  @ApiProperty({
    description: 'Average coins change per user',
    example: 50,
  })
  avg_coins_change!: number;

  @ApiProperty({
    description: 'Total coins change across all affected users',
    example: 61700,
  })
  total_coins_change!: number;
}

/**
 * Preview Impact Result DTO
 *
 * @description Response with estimated impact metrics
 */
export class PreviewImpactResultDto {
  @ApiProperty({
    description: 'Total number of users affected by the changes',
    example: 1234,
  })
  users_affected!: number;

  @ApiProperty({
    description: 'Estimated rank changes',
    type: RankChangesDto,
  })
  rank_changes!: RankChangesDto;

  @ApiProperty({
    description: 'Estimated XP impact',
    type: XpImpactDto,
  })
  xp_impact!: XpImpactDto;

  @ApiProperty({
    description: 'Estimated ML Coins impact',
    type: CoinsImpactDto,
  })
  coins_impact!: CoinsImpactDto;

  @ApiProperty({
    description: 'Timestamp when preview was calculated',
    example: '2025-11-11T20:00:00.000Z',
  })
  preview_timestamp!: string;
}

/**
 * Restore Defaults Result DTO
 *
 * @description Response after restoring default settings
 */
export class RestoreDefaultsResultDto {
  @ApiProperty({
    description: 'List of setting keys that were restored to defaults',
    example: [
      'gamification.xp.base_per_exercise',
      'gamification.ranks.thresholds',
      'gamification.coins.welcome_bonus',
    ],
  })
  settings_restored!: string[];

  @ApiProperty({
    description: 'Timestamp when settings were restored',
    example: '2025-11-11T20:00:00.000Z',
  })
  restored_at!: string;

  @ApiProperty({
    description: 'Admin user ID who performed the restore',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  restored_by!: string;
}
