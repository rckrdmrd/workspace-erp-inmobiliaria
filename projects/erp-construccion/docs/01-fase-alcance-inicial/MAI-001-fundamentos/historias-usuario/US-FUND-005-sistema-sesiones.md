# US-FUND-005: Sistema de Sesiones y Estado Global

**Epic:** MAI-001 - Fundamentos del Sistema
**Story Points:** 6
**Prioridad:** Media
**Dependencias:**
- US-FUND-001 (Autenticación JWT)
- US-FUND-004 (Infraestructura Base)

**Estado:** Pendiente
**Asignado a:** Frontend Lead + Backend Dev

---

## 📋 Historia de Usuario

**Como** usuario autenticado del sistema
**Quiero** que mi sesión se mantenga activa mientras uso la aplicación
**Para** no tener que iniciar sesión repetidamente y poder cambiar de constructora sin perder mi trabajo.

---

## 🎯 Contexto y Objetivos

### Contexto

El sistema de sesiones es crítico para la experiencia del usuario en una aplicación multi-tenant. Debe manejar:

- **Persistencia de sesión** al recargar la página
- **Refresh tokens** para renovar access tokens sin re-login
- **Estado global** (usuario, constructora activa, permisos)
- **Switch de constructora** sin pérdida de estado
- **Logout limpio** con invalidación de tokens
- **Session timeout** por inactividad

### Objetivos

1. ✅ Sesión persiste al recargar la página
2. ✅ Access token se renueva automáticamente antes de expirar
3. ✅ Usuario puede cambiar de constructora sin re-login
4. ✅ Logout invalida tokens en backend y limpia estado frontend
5. ✅ Session timeout después de 30 minutos de inactividad
6. ✅ Estado global accesible desde cualquier componente

---

## ✅ Criterios de Aceptación

### CA-1: Persistencia de Sesión

**Dado** un usuario autenticado
**Cuando** recarga la página (F5) o cierra y vuelve a abrir el navegador
**Entonces**:

- ✅ La sesión se mantiene activa
- ✅ El usuario sigue en la misma constructora
- ✅ El dashboard carga directamente (no vuelve a login)
- ✅ El estado global se restaura (nombre, rol, permisos)

**Excepciones:**
- ❌ Si el refresh token expiró, se redirige a login
- ❌ Si el usuario fue suspendido/baneado, se redirige a login con mensaje

---

### CA-2: Refresh Token Automático

**Dado** un usuario con sesión activa
**Cuando** el access token está próximo a expirar (falta < 2 minutos)
**Entonces**:

- ✅ El sistema solicita automáticamente un nuevo access token
- ✅ El refresh se realiza en background (sin interferir con la UX)
- ✅ Si el refresh es exitoso, el nuevo token se guarda
- ✅ Si el refresh falla (token inválido), se redirige a login

**Timeout:**
- Access Token: 15 minutos
- Refresh Token: 7 días

---

### CA-3: Switch de Constructora

**Dado** un usuario con acceso a múltiples constructoras
**Cuando** selecciona una constructora diferente desde el switcher
**Entonces**:

- ✅ Se solicita un nuevo JWT con el nuevo `constructoraId`
- ✅ El estado global se actualiza con la nueva constructora
- ✅ La página se recarga para aplicar el nuevo contexto RLS
- ✅ El dashboard muestra datos de la nueva constructora

---

### CA-4: Logout Completo

**Dado** un usuario autenticado
**Cuando** hace clic en "Cerrar sesión"
**Entonces**:

- ✅ Se invalida el refresh token en backend (blacklist)
- ✅ Se elimina el access token de localStorage
- ✅ Se limpia todo el estado global (Zustand stores)
- ✅ Se redirige a la página de login
- ✅ No es posible volver atrás con el botón "Back"

---

### CA-5: Session Timeout por Inactividad

**Dado** un usuario autenticado
**Cuando** está inactivo por 30 minutos (sin interacción)
**Entonces**:

- ✅ Se muestra un modal de advertencia: "Tu sesión expirará en 60 segundos"
- ✅ El usuario puede hacer clic en "Mantener sesión" para extender
- ✅ Si no responde, la sesión se cierra automáticamente
- ✅ Se redirige a login con mensaje: "Sesión cerrada por inactividad"

**Definición de actividad:**
- Clicks, tecleo, scroll, movimiento del mouse

---

### CA-6: Estado Global Reactivo

**Dado** la aplicación en ejecución
**Cuando** cualquier componente actualiza el estado global
**Entonces**:

