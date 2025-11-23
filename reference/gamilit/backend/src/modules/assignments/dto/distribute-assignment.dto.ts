/**
 * Distribute Assignment DTOs
 *
 * For distributing assignments to classrooms and/or individual students
 * with advanced options like deadline overrides, auto-publish, and notifications.
 */

import {
  IsArray,
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ClassroomDistributionDto {
  @ApiProperty({
    description: 'Classroom ID to distribute assignment to',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  classroomId!: string;

  @ApiPropertyOptional({
    description: 'Override deadline for this specific classroom (ISO date string)',
    example: '2025-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  deadlineOverride?: string;
}

export class DistributeAssignmentDto {
  @ApiProperty({
    description: 'Array of classrooms to distribute assignment to',
    type: [ClassroomDistributionDto],
    minItems: 1,
    example: [
      {
        classroomId: '550e8400-e29b-41d4-a716-446655440000',
        deadlineOverride: '2025-12-31T23:59:59.000Z',
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ClassroomDistributionDto)
  classrooms!: ClassroomDistributionDto[];

  @ApiPropertyOptional({
    description: 'Optional: Array of individual student IDs to assign directly',
    example: ['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  studentIds?: string[];

  @ApiPropertyOptional({
    description: 'Publish assignment after distributing',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  publishOnDistribute?: boolean;

  @ApiPropertyOptional({
    description: 'Send notifications to students (mock implementation)',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  sendNotifications?: boolean;
}

export class DistributeAssignmentResponseDto {
  @ApiProperty({
    description: 'Number of classrooms successfully distributed to',
    example: 5,
  })
  classroomsSuccess!: number;

  @ApiProperty({
    description: 'Number of classrooms that failed',
    example: 0,
  })
  classroomsFailed!: number;

  @ApiProperty({
    description: 'Number of students successfully assigned',
    example: 10,
  })
  studentsSuccess!: number;

  @ApiProperty({
    description: 'Number of students that failed',
    example: 0,
  })
  studentsFailed!: number;

  @ApiProperty({
    description: 'Whether assignment is published',
    example: true,
  })
  published!: boolean;

  @ApiPropertyOptional({
    description: 'Timestamp when assignment was published (if published)',
    example: '2025-11-12T10:00:00.000Z',
  })
  publishedAt?: string;

  @ApiProperty({
    description: 'Whether notifications were sent',
    example: false,
  })
  notificationsSent!: boolean;
}
