import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * XP Settings DTO
 *
 * @description Configuration for XP (Experience Points) system
 */
export class XpSettingsDto {
  @ApiProperty({
    description: 'Base XP awarded per exercise completion',
    example: 10,
    minimum: 1,
    maximum: 1000,
  })
  @IsNumber()
  @Min(1)
  @Max(1000)
  base_per_exercise!: number;

  @ApiProperty({
    description: 'Multiplier applied when exercise is completed',
    example: 1.5,
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  completion_multiplier!: number;

  @ApiPropertyOptional({
    description: 'Bonus multiplier for perfect score',
    example: 2.0,
    minimum: 1,
    maximum: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  perfect_score_bonus?: number;
}

/**
 * Rank Thresholds DTO
 *
 * @description XP thresholds required for each rank level
 * @important Thresholds must be in ascending order
 */
export class RankThresholdsDto {
  @ApiProperty({
    description: 'XP required for Novice rank',
    example: 0,
  })
  @IsNumber()
  @Min(0)
  novice!: number;

  @ApiProperty({
    description: 'XP required for Beginner rank',
    example: 100,
  })
  @IsNumber()
  @Min(0)
  beginner!: number;

  @ApiProperty({
    description: 'XP required for Intermediate rank',
    example: 500,
  })
  @IsNumber()
  @Min(0)
  intermediate!: number;

  @ApiProperty({
    description: 'XP required for Advanced rank',
    example: 1500,
  })
  @IsNumber()
  @Min(0)
  advanced!: number;

  @ApiProperty({
    description: 'XP required for Expert rank',
    example: 5000,
  })
  @IsNumber()
  @Min(0)
  expert!: number;
}

/**
 * Coins Settings DTO
 *
 * @description Configuration for ML Coins rewards
 */
export class CoinsSettingsDto {
  @ApiProperty({
    description: 'ML Coins awarded to new users on registration',
    example: 500,
    minimum: 0,
    maximum: 10000,
  })
  @IsNumber()
  @Min(0)
  @Max(10000)
  welcome_bonus!: number;

  @ApiProperty({
    description: 'ML Coins awarded for daily login',
    example: 50,
    minimum: 0,
    maximum: 1000,
  })
  @IsNumber()
  @Min(0)
  @Max(1000)
  daily_login_reward!: number;

  @ApiPropertyOptional({
    description: 'ML Coins awarded per exercise completion',
    example: 100,
    minimum: 0,
    maximum: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  exercise_completion_reward?: number;
}

/**
 * Update Gamification Settings DTO
 *
 * @description Main DTO for updating gamification configuration
 * @supports Partial updates - only provided fields will be updated
 */
export class UpdateGamificationSettingsDto {
  @ApiPropertyOptional({
    description: 'XP system configuration',
    type: XpSettingsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => XpSettingsDto)
  xp?: XpSettingsDto;

  @ApiPropertyOptional({
    description: 'Rank thresholds configuration',
    type: RankThresholdsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => RankThresholdsDto)
  ranks?: RankThresholdsDto;

  @ApiPropertyOptional({
    description: 'ML Coins rewards configuration',
    type: CoinsSettingsDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoinsSettingsDto)
  coins?: CoinsSettingsDto;

  @ApiPropertyOptional({
    description: 'Achievement criteria configuration (free-form object)',
    example: { criteria: [] },
  })
  @IsOptional()
  @IsObject()
  achievements?: Record<string, any>;
}
