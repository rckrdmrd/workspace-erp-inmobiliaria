import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services';

/**
 * JwtStrategy
 *
 * @description Estrategia de autenticación JWT con Passport.
 *
 * @flow
 * 1. Extrae token del header Authorization Bearer
 * 2. Valida token con secret
 * 3. Ejecuta validate() con payload decodificado
 * 4. Retorna user que se anexa a req.user
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
    });
  }

  /**
   * Validar payload del JWT
   *
   * @param payload - { sub: userId, email, role, iat, exp }
   * @returns User data para req.user
   */
  async validate(payload: any) {
    const { sub: userId } = payload;

    // Validar que usuario exista y esté activo
    const user = await this.authService.validateUser(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado o inactivo');
    }

    // Retornar user para req.user (sin password)
    // Fix: Usar deleted_at y email_confirmed_at en lugar de status y email_verified
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      is_active: !user.deleted_at, // Usuario activo si no está eliminado
      email_verified: !!user.email_confirmed_at, // Verificado si tiene fecha de confirmación
    };
  }
}
