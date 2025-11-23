// Teacher Dashboard Types

export type StudentStatus = 'active' | 'inactive' | 'offline';

export interface StudentMonitoring {
  id: string;
  full_name: string;
  email: string;
  status: StudentStatus;
  current_module: string | null;
  current_exercise: string | null;
  last_activity: string;
  progress_percentage: number;
  score_average: number;
  time_spent_minutes: number;
  exercises_completed: number;
  exercises_total: number;
}

export interface ClassroomData {
  id: string;
  name: string;
  student_count: number;
  active_students: number;
  average_completion: number;
  average_score: number;
  total_exercises: number;
  completed_exercises: number;
}

export interface Assignment {
  id: string;
  title: string;
  module_id: string;
  module_name: string;
  exercise_ids: string[];
  start_date: string;
  end_date: string;
  max_attempts: number;
  allow_powerups: boolean;
  custom_points: number | null;
  assigned_to: string[]; // student IDs
  created_at: string;
  status: 'draft' | 'active' | 'completed' | 'expired';

  // Optional computed/display fields
  classroomName?: string;
  type?: string;
  dueDate?: string; // Alias for end_date
  totalSubmissions?: number;
  pendingReviews?: number;
}

export interface ModuleProgress {
  module_id: string;
  module_name: string;
  completion_percentage: number;
  average_score: number;
  students_completed: number;
  students_total: number;
  average_time_minutes: number;
}

export type AlertType = 'no_activity' | 'low_score' | 'declining_trend' | 'repeated_failures';
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

export interface InterventionAlert {
  id: string;
  student_id: string;
  student_name: string;
  type: AlertType;
  priority: AlertPriority;
  message: string;
  details: {
    days_inactive?: number;
    average_score?: number;
    module_name?: string;
    exercise_name?: string;
    failure_count?: number;
  };
  created_at: string;
  resolved: boolean;
  actions_taken?: string[];
}

export interface LearningAnalytics {
  engagement_rate: number;
  completion_rate: number;
  average_time_on_task: number;
  first_attempt_success_rate: number;
  active_users_daily: number;
  active_users_weekly: number;
  session_duration_avg: number;
  most_used_exercises: Array<{
    exercise_id: string;
    exercise_name: string;
    usage_count: number;
  }>;
  activity_heatmap: Array<{
    day: number; // 0-6 (Sunday-Saturday)
    hour: number; // 0-23
    activity_count: number;
  }>;
}

export interface StudentPerformanceInsight {
  student_id: string;
  student_name: string;
  overall_score: number;
  modules_completed: number;
  modules_total: number;
  strengths: string[];
  weaknesses: string[];
  risk_level: 'low' | 'medium' | 'high';
  predictions: {
    completion_probability: number;
    dropout_risk: number;
  };
  recommendations: string[];
  historical_progress: Array<{
    date: string;
    score: number;
    exercises_completed: number;
  }>;
  comparison_to_class: {
    score_percentile: number;
    completion_percentile: number;
  };
}

export interface EngagementMetrics {
  period: string;
  dau: number; // Daily Active Users
  wau: number; // Weekly Active Users
  session_duration_avg: number;
  sessions_per_user: number;
  feature_usage: Array<{
    feature_name: string;
    usage_count: number;
    unique_users: number;
  }>;
  comparison_previous_period: {
    dau_change: number;
    wau_change: number;
    engagement_change: number;
  };
}

export type ReportFormat = 'pdf' | 'excel' | 'csv';
export type ReportType = 'progress' | 'evaluation' | 'intervention' | 'custom';

export interface ReportConfig {
  type: ReportType;
  title: string;
  metrics: string[];
  start_date: string;
  end_date: string;
  student_ids?: string[];
  group_ids?: string[];
  format: ReportFormat;
  template_id?: string;
  schedule?: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    day_of_week?: number;
    day_of_month?: number;
  };
}

