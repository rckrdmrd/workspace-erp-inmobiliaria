import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';

/**
 * UpdateProfileDto
 *
 * @description DTO para actualizar un perfil de usuario
 *
 * Hereda de CreateProfileDto pero:
 * - Todos los campos son opcionales (PartialType)
 * - Se omite tenant_id (no se cambia después de creación)
 * - Se omite user_id (no se cambia después de creación)
 *
 * Campos actualizables:
 * - display_name
 * - full_name
 * - first_name
 * - last_name
 * - email (con cuidado, debe verificarse)
 * - avatar_url
 * - bio
 * - phone
 * - date_of_birth
 * - grade_level
 * - student_id
 * - school_id
 * - role (solo admin)
 * - status (solo admin)
 * - email_verified (solo admin)
 * - phone_verified (solo admin)
 * - preferences
 * - metadata
 *
 * @see CreateProfileDto
 * @see ProfileEntity
 */
export class UpdateProfileDto extends PartialType(
  OmitType(CreateProfileDto, ['tenant_id', 'user_id'] as const),
) {}
