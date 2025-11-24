/**
 * Assign to Classrooms DTO
 */

import { IsArray, IsUUID, IsOptional, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ClassroomAssignment {
  @IsUUID()
  classroomId!: string;

  @IsOptional()
  @IsDateString()
  deadlineOverride?: string;
}

export class AssignToClassroomsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClassroomAssignment)
  classrooms!: ClassroomAssignment[];
}
