import { IsString, IsOptional, IsArray, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * UpdateContentAuthorDto
 *
 * @description DTO para actualizar un perfil de autor existente.
 * Permite actualizar display_name, bio y expertise_areas.
 *
 * @see ContentAuthor entity
 */
export class UpdateContentAuthorDto {
  /**
   * Nombre público del autor
   */
  @ApiPropertyOptional({
    description: 'Nombre público del autor',
    minLength: 2,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  display_name?: string;

  /**
   * Biografía del autor
   */
  @ApiPropertyOptional({
    description: 'Biografía del autor',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  /**
   * Áreas de expertise del autor
   */
  @ApiPropertyOptional({
    description: 'Áreas de expertise',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise_areas?: string[];
}
