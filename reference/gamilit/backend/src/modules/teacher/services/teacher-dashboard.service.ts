/**
 * Teacher Dashboard Service
 *
 * Provides dashboard statistics and overview data for teachers
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ExerciseSubmission } from '@/modules/progress/entities/exercise-submission.entity';
import { Profile } from '@/modules/auth/entities/profile.entity';
import { ModuleProgress } from '@/modules/progress/entities/module-progress.entity';
import { GamilityRoleEnum } from '@/shared/constants/enums.constants';

export interface ClassroomStats {
  total_students: number;
  active_students: number;
  average_score: number;
  average_completion: number;
  total_submissions_pending: number;
  students_at_risk: number;
}

export interface RecentActivity {
  id: string;
  student_name: string;
  student_id: string;
  activity_type: 'submission' | 'achievement' | 'question';
  title: string;
  timestamp: Date;
  status?: 'pending' | 'graded' | 'needs_attention';
}

export interface StudentAlert {
  id: string;
  student_id: string;
  student_name: string;
  alert_type: 'low_score' | 'inactive' | 'struggling' | 'streak_broken';
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TopPerformer {
  student_id: string;
  student_name: string;
  total_xp: number;
  current_level: number;
  exercises_completed: number;
  average_score: number;
}

export interface ModuleProgressSummary {
  module_id: string;
  module_name: string;
  students_active: number;
  average_completion: number;
}

@Injectable()
export class TeacherDashboardService {
  constructor(
    @InjectRepository(ExerciseSubmission, 'progress')
    private readonly submissionRepository: Repository<ExerciseSubmission>,
    @InjectRepository(Profile, 'auth')
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ModuleProgress, 'progress')
    private readonly moduleProgressRepository: Repository<ModuleProgress>,
  ) {}

  /**
   * Get classroom statistics overview
   *
   * Fixed: Removed 'as any' casts, now uses In() operator properly
   */
  async getClassroomStats(teacherId: string): Promise<ClassroomStats> {
    // Get all students from teacher's classrooms
    // TODO: Implement classroom-teacher relationship
    // For now, we'll get all students
    const students = await this.profileRepository.find({
      where: { role: GamilityRoleEnum.STUDENT },
    });

    const totalStudents = students.length;

    if (totalStudents === 0) {
      return {
        total_students: 0,
        active_students: 0,
        average_score: 0,
        average_completion: 0,
        total_submissions_pending: 0,
        students_at_risk: 0,
      };
    }

    // Get active students (activity in last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeStudents = students.filter(
      (student) =>
        student.last_activity_at && student.last_activity_at >= sevenDaysAgo,
    );

    // Get all submissions for score calculation
    const studentUserIds = students.map(s => s.user_id).filter(id => id != null);
    const submissions = await this.submissionRepository.find({
      where: {
        user_id: In(studentUserIds),
      },
    });

    // Calculate average score
    const totalScore = submissions.reduce((sum, sub) => {
      const percentage = (sub.score / sub.max_score) * 100;
      return sum + percentage;
    }, 0);
    const averageScore = submissions.length > 0 ? Math.round(totalScore / submissions.length) : 0;

    // Get pending submissions
    const pendingSubmissions = submissions.filter(
      (sub) => sub.status === 'submitted' || sub.status === 'pending',
    ).length;

    // Get module progress for completion calculation
    const moduleProgresses = await this.moduleProgressRepository.find({
      where: {
        user_id: In(studentUserIds),
      },
    });

    const totalCompletion = moduleProgresses.reduce(
      (sum, mp) => sum + mp.progress_percentage,
      0,
    );
    const averageCompletion =
      moduleProgresses.length > 0
        ? Math.round(totalCompletion / moduleProgresses.length)
        : 0;

    // Calculate students at risk (low score or inactive)
    const studentsAtRisk = students.filter((student) => {
      const studentSubmissions = submissions.filter(
        (sub) => sub.user_id === student.user_id,
      );
      if (studentSubmissions.length === 0) return false;

      const studentAvgScore =
        studentSubmissions.reduce(
          (sum, sub) => sum + (sub.score / sub.max_score) * 100,
          0,
        ) / studentSubmissions.length;

      const isInactive =
        !student.last_activity_at ||
        student.last_activity_at < sevenDaysAgo;
      const hasLowScore = studentAvgScore < 60;

      return isInactive || hasLowScore;
    }).length;

    return {
      total_students: totalStudents,
      active_students: activeStudents.length,
      average_score: averageScore,
      average_completion: averageCompletion,
      total_submissions_pending: pendingSubmissions,
      students_at_risk: studentsAtRisk,
    };
  }

  /**
   * Get recent activities (submissions, achievements, etc.)
   *
   * Fixed: Removed cross-datasource join, now uses separate queries + merge in code
   */
  async getRecentActivities(
    teacherId: string,
    limit: number = 10,
  ): Promise<RecentActivity[]> {
    // 1. Get submissions from 'progress' datasource
    const submissions = await this.submissionRepository.find({
      order: { submitted_at: 'DESC' },
      take: limit,
    });

    if (submissions.length === 0) {
      return [];
    }

    // 2. Get profiles from 'auth' datasource
    const userIds = submissions.map(s => s.user_id);
    const profiles = await this.profileRepository.find({
      where: { user_id: In(userIds) },
    });

    // 3. Merge in code (aplicación)
    const activities: RecentActivity[] = submissions.map(sub => {
      const profile = profiles.find(p => p.user_id === sub.user_id);
      return {
        id: sub.id,
        student_name: profile?.full_name || profile?.display_name || 'Unknown',
        student_id: sub.user_id,
        activity_type: 'submission' as const,
        title: 'Entregó ejercicio',
        timestamp: sub.submitted_at,
        status: this.mapSubmissionStatus(sub.status),
      };
    });

    return activities;
  }

  /**
   * Get student alerts (low scores, inactive, struggling)
   *
   * Fixed: Eliminated N+1 query problem, now uses bulk query + grouping in code
   */
  async getStudentAlerts(teacherId: string): Promise<StudentAlert[]> {
    // 1. Get all students
    const students = await this.profileRepository.find({
      where: { role: GamilityRoleEnum.STUDENT },
    });

    if (students.length === 0) {
      return [];
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // 2. Get ALL submissions for ALL students in 1 query
    const studentUserIds = students.map(s => s.user_id).filter(id => id != null);
    const allSubmissions = await this.submissionRepository.find({
      where: { user_id: In(studentUserIds) },
      order: { submitted_at: 'DESC' },
    });

    // 3. Group submissions by student
    const submissionsByStudent = new Map<string, ExerciseSubmission[]>();
    for (const sub of allSubmissions) {
      if (!submissionsByStudent.has(sub.user_id)) {
        submissionsByStudent.set(sub.user_id, []);
      }
      submissionsByStudent.get(sub.user_id)!.push(sub);
    }

    // 4. Calculate alerts
    const alerts: StudentAlert[] = [];

    for (const student of students) {
      // Skip students without user_id
      if (!student.user_id) continue;

      // Check for inactivity
      if (
        !student.last_activity_at ||
        student.last_activity_at < sevenDaysAgo
      ) {
        alerts.push({
          id: `alert_${student.id}_inactive`,
          student_id: student.id,
          student_name: student.full_name || student.display_name || 'Unknown',
          alert_type: 'inactive',
          message: 'No ha tenido actividad en los últimos 7 días',
          severity: 'medium',
        });
      }

      // Check for low scores
      const studentSubmissions = submissionsByStudent.get(student.user_id) || [];
      const recentSubmissions = studentSubmissions.slice(0, 5);

      if (recentSubmissions.length > 0) {
        const avgScore =
          recentSubmissions.reduce(
            (sum, sub) => sum + (sub.score / sub.max_score) * 100,
            0,
          ) / recentSubmissions.length;

        if (avgScore < 60) {
          alerts.push({
            id: `alert_${student.id}_low_score`,
            student_id: student.id,
            student_name: student.full_name || student.display_name || 'Unknown',
            alert_type: 'low_score',
            message: `Promedio de ${Math.round(avgScore)}% en los últimos 5 ejercicios`,
            severity: avgScore < 40 ? 'high' : 'medium',
          });
        }
      }
    }

    return alerts.slice(0, 10); // Return top 10 alerts
  }

  /**
   * Get top performing students
   *
   * Fixed: Eliminated N+1 query problem, now uses bulk query + grouping in code
   */
  async getTopPerformers(
    teacherId: string,
    limit: number = 5,
  ): Promise<TopPerformer[]> {
    // 1. Get all students
    const students = await this.profileRepository.find({
      where: { role: GamilityRoleEnum.STUDENT },
    });

    if (students.length === 0) {
      return [];
    }

    // 2. Get ALL submissions for ALL students in 1 query
    const studentUserIds = students.map(s => s.user_id).filter(id => id != null);
    const allSubmissions = await this.submissionRepository.find({
      where: { user_id: In(studentUserIds) },
    });

    // 3. Group submissions by student
    const submissionsByStudent = new Map<string, ExerciseSubmission[]>();
    for (const sub of allSubmissions) {
      if (!submissionsByStudent.has(sub.user_id)) {
        submissionsByStudent.set(sub.user_id, []);
      }
      submissionsByStudent.get(sub.user_id)!.push(sub);
    }

    // 4. Calculate performers
    const performers: TopPerformer[] = [];

    for (const student of students) {
      // Skip students without user_id
      if (!student.user_id) continue;

      const studentSubmissions = submissionsByStudent.get(student.user_id) || [];

      if (studentSubmissions.length === 0) continue;

      const totalXP = studentSubmissions.reduce(
        (sum, sub) => sum + (sub.is_correct ? 50 : 0), // TODO: Get actual XP from exercise
        0,
      );

      const avgScore =
        studentSubmissions.reduce(
          (sum, sub) => sum + (sub.score / sub.max_score) * 100,
          0,
        ) / studentSubmissions.length;

      performers.push({
        student_id: student.id,
        student_name: student.full_name || student.display_name || 'Unknown',
        total_xp: totalXP,
        current_level: Math.floor(totalXP / 500) + 1, // Simple level calculation
        exercises_completed: studentSubmissions.length,
        average_score: Math.round(avgScore),
      });
    }

    // Sort by XP descending
    performers.sort((a, b) => b.total_xp - a.total_xp);

    return performers.slice(0, limit);
  }

  /**
   * Get module progress summary
   *
   * Fixed: Implemented with actual module data from database
   * Note: Module name will be fetched separately or shown as ID
   */
  async getModuleProgressSummary(
    teacherId: string,
  ): Promise<ModuleProgressSummary[]> {
    // 1. Get all module progress records
    const moduleProgresses = await this.moduleProgressRepository.find();

    if (moduleProgresses.length === 0) {
      return [];
    }

    // 2. Group by module_id
    const progressByModule = new Map<string, ModuleProgress[]>();
    for (const mp of moduleProgresses) {
      if (!progressByModule.has(mp.module_id)) {
        progressByModule.set(mp.module_id, []);
      }
      progressByModule.get(mp.module_id)!.push(mp);
    }

    // 3. Calculate summary per module
    const summary: ModuleProgressSummary[] = [];

    for (const [moduleId, progresses] of progressByModule.entries()) {
      const activeStudents = progresses.filter(
        p => p.status === 'in_progress' || p.status === 'completed',
      ).length;

      const totalCompletion = progresses.reduce(
        (sum, p) => sum + p.progress_percentage,
        0,
      );
      const avgCompletion = progresses.length > 0
        ? Math.round(totalCompletion / progresses.length)
        : 0;

      // Use module_id as name for now (can be improved later with a separate query)
      const moduleName = `Module ${moduleId}`;

      summary.push({
        module_id: moduleId,
        module_name: moduleName,
        students_active: activeStudents,
        average_completion: avgCompletion,
      });
    }

    // Sort by students_active DESC
    summary.sort((a, b) => b.students_active - a.students_active);

    return summary;
  }

  /**
   * Map submission status to activity status
   */
  private mapSubmissionStatus(
    status: string,
  ): 'pending' | 'graded' | 'needs_attention' | undefined {
    switch (status) {
      case 'submitted':
      case 'draft':
        return 'pending';
      case 'graded':
      case 'reviewed':
        return 'graded';
      default:
        return undefined;
    }
  }
}
