import { IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFeaturesDto {
  @ApiProperty({
    description: 'Feature flags to enable/disable',
    example: {
      analytics_enabled: true,
      gamification_enabled: true,
      social_features_enabled: false,
      ai_suggestions_enabled: true,
      advanced_reporting: false,
    },
  })
  @IsObject()
  features!: Record<string, boolean>;
}

export class FeatureFlagsDto {
  @ApiProperty({
    description: 'Enable analytics features',
    example: true,
  })
  analytics_enabled?: boolean;

  @ApiProperty({
    description: 'Enable gamification features',
    example: true,
  })
  gamification_enabled?: boolean;

  @ApiProperty({
    description: 'Enable social features',
    example: true,
  })
  social_features_enabled?: boolean;

  @ApiProperty({
    description: 'Enable AI-powered suggestions',
    example: false,
  })
  ai_suggestions_enabled?: boolean;

  @ApiProperty({
    description: 'Enable advanced reporting',
    example: false,
  })
  advanced_reporting?: boolean;

  // Index signature for additional custom features
  // Note: Decorators not allowed on index signatures
  [key: string]: any;
}
