/**
 * Notifications Gateway
 *
 * WebSocket gateway for real-time notifications
 */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { WsJwtGuard, AuthenticatedSocket } from './guards/ws-jwt.guard';
import { SocketEvent } from './types/websocket.types';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3005', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST'],
  },
  path: '/socket.io/',
  transports: ['websocket', 'polling'],
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private userSockets = new Map<string, Set<string>>(); // userId -> Set of socketIds

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  @UseGuards(WsJwtGuard)
  async handleConnection(client: AuthenticatedSocket) {
    const userId = client.userData?.userId;
    const userEmail = client.userData?.email;

    if (!userId) {
      this.logger.warn(`Connection rejected: no user data`);
      client.disconnect();
      return;
    }

    this.logger.log(`Client connected: ${userEmail} (${client.id})`);

    // Register socket for user
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(client.id);

    // Join user's personal room
    await client.join(`user:${userId}`);
    this.logger.debug(`Socket ${client.id} joined room: user:${userId}`);

    // Emit authenticated event
    client.emit(SocketEvent.AUTHENTICATED, {
      success: true,
      userId,
      email: userEmail,
      socketId: client.id,
    });
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    const userId = client.userData?.userId;
    const userEmail = client.userData?.email;

    if (userId) {
      const sockets = this.userSockets.get(userId);
      if (sockets) {
        sockets.delete(client.id);
        if (sockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }

    this.logger.log(`Client disconnected: ${userEmail} (${client.id})`);
  }

  /**
   * Handle client marking notification as read
   */
  @UseGuards(WsJwtGuard)
  @SubscribeMessage(SocketEvent.MARK_AS_READ)
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationId: string },
  ) {
    try {
      const userId = client.userData!.userId;
      const { notificationId } = data;

      this.logger.debug(`User ${userId} marking notification ${notificationId} as read via WebSocket`);

      // Acknowledge to client
      client.emit(SocketEvent.NOTIFICATION_READ, {
        notificationId,
        success: true,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error('Error handling mark as read:', error);
      client.emit(SocketEvent.ERROR, {
        message: 'Failed to mark notification as read',
      });
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Emit notification to specific user
   */
  emitToUser(userId: string, event: SocketEvent, data: any) {
    const room = `user:${userId}`;
    this.server.to(room).emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Emitted ${event} to user ${userId}`);
  }

  /**
   * Emit notification to multiple users
   */
  emitToUsers(userIds: string[], event: SocketEvent, data: any) {
    userIds.forEach((userId) => {
      this.emitToUser(userId, event, data);
    });
    this.logger.debug(`Emitted ${event} to ${userIds.length} users`);
  }

  /**
   * Broadcast to all connected users
   */
  broadcast(event: SocketEvent, data: any) {
    this.server.emit(event, {
      ...data,
      timestamp: new Date().toISOString(),
    });
    this.logger.debug(`Broadcasted ${event} to all connected users`);
  }

  /**
   * Get connected users count
   */
  getConnectedUsersCount(): number {
    return this.userSockets.size;
  }

  /**
   * Check if user is connected
   */
  isUserConnected(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId)!.size > 0;
  }

  /**
   * Get user's socket count
   */
  getUserSocketCount(userId: string): number {
    return this.userSockets.get(userId)?.size || 0;
  }
}
