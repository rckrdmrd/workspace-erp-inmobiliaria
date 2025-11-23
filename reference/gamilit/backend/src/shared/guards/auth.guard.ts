import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '@shared/decorators/public.decorator';
import { logger } from '@shared/utils/logger.util';
import { User } from '../../modules/auth/entities/user.entity';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: User | undefined;
    }
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Extract token from request
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      logger.warn('Auth attempt without token');
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Verify and decode JWT
      const payload = await this.jwtService.verifyAsync(token);

      // Attach user to request
      request.user = payload;

      logger.debug(`User authenticated: ${payload.sub}`);
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.warn(`JWT verification failed: ${errorMessage}`);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
