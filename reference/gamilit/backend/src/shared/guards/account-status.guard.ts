import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Account Status Guard
 *
 * Verifica que la cuenta del usuario esté activa
 * Bloquea acceso a cuentas:
 * - Inactivas
 * - Suspendidas
 * - Eliminadas (soft delete)
 */
@Injectable()
export class AccountStatusGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario, dejar que AuthGuard lo maneje
    if (!user) {
      return true;
    }

    // Verificar status de la cuenta
    const status = user.status || user.accountStatus;

    if (!status) {
      // Si no hay información de status, asumir que está activo
      return true;
    }

    // Estados bloqueados
    switch (status.toLowerCase()) {
      case 'inactive':
      case 'deactivated':
        throw new ForbiddenException(
          'Your account has been deactivated. Please contact support.',
        );

      case 'suspended':
        const suspensionDetails = user.suspensionDetails || {};
        const { isPermanent, suspendedUntil, reason } = suspensionDetails;

        if (isPermanent) {
          throw new ForbiddenException(
            `Your account has been permanently suspended. Reason: ${reason || 'Policy violation'}`,
          );
        }

        if (suspendedUntil) {
          const now = new Date();
          const suspensionEnd = new Date(suspendedUntil);

          if (now < suspensionEnd) {
            throw new ForbiddenException(
              `Your account is suspended until ${suspensionEnd.toLocaleDateString()}. Reason: ${reason || 'Policy violation'}`,
            );
          }
          // Si la suspensión ya expiró, permitir acceso
          // (idealmente debería actualizarse el status automáticamente)
        } else {
          throw new ForbiddenException(
            `Your account has been suspended. Reason: ${reason || 'Policy violation'}`,
          );
        }
        break;

      case 'deleted':
      case 'banned':
        throw new ForbiddenException(
          'Your account has been permanently banned. Please contact support.',
        );

      case 'pending_verification':
      case 'pending':
        throw new UnauthorizedException(
          'Please verify your email before accessing this resource.',
        );

      case 'active':
      case 'verified':
        // Estados válidos, permitir acceso
        return true;

      default:
        // Estado desconocido, denegar por seguridad
        throw new ForbiddenException(
          `Account status '${status}' is not recognized. Please contact support.`,
        );
    }

    return true;
  }
}
