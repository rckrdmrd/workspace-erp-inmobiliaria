import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { AuthAttempt } from '../entities';
import { CreateAuthAttemptDto } from '../dto';
import { DB_SCHEMAS } from '@/shared/constants';

/**
 * SecurityService
 *
 * @description Servicio de seguridad y auditoría.
 *
 * @responsibilities
 * - Logging de intentos de autenticación
 * - Rate limiting por email y IP
 * - Detección de ataques de fuerza bruta
 * - Análisis de patrones sospechosos
 *
 * @rate_limits
 * - 5 intentos fallidos por email en 15 minutos
 * - 10 intentos fallidos por IP en 15 minutos
 * - Bloqueo temporal de 30 minutos
 */
@Injectable()
export class SecurityService {
  private readonly MAX_FAILURES_PER_EMAIL = 5;
  private readonly MAX_FAILURES_PER_IP = 10;
  private readonly RATE_LIMIT_WINDOW_MINUTES = 15;
  private readonly BLOCK_DURATION_MINUTES = 30;

  constructor(
    @InjectRepository(AuthAttempt, 'auth')
    private readonly attemptRepository: Repository<AuthAttempt>,
  ) {}

  /**
   * Registrar intento de autenticación
   */
  async logAttempt(dto: CreateAuthAttemptDto): Promise<AuthAttempt> {
    const attempt = this.attemptRepository.create(dto);
    return await this.attemptRepository.save(attempt);
  }

  /**
   * Verificar rate limiting
   */
  async checkRateLimit(
    email: string,
    ip?: string,
  ): Promise<{ isBlocked: boolean; reason?: string }> {
    // 1. Verificar intentos por email
    const emailFailures = await this.getRecentFailures(email, this.RATE_LIMIT_WINDOW_MINUTES);

    if (emailFailures >= this.MAX_FAILURES_PER_EMAIL) {
      return {
        isBlocked: true,
        reason: `Demasiados intentos fallidos para ${email}. Intente de nuevo en ${this.BLOCK_DURATION_MINUTES} minutos.`,
      };
    }

    // 2. Verificar intentos por IP (si se proporciona)
    if (ip) {
      const ipFailures = await this.getRecentFailuresByIP(ip, this.RATE_LIMIT_WINDOW_MINUTES);

      if (ipFailures >= this.MAX_FAILURES_PER_IP) {
        return {
          isBlocked: true,
          reason: `Demasiados intentos fallidos desde esta IP. Intente de nuevo en ${this.BLOCK_DURATION_MINUTES} minutos.`,
        };
      }
    }

    return { isBlocked: false };
  }

  /**
   * Contar intentos fallidos recientes por email
   */
  async getRecentFailures(email: string, minutes: number = 15): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    return await this.attemptRepository.count({
      where: {
        email,
        success: false,
        attempted_at: MoreThan(since),
      },
    });
  }

  /**
   * Contar intentos fallidos recientes por IP
   */
  async getRecentFailuresByIP(ip: string, minutes: number = 15): Promise<number> {
    const since = new Date(Date.now() - minutes * 60 * 1000);

    return await this.attemptRepository.count({
      where: {
        ip_address: ip,
        success: false,
        attempted_at: MoreThan(since),
      },
    });
  }

  /**
   * Detectar ataque de fuerza bruta por email
   */
  async detectBruteForce(email: string): Promise<boolean> {
    // Buscar patrones sospechosos en los últimos 5 minutos
    const since = new Date(Date.now() - 5 * 60 * 1000);

    const recentAttempts = await this.attemptRepository.count({
      where: {
        email,
        success: false,
        attempted_at: MoreThan(since),
      },
    });

    // Si hay más de 10 intentos fallidos en 5 minutos, es fuerza bruta
    return recentAttempts > 10;
  }

  /**
   * Obtener historial de intentos por email
   */
  async getAttemptHistory(email: string, limit: number = 10): Promise<AuthAttempt[]> {
    return await this.attemptRepository.find({
      where: { email },
      order: { attempted_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Limpiar registros antiguos (cron job)
   */
  async cleanOldAttempts(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await this.attemptRepository.delete({
      attempted_at: LessThan(cutoffDate),
    });

    return result.affected || 0;
  }

  /**
   * Obtener estadísticas de seguridad
   */
  async getSecurityStats(since: Date): Promise<{
    totalAttempts: number;
    successfulAttempts: number;
    failedAttempts: number;
    uniqueIPs: number;
  }> {
    const attempts = await this.attemptRepository.find({
      where: { attempted_at: MoreThan(since) },
    });

    const uniqueIPs = new Set(
      attempts.map((a) => a.ip_address).filter((ip) => ip !== null),
    ).size;

    return {
      totalAttempts: attempts.length,
      successfulAttempts: attempts.filter((a) => a.success).length,
      failedAttempts: attempts.filter((a) => !a.success).length,
      uniqueIPs,
    };
  }
}
