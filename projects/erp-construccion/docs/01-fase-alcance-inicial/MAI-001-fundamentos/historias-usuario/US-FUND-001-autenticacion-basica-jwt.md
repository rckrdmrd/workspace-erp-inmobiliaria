# US-FUND-001: Autenticación básica con JWT para Construcción

**Épica:** MAI-001 - Fundamentos
**Sprint:** Sprint 1 (Semanas 2-3)
**Story Points:** 8 SP
**Presupuesto:** $2,900 MXN
**Prioridad:** P0 - Crítica (Alcance Inicial)
**Estado:** 🚧 Planificado
**Reutilización GAMILIT:** 95% (adaptación mínima)

---

## 📝 Descripción

Como **cualquier usuario del sistema (director, ingeniero, residente, etc.)**, quiero poder **registrarme, iniciar sesión con selector de constructora, y recuperar mi contraseña** para **acceder de forma segura a la plataforma y mis obras asignadas**.

**Contexto del Alcance Inicial:**
En el MVP se implementó un sistema de autenticación basado en GAMILIT con JWT que soporta 7 roles fijos específicos de construcción. El sistema incluye:
- Multi-tenancy por constructora
- Selector de constructora al login
- Invitación de usuarios por constructora
- Rol por defecto: `resident`

**Diferencias vs GAMILIT:**
- GAMILIT: Auto-registro abierto → Inmobiliario: Registro por invitación
- GAMILIT: 1 organización → Inmobiliario: Múltiples constructoras
- GAMILIT: 3 roles → Inmobiliario: 7 roles

---

## ✅ Criterios de Aceptación

- [ ] **CA-01:** El sistema permite registrar nuevos usuarios por invitación (email único)
- [ ] **CA-02:** Al registrarse por invitación, el usuario recibe rol especificado en la invitación (default: `resident`)
- [ ] **CA-03:** Las contraseñas se almacenan hasheadas con bcrypt (min. 10 rounds)
- [ ] **CA-04:** El login incluye selector de constructora (si usuario pertenece a múltiples)
- [ ] **CA-05:** El login genera un JWT token válido por 24 horas
- [ ] **CA-06:** El JWT incluye: userId, role, constructoraId (activa), email
- [ ] **CA-07:** Existe endpoint de recuperación de contraseña que envía email con token temporal
- [ ] **CA-08:** El token de recuperación expira en 1 hora
- [ ] **CA-09:** El sistema permite cerrar sesión (invalidación de token en frontend)
- [ ] **CA-10:** Las contraseñas deben tener mínimo 8 caracteres (al menos 1 número)
- [ ] **CA-11:** Se retorna mensaje de error apropiado para credenciales inválidas
- [ ] **CA-12:** Usuario puede cambiar de constructora activa sin volver a loggearse

---

## 🎯 Especificaciones Técnicas

### Backend (Node.js + Express + TypeScript)

**Endpoints:**
```
POST /api/auth/register-by-invitation
- Body: { invitationToken, password, firstName, lastName }
- Response: { user, accessToken, constructora }
- Note: Valida token de invitación antes de crear usuario

POST /api/auth/login
- Body: { email, password, constructoraId? }
- Response: { user, accessToken, constructoras[] }
- Note: Si usuario tiene múltiples constructoras, retorna lista para selector

POST /api/auth/switch-constructora
- Body: { constructoraId }
- Headers: Authorization: Bearer {token}
- Response: { accessToken } (nuevo token con constructora actualizada)

POST /api/auth/forgot-password
- Body: { email }
- Response: { message: "Email sent" }

POST /api/auth/reset-password
- Body: { token, newPassword }
- Response: { message: "Password updated" }

GET /api/auth/me
- Headers: Authorization: Bearer {token}
- Response: { user, constructora, role }
```

**Servicios:**
- **AuthService:** Lógica de autenticación (register, login, validateUser)
- **JwtService:** Generación y validación de tokens JWT
- **MailService:** Envío de emails de recuperación e invitación
- **ConstructoraService:** Gestión de relación usuario-constructora

