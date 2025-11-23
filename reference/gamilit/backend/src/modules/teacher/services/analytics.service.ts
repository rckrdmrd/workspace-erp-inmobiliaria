/**
 * Analytics Service
 *
 * Provides classroom-wide analytics and insights
 */

import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { ExerciseSubmission } from '@/modules/progress/entities/exercise-submission.entity';
import { Profile } from '@/modules/auth/entities/profile.entity';
import { Classroom } from '@/modules/social/entities/classroom.entity';
import { ClassroomMember } from '@/modules/social/entities/classroom-member.entity';
import { Assignment } from '@/modules/assignments/entities/assignment.entity';
import { AssignmentSubmission } from '@/modules/assignments/entities/assignment-submission.entity';
import { GetAnalyticsQueryDto, GetEngagementMetricsDto, GenerateReportsDto, StudentInsightsResponseDto } from '../dto';
import { GamilityRoleEnum } from '@/shared/constants/enums.constants';
import { StudentProgressService } from './student-progress.service';

/**
 * Analytics Service
 *
 * Provides classroom-wide analytics and insights with caching support
 */
@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly INSIGHTS_CACHE_PREFIX = 'student-insights:';

  constructor(
    @InjectRepository(ExerciseSubmission, 'progress')
    private readonly submissionRepository: Repository<ExerciseSubmission>,
    @InjectRepository(Profile, 'auth')
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(Classroom, 'social')
    private readonly classroomRepository: Repository<Classroom>,
    @InjectRepository(ClassroomMember, 'social')
    private readonly classroomMemberRepository: Repository<ClassroomMember>,
    @InjectRepository(Assignment, 'content')
    private readonly assignmentRepository: Repository<Assignment>,
    @InjectRepository(AssignmentSubmission, 'content')
    private readonly assignmentSubmissionRepository: Repository<AssignmentSubmission>,
    private readonly studentProgressService: StudentProgressService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Get comprehensive classroom analytics
   */
  async getClassroomAnalytics(query: GetAnalyticsQueryDto) {
    const students = await this.profileRepository.find({
      where: { role: GamilityRoleEnum.STUDENT },
    });

    const submissions = await this.submissionRepository.find();

    // Calculate main metrics
    const totalStudents = students.length;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeStudents = students.filter(
      (s) => s.last_activity_at && s.last_activity_at >= sevenDaysAgo,
    ).length;

    const avgScore = submissions.length > 0
      ? Math.round(
          submissions.reduce(
            (sum, sub) => sum + (sub.score / sub.max_score) * 100,
            0,
          ) / submissions.length,
        )
      : 0;

    const completedSubmissions = submissions.filter(
      (s) => s.is_correct,
    ).length;
    const avgCompletionRate = submissions.length > 0
      ? Math.round((completedSubmissions / submissions.length) * 100)
      : 0;

    // Score distribution
    const scoreRanges = [
      { range: '0-20%', count: 0, percentage: 0 },
      { range: '21-40%', count: 0, percentage: 0 },
      { range: '41-60%', count: 0, percentage: 0 },
      { range: '61-80%', count: 0, percentage: 0 },
      { range: '81-100%', count: 0, percentage: 0 },
    ];

    submissions.forEach((sub) => {
      const percentage = (sub.score / sub.max_score) * 100;
      if (percentage <= 20) scoreRanges[0].count++;
      else if (percentage <= 40) scoreRanges[1].count++;
      else if (percentage <= 60) scoreRanges[2].count++;
      else if (percentage <= 80) scoreRanges[3].count++;
      else scoreRanges[4].count++;
    });

    scoreRanges.forEach((range) => {
      range.percentage = submissions.length > 0
        ? Math.round((range.count / submissions.length) * 100)
        : 0;
    });

    return {
      analytics: {
        total_students: totalStudents,
        active_students: activeStudents,
        average_score: avgScore,
        average_completion_rate: avgCompletionRate,
        total_time_spent_minutes: 18500, // TODO: Calculate from submissions
        exercises_completed: submissions.length,
        achievements_unlocked: 456, // TODO: Get from achievements system
      },
      scoreDistribution: scoreRanges,
    };
  }

  /**
   * Get analytics for a specific classroom
   */
  async getClassroomAnalyticsByClassroomId(
    classroomId: string,
    query: GetAnalyticsQueryDto,
  ) {
    // Verify classroom exists
    const classroom = await this.classroomRepository.findOne({
      where: { id: classroomId },
    });

    if (!classroom) {
      throw new NotFoundException(`Classroom ${classroomId} not found`);
    }

    // Get classroom members
    const members = await this.classroomMemberRepository.find({
      where: { classroom_id: classroomId, is_active: true },
    });

    const studentIds = members.map((m) => m.student_id);

    // Calculate time filter
    let dateFilter: Date | undefined;
    if (query.time_range) {
      const now = new Date();
      switch (query.time_range) {
        case '7d':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    // Get submissions for classroom students
    const queryBuilder = this.submissionRepository.createQueryBuilder('sub');

    if (studentIds.length > 0) {
      queryBuilder.where('sub.user_id IN (:...studentIds)', { studentIds });
    }

    if (dateFilter) {
      queryBuilder.andWhere('sub.submitted_at >= :dateFilter', { dateFilter });
    }

    const submissions = await queryBuilder.getMany();

    // Calculate metrics
    const totalStudents = members.length;
    const activeStudents = members.filter((m) => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      // Would need last_activity_at field on ClassroomMember
      return true; // Placeholder
    }).length;

    const avgScore =
      submissions.length > 0
        ? Math.round(
            submissions.reduce(
              (sum, sub) => sum + (sub.score / sub.max_score) * 100,
              0,
            ) / submissions.length,
          )
        : 0;

    return {
      classroom_id: classroom.id,
      classroom_name: classroom.name,
      analytics: {
        total_students: totalStudents,
        active_students: activeStudents,
        average_score: avgScore,
        exercises_completed: submissions.length,
        completion_rate:
          submissions.length > 0
            ? Math.round(
                (submissions.filter((s) => s.is_correct).length /
                  submissions.length) *
                  100,
              )
            : 0,
      },
    };
  }

  /**
   * Get analytics for a specific assignment
   */
  async getAssignmentAnalytics(assignmentId: string) {
    // Get assignment
    const assignment = await this.assignmentRepository.findOne({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw new NotFoundException(`Assignment ${assignmentId} not found`);
    }

    // Get all submissions for this assignment
    const submissions = await this.assignmentSubmissionRepository.find({
      where: { assignmentId: assignmentId },
    });

    // Calculate metrics
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter((s) => s.score !== null).length;
    const pendingSubmissions = submissions.filter(
      (s) => s.score === null && s.submittedAt !== null,
    ).length;
    const lateSubmissions = submissions.filter((s) => {
      if (!assignment.dueDate || !s.submittedAt) return false;
      return s.submittedAt > assignment.dueDate;
    }).length;

    const avgScore =
      gradedSubmissions > 0
        ? Math.round(
            submissions
              .filter((s) => s.score !== null)
              .reduce((sum, sub) => sum + (sub.score || 0), 0) /
              gradedSubmissions,
          )
        : 0;

    // Score distribution
    const scoreRanges = [
      { range: '0-20%', count: 0 },
      { range: '21-40%', count: 0 },
      { range: '41-60%', count: 0 },
      { range: '61-80%', count: 0 },
      { range: '81-100%', count: 0 },
    ];

    submissions
      .filter((s) => s.score !== null)
      .forEach((sub) => {
        const percentage = ((sub.score || 0) / assignment.totalPoints) * 100;
        if (percentage <= 20) scoreRanges[0].count++;
        else if (percentage <= 40) scoreRanges[1].count++;
        else if (percentage <= 60) scoreRanges[2].count++;
        else if (percentage <= 80) scoreRanges[3].count++;
        else scoreRanges[4].count++;
      });

    return {
      assignment_id: assignment.id,
      assignment_title: assignment.title,
      assignment_type: assignment.assignmentType,
      total_points: assignment.totalPoints,
      due_date: assignment.dueDate,
      is_published: assignment.isPublished,
      analytics: {
        total_submissions: totalSubmissions,
        graded_submissions: gradedSubmissions,
        pending_submissions: pendingSubmissions,
        late_submissions: lateSubmissions,
        average_score: avgScore,
        submission_rate: 0, // Would need total students count
      },
      score_distribution: scoreRanges,
    };
  }

  /**
   * Get engagement metrics
   */
  async getEngagementMetrics(teacherId: string, query: GetEngagementMetricsDto) {
    // Get teacher's classrooms
    const classrooms = await this.classroomRepository.find({
      where: { teacher_id: teacherId },
    });

    const classroomIds = classrooms.map((c) => c.id);

    // Calculate time filter
    let dateFilter: Date | undefined;
    if (query.time_range) {
      const now = new Date();
      switch (query.time_range) {
        case '7d':
          dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90d':
          dateFilter = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
      }
    }

    // Get all members in teacher's classrooms
    const queryBuilder =
      this.classroomMemberRepository.createQueryBuilder('member');

    queryBuilder.where('member.classroom_id IN (:...classroomIds)', {
      classroomIds,
    });

    if (query.classroom_id) {
      queryBuilder.andWhere('member.classroom_id = :classroomId', {
        classroomId: query.classroom_id,
      });
    }

    const members = await queryBuilder.getMany();

    // Calculate engagement metrics
    const totalStudents = members.length;
    const activeStudents = members.filter((m) => m.is_active).length;

    // Get submissions in time range
    const submissionQueryBuilder =
      this.submissionRepository.createQueryBuilder('sub');

    if (dateFilter) {
      submissionQueryBuilder.where('sub.submitted_at >= :dateFilter', {
        dateFilter,
      });
    }

    const submissions = await submissionQueryBuilder.getMany();

    return {
      time_range: query.time_range || '30d',
      engagement_metrics: {
        total_students: totalStudents,
        active_students: activeStudents,
        engagement_rate:
          totalStudents > 0
            ? Math.round((activeStudents / totalStudents) * 100)
            : 0,
        total_submissions: submissions.length,
        average_submissions_per_student:
          totalStudents > 0
            ? Math.round(submissions.length / totalStudents)
            : 0,
        daily_active_users: 0, // Would need login tracking
        weekly_active_users: 0, // Would need login tracking
      },
      classrooms: classrooms.map((c) => ({
        classroom_id: c.id,
        classroom_name: c.name,
        student_count: members.filter((m) => m.classroom_id === c.id).length,
      })),
    };
  }

  /**
   * Generate comprehensive reports
   */
  async generateReports(teacherId: string, query: GenerateReportsDto) {
    // Get teacher's classrooms
    const classrooms = await this.classroomRepository.find({
      where: { teacher_id: teacherId },
    });

    // Get engagement metrics
    const engagementMetrics = await this.getEngagementMetrics(teacherId, {
      time_range: query.time_range,
      classroom_id: query.classroom_id,
    });

    // Get classroom analytics
    const classroomAnalytics = await Promise.all(
      classrooms
        .filter((c) => !query.classroom_id || c.id === query.classroom_id)
        .map((c) =>
          this.getClassroomAnalyticsByClassroomId(c.id, {
            time_range: query.time_range,
          }),
        ),
    );

    // Get teacher's assignments
    const assignments = await this.assignmentRepository.find({
      where: { teacherId: teacherId },
      order: { createdAt: 'DESC' },
      take: 10,
    });

    return {
      report_type: query.report_type || 'overall',
      format: query.format || 'json',
      time_range: query.time_range || '30d',
      generated_at: new Date().toISOString(),
      summary: {
        total_classrooms: classrooms.length,
        total_students: engagementMetrics.engagement_metrics.total_students,
        active_students: engagementMetrics.engagement_metrics.active_students,
        total_assignments: assignments.length,
      },
      engagement_metrics: engagementMetrics,
      classroom_analytics: classroomAnalytics,
      recent_assignments: assignments.map((a) => ({
        id: a.id,
        title: a.title,
        type: a.assignmentType,
        is_published: a.isPublished,
        due_date: a.dueDate,
        total_points: a.totalPoints,
        created_at: a.createdAt,
      })),
    };
  }

  /**
   * Get comprehensive insights for an individual student
   * Includes performance analysis, predictions, and recommendations
   *
   * Uses caching to improve performance. Cache TTL: 5 minutes
   * Cache can be cleared using invalidateStudentInsightsCache(studentId)
   */
  async getStudentInsights(studentId: string): Promise<StudentInsightsResponseDto> {
    const cacheKey = `${this.INSIGHTS_CACHE_PREFIX}${studentId}`;

    try {
      // Try to get from cache first
      const cachedInsights = await this.cacheManager.get<StudentInsightsResponseDto>(cacheKey);

      if (cachedInsights) {
        this.logger.debug(`Cache HIT for student insights: ${studentId}`);
        return cachedInsights;
      }

      this.logger.debug(`Cache MISS for student insights: ${studentId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Cache read error for ${cacheKey}: ${errorMessage}`);
      // Continue without cache on error
    }

    // Get comprehensive student data
    const stats = await this.studentProgressService.getStudentStats(studentId);
    const moduleProgress = await this.studentProgressService.getModuleProgress(studentId);
    const struggleAreas = await this.studentProgressService.getStruggleAreas(studentId);
    const classComparison = await this.studentProgressService.getClassComparison(studentId);

    // Calculate overall score (weighted average)
    const overall_score = Math.round(
      stats.average_score * 0.7 + // 70% weight on average score
      (stats.completed_modules / Math.max(stats.total_modules, 1)) * 100 * 0.3 // 30% on completion
    );

    // Find score percentile from class comparison
    const scoreComparison = classComparison.find(c => c.metric === 'Puntuación Promedio');
    const score_percentile = scoreComparison ? scoreComparison.percentile : 50;

    // Calculate risk level based on multiple factors
    const risk_level = this.calculateRiskLevel(stats, overall_score, struggleAreas.length);

    // Generate strengths based on performance
    const strengths = this.generateStrengths(stats, moduleProgress, overall_score);

    // Generate weaknesses from struggle areas
    const weaknesses = this.generateWeaknesses(struggleAreas, stats);

    // Calculate predictions
    const predictions = this.calculatePredictions(stats, overall_score, risk_level);

    // Generate personalized recommendations
    const recommendations = this.generateRecommendations(
      stats,
      struggleAreas,
      overall_score,
      risk_level
    );

    const insights: StudentInsightsResponseDto = {
      overall_score,
      modules_completed: stats.completed_modules,
      modules_total: stats.total_modules,
      comparison_to_class: {
        score_percentile,
      },
      risk_level,
      strengths,
      weaknesses,
      predictions,
      recommendations,
    };

    // Store in cache
    try {
      await this.cacheManager.set(cacheKey, insights, this.CACHE_TTL * 1000); // Convert to milliseconds
      this.logger.debug(`Cached student insights for ${studentId} (TTL: ${this.CACHE_TTL}s)`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Cache write error for ${cacheKey}: ${errorMessage}`);
      // Continue without caching on error
    }

    return insights;
  }

  /**
   * Invalidate cached insights for a student
   *
   * Call this method when student data changes (new submission, achievement unlocked, etc.)
   * to ensure fresh insights are generated on next request
   */
  async invalidateStudentInsightsCache(studentId: string): Promise<void> {
    const cacheKey = `${this.INSIGHTS_CACHE_PREFIX}${studentId}`;

    try {
      await this.cacheManager.del(cacheKey);
      this.logger.debug(`Invalidated cache for student insights: ${studentId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Cache delete error for ${cacheKey}: ${errorMessage}`);
    }
  }

  /**
   * Invalidate all student insights cache
   *
   * Useful when global data changes (e.g., class averages recalculated)
   */
  async invalidateAllStudentInsightsCache(): Promise<void> {
    try {
      // Note: cache-manager doesn't have a native way to delete by pattern
      // In production with Redis, use: await this.cacheManager.store.keys(`${this.INSIGHTS_CACHE_PREFIX}*`)
      // For now, this is a placeholder for future Redis implementation
      this.logger.debug('All student insights cache invalidation requested');
      // TODO: Implement pattern-based cache deletion when using Redis
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Error invalidating all insights cache: ${errorMessage}`);
    }
  }

  /**
   * Calculate student risk level
   */
  private calculateRiskLevel(
    stats: any,
    overall_score: number,
    struggleCount: number
  ): 'low' | 'medium' | 'high' {
    const completionRate = stats.total_modules > 0
      ? (stats.completed_modules / stats.total_modules) * 100
      : 0;

    // High risk indicators
    if (
      overall_score < 50 ||
      completionRate < 30 ||
      struggleCount >= 4 ||
      stats.current_streak_days === 0
    ) {
      return 'high';
    }

    // Medium risk indicators
    if (
      overall_score < 70 ||
      completionRate < 60 ||
      struggleCount >= 2
    ) {
      return 'medium';
    }

    return 'low';
  }

  /**
   * Generate student strengths
   */
  private generateStrengths(stats: any, moduleProgress: any[], overall_score: number): string[] {
    const strengths: string[] = [];

    if (overall_score >= 80) {
      strengths.push('Excelente rendimiento general con calificaciones consistentemente altas');
    }

    if (stats.current_streak_days >= 7) {
      strengths.push(`Mantiene una racha de ${stats.current_streak_days} días de estudio constante`);
    }

    const completionRate = stats.total_modules > 0
      ? (stats.completed_modules / stats.total_modules) * 100
      : 0;

    if (completionRate >= 70) {
      strengths.push('Alta tasa de finalización de módulos');
    }

    if (stats.average_score >= 85) {
      strengths.push('Dominio sobresaliente de los contenidos evaluados');
    }

    const avgTimePerExercise = stats.total_exercises > 0
      ? stats.total_time_spent_minutes / stats.total_exercises
      : 0;

    if (avgTimePerExercise >= 5 && avgTimePerExercise <= 15) {
      strengths.push('Buen balance entre velocidad y precisión en los ejercicios');
    }

    if (strengths.length === 0) {
      strengths.push('Muestra esfuerzo y dedicación en su aprendizaje');
    }

    return strengths.slice(0, 5); // Max 5 strengths
  }

  /**
   * Generate areas for improvement
   */
  private generateWeaknesses(struggleAreas: any[], stats: any): string[] {
    const weaknesses: string[] = [];

    // Add struggle areas
    struggleAreas.forEach(area => {
      weaknesses.push(`Dificultades en ${area.topic} con ${area.success_rate}% de éxito`);
    });

    // Add general weaknesses
    if (stats.average_score < 60) {
      weaknesses.push('Puntuación promedio por debajo del umbral de aprobación');
    }

    if (stats.current_streak_days === 0) {
      weaknesses.push('Necesita retomar el hábito de estudio regular');
    }

    const completionRate = stats.total_modules > 0
      ? (stats.completed_modules / stats.total_modules) * 100
      : 0;

    if (completionRate < 40) {
      weaknesses.push('Baja tasa de finalización de módulos iniciados');
    }

    if (weaknesses.length === 0) {
      weaknesses.push('Continuar practicando para mantener el nivel actual');
    }

    return weaknesses.slice(0, 5); // Max 5 weaknesses
  }

  /**
   * Calculate performance predictions
   */
  private calculatePredictions(
    stats: any,
    overall_score: number,
    risk_level: 'low' | 'medium' | 'high'
  ): { completion_probability: number; dropout_risk: number } {
    // Simple heuristic-based predictions
    let completion_probability = 0.5; // Default 50%
    let dropout_risk = 0.3; // Default 30%

    // Adjust based on overall score
    if (overall_score >= 80) {
      completion_probability = 0.9;
      dropout_risk = 0.05;
    } else if (overall_score >= 60) {
      completion_probability = 0.7;
      dropout_risk = 0.15;
    } else if (overall_score >= 40) {
      completion_probability = 0.4;
      dropout_risk = 0.45;
    } else {
      completion_probability = 0.2;
      dropout_risk = 0.7;
    }

    // Adjust based on streak
    if (stats.current_streak_days >= 7) {
      completion_probability += 0.1;
      dropout_risk -= 0.1;
    } else if (stats.current_streak_days === 0) {
      completion_probability -= 0.15;
      dropout_risk += 0.2;
    }

    // Adjust based on completion rate
    const completionRate = stats.total_modules > 0
      ? stats.completed_modules / stats.total_modules
      : 0;

    completion_probability = completion_probability * 0.7 + completionRate * 0.3;

    // Clamp values between 0 and 1
    completion_probability = Math.max(0, Math.min(1, completion_probability));
    dropout_risk = Math.max(0, Math.min(1, dropout_risk));

    return {
      completion_probability: Math.round(completion_probability * 100) / 100,
      dropout_risk: Math.round(dropout_risk * 100) / 100,
    };
  }

  /**
   * Generate personalized recommendations
   */
  private generateRecommendations(
    stats: any,
    struggleAreas: any[],
    overall_score: number,
    risk_level: 'low' | 'medium' | 'high'
  ): string[] {
    const recommendations: string[] = [];

    // High-priority recommendations for at-risk students
    if (risk_level === 'high') {
      recommendations.push('Programar sesión de tutoría individualizada urgente');
      recommendations.push('Revisar material de módulos anteriores para reforzar fundamentos');
    }

    // Address struggle areas
    if (struggleAreas.length > 0) {
      const topStruggle = struggleAreas[0];
      recommendations.push(
        `Dedicar tiempo extra a ${topStruggle.topic} con ejercicios de práctica adicionales`
      );
    }

    // Engagement recommendations
    if (stats.current_streak_days === 0) {
      recommendations.push('Establecer horario fijo de estudio diario para crear hábito');
    } else if (stats.current_streak_days < 3) {
      recommendations.push('Continuar con sesiones cortas diarias para mantener consistencia');
    }

    // Performance-based recommendations
    if (overall_score < 70 && stats.completed_exercises > 0) {
      recommendations.push('Repasar ejercicios incorrectos para identificar patrones de error');
    }

    if (stats.total_modules > 0 && stats.completed_modules / stats.total_modules < 0.5) {
      recommendations.push('Enfocarse en completar módulos iniciados antes de comenzar nuevos');
    }

    // Positive reinforcement for good performers
    if (risk_level === 'low' && overall_score >= 80) {
      recommendations.push('Explorar contenido avanzado o proyectos de extensión');
      recommendations.push('Considerar participar como tutor para reforzar conocimientos');
    }

    // Default recommendation
    if (recommendations.length === 0) {
      recommendations.push('Mantener el ritmo actual de estudio y práctica constante');
    }

    return recommendations.slice(0, 6); // Max 6 recommendations
  }
}
