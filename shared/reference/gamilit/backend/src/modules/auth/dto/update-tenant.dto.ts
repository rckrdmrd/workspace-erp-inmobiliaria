import { PartialType } from '@nestjs/mapped-types';
import { CreateTenantDto } from './create-tenant.dto';

/**
 * UpdateTenantDto - DTO para actualización de tenants
 *
 * @description Hereda todos los campos de CreateTenantDto pero los hace opcionales.
 * Permite actualizaciones parciales del tenant.
 *
 * @extends PartialType<CreateTenantDto>
 */
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
