import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for cleanup logs operation
 */
export class CleanupLogsDto {
  @ApiPropertyOptional({
    description: 'Number of days to retain logs (older logs will be deleted)',
    example: 90,
    default: 90,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  retention_days?: number = 90;
}

/**
 * DTO for cleanup user activity operation
 */
export class CleanupUserActivityDto {
  @ApiPropertyOptional({
    description: 'Number of days to retain user activity records (older records will be deleted)',
    example: 180,
    default: 180,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  retention_days?: number = 180;
}

/**
 * DTO for maintenance operation result
 */
export class MaintenanceOperationResultDto {
  @ApiProperty({
    description: 'Whether the operation was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Status message describing the operation result',
    example: 'Successfully deleted 1,234 log entries older than 90 days',
  })
  message!: string;

  @ApiPropertyOptional({
    description: 'Number of records affected (if applicable)',
    example: 1234,
  })
  affected_records?: number;

  @ApiPropertyOptional({
    description: 'Additional metadata about the operation',
    example: { execution_time_ms: 1523 },
  })
  metadata?: Record<string, any>;
}

/**
 * DTO for database optimization result
 */
export class DatabaseOptimizationResultDto {
  @ApiProperty({
    description: 'Whether the optimization was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Overall status message',
    example: 'Database optimization completed successfully',
  })
  message!: string;

  @ApiProperty({
    description: 'List of tables optimized',
    example: ['users', 'exercises', 'activity_log'],
  })
  tables_optimized!: string[];

  @ApiProperty({
    description: 'Total space reclaimed in MB',
    example: 256.5,
  })
  space_reclaimed_mb!: number;

  @ApiProperty({
    description: 'Execution time in milliseconds',
    example: 5432,
  })
  execution_time_ms!: number;
}

/**
 * DTO for cache clear operation result
 */
export class CacheClearResultDto {
  @ApiProperty({
    description: 'Whether the cache was successfully cleared',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Status message',
    example: 'Application cache cleared successfully',
  })
  message!: string;

  @ApiProperty({
    description: 'Number of cache entries cleared',
    example: 1523,
  })
  entries_cleared!: number;
}

/**
 * DTO for session cleanup result
 */
export class SessionCleanupResultDto {
  @ApiProperty({
    description: 'Whether the cleanup was successful',
    example: true,
  })
  success!: boolean;

  @ApiProperty({
    description: 'Status message',
    example: 'Successfully cleaned up 45 expired sessions',
  })
  message!: string;

  @ApiProperty({
    description: 'Number of sessions terminated',
    example: 45,
  })
  sessions_terminated!: number;
}
