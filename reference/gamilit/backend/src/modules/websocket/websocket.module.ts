/**
 * WebSocket Module
 *
 * Provides real-time communication via Socket.IO
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsGateway } from './notifications.gateway';
import { WebSocketService } from './websocket.service';
import { WsJwtGuard } from './guards/ws-jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: '7d', // 7 days token expiration
      },
    }),
  ],
  providers: [NotificationsGateway, WebSocketService, WsJwtGuard],
  exports: [WebSocketService],
})
export class WebSocketModule {}
