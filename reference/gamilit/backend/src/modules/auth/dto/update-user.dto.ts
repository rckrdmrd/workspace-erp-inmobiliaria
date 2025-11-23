import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto
 *
 * @description DTO para actualización parcial de usuarios.
 * @usage Endpoints de actualización de datos de usuario.
 *
 * IMPORTANTE:
 * - Omite 'password' (usar endpoint específico /api/auth/password)
 * - Todos los campos son opcionales (PartialType)
 * - NO permite cambiar email directamente (usar flujo de cambio de email con verificación)
 *
 * @see CreateUserDto
 * @see UserEntity (auth.users)
 */
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'email'] as const),
) {
  // Hereda de CreateUserDto excepto password y email:
  // - role?: GamilityRoleEnum
  // - raw_user_meta_data?: Record<string, any>

  // Campos opcionales adicionales para actualización:
  // (actualmente solo role y raw_user_meta_data son editables)
}
