# ET-ADM-005: Seguridad y Encriptación de Datos

**ID:** ET-ADM-005  
**Módulo:** MAI-013  
**Relacionado con:** RF-ADM-001, RF-ADM-002, RF-ADM-004

---

## 📋 Base de Datos

### Tabla: encryption_keys

```sql
CREATE TABLE admin.encryption_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_name VARCHAR(100) UNIQUE NOT NULL,
  key_version INT NOT NULL DEFAULT 1,
  encrypted_key TEXT NOT NULL,
  algorithm VARCHAR(50) DEFAULT 'AES-256-GCM',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  rotated_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'active',
  
  CONSTRAINT chk_status CHECK (status IN ('active', 'rotated', 'revoked'))
);

CREATE INDEX idx_encryption_keys_name ON admin.encryption_keys(key_name);
CREATE INDEX idx_encryption_keys_status ON admin.encryption_keys(status);
```

### Extensión pgcrypto

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Función para encriptar datos sensibles
CREATE OR REPLACE FUNCTION encrypt_sensitive(data TEXT, key_name VARCHAR)
RETURNS TEXT AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  SELECT encrypted_key INTO encryption_key
  FROM admin.encryption_keys
  WHERE key_name = key_name AND status = 'active'
  LIMIT 1;
  
  RETURN encode(
    pgp_sym_encrypt(data, encryption_key),
    'base64'
  );
END;
$$ LANGUAGE plpgsql;

-- Función para desencriptar
CREATE OR REPLACE FUNCTION decrypt_sensitive(encrypted_data TEXT, key_name VARCHAR)
RETURNS TEXT AS $$
DECLARE
  encryption_key TEXT;
BEGIN
  SELECT encrypted_key INTO encryption_key
  FROM admin.encryption_keys
  WHERE key_name = key_name AND status = 'active'
  LIMIT 1;
  
  RETURN pgp_sym_decrypt(
    decode(encrypted_data, 'base64'),
    encryption_key
  );
END;
$$ LANGUAGE plpgsql;
```

### Tabla: sessions (seguras)

```sql
CREATE TABLE auth_management.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth_management.users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  refresh_token_hash TEXT,
  
  -- Seguridad
  ip_address INET NOT NULL,
  user_agent TEXT,
  fingerprint TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Estado
  is_active BOOLEAN DEFAULT TRUE,
  revoked_at TIMESTAMPTZ,
  revoke_reason TEXT
);

CREATE INDEX idx_sessions_user ON auth_management.sessions(user_id);
CREATE INDEX idx_sessions_token ON auth_management.sessions(token_hash);
CREATE INDEX idx_sessions_active ON auth_management.sessions(is_active, expires_at);

-- Auto-expiración de sesiones inactivas
CREATE OR REPLACE FUNCTION expire_inactive_sessions()
RETURNS void AS $$
BEGIN
  UPDATE auth_management.sessions
  SET is_active = FALSE,
      revoked_at = NOW(),
      revoke_reason = 'Inactivity timeout'
  WHERE is_active = TRUE
    AND last_activity < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Ejecutar cada 5 minutos
