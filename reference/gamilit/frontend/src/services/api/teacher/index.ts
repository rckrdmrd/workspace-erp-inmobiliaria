/**
 * Teacher API Services
 *
 * Central export point for all teacher-related API services.
 *
 * @module services/api/teacher
 */

// ============================================================================
// API SERVICES
// ============================================================================

export { teacherApi, TeacherDashboardAPI } from './teacherApi';
export { studentProgressApi, StudentProgressAPI } from './studentProgressApi';
export { analyticsApi, AnalyticsAPI } from './analyticsApi';
export { gradingApi, GradingAPI } from './gradingApi';
export { classroomsApi, ClassroomsAPI } from './classroomsApi';
export { assignmentsApi, AssignmentsAPI } from './assignmentsApi';

// ============================================================================
// TYPES
// ============================================================================

// Teacher API types
export type { Activity } from './teacherApi';

// Student Progress types
export type {
  GetStudentProgressQueryDto,
  StudentProgress,
  StudentOverview,
  StudentStats,
  StudentNote,
  AddTeacherNoteDto,
} from './studentProgressApi';

// Analytics types
export type {
  GetAnalyticsQueryDto,
  GetEngagementMetricsDto,
  GenerateReportsDto,
  Report,
} from './analyticsApi';

// Grading types
export type {
  GetSubmissionsQueryDto,
  SubmitFeedbackDto,
  BulkGradeDto,
  SubmissionDetail,
} from './gradingApi';

// Classrooms types
export type {
  GetClassroomsQueryDto,
  GetClassroomStudentsQueryDto,
} from './classroomsApi';

// Assignments types
export type {
  CreateAssignmentDto,
  UpdateAssignmentDto,
  GradeSubmissionDto,
  GetAssignmentsQueryDto,
  GetSubmissionsQueryDto as GetAssignmentSubmissionsQueryDto,
} from './assignmentsApi';
