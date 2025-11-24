import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES, SecurityEventSeverityEnum } from '@shared/constants';
import { User } from './user.entity';

/**
 * SecurityEvent Entity (auth_management.security_events)
 *
 * @description Log de auditoría para eventos relacionados con seguridad.
 * @schema auth_management
 * @table security_events
 *
 * IMPORTANTE:
 * - Auditoría de eventos de seguridad (logins, password changes, etc.)
 * - user_id es opcional (puede ser NULL para eventos sin usuario)
 * - Metadata en JSONB para flexibilidad
 * - Severidad: low, medium, high, critical
 *
 * @see DDL: apps/database/ddl/schemas/auth_management/tables/08-security_events.sql
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.SECURITY_EVENTS })
@Index('idx_security_events_created', ['created_at'])
@Index('idx_security_events_severity', ['severity'])
@Index('idx_security_events_type', ['event_type'])
@Index('idx_security_events_user', ['user_id'])
export class SecurityEvent {
  /**
   * Identificador único del evento (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario asociado al evento
   * NOTA: Puede ser NULL para eventos sin usuario (ej: login fallido)
   */
  @Column({ type: 'uuid', nullable: true })
  user_id?: string;

  /**
   * Tipo de evento de seguridad
   * @example 'login_attempt', 'password_change', 'failed_login', 'account_locked'
   */
  @Column({ type: 'varchar', length: 100 })
  event_type!: string;

  /**
   * Nivel de severidad del evento
   * Valores: low, medium, high, critical
   */
  @Column({
    type: 'enum',
    enum: SecurityEventSeverityEnum,
  })
  severity!: SecurityEventSeverityEnum;

  /**
   * Descripción detallada del evento
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Dirección IP desde donde se originó el evento
   */
  @Column({ type: 'inet', nullable: true })
  ip_address?: string;

  /**
   * User agent del navegador/cliente
   */
  @Column({ type: 'text', nullable: true })
  user_agent?: string;

  /**
   * Datos adicionales del evento en formato JSON
   * @example { "failed_attempts": 3, "reason": "invalid_password" }
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  /**
   * Fecha y hora de creación del evento
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Usuario asociado al evento (opcional)
   * Relación ManyToOne: Muchos eventos pueden pertenecer a un usuario
   * FK: security_events.user_id → auth.users.id
   *
   * NOTA: La relación cruza schemas (auth_management → auth)
   * NOTA: ON DELETE SET NULL - Si se elimina el usuario, el evento se mantiene
   */
  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user?: User;
}
