import { ApiProperty } from '@nestjs/swagger';

export class SystemMetricsDto {
  @ApiProperty({ description: 'Timestamp of metrics', example: '2025-11-02T18:00:00Z' })
  timestamp!: string;

  @ApiProperty({ description: 'Total users in system', example: 1250 })
  total_users!: number;

  @ApiProperty({ description: 'Active users (last 24h)', example: 450 })
  active_users_24h!: number;

  @ApiProperty({ description: 'Total modules', example: 15 })
  total_modules!: number;

  @ApiProperty({ description: 'Total exercises', example: 450 })
  total_exercises!: number;

  @ApiProperty({ description: 'Total organizations', example: 25 })
  total_organizations!: number;

  @ApiProperty({ description: 'Exercises completed (last 24h)', example: 1200 })
  exercises_completed_24h!: number;

  @ApiProperty({ description: 'Average response time in ms', example: 125 })
  avg_response_time_ms!: number;

  @ApiProperty({ description: 'Request count (last hour)', example: 5400 })
  requests_last_hour!: number;

  @ApiProperty({ description: 'Error rate (last hour)', example: 0.02 })
  error_rate_last_hour!: number;

  @ApiProperty({ description: 'Database query count (last hour)', example: 12500 })
  db_queries_last_hour!: number;

  @ApiProperty({ description: 'Cache hit rate', example: 0.85 })
  cache_hit_rate?: number;

  @ApiProperty({
    description: 'Top errors (last 24h)',
    example: [
      { error: 'ValidationError', count: 45 },
      { error: 'NotFoundException', count: 23 },
    ],
  })
  top_errors?: Array<{ error: string; count: number }>;
}
