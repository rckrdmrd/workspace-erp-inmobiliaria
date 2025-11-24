import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as crypto from 'crypto';
import { UserSession } from '../entities';
import { CreateUserSessionDto, UpdateUserSessionDto, UserSessionResponseDto } from '../dto';
import { DB_SCHEMAS, DeviceTypeEnum } from '@/shared/constants';

/**
 * SessionManagementService
 *
 * @description Gestión de sesiones de usuario.
 *
 * @constraints
 * - Máximo 5 sesiones concurrentes por usuario
 * - Al crear la 6ta, se elimina la más antigua
 * - Sesiones expiradas se limpian periódicamente
 *
 * @security
 * - Refresh tokens hasheados con SHA256
 * - Validación de ownership en revoke
 * - Actualización de last_activity_at en cada validación
 */
@Injectable()
export class SessionManagementService {
  private readonly MAX_SESSIONS_PER_USER = 5;

  constructor(
    @InjectRepository(UserSession, 'auth')
    private readonly sessionRepository: Repository<UserSession>,
  ) {}

  /**
   * Crear nueva sesión
   */
  async createSession(dto: CreateUserSessionDto): Promise<UserSession> {
    // 1. Limpiar sesiones expiradas del usuario
    await this.deleteExpiredSessions(dto.user_id);

    // 2. Contar sesiones activas
    const activeSessions = await this.countActiveSessions(dto.user_id);

    // 3. Si tiene 5+ sesiones, eliminar la más antigua
    if (activeSessions >= this.MAX_SESSIONS_PER_USER) {
      await this.deleteOldestSession(dto.user_id);
    }

    // 4. Hashear refresh token
    const hashedRefreshToken = dto.refresh_token ? this.hashToken(dto.refresh_token) : '';

    // 5. Crear sesión
    const session = this.sessionRepository.create({
      ...dto,
      refresh_token: hashedRefreshToken,
      expires_at: new Date(dto.expires_at),
    });

    return await this.sessionRepository.save(session);
  }

  /**
   * Validar sesión y actualizar actividad
   */
  async validateSession(sessionId: string): Promise<UserSession | null> {
    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      return null;
    }

    // Validar expiración
    if (new Date() > session.expires_at) {
      await this.sessionRepository.delete({ id: sessionId });
      return null;
    }

    // Actualizar última actividad
    session.last_activity_at = new Date();
    await this.sessionRepository.save(session);

    return session;
  }

  /**
   * Renovar sesión (refresh token)
   */
  async refreshSession(sessionId: string, newExpiresAt: Date): Promise<UserSession> {
    const session = await this.validateSession(sessionId);

    if (!session) {
      throw new NotFoundException('Sesión no encontrada o expirada');
    }

    session.expires_at = newExpiresAt;
    session.last_activity_at = new Date();

    return await this.sessionRepository.save(session);
  }

  /**
   * Revocar sesión específica
   */
  async revokeSession(sessionId: string, userId: string): Promise<void> {
    const result = await this.sessionRepository.delete({
      id: sessionId,
      user_id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Sesión no encontrada');
    }
  }

  /**
   * Revocar todas las sesiones del usuario
   */
  async revokeAllSessions(userId: string): Promise<void> {
    await this.sessionRepository.delete({ user_id: userId });
  }

  /**
   * Limpiar sesiones expiradas (cron job)
   */
  async cleanExpiredSessions(): Promise<number> {
    const result = await this.sessionRepository.delete({
      expires_at: LessThan(new Date()),
    });

    return result.affected || 0;
  }

  /**
   * Listar sesiones activas del usuario
   */
  async getUserActiveSessions(userId: string): Promise<UserSession[]> {
    return await this.sessionRepository.find({
      where: { user_id: userId },
      order: { last_activity_at: 'DESC' },
    });
  }

  /**
   * Helper: Contar sesiones activas
   */
  private async countActiveSessions(userId: string): Promise<number> {
    return await this.sessionRepository.count({
      where: { user_id: userId },
    });
  }

  /**
   * Helper: Eliminar sesión más antigua
   */
  private async deleteOldestSession(userId: string): Promise<void> {
    const oldestSession = await this.sessionRepository.findOne({
      where: { user_id: userId },
      order: { created_at: 'ASC' },
    });

    if (oldestSession) {
      await this.sessionRepository.delete({ id: oldestSession.id });
    }
  }

  /**
   * Helper: Eliminar sesiones expiradas de un usuario
   */
  private async deleteExpiredSessions(userId: string): Promise<void> {
    await this.sessionRepository.delete({
      user_id: userId,
      expires_at: LessThan(new Date()),
    });
  }

  /**
   * Helper: Hashear token con SHA256
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
