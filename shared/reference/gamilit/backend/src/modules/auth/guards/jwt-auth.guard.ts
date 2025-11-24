import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

/**
 * JwtAuthGuard
 *
 * @description Guard para proteger rutas con JWT.
 *
 * @usage
 * @UseGuards(JwtAuthGuard)
 * async protectedRoute(@Request() req) {
 *   const user = req.user; // Populated by JwtStrategy
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // Llamar al AuthGuard de Passport
    return super.canActivate(context);
  }
}
