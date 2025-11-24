import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for aggregated organization statistics from admin_dashboard.organization_stats_summary view
 */
export class OrganizationStatsSummaryDto {
  @ApiProperty({
    description: 'Total number of organizations/tenants',
    example: 45,
  })
  total_organizations!: number;

  @ApiProperty({
    description: 'Number of active organizations',
    example: 42,
  })
  active_organizations!: number;

  @ApiProperty({
    description: 'New organizations created in the last 30 days',
    example: 5,
  })
  new_organizations_month!: number;
}
