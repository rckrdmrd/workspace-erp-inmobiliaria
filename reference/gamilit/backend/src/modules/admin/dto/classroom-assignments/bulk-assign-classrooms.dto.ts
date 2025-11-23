import { IsUUID, IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for bulk assigning multiple classrooms to a teacher
 */
export class BulkAssignClassroomsDto {
  @ApiProperty({
    description: 'Teacher ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsUUID()
  @IsNotEmpty()
  teacherId!: string;

  @ApiProperty({
    description: 'Array of classroom IDs to assign (max 50)',
    example: [
      '770e8400-e29b-41d4-a716-446655440020',
      '770e8400-e29b-41d4-a716-446655440021',
      '770e8400-e29b-41d4-a716-446655440022',
    ],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @IsUUID('4', { each: true })
  classroomIds!: string[];
}
