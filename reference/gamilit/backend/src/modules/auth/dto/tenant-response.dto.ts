import { Expose } from 'class-transformer';
import { SubscriptionTierEnum } from '@/shared/constants/enums.constants';

/**
 * TenantResponseDto - DTO para respuestas de tenant
 *
 * @description DTO usado para respuestas HTTP al cliente.
 * Incluye todos los campos de la entidad (incluyendo id, created_at, updated_at).
 * No incluye campos sensibles (ninguno identificado en esta entidad).
 *
 * @see TenantEntity para la estructura de base de datos
 */
export class TenantResponseDto {
  /**
   * ID único del tenant (UUID)
   */
  @Expose()
  id!: string;

  /**
   * Nombre completo del tenant/organización
   */
  @Expose()
  name!: string;

  /**
   * Slug URL-friendly único para el tenant
   */
  @Expose()
  slug!: string;

  /**
   * Dominio personalizado del tenant (nullable)
   */
  @Expose()
  domain!: string | null;

  /**
   * URL del logo del tenant (nullable)
   */
  @Expose()
  logo_url!: string | null;

  /**
   * Nivel de suscripción del tenant
   */
  @Expose()
  subscription_tier!: SubscriptionTierEnum;

  /**
   * Número máximo de usuarios permitidos
   */
  @Expose()
  max_users!: number;

  /**
   * Almacenamiento máximo en GB
   */
  @Expose()
  max_storage_gb!: number;

  /**
   * Estado activo del tenant
   */
  @Expose()
  is_active!: boolean;

  /**
   * Fecha de fin del período de prueba (nullable)
   */
  @Expose()
  trial_ends_at!: Date | null;

  /**
   * Configuraciones del tenant (JSONB)
   */
  @Expose()
  settings!: Record<string, any>;

  /**
   * Metadata adicional del tenant (JSONB)
   */
  @Expose()
  metadata!: Record<string, any>;

  /**
   * Fecha de creación del tenant
   */
  @Expose()
  created_at!: Date;

  /**
   * Fecha de última actualización del tenant
   */
  @Expose()
  updated_at!: Date;
}
