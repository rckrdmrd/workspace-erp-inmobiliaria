import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  MinLength,
  Matches,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateContentCategoryDto
 *
 * @description DTO para crear una nueva categoría de contenido.
 * Valida nombre, slug único, y opcionalmente relación jerárquica y estilos.
 *
 * @see ContentCategory entity
 */
export class CreateContentCategoryDto {
  /**
   * Nombre de la categoría
   * @example 'Comprensión Lectora'
   */
  @ApiProperty({
    description: 'Nombre de la categoría',
    minLength: 2,
    example: 'Comprensión Lectora',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  /**
   * Slug único para URLs
   * @example 'comprension-lectora'
   */
  @ApiProperty({
    description: 'Slug único para URLs (solo letras, números y guiones)',
    example: 'comprension-lectora',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug!: string;

  /**
   * Descripción de la categoría
   */
  @ApiPropertyOptional({
    description: 'Descripción de la categoría',
  })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * ID de la categoría padre (para jerarquías)
   */
  @ApiPropertyOptional({
    description: 'ID de la categoría padre',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4')
  parent_category_id?: string;

  /**
   * Orden de visualización
   * @default 0
   */
  @ApiPropertyOptional({
    description: 'Orden de visualización (menor = aparece primero)',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  display_order?: number;

  /**
   * Ícono de la categoría
   * @example 'book'
   */
  @ApiPropertyOptional({
    description: 'Ícono de la categoría (nombre o emoji)',
    example: 'book',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  /**
   * Color de la categoría (hex)
   * @example '#3B82F6'
   */
  @ApiPropertyOptional({
    description: 'Color de la categoría (formato hexadecimal)',
    example: '#3B82F6',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color (e.g., #3B82F6)',
  })
  color?: string;
}
