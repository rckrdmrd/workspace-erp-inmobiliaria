import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for classroom assignment response
 */
export class ClassroomAssignmentResponseDto {
  @ApiProperty({
    description: 'Classroom ID',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  classroom_id!: string;

  @ApiProperty({
    description: 'Classroom name',
    example: 'Matemáticas 6A',
  })
  name!: string;

  @ApiProperty({
    description: 'Teacher ID assigned',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  teacher_id!: string;

  @ApiProperty({
    description: 'Teacher role in classroom',
    example: 'owner',
    enum: ['owner', 'teacher', 'assistant'],
  })
  role!: string;

  @ApiProperty({
    description: 'Number of students in classroom',
    example: 25,
  })
  student_count!: number;

  @ApiProperty({
    description: 'Assignment timestamp',
    example: '2025-11-11T14:00:00Z',
  })
  assigned_at!: Date;
}
