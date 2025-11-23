import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddTeacherNoteDto {
  @ApiProperty({
    description: 'The note content from teacher about the student',
    example: 'Student shows great improvement in reading comprehension. Needs more practice with writing.',
  })
  @IsString()
  @IsNotEmpty()
  note!: string;

  @ApiPropertyOptional({
    description: 'Classroom ID context for the note',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID()
  classroom_id?: string;
}

export class StudentNoteResponseDto {
  @ApiProperty({ description: 'Student ID' })
  student_id!: string;

  @ApiProperty({ description: 'Student email' })
  email!: string;

  @ApiProperty({ description: 'Student full name' })
  full_name?: string;

  @ApiProperty({ description: 'Classroom ID' })
  classroom_id!: string;

  @ApiProperty({ description: 'Classroom name' })
  classroom_name?: string;

  @ApiProperty({ description: 'Teacher notes about the student' })
  teacher_notes?: string;

  @ApiProperty({ description: 'Last updated timestamp' })
  updated_at!: Date;
}
