import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Gamification Settings Response DTO
 *
 * @description Response format for gamification configuration
 * @includes Current values, defaults, and audit information
 */
export class GamificationSettingsResponseDto {
  @ApiProperty({
    description: 'XP configuration',
    example: {
      base_per_exercise: 10,
      completion_multiplier: 1.5,
      perfect_score_bonus: 2.0,
    },
  })
  xp!: Record<string, any>;

  @ApiProperty({
    description: 'Rank thresholds',
    example: {
      novice: 0,
      beginner: 100,
      intermediate: 500,
      advanced: 1500,
      expert: 5000,
    },
  })
  ranks!: Record<string, any>;

  @ApiProperty({
    description: 'ML Coins rewards',
    example: {
      welcome_bonus: 500,
      daily_login_reward: 50,
      exercise_completion_reward: 100,
    },
  })
  coins!: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Achievement criteria',
    example: { criteria: [] },
  })
  achievements?: Record<string, any>;

  @ApiProperty({
    description: 'Default values from system',
    example: {
      'gamification.xp.base_per_exercise': 10,
      'gamification.xp.completion_multiplier': 1.5,
    },
  })
  defaults!: Record<string, any>;

  @ApiProperty({
    description: 'Timestamp of last update',
    example: '2025-11-11T20:00:00.000Z',
  })
  last_updated!: string;

  @ApiPropertyOptional({
    description: 'Admin user ID who last updated the settings',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  updated_by?: string;
}
