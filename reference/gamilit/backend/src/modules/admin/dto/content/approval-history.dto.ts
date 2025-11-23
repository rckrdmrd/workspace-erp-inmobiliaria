import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for approval history item
 */
export class ApprovalHistoryItemDto {
  @ApiProperty({
    description: 'Unique identifier of the approval record',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  id!: string;

  @ApiProperty({
    description: 'Type of content (module, exercise, assignment, resource)',
    example: 'exercise',
  })
  content_type!: string;

  @ApiProperty({
    description: 'ID of the content being approved',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  })
  content_id!: string;

  @ApiProperty({
    description: 'Title of the content (from joined table)',
    example: 'Introduction to Mathematics',
    nullable: true,
  })
  content_title?: string;

  @ApiProperty({
    description: 'ID of user who submitted the content',
    example: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  })
  submitted_by!: string;

  @ApiProperty({
    description: 'Email of submitter',
    example: 'teacher@example.com',
    nullable: true,
  })
  submitter_email?: string;

  @ApiProperty({
    description: 'Name of submitter',
    example: 'Maria Garcia',
    nullable: true,
  })
  submitter_name?: string;

  @ApiProperty({
    description: 'When the content was submitted for approval',
    example: '2025-11-15T10:30:00Z',
  })
  submitted_at!: string;

  @ApiProperty({
    description: 'ID of user who reviewed the content',
    example: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    nullable: true,
  })
  reviewed_by?: string;

  @ApiProperty({
    description: 'Email of reviewer',
    example: 'admin@example.com',
    nullable: true,
  })
  reviewer_email?: string;

  @ApiProperty({
    description: 'Name of reviewer',
    example: 'Admin User',
    nullable: true,
  })
  reviewer_name?: string;

  @ApiProperty({
    description: 'When the content was reviewed',
    example: '2025-11-16T14:20:00Z',
    nullable: true,
  })
  reviewed_at?: string;

  @ApiProperty({
    description: 'Current approval status',
    example: 'approved',
    enum: ['pending', 'approved', 'rejected', 'needs_revision'],
  })
  status!: string;

  @ApiProperty({
    description: 'Notes from the reviewer',
    example: 'Content looks good, approved for publication',
    nullable: true,
  })
  reviewer_notes?: string;

  @ApiProperty({
    description: 'Revision notes from submitter',
    example: 'Updated based on previous feedback',
    nullable: true,
  })
  revision_notes?: string;

  @ApiProperty({
    description: 'When the approval record was created',
    example: '2025-11-15T10:30:00Z',
  })
  created_at!: string;

  @ApiProperty({
    description: 'When the approval record was last updated',
    example: '2025-11-16T14:20:00Z',
  })
  updated_at!: string;
}

/**
 * DTO for querying approval history
 */
export class ListApprovalHistoryDto {
  @ApiPropertyOptional({
    description: 'Filter by content type',
    example: 'exercise',
    enum: ['module', 'exercise', 'assignment', 'resource'],
  })
  @IsOptional()
  @IsEnum(['module', 'exercise', 'assignment', 'resource'])
  content_type?: string;

  @ApiPropertyOptional({
    description: 'Filter by specific content ID',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  @IsOptional()
  @IsString()
  content_id?: string;

  @ApiPropertyOptional({
    description: 'Filter by approval status',
    example: 'approved',
    enum: ['pending', 'approved', 'rejected', 'needs_revision'],
  })
  @IsOptional()
  @IsEnum(['pending', 'approved', 'rejected', 'needs_revision'])
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by submitter user ID',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  })
  @IsOptional()
  @IsString()
  submitted_by?: string;

  @ApiPropertyOptional({
    description: 'Filter by reviewer user ID',
    example: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
  })
  @IsOptional()
  @IsString()
  reviewed_by?: string;

  @ApiPropertyOptional({
    description: 'Search in content title, reviewer notes, revision notes',
    example: 'mathematics',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}

/**
 * DTO for paginated approval history response
 */
export class PaginatedApprovalHistoryDto {
  @ApiProperty({
    description: 'Array of approval history items',
    type: [ApprovalHistoryItemDto],
  })
  data!: ApprovalHistoryItemDto[];

  @ApiProperty({
    description: 'Total number of approval records',
    example: 150,
  })
  total!: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  total_pages!: number;
}
