import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants';

/**
 * InventoryTransaction Entity
 *
 * @description Audit log de cambios en inventario de usuarios.
 * Características:
 * - Tipos: PURCHASE, USE, GIFT_SENT, GIFT_RECEIVED, EXPIRED, ADMIN_GRANT
 * - Cantidad positiva (añadir) o negativa (restar)
 * - Metadata JSONB para información adicional (precio, destinatario, etc.)
 * - Sistema de auditoría completo
 * - Soporte para tracking de items
 *
 * @see DDL: gamification_system.inventory_transactions
 * @constraint quantity != 0
 */
@Entity({
  schema: DB_SCHEMAS.GAMIFICATION,
  name: DB_TABLES.GAMIFICATION.INVENTORY_TRANSACTIONS,
})
@Index(['user_id'])
@Index(['item_id'])
@Index(['user_id', 'item_id'])
@Index(['transaction_type'])
@Index(['created_at'])
@Index('idx_inventory_transactions_metadata', ['metadata'])
export class InventoryTransaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  user_id!: string;

  /**
   * ID del item involucrado en la transacción
   * (puede ser comodín, boost, avatar, etc.)
   */
  @Column({ type: 'uuid' })
  item_id!: string;

  /**
   * Tipo de transacción
   * PURCHASE: Compra con ML Coins
   * USE: Uso de un item (consumible)
   * GIFT_SENT: Envío de regalo a otro usuario
   * GIFT_RECEIVED: Recepción de regalo
   * EXPIRED: Item expiró (temporal)
   * ADMIN_GRANT: Otorgado por administrador
   */
  @Column({ type: 'varchar', length: 50 })
  transaction_type!: 'PURCHASE' | 'USE' | 'GIFT_SENT' | 'GIFT_RECEIVED' | 'EXPIRED' | 'ADMIN_GRANT';

  /**
   * Cantidad de items en la transacción
   * - Positivo: añadir al inventario
   * - Negativo: restar del inventario
   * - NO puede ser 0
   */
  @Column({ type: 'integer' })
  quantity!: number;

  /**
   * Metadata adicional en formato JSONB
   * Ejemplos:
   * - { "price": 100, "currency": "ml_coins" } para PURCHASE
   * - { "recipient_id": "uuid-...", "recipient_name": "Juan" } para GIFT_SENT
   * - { "admin_id": "uuid-...", "reason": "Compensación por bug" } para ADMIN_GRANT
   * - { "exercise_id": "uuid-...", "success": true } para USE
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata!: Record<string, any> | null;

  @Column({ type: 'timestamptz', default: () => 'NOW()' })
  created_at!: Date;

  // Relación con Profile (se puede agregar después cuando se cree Profile entity)
  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user: Profile;
}
