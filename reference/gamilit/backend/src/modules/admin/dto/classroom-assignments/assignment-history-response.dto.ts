import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for assignment history response
 */
export class AssignmentHistoryResponseDto {
  @ApiProperty({
    description: 'Classroom ID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  classroom_id!: string;

  @ApiProperty({
    description: 'Classroom name',
    example: 'Matemáticas 6A',
  })
  classroom_name!: string;

  @ApiProperty({
    description: 'Teacher ID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  teacher_id!: string;

  @ApiProperty({
    description: 'Teacher name',
    example: 'Juan Pérez',
  })
  teacher_name!: string;

  @ApiProperty({
    description: 'Action performed',
    example: 'assigned',
    enum: ['assigned', 'removed', 'reassigned'],
  })
  action!: string;

  @ApiProperty({
    description: 'Teacher role',
    example: 'owner',
    enum: ['owner', 'teacher', 'assistant'],
  })
  role!: string;

  @ApiProperty({
    description: 'Assignment timestamp',
    example: '2025-11-01T10:00:00Z',
  })
  assigned_at!: Date;

  @ApiPropertyOptional({
    description: 'Removal timestamp (if removed)',
    example: '2025-11-11T14:00:00Z',
  })
  removed_at?: Date;
}
