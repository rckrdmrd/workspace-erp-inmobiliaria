import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ExerciseAttempt } from '../entities';
import { CreateExerciseAttemptDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';
import { TransactionTypeEnum } from '@shared/constants/enums.constants';
import { MLCoinsService } from '@/modules/gamification/services/ml-coins.service';
import { UserStatsService } from '@/modules/gamification/services/user-stats.service';

/**
 * ExerciseAttemptService
 *
 * Gestión de intentos individuales de ejercicios
 * - CRUD de intentos
 * - Auto-incremento de número de intento
 * - Scoring y validación de respuestas
 * - Tracking de hints y comodines
 * - Cálculo de estadísticas de rendimiento
 * - Awarding de rewards (XP/ML Coins) automático al completar
 */
@Injectable()
export class ExerciseAttemptService {
  private readonly logger = new Logger(ExerciseAttemptService.name);

  constructor(
    @InjectRepository(ExerciseAttempt, 'progress')
    private readonly attemptRepo: Repository<ExerciseAttempt>,
    private readonly mlCoinsService: MLCoinsService,
    private readonly userStatsService: UserStatsService,
    @InjectEntityManager('progress')
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Crea un nuevo intento de ejercicio
   * @param dto - Datos del intento
   * @returns Nuevo intento creado
   */
  async create(dto: CreateExerciseAttemptDto): Promise<ExerciseAttempt> {
    // Obtener el próximo número de intento
    const attemptNumber = await this.getNextAttemptNumber(dto.user_id, dto.exercise_id);

    const newAttempt = this.attemptRepo.create({
      ...dto,
      attempt_number: attemptNumber,
      submitted_at: new Date(),
      hints_used: dto.hints_used || 0,
      comodines_used: dto.comodines_used || [],
      xp_earned: dto.xp_earned || 0,
      ml_coins_earned: dto.ml_coins_earned || 0,
      metadata: dto.metadata || {
        browser: null,
        device_type: null,
        response_pattern: [],
      },
    });

    return await this.attemptRepo.save(newAttempt);
  }

  /**
   * Obtiene todos los intentos de un usuario
   * @param userId - ID del usuario
   * @returns Lista de intentos ordenados por fecha
   */
  async findByUserId(userId: string): Promise<ExerciseAttempt[]> {
    return await this.attemptRepo.find({
      where: { user_id: userId },
      order: { submitted_at: 'DESC' },
    });
  }

  /**
   * Obtiene todos los intentos de un ejercicio específico
   * @param exerciseId - ID del ejercicio
   * @returns Lista de intentos del ejercicio
   */
  async findByExerciseId(exerciseId: string): Promise<ExerciseAttempt[]> {
    return await this.attemptRepo.find({
      where: { exercise_id: exerciseId },
      order: { submitted_at: 'DESC' },
    });
  }

  /**
   * Obtiene todos los intentos de un usuario en un ejercicio específico
   * @param userId - ID del usuario
   * @param exerciseId - ID del ejercicio
   * @returns Lista de intentos del usuario en el ejercicio
   */
  async findByUserAndExercise(userId: string, exerciseId: string): Promise<ExerciseAttempt[]> {
    return await this.attemptRepo.find({
      where: { user_id: userId, exercise_id: exerciseId },
      order: { attempt_number: 'ASC' },
    });
  }

  /**
   * Obtiene el próximo número de intento para un usuario en un ejercicio
   * @param userId - ID del usuario
   * @param exerciseId - ID del ejercicio
   * @returns Número del próximo intento (1 si es el primero)
   */
  async getNextAttemptNumber(userId: string, exerciseId: string): Promise<number> {
    const lastAttempt = await this.attemptRepo.findOne({
      where: { user_id: userId, exercise_id: exerciseId },
      order: { attempt_number: 'DESC' },
    });

    return lastAttempt ? lastAttempt.attempt_number + 1 : 1;
  }

  /**
   * Envía un intento y calcula el score
   * @param id - ID del intento
   * @param answers - Respuestas enviadas
   * @returns Intento actualizado con score
   */
  async submitAttempt(
    id: string,
    answers: Record<string, any>,
  ): Promise<ExerciseAttempt> {
    const attempt = await this.attemptRepo.findOne({ where: { id } });

    if (!attempt) {
      throw new NotFoundException(`Exercise attempt with ID ${id} not found`);
    }

    attempt.submitted_answers = answers;
    attempt.submitted_at = new Date();

    // FE-059: Use SQL validate_and_audit() for scoring (replaces placeholder)
    const { score, isCorrect, feedback, details, auditId } = await this.calculateScore(
      attempt.user_id,
      attempt.exercise_id,
      answers,
      attempt.attempt_number
    );

    attempt.score = score;
    attempt.is_correct = isCorrect;

    // FE-059: Audit ID is stored in educational_content.exercise_validation_audit
    // Can be queried using: exercise_id + user_id + attempt_number
    this.logger.log(`[FE-059] Validation audit saved with ID: ${auditId}`);

    // Calcular rewards (XP y ML Coins)
    if (isCorrect) {
      attempt.xp_earned = this.calculateXpReward(score, attempt.hints_used);
      attempt.ml_coins_earned = this.calculateCoinsReward(score, attempt.comodines_used.length);
    }

    const savedAttempt = await this.attemptRepo.save(attempt);

    // Otorgar recompensas automáticamente si el intento fue correcto
    if (isCorrect && (attempt.xp_earned > 0 || attempt.ml_coins_earned > 0)) {
      await this.awardRewards(attempt.user_id, attempt.exercise_id, attempt.xp_earned, attempt.ml_coins_earned);
    }

    return savedAttempt;
  }

  /**
   * FE-059: Calcula el score usando PostgreSQL validate_and_audit()
   *
   * @description Reemplaza el placeholder que siempre retornaba 100/true.
   * Ahora usa el sistema de validación centralizado en SQL con auditoría automática.
   *
   * @param userId - ID del usuario (profiles.id)
   * @param exerciseId - ID del ejercicio
   * @param answers - Respuestas enviadas
   * @param attemptNumber - Número de intento
   * @returns Score, correctness, feedback, details, y audit ID
   */
  private async calculateScore(
    userId: string,
    exerciseId: string,
    answers: Record<string, any>,
    attemptNumber: number,
  ): Promise<{
    score: number;
    isCorrect: boolean;
    feedback: string;
    details: any;
    auditId: string;
  }> {
    this.logger.log(`[FE-059] Validating attempt #${attemptNumber} for exercise ${exerciseId}`);

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
        JSON.stringify(answers),
        attemptNumber,
        JSON.stringify({})
      ]);

      if (!result || result.length === 0) {
        throw new InternalServerErrorException('Validation function returned no results');
      }

      const validation = result[0];

      this.logger.log(
        `[FE-059] Validation result: score=${validation.score}/${validation.max_score}, ` +
        `correct=${validation.is_correct}, audit_id=${validation.audit_id}`
      );

      return {
        score: validation.score,
        isCorrect: validation.is_correct,
        feedback: validation.feedback || '',
        details: validation.details || {},
        auditId: validation.audit_id
      };
    } catch (error) {
      this.logger.error(`[FE-059] Error calling validate_and_audit():`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      throw new InternalServerErrorException(`Exercise validation failed: ${errorMessage}`);
    }
  }

  /**
   * Calcula XP ganada basada en score y hints usados
   * @param score - Score obtenido
   * @param hintsUsed - Cantidad de hints usados
   * @returns XP ganada
   */
  private calculateXpReward(score: number, hintsUsed: number): number {
    let baseXp = score; // 1:1 ratio por defecto

    // Penalizar por hints usados
    const hintPenalty = hintsUsed * 10;
    baseXp = Math.max(0, baseXp - hintPenalty);

    return baseXp;
  }

  /**
   * Calcula ML Coins ganadas basada en score y comodines usados
   * @param score - Score obtenido
   * @param comodinesUsed - Cantidad de comodines usados
   * @returns ML Coins ganadas
   */
  private calculateCoinsReward(score: number, comodinesUsed: number): number {
    let baseCoins = Math.floor(score / 10); // 10 coins por cada 100 puntos

    // Penalizar por comodines usados
    const comodinPenalty = comodinesUsed * 2;
    baseCoins = Math.max(0, baseCoins - comodinPenalty);

    return baseCoins;
  }

  /**
   * Obtiene estadísticas de intentos de un usuario
   * @param userId - ID del usuario
   * @returns Estadísticas de accuracy, score promedio, etc.
   */
  async getAttemptStats(userId: string): Promise<{
    total_attempts: number;
    correct_attempts: number;
    accuracy_rate: number;
    average_score: number;
    total_xp_earned: number;
    total_coins_earned: number;
    hints_used_total: number;
    comodines_used_total: number;
  }> {
    const attempts = await this.attemptRepo.find({
      where: { user_id: userId },
    });

    const correctAttempts = attempts.filter((a) => a.is_correct === true).length;
    const accuracyRate = attempts.length > 0 ? (correctAttempts / attempts.length) * 100 : 0;

    const validScores = attempts.filter((a) => a.score !== null && a.score !== undefined);
    const totalScore = validScores.reduce((sum, a) => sum + (a.score || 0), 0);
    const averageScore = validScores.length > 0 ? totalScore / validScores.length : 0;

    const totalXp = attempts.reduce((sum, a) => sum + a.xp_earned, 0);
    const totalCoins = attempts.reduce((sum, a) => sum + a.ml_coins_earned, 0);
    const totalHints = attempts.reduce((sum, a) => sum + a.hints_used, 0);
    const totalComodines = attempts.reduce((sum, a) => sum + a.comodines_used.length, 0);

    return {
      total_attempts: attempts.length,
      correct_attempts: correctAttempts,
      accuracy_rate: Number(accuracyRate.toFixed(2)),
      average_score: Number(averageScore.toFixed(2)),
      total_xp_earned: totalXp,
      total_coins_earned: totalCoins,
      hints_used_total: totalHints,
      comodines_used_total: totalComodines,
    };
  }

  /**
   * Obtiene el mejor intento de un usuario en un ejercicio
   * @param userId - ID del usuario
   * @param exerciseId - ID del ejercicio
   * @returns Mejor intento (score más alto)
   */
  async getBestAttempt(userId: string, exerciseId: string): Promise<ExerciseAttempt | null> {
    const attempts = await this.findByUserAndExercise(userId, exerciseId);

    if (attempts.length === 0) {
      return null;
    }

    // Encontrar intento con score más alto
    const bestAttempt = attempts.reduce((best, current) => {
      if (!current.score) return best;
      if (!best.score) return current;
      return current.score > best.score ? current : best;
    });

    return bestAttempt;
  }

  /**
   * Registra el uso de comodines en un intento
   * @param id - ID del intento
   * @param comodines - Lista de comodines usados
   * @returns Intento actualizado
   */
  async trackComodinesUsage(id: string, comodines: string[]): Promise<ExerciseAttempt> {
    const attempt = await this.attemptRepo.findOne({ where: { id } });

    if (!attempt) {
      throw new NotFoundException(`Exercise attempt with ID ${id} not found`);
    }

    attempt.comodines_used = [...new Set([...attempt.comodines_used, ...comodines])];
    return await this.attemptRepo.save(attempt);
  }

  /**
   * Otorga recompensas (XP y ML Coins) al usuario por completar un ejercicio
   *
   * @description Método privado que se ejecuta automáticamente después de
   * un intento correcto. Integra con MLCoinsService y UserStatsService
   * para otorgar las recompensas calculadas.
   *
   * @param userId - ID del usuario
   * @param exerciseId - ID del ejercicio completado
   * @param xpEarned - XP ganada (calculada con penalizaciones por hints)
   * @param mlCoinsEarned - ML Coins ganadas (calculadas con penalizaciones por comodines)
   *
   * @private
   */
  private async awardRewards(
    userId: string,
    exerciseId: string,
    xpEarned: number,
    mlCoinsEarned: number,
  ): Promise<void> {
    // Otorgar ML Coins
    if (mlCoinsEarned > 0) {
      try {
        await this.mlCoinsService.addCoins(
          userId,
          mlCoinsEarned,
          TransactionTypeEnum.EARNED_EXERCISE,
          `Exercise completed: ${exerciseId}`,
          exerciseId,
          'exercise',
        );
        this.logger.log(
          `Awarded ${mlCoinsEarned} ML Coins to user ${userId} for completing exercise ${exerciseId}`,
        );
      } catch (error: unknown) {
        this.logger.error(
          `Failed to award ML Coins for exercise ${exerciseId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        // Continue execution - don't fail the entire operation
      }
    }

    // Otorgar XP
    if (xpEarned > 0) {
      try {
        await this.userStatsService.addXp(userId, xpEarned);
        this.logger.log(
          `Awarded ${xpEarned} XP to user ${userId} for completing exercise ${exerciseId}`,
        );
      } catch (error: unknown) {
        this.logger.error(
          `Failed to award XP for exercise ${exerciseId}: ${error instanceof Error ? error.message : String(error)}`,
        );
        // Continue execution - don't fail the entire operation
      }
    }
  }
}
