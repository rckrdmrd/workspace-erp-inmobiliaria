import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User, Profile, UserSession, AuthAttempt, Tenant } from '../entities';
import {
  RegisterUserDto,
  UserResponseDto,
  CreateUserSessionDto,
  CreateAuthAttemptDto,
  UpdateProfileDto,
} from '../dto';
import { DB_SCHEMAS, DB_TABLES, GamilityRoleEnum, UserStatusEnum } from '@shared/constants';

/**
 * AuthService
 *
 * @description Servicio de autenticación principal.
 * Maneja registro, login, logout y validación de usuarios.
 *
 * @responsibilities
 * - Registro de nuevos usuarios en tenant principal (GAMILIT Platform)
 * - Autenticación con JWT (access + refresh tokens)
 * - Logging de intentos (exitosos y fallidos)
 * - Gestión de sesiones activas
 *
 * @security
 * - Passwords hasheados con bcrypt (cost 10)
 * - Refresh tokens hasheados en DB (SHA256)
 * - Rate limiting en service layer
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User, 'auth')
    private readonly userRepository: Repository<User>,

    @InjectRepository(Profile, 'auth')
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Tenant, 'auth')
    private readonly tenantRepository: Repository<Tenant>,

    @InjectRepository(UserSession, 'auth')
    private readonly sessionRepository: Repository<UserSession>,

    @InjectRepository(AuthAttempt, 'auth')
    private readonly attemptRepository: Repository<AuthAttempt>,

    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registrar nuevo usuario
   */
  async register(dto: RegisterUserDto, ip?: string, userAgent?: string): Promise<UserResponseDto> {
    // 1. Validar email único
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email ya registrado');
    }

    // 2. Hashear password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Obtener tenant principal de GAMILIT
    let mainTenant = await this.tenantRepository.findOne({
      where: { slug: 'gamilit-prod', is_active: true },
    });

    // Fallback: buscar primer tenant activo
    if (!mainTenant) {
      mainTenant = await this.tenantRepository.findOne({
        where: { is_active: true },
        order: { created_at: 'ASC' },
      });
    }

    // Validar que existe un tenant
    if (!mainTenant) {
      throw new Error('No hay tenants activos en el sistema. Contacte al administrador.');
    }

    // 4. Crear usuario (sin status ya que no existe en la tabla)
    const user = this.userRepository.create({
      email: dto.email,
      encrypted_password: hashedPassword,
      role: GamilityRoleEnum.STUDENT,
      // status: UserStatusEnum.ACTIVE, // Campo no existe en auth.users
      // email_verified: false, // Campo no existe en auth.users (se usa email_confirmed_at)
      // tenant_id: tenant.id, // Campo no existe en auth.users
    });
    await this.userRepository.save(user);

    // 5. Crear perfil con tenant principal
    // CRITICAL FIX: profiles.id MUST equal auth.users.id for FK consistency
    // This matches the pattern used in seeds and eliminates ID conversion bugs
    const profile = this.profileRepository.create({
      id: user.id,             // ✅ profiles.id = auth.users.id (same UUID)
      user_id: user.id,        // ✅ self-reference for consistency
      tenant_id: mainTenant.id, // ✅ Usa tenant principal
      email: user.email,
      first_name: dto.first_name || null,
      last_name: dto.last_name || null,
      role: GamilityRoleEnum.STUDENT,
      status: UserStatusEnum.ACTIVE,
      email_verified: false,
    });
    await this.profileRepository.save(profile);

    // 6. Registrar intento exitoso
    await this.logAuthAttempt(user.id, dto.email, true, ip, userAgent);

    // 7. Retornar usuario sin password
    return this.toUserResponse(user);
  }

  /**
   * Login de usuario
   */
  async login(
    email: string,
    password: string,
    ip?: string,
    userAgent?: string,
  ): Promise<{ user: UserResponseDto; accessToken: string; refreshToken: string }> {
    // 1. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      await this.logAuthAttempt(null, email, false, ip, userAgent, 'Usuario no encontrado');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 2. Validar password
    const isPasswordValid = await bcrypt.compare(password, user.encrypted_password);

    if (!isPasswordValid) {
      await this.logAuthAttempt(user.id, email, false, ip, userAgent, 'Password incorrecto');
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // 3. Validar estado activo (usando deleted_at ya que status no existe en la tabla)
    if (user.deleted_at) {
      await this.logAuthAttempt(user.id, email, false, ip, userAgent, 'Usuario inactivo (eliminado)');
      throw new UnauthorizedException('Usuario no activo');
    }

    // 4. Registrar intento exitoso
    await this.logAuthAttempt(user.id, email, true, ip, userAgent);

    // 5. Buscar perfil del usuario para obtener tenant_id
    const profile = await this.profileRepository.findOne({
      where: { user_id: user.id },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil de usuario no encontrado');
    }

    // 6. Generar tokens
    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    // 7. Crear sesión en la base de datos
    const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const sessionToken = crypto.randomBytes(32).toString('hex'); // Generar session token único
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    const session = this.sessionRepository.create({
      user_id: profile.id, // IMPORTANT: user_id references profiles.id, not users.id
      tenant_id: profile.tenant_id,
      session_token: sessionToken,
      refresh_token: hashedRefreshToken,
      ip_address: ip || null,
      user_agent: userAgent || null,
      device_type: this.detectDeviceType(userAgent),
      browser: this.detectBrowser(userAgent),
      os: this.detectOS(userAgent),
      expires_at: expiresAt,
      last_activity_at: new Date(),
      is_active: true,
    });
    await this.sessionRepository.save(session);

    // 8. Retornar
    return {
      user: this.toUserResponse(user),
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validar usuario por ID
   */
  async validateUser(userId: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    // Verificar que no esté eliminado
    if (user && user.deleted_at) {
      return null;
    }
    return user;
  }

  /**
   * Logout de usuario
   */
  async logout(userId: string, sessionId: string): Promise<void> {
    await this.sessionRepository.delete({ id: sessionId, user_id: userId });
  }

  /**
   * Renovar access token usando refresh token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // 1. Verificar y decodificar refresh token
      const payload = this.jwtService.verify(refreshToken);

      // 2. Validar usuario
      const user = await this.validateUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }

      // 3. Hashear refresh token para buscar sesión
      const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

      // 4. Buscar sesión activa con este refresh token
      const session = await this.sessionRepository.findOne({
        where: {
          user_id: user.id,
          refresh_token: hashedRefreshToken,
        },
      });

      if (!session) {
        throw new UnauthorizedException('Sesión no encontrada o refresh token inválido');
      }

      // 5. Validar que la sesión no haya expirado
      if (new Date() > session.expires_at) {
        await this.sessionRepository.delete({ id: session.id });
        throw new UnauthorizedException('Sesión expirada');
      }

      // 6. Generar nuevos tokens
      const newPayload = { sub: user.id, email: user.email, role: user.role };
      const newAccessToken = this.jwtService.sign(newPayload, { expiresIn: '15m' });
      const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '7d' });

      // 7. Actualizar sesión con nuevo refresh token
      const newHashedRefreshToken = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
      session.refresh_token = newHashedRefreshToken;
      session.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
      session.last_activity_at = new Date();
      await this.sessionRepository.save(session);

      // 8. Retornar nuevos tokens
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Error de JWT (token inválido, expirado, malformado, etc.)
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  /**
   * Actualizar perfil del usuario
   */
  async updateUserProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    // 1. Buscar usuario
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // 2. Buscar perfil asociado
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new BadRequestException('Perfil no encontrado');
    }

    // 3. Actualizar campos del perfil que vienen en el DTO
    if (dto.display_name !== undefined) profile.display_name = dto.display_name;
    if (dto.full_name !== undefined) profile.full_name = dto.full_name;
    if (dto.first_name !== undefined) profile.first_name = dto.first_name;
    if (dto.last_name !== undefined) profile.last_name = dto.last_name;
    if (dto.avatar_url !== undefined) profile.avatar_url = dto.avatar_url;
    if (dto.bio !== undefined) profile.bio = dto.bio;
    if (dto.phone !== undefined) profile.phone = dto.phone;
    if (dto.date_of_birth !== undefined) {
      profile.date_of_birth = typeof dto.date_of_birth === 'string'
        ? new Date(dto.date_of_birth)
        : dto.date_of_birth;
    }
    if (dto.grade_level !== undefined) profile.grade_level = dto.grade_level;
    if (dto.student_id !== undefined) profile.student_id = dto.student_id;
    if (dto.school_id !== undefined) profile.school_id = dto.school_id;
    if (dto.preferences !== undefined) profile.preferences = dto.preferences;
    if (dto.metadata !== undefined) profile.metadata = dto.metadata;

    // 4. Actualizar email en user si cambió (requiere re-verificación)
    if (dto.email !== undefined && dto.email !== user.email) {
      // Verificar que el nuevo email no esté en uso
      const existingUser = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (existingUser && existingUser.id !== userId) {
        throw new ConflictException('Email ya está en uso');
      }

      user.email = dto.email;
      profile.email = dto.email;
      profile.email_verified = false; // Requiere re-verificación
      await this.userRepository.save(user);
    }

    // 5. Guardar perfil actualizado
    await this.profileRepository.save(profile);

    // 6. Retornar usuario actualizado
    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new UnauthorizedException('Usuario no encontrado después de actualización');
    }

    return updatedUser;
  }

  /**
   * Obtener preferencias del usuario
   */
  async getUserPreferences(userId: string): Promise<any> {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil no encontrado');
    }

    return profile.preferences || {};
  }

  /**
   * Actualizar preferencias del usuario
   */
  async updateUserPreferences(userId: string, preferences: any): Promise<any> {
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil no encontrado');
    }

    profile.preferences = preferences;
    await this.profileRepository.save(profile);

    return profile.preferences;
  }

  /**
   * Subir avatar del usuario
   */
  async uploadUserAvatar(userId: string, file: any): Promise<string> {
    // TODO: Implementar lógica de almacenamiento de archivos (S3, local storage, etc.)
    // Por ahora, retornamos una URL de ejemplo
    const avatarUrl = `/avatars/${userId}_${Date.now()}_${file.originalname}`;

    // Actualizar perfil con nueva URL de avatar
    const profile = await this.profileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new UnauthorizedException('Perfil no encontrado');
    }

    profile.avatar_url = avatarUrl;
    await this.profileRepository.save(profile);

    return avatarUrl;
  }

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStatistics(userId: string): Promise<any> {
    // TODO: Implementar consultas a tablas de gamificación, progreso, etc.
    // Por ahora, retornamos estadísticas de ejemplo
    return {
      total_xp: 0,
      total_ml_coins: 0,
      total_exercises: 0,
      total_achievements: 0,
      current_rank: 'Nacom',
      modules_completed: 0,
      login_streak: 0,
    };
  }

  /**
   * Helper: Registrar intento de autenticación
   */
  private async logAuthAttempt(
    _userId: string | null,
    email: string,
    success: boolean,
    ip?: string,
    userAgent?: string,
    failureReason?: string,
  ): Promise<void> {
    const attempt = this.attemptRepository.create({
      email,
      success,
      ip_address: ip || '0.0.0.0',
      user_agent: userAgent || null,
      failure_reason: failureReason || null,
    });
    await this.attemptRepository.save(attempt);
  }

  /**
   * Helper: Convertir User a UserResponseDto con campos derivados
   *
   * @description Transforma User entity a DTO seguro para el cliente.
   * Calcula campos derivados para coherencia con Frontend:
   * - emailVerified: true si email_confirmed_at tiene valor
   * - isActive: true si NO está deleted_at ni banned_until activo
   *
   * @param user - User entity de la base de datos
   * @returns UserResponseDto con campos derivados calculados
   */
  private toUserResponse(user: User): UserResponseDto {
    const { encrypted_password, ...userWithoutPassword } = user;

    // Calcular campos derivados para coherencia Frontend-Backend
    const emailVerified = !!user.email_confirmed_at;
    const now = new Date();
    const isActive = !user.deleted_at &&
      (!user.banned_until || user.banned_until < now);

    return {
      ...userWithoutPassword,
      emailVerified,
      isActive,
    } as UserResponseDto;
  }

  /**
   * Helper: Detectar tipo de dispositivo desde user agent
   */
  private detectDeviceType(userAgent?: string): string {
    if (!userAgent) {
      return 'desktop';
    }

    const ua = userAgent.toLowerCase();

    // Mobile
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
      return 'mobile';
    }

    // Tablet
    if (/tablet|ipad|playbook|silk/i.test(ua)) {
      return 'tablet';
    }

    // Desktop (default)
    return 'desktop';
  }

  /**
   * Helper: Detectar navegador desde user agent
   */
  private detectBrowser(userAgent?: string): string | null {
    if (!userAgent) {
      return null;
    }

    const ua = userAgent.toLowerCase();

    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('chrome') && !ua.includes('edge')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('edge')) return 'Edge';
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera';

    return 'Unknown';
  }

  /**
   * Helper: Detectar sistema operativo desde user agent
   */
  private detectOS(userAgent?: string): string | null {
    if (!userAgent) {
      return null;
    }

    const ua = userAgent.toLowerCase();

    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac os')) return 'MacOS';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';

    return 'Unknown';
  }
}
