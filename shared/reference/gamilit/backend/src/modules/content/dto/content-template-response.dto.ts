import { Expose } from 'class-transformer';
import { DifficultyLevelEnum } from '@shared/constants/enums.constants';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * ContentTemplateResponseDto
 *
 * @description DTO de respuesta con información completa de la plantilla de contenido.
 */
export class ContentTemplateResponseDto {
  @ApiProperty({ description: 'ID de la plantilla' })
  @Expose()
  id!: string;

  @ApiPropertyOptional({ description: 'ID del tenant' })
  @Expose()
  tenant_id?: string;

  // =====================================================
  // BASIC INFORMATION
  // =====================================================

  @ApiProperty({ description: 'Nombre de la plantilla' })
  @Expose()
  name!: string;

  @ApiPropertyOptional({ description: 'Descripción de la plantilla' })
  @Expose()
  description?: string;

  @ApiPropertyOptional({ description: 'Tipo de plantilla' })
  @Expose()
  template_type?: string;

  // =====================================================
  // TEMPLATE STRUCTURE
  // =====================================================

  @ApiProperty({ description: 'Estructura JSON de la plantilla' })
  @Expose()
  template_structure!: Record<string, any>;

  @ApiPropertyOptional({ description: 'Valores predeterminados' })
  @Expose()
  default_values?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Campos requeridos' })
  @Expose()
  required_fields?: string[];

  @ApiPropertyOptional({ description: 'Campos opcionales' })
  @Expose()
  optional_fields?: string[];

  // =====================================================
  // VISIBILITY & ACCESS
  // =====================================================

  @ApiProperty({ description: 'Plantilla pública' })
  @Expose()
  is_public!: boolean;

  @ApiProperty({ description: 'Plantilla del sistema' })
  @Expose()
  is_system_template!: boolean;

  // =====================================================
  // DIFFICULTY & USAGE
  // =====================================================

  @ApiPropertyOptional({ description: 'Nivel de dificultad' })
  @Expose()
  difficulty_level?: DifficultyLevelEnum;

  @ApiProperty({ description: 'Contador de usos' })
  @Expose()
  usage_count!: number;

  // =====================================================
  // METADATA & AUDIT
  // =====================================================

  @ApiProperty({ description: 'Metadatos adicionales' })
  @Expose()
  metadata!: Record<string, any>;

  @ApiPropertyOptional({ description: 'ID del usuario creador' })
  @Expose()
  created_by?: string;

  @ApiProperty({ description: 'Fecha de creación' })
  @Expose()
  created_at!: Date;

  @ApiProperty({ description: 'Fecha de última actualización' })
  @Expose()
  updated_at!: Date;
}
