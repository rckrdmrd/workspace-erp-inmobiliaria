import {
  IsString,
  IsOptional,
  IsUUID,
  IsInt,
  IsBoolean,
  MinLength,
  Matches,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateContentCategoryDto
 *
 * @description DTO para actualizar una categoría existente.
 * Permite actualizar todos los campos excepto el ID.
 *
 * @see ContentCategory entity
 */
export class UpdateContentCategoryDto {
  /**
   * Nombre de la categoría
   */
  @ApiPropertyOptional({
    description: 'Nombre de la categoría',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  /**
   * Slug único para URLs
   */
  @ApiPropertyOptional({
    description: 'Slug único para URLs (solo letras, números y guiones)',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and hyphens',
  })
  slug?: string;

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
   * ID de la categoría padre
   */
  @ApiPropertyOptional({
    description: 'ID de la categoría padre (null para convertir en raíz)',
    format: 'uuid',
    nullable: true,
  })
  @IsOptional()
  @IsUUID('4')
  parent_category_id?: string;

  /**
   * Orden de visualización
   */
  @ApiPropertyOptional({
    description: 'Orden de visualización',
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  display_order?: number;

  /**
   * Estado activo/inactivo
   */
  @ApiPropertyOptional({
    description: 'Estado activo/inactivo de la categoría',
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  /**
   * Ícono de la categoría
   */
  @ApiPropertyOptional({
    description: 'Ícono de la categoría',
  })
  @IsOptional()
  @IsString()
  icon?: string;

  /**
   * Color de la categoría (hex)
   */
  @ApiPropertyOptional({
    description: 'Color de la categoría (formato hexadecimal)',
    pattern: '^#[0-9A-Fa-f]{6}$',
  })
  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'Color must be a valid hex color (e.g., #3B82F6)',
  })
  color?: string;
}
