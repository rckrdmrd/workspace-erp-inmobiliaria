import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import {
  User,
  Profile,
  Tenant,
  Role, // ✨ NUEVO - RBAC
  UserRole,
  Membership,
  AuthProvider,
  AuthAttempt,
  UserSession,
  EmailVerificationToken,
  PasswordResetToken,
  SecurityEvent, // ✨ NUEVO - P0 (Auditoría de seguridad)
} from './entities';

// Services
import {
  AuthService,
  SessionManagementService,
  SecurityService,
  PasswordRecoveryService,
  EmailVerificationService,
} from './services';

// Controllers
import { AuthController, PasswordController, UsersController } from './controllers';

// Strategies
import { JwtStrategy } from './strategies/jwt.strategy';

// Constants
import { DB_SCHEMAS } from '@/shared/constants';

/**
 * AuthModule
 *
 * @description Módulo de autenticación completo.
 *
 * @exports
 * - AuthService (para usar en otros módulos)
 * - SessionManagementService
 * - EmailVerificationService
 *
 * @imports
 * - JwtModule (con config async desde env)
 * - PassportModule (para strategies)
 * - TypeOrmModule (con multi-schema para auth + auth_management)
 */
@Module({
  imports: [
    // Passport configuration
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT configuration (async con env vars)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const expiresIn = configService.get<string>('JWT_EXPIRES_IN') || '15m';
        return {
          secret: configService.get<string>('JWT_SECRET') || 'dev-secret-change-in-production',
          signOptions: {
            expiresIn: expiresIn as any,
          },
        };
      },
      inject: [ConfigService],
    }),

    // TypeORM entities - Connection 'auth' handles schema 'auth_management'
    // Note: 'auth' is the connection name defined in app.module.ts
    // The actual schema 'auth_management' is specified in entity decorators
    TypeOrmModule.forFeature(
      [
        User,
        Profile,
        Tenant,
        Role, // ✨ NUEVO - RBAC
        UserRole,
        Membership,
        AuthProvider,
        AuthAttempt,
        UserSession,
        EmailVerificationToken,
        PasswordResetToken,
        SecurityEvent, // ✨ NUEVO - P0 (Auditoría de seguridad)
      ],
      'auth',
    ),
  ],
  controllers: [AuthController, PasswordController, UsersController],
  providers: [
    // Services
    AuthService,
    SessionManagementService,
    SecurityService,
    PasswordRecoveryService,
    EmailVerificationService,

    // Strategies
    JwtStrategy,
  ],
  exports: [
    // Exportar services para usar en otros módulos
    AuthService,
    SessionManagementService,
    EmailVerificationService,
    JwtModule,
    PassportModule,
  ],
})
export class AuthModule {}
