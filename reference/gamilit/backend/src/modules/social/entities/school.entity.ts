import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';

/**
 * School Entity (social_features.schools)
 *
 * @description Instituciones educativas - escuelas y colegios
 * @schema social_features
 * @table schools
 *
 * IMPORTANTE:
 * - Representa instituciones educativas dentro de la plataforma
 * - Multi-tenant: cada escuela pertenece a un tenant específico
 * - code: Código único de identificación de la escuela
 * - Soporta configuración de niveles de grado, sistema semestral
 * - Tracking de capacidad de estudiantes y profesores
 *
 * @see DDL: apps/database/ddl/schemas/social_features/tables/02-schools.sql
 */
@Entity({ schema: DB_SCHEMAS.SOCIAL, name: DB_TABLES.SOCIAL.SCHOOLS })
@Index('idx_schools_tenant', ['tenant_id'])
@Index('idx_schools_code', ['code'])
@Index('idx_schools_active', ['is_active'], { where: 'is_active = true' })
export class School {
  /**
   * Identificador único del registro (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // =====================================================
  // MULTI-TENANT & OWNERSHIP
  // =====================================================

  /**
   * ID del tenant propietario (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid' })
  tenant_id!: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre completo de la institución
   */
  @Column({ type: 'text' })
  name!: string;

  /**
   * Código único de identificación (ej: "SEC-001", "CCT", etc.)
   * UNIQUE constraint aplicado
   */
  @Column({ type: 'text', unique: true, nullable: true })
  code?: string;

  /**
   * Nombre corto o abreviatura
   */
  @Column({ type: 'text', nullable: true })
  short_name?: string;

  /**
   * Descripción de la institución
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  // =====================================================
  // LOCATION & CONTACT
  // =====================================================

  /**
   * Dirección física de la escuela
   */
  @Column({ type: 'text', nullable: true })
  address?: string;

  /**
   * Ciudad
   */
  @Column({ type: 'text', nullable: true })
  city?: string;

  /**
   * Región o estado
   */
  @Column({ type: 'text', nullable: true })
  region?: string;

  /**
   * País (default: México)
   */
  @Column({ type: 'text', default: 'México' })
  country!: string;

  /**
   * Código postal
   */
  @Column({ type: 'text', nullable: true })
  postal_code?: string;

  /**
   * Teléfono de contacto
   */
  @Column({ type: 'text', nullable: true })
  phone?: string;

  /**
   * Email de contacto
   */
  @Column({ type: 'text', nullable: true })
  email?: string;

  /**
   * Sitio web de la institución
   */
  @Column({ type: 'text', nullable: true })
  website?: string;

  // =====================================================
  // ADMINISTRATIVE CONTACTS
  // =====================================================

  /**
   * ID del director/a (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  principal_id?: string;

  /**
   * ID del contacto administrativo (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  administrative_contact_id?: string;

  // =====================================================
  // ACADEMIC CONFIGURATION
  // =====================================================

  /**
   * Año académico actual (ej: "2024-2025")
   */
  @Column({ type: 'text', nullable: true })
  academic_year?: string;

  /**
   * Sistema semestral (true) o anual (false)
   */
  @Column({ type: 'boolean', default: true })
  semester_system!: boolean;

  /**
   * Niveles de grado que ofrece (array)
   * Default: ['6', '7', '8'] (secundaria)
   */
  @Column({ type: 'text', array: true, default: () => "ARRAY['6', '7', '8']" })
  grade_levels!: string[];

  /**
   * Configuraciones adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  settings!: Record<string, any>;

  // =====================================================
  // CAPACITY & STATS
  // =====================================================

  /**
   * Capacidad máxima de estudiantes
   */
  @Column({ type: 'integer', default: 1000 })
  max_students!: number;

  /**
   * Capacidad máxima de profesores
   */
  @Column({ type: 'integer', default: 100 })
  max_teachers!: number;

  /**
   * Contador actual de estudiantes
   */
  @Column({ type: 'integer', default: 0 })
  current_students_count!: number;

  /**
   * Contador actual de profesores
   */
  @Column({ type: 'integer', default: 0 })
  current_teachers_count!: number;

  // =====================================================
  // STATUS FLAGS
  // =====================================================

  /**
   * Escuela activa (puede aceptar nuevos estudiantes/profesores)
   */
  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  /**
   * Escuela verificada por administración
   */
  @Column({ type: 'boolean', default: false })
  is_verified!: boolean;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * Metadatos adicionales en formato JSON
   */
  @Column({ type: 'jsonb', default: {} })
  metadata!: Record<string, any>;

  /**
   * Fecha y hora de creación del registro
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at!: Date;

  /**
   * Fecha y hora de última actualización del registro
   * Trigger: trg_schools_updated_at
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
