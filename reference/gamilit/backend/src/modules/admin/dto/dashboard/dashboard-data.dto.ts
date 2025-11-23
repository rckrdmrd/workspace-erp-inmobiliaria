import { ApiProperty } from '@nestjs/swagger';
import { DashboardStatsDto } from './dashboard-stats.dto';
import { AdminActionDto } from './recent-activity.dto';

export class DashboardDataDto {
  @ApiProperty({
    description: 'Dashboard statistics',
    type: DashboardStatsDto,
  })
  stats!: DashboardStatsDto;

  @ApiProperty({
    description: 'Recent activity (last 10 actions)',
    type: [AdminActionDto],
  })
  recentActivity!: AdminActionDto[];

  @ApiProperty({
    description: 'Timestamp when the dashboard data was generated',
    example: '2025-11-19T10:30:00Z',
  })
  timestamp!: string;
}
