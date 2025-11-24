# RF-AUTH-002: Estados de Cuenta de Usuario

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RF-AUTH-002 |
| **Épica** | MAI-001 - Fundamentos |
| **Módulo** | Autenticación y Autorización |
| **Prioridad** | Alta |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |
| **Esfuerzo estimado** | 12h (vs 15h GAMILIT - 20% ahorro por reutilización) |
| **Story Points** | 5 SP |

## 🔗 Referencias

### Especificación Técnica
📐 [ET-AUTH-002: Gestión de Estados de Cuenta](../especificaciones/ET-AUTH-002-estados-cuenta.md) *(Pendiente)*

### Origen (GAMILIT)
♻️ **Reutilización:** 85%
- **Documento base:** `/workspace-gamilit/gamilit/projects/gamilit/docs/01-fase-alcance-inicial/EAI-001-fundamentos/requerimientos/RF-AUTH-002-estados-cuenta.md`
- **Diferencias clave:**
  - Estados adaptados a contexto de construcción
  - Casos de uso específicos para roles de obra
  - Integración con sistema de constructoras

### Implementación DDL
🗄️ **ENUM Canónico:**
```sql
-- Location: apps/database/ddl/00-prerequisites.sql
CREATE TYPE auth_management.user_status AS ENUM (
  'active',       -- Usuario verificado, acceso completo
  'inactive',     -- Usuario desactivó su cuenta temporalmente
  'suspended',    -- Admin suspendió cuenta (reversible)
  'banned',       -- Admin baneó cuenta (permanente)
  'pending'       -- Email no verificado
);
```

🗄️ **Tablas que usan el ENUM:**
1. `auth_management.profiles`
   - Columna: `status auth_management.user_status NOT NULL DEFAULT 'pending'`

2. `auth_management.user_constructoras`
   - Columna: `status auth_management.user_status NOT NULL DEFAULT 'active'`
   - **Nota:** Permite diferentes estados por constructora

🗄️ **Funciones:**
```sql
-- Validar estado del usuario
CREATE FUNCTION auth_management.verify_user_status(
  p_user_id UUID,
  p_constructora_id UUID
) RETURNS BOOLEAN;

-- Suspender usuario
CREATE FUNCTION auth_management.suspend_user(
  p_user_id UUID,
  p_reason TEXT,
  p_duration_days INTEGER,
  p_suspended_by UUID
) RETURNS VOID;

-- Banear usuario permanentemente
CREATE FUNCTION auth_management.ban_user(
  p_user_id UUID,
  p_reason TEXT,
  p_banned_by UUID
) RETURNS VOID;

-- Reactivar usuario (desde inactive o suspended)
CREATE FUNCTION auth_management.reactivate_user(
  p_user_id UUID,
  p_reactivated_by UUID
) RETURNS VOID;
```

🗄️ **Triggers:**
```sql
-- Auditar cambios de estado
CREATE TRIGGER trg_profiles_status_change
    AFTER UPDATE OF status ON auth_management.profiles
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION audit_logging.log_status_change();
```

### Backend
💻 **Implementación:**
- **Enum:** `apps/backend/src/modules/auth/enums/user-status.enum.ts`
```typescript
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING = 'pending',
}
```

- **Middleware:** `apps/backend/src/modules/auth/middleware/user-status.middleware.ts`
- **Service:** `apps/backend/src/modules/auth/services/user-management.service.ts`
- **DTOs:**
  - `apps/backend/src/modules/auth/dto/update-user-status.dto.ts`
  - `apps/backend/src/modules/auth/dto/suspend-user.dto.ts`

### Frontend
🎨 **Componentes:**
- **Types:** `apps/frontend/src/types/auth.types.ts`
```typescript
interface UserProfile {
  id: string;
  email: string;
  status: UserStatus;
  role: ConstructionRole;
  constructoraId: string;
  // ...otros campos
}
```

- **Componentes:**
  - `apps/frontend/src/components/ui/UserStatusBadge.tsx` - Badge visual del estado
  - `apps/frontend/src/features/admin/UserManagementPanel.tsx` - Panel de gestión
  - `apps/frontend/src/features/admin/SuspendUserModal.tsx` - Modal para suspender
  - `apps/frontend/src/features/auth/AccountStatusPage.tsx` - Página de estado de cuenta