SELECT cron.schedule('expire-sessions', '*/5 * * * *', 'SELECT expire_inactive_sessions()');
```

---

## 🔧 Backend

### encryption.service.ts

```typescript
import * as crypto from 'crypto';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService implements OnModuleInit {
  private masterKey: Buffer;
  private algorithm = 'aes-256-gcm';

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    // Cargar master key desde AWS KMS o variable de entorno
    const masterKeyBase64 = this.configService.get('MASTER_ENCRYPTION_KEY');
    this.masterKey = Buffer.from(masterKeyBase64, 'base64');
  }

  /**
   * Encripta datos sensibles (PII)
   */
  encrypt(plaintext: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.masterKey, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  /**
   * Desencripta datos
   */
  decrypt(encrypted: string, iv: string, tag: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.masterKey,
      Buffer.from(iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(tag, 'hex'));

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  /**
   * Hash one-way para passwords
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Verifica password
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Genera token seguro
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Hash para tokens de sesión
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }
}
```

### password-policy.service.ts

```typescript
@Injectable()
export class PasswordPolicyService {
  private readonly minLength = 12;
  private readonly requireUppercase = true;
  private readonly requireLowercase = true;
  private readonly requireNumbers = true;
  private readonly requireSpecialChars = true;
  private readonly maxPasswordAge = 90; // días
  private readonly preventReuse = 5; // últimas 5 passwords

  /**
   * Valida que password cumpla política
   */
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < this.minLength) {
      errors.push(`Password debe tener al menos ${this.minLength} caracteres`);
    }

    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password debe contener al menos una mayúscula');
    }

    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password debe contener al menos una minúscula');
    }

    if (this.requireNumbers && !/\d/.test(password)) {
      errors.push('Password debe contener al menos un número');
    }

    if (this.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password debe contener al menos un carácter especial');
    }

    // Detectar patrones comunes
    if (this.hasCommonPatterns(password)) {
      errors.push('Password contiene patrones demasiado simples');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /(.)\1{3,}/, // Caracteres repetidos (aaaa)
      /(012|123|234|345|456|567|678|789)/, // Secuencias numéricas
      /(abc|bcd|cde|def|efg|fgh|ghi)/i // Secuencias alfabéticas
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  /**
   * Verifica si password necesita rotación
   */
  async needsRotation(user: User): Promise<boolean> {
    if (!user.passwordChangedAt) {
      return true;
    }

    const daysSinceChange = differenceInDays(new Date(), user.passwordChangedAt);
    return daysSinceChange >= this.maxPasswordAge;
  }

  /**
   * Verifica que no sea password reutilizado
   */
  async checkPasswordReuse(userId: string, newPasswordHash: string): Promise<boolean> {
    const previousPasswords = await this.passwordHistoryRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: this.preventReuse
    });

    for (const prev of previousPasswords) {
      const isSame = await bcrypt.compare(newPasswordHash, prev.passwordHash);
      if (isSame) {
        return true; // Password ya fue usado
      }
    }

    return false;
  }
}
```

### session-security.service.ts

```typescript
@Injectable()
export class SessionSecurityService {
  constructor(
    @InjectRepository(Session)
    private sessionsRepo: Repository<Session>,
    private encryptionService: EncryptionService,
    private jwtService: JwtService
  ) {}

  /**
   * Crea sesión segura con fingerprinting
   */
  async createSession(
    user: User,
    ipAddress: string,
    userAgent: string,
    fingerprint: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Generar tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.encryptionService.generateSecureToken(64);

    // Hash para almacenar
    const tokenHash = this.encryptionService.hashToken(accessToken);
    const refreshTokenHash = this.encryptionService.hashToken(refreshToken);

    // Crear sesión
    const session = this.sessionsRepo.create({
      userId: user.id,
      tokenHash,
      refreshTokenHash,
      ipAddress,
      userAgent,
      fingerprint,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
      isActive: true
    });

    await this.sessionsRepo.save(session);

    return { accessToken, refreshToken };
  }

  /**
   * Valida sesión con múltiples factores
   */
  async validateSession(
    token: string,
    ipAddress: string,
    userAgent: string,
    fingerprint: string
  ): Promise<Session | null> {
    const tokenHash = this.encryptionService.hashToken(token);

    const session = await this.sessionsRepo.findOne({
      where: {
        tokenHash,
        isActive: true
      }
    });

    if (!session) {
      return null;
    }

    // Verificar expiración
    if (session.expiresAt < new Date()) {
      await this.revokeSession(session.id, 'Token expired');
      return null;
    }

    // Detectar cambio de IP (posible session hijacking)
    if (session.ipAddress !== ipAddress) {
      await this.handleSuspiciousActivity(session, 'IP address changed');
      return null;
    }

    // Detectar cambio de fingerprint
    if (session.fingerprint !== fingerprint) {
      await this.handleSuspiciousActivity(session, 'Browser fingerprint changed');
      return null;
    }

    // Actualizar última actividad
    session.lastActivity = new Date();
    await this.sessionsRepo.save(session);

    return session;
  }

