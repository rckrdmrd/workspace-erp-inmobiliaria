import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * LoginDto
 *
 * @description DTO para autenticación de usuario con email y password.
 */
export class LoginDto {
  @ApiProperty({
    description: 'Email del usuario',
    example: 'usuario@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email es requerido' })
  email!: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'MySecurePassword123!',
    type: String,
    minLength: 8,
  })
  @IsString({ message: 'Password debe ser string' })
  @MinLength(8, { message: 'Password debe tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'Password es requerido' })
  password!: string;
}
