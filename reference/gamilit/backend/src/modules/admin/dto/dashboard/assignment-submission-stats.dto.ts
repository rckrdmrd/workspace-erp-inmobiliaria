import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for assignment submission statistics from admin_dashboard.assignment_submission_stats view
 */
export class AssignmentSubmissionStatsDto {
  @ApiProperty({
    description: 'Unique identifier of the assignment',
    example: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  })
  assignment_id!: string;

  @ApiProperty({
    description: 'Title of the assignment',
    example: 'Chapter 5 - Fractions Quiz',
  })
  assignment_title!: string;

  @ApiProperty({
    description: 'Type of assignment (practice, quiz, exam, homework)',
    example: 'quiz',
  })
  assignment_type!: string;

  @ApiProperty({
    description: 'Maximum points for the assignment',
    example: 100,
    nullable: true,
  })
  assignment_max_points?: number;

  @ApiProperty({
    description: 'ID of the classroom',
    example: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  })
  classroom_id!: string;

  @ApiProperty({
    description: 'Name of the classroom',
    example: '6th Grade Mathematics - Section A',
  })
  classroom_name!: string;

  @ApiProperty({
    description: 'Total number of submissions (all statuses)',
    example: 30,
  })
  total_submissions!: number;

  @ApiProperty({
    description: 'Number of submitted assignments (status=submitted)',
    example: 25,
  })
  completed_submissions!: number;

  @ApiProperty({
    description: 'Number of in-progress assignments',
    example: 3,
  })
  in_progress_submissions!: number;

  @ApiProperty({
    description: 'Number of not started assignments',
    example: 2,
  })
  not_started_submissions!: number;

  @ApiProperty({
    description: 'Number of graded submissions',
    example: 20,
  })
  graded_submissions!: number;

  @ApiProperty({
    description: 'Percentage of students who submitted (submitted + graded)',
    example: 83.33,
    nullable: true,
  })
  submission_rate_percent?: number;

  @ApiProperty({
    description: 'Average score of graded submissions',
    example: 85.5,
    nullable: true,
  })
  avg_score?: number;

  @ApiProperty({
    description: 'Highest score received',
    example: 98,
    nullable: true,
  })
  max_score_achieved?: number;

  @ApiProperty({
    description: 'Lowest score received',
    example: 62,
    nullable: true,
  })
  min_score_achieved?: number;

  @ApiProperty({
    description: 'When the assignment was created',
    example: '2025-11-01T08:00:00Z',
  })
  assignment_created_at!: string;

  @ApiProperty({
    description: 'Global due date for the assignment',
    example: '2025-11-20T23:59:59Z',
    nullable: true,
  })
  assignment_due_date?: string;

  @ApiProperty({
    description: 'Classroom-specific deadline override (if any)',
    example: '2025-11-21T23:59:59Z',
    nullable: true,
  })
  classroom_deadline_override?: string;

  @ApiProperty({
    description: 'Total number of students in the classroom',
    example: 32,
  })
  total_students_in_classroom!: number;
}

/**
 * DTO for paginated assignment submission stats response
 */
export class PaginatedAssignmentSubmissionStatsDto {
  @ApiProperty({
    description: 'Array of assignment submission statistics',
    type: [AssignmentSubmissionStatsDto],
  })
  data!: AssignmentSubmissionStatsDto[];

  @ApiProperty({
    description: 'Total number of assignments',
    example: 150,
  })
  total!: number;

  @ApiProperty({
    description: 'Number of items returned',
    example: 20,
  })
  limit!: number;
}
