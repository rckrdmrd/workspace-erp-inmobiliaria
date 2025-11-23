import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Metadata key para skip verification
 */
export const SKIP_EMAIL_VERIFICATION_KEY = 'skip_email_verification';

/**
 * Decorator para skip email verification
 */
export const SkipEmailVerification = () =>
  Reflect.metadata(SKIP_EMAIL_VERIFICATION_KEY, true);

/**
 * Email Verified Guard
 *
 * Verifica que el usuario haya verificado su email
 * Puede ser skipeado con @SkipEmailVerification decorator
 */
@Injectable()
export class EmailVerifiedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Verificar si se debe skip la verificación
    const skipVerification = this.reflector.getAllAndOverride<boolean>(
      SKIP_EMAIL_VERIFICATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipVerification) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, dejar que AuthGuard lo maneje
    if (!user) {
      return true;
    }

    // Verificar si el email está verificado
    const emailVerified =
      user.emailVerified || user.email_verified || user.isEmailVerified;

    if (!emailVerified) {
      throw new UnauthorizedException(
        'Please verify your email address before accessing this resource. Check your inbox for the verification link.',
      );
    }

    return true;
  }
}
