/**
 * Create Assignment DTO
 */

import {
  IsString,
  IsEnum,
  IsInt,
  IsOptional,
  IsDateString,
  IsObject,
  Min,
  Max,
  Length,
} from 'class-validator';
import { AssignmentType } from '../entities/assignment.entity';

export class CreateAssignmentDto {
  @IsString()
  @Length(1, 255)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(AssignmentType)
  assignmentType!: AssignmentType;

  @IsInt()
  @Min(1)
  @Max(1000)
  maxPoints!: number;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsOptional()
  @IsObject()
  attachments?: any;
}
