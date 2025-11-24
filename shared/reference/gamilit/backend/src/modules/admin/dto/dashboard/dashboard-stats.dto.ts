import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatsDto {
  @ApiProperty({
    description: 'Total number of users in the system',
    example: 1250,
  })
  totalUsers!: number;

  @ApiProperty({
    description: 'Number of active users (logged in last 24h)',
    example: 342,
  })
  activeUsers!: number;

  @ApiProperty({
    description: 'New users registered today',
    example: 18,
  })
  newUsersToday!: number;

  @ApiProperty({
    description: 'Total number of organizations/tenants',
    example: 45,
  })
  totalOrganizations!: number;

  @ApiProperty({
    description: 'Total number of exercises in the platform',
    example: 523,
  })
  totalExercises!: number;

  @ApiProperty({
    description: 'Total number of modules',
    example: 42,
  })
  totalModules!: number;

  @ApiProperty({
    description: 'Exercises completed in last 24 hours',
    example: 1245,
  })
  exercisesCompleted24h!: number;

  @ApiProperty({
    description: 'System health status',
    enum: ['healthy', 'warning', 'critical'],
    example: 'healthy',
  })
  systemHealth!: 'healthy' | 'warning' | 'critical';

  @ApiProperty({
    description: 'Average response time in milliseconds',
    example: 125,
  })
  avgResponseTime!: number;
}
