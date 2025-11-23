import { IsArray, IsUUID, IsString, IsBoolean, IsOptional, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * BulkDeleteUsersDto
 * DTO para eliminar múltiples usuarios de forma masiva
 * Relacionado: EXT-002 (Admin Extendido - Bulk Operations)
 */
export class BulkDeleteUsersDto {
  @ApiProperty({
    description: 'Array de UUIDs de usuarios a eliminar',
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un usuario' })
  @IsUUID('4', { each: true, message: 'Cada ID debe ser un UUID válido' })
  userIds!: string[];

  @ApiProperty({
    description: 'Razón de la eliminación',
    example: 'Cuenta duplicada',
  })
  @IsString()
  reason!: string;

  @ApiProperty({
    description: 'Si true, elimina permanentemente. Si false, marca como deleted (soft delete)',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  hardDelete?: boolean; // default false = soft delete
}