export interface CommunicationMessage {
  id: string;
  recipient_type: 'parent' | 'student' | 'group';
  recipient_ids: string[];
  subject: string;
  body: string;
  template_id?: string;
  sent_at: string;
  read_by: string[];
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface SharedResource {
  id: string;
  title: string;
  description: string;
  type: 'exercise' | 'strategy' | 'media' | 'evaluation';
  category: string;
  author_id: string;
  author_name: string;
  shared_at: string;
  rating: number;
  ratings_count: number;
  downloads: number;
  comments: Array<{
    id: string;
    author_name: string;
    text: string;
    created_at: string;
  }>;
  content_url?: string;
  tags: string[];
}

export interface ProfessionalDevelopment {
  id: string;
  teacher_id: string;
  courses_completed: Array<{
    id: string;
    title: string;
    provider: string;
    completion_date: string;
    certificate_url?: string;
    hours: number;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issue_date: string;
    expiry_date?: string;
    credential_id?: string;
  }>;
  total_hours: number;
  goals: Array<{
    id: string;
    description: string;
    target_date: string;
    completed: boolean;
    progress: number;
  }>;
  recommended_courses: Array<{
    id: string;
    title: string;
    provider: string;
    relevance_score: number;
    duration_hours: number;
  }>;
}

export interface TeacherDashboardStats {
  total_students: number;
  active_students: number;
  total_assignments: number;
  pending_alerts: number;
  average_class_score: number;
  completion_rate: number;
  engagement_rate: number;
}

// Filter types
export interface StudentFilter {
  status?: StudentStatus[];
  module_id?: string;
  score_range?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface AnalyticsFilter {
  start_date?: string;
  end_date?: string;
  module_id?: string;
  group_id?: string;
  student_ids?: string[];
}

// Additional types for new pages
export interface Classroom {
  id: string;
  name: string;
  subject: string;
  grade_level: string;
  student_count: number;
  created_at: string;
  updated_at: string;
  teacher_id: string;
}

export interface Exercise {
  id: string;
  title: string;
  type: string;
  difficulty: 'easy' | 'medium' | 'hard';
  module_id: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  status: 'pending' | 'graded' | 'late';
  score?: number;
  submitted_at: string;
  graded_at?: string;
}

export interface ClassroomAnalytics {
  classroom_id: string;
  average_score: number;
  completion_rate: number;
  engagement_rate: number;
  module_stats: ModuleStats[];
  student_performance: StudentPerformance[];
}

export interface ModuleStats {
  module_id: string;
  module_name: string;
  average_score: number;
  completion_rate: number;
}

export interface StudentPerformance {
  student_id: string;
  student_name: string;
  average_score: number;
  completion_rate: number;
  last_active: string;
}

export interface EngagementData {
  date: string;
  active_students: number;
  completed_exercises: number;
  average_time: number;
}

// Enhanced Dashboard Types
export interface DashboardClassroom {
  id: string;
  name: string;
  grade: string;
  subject: string;
  description: string;
  studentCount: number;
  capacity: number;
  isActive: boolean;
  recentActivity: string;
  averageScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardAssignment {
  id: string;
  title: string;
  description: string;
  classroomId: string;
  classroomName: string;
  exerciseIds: string[];
  dueDate: Date;
  submissionCount: number;
  totalStudents: number;
  status: 'draft' | 'active' | 'closed';
  createdAt: Date;
}

export interface DashboardSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  answers: SubmissionAnswer[];
  score: number | null;
  maxScore: number;
  grade: string | null;
  feedback: string | null;
  status: 'pending' | 'graded';
  submittedAt: Date;
  gradedAt: Date | null;
  attemptNumber: number;
}

export interface SubmissionAnswer {
  exerciseId: string;
  exerciseTitle: string;
  answer: string;
  isCorrect: boolean;
  pointsEarned: number;
  maxPoints: number;
}

export interface StudentAlert {
  id: string;
  type: 'struggling' | 'inactive' | 'at_risk';
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  message: string;
  details: string;
  severity: 'high' | 'medium' | 'low';
  classroomId: string;
  classroomName: string;
  createdAt: Date;
  dismissed: boolean;
}

export interface TeacherStats {
  totalClassrooms: number;
  totalStudents: number;
  pendingSubmissions: number;
  averagePerformance: number;
}

export interface CreateClassroomData {
  name: string;
  grade: string;
  subject: string;
  description: string;
  capacity: number;
}

export interface CreateAssignmentData {
  title: string;
  description: string;
  classroomId: string;
  exerciseIds: string[];
  dueDate: Date;
  maxAttempts: number;
}

export interface GradeSubmissionData {
  submissionId: string;
  score: number;
  feedback: string;
  grade: string;
}

export type SubjectColor = 'blue' | 'green' | 'purple' | 'orange' | 'gray';

export interface SubjectColorMap {
  Math: 'blue';
  Science: 'green';
  History: 'purple';
  Language: 'orange';
  [key: string]: SubjectColor;
}
