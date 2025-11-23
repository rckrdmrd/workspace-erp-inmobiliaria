/**
 * Grade Submission DTO
 */

import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

export class GradeSubmissionDto {
  @IsInt()
  @Min(0)
  score!: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
