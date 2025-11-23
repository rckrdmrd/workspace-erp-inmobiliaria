import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for classroom overview from admin_dashboard.classroom_overview view
 */
export class ClassroomOverviewDto {
  @ApiProperty({
    description: 'Unique identifier of the classroom',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  classroom_id!: string;

  @ApiProperty({
    description: 'Name of the classroom',
    example: '6th Grade Mathematics - Section A',
  })
  classroom_name!: string;

  @ApiProperty({
    description: 'Description of the classroom',
    example: 'Advanced mathematics for 6th graders',
    nullable: true,
  })
  classroom_description?: string;

  @ApiProperty({
    description: 'ID of the teacher managing the classroom',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    nullable: true,
  })
  teacher_id?: string;

  @ApiProperty({
    description: 'Display name of the teacher',
    example: 'Prof. Maria Garcia',
    nullable: true,
  })
  teacher_name?: string;

  @ApiProperty({
    description: 'Total number of students enrolled',
    example: 32,
  })
  total_students!: number;

  @ApiProperty({
    description: 'Number of currently active students',
    example: 30,
  })
  active_students!: number;

  @ApiProperty({
    description: 'Number of inactive students',
    example: 2,
  })
  inactive_students!: number;

  @ApiProperty({
    description: 'Total number of assignments in the classroom',
    example: 15,
  })
  total_assignments!: number;

  @ApiProperty({
    description: 'Number of assignments with future due dates',
    example: 5,
  })
  pending_assignments!: number;

  @ApiProperty({
    description: 'Assignments due in the next 7 days',
    example: 2,
  })
  upcoming_deadline_assignments!: number;

  @ApiProperty({
    description: 'Total number of exercises',
    example: 120,
  })
  total_exercises!: number;

  @ApiProperty({
    description: 'Average progress percentage of the classroom',
    example: 67.5,
  })
  avg_class_progress_percent!: number;

  @ApiProperty({
    description: 'Most recent update timestamp',
    example: '2025-11-19T10:30:00Z',
  })
  last_updated!: string;

  @ApiProperty({
    description: 'When the classroom was created',
    example: '2025-09-01T08:00:00Z',
  })
  classroom_created_at!: string;

  @ApiProperty({
    description: 'Current status (EMPTY, ACTIVE, INACTIVE)',
    example: 'ACTIVE',
  })
  classroom_status!: string;
}

/**
 * DTO for paginated classroom overview response
 */
export class PaginatedClassroomOverviewDto {
  @ApiProperty({
    description: 'Array of classroom overview items',
    type: [ClassroomOverviewDto],
  })
  data!: ClassroomOverviewDto[];

  @ApiProperty({
    description: 'Total number of classrooms',
    example: 45,
  })
  total!: number;

  @ApiProperty({
    description: 'Number of items returned',
    example: 10,
  })
  limit!: number;
}
