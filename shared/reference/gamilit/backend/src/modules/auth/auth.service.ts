import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
// import { UsersService } from '../users/users.service'; // TODO: Implementar UsersService
import { LoginDto, RefreshTokenDto } from './dto';
// import { RegisterDto } from './dto'; // TODO: RegisterDto no exportado
// import { TokenResponse, AuthResponse } from './types'; // TODO: Crear archivo types

// Interfaces temporales hasta crear ./types
interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthResponse {
  user: any;
  tokens: TokenResponse;
}

/**
 * Auth Service
 *
 * ISSUE: #9 (P1) - Implementar Refresh Token
 * FECHA: 2025-11-04
 * SPRINT: Sprint 0 - Día 2
 *
 * Gestiona autenticación con JWT (access + refresh tokens)
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    // private readonly usersService: UsersService // TODO: Uncomment when UsersService is implemented
  ) {}

  /**
   * Registro de nuevo usuario
   * TODO: Implement when RegisterDto and UsersService are available
   * IMPLEMENTATION NEEDED:
   * 1. Verify email doesn't already exist
   * 2. Hash password with bcrypt
   * 3. Create user with UsersService
   * 4. Generate JWT tokens
   * 5. Return sanitized user + tokens
   */
  async register(dto: any): Promise<AuthResponse> {
    throw new Error('Register method not implemented - UsersService required');
  }

  /**
   * Login de usuario
   * TODO: Implement when UsersService is available
   * IMPLEMENTATION NEEDED:
   * 1. Find user by email
   * 2. Verify password with bcrypt
   * 3. Update last_login timestamp
   * 4. Generate JWT tokens
   * 5. Return sanitized user + tokens
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    throw new Error('Login method not implemented - UsersService required');
  }

  /**
   * Refresh Token - NUEVO ✅
   *
   * Permite renovar el access token usando un refresh token válido
   * sin requerir re-autenticación.
   *
   * TODO: Implement when UsersService is available
   * IMPLEMENTATION NEEDED:
   * 1. Verify refresh token with JWT
   * 2. Find user by ID from token payload
   * 3. Validate user is active
   * 4. Generate new access + refresh tokens
   */
  async refreshToken(dto: RefreshTokenDto): Promise<TokenResponse> {
    throw new Error('RefreshToken method not implemented - UsersService required');
  }

  /**
   * Logout - Invalida tokens (client-side)
   */
  async logout(userId: string): Promise<{ message: string }> {
    // TODO: Implementar blacklist de tokens en Redis (opcional)
    // Por ahora, el logout es client-side (eliminar tokens de localStorage)

    return { message: 'Logged out successfully' };
  }

  /**
   * Validar usuario (usado por JWT Strategy)
   *
   * TODO: Implement when UsersService is available
   * IMPLEMENTATION NEEDED:
   * 1. Find user by ID
   * 2. Check if user exists and is active
   * 3. Return sanitized user (without password)
   */
  async validateUser(userId: string) {
    throw new Error('ValidateUser method not implemented - UsersService required');
  }

  /**
   * Generar Access Token y Refresh Token
   */
  private async generateTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<TokenResponse> {
    const payload = { sub: userId, email, role };

    // Access Token (15 minutos)
    const jwtExpiration = this.configService.get<string>('JWT_EXPIRATION') || '15m';
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: jwtExpiration as any
    });

    // Refresh Token (7 días)
    const jwtRefreshExpiration = this.configService.get<string>('JWT_REFRESH_EXPIRATION') || '7d';
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: jwtRefreshExpiration as any
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900 // 15 minutos en segundos
    };
  }

  /**
   * Remover campos sensibles del usuario
   */
  private sanitizeUser(user: any) {
    const { password, ...sanitized } = user;
    return sanitized;
  }
}
