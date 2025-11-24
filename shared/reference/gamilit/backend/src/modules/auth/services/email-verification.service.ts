import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import * as crypto from 'crypto';
import { User, EmailVerificationToken } from '../entities';
import {
  VerifyEmailDto,
  CreateEmailVerificationTokenDto,
} from '../dto';
import { DB_SCHEMAS } from '@/shared/constants';

/**
 * EmailVerificationService
 *
 * @description Servicio de verificación de email.
 *
 * @flow
 * 1. Usuario se registra (sendVerification automático)
 * 2. Sistema genera token y envía email
 * 3. Usuario recibe email con link + token
 * 4. Usuario hace clic en link (verifyEmail)
 * 5. Sistema valida token y marca email como verificado
 * 6. Token se marca como usado
 *
 * @use_cases
 * - Verificación al registrarse
 * - Re-verificación al cambiar email
 * - Reenvío de email de verificación
 *
 * @security
 * - Token hasheado en DB (SHA256)
 * - Expiración 24h
 * - Invalidar tokens anteriores
 * - No permitir verificar si ya está verificado
 */
@Injectable()
export class EmailVerificationService {
  private readonly TOKEN_LENGTH_BYTES = 32;
  private readonly TOKEN_EXPIRATION_HOURS = 24;

  constructor(
    @InjectRepository(User, 'auth')
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmailVerificationToken, 'auth')
    private readonly tokenRepository: Repository<EmailVerificationToken>,

    // TODO: Inject MailerService
    // private readonly mailerService: MailerService,
  ) {}

  /**
   * Enviar email de verificación
   */
  async sendVerification(userId: string, email: string): Promise<{ message: string }> {
    // 1. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 2. Verificar si ya está verificado
    // Fix: Usar email_confirmed_at en lugar de email_verified
    if (user.email_confirmed_at) {
      throw new ConflictException('Email ya verificado');
    }

    // 3. Invalidar tokens anteriores
    await this.invalidatePreviousTokens(userId);

    // 4. Generar token aleatorio
    const plainToken = this.generateSecureToken();

    // 5. Hashear token
    const hashedToken = this.hashToken(plainToken);

    // 6. Calcular expiración (24h)
    const expiresAt = new Date(Date.now() + this.TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

    // 7. Crear registro en DB
    const verificationToken = this.tokenRepository.create({
      user_id: userId,
      token: hashedToken,
      email: email,
      expires_at: expiresAt,
    });
    await this.tokenRepository.save(verificationToken);

    // 8. Enviar email con token plaintext
    // TODO: Implementar envío de email
    // await this.mailerService.sendEmailVerification(email, plainToken);
    console.log(`[DEV] Email verification token for ${email}: ${plainToken}`);

    return { message: 'Email de verificación enviado' };
  }

  /**
   * Verificar email con token
   */
  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string; verified: boolean }> {
    // 1. Hashear token recibido
    const hashedToken = this.hashToken(dto.token);

    // 2. Buscar token en DB
    const verificationToken = await this.tokenRepository.findOne({
      where: { token: hashedToken },
    });

    if (!verificationToken) {
      throw new BadRequestException('Token inválido');
    }

    // 3. Validar con helpers
    if (verificationToken.isExpired()) {
      throw new BadRequestException('Token expirado');
    }

    if (verificationToken.isUsed()) {
      throw new BadRequestException('Token ya usado');
    }

    // 4. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id: verificationToken.user_id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 5. Actualizar email_confirmed_at (marca email como verificado)
    // Fix: Usar email_confirmed_at en lugar de email_verified
    user.email_confirmed_at = new Date();
    await this.userRepository.save(user);

    // 6. Marcar token como usado
    verificationToken.used_at = new Date();
    await this.tokenRepository.save(verificationToken);

    return {
      message: 'Email verificado exitosamente',
      verified: true,
    };
  }

  /**
   * Reenviar email de verificación
   */
  async resendVerification(userId: string): Promise<{ message: string }> {
    // 1. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // 2. Verificar si ya está verificado
    // Fix: Usar email_confirmed_at en lugar de email_verified
    if (user.email_confirmed_at) {
      throw new ConflictException('Email ya verificado');
    }

    // 3. Enviar nuevo email
    return await this.sendVerification(userId, user.email);
  }

  /**
   * Verificar estado de verificación
   */
  async checkVerificationStatus(userId: string): Promise<{ verified: boolean }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      // Fix: Usar email_confirmed_at en lugar de email_verified
      select: ['id', 'email_confirmed_at'],
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Fix: Email verificado si email_confirmed_at tiene valor
    return { verified: !!user.email_confirmed_at };
  }

  /**
   * Invalidar tokens anteriores del usuario
   */
  async invalidatePreviousTokens(userId: string): Promise<void> {
    await this.tokenRepository.update(
      { user_id: userId, used_at: IsNull() },
      { used_at: new Date() },
    );
  }

  /**
   * Limpiar tokens expirados (cron job)
   */
  async cleanExpiredTokens(daysToKeep: number = 30): Promise<number> {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000);

    const result = await this.tokenRepository
      .createQueryBuilder()
      .delete()
      .where('expires_at < :cutoffDate', { cutoffDate })
      .execute();

    return result.affected || 0;
  }

  /**
   * Helper: Generar token aleatorio seguro
   */
  private generateSecureToken(): string {
    return crypto.randomBytes(this.TOKEN_LENGTH_BYTES).toString('hex');
  }

  /**
   * Helper: Hashear token con SHA256
   */
  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
