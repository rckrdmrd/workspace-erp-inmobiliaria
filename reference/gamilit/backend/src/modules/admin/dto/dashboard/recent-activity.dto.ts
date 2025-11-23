import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class AdminActionDto {
  @ApiProperty({
    description: 'Unique identifier of the activity',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  id!: string;

  @ApiPropertyOptional({
    description: 'User ID who performed the action',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  })
  user_id?: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'admin@gamilit.com',
  })
  email?: string;

  @ApiPropertyOptional({
    description: 'User first name',
    example: 'Juan',
  })
  first_name?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Pérez',
  })
  last_name?: string;

  @ApiProperty({
    description: 'Type of action performed',
    example: 'user_login',
  })
  action_type!: string;

  @ApiProperty({
    description: 'Description of the action',
    example: 'User logged in successfully',
  })
  description!: string;

  @ApiPropertyOptional({
    description: 'Additional metadata in JSON format',
  })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Timestamp when the action occurred',
    example: '2025-11-19T10:30:00Z',
  })
  created_at!: string;
}

export class RecentActivityQueryDto {
  @ApiPropertyOptional({
    description: 'Number of activity records to retrieve',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class PaginatedActivityDto {
  @ApiProperty({
    description: 'Array of recent activities',
    type: [AdminActionDto],
  })
  data!: AdminActionDto[];

  @ApiProperty({
    description: 'Total number of activities',
    example: 1250,
  })
  total!: number;

  @ApiProperty({
    description: 'Number of activities returned',
    example: 20,
  })
  limit!: number;
}
