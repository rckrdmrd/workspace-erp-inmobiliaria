/**
 * Teacher Hooks - Central export point
 */

// New hooks (FE-052 Quick Wins + CICLO 9)
export { useTeacherDashboard } from './useTeacherDashboard';
export { useStudentProgress } from './useStudentProgress';
export { useAnalytics, useStudentInsights } from './useAnalytics';
export { useGrading } from './useGrading';
export { useClassrooms } from './useClassrooms';
export { useAssignments } from './useAssignments';

// Legacy hooks (kept for backward compatibility)
export { useClassroomData } from './useClassroomData';
export { useStudentMonitoring } from './useStudentMonitoring';

// Types
export type { UseTeacherDashboardReturn } from './useTeacherDashboard';
export type { UseStudentProgressReturn } from './useStudentProgress';
export type { UseAnalyticsReturn, UseStudentInsightsReturn, StudentInsights } from './useAnalytics';
export type { UseGradingReturn } from './useGrading';
export type { UseClassroomsReturn } from './useClassrooms';
export type { UseAssignmentsReturn } from './useAssignments';
