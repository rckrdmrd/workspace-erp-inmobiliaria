import { ApiProperty } from '@nestjs/swagger';

export class OrganizationStatsDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 'abc123...',
  })
  organization_id!: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Universidad Nacional',
  })
  organization_name!: string;

  @ApiProperty({
    description: 'Total number of members in the organization',
    example: 450,
  })
  total_members!: number;

  @ApiProperty({
    description: 'Number of active members',
    example: 420,
  })
  active_members!: number;

  @ApiProperty({
    description: 'Number of pending/invited members',
    example: 10,
  })
  pending_members!: number;

  @ApiProperty({
    description: 'Number of suspended members',
    example: 20,
  })
  suspended_members!: number;

  @ApiProperty({
    description: 'Maximum users allowed',
    example: 500,
  })
  max_users!: number;

  @ApiProperty({
    description: 'Current storage used in GB',
    example: 35.5,
  })
  storage_used_gb!: number;

  @ApiProperty({
    description: 'Maximum storage allowed in GB',
    example: 50,
  })
  max_storage_gb!: number;

  @ApiProperty({
    description: 'Number of members added in the last 30 days',
    example: 25,
  })
  members_last_30_days!: number;

  @ApiProperty({
    description: 'Is organization in trial period',
    example: false,
  })
  is_trial!: boolean;

  @ApiProperty({
    description: 'Days remaining in trial (null if not in trial)',
    example: null,
  })
  trial_days_remaining!: number | null;
}