**Entidades:**
```typescript
// apps/backend/src/modules/auth/entities/user.entity.ts
@Entity('users')
class User {
  id: string (UUID)
  email: string (unique)
  password: string (hashed)
  first_name: string
  last_name: string
  is_active: boolean
  email_verified: boolean
  createdAt: Date
  updatedAt: Date
}

// apps/backend/src/modules/auth/entities/user-constructora.entity.ts
@Entity('user_constructoras')
class UserConstructora {
  id: string (UUID)
  user_id: string (FK to users)
  constructora_id: string (FK to constructoras)
  role: ConstructionRole ('director' | 'engineer' | 'resident' | 'purchases' | 'finance' | 'hr' | 'post_sales')
  is_primary: boolean (constructora por defecto)
  active: boolean
  created_at: Date
}

// apps/backend/src/modules/auth/entities/invitation.entity.ts
@Entity('invitations')
class Invitation {
  id: string (UUID)
  constructora_id: string (FK)
  email: string
  role: ConstructionRole
  token: string (unique)
  expires_at: Date
  used: boolean
  invited_by: string (FK to users)
  created_at: Date
}

// apps/backend/src/modules/auth/entities/password-reset-token.entity.ts
@Entity('password_reset_tokens')
class PasswordResetToken {
  id: string (UUID)
  userId: string (FK to users)
  token: string
  expiresAt: Date
  used: boolean
}
```

**Guards:**
- **JwtAuthGuard:** Protege rutas que requieren autenticación
- **RolesGuard:** Valida roles específicos (7 roles de construcción)
- **ConstructoraGuard:** Valida que usuario tenga acceso a la constructora

**JWT Payload:**
```typescript
interface JwtPayload {
  sub: string; // userId
  email: string;
  role: ConstructionRole;
  constructoraId: string;
  iat: number;
  exp: number;
}
```

---

### Frontend (React + Vite + TypeScript)

**Componentes:**
- `LoginForm.tsx`: Formulario de inicio de sesión con selector de constructora
- `ConstructoraSelector.tsx`: Selector de constructora (si usuario tiene múltiples)
- `RegisterByInvitationForm.tsx`: Formulario de registro por invitación
- `ForgotPasswordForm.tsx`: Solicitud de recuperación
- `ResetPasswordForm.tsx`: Establecer nueva contraseña
- `SwitchConstructoraModal.tsx`: Modal para cambiar constructora activa

**Estado (Zustand):**
```typescript
// apps/frontend/src/stores/authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  constructora: Constructora | null;
  constructoras: Constructora[];
  isAuthenticated: boolean;

  // Actions
  login: (email, password, constructoraId?) => Promise<void>;
  registerByInvitation: (token, data) => Promise<void>;
  logout: () => void;
  switchConstructora: (constructoraId) => Promise<void>;
  forgotPassword: (email) => Promise<void>;
  resetPassword: (token, newPassword) => Promise<void>;
  fetchMe: () => Promise<void>;
}
```

**Rutas:**
```typescript
// apps/frontend/src/routes/auth.routes.tsx
const authRoutes = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register/:invitationToken', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password/:token', element: <ResetPasswordPage /> },
];
```

**Almacenamiento:**
- Token JWT guardado en `localStorage` (key: 'auth_token')
- Constructora activa en `localStorage` (key: 'active_constructora')
- Auto-login si existe token válido al cargar la app

---

### Seguridad

**Passwords:**
- Hasheadas con bcrypt (10 rounds)
- Validación: min 8 caracteres, 1 número, 1 mayúscula (recomendado)
- No se almacena ni loguea password en texto plano

**JWT:**
- Firmado con secret key (desde .env: JWT_SECRET)
- Expiración: 24 horas
- Header: `Authorization: Bearer {token}`

**Tokens de recuperación:**
- Generados con crypto.randomBytes(32)
- Un solo uso (flag `used`)
- Expiración: 1 hora
- Invalidados después de uso

