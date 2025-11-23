/**
 * Student Progress Service
 *
 * Provides detailed progress information for individual students
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { ExerciseSubmission } from '@/modules/progress/entities/exercise-submission.entity';
import { Profile } from '@/modules/auth/entities/profile.entity';
import { ModuleProgress } from '@/modules/progress/entities/module-progress.entity';
import { ClassroomMember } from '@/modules/social/entities/classroom-member.entity';
import { Classroom } from '@/modules/social/entities/classroom.entity';
import { User } from '@/modules/auth/entities/user.entity';
import { GetStudentProgressQueryDto, AddTeacherNoteDto, StudentNoteResponseDto } from '../dto';

export interface StudentOverview {
  id: string;
  full_name: string;
  username: string;
  email: string;
  maya_rank: string;
  current_level: number;
  total_xp: number;
  total_ml_coins: number;
  avatar_url?: string;
  joined_date: Date;
  last_login: Date;
}

export interface StudentStats {
  total_modules: number;
  completed_modules: number;
  total_exercises: number;
  completed_exercises: number;
  average_score: number;
  total_time_spent_minutes: number;
  current_streak_days: number;
  longest_streak_days: number;
  achievements_unlocked: number;
}

export interface ModuleProgressDetail {
  module_id: string;
  module_name: string;
  module_order: number;
  total_activities: number;
  completed_activities: number;
  average_score: number;
  time_spent_minutes: number;
  last_activity_date?: Date;
  status: 'not_started' | 'in_progress' | 'completed';
}

export interface ExerciseAttempt {
  id: string;
  exercise_title: string;
  module_name: string;
  exercise_type: string;
  is_correct: boolean;
  score_percentage: number;
  time_spent_seconds: number;
  hints_used: number;
  submitted_at: Date;
}

export interface StruggleArea {
  topic: string;
  module_name: string;
  attempts: number;
  success_rate: number;
  average_score: number;
  last_attempt_date: Date;
}

export interface ClassComparison {
  metric: string;
  student_value: number;
  class_average: number;
  percentile: number;
}

@Injectable()
export class StudentProgressService {
  constructor(
    @InjectRepository(ExerciseSubmission, 'progress')
    private readonly submissionRepository: Repository<ExerciseSubmission>,
    @InjectRepository(Profile, 'auth')
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ModuleProgress, 'progress')
    private readonly moduleProgressRepository: Repository<ModuleProgress>,
    @InjectRepository(ClassroomMember, 'social')
    private readonly classroomMemberRepository: Repository<ClassroomMember>,
    @InjectRepository(Classroom, 'social')
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(User, 'auth')
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Get complete student progress data
   */
  async getStudentProgress(
    studentId: string,
    query: GetStudentProgressQueryDto,
  ) {
    const student = await this.getStudentOverview(studentId);
    const stats = await this.getStudentStats(studentId);
    const moduleProgress = await this.getModuleProgress(studentId);
    const exerciseAttempts = await this.getExerciseHistory(studentId, query);
    const struggleAreas = await this.getStruggleAreas(studentId);
    const classComparison = await this.getClassComparison(studentId);

    return {
      student,
      stats,
      moduleProgress,
      exerciseAttempts,
      struggleAreas,
      classComparison,
    };
  }

  /**
   * Get student overview information
   */
  async getStudentOverview(studentId: string): Promise<StudentOverview> {
    const profile = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!profile) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // TODO: Get actual gamification data (XP, ML Coins, Maya Rank, Level)
    return {
      id: profile.id,
      full_name: profile.full_name || profile.display_name || 'Unknown',
      username: profile.email.split('@')[0], // Simple username extraction
      email: profile.email,
      maya_rank: 'ah_kin', // TODO: Get from gamification system
      current_level: 12, // TODO: Calculate from XP
      total_xp: 3450, // TODO: Get from gamification system
      total_ml_coins: 890, // TODO: Get from gamification system
      avatar_url: profile.avatar_url || undefined,
      joined_date: profile.created_at,
      last_login: profile.last_sign_in_at || profile.created_at,
    };
  }

  /**
   * Get student statistics
   */
  async getStudentStats(studentId: string): Promise<StudentStats> {
    const profile = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!profile) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Get all submissions
    const submissions = await this.submissionRepository.find({
      where: { user_id: profile.user_id || undefined },
    });

    // Get module progress
    const moduleProgresses = await this.moduleProgressRepository.find({
      where: { user_id: profile.user_id || undefined },
    });

    const completedModules = moduleProgresses.filter(
      (mp) => mp.progress_percentage === 100,
    ).length;

    const completedExercises = submissions.filter((s) => s.is_correct).length;

    const totalScore = submissions.reduce(
      (sum, sub) => sum + (sub.score / sub.max_score) * 100,
      0,
    );
    const averageScore =
      submissions.length > 0 ? Math.round(totalScore / submissions.length) : 0;

    const totalTimeSpent = submissions.reduce(
      (sum, sub) => sum + (sub.time_spent_seconds || 0),
      0,
    );

    return {
      total_modules: moduleProgresses.length,
      completed_modules: completedModules,
      total_exercises: submissions.length,
      completed_exercises: completedExercises,
      average_score: averageScore,
      total_time_spent_minutes: Math.round(totalTimeSpent / 60),
      current_streak_days: 7, // TODO: Calculate from activity dates
      longest_streak_days: 15, // TODO: Calculate from activity dates
      achievements_unlocked: 12, // TODO: Get from achievements system
    };
  }

  /**
   * Get module-by-module progress
   */
  async getModuleProgress(
    studentId: string,
  ): Promise<ModuleProgressDetail[]> {
    const profile = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!profile) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const moduleProgresses = await this.moduleProgressRepository.find({
      where: { user_id: profile.user_id || undefined },
    });

    // TODO: Join with actual module data to get names and details
    return moduleProgresses.map((mp, index) => ({
      module_id: mp.module_id,
      module_name: `Módulo ${index + 1}`, // TODO: Get from modules table
      module_order: index + 1,
      total_activities: 15, // TODO: Get from module
      completed_activities: Math.round(
        (mp.progress_percentage / 100) * 15,
      ),
      average_score: Math.round(mp.progress_percentage * 0.8), // Estimate
      time_spent_minutes: 0, // TODO: Calculate from submissions
      last_activity_date: mp.updated_at, // Using updated_at as proxy for last_activity
      status: this.calculateModuleStatus(mp.progress_percentage),
    }));
  }

  /**
   * Get exercise submission history
   */
  async getExerciseHistory(
    studentId: string,
    query: GetStudentProgressQueryDto,
  ): Promise<ExerciseAttempt[]> {
    const profile = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!profile) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    // Build query conditions
    const whereConditions: any = {
      user_id: profile.user_id,
    };

    // Apply time range filter
    if (query.time_range && query.time_range !== 'all') {
      const daysMap = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
      };
      const days = daysMap[query.time_range];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      whereConditions.submitted_at = MoreThanOrEqual(startDate);
    }

    // Apply status filter
    if (query.status && query.status !== 'all') {
      whereConditions.is_correct = query.status === 'correct';
    }

    const submissions = await this.submissionRepository.find({
      where: whereConditions,
      order: { submitted_at: 'DESC' },
    });

    // TODO: Join with exercise data to get titles and types
    return submissions.map((sub) => ({
      id: sub.id,
      exercise_title: 'Ejercicio', // TODO: Get from exercises table
      module_name: 'Módulo', // TODO: Get from modules table
      exercise_type: 'multiple_choice', // TODO: Get from exercises table
      is_correct: sub.is_correct || false,
      score_percentage: Math.round((sub.score / sub.max_score) * 100),
      time_spent_seconds: sub.time_spent_seconds || 0,
      hints_used: sub.hints_count || 0,
      submitted_at: sub.submitted_at,
    }));
  }

  /**
   * Identify struggle areas for student
   */
  async getStruggleAreas(studentId: string): Promise<StruggleArea[]> {
    const profile = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!profile) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    const submissions = await this.submissionRepository.find({
      where: { user_id: profile.user_id || undefined },
      order: { submitted_at: 'DESC' },
    });

    // Group by exercise to find struggles
    const exerciseMap = new Map<string, ExerciseSubmission[]>();
    submissions.forEach((sub) => {
      const key = sub.exercise_id;
      if (!exerciseMap.has(key)) {
        exerciseMap.set(key, []);
      }
      exerciseMap.get(key)!.push(sub);
    });

    const struggles: StruggleArea[] = [];

    exerciseMap.forEach((subs, exerciseId) => {
      const attempts = subs.length;
      const correctAttempts = subs.filter((s) => s.is_correct).length;
      const successRate = (correctAttempts / attempts) * 100;

      // Consider it a struggle if success rate < 70% and multiple attempts
      if (successRate < 70 && attempts >= 2) {
        const avgScore =
          subs.reduce((sum, s) => sum + (s.score / s.max_score) * 100, 0) /
          attempts;

        struggles.push({
          topic: 'Tema del ejercicio', // TODO: Get from exercise data
          module_name: 'Módulo', // TODO: Get from module data
          attempts,
          success_rate: Math.round(successRate),
          average_score: Math.round(avgScore),
          last_attempt_date: subs[0].submitted_at,
        });
      }
    });

    return struggles.slice(0, 5); // Return top 5 struggles
  }

  /**
   * Compare student with class averages
   */
  async getClassComparison(studentId: string): Promise<ClassComparison[]> {
    const studentStats = await this.getStudentStats(studentId);

    // Get all students for class averages
    const allProfiles = await this.profileRepository.find();
    const allSubmissions = await this.submissionRepository.find();

    // Calculate class averages
    const classAvgScore = allSubmissions.length > 0
      ? Math.round(
          allSubmissions.reduce(
            (sum, sub) => sum + (sub.score / sub.max_score) * 100,
            0,
          ) / allSubmissions.length,
        )
      : 0;

    const submissionsPerStudent = allSubmissions.length / allProfiles.length;

    return [
      {
        metric: 'Puntuación Promedio',
        student_value: studentStats.average_score,
        class_average: classAvgScore,
        percentile: this.calculatePercentile(
          studentStats.average_score,
          classAvgScore,
        ),
      },
      {
        metric: 'Ejercicios Completados',
        student_value: studentStats.completed_exercises,
        class_average: Math.round(submissionsPerStudent),
        percentile: this.calculatePercentile(
          studentStats.completed_exercises,
          submissionsPerStudent,
        ),
      },
      {
        metric: 'Tiempo de Estudio (min)',
        student_value: studentStats.total_time_spent_minutes,
        class_average: 1100, // TODO: Calculate actual class average
        percentile: this.calculatePercentile(
          studentStats.total_time_spent_minutes,
          1100,
        ),
      },
      {
        metric: 'Racha Actual (días)',
        student_value: studentStats.current_streak_days,
        class_average: 5, // TODO: Calculate actual class average
        percentile: this.calculatePercentile(
          studentStats.current_streak_days,
          5,
        ),
      },
    ];
  }

  /**
   * Calculate percentile (simplified)
   */
  private calculatePercentile(
    studentValue: number,
    classAverage: number,
  ): number {
    if (classAverage === 0) return 50;
    const ratio = studentValue / classAverage;
    return Math.min(100, Math.max(0, Math.round(ratio * 50)));
  }

  /**
   * Calculate module status based on completion
   */
  private calculateModuleStatus(
    completion: number,
  ): 'not_started' | 'in_progress' | 'completed' {
    if (completion === 0) return 'not_started';
    if (completion === 100) return 'completed';
    return 'in_progress';
  }

  // =====================================================
  // TEACHER NOTES METHODS
  // =====================================================

  /**
   * Get teacher notes for a student
   */
  async getStudentNotes(
    studentId: string,
    teacherId: string,
  ): Promise<StudentNoteResponseDto[]> {
    // Get student profile
    const student = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student ${studentId} not found`);
    }

    // Get student user
    const studentUser = await this.userRepository.findOne({
      where: { id: student.user_id || undefined },
    });

    if (!studentUser) {
      throw new NotFoundException(`User for student ${studentId} not found`);
    }

    // Get all classrooms where the teacher teaches
    const teacherClassrooms = await this.classroomRepository.find({
      where: { teacher_id: teacherId },
    });

    const classroomIds = teacherClassrooms.map((c) => c.id);

    if (classroomIds.length === 0) {
      return [];
    }

    // Get classroom memberships for this student in teacher's classrooms
    const memberships = await this.classroomMemberRepository
      .createQueryBuilder('member')
      .where('member.student_id = :studentId', { studentId })
      .andWhere('member.classroom_id IN (:...classroomIds)', { classroomIds })
      .getMany();

    // Get classroom details
    const classrooms = await this.classroomRepository.findByIds(classroomIds);
    const classroomMap = new Map(classrooms.map((c) => [c.id, c]));

    // Map to response DTOs
    return memberships.map((member) => {
      const classroom = classroomMap.get(member.classroom_id);
      return {
        student_id: student.id,
        email: studentUser.email,
        full_name: student.full_name || undefined,
        classroom_id: member.classroom_id,
        classroom_name: classroom?.name || undefined,
        teacher_notes: member.teacher_notes || undefined,
        updated_at: member.updated_at,
      };
    });
  }

  /**
   * Add or update teacher note for a student
   */
  async addStudentNote(
    studentId: string,
    teacherId: string,
    noteDto: AddTeacherNoteDto,
  ): Promise<StudentNoteResponseDto> {
    // Get student profile
    const student = await this.profileRepository.findOne({
      where: { id: studentId },
    });

    if (!student) {
      throw new NotFoundException(`Student ${studentId} not found`);
    }

    // Get student user
    const studentUser = await this.userRepository.findOne({
      where: { id: student.user_id || undefined },
    });

    if (!studentUser) {
      throw new NotFoundException(`User for student ${studentId} not found`);
    }

    // If classroom_id is provided, use it. Otherwise, find first classroom
    let classroomId = noteDto.classroom_id;

    if (!classroomId) {
      // Get first classroom where teacher teaches and student is enrolled
      const teacherClassrooms = await this.classroomRepository.find({
        where: { teacher_id: teacherId },
      });

      const classroomIds = teacherClassrooms.map((c) => c.id);

      const membership = await this.classroomMemberRepository.findOne({
        where: {
          student_id: studentId,
        },
      });

      if (!membership || !classroomIds.includes(membership.classroom_id)) {
        throw new BadRequestException(
          'Student is not enrolled in any of your classrooms. Please specify a classroom_id.',
        );
      }

      classroomId = membership.classroom_id;
    }

    // Verify teacher owns the classroom
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId, teacher_id: teacherId },
    });

    if (!classroom) {
      throw new BadRequestException(
        'You do not have permission to add notes for students in this classroom',
      );
    }

    // Find classroom member
    const member = await this.classroomMemberRepository.findOne({
      where: {
        classroom_id: classroomId,
        student_id: studentId,
      },
    });

    if (!member) {
      throw new NotFoundException(
        `Student ${studentId} is not enrolled in classroom ${classroomId}`,
      );
    }

    // Update teacher notes
    member.teacher_notes = noteDto.note;
    await this.classroomMemberRepository.save(member);

    return {
      student_id: student.id,
      email: studentUser.email,
      full_name: student.full_name || undefined,
      classroom_id: member.classroom_id,
      classroom_name: classroom.name || undefined,
      teacher_notes: member.teacher_notes || undefined,
      updated_at: member.updated_at,
    };
  }
}
