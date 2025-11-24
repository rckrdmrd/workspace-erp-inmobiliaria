import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateMembershipDto } from './create-membership.dto';

/**
 * UpdateMembershipDto - DTO para actualización de membresías
 *
 * @description Hereda todos los campos de CreateMembershipDto excepto user_id y tenant_id,
 * y los hace opcionales. Permite actualizaciones parciales de la membresía.
 *
 * @note user_id y tenant_id no se pueden modificar después de la creación
 * @extends PartialType<OmitType<CreateMembershipDto, 'user_id' | 'tenant_id'>>
 */
export class UpdateMembershipDto extends PartialType(
  OmitType(CreateMembershipDto, ['user_id', 'tenant_id'] as const),
) {}