  /**
   * Maneja actividad sospechosa
   */
  private async handleSuspiciousActivity(session: Session, reason: string): Promise<void> {
    // Revocar sesión inmediatamente
    await this.revokeSession(session.id, reason);

    // Enviar alerta de seguridad al usuario
    await this.emailService.send({
      to: session.user.email,
      subject: '🚨 Actividad Sospechosa Detectada',
      template: 'security-alert',
      context: {
        reason,
        timestamp: new Date(),
        ipAddress: session.ipAddress
      }
    });

    // Log de auditoría
    await this.auditService.log({
      userId: session.userId,
      action: 'suspicious_activity_detected',
      module: 'security',
      severity: 'critical',
      metadata: { reason, sessionId: session.id }
    });
  }

  /**
   * Revoca sesión
   */
  async revokeSession(sessionId: string, reason: string): Promise<void> {
    await this.sessionsRepo.update(sessionId, {
      isActive: false,
      revokedAt: new Date(),
      revokeReason: reason
    });
  }

  /**
   * Revoca todas las sesiones del usuario (logout en todos los dispositivos)
   */
  async revokeAllUserSessions(userId: string): Promise<void> {
    await this.sessionsRepo.update(
      { userId, isActive: true },
      {
        isActive: false,
        revokedAt: new Date(),
        revokeReason: 'User logout all devices'
      }
    );
  }

  private generateAccessToken(user: User): string {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role
      },
      {
        expiresIn: '15m'
      }
    );
  }
}
```

### security-headers.middleware.ts

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Content Security Policy
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self' https://api.example.com"
    );

    // Strict Transport Security (HSTS)
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // X-Frame-Options (prevenir clickjacking)
    res.setHeader('X-Frame-Options', 'DENY');

    // X-Content-Type-Options
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // X-XSS-Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer-Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Permissions-Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    next();
  }
}
```

### rate-limit.guard.ts

```typescript
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private redis: Redis;

  constructor(private reflector: Reflector) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT)
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = `rate-limit:${request.ip}:${request.url}`;

    // Límites por endpoint
    const limits = {
      '/auth/login': { max: 5, windowMs: 15 * 60 * 1000 }, // 5 intentos cada 15 min
      '/auth/register': { max: 3, windowMs: 60 * 60 * 1000 }, // 3 registros por hora
      default: { max: 100, windowMs: 60 * 1000 } // 100 req/min por defecto
    };

    const limit = limits[request.url] || limits.default;
    const current = await this.redis.incr(key);

    if (current === 1) {
      await this.redis.pexpire(key, limit.windowMs);
    }

    if (current > limit.max) {
      const ttl = await this.redis.pttl(key);
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          retryAfter: Math.ceil(ttl / 1000)
        },
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    return true;
  }
}
```

---

## 🎨 Frontend

### useSecureAuth.ts (Hook de autenticación)

```typescript
import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const useSecureAuth = () => {
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    // Generar fingerprint del navegador
    const initFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setFingerprint(result.visitorId);
    };

    initFingerprint();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', {
      email,
      password,
      fingerprint,
      userAgent: navigator.userAgent
    });

    // Almacenar tokens de forma segura
    sessionStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);

    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const logoutAllDevices = async () => {
    await api.post('/auth/logout-all');
    sessionStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return { login, logout, logoutAllDevices, fingerprint };
};
```

### PasswordStrengthMeter.tsx

