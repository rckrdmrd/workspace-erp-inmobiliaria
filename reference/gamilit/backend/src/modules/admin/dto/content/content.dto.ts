import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ContentStatusEnum } from '@shared/constants';

export class ContentDto {
  @ApiProperty({ description: 'Content ID (UUID)', example: 'abc123...' })
  @Expose()
  id!: string;

  @ApiProperty({ description: 'Content type', enum: ['module', 'exercise', 'template'] })
  @Expose()
  content_type!: 'module' | 'exercise' | 'template';

  @ApiProperty({ description: 'Content title', example: 'Marie Curie - Módulo 1' })
  @Expose()
  title!: string;

  @ApiPropertyOptional({ description: 'Content description' })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Content status',
    enum: ContentStatusEnum,
    example: ContentStatusEnum.UNDER_REVIEW,
  })
  @Expose()
  status!: ContentStatusEnum;

  @ApiPropertyOptional({ description: 'Is published', example: false })
  @Expose()
  is_published?: boolean;

  @ApiPropertyOptional({ description: 'Creator user ID', example: 'user123...' })
  @Expose()
  created_by?: string;

  @ApiPropertyOptional({ description: 'Reviewer user ID', example: 'admin123...' })
  @Expose()
  reviewed_by?: string;

  @ApiPropertyOptional({ description: 'Approver user ID', example: 'admin123...' })
  @Expose()
  approved_by?: string;

  @ApiPropertyOptional({ description: 'Version number', example: 1 })
  @Expose()
  version?: number;

  @ApiProperty({ description: 'Creation date', example: '2025-01-15T10:00:00Z' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ description: 'Last update date', example: '2025-11-02T12:00:00Z' })
  @Expose()
  updated_at!: Date;

  @ApiPropertyOptional({ description: 'Published date', example: '2025-11-02T14:00:00Z' })
  @Expose()
  published_at?: Date;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @Expose()
  metadata?: Record<string, any>;
}
