import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Get,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService, SessionManagementService, SecurityService } from '../services';
import {
  RegisterUserDto,
  UserResponseDto,
  LoginDto,
  RefreshTokenDto,
  UpdateProfileDto,
} from '../dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * AuthController
 *
 * @description Controlador de autenticación.
 *
 * @endpoints
 * - POST /api/auth/register - Registro de usuario
 * - POST /api/auth/login - Autenticación con email/password
 * - POST /api/auth/logout - Cerrar sesión
 * - POST /api/auth/refresh - Renovar access token
 * - GET /api/auth/profile - Obtener perfil del usuario autenticado
 */
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionManagementService,
    private readonly securityService: SecurityService,
  ) {}

  /**
   * Registro de nuevo usuario
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email ya registrado' })
  @ApiBody({ type: RegisterUserDto })
  async register(
    @Body() dto: RegisterUserDto,
    @Request() req: any,
  ): Promise<UserResponseDto> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    return await this.authService.register(dto, ip, userAgent);
  }

  /**
   * Login de usuario
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticación de usuario',
    description: 'Rate limiting: 5 intentos fallidos por email en 15 minutos',
  })
  @ApiResponse({
    status: 200,
    description: 'Autenticación exitosa',
    schema: {
      properties: {
        user: { type: 'object' },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiResponse({ status: 429, description: 'Demasiados intentos fallidos' })
  @ApiBody({ type: LoginDto })
  async login(
    @Body() dto: LoginDto,
    @Request() req: any,
  ): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }> {
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];

    // 1. Verificar rate limiting
    const rateLimit = await this.securityService.checkRateLimit(dto.email, ip);
    if (rateLimit.isBlocked) {
      throw new UnauthorizedException(rateLimit.reason);
    }

    // 2. Autenticar
    return await this.authService.login(dto.email, dto.password, ip, userAgent);
  }

  /**
   * Logout de usuario
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión de usuario' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async logout(@Request() req: any): Promise<{ message: string }> {
    // Extraer userId y sessionId del token JWT
    const userId = req.user?.id;
    const sessionId = req.user?.sessionId || 'current-session';

    await this.authService.logout(userId, sessionId);
    return { message: 'Sesión cerrada exitosamente' };
  }

  /**
   * Renovar access token
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token con refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    schema: {
      properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  @ApiBody({ type: RefreshTokenDto })
  async refresh(
    @Body() dto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.refreshToken(dto.refreshToken);
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getProfile(@Request() req: any): Promise<UserResponseDto> {
    // Extraer userId del token JWT
    const userId = req.user?.id;
    const user = await this.authService.validateUser(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Convertir a UserResponseDto (sin password)
    const { encrypted_password, ...userResponse } = user;
    return userResponse as UserResponseDto;
  }

  /**
   * Actualizar perfil del usuario autenticado
   */
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: UpdateProfileDto })
  async updateProfile(
    @Request() req: any,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserResponseDto> {
    // Extraer userId del token JWT
    const userId = req.user?.id;

    // Actualizar perfil usando el servicio de auth
    const updatedUser = await this.authService.updateUserProfile(userId, dto);

    if (!updatedUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Convertir a UserResponseDto (sin password)
    const { encrypted_password, ...userResponse } = updatedUser;
    return userResponse as UserResponseDto;
  }

  /**
   * Verificar email del usuario
   */
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar email del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Email verificado exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string' },
      },
    },
  })
  async verifyEmail(@Body('token') token: string): Promise<{ message: string }> {
    // TODO: Implementar lógica de verificación de email
    // Por ahora retornamos éxito
    return { message: 'Email verificado exitosamente' };
  }

  /**
   * Solicitar reseteo de contraseña
   */
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar reseteo de contraseña' })
  @ApiResponse({
    status: 200,
    description: 'Email de reseteo enviado',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiBody({
    schema: {
      properties: {
        email: { type: 'string' },
      },
    },
  })
  async forgotPassword(@Body('email') email: string): Promise<{ message: string }> {
    // TODO: Implementar lógica de forgot password
    return { message: 'Si el email existe, recibirás instrucciones para resetear tu contraseña' };
  }

  /**
   * Resetear contraseña
   */
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Resetear contraseña con token' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña reseteada exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  @ApiBody({
    schema: {
      properties: {
        token: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  async resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    // TODO: Implementar lógica de reset password
    return { message: 'Contraseña reseteada exitosamente' };
  }

  /**
   * Cambiar contraseña (usuario autenticado)
   */
  @Put('password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar contraseña del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta' })
  @ApiBody({
    schema: {
      properties: {
        currentPassword: { type: 'string' },
        newPassword: { type: 'string' },
      },
    },
  })
  async changePassword(
    @Request() req: any,
    @Body('currentPassword') currentPassword: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    const userId = req.user?.id;
    // TODO: Implementar lógica de cambio de contraseña
    return { message: 'Contraseña cambiada exitosamente' };
  }

  /**
   * Obtener sesiones activas del usuario
   */
  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener sesiones activas del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de sesiones activas',
    schema: {
      properties: {
        sessions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              device_type: { type: 'string' },
              browser: { type: 'string' },
              os: { type: 'string' },
              ip_address: { type: 'string' },
              last_activity_at: { type: 'string' },
              created_at: { type: 'string' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getSessions(@Request() req: any): Promise<{ sessions: any[] }> {
    const userId = req.user?.id;
    // TODO: Implementar getUserSessions en SessionManagementService
    return { sessions: [] };
  }

  /**
   * Revocar sesión específica
   */
  @Delete('sessions/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revocar sesión específica' })
  @ApiResponse({
    status: 200,
    description: 'Sesión revocada exitosamente',
    schema: {
      properties: {
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 404, description: 'Sesión no encontrada' })
  async revokeSession(
    @Request() req: any,
    @Param('sessionId') sessionId: string,
  ): Promise<{ message: string }> {
    const userId = req.user?.id;
    // TODO: Implementar revokeSession en SessionManagementService
    return { message: 'Sesión revocada exitosamente' };
  }
}
