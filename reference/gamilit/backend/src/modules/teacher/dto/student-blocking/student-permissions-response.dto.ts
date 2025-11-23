import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BlockType } from './block-student.dto';

/**
 * DTO de respuesta para permisos de estudiante
 *
 * @description Formato de respuesta para consultas y operaciones de bloqueo/permisos
 */
export class StudentPermissionsResponseDto {
  @ApiProperty({
    description: 'ID del estudiante',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  student_id!: string;

  @ApiProperty({
    description: 'ID del aula',
    example: '770e8400-e29b-41d4-a716-446655440020',
  })
  classroom_id!: string;

  @ApiProperty({
    description: 'Estado de la membresía en el aula',
    example: 'active',
    enum: ['active', 'inactive', 'withdrawn', 'completed'],
  })
  status!: string;

  @ApiProperty({
    description: 'Indica si el estudiante está bloqueado',
    example: false,
  })
  is_blocked!: boolean;

  @ApiPropertyOptional({
    description: 'Tipo de bloqueo (si aplica)',
    enum: BlockType,
    example: BlockType.FULL,
  })
  block_type?: BlockType;

  @ApiProperty({
    description: 'Permisos y restricciones del estudiante (JSONB)',
    example: {
      allowed_modules: ['uuid1', 'uuid2'],
      can_submit_assignments: true,
      can_view_leaderboard: false,
    },
  })
  permissions!: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Fecha y hora del bloqueo (si aplica)',
    example: '2025-11-11T20:00:00Z',
  })
  blocked_at?: Date;

  @ApiPropertyOptional({
    description: 'ID del profesor que bloqueó al estudiante (si aplica)',
    example: '550e8400-e29b-41d4-a716-446655440010',
  })
  blocked_by?: string;

  @ApiPropertyOptional({
    description: 'Razón del bloqueo (si aplica)',
    example: 'Comportamiento inapropiado en foro',
  })
  block_reason?: string;
}
