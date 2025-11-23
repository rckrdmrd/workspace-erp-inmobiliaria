import {
  Controller,
  Post,
  Get,
  Body,
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
  ApiBody,
} from '@nestjs/swagger';
import { PasswordRecoveryService, EmailVerificationService } from '../services';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from '../dto';
import { API_ROUTES, extractBasePath } from '@/shared/constants';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * PasswordController
 *
 * @description Controlador de recuperación de contraseña y verificación de email.
 *
 * @endpoints
 * - POST /auth/reset-password/request - Solicitar reset de password
 * - POST /auth/reset-password - Resetear password con token
 * - POST /auth/verify-email - Verificar email con token
 * - POST /auth/verify-email/resend - Reenviar email de verificación
 * - GET /auth/verify-email/status - Consultar estado de verificación
 */
@ApiTags('Authentication')
@Controller(extractBasePath(API_ROUTES.AUTH.BASE))
export class PasswordController {
  constructor(
    private readonly passwordRecoveryService: PasswordRecoveryService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  /**
   * Solicitar reset de contraseña
   */
  @Post('reset-password/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Solicitar reset de contraseña',
    description: 'Envía email con token de recuperación. Siempre retorna 200 (no revela si email existe)',
  })
  @ApiResponse({
    status: 200,
    description: 'Email enviado si el correo existe en el sistema',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiBody({ type: RequestPasswordResetDto })
  async requestPasswordReset(
    @Body() dto: RequestPasswordResetDto,
  ): Promise<{ message: string }> {
    return await this.passwordRecoveryService.requestReset(dto);
  }

  /**
   * Resetear contraseña con token
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resetear contraseña con token',
    description: 'Valida token y actualiza contraseña. Invalida todas las sesiones.',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  @ApiBody({ type: ResetPasswordDto })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return await this.passwordRecoveryService.resetPassword(dto);
  }

  /**
   * Verificar email con token
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar email con token',
    description: 'Valida token y marca email como verificado',
  })
  @ApiResponse({
    status: 200,
    description: 'Email verificado exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
        verified: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido, expirado o ya usado' })
  @ApiBody({ type: VerifyEmailDto })
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<{ message: string; verified: boolean }> {
    return await this.emailVerificationService.verifyEmail(dto);
  }

  /**
   * Reenviar email de verificación
   */
  @Post('verify-email/resend')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reenviar email de verificación',
    description: 'Genera nuevo token y envía email de verificación',
  })
  @ApiResponse({
    status: 200,
    description: 'Email de verificación enviado',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 409, description: 'Email ya verificado' })
  async resendVerification(@Request() req: any): Promise<{ message: string }> {
    // Extraer userId del token JWT
    const userId = req.user?.id;
    return await this.emailVerificationService.resendVerification(userId);
  }

  /**
   * Consultar estado de verificación
   */
  @Get('verify-email/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Consultar estado de verificación de email',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de verificación',
    schema: {
      properties: {
        verified: { type: 'boolean' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async checkVerificationStatus(@Request() req: any): Promise<{ verified: boolean }> {
    // Extraer userId del token JWT
    const userId = req.user?.id;
    return await this.emailVerificationService.checkVerificationStatus(userId);
  }
}
