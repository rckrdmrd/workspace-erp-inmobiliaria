import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionTypeEnum } from '@/shared/constants/enums.constants';

/**
 * Transaction Response DTO
 *
 * @description DTO de respuesta para transacciones de ML Coins
 * @usage Retornado en endpoints de historial y consulta de transacciones
 */
export class TransactionResponseDto {
  @ApiProperty({
    description: 'ID de la transacción',
    example: '770e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  user_id!: string;

  @ApiProperty({
    description: 'Monto de la transacción',
    example: 50,
  })
  amount!: number;

  @ApiProperty({
    description: 'Balance antes de la transacción',
    example: 100,
  })
  balance_before!: number;

  @ApiProperty({
    description: 'Balance después de la transacción',
    example: 150,
  })
  balance_after!: number;

  @ApiProperty({
    description: 'Tipo de transacción',
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.EARNED_EXERCISE,
  })
  transaction_type!: TransactionTypeEnum;

  @ApiPropertyOptional({
    description: 'Descripción de la transacción',
    example: 'Completaste el ejercicio de comprensión lectora',
  })
  description!: string | null;

  @ApiPropertyOptional({
    description: 'Razón técnica',
    example: 'Exercise completion with perfect score',
  })
  reason!: string | null;

  @ApiPropertyOptional({
    description: 'ID de referencia',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  reference_id!: string | null;

  @ApiPropertyOptional({
    description: 'Tipo de referencia',
    example: 'exercise',
  })
  reference_type!: string | null;

  @ApiProperty({
    description: 'Multiplicador aplicado',
    example: 1.5,
  })
  multiplier!: number;

  @ApiProperty({
    description: 'Bono aplicado',
    example: true,
  })
  bonus_applied!: boolean;

  @ApiProperty({
    description: 'Metadatos adicionales',
    example: { exercise_difficulty: 'hard', perfect_score: true },
  })
  metadata!: Record<string, any>;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2025-11-02T10:30:00Z',
  })
  created_at!: Date;
}
