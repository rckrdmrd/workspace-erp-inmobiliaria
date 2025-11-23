import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ExerciseSubmission } from '../entities';
import { CreateExerciseSubmissionDto } from '../dto';
import { ExerciseAnswerValidator } from '../dto/answers';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { TransactionTypeEnum } from '@shared/constants/enums.constants';
import { Exercise } from '@/modules/educational/entities';
import { Profile } from '@/modules/auth/entities';
import { UserStatsService } from '@/modules/gamification/services/user-stats.service';
import { MLCoinsService } from '@/modules/gamification/services/ml-coins.service';

/**
 * ExerciseSubmissionService
 *
 * Gestión de envíos finales de ejercicios
 * - CRUD de submissions (diferente de attempts)
 * - Workflow de estados: draft → submitted → graded → reviewed
 * - Auto-grading y feedback manual
 * - Agregación de datos del mejor intento
 * - Distribución de rewards (XP/ML Coins)
 * - Tracking de perfect scores
 */
@Injectable()
export class ExerciseSubmissionService {
  constructor(
    @InjectRepository(ExerciseSubmission, 'progress')
    private readonly submissionRepo: Repository<ExerciseSubmission>,
    @InjectRepository(Exercise, 'educational')
    private readonly exerciseRepo: Repository<Exercise>,
    @InjectRepository(Profile, 'auth')
    private readonly profileRepo: Repository<Profile>,
    @InjectEntityManager('progress')
    private readonly entityManager: EntityManager,
    private readonly userStatsService: UserStatsService,
    private readonly mlCoinsService: MLCoinsService,
  ) {}

  /**
   * Helper method to get profile.id from auth.users.id
   *
   * @description exercise_submissions table FK references profiles.id, but JWT contains auth.users.id.
   * This method converts auth.users.id → profiles.id
   *
   * @param userId - auth.users.id (from JWT token)
   * @returns profiles.id
   * @throws NotFoundException if profile doesn't exist
   */
  private async getProfileId(userId: string): Promise<string> {
    const profile = await this.profileRepo.findOne({
      where: { user_id: userId },
      select: ['id'],
    });

    if (!profile) {
      throw new NotFoundException(`Profile not found for user ${userId}`);
    }

    return profile.id;
  }

  /**
   * Crea un nuevo envío de ejercicio
   * @param dto - Datos del envío
   * @returns Nuevo envío creado
   */
  async create(dto: CreateExerciseSubmissionDto): Promise<ExerciseSubmission> {
    const newSubmission = this.submissionRepo.create({
      ...dto,
      status: 'submitted',
      submitted_at: new Date(),
      hint_used: dto.hint_used || false,
      hints_count: dto.hints_count || 0,
      comodines_used: dto.comodines_used || [],
      ml_coins_spent: dto.ml_coins_spent || 0,
      attempt_number: dto.attempt_number || 1,
      score: 0,
      max_score: dto.max_score || 100,
    });

    return await this.submissionRepo.save(newSubmission);
  }

  /**
   * Obtiene todos los envíos de un usuario
   * @param userId - ID del usuario
   * @returns Lista de envíos ordenados por fecha
   */
  async findByUserId(userId: string): Promise<ExerciseSubmission[]> {
    return await this.submissionRepo.find({
      where: { user_id: userId },
      order: { submitted_at: 'DESC' },
    });
  }

  /**
   * Obtiene todos los envíos de un ejercicio
   * @param exerciseId - ID del ejercicio
   * @returns Lista de envíos del ejercicio
   */
  async findByExerciseId(exerciseId: string): Promise<ExerciseSubmission[]> {
    return await this.submissionRepo.find({
      where: { exercise_id: exerciseId },
      order: { submitted_at: 'DESC' },
    });
  }

  /**
   * Obtiene el envío específico de un usuario en un ejercicio
   * @param userId - ID del usuario
   * @param exerciseId - ID del ejercicio
   * @returns Envío encontrado o null
   */
  async findByUserAndExercise(
    userId: string,
    exerciseId: string,
  ): Promise<ExerciseSubmission | null> {
    const submission = await this.submissionRepo.findOne({
      where: { user_id: userId, exercise_id: exerciseId },
      order: { submitted_at: 'DESC' },
    });

    return submission;
  }

