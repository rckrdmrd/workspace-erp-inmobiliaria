/**
 * Patch Assignment DTO
 *
 * For partial updates of assignments.
 * If submissions exist, critical fields (assignmentType, totalPoints, dueDate) are blocked.
 */

import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsDateString,
  IsBoolean,
  Min,
  Max,
  Length,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AssignmentType } from '../entities/assignment.entity';

export class PatchAssignmentDto {
  @ApiPropertyOptional({
    description: 'Assignment title',
    example: 'Updated Assignment Title',
    minLength: 1,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @Length(1, 255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Assignment description (HTML allowed, will be sanitized)',
    example: '<p>Updated description</p>',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Assignment type (BLOCKED if submissions exist)',
    enum: AssignmentType,
    example: AssignmentType.HOMEWORK,
  })
  @IsOptional()
  @IsEnum(AssignmentType)
  assignmentType?: AssignmentType;

  @ApiPropertyOptional({
    description: 'Total points (BLOCKED if submissions exist)',
    example: 100,
    minimum: 1,
    maximum: 1000,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(1000)
  totalPoints?: number;

  @ApiPropertyOptional({
    description: 'Due date ISO string (BLOCKED if submissions exist)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Published status',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({
    description: 'Assignment instructions',
    example: 'Complete all exercises before the deadline',
  })
  @IsOptional()
  @IsString()
  instructions?: string;
}
