import {
  Controller,
  Get,
  Patch,
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
import { NotificationPreferenceService } from '../services/notification-preference.service';
import { JwtAuthGuard } from '@/modules/auth/guards';
import {
  UpdatePreferenceDto,
  UpdateMultiplePreferencesDto,
  PreferenceResponseDto,
  PreferencesListResponseDto,
} from '../dto/preferences';

/**
 * NotificationPreferencesController
 *
 * @description Controller para preferencias de notificaciones multi-canal (EXT-003)
 * @version 1.0 (2025-11-13)
 *
 * Rutas: /notifications/preferences/*
 *
 * Endpoints:
 * - GET /preferences - Obtener todas las preferencias del usuario
 * - PATCH /preferences/:notificationType - Actualizar preferencia específica
 * - PATCH /preferences - Actualizar múltiples preferencias (batch)
 *
 * Seguridad:
 * - Todos los endpoints requieren autenticación JWT
 * - Usuario solo puede modificar sus propias preferencias
 *
 * IMPORTANTE:
 * - userId se extrae del JWT (req.user.sub)
 * - Defaults: in_app=true, email=true, push=false
 * - Las preferencias se respetan en send_notification()
 */
@ApiTags('notifications-preferences')
@Controller('notifications/preferences')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationPreferencesController {
  constructor(
    private readonly preferenceService: NotificationPreferenceService,
  ) {}

  /**
   * GET /notifications/preferences
   *
   * Obtener todas las preferencias de notificaciones del usuario
   *
   * Retorna array con preferencias configuradas
   * Si el usuario no ha configurado preferencias, retorna array vacío
   * (el sistema usará defaults automáticamente)
   */
  @Get()
  @ApiOperation({
    summary: 'Obtener preferencias de notificaciones',
    description:
      'Retorna las preferencias configuradas del usuario. ' +
      'Si no hay preferencias configuradas, se usan defaults (in_app=true, email=true, push=false)',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencias obtenidas exitosamente',
    type: PreferencesListResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async getUserPreferences(
    @Request() req: any,
  ): Promise<PreferencesListResponseDto> {
    const userId = req.user.sub;
    const preferences = await this.preferenceService.getUserPreferences(userId);

    return {
      preferences: preferences as PreferenceResponseDto[],
    };
  }

  /**
   * PATCH /notifications/preferences/:notificationType
   *
   * Actualizar preferencia para un tipo específico de notificación
   *
   * Usa patrón upsert: crea si no existe, actualiza si existe
   */
  @Patch(':notificationType')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar preferencia por tipo',
    description:
      'Actualiza o crea la preferencia para un tipo específico de notificación. ' +
      'Usa patrón upsert.',
  })
  @ApiParam({
    name: 'notificationType',
    description: 'Tipo de notificación (ej: achievement, friend_request)',
    example: 'achievement',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencia actualizada exitosamente',
    type: PreferenceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async updatePreference(
    @Param('notificationType') notificationType: string,
    @Body() updateDto: UpdatePreferenceDto,
    @Request() req: any,
  ): Promise<PreferenceResponseDto> {
    const userId = req.user.sub;

    const preference = await this.preferenceService.updatePreference(
      userId,
      notificationType,
      {
        inAppEnabled: updateDto.inAppEnabled,
        emailEnabled: updateDto.emailEnabled,
        pushEnabled: updateDto.pushEnabled,
      },
    );

    return preference as PreferenceResponseDto;
  }

  /**
   * PATCH /notifications/preferences
   *
   * Actualizar múltiples preferencias en batch
   *
   * Útil para pantalla de settings con múltiples toggles
   */
  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar múltiples preferencias',
    description:
      'Actualiza múltiples preferencias en una sola llamada. ' +
      'Útil para sincronizar desde UI de settings.',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferencias actualizadas exitosamente',
    type: PreferencesListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  async updateMultiple(
    @Body() updateDto: UpdateMultiplePreferencesDto,
    @Request() req: any,
  ): Promise<PreferencesListResponseDto> {
    const userId = req.user.sub;

    const preferences = await this.preferenceService.updateMultiple(
      userId,
      updateDto.preferences.map((pref) => ({
        notificationType: pref.notificationType,
        inAppEnabled: pref.inAppEnabled,
        emailEnabled: pref.emailEnabled,
        pushEnabled: pref.pushEnabled,
      })),
    );

    return {
      preferences: preferences as PreferenceResponseDto[],
    };
  }
}
