import { ApiProperty } from '@nestjs/swagger';

/**
 * Response DTO for version creation
 * Returns details about the newly created version
 */
export class VersionResponseDto {
  @ApiProperty({
    description: 'UUID of the versioned content',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  content_id!: string;

  @ApiProperty({
    description: 'Type of content versioned',
    example: 'module',
    enum: ['module', 'exercise', 'template'],
  })
  content_type!: string;

  @ApiProperty({
    description: 'Previous version number',
    example: '1.0.0',
  })
  old_version!: string;

  @ApiProperty({
    description: 'New version number created',
    example: '1.1.0',
  })
  new_version!: string;

  @ApiProperty({
    description: 'Notes describing the changes (if provided)',
    example: 'Updated title and description',
    required: false,
  })
  version_notes?: string;

  @ApiProperty({
    description: 'ISO timestamp when version was created',
    example: '2025-11-12T10:00:00Z',
  })
  created_at!: string;

  @ApiProperty({
    description: 'UUID of the admin who created the version',
    example: 'admin-uuid-123',
  })
  created_by!: string;

  @ApiProperty({
    description: 'Total number of versions for this content',
    example: 3,
  })
  total_versions!: number;

  @ApiProperty({
    description: 'Snapshot of the content state at version creation',
    example: {
      title: 'Module Title',
      description: 'Module description',
      order: 1,
      estimated_duration: 60,
      is_published: true,
    },
  })
  snapshot!: Record<string, any>;
}
