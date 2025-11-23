import { IsUUID, IsString, IsOptional, IsArray, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreateContentAuthorDto
 *
 * @description DTO para crear un nuevo perfil de autor de contenido.
 * Valida user_id, display_name y opcionalmente bio y áreas de expertise.
 *
 * @see ContentAuthor entity
 */
export class CreateContentAuthorDto {
  /**
   * ID del usuario asociado al perfil de autor
   */
  @ApiProperty({
    description: 'ID del usuario',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('4')
  user_id!: string;

  /**
   * Nombre público del autor
   * @example 'Dr. María González'
   */
  @ApiProperty({
    description: 'Nombre público del autor',
    minLength: 2,
    example: 'Dr. María González',
  })
  @IsString()
  @MinLength(2)
  display_name!: string;

  /**
   * Biografía del autor
   * @example 'Profesora de literatura con 15 años de experiencia...'
   */
  @ApiPropertyOptional({
    description: 'Biografía del autor',
    example: 'Profesora de literatura con 15 años de experiencia...',
  })
  @IsOptional()
  @IsString()
  bio?: string;

  /**
   * Áreas de expertise del autor
   * @example ['Comprensión Lectora', 'Literatura Clásica', 'Poesía']
   */
  @ApiPropertyOptional({
    description: 'Áreas de expertise del autor',
    type: [String],
    example: ['Comprensión Lectora', 'Literatura Clásica', 'Poesía'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise_areas?: string[];
}
