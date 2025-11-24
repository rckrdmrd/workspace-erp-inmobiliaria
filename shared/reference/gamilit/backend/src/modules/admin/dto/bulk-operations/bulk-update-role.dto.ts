import { IsArray, IsUUID, IsEnum, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * BulkUpdateRoleDto
 * DTO para actualizar roles de múltiples usuarios de forma masiva
 * Relacionado: EXT-002 (Admin Extendido - Bulk Operations)
 */
export class BulkUpdateRoleDto {
  @ApiProperty({
    description: 'Array de UUIDs de usuarios a actualizar',
    example: ['123e4567-e89b-12d3-a456-426614174000', '123e4567-e89b-12d3-a456-426614174001'],
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'Debe proporcionar al menos un usuario' })
  @IsUUID('4', { each: true, message: 'Cada ID debe ser un UUID válido' })
  userIds!: string[];

  @ApiProperty({
    description: 'Nuevo rol a asignar',
    example: 'teacher',
    enum: ['student', 'teacher', 'admin', 'super_admin'],
  })
  @IsEnum(['student', 'teacher', 'admin', 'super_admin'], {
    message: 'Rol inválido. Debe ser: student, teacher, admin o super_admin',
  })
  newRole!: 'student' | 'teacher' | 'admin' | 'super_admin';
}
