import { IsArray, IsUUID, IsString, IsOptional, IsInt, Min, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * BulkSuspendUsersDto
 * DTO para suspender múltiples usuarios de forma masiva
 * Relacionado: EXT-002 (Admin Extendido - Bulk Operations)
 */
export class BulkSuspendUsersDto {
  @ApiProperty({
    description: 'Array de UUIDs de usuarios a suspender',
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un usuario' })
  @IsUUID('4', { each: true, message: 'Cada ID debe ser un UUID válido' })
  userIds!: string[];

  @ApiProperty({
    description: 'Razón de la suspensión',
    example: 'Violación de términos de servicio',
  })
  @IsString()
  reason!: string;

  @ApiProperty({
    description: 'Duración de la suspensión en días (null = permanente)',
    example: 30,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'La duración debe ser al menos 1 día' })
  durationDays?: number; // null = permanente
}
