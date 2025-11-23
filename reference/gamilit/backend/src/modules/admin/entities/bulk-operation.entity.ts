import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants';
import { User } from '../../auth/entities/user.entity';

/**
 * BulkOperation Entity (admin_dashboard.bulk_operations)
 *
 * @description Registro de operaciones bulk (masivas) realizadas por administradores
 *              sobre múltiples usuarios o recursos
 * @schema admin_dashboard
 * @table bulk_operations
 *
 * IMPORTANTE:
 * - Almacena el progreso de operaciones masivas (suspensiones, activaciones, etc.)
 * - Integrado con BullMQ para procesamiento asíncrono
 * - Tracking de completitud: target_count, completed_count, failed_count
 * - Estados: pending → running → completed/failed/cancelled
 *
 * @see DDL: apps/database/ddl/schemas/admin_dashboard/tables/07-bulk_operations.sql
 * @related EXT-002 (Admin Extendido - Bulk Operations)
 */
@Entity({ schema: DB_SCHEMAS.ADMIN_DASHBOARD, name: DB_TABLES.ADMIN.BULK_OPERATIONS })
@Index('idx_bulk_ops_status', ['status'])
@Index('idx_bulk_ops_started_by', ['started_by'])
@Index('idx_bulk_ops_type', ['operation_type'])
@Index('idx_bulk_ops_started_at', ['started_at'])
@Check(`"status" IN ('pending', 'running', 'completed', 'failed', 'cancelled')`)
@Check(`"completed_count" >= 0 AND "failed_count" >= 0`)
@Check(`"target_count" > 0`)
export class BulkOperation {
  /**
   * Identificador único de la operación bulk (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Tipo de operación bulk ejecutada
   * Valores: 'suspend_users', 'activate_users', 'update_role', 'delete_users'
   * @example 'suspend_users'
   */
  @Column({ type: 'varchar', length: 50 })
  operation_type!: string;

  /**
   * Entidad objetivo de la operación
   * Valores: 'users', 'content', 'classrooms'
   * @example 'users'
   */
  @Column({ type: 'varchar', length: 50 })
  target_entity!: string;

  /**
   * Array de UUIDs de recursos a procesar
   */
  @Column({ type: 'uuid', array: true })
  target_ids!: string[];

  /**
   * Cantidad total de recursos a procesar
   */
  @Column({ type: 'integer' })
  target_count!: number;

  /**
   * Cantidad de recursos procesados exitosamente
   */
  @Column({ type: 'integer', default: 0 })
  completed_count!: number;

  /**
   * Cantidad de recursos que fallaron durante el procesamiento
   */
  @Column({ type: 'integer', default: 0 })
  failed_count!: number;

  /**
   * Estado actual de la operación
   * Estados: 'pending', 'running', 'completed', 'failed', 'cancelled'
   */
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status!: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  /**
   * Detalles de errores individuales durante el procesamiento
   * Formato: [{ userId: 'abc', error: 'User not found' }, ...]
   */
  @Column({ type: 'jsonb', default: [] })
  error_details!: any[];

  /**
   * UUID del administrador que inició la operación
   */
  @Column({ type: 'uuid' })
  started_by!: string;

  /**
   * Relación con el usuario que inició la operación
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'started_by' })
  admin!: User;

  /**
   * Timestamp de inicio de la operación (Mexico timezone)
   */
  @CreateDateColumn({ type: 'timestamp' })
  started_at!: Date;

  /**
   * Timestamp de completitud de la operación
   */
  @Column({ type: 'timestamp', nullable: true })
  completed_at?: Date;

  /**
   * Resultado consolidado de la operación (opcional)
   * Puede contener un resumen, estadísticas adicionales, etc.
   */
  @Column({ type: 'jsonb', nullable: true })
  result?: any;
}
