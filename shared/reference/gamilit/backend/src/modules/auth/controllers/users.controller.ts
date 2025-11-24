import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from '../services';
import {
  UpdateProfileDto,
  UserResponseDto,
} from '../dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

/**
 * UsersController
 *
 * @description Controlador de gestión de usuarios y perfiles.
 *
 * @endpoints
 * - GET /api/users/profile - Obtener perfil del usuario autenticado
 * - PUT /api/users/profile - Actualizar perfil del usuario autenticado
 * - GET /api/users/preferences - Obtener preferencias del usuario
 * - PUT /api/users/preferences - Actualizar preferencias del usuario
 * - POST /api/users/avatar - Subir avatar del usuario
 * - GET /api/users/statistics - Obtener estadísticas del usuario
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly authService: AuthService) {}

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
    const userId = req.user?.id;
    const user = await this.authService.validateUser(userId);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

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
    const userId = req.user?.id;
    const updatedUser = await this.authService.updateUserProfile(userId, dto);

    if (!updatedUser) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { encrypted_password, ...userResponse } = updatedUser;
    return userResponse as UserResponseDto;
  }

  /**
   * Obtener preferencias del usuario
   */
  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener preferencias del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Preferencias del usuario',
    schema: {
      properties: {
        preferences: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getPreferences(@Request() req: any): Promise<{ preferences: any }> {
    const userId = req.user?.id;
    const preferences = await this.authService.getUserPreferences(userId);
    return { preferences };
  }

  /**
   * Actualizar preferencias del usuario
   */
  @Put('preferences')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar preferencias del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Preferencias actualizadas exitosamente',
    schema: {
      properties: {
        preferences: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiBody({
    schema: {
      properties: {
        preferences: { type: 'object' },
      },
    },
  })
  async updatePreferences(
    @Request() req: any,
    @Body('preferences') preferences: any,
  ): Promise<{ preferences: any }> {
    const userId = req.user?.id;
    const updatedPreferences = await this.authService.updateUserPreferences(
      userId,
      preferences,
    );
    return { preferences: updatedPreferences };
  }

  /**
   * Subir avatar del usuario
   */
  @Post('avatar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir avatar del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Avatar subido exitosamente',
    schema: {
      properties: {
        avatar_url: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  @ApiResponse({ status: 400, description: 'Archivo inválido' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAvatar(
    @Request() req: any,
    @UploadedFile() file: any,
  ): Promise<{ avatar_url: string }> {
    const userId = req.user?.id;

    if (!file) {
      throw new UnauthorizedException('No se proporcionó archivo');
    }

    const avatarUrl = await this.authService.uploadUserAvatar(userId, file);
    return { avatar_url: avatarUrl };
  }

  /**
   * Obtener estadísticas del usuario
   */
  @Get('statistics')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del usuario',
    schema: {
      properties: {
        total_xp: { type: 'number' },
        total_ml_coins: { type: 'number' },
        total_exercises: { type: 'number' },
        total_achievements: { type: 'number' },
        current_rank: { type: 'string' },
        modules_completed: { type: 'number' },
        login_streak: { type: 'number' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autenticado' })
  async getStatistics(@Request() req: any): Promise<any> {
    const userId = req.user?.id;
    const statistics = await this.authService.getUserStatistics(userId);
    return statistics;
  }
}
