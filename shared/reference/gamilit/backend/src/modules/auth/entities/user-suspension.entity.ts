import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DB_TABLES } from '@/shared/constants/database.constants';
import { User } from './user.entity';

/**
 * UserSuspension Entity
 *
 * @description Suspensiones y bans de cuentas de usuario
 * @schema auth_management
 * @table user_suspensions
 * @see DDL: apps/database/ddl/schemas/auth_management/tables/12-user_suspensions.sql
 *
 * @note Relación 1:1 con User (cada usuario puede tener máximo una suspensión activa)
 * @note suspension_until NULL = ban permanente
 * @note suspension_until con fecha = suspensión temporal hasta esa fecha
 *
 * @created 2025-11-11 (DB-100 Ciclo B.2)
 * @version 1.0
 */
@Entity({ name: DB_TABLES.AUTH.USER_SUSPENSIONS, schema: 'auth_management' })
export class UserSuspension {
  /**
   * ID único de la suspensión
   * @primary
   * @type UUID
   * @generated
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario suspendido
   * @type UUID
   * @relation User (usuario suspendido)
   * @unique Cada usuario solo puede tener una suspensión activa
   * @indexed
   */
  @Column('uuid', { name: 'user_id' })
  @Index('idx_user_suspensions_user_id')
  user_id!: string;

  /**
   * Razón de la suspensión
   * @type text
   * @required
   * @example "Violación de términos de servicio: spam en foros"
   * @example "Conducta inapropiada reportada por múltiples usuarios"
   * @example "Intento de fraude en sistema de puntos"
   */
  @Column('text')
  reason!: string;

  /**
   * Fecha hasta la cual el usuario está suspendido
   * @type timestamptz
   * @nullable
   * @indexed Parcial (solo valores NOT NULL)
   *
   * @note NULL = ban permanente (sin fecha de fin)
   * @note Fecha futura = suspensión temporal hasta esa fecha
   * @note Fecha pasada = suspensión expirada (debería ser removida)
   *
   * @example null (ban permanente)
   * @example "2025-12-31T23:59:59.999Z" (suspendido hasta fin de año)
   */
  @Column('timestamptz', { nullable: true, name: 'suspension_until' })
  @Index('idx_user_suspensions_until', { where: 'suspension_until IS NOT NULL' })
  suspension_until!: Date | null;

  /**
   * ID del administrador que aplicó la suspensión
   * @type UUID
   * @relation User (administrador)
   * @required
   * @indexed
   */
  @Column('uuid', { name: 'suspended_by' })
  @Index('idx_user_suspensions_suspended_by')
  suspended_by!: string;

  /**
   * Fecha y hora en que se aplicó la suspensión
   * @type timestamptz
   * @generated
   * @default CURRENT_TIMESTAMP
   */
  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP', name: 'suspended_at' })
  suspended_at!: Date;

  /**
   * Fecha de creación del registro
   * @generated
   */
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at!: Date;

  /**
   * Fecha de última actualización
   * @generated
   */
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // =============================================================================
  // RELACIONES
  // =============================================================================

  /**
   * Usuario suspendido
   * @description Relación con el usuario que recibió la suspensión
   * @cascade DELETE (si se elimina el usuario, se elimina la suspensión)
   */
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  /**
   * Administrador que aplicó la suspensión
   * @description Relación con el usuario administrador que suspendió la cuenta
   * @note No tiene CASCADE para preservar el registro histórico
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'suspended_by' })
  suspended_by_user!: User;

  // =============================================================================
  // MÉTODOS AUXILIARES
  // =============================================================================

  /**
   * Verifica si la suspensión es permanente (ban)
   * @returns true si suspension_until es NULL (ban permanente)
   */
  isPermanent(): boolean {
    return this.suspension_until === null;
  }

  /**
   * Verifica si la suspensión está activa
   * @returns true si es permanente O si la fecha de fin es futura
   */
  isActive(): boolean {
    if (this.isPermanent()) {
      return true;
    }
    return this.suspension_until! > new Date();
  }

  /**
   * Verifica si la suspensión ha expirado
   * @returns true si tiene fecha de fin y ya pasó
   */
  isExpired(): boolean {
    if (this.isPermanent()) {
      return false;
    }
    return this.suspension_until! <= new Date();
  }

  /**
   * Obtiene días restantes de suspensión
   * @returns número de días restantes, null si es permanente, 0 si expiró
   */
  getDaysRemaining(): number | null {
    if (this.isPermanent()) {
      return null;
    }

    if (this.isExpired()) {
      return 0;
    }

    const now = new Date();
    const diff = this.suspension_until!.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