  /**
   * Workflow completo de envío de ejercicio
   * @param userId - ID del usuario (auth.users.id from JWT)
   * @param exerciseId - ID del ejercicio
   * @param answers - Respuestas del ejercicio
   * @returns Envío creado y procesado
   */
  async submitExercise(
    userId: string,
    exerciseId: string,
    answers: Record<string, any>,
  ): Promise<ExerciseSubmission> {
    // CRITICAL FIX: Convert auth.users.id → profiles.id
    // exercise_submissions.user_id FK references profiles.id (NOT auth.users.id)
    const profileId = await this.getProfileId(userId);

    // FE-059: Get exercise to validate answer structure
    const exercise = await this.exerciseRepo.findOne({ where: { id: exerciseId } });
    if (!exercise) {
      throw new NotFoundException(`Exercise ${exerciseId} not found`);
    }

    // FE-059: Validate answer structure BEFORE saving to database
    console.log(`[FE-059] Validating answer structure for exercise type: ${exercise.exercise_type}`);
    await ExerciseAnswerValidator.validate(exercise.exercise_type, answers);

    // Verificar si ya existe un envío previo
    const existingSubmission = await this.findByUserAndExercise(profileId, exerciseId);

    if (existingSubmission && existingSubmission.status === 'graded') {
      throw new BadRequestException(
        'Exercise already submitted and graded. Cannot resubmit.',
      );
    }

    // Crear o actualizar submission
    const submissionData: CreateExerciseSubmissionDto = {
      user_id: profileId,  // FIXED: usar profileId en lugar de userId
      exercise_id: exerciseId,
      answer_data: answers,
      max_score: 100,
    };

    let submission: ExerciseSubmission;

    if (existingSubmission) {
      // Actualizar submission existente
      Object.assign(existingSubmission, {
        answer_data: answers,
        submitted_at: new Date(),
        status: 'submitted',
      });
      submission = await this.submissionRepo.save(existingSubmission);
    } else {
      // Crear nuevo submission
      submission = await this.create(submissionData);
    }

    // Auto-grade si es posible
    submission = await this.gradeSubmission(submission.id);

    // ✅ FIX BUG-001: Auto-claim rewards después de calificar
    if (submission.is_correct && submission.status === 'graded') {
      console.log(`[BUG-001 FIX] Auto-claiming rewards for submission ${submission.id}`);
      const rewards = await this.claimRewards(submission.id);

      // Agregar rewards al submission object para retornar al frontend
      (submission as any).xp_earned = rewards.xp_earned;
      (submission as any).ml_coins_earned = rewards.ml_coins_earned;
    }

    return submission;
  }

  /**
   * Califica un envío automáticamente o manualmente
   * @param id - ID del envío
   * @returns Envío calificado
   */
  async gradeSubmission(id: string): Promise<ExerciseSubmission> {
    const submission = await this.submissionRepo.findOne({ where: { id } });

    if (!submission) {
      throw new NotFoundException(`Exercise submission with ID ${id} not found`);
    }

    if (submission.status === 'graded') {
      throw new BadRequestException('Submission already graded');
    }

    // FE-059: Auto-grading using SQL validate_and_audit()
    const { score, isCorrect, correctAnswers, totalQuestions, feedback, details, auditId } = await this.autoGrade(
      submission.user_id,       // userId (profiles.id)
      submission.exercise_id,
      submission.answer_data,
      submission.attempt_number || 1,
      {}                        // clientMetadata - can add IP, user-agent later
    );

    submission.score = score;
    submission.is_correct = isCorrect;
    submission.status = 'graded';
    submission.graded_at = new Date();

    // FE-059: Audit ID is stored in educational_content.exercise_validation_audit
    // Can be queried using: exercise_id + user_id + attempt_number
    console.log(`[FE-059] Validation audit saved with ID: ${auditId}`);

    // Store validation results in submission
    (submission as any).correctAnswers = correctAnswers;
    (submission as any).totalQuestions = totalQuestions;

    // Calcular si es perfect score
    const isPerfectScore = score === submission.max_score && !submission.hint_used;

    if (isPerfectScore) {
      submission.feedback = 'Perfect score! Excellent work!';
    } else if (isCorrect) {
      submission.feedback = 'Good job! Exercise completed successfully.';
    } else {
      submission.feedback = 'Keep practicing. Review the material and try again.';
    }

    return await this.submissionRepo.save(submission);
  }

