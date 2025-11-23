/**
 * WebSocket JWT Guard
 *
 * Authenticates WebSocket connections using JWT tokens
 */

import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userData?: {
    userId: string;
    email: string;
    role: string;
    tenantId?: string;
  };
}

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: AuthenticatedSocket = context.switchToWs().getClient();

      // Extract token from auth object or query params
      const token =
        client.handshake.auth?.token ||
        client.handshake.query?.token;

      if (!token || typeof token !== 'string') {
        this.logger.warn('WebSocket connection attempt without token');
        throw new WsException('Authentication token required');
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);

      // Attach user data to socket
      client.userData = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        tenantId: payload.tenant_id,
      };

      this.logger.log(`WebSocket authenticated: ${client.userData.email} (${client.userData.userId})`);

      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn('WebSocket authentication failed:', errorMessage);
      throw new WsException('Authentication failed');
    }
  }
}
