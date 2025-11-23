import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';
import { TransactionTypeEnum } from '@/shared/constants/enums.constants';

/**
 * ML Coins Transaction Entity
 *
 * @description Registro de transacciones de ML Coins (earning y spending)
 * @table gamification_system.ml_coins_transactions
 * @fields 12 campos según DDL
 *
 * Características:
 * - Historial completo de earnings y gastos
 * - Balance tracking (before/after)
 * - Multiplicadores y bonos
 * - Referencias a entidades relacionadas
 * - Metadata extensible
 *
 * Validaciones críticas:
 * - amount puede ser negativo para gastos
 * - balance_before y balance_after >= 0
 * - reference_type debe estar en lista permitida
 *
 * @see DDL: /apps/database/ddl/schemas/gamification_system/tables/05-ml_coins_transactions.sql
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.ML_COINS_TRANSACTIONS })
@Index('idx_ml_transactions_user_id', ['user_id'])
@Index('idx_ml_transactions_type', ['transaction_type'])
@Index('idx_ml_transactions_created_at', ['created_at'])
@Index('idx_ml_transactions_user_recent', ['user_id', 'created_at'])
@Index('idx_ml_transactions_user_type_date', ['user_id', 'transaction_type', 'created_at'])
@Index('idx_ml_transactions_reference', ['reference_id', 'reference_type'])
@Check(`"balance_before" >= 0`)
@Check(`"balance_after" >= 0`)
@Check(`"reference_type" IN ('exercise', 'module', 'achievement', 'powerup', 'admin', 'streak', 'rank')`)
export class MLCoinsTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  @Column({ type: 'integer' })
  amount!: number;

  @Column({ type: 'integer' })
  balance_before!: number;

  @Column({ type: 'integer' })
  balance_after!: number;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  transaction_type!: TransactionTypeEnum;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'text', nullable: true })
  reason!: string | null;

  @Column({ type: 'uuid', nullable: true })
  reference_id!: string | null;

  @Column({ type: 'text', nullable: true })
  reference_type!: 'exercise' | 'module' | 'achievement' | 'powerup' | 'admin' | 'streak' | 'rank' | null;

  @Column({ type: 'numeric', precision: 3, scale: 2, default: 1.00 })
  multiplier!: number;

  @Column({ type: 'boolean', default: false })
  bonus_applied!: boolean;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  // Relación a auth_management.profiles (FK)
  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user?: Profile;
}
