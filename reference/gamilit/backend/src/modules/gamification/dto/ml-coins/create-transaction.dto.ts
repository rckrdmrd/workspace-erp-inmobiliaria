import { IsEnum, IsInt, IsOptional, IsString, IsUUID, IsNumber, IsBoolean, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionTypeEnum } from '@/shared/constants/enums.constants';

/**
 * Create ML Coins Transaction DTO
 *
 * @description DTO para crear una nueva transacción de ML Coins
 * @usage Usado por servicios internos para registrar earnings y gastos
 *
 * Validaciones:
 * - amount puede ser negativo (para gastos)
 * - balance_before y balance_after deben ser >= 0
 * - transaction_type debe ser válido según enum
 * - reference_type opcional pero debe estar en lista permitida
 */
export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID del usuario que realiza la transacción',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  user_id!: string;

  @ApiProperty({
    description: 'Monto de la transacción (puede ser negativo para gastos)',
    example: 50,
  })
  @IsInt()
  amount!: number;

  @ApiProperty({
    description: 'Balance antes de la transacción',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  balance_before!: number;

  @ApiProperty({
    description: 'Balance después de la transacción',
    example: 150,
    minimum: 0,
  })
  @IsInt()
  @Min(0)
  balance_after!: number;

  @ApiProperty({
    description: 'Tipo de transacción',
    enum: TransactionTypeEnum,
    example: TransactionTypeEnum.EARNED_EXERCISE,
  })
  @IsEnum(TransactionTypeEnum)
  transaction_type!: TransactionTypeEnum;

  @ApiPropertyOptional({
    description: 'Descripción legible de la transacción',
    example: 'Completaste el ejercicio de comprensión lectora',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Razón técnica de la transacción',
    example: 'Exercise completion with perfect score',
  })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: 'ID de la entidad relacionada',
    example: '660e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  reference_id?: string;

  @ApiPropertyOptional({
    description: 'Tipo de entidad relacionada',
    enum: ['exercise', 'module', 'achievement', 'powerup', 'admin', 'streak', 'rank'],
    example: 'exercise',
  })
  @IsOptional()
  @IsString()
  reference_type?: 'exercise' | 'module' | 'achievement' | 'powerup' | 'admin' | 'streak' | 'rank';

  @ApiPropertyOptional({
    description: 'Multiplicador aplicado (ej: 1.5x por racha)',
    example: 1.5,
    default: 1.0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  multiplier?: number;

  @ApiPropertyOptional({
    description: 'Indica si se aplicó un bono',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  bonus_applied?: boolean;

  @ApiPropertyOptional({
    description: 'Metadatos adicionales',
    example: { exercise_difficulty: 'hard', perfect_score: true },
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
