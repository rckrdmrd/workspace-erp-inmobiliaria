import { IsUUID, IsOptional, IsInt, IsNumber, Min, Max } from 'class-validator';

/**
 * CreateUserStatsDto
 *
 * @description DTO para crear estadísticas de usuario en el sistema de gamificación.
 *              La mayoría de campos tienen valores por defecto en la BD.
 */
export class CreateUserStatsDto {
  /**
   * ID del usuario (FK → auth.users)
   * REQUERIDO: Cada registro de stats pertenece a un usuario
   */
  @IsUUID()
  user_id!: string;

  /**
   * ID del tenant (FK → auth_management.tenants)
   * OPCIONAL: Para contexto multi-tenant
   */
  @IsOptional()
  @IsUUID()
  tenant_id?: string;

  // Los demás campos tienen valores por defecto en la BD
  // y se actualizarán a través del UpdateUserStatsDto
}
