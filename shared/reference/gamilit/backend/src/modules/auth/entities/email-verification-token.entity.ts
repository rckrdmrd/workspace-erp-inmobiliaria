import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';
import { User } from './user.entity';

/**
 * EmailVerificationToken Entity
 *
 * @description Tokens de verificación de correo electrónico.
 *
 * Flujo de uso:
 * 1. Al registrarse o cambiar email, se genera token aleatorio
 * 2. Token se hashea (SHA256) antes de almacenar
 * 3. Se envía token plaintext por email
 * 4. Usuario hace clic en enlace con token
 * 5. Se hashea token recibido y se busca en DB
 * 6. Se marca used_at y se verifica email
 *
 * @see DDL: auth_management.email_verification_tokens
 * @security Token debe hashearse antes de almacenar (NO plaintext)
 * @constraint Token único, expira en 24h (configurable)
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.EMAIL_VERIFICATION_TOKENS })
@Index(['user_id'])
@Index(['token'])
@Index(['expires_at'])
export class EmailVerificationToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'text', unique: true })
  @Exclude() // CRITICAL: NO exponer token hasheado en respuestas
  token!: string;

  @Column({ type: 'text' })
  email!: string;

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
