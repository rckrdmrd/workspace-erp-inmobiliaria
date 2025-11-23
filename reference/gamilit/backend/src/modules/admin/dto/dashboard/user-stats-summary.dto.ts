import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for aggregated user statistics from admin_dashboard.user_stats_summary view
 */
export class UserStatsSummaryDto {
  @ApiProperty({
    description: 'Total number of users (excluding deleted)',
    example: 1250,
  })
  total_users!: number;

  @ApiProperty({
    description: 'New users registered today',
    example: 15,
  })
  users_today!: number;

  @ApiProperty({
    description: 'Users registered in the last 7 days',
    example: 87,
  })
  users_this_week!: number;

  @ApiProperty({
    description: 'Users registered in the last 30 days',
    example: 342,
  })
  users_this_month!: number;

  @ApiProperty({
    description: 'Users who logged in today',
    example: 450,
  })
  active_users_today!: number;

  @ApiProperty({
    description: 'Users who logged in within the last 7 days',
    example: 780,
  })
  active_users_week!: number;

  @ApiProperty({
    description: 'Total number of students',
    example: 1000,
  })
  total_students!: number;

  @ApiProperty({
    description: 'Total number of teachers',
    example: 45,
  })
  total_teachers!: number;

  @ApiProperty({
    description: 'Total number of admins',
    example: 5,
  })
  total_admins!: number;
}