**Invitaciones:**
- Token único por invitación
- Expiración configurable (default: 7 días)
- Solo 1 uso
- Vinculado a email específico

**Rate Limiting:**
- Login: 5 intentos por minuto por IP
- Forgot password: 3 intentos por hora por IP
- Register: 10 por hora por IP

---

## 📋 Dependencias

**Antes:**
- Ninguna (primera historia del proyecto)
- Infraestructura base migrada de GAMILIT (Sprint 0)

**Después:**
- US-FUND-002 (Perfiles de usuario - requiere autenticación)
- US-FUND-003 (Dashboard por rol - requiere autenticación)
- US-FUND-005 (Sistema de sesiones - extiende esta funcionalidad)

---

## 📐 Definición de Hecho (DoD)

- [ ] Código implementado y revisado (code review aprobado)
- [ ] Tests unitarios para AuthService (>80% coverage)
- [ ] Tests E2E para flujos de autenticación
- [ ] Validación de seguridad (password hashing, JWT signing)
- [ ] Documentación de API en Swagger/OpenAPI
- [ ] Probado en ambiente de desarrollo
- [ ] Sin warnings de seguridad en npm audit
- [ ] Logs de auditoría configurados

---

## 🎨 Mockups/Wireframes

### Flujo de Login

```
┌────────────────────────────────────────────┐
│         Login - Sistema de Obra            │
├────────────────────────────────────────────┤
│                                            │
│  Email:                                    │
│  [____________________________________]    │
│                                            │
│  Contraseña:                               │
│  [____________________________________]    │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ [🏢] Constructora (opcional)         │ │
│  │  > ABC Constructora SA de CV         │ │
│  │    XYZ Edificaciones                 │ │
│  └──────────────────────────────────────┘ │
│                                            │
│  [ ] Recordarme                            │
│                                            │
│  [    Iniciar Sesión    ]                 │
│                                            │
│  ¿Olvidaste tu contraseña?                 │
│  ¿Tienes una invitación? Regístrate        │
│                                            │
└────────────────────────────────────────────┘
```

### Flujo de Selector de Constructora (después de login)

```
┌────────────────────────────────────────────┐
│      Selecciona tu Constructora            │
├────────────────────────────────────────────┤
│                                            │
│  Tienes acceso a múltiples constructoras.  │
│  Selecciona con cuál deseas trabajar hoy:  │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🏢 ABC Constructora SA de CV         │ │
│  │    Rol: Ingeniero                    │ │
│  │    5 obras activas                   │ │
│  │                     [Seleccionar] ───┼─┤
│  └──────────────────────────────────────┘ │
│                                            │
│  ┌──────────────────────────────────────┐ │
│  │ 🏢 XYZ Edificaciones                 │ │
│  │    Rol: Residente                    │ │
│  │    2 obras activas                   │ │
│  │                     [Seleccionar]    │ │
│  └──────────────────────────────────────┘ │
│                                            │
└────────────────────────────────────────────┘
```

---

## 🧪 Tareas de Implementación

### Backend (Estimado: 16h, GAMILIT: 17h)

**Total Backend:** ~15h (~3.75 SP) - Ahorro 2h por reutilización

- [ ] **Tarea B.1:** Migración de auth desde GAMILIT - Real: 2h
  - [x] Copiar AuthService de GAMILIT
  - [x] Copiar JwtStrategy
  - [x] Adaptar DTOs para construcción
  - [x] Configurar JwtModule

- [ ] **Tarea B.2:** Multi-tenancy y constructoras - Estimado: 4h
  - [ ] Crear ConstructoraService
  - [ ] Endpoints de gestión de constructoras
  - [ ] Relación user ← user_constructoras → constructoras
  - [ ] Selector de constructora en login

- [ ] **Tarea B.3:** Sistema de invitaciones - Estimado: 3h
  - [ ] Crear InvitationService
  - [ ] Endpoint POST /invitations/create (solo director)
  - [ ] Endpoint POST /auth/register-by-invitation
  - [ ] Envío de email con link de invitación

