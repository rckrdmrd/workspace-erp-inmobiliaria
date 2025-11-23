import { IsUUID, IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for assigning a classroom to a teacher
 */
export class AssignClassroomDto {
  @ApiProperty({
    description: 'Teacher ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsUUID()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({
    description: 'Classroom ID (UUID)',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @IsUUID()
  @IsNotEmpty()
  classroomId!: string;

  @ApiPropertyOptional({
    description: 'Optional notes about the assignment',
    example: 'Asignación por inicio de ciclo escolar 2025',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
