import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
  Check,
} from 'typeorm';
import { DB_TABLES } from '@/shared/constants/database.constants';
import { User } from '@/modules/auth/entities/user.entity';
import { Classroom } from './classroom.entity';
import { Team } from './team.entity';

/**
 * DiscussionThread Entity
 *
 * @description Hilos de discusión en aulas o equipos
 * @schema social_features
 * @table discussion_threads
 * @see DDL: apps/database/ddl/schemas/social_features/tables/discussion_threads.sql
 *
 * @note Un thread pertenece a UN classroom O UN team (no ambos, al menos uno)
 * @note CHECK constraint: classroom_id IS NOT NULL OR team_id IS NOT NULL
 *
 * @created 2025-11-11 (DB-100 Ciclo B.3)
 * @version 1.0
 */
@Entity({ name: DB_TABLES.SOCIAL.DISCUSSION_THREADS, schema: 'social_features' })
@Check('classroom_id IS NOT NULL OR team_id IS NOT NULL')
export class DiscussionThread {
  /**
   * ID único del hilo de discusión
   * @primary
   * @type UUID
   * @generated
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del aula (classroom) al que pertenece el thread
   * @type UUID
   * @nullable
   * @relation Classroom
   * @indexed Parcial (WHERE classroom_id IS NOT NULL)
   *
   * @note Al menos classroom_id O team_id debe estar presente
   */
  @Column('uuid', { nullable: true, name: 'classroom_id' })
  @Index('idx_discussion_threads_classroom_id', { where: 'classroom_id IS NOT NULL' })
  classroom_id!: string | null;

  /**
   * ID del equipo (team) al que pertenece el thread
   * @type UUID
   * @nullable
   * @relation Team
   * @indexed Parcial (WHERE team_id IS NOT NULL)
   *
   * @note Al menos classroom_id O team_id debe estar presente
   */
  @Column('uuid', { nullable: true, name: 'team_id' })
  @Index('idx_discussion_threads_team_id', { where: 'team_id IS NOT NULL' })
  team_id!: string | null;

  /**
   * ID del usuario que creó el thread
   * @type UUID
   * @relation User (autor del thread)
   * @required
   * @indexed
   */
  @Column('uuid', { name: 'created_by' })
  @Index('idx_discussion_threads_created_by')
  created_by!: string;

  /**
   * Título del hilo de discusión
   * @type varchar(255)
   * @required
   * @example "¿Cómo resolver el ejercicio de Fracciones?"
   * @example "Estrategias para mejorar comprensión lectora"
   */
  @Column('varchar', { length: 255 })
  title!: string;

  /**
   * Contenido principal del thread (mensaje inicial)
   * @type text
   * @required
   * @example "Tengo dudas sobre el paso 3 del ejercicio..."
   */
  @Column('text')
  content!: string;

  /**
   * Indica si el thread está fijado al topo de la lista
   * @type boolean
   * @default false
   * @indexed Parcial (solo threads fijados)
   *
   * @note Threads fijados aparecen siempre primero en el listado
   */
  @Column('boolean', { default: false, name: 'is_pinned' })
  @Index('idx_discussion_threads_is_pinned', { where: 'is_pinned = true' })
  is_pinned!: boolean;

  /**
   * Indica si el thread está bloqueado (no permite nuevas respuestas)
   * @type boolean
   * @default false
   *
   * @note Un thread bloqueado no puede recibir más replies
   * @note Solo moderadores pueden bloquear/desbloquear threads
   */
  @Column('boolean', { default: false, name: 'is_locked' })
  is_locked!: boolean;

  /**
   * Número de respuestas en este thread
   * @type integer
   * @default 0
   *
   * @note Se actualiza automáticamente cuando se agregan/eliminan replies
   * @note Se usa para ordenamiento y filtrado
   */
  @Column('integer', { default: 0, name: 'replies_count' })
  replies_count!: number;

  /**
   * Fecha y hora de la última respuesta
   * @type timestamptz
   * @nullable
   * @indexed DESC NULLS LAST
   *
   * @note NULL si no hay replies aún
   * @note Se actualiza con cada nueva reply
   * @note Se usa para ordenar threads por actividad reciente
   */
  @Column('timestamptz', { nullable: true, name: 'last_reply_at' })
  @Index('idx_discussion_threads_last_reply') // DESC NULLS LAST en DDL
  last_reply_at!: Date | null;

  /**
   * Fecha de creación del thread
   * @generated
   * @indexed DESC para listados cronológicos
   */
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Index('idx_discussion_threads_created_at') // DESC en DDL
  created_at!: Date;

  /**
   * Fecha de última actualización
   * @generated
   * @trigger update_discussion_threads_updated_at (actualizado automáticamente)
   */
  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at!: Date;

  // =============================================================================
  // RELACIONES
  // =============================================================================

  /**
   * Classroom al que pertenece el thread
   * @description Relación opcional con aula
   * @cascade DELETE (si se elimina el classroom, se eliminan sus threads)
   */
  @ManyToOne(() => Classroom, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classroom_id' })
  classroom?: Classroom | null;

  /**
   * Team al que pertenece el thread
   * @description Relación opcional con equipo
   * @cascade DELETE (si se elimina el team, se eliminan sus threads)
   */
  @ManyToOne(() => Team, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'team_id' })
  team?: Team | null;

  /**
   * Usuario que creó el thread (autor)
   * @description Relación con el usuario creador
   * @cascade DELETE (si se elimina el usuario, se eliminan sus threads)
   *
   * @note CROSS-DATABASE RELATION DISABLED
   * @note DiscussionThread (social datasource) -> User (auth datasource)
   * @note TypeORM no soporta relaciones entre datasources diferentes
   * @note Usar created_by UUID para joins manuales en services
   */
  // @ManyToOne(() => User, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'created_by' })
  // author!: User;

  // =============================================================================
  // MÉTODOS AUXILIARES
  // =============================================================================

  /**
   * Verifica si el thread pertenece a un classroom
   * @returns true si tiene classroom_id
   */
  isClassroomThread(): boolean {
    return this.classroom_id !== null;
  }

  /**
   * Verifica si el thread pertenece a un team
   * @returns true si tiene team_id
   */
  isTeamThread(): boolean {
    return this.team_id !== null;
  }

  /**
   * Verifica si el thread puede recibir respuestas
   * @returns true si NO está bloqueado
   */
  canReceiveReplies(): boolean {
    return !this.is_locked;
  }

  /**
   * Verifica si el thread tiene actividad reciente
   * @param daysThreshold número de días para considerar como reciente (default 7)
   * @returns true si tuvo respuestas en los últimos N días
   */
  hasRecentActivity(daysThreshold: number = 7): boolean {
    if (!this.last_reply_at) {
      return false;
    }

    const now = new Date();
    const diffDays = (now.getTime() - this.last_reply_at.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= daysThreshold;
  }

  /**
   * Verifica si el thread es popular (muchas respuestas)
   * @param threshold número de respuestas para considerar popular (default 10)
   * @returns true si tiene más respuestas que el threshold
   */
  isPopular(threshold: number = 10): boolean {
    return this.replies_count >= threshold;
  }
}
