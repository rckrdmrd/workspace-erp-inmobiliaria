import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SystemConfigDto {
  @ApiProperty({ description: 'Maintenance mode status', example: false })
  maintenance_mode!: boolean;

  @ApiPropertyOptional({ description: 'Maintenance message' })
  maintenance_message?: string;

  @ApiProperty({ description: 'User registrations allowed', example: true })
  allow_registrations!: boolean;

  @ApiProperty({ description: 'Maximum login attempts', example: 5 })
  max_login_attempts!: number;

  @ApiProperty({ description: 'Lockout duration in minutes', example: 30 })
  lockout_duration_minutes!: number;

  @ApiProperty({ description: 'Session timeout in minutes', example: 60 })
  session_timeout_minutes!: number;

  @ApiPropertyOptional({ description: 'Custom settings' })
  custom_settings?: Record<string, any>;

  @ApiProperty({ description: 'Last updated timestamp', example: '2025-11-02T18:00:00Z' })
  updated_at!: string;

  @ApiPropertyOptional({ description: 'Updated by admin ID', example: 'admin123...' })
  updated_by?: string;
}
