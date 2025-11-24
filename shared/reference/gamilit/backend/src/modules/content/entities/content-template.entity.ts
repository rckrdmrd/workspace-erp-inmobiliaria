import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { DB_SCHEMAS, DB_TABLES } from '@shared/constants/database.constants';
import { DifficultyLevelEnum } from '@shared/constants/enums.constants';

/**
 * ContentTemplate Entity (content_management.content_templates)
 *
 * @description Plantillas reutilizables para crear contenido educativo.
 *              Permite definir estructuras y valores predeterminados para ejercicios,
 *              módulos, evaluaciones, anuncios y retroalimentación.
 * @schema content_management
 * @table content_templates
 *
 * IMPORTANTE:
 * - Tabla de catálogo de plantillas reutilizables
 * - template_structure define la estructura JSON del contenido
 * - default_values contiene valores predeterminados
 * - usage_count rastrea popularidad de uso
 *
 * @see DDL: apps/database/ddl/schemas/content_management/tables/01-content_templates.sql
 */
@Entity({ schema: DB_SCHEMAS.CONTENT, name: DB_TABLES.CONTENT.CONTENT_TEMPLATES })
@Index('idx_templates_tenant', ['tenant_id'])
@Index('idx_templates_type', ['template_type'])
@Index('idx_templates_public', ['is_public'], { where: 'is_public = true' })
export class ContentTemplate {
  /**
   * Identificador único de la plantilla (UUID)
   */
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   */
  @Column({ type: 'uuid', nullable: true })
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  /**
   * Nombre de la plantilla
   */
  @Column({ type: 'text' })
  name!: string;

  /**
   * Descripción de la plantilla
   */
  @Column({ type: 'text', nullable: true })
  description?: string;

  /**
   * Tipo de plantilla
   * CHECK: exercise, module, assessment, announcement, feedback
   */
  @Column({ type: 'text', nullable: true })
  template_type?: string;

  // =====================================================
  // TEMPLATE STRUCTURE
  // =====================================================

  /**
   * Estructura JSON de la plantilla
   * Define cómo se estructura el contenido
   */
  @Column({ type: 'jsonb', default: {} })
  template_structure!: Record<string, any>;

  /**
   * Valores predeterminados JSON
   * Valores iniciales al crear contenido desde esta plantilla
   */
  @Column({ type: 'jsonb', nullable: true })
  default_values?: Record<string, any>;

  /**
   * Campos requeridos en el contenido
   */
  @Column({ type: 'text', array: true, nullable: true })
  required_fields?: string[];

  /**
   * Campos opcionales en el contenido
   */
  @Column({ type: 'text', array: true, nullable: true })
  optional_fields?: string[];

  // =====================================================
  // VISIBILITY & ACCESS
  // =====================================================

  /**
   * Si la plantilla es pública (disponible para todos)
   */
  @Column({ type: 'boolean', default: false })
  is_public!: boolean;

  /**
   * Si es plantilla del sistema (no editable por usuarios)
   */
  @Column({ type: 'boolean', default: false })
  is_system_template!: boolean;

  // =====================================================
  // DIFFICULTY & USAGE
  // =====================================================

  /**
   * Nivel de dificultad del contenido generado
   */
  @Column({
    type: 'enum',
    enum: DifficultyLevelEnum,
    nullable: true,
  })
  difficulty_level?: DifficultyLevelEnum;

  /**
   * Contador de usos de la plantilla
   */
  @Column({ type: 'integer', default: 0 })
  usage_count!: number;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  /**
   * ID del usuario que creó la plantilla (FK → auth_management.profiles)
   */
  @Column({ type: 'uuid', nullable: true })
  created_by?: string;

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
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at!: Date;
}
