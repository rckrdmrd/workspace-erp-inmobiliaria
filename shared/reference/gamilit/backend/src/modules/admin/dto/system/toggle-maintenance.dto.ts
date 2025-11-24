import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ToggleMaintenanceDto {
  @ApiProperty({
    description: 'Enable or disable maintenance mode',
    example: true,
  })
  @IsBoolean()
  enabled!: boolean;

  @ApiPropertyOptional({
    description: 'Custom maintenance message to display to users',
    example: 'System maintenance in progress. We will be back at 3:00 PM.',
  })
  @IsOptional()
  @IsString()
  message?: string;
}

export class MaintenanceStatusDto {
  @ApiProperty({
    description: 'Current maintenance mode status',
    example: true,
  })
  maintenance_mode!: boolean;

  @ApiProperty({
    description: 'Maintenance message',
    example: 'System maintenance in progress. We will be back soon.',
  })
  maintenance_message!: string;

  @ApiProperty({
    description: 'When the mode was last updated',
    example: '2025-11-07T12:00:00.000Z',
  })
  updated_at!: string;

  @ApiProperty({
    description: 'Admin who updated the mode',
    example: '10000000-0000-0000-0000-000000000001',
    required: false,
  })
  updated_by?: string;
}
