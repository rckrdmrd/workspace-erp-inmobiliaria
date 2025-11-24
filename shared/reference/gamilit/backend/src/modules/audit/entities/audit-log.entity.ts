/**
 * AuditLog Entity
 *
 * Mapea a la tabla: audit_logging.audit_logs
 *
 * Registra todas las acciones críticas del sistema para compliance y seguridad
 */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum ActorType {
  USER = 'user',
  SYSTEM = 'system',
  API = 'api',
  CRON = 'cron',
}

export enum Severity {
  DEBUG = 'debug',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

export enum Status {
  SUCCESS = 'success',
  FAILURE = 'failure',
  PARTIAL = 'partial',
}

@Entity({ schema: 'audit_logging', name: 'audit_logs' })
@Index(['tenantId'])
@Index(['eventType'])
@Index(['resourceType'])
@Index(['actorId'])
@Index(['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', { name: 'tenant_id', nullable: true })
  tenantId!: string | null;

  @Column('text', { name: 'event_type' })
  eventType!: string;

  @Column('text')
  action!: string;

  @Column('text', { name: 'resource_type', nullable: true })
  resourceType!: string | null;

  @Column('text', { name: 'resource_id', nullable: true })
  resourceId!: string | null;

  @Column('text', { name: 'actor_id', nullable: true })
  actorId!: string | null;

  @Column({
    type: 'text',
    name: 'actor_type',
    default: ActorType.USER,
  })
  actorType!: ActorType;

  @Column('text', { name: 'actor_ip', nullable: true })
  actorIp!: string | null;

  @Column('text', { name: 'actor_user_agent', nullable: true })
  actorUserAgent!: string | null;

  @Column('text', { name: 'target_id', nullable: true })
  targetId!: string | null;

  @Column('text', { name: 'target_type', nullable: true })
  targetType!: string | null;

  @Column('text', { name: 'session_id', nullable: true })
  sessionId!: string | null;

  @Column('text', { nullable: true })
  description!: string | null;

  @Column('jsonb', { name: 'old_values', nullable: true })
  oldValues!: any;

  @Column('jsonb', { name: 'new_values', nullable: true })
  newValues!: any;

  @Column('jsonb', { nullable: true })
  changes!: any;

  @Column({
    type: 'text',
    default: Severity.INFO,
  })
  severity!: Severity;

  @Column({
    type: 'text',
    default: Status.SUCCESS,
  })
  status!: Status;

  @Column('text', { name: 'error_code', nullable: true })
  errorCode!: string | null;

  @Column('text', { name: 'error_message', nullable: true })
  errorMessage!: string | null;

  @Column('text', { name: 'stack_trace', nullable: true })
  stackTrace!: string | null;

  @Column('text', { name: 'request_id', nullable: true })
  requestId!: string | null;

  @Column('text', { name: 'correlation_id', nullable: true })
  correlationId!: string | null;

  @Column('jsonb', { name: 'additional_data', nullable: true })
  additionalData!: any;

  @Column('text', { array: true, nullable: true })
  tags!: string[] | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt!: Date;
}