- ✅ Todos los componentes suscritos se re-renderizan automáticamente
- ✅ Los cambios se reflejan inmediatamente en la UI
- ✅ Los cambios persisten en localStorage (si es necesario)

**Stores disponibles:**
- `useAuthStore`: usuario, token, isAuthenticated
- `useConstructoraStore`: constructora activa, lista de constructoras
- `usePermissionsStore`: permisos del usuario

---

## 🔧 Especificación Técnica Detallada

### 1. Backend - Refresh Token Endpoint

#### Refresh Token Entity

**Archivo:** `apps/backend/src/modules/auth/entities/refresh-token.entity.ts`

```typescript
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('refresh_tokens', { schema: 'auth_management' })
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'varchar', length: 500, unique: true })
  token: string;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;

  @Column({ type: 'boolean', default: false })
  isRevoked: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userAgent: string;

  @Column({ type: 'inet', nullable: true })
  ipAddress: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
```

#### Refresh Token Service

**Archivo:** `apps/backend/src/modules/auth/auth.service.ts` (método adicional)

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Genera access token y refresh token
   */
  async generateTokens(
    user: User,
    constructoraId: string,
    role: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    // Access Token (15 minutos)
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        constructoraId,
        role,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    // Refresh Token (7 días)
    const refreshTokenValue = randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const refreshToken = this.refreshTokenRepo.create({
      userId: user.id,
      token: refreshTokenValue,
      expiresAt,
      userAgent,
      ipAddress,
    });

    await this.refreshTokenRepo.save(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      expiresIn: 900, // 15 minutos en segundos
    };
  }

  /**
   * Renueva el access token usando el refresh token
   */
  async refreshAccessToken(refreshTokenValue: string, userAgent?: string) {
    // Buscar refresh token
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { token: refreshTokenValue },
      relations: ['user', 'user.constructoras'],
    });

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token inválido');
    }

    // Validar que no esté revocado
    if (refreshToken.isRevoked) {
      throw new UnauthorizedException('Refresh token revocado');
    }

    // Validar que no esté expirado
    if (new Date() > refreshToken.expiresAt) {
      throw new UnauthorizedException('Refresh token expirado');
    }

    // Validar que el user agent coincida (seguridad adicional)
    if (userAgent && refreshToken.userAgent !== userAgent) {
      throw new UnauthorizedException('Dispositivo no coincide');
    }

    // Obtener la constructora principal del usuario
    const user = refreshToken.user;
    const primaryConstructora = user.constructoras.find((uc) => uc.isPrimary);

    if (!primaryConstructora) {
      throw new UnauthorizedException('Usuario sin constructora asignada');
    }

    // Generar nuevo access token
    const accessToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        fullName: user.fullName,
        constructoraId: primaryConstructora.constructoraId,
        role: primaryConstructora.role,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: '15m',
      },
    );

    return {
      accessToken,
      expiresIn: 900,
    };
  }

  /**
   * Revoca un refresh token (logout)
   */
  async revokeRefreshToken(refreshTokenValue: string) {
    const refreshToken = await this.refreshTokenRepo.findOne({
      where: { token: refreshTokenValue },
    });

    if (refreshToken) {
      refreshToken.isRevoked = true;
      await this.refreshTokenRepo.save(refreshToken);
    }
  }

  /**
   * Revoca todos los refresh tokens de un usuario
   */
  async revokeAllUserTokens(userId: string) {
    await this.refreshTokenRepo.update(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  /**
   * Limpieza de refresh tokens expirados (ejecutar con cron)
   */
  async cleanExpiredTokens() {
    const result = await this.refreshTokenRepo
      .createQueryBuilder()
      .delete()
      .where('expiresAt < NOW()')
      .orWhere('isRevoked = true AND createdAt < NOW() - INTERVAL \'30 days\'')
      .execute();

    return { deleted: result.affected };
  }
}
```

#### Refresh Token Controller

**Archivo:** `apps/backend/src/modules/auth/auth.controller.ts` (endpoints adicionales)

```typescript
import { Controller, Post, Body, Req, Ip, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { AuthService } from './auth.service';
import { Request } from 'express';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar access token usando refresh token' })
  @ApiResponse({ status: 200, description: 'Access token renovado exitosamente' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido o expirado' })
  async refresh(
    @Body('refreshToken') refreshToken: string,
    @Req() req: Request,
    @Ip() ip: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token requerido');
    }

    const userAgent = req.headers['user-agent'];
    const tokens = await this.authService.refreshAccessToken(refreshToken, userAgent);

    return {
      statusCode: 200,
      message: 'Token renovado exitosamente',
      data: tokens,
    };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Cerrar sesión y revocar refresh token' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  async logout(@Body('refreshToken') refreshToken: string) {
    if (refreshToken) {
      await this.authService.revokeRefreshToken(refreshToken);
    }

    return {
      statusCode: 200,
      message: 'Sesión cerrada exitosamente',
    };
  }

  @Post('logout-all')
  @ApiOperation({ summary: 'Cerrar todas las sesiones del usuario' })
  @ApiResponse({ status: 200, description: 'Todas las sesiones cerradas' })
  async logoutAll(@Req() req: Request) {
    const userId = req.user['sub'];
    await this.authService.revokeAllUserTokens(userId);

    return {
      statusCode: 200,
      message: 'Todas las sesiones han sido cerradas',
    };
  }
}
```

---

### 2. Frontend - Zustand Stores

#### Auth Store

**Archivo:** `apps/frontend/src/stores/useAuthStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  email: string;
  fullName: string;
  constructoraId: string;
  role: string;
  iat: number;
  exp: number;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  constructoraId: string;
  role: string;
}

interface AuthState {
  // State
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // Actions
  setTokens: (accessToken: string, refreshToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  logout: () => void;
  getUser: () => User | null;
  isTokenExpiring: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      setTokens: (accessToken, refreshToken) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          const user: User = {
            id: decoded.sub,
            email: decoded.email,
            fullName: decoded.fullName,
            constructoraId: decoded.constructoraId,
            role: decoded.role,
          };

          set({
            accessToken,
            refreshToken,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      },

      setAccessToken: (accessToken) => {
        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          const user: User = {
            id: decoded.sub,
            email: decoded.email,
            fullName: decoded.fullName,
            constructoraId: decoded.constructoraId,
            role: decoded.role,
          };

          set({
            accessToken,
            user,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      },

      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          isAuthenticated: false,
        });
      },

      getUser: () => {
        return get().user;
      },

      isTokenExpiring: () => {
        const { accessToken } = get();
        if (!accessToken) return true;

        try {
          const decoded = jwtDecode<JwtPayload>(accessToken);
          const expiresAt = decoded.exp * 1000; // Convertir a milisegundos
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;

          // Token expira en menos de 2 minutos
          return timeUntilExpiry < 2 * 60 * 1000;
        } catch {
          return true;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Solo persistir tokens y user
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
```

---

### 3. Frontend - Token Refresh Service

#### Token Refresh Hook

**Archivo:** `apps/frontend/src/hooks/useTokenRefresh.ts`

```typescript
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiService } from '@/services/api.service';

/**
 * Hook para renovar automáticamente el access token
 * Se ejecuta cada 60 segundos y verifica si el token está próximo a expirar
 */
export function useTokenRefresh() {
  const navigate = useNavigate();
  const { isTokenExpiring, refreshToken, setAccessToken, logout } = useAuthStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);

  useEffect(() => {
    if (!refreshToken) return;

    // Revisar cada 60 segundos
    intervalRef.current = setInterval(async () => {
      if (isRefreshing.current) return;

      if (isTokenExpiring()) {
        isRefreshing.current = true;

        try {
          const response = await apiService.post<{
            accessToken: string;
            expiresIn: number;
          }>('/auth/refresh', {
            refreshToken,
          });

          setAccessToken(response.accessToken);
          console.log('✅ Access token renovado automáticamente');
        } catch (error) {
          console.error('❌ Error al renovar token:', error);
          logout();
          navigate('/login');
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
        } finally {
          isRefreshing.current = false;
        }
      }
    }, 60 * 1000); // Cada 60 segundos

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshToken, isTokenExpiring, setAccessToken, logout, navigate]);
}
```

---

### 4. Frontend - Session Timeout por Inactividad

#### Inactivity Timeout Hook

**Archivo:** `apps/frontend/src/hooks/useInactivityTimeout.ts`

```typescript
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiService } from '@/services/api.service';

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos
const WARNING_TIME = 60 * 1000; // Advertir 60 segundos antes

export function useInactivityTimeout() {
  const navigate = useNavigate();
  const { isAuthenticated, refreshToken, logout } = useAuthStore();
  const [showWarning, setShowWarning] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    // Limpiar timers existentes
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    setShowWarning(false);

    // Timer de advertencia (a los 29 minutos)
    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
    }, INACTIVITY_TIMEOUT - WARNING_TIME);

    // Timer de logout (a los 30 minutos)
    timeoutRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleLogout = async () => {
    try {
      await apiService.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      logout();
      navigate('/login');
      toast.info('Sesión cerrada por inactividad');
    }
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    resetTimer();
    toast.success('Sesión extendida');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // Eventos que reinician el timer
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    const resetTimerHandler = () => {
      if (!showWarning) {
        resetTimer();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, resetTimerHandler);
    });

    // Iniciar timer
    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimerHandler);
      });
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [isAuthenticated, showWarning]);

  return {
    showWarning,
    handleStayLoggedIn,
  };
}
```

#### Inactivity Warning Modal Component

**Archivo:** `apps/frontend/src/components/auth/InactivityWarningModal.tsx`

```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface InactivityWarningModalProps {
  isOpen: boolean;
  onStayLoggedIn: () => void;
}

