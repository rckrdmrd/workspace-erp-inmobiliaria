import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Check,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@/shared/constants/database.constants';
import { ComodinTypeEnum } from '@/shared/constants/enums.constants';

/**
 * Comodines Inventory Entity
 *
 * @description Inventario de comodines (power-ups) por usuario
 * @table gamification_system.comodines_inventory
 * @fields 16 campos según DDL
 *
 * Características:
 * - Inventario único por usuario (UNIQUE constraint)
 * - Tracking de disponibles, comprados y usados por tipo
 * - Costos dinámicos por tipo de comodín
 * - Metadata extensible
 *
 * Tipos de comodines:
 * - Pistas Contextuales (15 ML Coins)
 * - Visión Lectora (25 ML Coins)
 * - Segunda Oportunidad (40 ML Coins)
 *
 * Validaciones críticas:
 * - Todas las cantidades >= 0
 * - Stock validation antes de uso
 * - Balance validation antes de compra
 *
 * @see DDL: /apps/database/ddl/schemas/gamification_system/tables/07-comodines_inventory.sql
 */
@Entity({ schema: DB_SCHEMAS.GAMIFICATION, name: DB_TABLES.GAMIFICATION.COMODINES_INVENTORY })
@Index('comodines_inventory_user_id_key', ['user_id'], { unique: true })
@Check(`"pistas_available" >= 0`)
@Check(`"vision_lectora_available" >= 0`)
@Check(`"segunda_oportunidad_available" >= 0`)
@Check(`"pistas_purchased_total" >= 0`)
@Check(`"vision_lectora_purchased_total" >= 0`)
@Check(`"segunda_oportunidad_purchased_total" >= 0`)
@Check(`"pistas_used_total" >= 0`)
@Check(`"vision_lectora_used_total" >= 0`)
@Check(`"segunda_oportunidad_used_total" >= 0`)
export class ComodinesInventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  user_id!: string;

  // Pistas Contextuales (15 ML Coins)
  @Column({ type: 'integer', default: 0 })
  pistas_available!: number;

  @Column({ type: 'integer', default: 0 })
  pistas_purchased_total!: number;

  @Column({ type: 'integer', default: 0 })
  pistas_used_total!: number;

  @Column({ type: 'integer', default: 15 })
  pistas_cost!: number;

  // Visión Lectora (25 ML Coins)
  @Column({ type: 'integer', default: 0 })
  vision_lectora_available!: number;

  @Column({ type: 'integer', default: 0 })
  vision_lectora_purchased_total!: number;

  @Column({ type: 'integer', default: 0 })
  vision_lectora_used_total!: number;

  @Column({ type: 'integer', default: 25 })
  vision_lectora_cost!: number;

  // Segunda Oportunidad (40 ML Coins)
  @Column({ type: 'integer', default: 0 })
  segunda_oportunidad_available!: number;

  @Column({ type: 'integer', default: 0 })
  segunda_oportunidad_purchased_total!: number;

  @Column({ type: 'integer', default: 0 })
  segunda_oportunidad_used_total!: number;

  @Column({ type: 'integer', default: 40 })
  segunda_oportunidad_cost!: number;

  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // Relación a auth_management.profiles (FK)
  // @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'user_id' })
  // user?: Profile;

  /**
   * Get available quantity for a specific comodin type
   */
  getAvailable(type: ComodinTypeEnum): number {
    switch (type) {
      case ComodinTypeEnum.PISTAS:
        return this.pistas_available;
      case ComodinTypeEnum.VISION_LECTORA:
        return this.vision_lectora_available;
      case ComodinTypeEnum.SEGUNDA_OPORTUNIDAD:
        return this.segunda_oportunidad_available;
      default:
        return 0;
    }
  }

  /**
   * Get cost for a specific comodin type
   */
  getCost(type: ComodinTypeEnum): number {
    switch (type) {
      case ComodinTypeEnum.PISTAS:
        return this.pistas_cost;
      case ComodinTypeEnum.VISION_LECTORA:
        return this.vision_lectora_cost;
      case ComodinTypeEnum.SEGUNDA_OPORTUNIDAD:
        return this.segunda_oportunidad_cost;
      default:
        return 0;
    }
  }

  /**
   * Check if user has enough stock of a comodin
   */
  hasStock(type: ComodinTypeEnum, quantity: number = 1): boolean {
    return this.getAvailable(type) >= quantity;
  }
}
