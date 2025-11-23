import { IsOptional, IsBoolean, IsInt, Min, Max, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSystemConfigDto {
  @ApiPropertyOptional({
    description: 'Enable maintenance mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  maintenance_mode?: boolean;

  @ApiPropertyOptional({
    description: 'Maintenance message to display',
    example: 'System maintenance in progress. We will be back soon.',
  })
  @IsOptional()
  maintenance_message?: string;

  @ApiPropertyOptional({
    description: 'Enable user registrations',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  allow_registrations?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum login attempts before lockout',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  max_login_attempts?: number;

  @ApiPropertyOptional({
    description: 'Lockout duration in minutes',
    example: 30,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1440)
  lockout_duration_minutes?: number;

  @ApiPropertyOptional({
    description: 'Session timeout in minutes',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(5)
  @Max(1440)
  session_timeout_minutes?: number;

  @ApiPropertyOptional({
    description: 'Additional custom settings (JSONB)',
    example: { feature_flags: { new_ui: true } },
  })
  @IsOptional()
  @IsObject()
  custom_settings?: Record<string, any>;
}
