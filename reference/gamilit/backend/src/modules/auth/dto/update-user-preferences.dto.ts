import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserPreferencesDto } from './create-user-preferences.dto';

/**
 * UpdateUserPreferencesDto
 *
 * @description DTO para actualizar preferencias de usuario
 * @extends CreateUserPreferencesDto (todos los campos son opcionales excepto user_id que se omite)
 * @see Entity: UserPreferences
 * @see DDL: auth_management.user_preferences
 *
 * @note user_id se omite porque se usa como PK y no debe actualizarse
 * @created 2025-11-11 (DB-100 Ciclo B.1)
 * @version 1.0
 */
export class UpdateUserPreferencesDto extends PartialType(
  OmitType(CreateUserPreferencesDto, ['user_id'] as const),
) {}