  /**
   * FE-059: Auto-grading using PostgreSQL validate_and_audit() function
   *
   * @description Validates exercise answers using centralized SQL validation with automatic auditing.
   * Replaces 17 hardcoded validators with single SQL call.
   *
   * @param userId - User ID from auth.users
   * @param exerciseId - ID of the exercise
   * @param answerData - User's submitted answers (JSONB format)
   * @param attemptNumber - Attempt number (1, 2, 3, ...)
   * @param clientMetadata - Optional metadata (IP, user-agent, etc.)
   * @returns Validation result with score, correctness, feedback, details, and audit ID
   */
  private async autoGrade(
    userId: string,
    exerciseId: string,
    answerData: Record<string, any>,
    attemptNumber: number = 1,
    clientMetadata: Record<string, any> = {}
  ): Promise<{
    score: number;
    isCorrect: boolean;
    correctAnswers: number;
    totalQuestions: number;
    feedback: string;
    details: any;
    auditId: string;
  }> {
    console.log(`[FE-059] Validating exercise ${exerciseId} using SQL validate_and_audit()`);

    // Call PostgreSQL validate_and_audit() function
    const query = `
      SELECT * FROM educational_content.validate_and_audit(
        $1::uuid,    -- exercise_id
        $2::uuid,    -- user_id
        $3::jsonb,   -- submitted_answer
        $4::integer, -- attempt_number
        $5::jsonb    -- client_metadata
      )
    `;

    try {
      const result = await this.entityManager.query(query, [
        exerciseId,
        userId,
        JSON.stringify(answerData),
        attemptNumber,
        JSON.stringify(clientMetadata)
      ]);

      if (!result || result.length === 0) {
        throw new InternalServerErrorException('Validation function returned no results');
      }

      const validation = result[0];

      console.log(`[FE-059] Validation result: score=${validation.score}/${validation.max_score}, correct=${validation.is_correct}, audit_id=${validation.audit_id}`);

      return {
        score: validation.score,
        isCorrect: validation.is_correct,
        correctAnswers: validation.details?.correct_answers || 0,
        totalQuestions: validation.details?.total_questions || validation.details?.total_words || validation.details?.total_events || 1,
        feedback: validation.feedback || '',
        details: validation.details || {},
        auditId: validation.audit_id
      };
    } catch (error) {
      console.error(`[FE-059] Error calling validate_and_audit():`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Exercise validation failed: ${errorMessage}`);
    }
  }

  /**
   * Agrega feedback manual a un envío
   * @param id - ID del envío
   * @param feedback - Feedback del profesor
   * @returns Envío actualizado
   */
  async provideFeedback(
    id: string,
    feedback: Record<string, any>,
  ): Promise<ExerciseSubmission> {
    const submission = await this.submissionRepo.findOne({ where: { id } });

    if (!submission) {
      throw new NotFoundException(`Exercise submission with ID ${id} not found`);
    }

    submission.feedback = typeof feedback === 'string' ? feedback : JSON.stringify(feedback);
    submission.status = 'reviewed';

    return await this.submissionRepo.save(submission);
  }

  /**
   * Actualiza el estado de un envío (state machine)
   * @param id - ID del envío
   * @param status - Nuevo estado
   * @returns Envío actualizado
   */
  async updateStatus(
    id: string,
    status: 'draft' | 'submitted' | 'graded' | 'reviewed',
  ): Promise<ExerciseSubmission> {
    const submission = await this.submissionRepo.findOne({ where: { id } });

    if (!submission) {
      throw new NotFoundException(`Exercise submission with ID ${id} not found`);
    }

    // Validar transiciones de estado válidas
    const validTransitions: Record<string, string[]> = {
      draft: ['submitted'],
      submitted: ['graded', 'draft'],
      graded: ['reviewed'],
      reviewed: [], // Estado final
    };

    const currentStatus = submission.status;
    if (!validTransitions[currentStatus]?.includes(status)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${status}`,
      );
    }

    submission.status = status;

    if (status === 'graded') {
      submission.graded_at = new Date();
    }

    return await this.submissionRepo.save(submission);
  }

