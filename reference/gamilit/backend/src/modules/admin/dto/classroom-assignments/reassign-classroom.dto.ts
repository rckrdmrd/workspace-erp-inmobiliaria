import { IsUUID, IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for reassigning a classroom from one teacher to another
 */
export class ReassignClassroomDto {
  @ApiProperty({
    description: 'Classroom ID to reassign',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  @IsUUID()
  @IsNotEmpty()
  classroomId!: string;

  @ApiProperty({
    description: 'Current teacher ID (from)',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsUUID()
  @IsNotEmpty()
  fromTeacherId!: string;

  @ApiProperty({
    description: 'New teacher ID (to)',
    example: '550e8400-e29b-41d4-a716-446655440006',
  })
  @IsUUID()
  @IsNotEmpty()
  toTeacherId!: string;

  @ApiPropertyOptional({
    description: 'Reason for reassignment',
    example: 'Cambio de profesor por semestre',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
