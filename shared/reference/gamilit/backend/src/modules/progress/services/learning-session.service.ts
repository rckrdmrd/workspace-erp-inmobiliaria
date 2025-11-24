import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, Not } from 'typeorm';
import { LearningSession } from '../entities';
import { CreateLearningSessionDto } from '../dto';
import { DB_SCHEMAS } from '@shared/constants/database.constants';

/**
 * LearningSessionService
 *
 * Gestión de sesiones de aprendizaje con tracking de tiempo y actividad
 * - CRUD de sesiones
 * - Control de sesiones activas/finalizadas
 * - Cálculo automático de duración
 * - Análisis de tiempo invertido
 * - Métricas de engagement
 */
@Injectable()
export class LearningSessionService {
  constructor(
    @InjectRepository(LearningSession, 'progress')
    private readonly sessionRepo: Repository<LearningSession>,
  ) {}

  /**
   * Crea una nueva sesión de aprendizaje
   * @param dto - Datos de la sesión
   * @returns Nueva sesión creada
   */
  async create(dto: CreateLearningSessionDto): Promise<LearningSession> {
    const newSession = this.sessionRepo.create({
      ...dto,
      started_at: new Date(),
      is_active: true,
      completion_status: 'ongoing',
      exercises_attempted: 0,
      exercises_completed: 0,
      content_viewed: 0,
      total_score: 0,
      total_xp_earned: 0,
      total_ml_coins_earned: 0,
      clicks_count: 0,
      page_views: 0,
      resource_downloads: 0,
      errors_encountered: 0,
      device_info: dto.device_info || {},
      browser_info: dto.browser_info || {},
      metadata: {},
    });

    return await this.sessionRepo.save(newSession);
  }

  /**
   * Obtiene todas las sesiones de un usuario
   * @param userId - ID del usuario
   * @returns Lista de sesiones ordenadas por fecha de inicio
   */
  async findByUserId(userId: string): Promise<LearningSession[]> {
    return await this.sessionRepo.find({
      where: { user_id: userId },
      order: { started_at: 'DESC' },
    });
  }

  /**
   * Obtiene una sesión por su ID
   * @param id - ID de la sesión
   * @returns Sesión encontrada o lanza excepción
   */
  async findById(id: string): Promise<LearningSession> {
    const session = await this.sessionRepo.findOne({ where: { id } });

    if (!session) {
      throw new NotFoundException(`Learning session with ID ${id} not found`);
    }

    return session;
  }

  /**
   * Finaliza una sesión y calcula duración automáticamente
   * @param id - ID de la sesión
   * @returns Sesión actualizada con duración calculada
   */
  async endSession(id: string): Promise<LearningSession> {
    const session = await this.findById(id);

    if (!session.is_active) {
      throw new BadRequestException('Session is already ended');
    }

    const endTime = new Date();
    session.ended_at = endTime;
    session.is_active = false;
    session.completion_status = 'completed';

    // Calcular duración en segundos
    const durationSeconds = Math.floor(
      (endTime.getTime() - session.started_at.getTime()) / 1000,
    );

    // Convertir a formato interval PostgreSQL (HH:MM:SS)
    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;
    session.duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Si no hay active_time definido, asumir que toda la duración fue activa
    if (!session.active_time) {
      session.active_time = session.duration;
      session.idle_time = '00:00:00';
    }

    return await this.sessionRepo.save(session);
  }

  /**
   * Actualiza métricas de engagement de una sesión
   * @param id - ID de la sesión
   * @param metrics - Métricas a actualizar (clicks, page_views, etc.)
   * @returns Sesión actualizada
   */
  async updateEngagement(
    id: string,
    metrics: {
      clicks_count?: number;
      page_views?: number;
      resource_downloads?: number;
      exercises_attempted?: number;
      exercises_completed?: number;
      content_viewed?: number;
      active_time?: string;
      idle_time?: string;
    },
  ): Promise<LearningSession> {
    const session = await this.findById(id);

    Object.assign(session, metrics);
    return await this.sessionRepo.save(session);
  }

  /**
   * Obtiene la sesión activa de un usuario
   * @param userId - ID del usuario
   * @returns Sesión activa o null si no hay ninguna
   */
  async getActiveSession(userId: string): Promise<LearningSession | null> {
    const activeSession = await this.sessionRepo.findOne({
      where: {
        user_id: userId,
        is_active: true,
      },
      order: { started_at: 'DESC' },
    });

    return activeSession;
  }

  /**
   * Obtiene estadísticas de tiempo invertido por periodo
   * @param userId - ID del usuario
   * @param period - Periodo de análisis (daily, weekly, monthly)
   * @returns Estadísticas de tiempo invertido
   */
  async getSessionStats(
    userId: string,
    period: 'daily' | 'weekly' | 'monthly',
  ): Promise<{
    total_sessions: number;
    total_time_spent: string;
    average_session_duration: string;
    exercises_completed: number;
    total_xp_earned: number;
    total_ml_coins_earned: number;
  }> {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const sessions = await this.sessionRepo.find({
      where: {
        user_id: userId,
        started_at: Between(startDate, now),
      },
    });

    const totalExercisesCompleted = sessions.reduce(
      (sum, s) => sum + s.exercises_completed,
      0,
    );

    const totalXp = sessions.reduce((sum, s) => sum + s.total_xp_earned, 0);
    const totalCoins = sessions.reduce((sum, s) => sum + s.total_ml_coins_earned, 0);

    // Calcular tiempo total (simplificado, asumiendo que duration está en formato HH:MM:SS)
    const totalSeconds = sessions.reduce((sum, s) => {
      if (!s.duration) return sum;
      const [hours, minutes, seconds] = s.duration.split(':').map(Number);
      return sum + hours * 3600 + minutes * 60 + seconds;
    }, 0);

    const avgSeconds = sessions.length > 0 ? totalSeconds / sessions.length : 0;

    const formatTime = (totalSec: number): string => {
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return {
      total_sessions: sessions.length,
      total_time_spent: formatTime(totalSeconds),
      average_session_duration: formatTime(Math.floor(avgSeconds)),
      exercises_completed: totalExercisesCompleted,
      total_xp_earned: totalXp,
      total_ml_coins_earned: totalCoins,
    };
  }

  /**
   * Obtiene sesiones filtradas por rango de fechas
   * @param userId - ID del usuario
   * @param startDate - Fecha de inicio
   * @param endDate - Fecha de fin
   * @returns Lista de sesiones en el rango
   */
  async findByDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<LearningSession[]> {
    return await this.sessionRepo.find({
      where: {
        user_id: userId,
        started_at: Between(startDate, endDate),
      },
      order: { started_at: 'DESC' },
    });
  }
}
