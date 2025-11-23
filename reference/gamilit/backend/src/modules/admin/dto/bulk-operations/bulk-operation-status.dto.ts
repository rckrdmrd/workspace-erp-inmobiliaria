import { ApiProperty } from '@nestjs/swagger';

/**
 * BulkOperationStatusDto
 * DTO de respuesta para el estado de una operación bulk
 * Relacionado: EXT-002 (Admin Extendido - Bulk Operations)
 */
export class BulkOperationStatusDto {
  @ApiProperty({
    description: 'UUID de la operación bulk',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Tipo de operación ejecutada',
    example: 'suspend_users',
    enum: ['suspend_users', 'activate_users', 'update_role', 'delete_users'],
  })
  operationType!: string;

  @ApiProperty({
    description: 'Entidad objetivo de la operación',
    example: 'users',
  })
  targetEntity!: string;

  @ApiProperty({
    description: 'Estado actual de la operación',
    example: 'running',
    enum: ['pending', 'running', 'completed', 'failed', 'cancelled'],
  })
  status!: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

  @ApiProperty({
    description: 'Cantidad total de recursos a procesar',
    example: 150,
  })
  targetCount!: number;

  @ApiProperty({
    description: 'Cantidad de recursos procesados exitosamente',
    example: 120,
  })
  completedCount!: number;

  @ApiProperty({
    description: 'Cantidad de recursos que fallaron',
    example: 5,
  })
  failedCount!: number;

  @ApiProperty({
    description: 'Fecha y hora de inicio',
    example: '2025-11-11T10:00:00Z',
  })
  startedAt!: Date;

  @ApiProperty({
    description: 'Fecha y hora de completitud (si ya terminó)',
    example: '2025-11-11T10:15:00Z',
    required: false,
  })
  completedAt?: Date;

  @ApiProperty({
    description: 'Detalles de errores individuales',
    example: [{ userId: 'abc', error: 'User not found' }],
    required: false,
  })
  errorDetails?: any[];

  @ApiProperty({
    description: 'Resultado consolidado de la operación',
    example: { summary: 'Operation completed successfully' },
    required: false,
  })
  result?: any;

  @ApiProperty({
    description: 'UUID del administrador que inició la operación',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  startedBy!: string;
}