```typescript
import React from 'react';
import { Check, X } from 'lucide-react';

interface Props {
  password: string;
}

export const PasswordStrengthMeter: React.FC<Props> = ({ password }) => {
  const checks = [
    { label: 'Al menos 12 caracteres', valid: password.length >= 12 },
    { label: 'Contiene mayúscula', valid: /[A-Z]/.test(password) },
    { label: 'Contiene minúscula', valid: /[a-z]/.test(password) },
    { label: 'Contiene número', valid: /\d/.test(password) },
    { label: 'Contiene carácter especial', valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const strength = checks.filter(c => c.valid).length;
  const strengthLabel = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte'][strength - 1];
  const strengthColor = ['red', 'orange', 'yellow', 'lime', 'green'][strength - 1];

  return (
    <div className="mt-2">
      {/* Barra de progreso */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full transition-all"
          style={{
            width: `${(strength / 5) * 100}%`,
            backgroundColor: strengthColor
          }}
        />
      </div>

      <p className="text-sm mt-1" style={{ color: strengthColor }}>
        {strengthLabel}
      </p>

      {/* Lista de requisitos */}
      <ul className="mt-2 space-y-1">
        {checks.map((check, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            {check.valid ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <X className="w-4 h-4 text-gray-400" />
            )}
            <span className={check.valid ? 'text-green-600' : 'text-gray-500'}>
              {check.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### SessionManager.tsx (Gestión de sesiones activas)

```typescript
export const SessionManager: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const response = await api.get('/auth/sessions');
    setSessions(response.data);
  };

  const handleRevoke = async (sessionId: string) => {
    await api.delete(`/auth/sessions/${sessionId}`);
    toast.success('Sesión revocada');
    fetchSessions();
  };

  const handleRevokeAll = async () => {
    if (!confirm('¿Cerrar sesión en todos los dispositivos excepto este?')) {
      return;
    }

    await api.post('/auth/logout-all-except-current');
    toast.success('Todas las sesiones cerradas');
    fetchSessions();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Sesiones Activas</h2>
        <button
          onClick={handleRevokeAll}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          Cerrar Todas
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map(session => (
          <div key={session.id} className="bg-white border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {session.isCurrent && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      Sesión actual
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>IP:</strong> {session.ipAddress}</p>
                  <p><strong>Dispositivo:</strong> {session.userAgent}</p>
                  <p><strong>Última actividad:</strong> {formatDistanceToNow(new Date(session.lastActivity))}</p>
                  <p><strong>Expira:</strong> {formatDistanceToNow(new Date(session.expiresAt))}</p>
                </div>
              </div>

              {!session.isCurrent && (
                <button
                  onClick={() => handleRevoke(session.id)}
                  className="text-red-600 hover:underline"
                >
                  Revocar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🔒 Configuración de Seguridad

### main.ts (App initialization)

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Helmet para security headers
  app.use(helmet());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  // Cookie parser
  app.use(cookieParser());

  // Validation pipe global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  // HTTPS redirect en producción
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  await app.listen(3000);
}
bootstrap();
```

### .env.example

```bash
# Master Encryption Key (generar con: openssl rand -base64 32)
MASTER_ENCRYPTION_KEY=<base64-encoded-key>

# JWT Secrets
JWT_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>

# Session
SESSION_SECRET=<random-secret>

# Redis (para rate limiting)
REDIS_HOST=localhost
REDIS_PORT=6379

# AWS KMS (opcional, para gestión de claves)
AWS_KMS_KEY_ID=<kms-key-id>
AWS_REGION=us-east-1
```

---

## ✅ Checklist de Cumplimiento

### LFPDPPP (México)

- [x] Consentimiento explícito para datos personales
- [x] Aviso de privacidad visible
- [x] Derecho ARCO implementado (Acceso, Rectificación, Cancelación, Oposición)
- [x] Encriptación de datos sensibles
- [x] Retención de datos definida
- [x] Notificación de brechas de seguridad

### GDPR (Europa)

- [x] Derecho al olvido
- [x] Portabilidad de datos
- [x] Consentimiento granular
- [x] Data Protection Officer designado
- [x] Privacy by Design
- [x] Registro de actividades de procesamiento

### ISO 27001

- [x] Gestión de accesos (RBAC)
- [x] Encriptación en tránsito y reposo
- [x] Auditoría completa
- [x] Gestión de incidentes
- [x] Backups y DR
- [x] Políticas de seguridad documentadas

---

**Generado:** 2025-11-20  
**Estado:** ✅ Completo
