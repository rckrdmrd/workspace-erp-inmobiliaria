import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserSuspensionDto } from './create-user-suspension.dto';

/**
 * UpdateUserSuspensionDto
 *
 * @description DTO para actualizar una suspensión de usuario
 * @extends CreateUserSuspensionDto (todos los campos son opcionales excepto user_id y suspended_by que se omiten)
 * @see Entity: UserSuspension
 * @see DDL: auth_management.user_suspensions
 *
 * @note Se usa típicamente para:
 *       - Extender la suspensión (actualizar suspension_until)
 *       - Actualizar la razón (agregar más detalles)
 *       - Convertir suspensión temporal en permanente (suspension_until = null)
 *
 * @note user_id y suspended_by se omiten porque no deben actualizarse
 *
 * @created 2025-11-11 (DB-100 Ciclo B.2)
 * @version 1.0
 */
export class UpdateUserSuspensionDto extends PartialType(
  OmitType(CreateUserSuspensionDto, ['user_id', 'suspended_by'] as const),
) {}
