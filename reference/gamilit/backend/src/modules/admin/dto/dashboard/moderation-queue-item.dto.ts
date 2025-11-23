import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for content moderation queue item from admin_dashboard.moderation_queue view
 */
export class ModerationQueueItemDto {
  @ApiProperty({
    description: 'Unique identifier of the flagged content item',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  id!: string;

  @ApiProperty({
    description: 'Type of content flagged (exercise, module, comment, etc.)',
    example: 'exercise',
  })
  content_type!: string;

  @ApiProperty({
    description: 'ID of the flagged content',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  })
  content_id!: string;

  @ApiProperty({
    description: 'Preview of the flagged content',
    example: 'Exercise title: Introduction to...',
    nullable: true,
  })
  content_preview?: string;

  @ApiProperty({
    description: 'Reason for flagging',
    example: 'Inappropriate language detected',
  })
  reason!: string;

  @ApiProperty({
    description: 'Priority level (high, medium, low)',
    example: 'high',
  })
  priority!: string;

  @ApiProperty({
    description: 'Current status (pending, reviewed, resolved)',
    example: 'pending',
  })
  status!: string;

  @ApiProperty({
    description: 'When the content was flagged',
    example: '2025-11-19T10:30:00Z',
  })
  created_at!: string;

  @ApiProperty({
    description: 'Email of the user who reported this content',
    example: 'reporter@example.com',
    nullable: true,
  })
  reporter_email?: string;

  @ApiProperty({
    description: 'Full name of the reporter',
    example: 'John Doe',
    nullable: true,
  })
  reporter_name?: string;
}

/**
 * DTO for paginated moderation queue response
 */
export class PaginatedModerationQueueDto {
  @ApiProperty({
    description: 'Array of moderation queue items',
    type: [ModerationQueueItemDto],
  })
  data!: ModerationQueueItemDto[];

  @ApiProperty({
    description: 'Total number of items in queue',
    example: 15,
  })
  total!: number;

  @ApiProperty({
    description: 'Number of items returned',
    example: 10,
  })
  limit!: number;
}
