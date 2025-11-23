import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UserDeviceService } from '../services/user-device.service';
import { JwtAuthGuard } from '@/modules/auth/guards';
import {
  RegisterDeviceDto,
  UpdateDeviceNameDto,
  DeviceResponseDto,
  DevicesListResponseDto,
} from '../dto/devices';

/**
 * NotificationDevicesController
 *
 * @description Controller para dispositivos de push notifications (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Rutas: /notifications/devices/*
 *
 * Endpoints:
 * - POST /devices - Registrar dispositivo
 * - GET /devices - Obtener dispositivos del usuario
 * - GET /devices/:id - Obtener dispositivo específico
 * - PATCH /devices/:id - Actualizar nombre del dispositivo
 * - DELETE /devices/:id - Eliminar dispositivo
 *
 * Seguridad:
 * - Todos los endpoints requieren autenticación JWT
 * - Usuario solo puede gestionar sus propios dispositivos
 *
 * IMPORTANTE:
 * - userId se extrae del JWT (req.user.sub)
 * - Device tokens se ocultan parcialmente en responses
 * - Solo dispositivos activos reciben push notifications
 */
@ApiTags('notifications-devices')
@Controller('notifications/devices')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationDevicesController {
  constructor(private readonly deviceService: UserDeviceService) {}

  /**
   * POST /notifications/devices
   *
   * Registrar dispositivo para push notifications
   *
   * Flujo:
   * 1. App obtiene device token de Firebase Cloud Messaging (FCM)
   * 2. App envía token + metadata a este endpoint
   * 3. Backend registra con upsert (actualiza si existe)
   * 4. Usuario queda habilitado para recibir push
   *
   * IMPORTANTE:
   * - Usa patrón upsert: actualiza last_used_at si ya existe
   * - Device tokens pueden cambiar (app reinstalada, permisos revocados)
   * - Cliente debe re-registrar cuando obtiene nuevo token
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar dispositivo',
    description:
      'Registra un dispositivo para recibir push notifications. ' +
      'Usa patrón upsert (actualiza si ya existe).',
  })
  @ApiResponse({
    status: 201,
    description: 'Dispositivo registrado exitosamente',
    type: DeviceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos o tipo de dispositivo no soportado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async registerDevice(
    @Body() registerDto: RegisterDeviceDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    const userId = req.user.sub;

    const device = await this.deviceService.registerDevice({
      userId,
      deviceToken: registerDto.deviceToken,
      deviceType: registerDto.deviceType,
      deviceName: registerDto.deviceName,
    });

    // Ocultar parcialmente el token por seguridad
    return {
      ...device,
      deviceToken: this.maskToken(device.deviceToken),
    } as DeviceResponseDto;
  }

  /**
   * GET /notifications/devices
   *
   * Obtener todos los dispositivos del usuario
   *
   * Por defecto, solo retorna dispositivos activos
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener dispositivos del usuario',
    description: 'Retorna lista de dispositivos registrados (solo activos)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de dispositivos obtenida exitosamente',
    type: DevicesListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getUserDevices(@Request() req: any): Promise<DevicesListResponseDto> {
    const userId = req.user.sub;
    const devices = await this.deviceService.getUserDevices(userId, false);

    // Ocultar parcialmente los tokens
    const devicesWithMaskedTokens = devices.map((device) => ({
      ...device,
      deviceToken: this.maskToken(device.deviceToken),
    }));

    return {
      devices: devicesWithMaskedTokens as DeviceResponseDto[],
    };
  }

  /**
   * GET /notifications/devices/:id
   *
   * Obtener dispositivo específico
   *
   * Valida ownership automáticamente
   */
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener dispositivo por ID',
    description: 'Retorna dispositivo específico si pertenece al usuario',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del dispositivo',
    example: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo encontrado',
    type: DeviceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Dispositivo no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getDeviceById(
    @Param('id') deviceId: string,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    const userId = req.user.sub;
    const device = await this.deviceService.getDeviceById(deviceId, userId);

    return {
      ...device,
      deviceToken: this.maskToken(device.deviceToken),
    } as DeviceResponseDto;
  }

  /**
   * PATCH /notifications/devices/:id
   *
   * Actualizar nombre del dispositivo
   *
   * Permite al usuario personalizar el nombre del dispositivo
   * para identificarlo más fácilmente en settings
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar nombre del dispositivo',
    description: 'Actualiza el nombre descriptivo del dispositivo',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del dispositivo',
    example: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  })
  @ApiResponse({
    status: 200,
    description: 'Dispositivo actualizado exitosamente',
    type: DeviceResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Dispositivo no encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async updateDeviceName(
    @Param('id') deviceId: string,
    @Body() updateDto: UpdateDeviceNameDto,
    @Request() req: any,
  ): Promise<DeviceResponseDto> {
    const userId = req.user.sub;

    const device = await this.deviceService.updateDeviceName(
      deviceId,
      userId,
      updateDto.deviceName,
    );

    return {
      ...device,
      deviceToken: this.maskToken(device.deviceToken),
    } as DeviceResponseDto;
  }

  /**
   * DELETE /notifications/devices/:id
   *
   * Eliminar dispositivo
   *
   * Casos de uso:
   * - Usuario ya no usa ese dispositivo
   * - Usuario quiere dejar de recibir push en ese dispositivo
   * - Dispositivo perdido/robado
   *
   * IMPORTANTE:
   * - Elimina permanentemente el registro
   * - Usuario debe re-registrar si quiere recibir push nuevamente
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar dispositivo',
    description:
      'Elimina un dispositivo registrado. ' +
      'El dispositivo dejará de recibir push notifications.',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del dispositivo',
    example: 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  })
  @ApiResponse({
    status: 204,
    description: 'Dispositivo eliminado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Dispositivo no encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async deleteDevice(
    @Param('id') deviceId: string,
    @Request() req: any,
  ): Promise<void> {
    const userId = req.user.sub;
    await this.deviceService.deleteDevice(deviceId, userId);
  }

  /**
   * Ocultar parcialmente el device token por seguridad
   *
   * Muestra solo los primeros 20 caracteres + "..."
   *
   * @private
   * @param token - Token completo
   * @returns Token parcialmente oculto
   */
  private maskToken(token: string): string {
    if (!token || token.length <= 20) {
      return token;
    }
    return token.substring(0, 20) + '...';
  }
}