  /**
   * Obtiene estadísticas de envíos de un usuario
   * @param userId - ID del usuario
   * @returns Estadísticas de completion rate, avg score, etc.
   */
  async getSubmissionStats(userId: string): Promise<{
    total_submissions: number;
    graded_submissions: number;
    completion_rate: number;
    average_score: number;
    perfect_scores_count: number;
    total_time_spent: number;
  }> {
    const submissions = await this.submissionRepo.find({
      where: { user_id: userId },
    });

    const gradedSubmissions = submissions.filter((s) => s.status === 'graded').length;
    const completionRate = submissions.length > 0 ? (gradedSubmissions / submissions.length) * 100 : 0;

    const validScores = submissions.filter((s) => s.score !== null && s.score !== undefined);
    const totalScore = validScores.reduce((sum, s) => sum + s.score, 0);
    const averageScore = validScores.length > 0 ? totalScore / validScores.length : 0;

    const perfectScoresCount = submissions.filter(
      (s) => s.score === s.max_score && !s.hint_used,
    ).length;

    const totalTimeSpent = submissions.reduce(
      (sum, s) => sum + (s.time_spent_seconds || 0),
      0,
    );

    return {
      total_submissions: submissions.length,
      graded_submissions: gradedSubmissions,
      completion_rate: Number(completionRate.toFixed(2)),
      average_score: Number(averageScore.toFixed(2)),
      perfect_scores_count: perfectScoresCount,
      total_time_spent: totalTimeSpent,
    };
  }

  /**
   * Obtiene envíos pendientes de revisión manual
   * @returns Lista de envíos que necesitan revisión
   */
  async findPendingReview(): Promise<ExerciseSubmission[]> {
    return await this.submissionRepo.find({
      where: { status: 'submitted' },
      order: { submitted_at: 'ASC' },
    });
  }

  /**
   * Distribuye rewards (XP/ML Coins) por completar ejercicio
   * @param id - ID del envío
   * @returns Envío con información de rewards
   */
  async claimRewards(id: string): Promise<{
    submission: ExerciseSubmission;
    xp_earned: number;
    ml_coins_earned: number;
  }> {
    const submission = await this.submissionRepo.findOne({ where: { id } });

    if (!submission) {
      throw new NotFoundException(`Exercise submission with ID ${id} not found`);
    }

    if (submission.status !== 'graded') {
      throw new BadRequestException('Submission must be graded before claiming rewards');
    }

    if (!submission.is_correct) {
      return {
        submission,
        xp_earned: 0,
        ml_coins_earned: 0,
      };
    }

    // Calcular rewards basado en score y hints usados
    const scorePercentage = (submission.score / submission.max_score) * 100;
    let xpEarned = Math.floor(scorePercentage);
    let mlCoinsEarned = Math.floor(scorePercentage / 10);

    // Bonificación por perfect score
    if (submission.score === submission.max_score && !submission.hint_used) {
      xpEarned += 50; // Bonus XP
      mlCoinsEarned += 10; // Bonus coins
    }

    // Penalizar por hints usados
    const hintPenalty = submission.hints_count * 5;
    xpEarned = Math.max(0, xpEarned - hintPenalty);

    // Restar ML Coins gastadas en comodines
    mlCoinsEarned = Math.max(0, mlCoinsEarned - submission.ml_coins_spent);

    // ✅ FIX BUG-001: Actualizar user_stats con XP y ML Coins
    console.log(`[BUG-001 FIX] Claiming rewards for user ${submission.user_id}: +${xpEarned} XP, +${mlCoinsEarned} ML Coins`);

    await this.userStatsService.addXp(submission.user_id, xpEarned);
    await this.mlCoinsService.addCoins(
      submission.user_id,
      mlCoinsEarned,
      TransactionTypeEnum.EARNED_EXERCISE,
      `Ejercicio completado: ${submission.exercise_id}`,
      submission.exercise_id,
      'exercise'
    );

    return {
      submission,
      xp_earned: xpEarned,
      ml_coins_earned: mlCoinsEarned,
    };
  }
}
