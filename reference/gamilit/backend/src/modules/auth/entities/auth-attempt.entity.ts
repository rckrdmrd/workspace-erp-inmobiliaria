import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';
import { User } from './user.entity';

/**
 * AuthAttempt Entity
 *
 * @description Registro de intentos de autenticación (exitosos y fallidos).
 * Utilizado para:
 * - Auditoría de seguridad
 * - Detección de fuerza bruta
 * - Rate limiting por IP/usuario
 * - Análisis de patrones sospechosos
 *
 * @see DDL: auth_management.auth_attempts
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.AUTH_ATTEMPTS })
@Index(['email'])
@Index(['ip_address'])
@Index(['attempted_at'])
export class AuthAttempt {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'text' })
  email!: string;

  @Column({ type: 'inet' })
  ip_address!: string;

  @Column({ type: 'text', nullable: true })
  user_agent!: string | null;

  @Column({ type: 'boolean' })
  success!: boolean;

  @Column({ type: 'text', nullable: true })
  failure_reason!: string | null;

  @Column({ type: 'text', nullable: true })
  tenant_slug!: string | null;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  attempted_at!: Date;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  // NOTA: La tabla auth_attempts NO tiene user_id
  // Es una tabla de auditoría independiente que solo registra el email
}
