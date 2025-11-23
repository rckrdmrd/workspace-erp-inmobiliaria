import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { AuthProviderEnum } from '@shared/constants/enums.constants';
import { User } from './user.entity';

/**
 * AuthProvider Entity
 *
 * @description Vinculación de usuarios con proveedores OAuth (Google, Facebook, Apple, etc.)
 * @table auth_management.auth_providers
 * @fields 10 campos (id, user_id, provider, provider_user_id, access_token, refresh_token, token_expires_at, created_at, updated_at)
 *
 * IMPORTANTE - SEGURIDAD:
 * - access_token y refresh_token tienen @Exclude() para NO serializar en respuestas
 * - NUNCA exponer estos campos en DTOs de respuesta
 * - Solo usar internamente en lógica de autenticación OAuth
 *
 * Relaciones:
 * - @ManyToOne a User (auth.users)
 *
 * @see DDL: /apps/database/ddl/schemas/auth_management/tables/06-auth_providers.sql (user auth providers)
 * @see CreateAuthProviderDto
 * @see AuthProviderResponseDto
 */
@Entity({ schema: DB_SCHEMAS.AUTH, name: DB_TABLES.AUTH.AUTH_PROVIDERS })
@Index('idx_auth_providers_user_id', ['user_id'])
@Index('idx_auth_providers_provider', ['provider'])
@Index('idx_auth_providers_user_provider', ['user_id', 'provider'], { unique: true })
@Index('idx_auth_providers_provider_user_id', ['provider', 'provider_user_id'])
export class AuthProvider {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del usuario vinculado
   * FK a auth.users.id
   */
  @Column({ type: 'uuid' })
  @Index()
  user_id!: string;

  /**
   * Proveedor de autenticación OAuth
   * Valores: local, google, facebook, apple, microsoft, github
   */
  @Column({
    type: 'enum',
    enum: AuthProviderEnum,
  })
  provider!: AuthProviderEnum;

  /**
   * ID del usuario en el proveedor OAuth externo
   * @example Google: "1234567890", Facebook: "fb_user_123"
   */
  @Column({ type: 'text' })
  provider_user_id!: string;

  /**
   * Access Token OAuth (SENSIBLE)
   * IMPORTANTE: @Exclude() evita que se serialice en respuestas
   */
  @Column({ type: 'text', nullable: true })
  @Exclude()
  access_token!: string | null;

  /**
   * Refresh Token OAuth (SENSIBLE)
   * IMPORTANTE: @Exclude() evita que se serialice en respuestas
   */
  @Column({ type: 'text', nullable: true })
  @Exclude()
  refresh_token!: string | null;

  /**
   * Fecha y hora de expiración del access_token
   */
  @Column({ type: 'timestamp with time zone', nullable: true })
  token_expires_at!: Date | null;

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;

  // =====================================================
  // Relaciones
  // =====================================================

  /**
   * Usuario vinculado (auth.users)
   * Relación ManyToOne: Muchos proveedores pueden pertenecer a un usuario
   * FK: auth_providers.user_id → users.id
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user?: User;
}