- [ ] **Tarea B.4:** Recuperación de contraseña - Estimado: 2h
  - [x] Migrar MailService de GAMILIT
  - [ ] POST /auth/forgot-password
  - [ ] POST /auth/reset-password
  - [ ] Templates de email

- [ ] **Tarea B.5:** Endpoints adicionales - Estimado: 2h
  - [ ] POST /auth/switch-constructora
  - [ ] GET /auth/me (con constructora activa)
  - [ ] Logs de auditoría para cambios de constructora

- [ ] **Tarea B.6:** Documentación Swagger - Estimado: 2h
  - [ ] Documentar todos los endpoints de auth
  - [ ] Ejemplos de request/response
  - [ ] Schemas de validación

---

### Frontend (Estimado: 8h, GAMILIT: 9h)

**Total Frontend:** ~7h (~1.75 SP) - Ahorro 2h

- [ ] **Tarea F.1:** Migración de componentes auth - Real: 2h
  - [x] Copiar LoginForm de GAMILIT
  - [x] Copiar RegisterForm
  - [x] Copiar ForgotPasswordForm
  - [x] Copiar ResetPasswordForm

- [ ] **Tarea F.2:** Selector de constructora - Estimado: 3h
  - [ ] Componente ConstructoraSelector
  - [ ] Modal de selección post-login
  - [ ] Switcher en navbar (cambiar constructora activa)
  - [ ] Persistir selección en localStorage

- [ ] **Tarea F.3:** Registro por invitación - Estimado: 2h
  - [ ] Página /register/:invitationToken
  - [ ] Validación de token
  - [ ] Formulario de registro con datos de invitación

- [ ] **Tarea F.4:** AuthStore con Zustand - Real: 0h (migrado)
  - [x] Copiar authStore de GAMILIT
  - [ ] Agregar: constructora, constructoras, switchConstructora
  - [ ] Hook useAuth

---

### Testing (Estimado: 6h, GAMILIT: 5.5h)

**Total Testing:** ~6h (~1.5 SP) - Similar a GAMILIT

- [ ] **Tarea T.1:** Tests unitarios backend - Estimado: 3h
  - [ ] Tests de AuthService (login, register, JWT)
  - [ ] Tests de ConstructoraService
  - [ ] Tests de InvitationService
  - [ ] Tests de guards (JwtAuthGuard, ConstructoraGuard)

- [ ] **Tarea T.2:** Tests E2E - Estimado: 2h
  - [ ] Login con constructora única
  - [ ] Login con múltiples constructoras
  - [ ] Registro por invitación
  - [ ] Recuperación de contraseña
  - [ ] Cambio de constructora activa

- [ ] **Tarea T.3:** Tests frontend - Estimado: 1h
  - [ ] Tests de componentes de formularios
  - [ ] Tests de AuthStore

---

### Deployment (Estimado: 2h, GAMILIT: 2h)

**Total Deployment:** ~2h (~0.5 SP) - Similar

- [ ] **Tarea D.1:** Variables de entorno - Estimado: 1h
  - [ ] JWT_SECRET configurado
  - [ ] SMTP configurado (envío de emails)
  - [ ] Frontend: API_URL configurado

- [ ] **Tarea D.2:** Deploy y validación - Estimado: 1h
  - [ ] Deploy a staging
  - [ ] Smoke tests de autenticación
  - [ ] Validación de seguridad (bcrypt, JWT)

---

## 📊 Resumen de Horas

| Categoría | Estimado | Real | Varianza | Ahorro vs GAMILIT |
|-----------|----------|------|----------|-------------------|
| Backend | 15h | TBD | - | -2h (13%) |
| Frontend | 7h | TBD | - | -2h (22%) |
| Testing | 6h | TBD | - | +0.5h (0%) |
| Deployment | 2h | TBD | - | 0h (0%) |
| **TOTAL** | **30h** | **TBD** | **-** | **-3.5h (~12%)** |

