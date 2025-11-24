/**
 * Duplicate Assignment DTOs
 *
 * For duplicating assignments with optional modifications.
 * Supports copying classroom assignments and exercises.
 */

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DuplicateAssignmentDto {
  @ApiPropertyOptional({
    description: 'New title for duplicated assignment. If not provided, will use "Copy of {original title}"',
    example: 'Assignment Copy for New Semester',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  newTitle?: string;

  @ApiPropertyOptional({
    description: 'New due date for duplicated assignment (ISO date string)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  newDueDate?: string;

  @ApiPropertyOptional({
    description: 'Copy classroom assignments (distribution)',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  copyClassroomAssignments?: boolean;

  @ApiPropertyOptional({
    description: 'Copy exercises associated with assignment',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  copyExercises?: boolean;
}

export class DuplicateAssignmentResponseDto {
  @ApiProperty({
    description: 'ID of the new duplicated assignment',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  id!: string;

  @ApiProperty({
    description: 'Title of the duplicated assignment',
    example: 'Copy of Original Assignment',
  })
  title!: string;

  @ApiProperty({
    description: 'ID of the original assignment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  originalId!: string;

  @ApiProperty({
    description: 'Number of classroom assignments copied',
    example: 5,
  })
  classroomsCopied!: number;

  @ApiProperty({
    description: 'Number of exercises copied',
    example: 10,
  })
  exercisesCopied!: number;

  @ApiProperty({
    description: 'Published status (always false for new duplicates)',
    example: false,
  })
  isPublished!: boolean;
}
