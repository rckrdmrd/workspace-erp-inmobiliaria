import { ApiProperty } from '@nestjs/swagger';

export class DatabaseHealthDto {
  @ApiProperty({ description: 'Database connection status', example: 'healthy' })
  status!: 'healthy' | 'degraded' | 'down';

  @ApiProperty({ description: 'Response time in ms', example: 5 })
  response_time_ms!: number;

  @ApiProperty({ description: 'Connection pool size', example: 10 })
  pool_size?: number;

  @ApiProperty({ description: 'Active connections', example: 3 })
  active_connections?: number;
}

export class RedisHealthDto {
  @ApiProperty({ description: 'Redis connection status', example: 'healthy' })
  status!: 'healthy' | 'degraded' | 'down';

  @ApiProperty({ description: 'Response time in ms', example: 2 })
  response_time_ms!: number;

  @ApiProperty({ description: 'Memory usage in MB', example: 150 })
  memory_usage_mb?: number;
}

export class SystemHealthDto {
  @ApiProperty({ description: 'Overall system status', example: 'healthy' })
  status!: 'healthy' | 'degraded' | 'down';

  @ApiProperty({ description: 'System uptime in seconds', example: 86400 })
  uptime_seconds!: number;

  @ApiProperty({ description: 'Timestamp of health check', example: '2025-11-02T18:00:00Z' })
  timestamp!: string;

  @ApiProperty({ description: 'Application version', example: '1.0.0' })
  version!: string;

  @ApiProperty({ description: 'Node.js version', example: 'v20.10.0' })
  node_version!: string;

  @ApiProperty({ description: 'Environment', example: 'production' })
  environment!: string;

  @ApiProperty({ description: 'Database health', type: DatabaseHealthDto })
  database!: DatabaseHealthDto;

  @ApiProperty({ description: 'Redis health (optional)', type: RedisHealthDto, required: false })
  redis?: RedisHealthDto;

  @ApiProperty({ description: 'Memory usage', example: { used: 512, total: 2048 } })
  memory!: {
    used_mb: number;
    total_mb: number;
    usage_percent: number;
  };

  @ApiProperty({ description: 'CPU usage', example: { usage_percent: 45 } })
  cpu!: {
    usage_percent: number;
  };
}
