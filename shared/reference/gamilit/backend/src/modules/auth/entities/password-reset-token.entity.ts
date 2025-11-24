import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';
import { User } from './user.entity';

/**
 * PasswordResetToken Entity
 *
 * @description Tokens de recuperación de contraseña.
 *
 * Flujo de uso:
 * 1. Usuario solicita reset password
 * 2. Se genera token aleatorio (cryptographically secure)
 * 3. Token se hashea (SHA256) antes de almacenar
 * 4. Se envía token plaintext por email
 * 5. Usuario hace clic en enlace con token
 * 6. Se hashea token recibido y se busca en DB
 * 7. Se valida token y se permite cambiar password
 * 8. Se marca used_at y se invalidan otros tokens del usuario
 *
 * @see DDL: auth_management.password_reset_tokens
 * @security
 * - Token debe hashearse antes de almacenar (NO plaintext)
 * - Expira más rápido que email verification (1h vs 24h)
 * - Al usarse, invalidar todos los otros tokens del usuario
 * @constraint Token único, expira en 1h (configurable)
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.PASSWORD_RESET_TOKENS })
@Index(['user_id'])
@Index(['token'])
@Index(['expires_at'])
export class PasswordResetToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'text', unique: true })
  @Exclude() // CRITICAL: NO exponer token hasheado en respuestas
  token!: string;

  @Column({ type: 'timestamptz' })
  expires_at!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  used_at!: Date | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  // Relaciones
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // Helpers
  /**
   * Verifica si el token ha expirado
   */
  isExpired(): boolean {
    return new Date() > this.expires_at;
  }

  /**
   * Verifica si el token ya fue usado
   */
  isUsed(): boolean {
    return this.used_at !== null;
  }

  /**
   * Verifica si el token es válido (no expirado ni usado)
   */
  isValid(): boolean {
    return !this.isExpired() && !this.isUsed();
  }
}
