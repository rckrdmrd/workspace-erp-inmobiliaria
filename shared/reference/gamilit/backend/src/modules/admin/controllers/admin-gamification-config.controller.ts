import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { AdminGuard } from '../guards/admin.guard';
import { GamificationConfigService } from '../services/gamification-config.service';
import {
  UpdateGamificationSettingsDto,
  GamificationSettingsResponseDto,
  PreviewImpactDto,
  PreviewImpactResultDto,
  RestoreDefaultsResultDto,
} from '../dto/gamification-config';

/**
 * AdminGamificationConfigController
 *
 * @description Controller para configuración de gamificación (admin)
 * @tags Admin - Gamification Config
 *
 * Endpoints:
 * - GET /settings - Obtener configuración actual
 * - PUT /settings - Actualizar configuración
 * - POST /settings/preview - Previsualizar impacto
 * - POST /settings/restore-defaults - Restaurar valores por defecto
 *
 * Guards:
 * - JwtAuthGuard: Usuario debe estar autenticado
 * - AdminGuard: Usuario debe ser admin
 *
 * @example
 * GET /api/admin/gamification/settings
 * PUT /api/admin/gamification/settings
 * POST /api/admin/gamification/settings/preview
 * POST /api/admin/gamification/settings/restore-defaults
 */
@ApiTags('Admin - Gamification Config')
@Controller('admin/gamification')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminGamificationConfigController {
  constructor(
    private readonly gamificationConfigService: GamificationConfigService,
  ) {}

  /**
   * Get current gamification settings
   *
   * @route GET /api/admin/gamification/settings
   * @returns Current gamification configuration with defaults and audit info
   *
   * @example Response:
   * {
   *   "xp": { "base_per_exercise": 10, "completion_multiplier": 1.5 },
   *   "ranks": { "novice": 0, "beginner": 100, ... },
   *   "coins": { "welcome_bonus": 500, ... },
   *   "achievements": { "criteria": [] },
   *   "defaults": { ... },
   *   "last_updated": "2025-11-11T20:00:00.000Z",
   *   "updated_by": "admin-uuid"
   * }
   */
  @Get('settings')
  @ApiOperation({
    summary: 'Get gamification settings',
    description:
      'Retrieve current gamification configuration including XP, ranks, coins, and achievements. ' +
      'Includes default values and audit information (last updated timestamp and admin ID).',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings retrieved successfully',
    type: GamificationSettingsResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not an admin',
  })
  async getGamificationSettings(): Promise<GamificationSettingsResponseDto> {
    return await this.gamificationConfigService.getGamificationSettings();
  }

  /**
   * Update gamification settings
   *
   * @route PUT /api/admin/gamification/settings
   * @param dto Settings to update (partial updates supported)
   * @param req Express request with authenticated user
   * @returns Updated configuration
   *
   * @example Request Body:
   * {
   *   "xp": {
   *     "base_per_exercise": 15,
   *     "completion_multiplier": 2.0
   *   },
   *   "ranks": {
   *     "novice": 0,
   *     "beginner": 150,
   *     "intermediate": 600,
   *     "advanced": 2000,
   *     "expert": 6000
   *   }
   * }
   */
  @Put('settings')
  @ApiOperation({
    summary: 'Update gamification settings',
    description:
      'Update gamification configuration. Supports partial updates - only provided fields will be updated. ' +
      'Validates that rank thresholds are in ascending order and multipliers are >= 1.0. ' +
      'System and readonly settings cannot be modified.',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings updated successfully',
    type: GamificationSettingsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Invalid settings (e.g., rank thresholds not in order, multiplier < 1)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not an admin',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Setting key does not exist',
  })
  async updateGamificationSettings(
    @Body() dto: UpdateGamificationSettingsDto,
    @Request() req: any,
  ): Promise<GamificationSettingsResponseDto> {
    const adminId = req.user.sub;
    return await this.gamificationConfigService.updateGamificationSettings(
      dto,
      adminId,
    );
  }

  /**
   * Preview impact of new settings
   *
   * @route POST /api/admin/gamification/settings/preview
   * @param dto Proposed settings with optional sample_size
   * @returns Estimated impact on users (rank changes, XP/coins delta)
   *
   * @example Request Body:
   * {
   *   "xp": { "base_per_exercise": 20 },
   *   "ranks": { "novice": 0, "beginner": 200, ... },
   *   "sample_size": 1000
   * }
   *
   * @example Response:
   * {
   *   "users_affected": 800,
   *   "rank_changes": { "promotions": 80, "demotions": 16 },
   *   "xp_impact": { "avg_xp_change": 20.5, "total_xp_change": 16400 },
   *   "coins_impact": { "avg_coins_change": 0, "total_coins_change": 0 },
   *   "preview_timestamp": "2025-11-11T20:00:00.000Z"
   * }
   */
  @Post('settings/preview')
  @ApiOperation({
    summary: 'Preview settings impact',
    description:
      'Preview estimated impact of new settings on users without saving changes. ' +
      'Returns metrics like affected users count, rank changes (promotions/demotions), ' +
      'and XP/coins impact (average and total deltas). ' +
      'Sample size can be specified (default: 1000, max: 10000) to control calculation scope.',
  })
  @ApiResponse({
    status: 200,
    description: 'Preview calculated successfully',
    type: PreviewImpactResultDto,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad Request - Invalid settings or sample size out of range',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not an admin',
  })
  async previewImpact(
    @Body() dto: PreviewImpactDto,
  ): Promise<PreviewImpactResultDto> {
    return await this.gamificationConfigService.previewImpact(dto);
  }

  /**
   * Restore settings to defaults
   *
   * @route POST /api/admin/gamification/settings/restore-defaults
   * @param req Express request with authenticated user
   * @returns List of restored settings and audit info
   *
   * @example Response:
   * {
   *   "settings_restored": [
   *     "gamification.xp.base_per_exercise",
   *     "gamification.xp.completion_multiplier",
   *     "gamification.ranks.thresholds",
   *     "gamification.coins.welcome_bonus"
   *   ],
   *   "restored_at": "2025-11-11T20:00:00.000Z",
   *   "restored_by": "admin-uuid"
   * }
   */
  @Post('settings/restore-defaults')
  @ApiOperation({
    summary: 'Restore default settings',
    description:
      'Restore all gamification settings to their default values. ' +
      'Only non-system settings will be restored. ' +
      'This action cannot be undone - consider creating a backup before restoring. ' +
      'Returns the list of setting keys that were restored.',
  })
  @ApiResponse({
    status: 200,
    description: 'Settings restored successfully',
    type: RestoreDefaultsResultDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - JWT token missing or invalid',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not an admin',
  })
  async restoreDefaults(
    @Request() req: any,
  ): Promise<RestoreDefaultsResultDto> {
    const adminId = req.user.sub;
    return await this.gamificationConfigService.restoreDefaults(adminId);
  }
}