export function InactivityWarningModal({
  isOpen,
  onStayLoggedIn,
}: InactivityWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Tu sesión está por expirar</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Por inactividad, tu sesión se cerrará automáticamente en{' '}
            <strong>60 segundos</strong>.
          </p>

          <p className="text-sm text-muted-foreground">
            ¿Deseas mantener tu sesión activa?
          </p>

          <div className="flex justify-end gap-2">
            <Button onClick={onStayLoggedIn}>Mantener sesión activa</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

### 5. Integration en App

#### App Component con Hooks de Sesión

**Archivo:** `apps/frontend/src/App.tsx` (actualizado)

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// Hooks de sesión
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

// Components
import { InactivityWarningModal } from '@/components/auth/InactivityWarningModal';

// ... (resto de imports)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SessionManager />

        <Routes>
          {/* ... (rutas) */}
        </Routes>

        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

function SessionManager() {
  // Token refresh automático
  useTokenRefresh();

  // Timeout por inactividad
  const { showWarning, handleStayLoggedIn } = useInactivityTimeout();

  return (
    <InactivityWarningModal isOpen={showWarning} onStayLoggedIn={handleStayLoggedIn} />
  );
}

export default App;
```

---

## 🧪 Test Cases

### TC-SESSION-001: Persistencia de Sesión

**Pre-condiciones:**
- Usuario autenticado

**Pasos:**
1. Iniciar sesión
2. Navegar a cualquier página del dashboard
3. Recargar la página (F5)

**Resultado esperado:**
- ✅ Usuario sigue autenticado
- ✅ Permanece en la misma página
- ✅ Datos del usuario visibles en header
- ✅ No se redirige a login

---

### TC-SESSION-002: Refresh Token Automático

**Pre-condiciones:**
- Usuario autenticado con access token próximo a expirar

**Pasos:**
1. Mockear fecha para simular token expirando en 1 minuto
2. Esperar a que el hook detecte expiración
3. Observar network requests

**Resultado esperado:**
- ✅ Se ejecuta POST `/api/auth/refresh` automáticamente
- ✅ Nuevo access token se guarda en localStorage
- ✅ Usuario no percibe ninguna interrupción
- ✅ Requests subsiguientes usan el nuevo token

---

### TC-SESSION-003: Logout Completo

**Pre-condiciones:**
- Usuario autenticado

**Pasos:**
1. Hacer clic en botón "Cerrar sesión"
2. Observar network y localStorage
3. Intentar navegar a ruta protegida

**Resultado esperado:**
- ✅ Se ejecuta POST `/api/auth/logout`
- ✅ localStorage vacío (tokens eliminados)
- ✅ Zustand store limpio
- ✅ Redirige a `/login`
- ✅ Intentar acceder a `/dashboard` redirige a login

---

### TC-SESSION-004: Session Timeout

**Pre-condiciones:**
- Usuario autenticado

**Pasos:**
1. No interactuar con la aplicación por 29 minutos
2. Observar el modal de advertencia
3. No hacer clic en "Mantener sesión"
4. Esperar 60 segundos

**Resultado esperado:**
- ✅ A los 29 min, aparece modal de advertencia
- ✅ A los 30 min, sesión se cierra automáticamente
- ✅ Toast muestra "Sesión cerrada por inactividad"
- ✅ Redirige a login

---

### TC-SESSION-005: Extender Sesión

**Pre-condiciones:**
- Usuario con modal de inactividad visible

**Pasos:**
1. Modal de inactividad aparece
2. Hacer clic en "Mantener sesión activa"
3. Esperar 1 minuto

**Resultado esperado:**
- ✅ Modal se cierra
- ✅ Toast muestra "Sesión extendida"
- ✅ Timer de inactividad se reinicia
- ✅ Sesión sigue activa

---

### TC-SESSION-006: Switch Constructora

**Pre-condiciones:**
- Usuario con acceso a múltiples constructoras

**Pasos:**
1. Abrir selector de constructoras
2. Seleccionar constructora diferente
3. Confirmar cambio

**Resultado esperado:**
- ✅ Se ejecuta POST `/api/auth/switch-constructora`
- ✅ Nuevo access token se guarda
- ✅ Página se recarga
- ✅ Dashboard muestra datos de nueva constructora
- ✅ Zustand store actualizado con nueva constructora

---

## 📋 Tareas de Implementación

### Backend

- [ ] **SESSION-BE-001:** Crear entity `RefreshToken`
  - Estimado: 1h

- [ ] **SESSION-BE-002:** Implementar `generateTokens()` en AuthService
  - Estimado: 1.5h

- [ ] **SESSION-BE-003:** Implementar endpoint POST `/auth/refresh`
  - Estimado: 1h

- [ ] **SESSION-BE-004:** Implementar endpoint POST `/auth/logout`
  - Estimado: 0.5h

- [ ] **SESSION-BE-005:** Implementar endpoint POST `/auth/logout-all`
  - Estimado: 0.5h

- [ ] **SESSION-BE-006:** Crear cron job para limpiar tokens expirados
  - Estimado: 1h

### Frontend

- [ ] **SESSION-FE-001:** Crear `useAuthStore` con Zustand
  - Estimado: 1.5h

- [ ] **SESSION-FE-002:** Implementar `useTokenRefresh` hook
  - Estimado: 2h

- [ ] **SESSION-FE-003:** Implementar `useInactivityTimeout` hook
  - Estimado: 2h

- [ ] **SESSION-FE-004:** Crear componente `InactivityWarningModal`
  - Estimado: 1h

- [ ] **SESSION-FE-005:** Integrar hooks en App.tsx
  - Estimado: 0.5h

- [ ] **SESSION-FE-006:** Actualizar API service para usar tokens del store
  - Estimado: 1h

- [ ] **SESSION-FE-007:** Implementar logout en todos los componentes
  - Estimado: 1h

### Testing

- [ ] **SESSION-TEST-001:** Unit tests para AuthService (backend)
  - Estimado: 2h

- [ ] **SESSION-TEST-002:** Integration tests para endpoints de sesión
  - Estimado: 2h

- [ ] **SESSION-TEST-003:** Unit tests para useAuthStore
  - Estimado: 1h

- [ ] **SESSION-TEST-004:** E2E test para flujo completo de sesión
  - Estimado: 2h

**Total estimado:** ~21 horas

---

## 🔗 Dependencias

### Depende de

- ✅ US-FUND-001 (Autenticación JWT)
- ✅ US-FUND-004 (Infraestructura Base)

### Bloqueante para

- Todas las funcionalidades que requieren estado global persistente
- Switch de constructora
- Refresh automático de datos

---

## 📊 Definición de Hecho (DoD)

- ✅ Refresh token se guarda en base de datos
- ✅ Endpoint `/auth/refresh` funcional
- ✅ Endpoint `/auth/logout` invalida tokens
- ✅ Zustand store `useAuthStore` implementado y persistente
- ✅ Token refresh automático funciona
- ✅ Timeout por inactividad funciona (30 min)
- ✅ Modal de advertencia se muestra correctamente
- ✅ Logout limpia todo el estado (backend + frontend)
- ✅ Todos los test cases (TC-SESSION-001 a TC-SESSION-006) pasan
- ✅ Documentación actualizada en Swagger
- ✅ Code coverage > 80% en funcionalidad de sesión

---

## 📝 Notas Adicionales

### Security Considerations

- ✅ Refresh tokens almacenados con hash en BD
- ✅ Refresh tokens asociados a user agent (anti-hijacking)
- ✅ Refresh tokens con expiración de 7 días
- ✅ Tokens revocados al logout
- ✅ Limpieza automática de tokens expirados

### Performance

- ✅ Token refresh en background (no bloquea UI)
- ✅ Interval check cada 60 segundos (no cada segundo)
- ✅ Zustand store optimizado (no re-renders innecesarios)

---

**Fecha de creación:** 2025-11-17
**Última actualización:** 2025-11-17
**Versión:** 1.0