**Validación:** 8 SP × 4h/SP = 32 horas estimadas (vs 30h optimizado) ✅

**Ahorro total:** ~3.5 horas gracias a reutilización de GAMILIT

---

## 📅 Cronograma Real

**Sprint:** Sprint 1 (Semanas 2-3)
**Fecha Inicio:** TBD
**Fecha Fin:** TBD
**Estado:** 🚧 Planificado

**Notas:**
- Multi-tenancy es la diferencia principal vs GAMILIT
- Selector de constructora requiere UX cuidadosa
- Invitaciones reemplazan auto-registro abierto

---

## 🧪 Testing

### Tests Unitarios (Backend)
```typescript
describe('AuthService', () => {
  it('should hash password on register by invitation', async () => {
    const invitation = await createInvitation({ email: 'test@obra.com', role: 'resident' });
    const result = await authService.registerByInvitation(invitation.token, {
      password: 'SecurePass123',
      firstName: 'Juan',
      lastName: 'Pérez'
    });

    expect(result.user.password).not.toBe('SecurePass123');
    expect(await bcrypt.compare('SecurePass123', result.user.password)).toBe(true);
  });

  it('should generate JWT with constructora on login', async () => {
    const user = await createUser({ email: 'test@obra.com' });
    const constructora = await assignUserToConstructora(user.id, { role: 'engineer' });

    const result = await authService.login('test@obra.com', 'password', constructora.id);
    const decoded = jwt.verify(result.accessToken, process.env.JWT_SECRET);

    expect(decoded.constructoraId).toBe(constructora.id);
    expect(decoded.role).toBe('engineer');
  });

  it('should allow switching constructora', async () => {
    const user = await createUser();
    await assignUserToConstructora(user.id, { constructoraId: 'A', role: 'engineer' });
    await assignUserToConstructora(user.id, { constructoraId: 'B', role: 'resident' });

    const newToken = await authService.switchConstructora(user.id, 'B');
    const decoded = jwt.verify(newToken, process.env.JWT_SECRET);

    expect(decoded.constructoraId).toBe('B');
    expect(decoded.role).toBe('resident');
  });
});
```

### Tests E2E
```typescript
describe('Auth API E2E', () => {
  it('POST /auth/login - success with constructora selector', async () => {
    const user = await createUser({ email: 'multi@obra.com' });
    await assignUserToConstructora(user.id, { constructoraId: 'A' });
    await assignUserToConstructora(user.id, { constructoraId: 'B' });

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'multi@obra.com', password: 'password' });

    expect(response.status).toBe(200);
    expect(response.body.constructoras).toHaveLength(2);
    expect(response.body.accessToken).toBeDefined();
  });

  it('POST /auth/register-by-invitation - success', async () => {
    const invitation = await createInvitation({ email: 'new@obra.com', role: 'resident' });

    const response = await request(app)
      .post('/api/auth/register-by-invitation')
      .send({
        invitationToken: invitation.token,
        password: 'SecurePass123',
        firstName: 'Juan',
        lastName: 'Pérez'
      });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('new@obra.com');
    expect(response.body.accessToken).toBeDefined();
  });
});
```

---

## 🎯 Estimación

**Desglose de Esfuerzo (8 SP = ~3-4 días):**
- Backend: multi-tenancy y invitaciones: 1.5 días
- Frontend: selector de constructora: 1 día
- Testing: 0.75 días
- Ajustes y documentación: 0.75 días

**Riesgos:**
- Selector de constructora puede requerir iteraciones de UX
- Multi-tenancy en RLS requiere validaciones exhaustivas

**Mitigaciones:**
- Mockups de selector antes de implementar
- Tests E2E de multi-tenancy desde día 1

---

**Creado:** 2025-11-17
**Actualizado:** 2025-11-17
**Responsable:** Equipo Backend + Frontend
**Sprint:** Sprint 1 (Semanas 2-3)
**Épica:** MAI-001 - Fundamentos