### Trazabilidad
📊 [TRACEABILITY.yml](../implementacion/TRACEABILITY.yml#L45-L78)

---

## 📝 Descripción del Requerimiento

### Contexto

En un sistema de gestión de obra, las cuentas de usuario requieren un control riguroso del ciclo de vida completo:

- **Verificación inicial:** Usuario invitado debe verificar su email antes de acceder
- **Seguridad:** Suspender cuentas comprometidas o con comportamiento inadecuado
- **Compliance:** Dar de baja usuarios que ya no trabajan en la constructora
- **Flexibilidad:** Permitir desactivación temporal voluntaria
- **Multi-tenancy:** Un usuario puede tener diferentes estados en diferentes constructoras

### Necesidad del Negocio

**Problema:**
Sin un sistema de estados bien definido:
- ❌ No se puede verificar email antes de dar acceso a datos sensibles de obra
- ❌ No hay forma de suspender temporalmente usuarios problemáticos
- ❌ No se puede diferenciar entre baja temporal (inactivo) y baja permanente (baneado)
- ❌ Empleados que ya no trabajan siguen teniendo acceso a información confidencial
- ❌ No hay auditoría de cambios de estado

**Solución:**
Implementar un sistema de 5 estados que modela el ciclo de vida completo, con transiciones controladas, auditadas y específicas para construcción.

---

## 🎯 Requerimiento Funcional

### RF-AUTH-002.1: Estados Disponibles

El sistema **DEBE** soportar exactamente 5 estados de cuenta:

#### 1. Pendiente (`pending`)
**Descripción:** Cuenta recién creada por invitación, email no verificado

**Características:**
- Estado inicial al ser invitado a una constructora
- Usuario no puede acceder al sistema
- Se envía email de verificación automáticamente
- ⏱️ **Expira después de 7 días** si no se verifica
- 🔒 No tiene acceso a datos de obra

**Acceso Permitido:**
- ❌ Dashboard
- ❌ Proyectos/Obras
- ❌ Módulos del sistema
- ✅ Página de verificación de email
- ✅ Reenviar email de verificación

**Transiciones:**
- → `active`: Al verificar email exitosamente
- → ∅ (eliminación automática): Después de 7 días sin verificar

**Caso de Uso Típico:**
> Residente de Obra es invitado por el Director. Recibe email, tiene 7 días para verificar antes de que la invitación expire.

---

#### 2. Activo (`active`)
**Descripción:** Cuenta verificada, acceso completo según rol asignado

**Características:**
- ✅ Email verificado exitosamente
- ✅ Acceso completo según rol (director, engineer, resident, etc.)
- ✅ Puede usar app móvil de asistencias
- ✅ Recibe notificaciones del sistema
- ✅ Aparece en búsquedas de usuarios

**Acceso Permitido:**
- ✅ Todo el sistema según permisos de rol
- ✅ Dashboard personalizado por rol
- ✅ Módulos asignados (proyectos, presupuestos, RRHH, etc.)
- ✅ App móvil (si tiene rol de resident o hr)

**Transiciones:**
- → `inactive`: Usuario desactiva su propia cuenta
- → `suspended`: Admin suspende la cuenta (reversible)
- → `banned`: Admin banea la cuenta (irreversible)

**Caso de Uso Típico:**
> Ingeniero accede diariamente para revisar presupuestos, actualizar programación y aprobar requisiciones.

---

#### 3. Inactivo (`inactive`)
**Descripción:** Usuario desactivó temporalmente su cuenta (voluntario)

**Características:**
- 🔵 Desactivación **voluntaria** por el usuario
- 💾 Datos conservados intactos
- 🔄 **Reversible** por el propio usuario en cualquier momento
- 📧 No recibe notificaciones
- 🚫 No aparece en búsquedas de usuarios

**Acceso Permitido:**
- ❌ Dashboard y funcionalidades principales
- ❌ Módulos del sistema
- ✅ Página de reactivación de cuenta
- ✅ Descargar datos personales (GDPR compliance)

**Transiciones:**
- → `active`: Usuario reactiva su cuenta (máximo 3 veces por día)
- → ∅ (eliminación voluntaria): Usuario solicita eliminación de cuenta

**Caso de Uso Típico:**
> Residente que toma vacaciones de 2 semanas desactiva temporalmente su cuenta para no recibir notificaciones.

**Rate Limiting:**
- Máximo **3 reactivaciones por día** (prevenir abuso)

---

#### 4. Suspendido (`suspended`)
**Descripción:** Admin suspendió la cuenta (reversible)

**Características:**
- 🔴 Suspensión por admin debido a comportamiento inapropiado
- 🔄 **REVERSIBLE** (diferencia clave con `banned`)
- 📝 Requiere **razón documentada** obligatoria
- 🔍 Requiere revisión de admin para levantar suspensión
- 📬 Usuario recibe notificación con razón de suspensión

**Acceso Permitido:**
- ❌ Todo el sistema (bloqueado completamente)
- ✅ Ver notificación de suspensión con razón
- ✅ Contactar soporte

**Restricciones:**
- 🚫 No puede iniciar sesión
- 📧 No recibe notificaciones del sistema
- 🔍 No aparece en búsquedas de usuarios
- 📱 App móvil bloqueada

**Transiciones:**
- → `active`: Admin levanta suspensión después de revisión
- → `banned`: Admin decide hacer baneo permanente

**Duración:**
- Típicamente: **7-30 días**
- Requiere revisión periódica por directores/admins

**Razones Comunes (Construcción):**
- Registro de asistencia fraudulento (check-in sin estar en obra)
- Captura incorrecta de avances de obra
- Modificación no autorizada de presupuestos
- Comportamiento inapropiado en obra

**Caso de Uso Típico:**
> Residente registró asistencias falsas de empleados. Director lo suspende 14 días mientras investiga.

---

#### 5. Baneado (`banned`)
**Descripción:** Admin baneó la cuenta **permanentemente** (irreversible)

**Características:**
- 🔴 Baneo por violación **grave** de términos
- ❌ **IRREVERSIBLE** (no hay transición de vuelta)
- 📧 Email y username quedan **bloqueados permanentemente**
- 💾 Datos se conservan por auditoría pero cuenta **inaccesible**
- 📝 Requiere razón grave documentada

**Acceso Permitido:**
- ❌ Todo el sistema
- ✅ Ver notificación de baneo con razón

**Restricciones:**
- 🚫 No puede iniciar sesión
- 🚫 No puede crear nueva cuenta con mismo email
- 🚫 Username queda reservado permanentemente
- 🚫 No puede ser invitado nuevamente a ninguna constructora

**Razones Comunes (Construcción):**
- Fraude financiero (apropiación indebida de recursos)
- Robo de información confidencial de la constructora
- Suplantación de identidad (firmar como otro usuario)
- Alteración de documentos oficiales (contratos, presupuestos)
- Actividad criminal relacionada con la obra

**Caso de Uso Típico:**
> Empleado de compras desvió recursos, realizó órdenes de compra falsas. Director lo banea permanentemente y procede legalmente.

---

### RF-AUTH-002.2: Flujo de Estados

```
┌──────────────────────┐
│   INVITACIÓN A       │
│   CONSTRUCTORA       │
└──────────┬───────────┘
           │
           ▼
       pending ──────(verificar email)─────> active
           │                                   │
           │                                   ├──(usuario desactiva)──> inactive
           │                                   │                            │
           │                                   │                            └──(reactiva)──> active
           │                                   │
           │                                   ├──(admin suspende)──> suspended
           │                                   │                         │
           │                                   │                         ├──(admin levanta)──> active
           │                                   │                         └──(admin decide)──> banned
           │                                   │
           └────(7 días)───> ∅                 └──(admin banea)──> banned
            (eliminación)                                              │
                                                                      └──(permanente)──> ∅
```

**Leyenda:**
- ∅ = Registro eliminado/cuenta no recuperable
- Flechas sólidas = Transiciones permitidas
- Flechas punteadas = Eliminación automática

---

### RF-AUTH-002.3: Reglas de Transición

#### Transiciones Permitidas

| Estado Actual | Puede Transicionar A | Quién Puede Hacerlo | Requiere |
|---------------|---------------------|---------------------|----------|
| `pending` | `active` | Usuario | Verificar email (click en link) |
| `pending` | ∅ (eliminación) | Sistema | 7 días sin verificar |
| `active` | `inactive` | Usuario | Confirmación + password |
| `active` | `suspended` | director, super_admin | Razón documentada obligatoria |
| `active` | `banned` | director, super_admin | Razón grave documentada + evidencia |
| `inactive` | `active` | Usuario | Click en reactivar (máx 3/día) |
| `suspended` | `active` | director, super_admin | Revisión completada + justificación |
| `suspended` | `banned` | director, super_admin | Decisión justificada + evidencia |
| `banned` | ∅ | N/A | **Irreversible** |

#### Transiciones Prohibidas

| Transición | Razón |
|------------|-------|
| ❌ `pending` → `suspended` | No tiene sentido suspender cuenta no verificada (simplemente eliminar invitación) |
| ❌ `pending` → `banned` | No tiene sentido banear cuenta no verificada |
| ❌ `inactive` → `suspended` | Usuario ya desactivó voluntariamente, no hay necesidad de suspender |
| ❌ `inactive` → `banned` | Si se requiere baneo, reactivar primero y luego banear desde `active` |
| ❌ `suspended` → `inactive` | Confusión de estados (uno es admin-driven, otro user-driven) |
| ❌ `banned` → cualquier otro | **Irreversible por diseño** |

---

### RF-AUTH-002.4: Validación de Estado en Sistema Multi-tenancy

**Importante:** En este sistema, un usuario puede pertenecer a **múltiples constructoras** con diferentes estados en cada una.

#### Escenario Multi-tenancy
```typescript
// Usuario puede tener diferentes estados en diferentes constructoras
const userConstructoras = [
  { constructoraId: 'A', status: 'active',    role: 'director' },
  { constructoraId: 'B', status: 'suspended', role: 'engineer' },
  { constructoraId: 'C', status: 'active',    role: 'resident' },
];

// Al hacer login, usuario ve solo constructoras donde status = 'active'
const availableConstructoras = userConstructoras.filter(
  uc => uc.status === 'active'
); // ['A', 'C']
```

#### 1. Validación en Login
```typescript
// POST /api/auth/login
// Retorna solo constructoras donde user.status = 'active'

async login(email: string, password: string) {
  const user = await this.findByEmail(email);

  // Validar estado global del perfil
  if (user.profile.status === 'banned') {
    throw new UnauthorizedException(
      'Tu cuenta ha sido baneada permanentemente. Contacta soporte para más información.'
    );
  }

  if (user.profile.status === 'pending') {
    throw new UnauthorizedException(
      'Debes verificar tu email antes de acceder. Revisa tu bandeja de entrada.'
    );
  }

  // Obtener constructoras donde el usuario está activo
  const activeConstructoras = await this.getActiveConstructoras(user.id);

  if (activeConstructoras.length === 0) {
    throw new UnauthorizedException(
      'No tienes acceso activo a ninguna constructora. Contacta al administrador.'
    );
  }

  return {
    user: user,
    accessToken: this.generateToken(user, activeConstructoras[0]),
    constructoras: activeConstructoras, // Usuario puede elegir
  };
}
```

#### 2. Middleware en Cada Request
```typescript
// UserStatusMiddleware valida en CADA request autenticado
@Injectable()
export class UserStatusMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const user = req.user; // Incluye constructoraId del JWT

    // Excepciones: endpoints de reactivación y cambio de constructora
    const allowedPaths = [
      '/auth/reactivate',
      '/auth/status',
      '/auth/switch-constructora',
    ];
    if (allowedPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Validar estado global
    if (user.profileStatus === 'banned') {
      throw new ForbiddenException('Cuenta baneada permanentemente.');
    }

    if (user.profileStatus === 'pending') {
      throw new ForbiddenException('Email no verificado.');
    }

    // Validar estado en constructora actual
    if (user.constructoraStatus !== 'active') {
      throw new ForbiddenException(
        `Tu acceso a esta constructora está ${user.constructoraStatus}. ` +
        `Contacta al administrador o cambia a otra constructora.`
      );
    }

    next();
  }
}
```

#### 3. Frontend - Validación Temprana
```typescript
// Redirigir según estado
useEffect(() => {
  if (!user) return;

  // Estado global del perfil
  if (user.profile.status === 'pending') {
    navigate('/verify-email');
    return;
  }

  if (user.profile.status === 'banned') {
    navigate('/account-banned');
    return;
  }

  // Estado en constructora actual
  const currentConstructora = user.constructoras.find(
    c => c.id === user.currentConstructoraId
  );

  if (!currentConstructora) {
    navigate('/select-constructora');
    return;
  }

  if (currentConstructora.status === 'suspended') {
    navigate('/account-suspended-in-constructora');
    return;
  }

  if (currentConstructora.status === 'inactive') {
    navigate('/reactivate-account');
    return;
  }

  // Estado activo, continuar
}, [user, navigate]);
```

---

## 📊 Casos de Uso

### UC-AUTH-003: Usuario verifica email tras invitación
**Actor:** Residente de Obra (nuevo usuario)
**Precondiciones:**
- Usuario invitado a constructora por Director
- Email de invitación enviado
- `profiles.status` = `pending`

**Flujo Principal:**
1. Usuario recibe email de invitación a constructora "Constructora ABC"
2. Usuario hace click en link de verificación
3. Sistema valida token de verificación (válido por 24h)
4. Sistema actualiza `profiles.status` de `pending` → `active`
5. Sistema actualiza `user_constructoras.status` de `pending` → `active`
6. Sistema audita cambio en `audit_logs`:
   ```json
   {
     "action": "update",
     "resource_type": "user_status",
     "resource_id": "user_id",
     "details": {
       "old_status": "pending",
       "new_status": "active",
       "constructora_id": "abc-123",
       "verified_at": "2025-11-17T10:30:00Z"
     }
   }
   ```
7. Sistema envía email de bienvenida con instrucciones
8. Usuario redirigido a `/auth/login`
9. Usuario hace login y selecciona constructora "Constructora ABC"
10. Usuario accede a dashboard según su rol (resident)

**Resultado:** Usuario con status `active` puede acceder al sistema

**Variantes:**
- **V1: Token expirado (>24h):**
  1. Sistema detecta token expirado
  2. Sistema muestra mensaje: "Link expirado"
  3. Sistema ofrece botón "Reenviar email de verificación"
  4. Usuario hace click
  5. Sistema envía nuevo email con nuevo token
  6. Volver a flujo principal paso 2

- **V2: Token inválido:**
  1. Sistema detecta token inválido
  2. Sistema muestra error: "Link inválido"
  3. Sistema ofrece contactar soporte
  4. Sistema audita intento de verificación inválido

- **V3: Usuario ya verificado:**
  1. Sistema detecta que `status` ya es `active`
  2. Sistema muestra: "Ya has verificado tu email"
  3. Sistema redirige a login

---

### UC-ADMIN-002: Director suspende cuenta de Residente
**Actor:** Director de Construcción
**Precondiciones:**
- Usuario con rol `director`
- Residente con status `active`
- Comportamiento inapropiado detectado (ej: asistencias falsas)

**Flujo Principal:**
1. Director navega a **Panel de Gestión de Usuarios** (`/admin/users`)
2. Director filtra usuarios por constructora actual
3. Director busca residente por nombre: "Juan Pérez"
4. Director hace click en botón "Acciones" → "Suspender cuenta"
5. Sistema muestra **Modal de Suspensión** con formulario:
   - **Razón** (textarea obligatorio, min 20 caracteres)
   - **Duración sugerida** (select: 7 días, 14 días, 30 días, Indefinido)
   - **Evidencia** (opcional: subir screenshots, documentos)
   - **Fecha de revisión** (automática según duración)
6. Director completa formulario:
   - Razón: "Registró asistencias de empleados que no estaban en obra según GPS"
   - Duración: 14 días
   - Evidencia: Sube screenshots de GPS
7. Director hace click en "Confirmar Suspensión"
8. Sistema valida:
   - Razón tiene mínimo 20 caracteres ✅
   - Usuario tiene permisos (rol = director) ✅
   - Usuario a suspender no es director ✅ (no puede suspender otro director)
9. Sistema ejecuta transacción:
   ```sql
   BEGIN;

   -- Actualizar estado
   UPDATE auth_management.user_constructoras
   SET status = 'suspended',
       suspended_at = NOW(),
       suspended_by = :director_id,
       suspended_reason = :reason,
       suspended_until = NOW() + INTERVAL '14 days'
   WHERE user_id = :resident_id
     AND constructora_id = :constructora_id;

   -- Auditar
   INSERT INTO audit_logging.audit_logs (
     action, resource_type, resource_id, performed_by, details
   ) VALUES (
     'update', 'user_status', :resident_id, :director_id,
     jsonb_build_object(
       'old_status', 'active',
       'new_status', 'suspended',
       'reason', :reason,
       'evidence_urls', :evidence_urls,
       'suspended_by_name', 'Director López',
       'review_date', NOW() + INTERVAL '14 days',
       'constructora_id', :constructora_id
     )
   );

   COMMIT;
   ```
10. Sistema cierra todas las sesiones activas del residente en esa constructora
11. Sistema envía **Notificación Push + Email** al residente:
    ```
    Asunto: Tu cuenta ha sido suspendida temporalmente

    Hola Juan,

    Tu cuenta en Constructora ABC ha sido suspendida por 14 días.

    Razón: Registró asistencias de empleados que no estaban en obra según GPS

    Fecha de revisión: 2025-12-01

    Si crees que esto es un error, puedes contactar a soporte en soporte@constructora.com

    ---
    Sistema de Gestión de Obra
    ```
12. Sistema registra en timeline del usuario el evento de suspensión
13. Sistema muestra confirmación al director: "Usuario suspendido exitosamente"

**Resultado:**
- Residente no puede acceder a esa constructora por 14 días
- Director puede revisar suspensión antes de la fecha
- Suspensión queda auditada con evidencia

**Variantes:**
- **V1: Director intenta suspender otro director:**
  - Sistema lanza error: "No puedes suspender a otro director"
  - Solo super_admin puede suspender directores

- **V2: Residente ya está suspendido:**
  - Sistema detecta status = 'suspended'
  - Sistema muestra opciones:
    - Levantar suspensión
    - Extender suspensión
    - Convertir en baneo

**Postcondiciones:**
- `user_constructoras.status` = 'suspended'
- Registro en `audit_logs`
- Email enviado
- Sesiones cerradas

---

### UC-AUTH-004: Usuario desactiva su propia cuenta
**Actor:** Ingeniero
**Precondiciones:** Usuario con status `active`

**Flujo Principal:**
1. Ingeniero navega a **Configuración** → **Mi Cuenta** (`/settings/account`)
2. Ingeniero hace scroll hasta sección "Zona Peligrosa"
3. Ingeniero hace click en botón "Desactivar mi cuenta"
4. Sistema muestra **Modal de Confirmación** con:
   - **Título:** "¿Estás seguro que quieres desactivar tu cuenta?"
   - **Explicación:**
     - ✅ Esta acción es temporal
     - ✅ Tus datos NO se eliminarán
     - ✅ Puedes reactivar en cualquier momento
     - ⚠️ No recibirás notificaciones mientras esté desactivada
     - ⚠️ No aparecerás en búsquedas de usuarios
   - **Campo:** Contraseña (requerido para confirmar)
5. Ingeniero ingresa su contraseña
6. Ingeniero hace click en "Confirmar Desactivación"
7. Sistema valida contraseña ✅
8. Sistema actualiza `profiles.status` de `active` → `inactive`
9. Sistema audita cambio:
   ```json
   {
     "action": "update",
     "resource_type": "user_status",
     "resource_id": "user_id",
     "details": {
       "old_status": "active",
       "new_status": "inactive",
       "deactivated_by": "self",
       "reason": "voluntary_deactivation",
       "deactivated_at": "2025-11-17T15:45:00Z"
     }
   }
   ```
10. Sistema envía email de confirmación:
    ```
    Asunto: Cuenta desactivada temporalmente

    Hola,

    Tu cuenta ha sido desactivada exitosamente.

    Para reactivarla, simplemente haz login de nuevo en:
    https://app.constructora.com/auth/login

    Y haz click en "Reactivar cuenta".

    ---
    Sistema de Gestión de Obra
    ```
11. Sistema cierra sesión del usuario (`logout`)
12. Usuario redirigido a página de login con mensaje:
    > "Tu cuenta ha sido desactivada. Puedes reactivarla en cualquier momento haciendo login."

**Resultado:** Cuenta desactivada temporalmente, usuario puede reactivar cuando quiera

**Reactivación (Flujo Secundario):**
1. Usuario navega a `/auth/login`
2. Usuario ingresa email + password
3. Sistema detecta `status` = `inactive`
4. Sistema muestra página de reactivación con:
   - Mensaje: "Tu cuenta está desactivada temporalmente"
   - Botón grande: "Reactivar mi cuenta"
5. Usuario hace click en "Reactivar mi cuenta"
6. Sistema valida rate limiting (máximo 3 reactivaciones por día)
7. Sistema actualiza `status` de `inactive` → `active`
8. Sistema audita reactivación
9. Sistema muestra: "Cuenta reactivada exitosamente"
10. Usuario redirigido a dashboard

**Postcondiciones:**
- `profiles.status` = 'inactive'
- Email enviado
- Sesión cerrada

---

### UC-ADMIN-003: Director banea cuenta permanentemente
**Actor:** Director
**Precondiciones:**
- Usuario con rol `director`
- Empleado de compras con status `active` o `suspended`
- Violación grave detectada (fraude)

**Flujo Principal:**
1. Director detecta fraude: Empleado de compras creó órdenes de compra falsas por $500,000 MXN
2. Director navega a **Panel de Gestión de Usuarios** → Usuario "Carlos Ramírez"
3. Director hace click en "Acciones" → "Banear cuenta permanentemente"
4. Sistema muestra **Modal de Baneo** con advertencia:
   ```
   ⚠️ ADVERTENCIA: Esta acción es IRREVERSIBLE

   El usuario NO podrá:
   - Acceder al sistema nunca más
   - Crear nueva cuenta con este email
   - Ser invitado a ninguna constructora

   Esta acción debe reservarse para violaciones GRAVES:
   - Fraude financiero
   - Robo de información
   - Actividad criminal

   ¿Estás completamente seguro?
   ```
5. Sistema requiere:
   - **Razón grave** (textarea obligatorio, min 50 caracteres)
   - **Evidencia** (obligatorio: mínimo 1 archivo)
   - **Confirmación:** Usuario debe escribir "BANEAR PERMANENTEMENTE"
6. Director completa:
   - Razón: "Empleado creó órdenes de compra falsas por $500,000 MXN a proveedores ficticios. Se detectó desvío de recursos. Se procederá legalmente."
   - Evidencia: Sube PDFs de órdenes falsas, capturas de pantalla, reporte de auditoría
   - Confirmación: Escribe "BANEAR PERMANENTEMENTE"
7. Director hace click en "Confirmar Baneo"
8. Sistema ejecuta:
   ```sql
   BEGIN;

   -- Banear en todas las constructoras
   UPDATE auth_management.profiles
   SET status = 'banned',
       banned_at = NOW(),
       banned_by = :director_id,
       banned_reason = :reason
   WHERE id = :user_id;

   -- Marcar email como bloqueado
   INSERT INTO auth_management.banned_emails (email, reason, banned_by)
   VALUES (:user_email, :reason, :director_id);

   -- Auditar con máxima prioridad
   INSERT INTO audit_logging.audit_logs (
     action, resource_type, resource_id, performed_by, details, priority
   ) VALUES (
     'ban', 'user_status', :user_id, :director_id,
     jsonb_build_object(
       'old_status', 'active',
       'new_status', 'banned',
       'reason', :reason,
       'evidence_urls', :evidence_urls,
       'banned_by_name', 'Director López',
       'legal_action', true
     ),
     'critical'
   );

   -- Cerrar sesiones en TODAS las constructoras
   DELETE FROM auth_management.user_sessions
   WHERE user_id = :user_id;

   COMMIT;
   ```
9. Sistema envía notificación CRÍTICA a:
   - Usuario baneado (email)
   - Todos los directores de todas las constructoras donde estaba el usuario
   - Super admins del sistema
10. Sistema envía email al usuario baneado:
    ```
    Asunto: Cuenta baneada permanentemente

    Tu cuenta ha sido baneada permanentemente.

    Razón: [Razón documentada]

    Esta acción es irreversible. No podrás acceder al sistema ni crear nueva cuenta.

    Si tienes preguntas, contacta a legal@constructora.com
    ```

**Resultado:**
- Usuario baneado en TODAS las constructoras
- Email bloqueado permanentemente
- Username reservado permanentemente
- No puede ser invitado nunca más

**Postcondiciones:**
- `profiles.status` = 'banned'
- `banned_emails` contiene email
- Sesiones cerradas en todas las constructoras
- Notificaciones críticas enviadas

---

## 🔐 Consideraciones de Seguridad

### 1. Prevención de Bypass de Estado

**Problema:** Usuario suspendido podría intentar acceder vía API directamente, saltándose frontend

**Solución: Middleware en CADA request autenticado**

```typescript
// apps/backend/src/modules/auth/middleware/user-status.middleware.ts
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { UserStatus } from '../enums/user-status.enum';

@Injectable()
export class UserStatusMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const user = req.user; // Inyectado por JwtAuthGuard

    // Excepciones: endpoints que permiten ciertos estados
    const allowedPaths = [
      '/auth/reactivate',           // inactive puede reactivar
      '/auth/status',               // consultar estado
      '/auth/switch-constructora',  // cambiar constructora
      '/auth/download-data',        // GDPR: inactive puede descargar datos
    ];

    if (allowedPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Validar estado global del perfil
    if (user.profileStatus === 'banned') {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Tu cuenta ha sido baneada permanentemente.',
        errorCode: 'ACCOUNT_BANNED',
        contactSupport: true,
      });
    }

    if (user.profileStatus === 'pending') {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Debes verificar tu email antes de acceder.',
        errorCode: 'EMAIL_NOT_VERIFIED',
        action: 'verify_email',
      });
    }

    // Validar estado en constructora actual
    if (user.constructoraStatus !== UserStatus.ACTIVE) {
      throw new ForbiddenException({
        statusCode: 403,
        message: `Tu acceso a esta constructora está ${user.constructoraStatus}.`,
        errorCode: 'CONSTRUCTORA_ACCESS_DENIED',
        constructoraId: user.constructoraId,
        status: user.constructoraStatus,
      });
    }

    next();
  }
}
```

**Aplicación global:**
```typescript
// apps/backend/src/main.ts
app.use(UserStatusMiddleware); // Aplica a TODOS los endpoints
```

---

### 2. Auditoría Obligatoria de Cambios de Estado

**Problema:** Cambios de estado sin auditar = no hay trazabilidad

**Solución: Trigger automático en base de datos**

```sql
-- apps/database/ddl/schemas/auth_management/triggers/audit-status-change.sql

CREATE OR REPLACE FUNCTION audit_logging.log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo auditar si cambió el estado
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO audit_logging.audit_logs (
      action,
      resource_type,
      resource_id,
      performed_by,
      details,
      priority,
      ip_address
    ) VALUES (
      CASE NEW.status
        WHEN 'suspended' THEN 'suspend'
        WHEN 'banned' THEN 'ban'
        WHEN 'active' THEN 'reactivate'
        WHEN 'inactive' THEN 'deactivate'
        ELSE 'update'
      END,
      'user_status',
      NEW.id,
      COALESCE(current_setting('app.current_user_id', true)::UUID, NEW.id),
      jsonb_build_object(
        'old_status', OLD.status,
        'new_status', NEW.status,
        'reason', NEW.suspended_reason,
        'table', TG_TABLE_NAME,
        'timestamp', NOW()
      ),
      CASE NEW.status
        WHEN 'banned' THEN 'critical'
        WHEN 'suspended' THEN 'high'
        ELSE 'medium'
      END,
      inet_client_addr()
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar a profiles
CREATE TRIGGER trg_audit_status_change_profiles
    AFTER UPDATE OF status ON auth_management.profiles
    FOR EACH ROW
    EXECUTE FUNCTION audit_logging.log_status_change();

-- Aplicar a user_constructoras
CREATE TRIGGER trg_audit_status_change_constructoras
    AFTER UPDATE OF status ON auth_management.user_constructoras
    FOR EACH ROW
    EXECUTE FUNCTION audit_logging.log_status_change();
```

**Resultado:** TODO cambio de estado queda auditado automáticamente

---

### 3. Rate Limiting en Reactivación

**Problema:** Usuario abusa de desactivar/reactivar repetidamente

**Solución: Limitar reactivaciones a 3 por día**

```typescript
// apps/backend/src/modules/auth/services/user-management.service.ts
import { TooManyRequestsException } from '@nestjs/common';

async reactivateAccount(userId: string): Promise<void> {
  // Contar reactivaciones hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reactivationCount = await this.auditLogRepository.count({
    where: {
      resourceId: userId,
      action: 'reactivate',
      createdAt: MoreThan(today),
    },
  });

  // Limitar a 3 reactivaciones por día
  if (reactivationCount >= 3) {
    throw new TooManyRequestsException({
      statusCode: 429,
      message: 'Has alcanzado el límite de reactivaciones por hoy (3 máximo).',
      errorCode: 'TOO_MANY_REACTIVATIONS',
      retryAfter: this.getSecondsUntilMidnight(),
    });
  }

  // Proceder con reactivación
  await this.profileRepository.update(
    { id: userId },
    { status: UserStatus.ACTIVE }
  );
}

private getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}
```

---

### 4. Notificación Obligatoria al Usuario

**Problema:** Usuario no sabe por qué cambió su estado

**Solución: Notificación automática en todo cambio de estado**

```typescript
// apps/backend/src/modules/auth/services/user-status-notification.service.ts
import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../notifications/notification.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class UserStatusNotificationService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  async notifyStatusChange(
    userId: string,
    oldStatus: UserStatus,
    newStatus: UserStatus,
    reason: string,
    changedBy: string,
  ): Promise<void> {
    // Solo notificar si el cambio NO fue iniciado por el propio usuario
    if (changedBy !== userId) {
      // Notificación in-app (push)
      await this.notificationService.send({
        userId,
        type: 'system_announcement',
        priority: newStatus === 'banned' ? 'critical' : 'high',
        title: this.getNotificationTitle(newStatus),
        body: reason,
        icon: this.getNotificationIcon(newStatus),
        actions: this.getNotificationActions(newStatus),
      });

      // Email
      await this.emailService.send({
        to: await this.getUserEmail(userId),
        subject: this.getEmailSubject(newStatus),
        template: 'account-status-changed',
        data: {
          newStatus,
          oldStatus,
          reason,
          changedByName: await this.getUserName(changedBy),
          supportEmail: 'soporte@constructora.com',
        },
      });
    }
  }

  private getNotificationTitle(status: UserStatus): string {
    switch (status) {
      case UserStatus.SUSPENDED:
        return 'Tu cuenta ha sido suspendida temporalmente';
      case UserStatus.BANNED:
        return 'Tu cuenta ha sido baneada permanentemente';
      case UserStatus.ACTIVE:
        return 'Tu cuenta ha sido reactivada';
      case UserStatus.INACTIVE:
        return 'Tu cuenta ha sido desactivada';
      default:
        return 'Tu estado de cuenta ha cambiado';
    }
  }

  private getNotificationIcon(status: UserStatus): string {
    switch (status) {
      case UserStatus.SUSPENDED:
        return '⚠️';
      case UserStatus.BANNED:
        return '🚫';
      case UserStatus.ACTIVE:
        return '✅';
      case UserStatus.INACTIVE:
        return 'ℹ️';
      default:
        return '🔔';
    }
  }

  private getNotificationActions(status: UserStatus): any[] {
    switch (status) {
      case UserStatus.SUSPENDED:
        return [{ label: 'Contactar Soporte', action: 'contact_support' }];
      case UserStatus.BANNED:
        return [{ label: 'Ver Detalles', action: 'view_ban_details' }];
      case UserStatus.INACTIVE:
        return [{ label: 'Reactivar Cuenta', action: 'reactivate_account' }];
      default:
        return [];
    }
  }
}
```

---

### 5. Prevención de Registro con Email Baneado

**Problema:** Usuario baneado intenta crear nueva cuenta con mismo email

**Solución: Validar email contra tabla `banned_emails` en registro**

```typescript
// apps/backend/src/modules/auth/services/auth.service.ts
async registerByInvitation(token: string, password: string): Promise<User> {
  const invitation = await this.validateInvitationToken(token);

  // Verificar si el email está baneado
  const isBanned = await this.bannedEmailRepository.findOne({
    where: { email: invitation.email },
  });

  if (isBanned) {
    throw new ForbiddenException({
      statusCode: 403,
      message: 'Este email está bloqueado y no puede crear una cuenta.',
      errorCode: 'EMAIL_BANNED',
      contactSupport: true,
      bannedReason: isBanned.reason,
    });
  }

  // Continuar con registro...
}
```

```sql
-- apps/database/ddl/schemas/auth_management/tables/banned-emails.sql
CREATE TABLE auth_management.banned_emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  reason TEXT NOT NULL,
  banned_by UUID REFERENCES auth_management.profiles(id),
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_banned_emails_email ON auth_management.banned_emails(email);
```

---

## ✅ Criterios de Aceptación

### AC-001: ENUM Implementado
- [ ] ENUM `user_status` existe en schema `auth_management`
- [ ] ENUM tiene exactamente 5 valores: `active`, `inactive`, `suspended`, `banned`, `pending`
- [ ] Columna `profiles.status` usa el ENUM con default `'pending'`
- [ ] Columna `user_constructoras.status` usa el ENUM con default `'active'`

### AC-002: Transiciones Validadas
- [ ] Solo transiciones permitidas pueden ejecutarse (validación en service)
- [ ] Transiciones prohibidas lanzan exception con mensaje claro
- [ ] Trigger audita TODOS los cambios de estado automáticamente
- [ ] Razón es obligatoria para `suspended` y `banned`
- [ ] Evidencia es obligatoria para `banned`

### AC-003: Middleware Activo
- [ ] `UserStatusMiddleware` aplicado globalmente en backend
- [ ] Middleware valida estado en CADA request autenticado
- [ ] Excepciones configuradas para paths específicos (`/auth/reactivate`, etc.)
- [ ] Frontend redirige según status (pending → verify-email, banned → account-banned)
- [ ] Usuario suspendido no puede acceder ni vía API ni vía UI

### AC-004: Notificaciones Enviadas
- [ ] Usuario recibe notificación push al cambiar status
- [ ] Usuario recibe email con razón y próximos pasos
- [ ] Notificación visible en UI con icono correcto
- [ ] Email incluye información de contacto (soporte, legal)

### AC-005: Admin Panel Funcional
- [ ] Director puede suspender usuarios (excepto otros directores)
- [ ] Director puede banear usuarios permanentemente
- [ ] Razón es campo obligatorio (min 20 caracteres para suspend, 50 para ban)
- [ ] Evidencia es obligatoria para baneo
- [ ] Historial de cambios visible en perfil de usuario
- [ ] Director puede levantar suspensión con justificación

### AC-006: Usuario Puede Desactivar/Reactivar
- [ ] Botón "Desactivar cuenta" visible en `/settings/account`
- [ ] Modal de confirmación requiere contraseña
- [ ] Reactivación simple desde login con botón "Reactivar cuenta"
- [ ] Rate limiting: máximo 3 reactivaciones por día
- [ ] Email de confirmación enviado al desactivar

### AC-007: Multi-tenancy Soportado
- [ ] Usuario puede tener diferentes estados en diferentes constructoras
- [ ] Login muestra solo constructoras donde status = 'active'
- [ ] Suspensión en una constructora no afecta otras constructoras
- [ ] Baneo global afecta TODAS las constructoras

### AC-008: Email Baneado Bloqueado
- [ ] Tabla `banned_emails` creada
- [ ] Registro valida email contra `banned_emails`
- [ ] Email baneado no puede crear nueva cuenta
- [ ] Error claro al intentar registro con email baneado

---

## 🧪 Testing

### Test Suite: User Status Management

#### Test Case 1: Usuario pending no puede acceder
```typescript
// apps/backend/src/modules/auth/tests/user-status.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';

describe('UserStatusMiddleware - Pending Users', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should block pending user from accessing protected endpoints', async () => {
    // Arrange: Crear usuario con status pending
    const user = await createTestUser({
      email: 'pending@test.com',
      status: UserStatus.PENDING,
    });
    const token = await generateAuthToken(user);

    // Act: Intentar acceder a dashboard
    const response = await request(app.getHttpServer())
      .get('/dashboard')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.FORBIDDEN);

    // Assert
    expect(response.body.message).toContain('verificar tu email');
    expect(response.body.errorCode).toBe('EMAIL_NOT_VERIFIED');
  });

  it('should allow pending user to access /auth/resend-verification', async () => {
    const user = await createTestUser({ status: UserStatus.PENDING });
    const token = await generateAuthToken(user);

    // Endpoint de excepción debe funcionar
    const response = await request(app.getHttpServer())
      .post('/auth/resend-verification')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    expect(response.body.message).toContain('Email enviado');
  });
});
```

---

#### Test Case 2: Director puede suspender usuario
```typescript
describe('UserManagementService - Suspend User', () => {
  it('should allow director to suspend resident with reason', async () => {
    // Arrange
    const director = await createTestUser({
      role: ConstructionRole.DIRECTOR,
      constructoraId: 'constructora-a',
    });
    const resident = await createTestUser({
      role: ConstructionRole.RESIDENT,
      status: UserStatus.ACTIVE,
      constructoraId: 'constructora-a',
    });

    await loginAs(director);

    // Act
    const response = await request(app.getHttpServer())
      .post(`/admin/users/${resident.id}/suspend`)
      .send({
        reason: 'Registró asistencias falsas de empleados',
        durationDays: 14,
        evidence: ['https://s3.aws.com/screenshot1.png'],
      })
      .expect(HttpStatus.OK);

    // Assert
    expect(response.body.message).toContain('suspendido exitosamente');

    // Verificar estado en DB
    const updatedResident = await getUserById(resident.id);
    expect(updatedResident.status).toBe(UserStatus.SUSPENDED);
    expect(updatedResident.suspendedReason).toBe('Registró asistencias falsas de empleados');

    // Verificar auditoría
    const auditLog = await getLatestAuditLog(resident.id, 'user_status');
    expect(auditLog.action).toBe('suspend');
    expect(auditLog.performedBy).toBe(director.id);
    expect(auditLog.details.reason).toBe('Registró asistencias falsas de empleados');
    expect(auditLog.priority).toBe('high');
  });

  it('should NOT allow director to suspend another director', async () => {
    const director1 = await createTestUser({ role: ConstructionRole.DIRECTOR });
    const director2 = await createTestUser({ role: ConstructionRole.DIRECTOR });

    await loginAs(director1);

    const response = await request(app.getHttpServer())
      .post(`/admin/users/${director2.id}/suspend`)
      .send({ reason: 'Test', durationDays: 7 })
      .expect(HttpStatus.FORBIDDEN);

    expect(response.body.message).toContain('No puedes suspender a otro director');
  });

  it('should require reason with minimum length', async () => {
    const director = await createTestUser({ role: ConstructionRole.DIRECTOR });
    const resident = await createTestUser({ role: ConstructionRole.RESIDENT });

    await loginAs(director);

    const response = await request(app.getHttpServer())
      .post(`/admin/users/${resident.id}/suspend`)
      .send({
        reason: 'Test', // Muy corto (< 20 caracteres)
        durationDays: 7,
      })
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body.message).toContain('Razón debe tener mínimo 20 caracteres');
  });
});
```

---

#### Test Case 3: Usuario puede desactivar y reactivar
```typescript
describe('UserAccountService - Deactivate/Reactivate', () => {
  it('should allow user to deactivate their own account', async () => {
    // Arrange
    const user = await createTestUser({
      email: 'engineer@test.com',
      password: 'password123',
      status: UserStatus.ACTIVE,
    });
    await loginAs(user);

    // Act: Desactivar
    const deactivateResponse = await request(app.getHttpServer())
      .post('/auth/deactivate')
      .send({ password: 'password123' })
      .expect(HttpStatus.OK);

    expect(deactivateResponse.body.message).toContain('desactivada');

    // Assert: Verificar estado
    let updatedUser = await getUserById(user.id);
    expect(updatedUser.status).toBe(UserStatus.INACTIVE);

    // Assert: Verificar auditoría
    const auditLog = await getLatestAuditLog(user.id, 'user_status');
    expect(auditLog.action).toBe('deactivate');
    expect(auditLog.details.deactivatedBy).toBe('self');
  });

  it('should allow user to reactivate their account', async () => {
    // Arrange
    const user = await createTestUser({ status: UserStatus.INACTIVE });
    await loginAs(user);

    // Act: Reactivar
    const reactivateResponse = await request(app.getHttpServer())
      .post('/auth/reactivate')
      .expect(HttpStatus.OK);

    expect(reactivateResponse.body.message).toContain('reactivada');

    // Assert
    const updatedUser = await getUserById(user.id);
    expect(updatedUser.status).toBe(UserStatus.ACTIVE);
  });

  it('should enforce rate limiting on reactivation (max 3/day)', async () => {
    const user = await createTestUser({ status: UserStatus.INACTIVE });
    await loginAs(user);

    // Reactivar 3 veces (máximo permitido)
    for (let i = 0; i < 3; i++) {
      await request(app.getHttpServer())
        .post('/auth/reactivate')
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .post('/auth/deactivate')
        .send({ password: user.password })
        .expect(HttpStatus.OK);
    }

    // Intentar 4ta reactivación (debe fallar)
    const response = await request(app.getHttpServer())
      .post('/auth/reactivate')
      .expect(HttpStatus.TOO_MANY_REQUESTS);

    expect(response.body.errorCode).toBe('TOO_MANY_REACTIVATIONS');
    expect(response.body.message).toContain('límite de reactivaciones');
  });
});
```

---

#### Test Case 4: Banned user cannot login
```typescript
describe('AuthService - Banned User', () => {
  it('should block banned user from logging in', async () => {
    // Arrange
    const user = await createTestUser({
      email: 'banned@test.com',
      password: 'password123',
      status: UserStatus.BANNED,
      bannedReason: 'Fraude financiero',
    });

    // Act
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'banned@test.com',
        password: 'password123',
      })
      .expect(HttpStatus.UNAUTHORIZED);

    // Assert
    expect(response.body.message).toContain('baneada permanentemente');
    expect(response.body.errorCode).toBe('ACCOUNT_BANNED');
    expect(response.body.contactSupport).toBe(true);
  });

  it('should block banned email from creating new account', async () => {
    // Arrange: Crear email baneado
    await createBannedEmail({
      email: 'fraud@test.com',
      reason: 'Usuario anterior cometió fraude',
    });

    // Act: Intentar registro con email baneado
    const invitationToken = await createInvitation('fraud@test.com');

    const response = await request(app.getHttpServer())
      .post('/auth/register-by-invitation')
      .send({
        token: invitationToken,
        password: 'newPassword123',
      })
      .expect(HttpStatus.FORBIDDEN);

    // Assert
    expect(response.body.errorCode).toBe('EMAIL_BANNED');
    expect(response.body.message).toContain('bloqueado');
  });
});
```

---

#### Test Case 5: Multi-tenancy status validation
```typescript
describe('Multi-tenancy Status', () => {
  it('should allow user active in constructora A but suspended in B', async () => {
    // Arrange
    const user = await createTestUser({ email: 'multi@test.com' });

    await assignUserToConstructora(user.id, 'constructora-a', {
      status: UserStatus.ACTIVE,
      role: ConstructionRole.DIRECTOR,
    });

    await assignUserToConstructora(user.id, 'constructora-b', {
      status: UserStatus.SUSPENDED,
      role: ConstructionRole.ENGINEER,
    });

    // Act: Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'multi@test.com', password: 'password' })
      .expect(HttpStatus.OK);

    // Assert: Solo debe ver constructora A (activa)
    expect(loginResponse.body.constructoras).toHaveLength(1);
    expect(loginResponse.body.constructoras[0].id).toBe('constructora-a');

    // Act: Acceder a constructora A (debe funcionar)
    const tokenA = loginResponse.body.accessToken;
    await request(app.getHttpServer())
      .get('/dashboard')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(HttpStatus.OK);

    // Act: Intentar cambiar a constructora B (debe fallar)
    const switchResponse = await request(app.getHttpServer())
      .post('/auth/switch-constructora')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ constructoraId: 'constructora-b' })
      .expect(HttpStatus.FORBIDDEN);

    expect(switchResponse.body.message).toContain('suspended');
  });
});
```

---

#### Test Case 6: Trigger audits all status changes
```typescript
describe('Audit Trigger', () => {
  it('should automatically audit status changes via trigger', async () => {
    const user = await createTestUser({ status: UserStatus.ACTIVE });

    // Cambiar estado directamente en DB (sin pasar por service)
    await query(`
      UPDATE auth_management.profiles
      SET status = 'suspended'
      WHERE id = $1
    `, [user.id]);

    // Verificar que trigger creó audit log
    const auditLogs = await query(`
      SELECT * FROM audit_logging.audit_logs
      WHERE resource_id = $1
        AND resource_type = 'user_status'
      ORDER BY created_at DESC
      LIMIT 1
    `, [user.id]);

    expect(auditLogs.rows).toHaveLength(1);
    expect(auditLogs.rows[0].action).toBe('suspend');
    expect(auditLogs.rows[0].details.old_status).toBe('active');
    expect(auditLogs.rows[0].details.new_status).toBe('suspended');
  });
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-AUTH-001: Sistema de Roles de Construcción](./RF-AUTH-001-roles-construccion.md) - Estados interactúan con roles
- 📄 [RF-AUTH-003: Multi-tenancy por Constructora](./RF-AUTH-003-multi-tenancy.md) *(Pendiente)* - Estados por constructora
- 📄 [US-FUND-001: Autenticación Básica JWT](../historias-usuario/US-FUND-001-autenticacion-basica-jwt.md) - Login valida estado
- 📄 [US-FUND-005: Sistema de Sesiones](../historias-usuario/US-FUND-005-sistema-sesiones.md) *(Pendiente)* - Cerrar sesiones al suspender

### Regulaciones y Compliance
- [GDPR Article 17: Right to Erasure](https://gdpr-info.eu/art-17-gdpr/) - Derecho al olvido
- [GDPR Article 20: Right to Data Portability](https://gdpr-info.eu/art-20-gdpr/) - Exportar datos personales
- [Ley Federal de Protección de Datos Personales (México)](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf) - Protección de datos en México

### Recursos Técnicos
- [PostgreSQL ENUM Types](https://www.postgresql.org/docs/current/datatype-enum.html)
- [NestJS Guards](https://docs.nestjs.com/guards)
- [NestJS Middleware](https://docs.nestjs.com/middleware)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Team | Creación inicial adaptada de GAMILIT con contexto de construcción |

---

**Documento:** `MAI-001-fundamentos/requerimientos/RF-AUTH-002-estados-cuenta.md`
**Ruta absoluta:** `/home/isem/workspace/worskpace-inmobiliaria/docs/01-fase-alcance-inicial/MAI-001-fundamentos/requerimientos/RF-AUTH-002-estados-cuenta.md`
**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team
