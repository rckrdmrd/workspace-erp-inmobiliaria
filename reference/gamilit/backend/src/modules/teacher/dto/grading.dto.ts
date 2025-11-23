/**
 * DTOs for Grading and Feedback
 */

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsUUID,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SubmissionStatus {
  PENDING = 'pending',
  GRADED = 'graded',
  NEEDS_REVIEW = 'needs_review',
}

export class SubmitFeedbackDto {
  @ApiProperty({ description: 'Teacher feedback text' })
  @IsString()
  @IsNotEmpty()
  feedback!: string;

  @ApiPropertyOptional({ description: 'Adjusted score (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  adjusted_score?: number;
}

export class GetSubmissionsQueryDto {
  @ApiPropertyOptional({ enum: SubmissionStatus })
  @IsEnum(SubmissionStatus)
  @IsOptional()
  status?: SubmissionStatus;

  @ApiPropertyOptional({ description: 'Filter by module ID' })
  @IsUUID()
  @IsOptional()
  module_id?: string;

  @ApiPropertyOptional({ description: 'Filter by student ID' })
  @IsUUID()
  @IsOptional()
  student_id?: string;

  @ApiPropertyOptional({ enum: ['date', 'score', 'time'] })
  @IsEnum(['date', 'score', 'time'])
  @IsOptional()
  sort_by?: 'date' | 'score' | 'time';

  @ApiPropertyOptional({ description: 'Page number', minimum: 1 })
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', minimum: 1, maximum: 100 })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

export class BulkGradeDto {
  @ApiProperty({ type: [String], description: 'Array of submission IDs' })
  @IsUUID('4', { each: true })
  submission_ids!: string[];

  @ApiProperty({ description: 'Feedback to apply to all submissions' })
  @IsString()
  @IsNotEmpty()
  feedback!: string;

  @ApiPropertyOptional({ description: 'Adjusted score for all (0-100)', minimum: 0, maximum: 100 })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  adjusted_score?: number;
}
