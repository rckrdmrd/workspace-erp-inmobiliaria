import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetOrganizationUsersDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Filter by role',
    example: 'student',
  })
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({
    description: 'Filter by membership status',
    example: 'active',
  })
  @IsOptional()
  status?: string;
}

export class OrganizationUserDto {
  @ApiProperty({ description: 'User ID' })
  user_id!: string;

  @ApiProperty({ description: 'User email' })
  email!: string;

  @ApiProperty({ description: 'Full name' })
  full_name?: string;

  @ApiProperty({ description: 'User role' })
  role!: string;

  @ApiProperty({ description: 'Membership role in organization' })
  membership_role!: string;

  @ApiProperty({ description: 'Membership status' })
  membership_status!: string;

  @ApiProperty({ description: 'Joined date' })
  joined_at!: Date;

  @ApiProperty({ description: 'Last active date' })
  last_active_at?: Date;
}

export class PaginatedOrganizationUsersDto {
  @ApiProperty({ description: 'List of users', type: [OrganizationUserDto] })
  data!: OrganizationUserDto[];

  @ApiProperty({ description: 'Total count' })
  total!: number;

  @ApiProperty({ description: 'Current page' })
  page!: number;

  @ApiProperty({ description: 'Items per page' })
  limit!: number;

  @ApiProperty({ description: 'Total pages' })
  total_pages!: number;
}
