# ET-AUTH-002: Gestión de Estados de Cuenta

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | ET-AUTH-002 |
| **Épica** | MAI-001 - Fundamentos |
| **Módulo** | Autenticación y Autorización |
| **Tipo** | Especificación Técnica |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |
| **Esfuerzo estimado** | 16h (vs 20h GAMILIT - 20% ahorro por reutilización) |

## 🔗 Referencias

### Requerimiento Funcional
📄 [RF-AUTH-002: Estados de Cuenta de Usuario](../requerimientos/RF-AUTH-002-estados-cuenta.md)

### Origen (GAMILIT)
♻️ **Reutilización:** 75%
- **Documento base:** `/workspace-gamilit/gamilit/projects/gamilit/docs/01-fase-alcance-inicial/EAI-001-fundamentos/especificaciones/ET-AUTH-002-estados-cuenta.md`
- **Componentes reutilizables:**
  - Funciones de gestión de estado (suspend_user, ban_user, reactivate_user)
  - Triggers de auditoría
  - Middleware de validación
- **Adaptaciones:**
  - Estados por constructora (tabla `user_constructoras`)
  - Funciones multi-tenant
  - Tabla `banned_emails` para bloqueo permanente

### Implementación DDL

🗄️ **ENUM Principal:**
```sql
-- apps/database/ddl/00-prerequisites.sql
DO $$ BEGIN
    CREATE TYPE auth_management.user_status AS ENUM (
        'active',    -- Usuario activo, puede acceder
        'inactive',  -- Inactivo temporalmente (desactivación voluntaria)
        'suspended', -- Suspendido por admin (reversible)
        'banned',    -- Baneado permanentemente (irreversible)
        'pending'    -- Registro pendiente de verificación de email
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

COMMENT ON TYPE auth_management.user_status IS
  'Estados de cuenta de usuario: pending → active → (inactive|suspended|banned)';
```

🗄️ **Tablas Principales:**

```sql
-- 1. Perfil global (estado general)
CREATE TABLE auth_management.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,

    -- ESTADO GLOBAL DEL PERFIL
    status auth_management.user_status NOT NULL DEFAULT 'pending',

    -- Metadata de estado global
    status_changed_at TIMESTAMP WITH TIME ZONE,
    status_changed_by UUID REFERENCES auth_management.profiles(id),
    status_reason TEXT, -- Razón de baneo global

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Estado por constructora (multi-tenancy)
CREATE TABLE auth_management.user_constructoras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
    constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id) ON DELETE CASCADE,
    role construction_role NOT NULL,

    -- ESTADO EN ESTA CONSTRUCTORA
    status auth_management.user_status NOT NULL DEFAULT 'active',

    -- Metadata de estado en constructora
    suspended_at TIMESTAMP WITH TIME ZONE,
    suspended_by UUID REFERENCES auth_management.profiles(id),
    suspended_reason TEXT,
    suspended_until TIMESTAMP WITH TIME ZONE, -- Fecha de revisión

    is_primary BOOLEAN DEFAULT FALSE,
    invited_by UUID REFERENCES auth_management.profiles(id),
    invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    joined_at TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(user_id, constructora_id)
);

-- 3. Emails bloqueados permanentemente
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

🗄️ **Funciones:**

```sql
-- Verificar si usuario puede acceder
CREATE FUNCTION auth_management.verify_user_status(
  p_user_id UUID,
  p_constructora_id UUID
) RETURNS BOOLEAN;

-- Suspender usuario en constructora
CREATE FUNCTION auth_management.suspend_user_in_constructora(
  p_user_id UUID,
  p_constructora_id UUID,
  p_reason TEXT,
  p_duration_days INTEGER,
  p_suspended_by UUID
) RETURNS VOID;

-- Banear usuario globalmente (PERMANENTE)
CREATE FUNCTION auth_management.ban_user_globally(
  p_user_id UUID,
  p_reason TEXT,
  p_banned_by UUID
) RETURNS VOID;

-- Reactivar usuario
CREATE FUNCTION auth_management.reactivate_user(
  p_user_id UUID,
  p_constructora_id UUID,
  p_reactivated_by UUID
) RETURNS VOID;

-- Levantar suspensión
CREATE FUNCTION auth_management.lift_suspension(
  p_user_id UUID,
  p_constructora_id UUID,
  p_lifted_by UUID
) RETURNS VOID;
```

🗄️ **Triggers:**

```sql
-- Auditar cambios de estado en profiles
CREATE TRIGGER trg_profiles_status_change
  AFTER UPDATE OF status ON auth_management.profiles
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION audit_logging.log_status_change();

-- Auditar cambios de estado en user_constructoras
CREATE TRIGGER trg_user_constructoras_status_change
  AFTER UPDATE OF status ON auth_management.user_constructoras
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION audit_logging.log_status_change();

-- Cambiar pending → active al verificar email
CREATE TRIGGER trg_verify_email_set_active
  BEFORE UPDATE ON auth_management.profiles
  FOR EACH ROW
  WHEN (OLD.email_verified = FALSE AND NEW.email_verified = TRUE)
  EXECUTE FUNCTION auth_management.set_status_active();
```

### Backend

💻 **Archivos de Implementación:**
- **Service:** `apps/backend/src/modules/auth/services/user-status.service.ts`
- **DTOs:**
  - `apps/backend/src/modules/auth/dto/suspend-user.dto.ts`
  - `apps/backend/src/modules/auth/dto/ban-user.dto.ts`
  - `apps/backend/src/modules/auth/dto/reactivate-user.dto.ts`
- **Middleware:** `apps/backend/src/modules/auth/middleware/user-status.middleware.ts`
- **Controller:** `apps/backend/src/modules/admin/user-management.controller.ts`

### Frontend

🎨 **Componentes:**
- **StatusBadge:** `apps/frontend/src/components/ui/UserStatusBadge.tsx`
- **SuspendModal:** `apps/frontend/src/features/admin/SuspendUserModal.tsx`
- **BanModal:** `apps/frontend/src/features/admin/BanUserModal.tsx`
- **ReactivateModal:** `apps/frontend/src/features/auth/ReactivateAccountModal.tsx`
- **AccountStatusPage:** `apps/frontend/src/features/auth/AccountStatusPage.tsx`

### Trazabilidad
📊 [TRACEABILITY.yml](../implementacion/TRACEABILITY.yml#L45-L78)

---

## 🏗️ Arquitectura de Estados Multi-tenant

### Diagrama de Transiciones

```
┌─────────────────────────────────────────────────────────────────────┐
│                  CICLO DE VIDA DE CUENTA (Multi-tenant)              │
└─────────────────────────────────────────────────────────────────────┘

                        [INVITACIÓN A CONSTRUCTORA]
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ ESTADO GLOBAL: pending        │
                    │ ESTADO CONSTRUCTORA: pending  │
                    └───────────────┬───────────────┘
                                    │
                         verify_email() │
                                    ▼
                    ┌───────────────────────────────┐
                    │ ESTADO GLOBAL: active         │
                    │ ESTADO CONSTRUCTORA: active   │
                    └───┬───────────┬───────────┬───┘
                        │           │           │
         user_deactivates()         │           admin_suspends_in_constructora()
                        │           │           │
                        ▼           │           ▼
            ┌────────────────┐     │     ┌──────────────────────────┐
            │ GLOBAL: active │     │     │ GLOBAL: active           │
            │ CONST-A: inactive    │     │ CONST-A: suspended       │
            └───────┬────────┘     │     └───────┬──────────────────┘
                    │              │             │
          user_reactivates()       │      admin_lifts_suspension()
                    │              │             │
                    └──────────────┼─────────────┘
                                   │
                         admin_bans_globally()
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │ ESTADO GLOBAL: banned        │
                    │ TODAS CONSTRUCTORAS: banned  │
                    │ (IRREVERSIBLE - PERMANENTE)  │
                    └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                    ESCENARIO MULTI-CONSTRUCTORA                      │
└─────────────────────────────────────────────────────────────────────┘

    Usuario "Juan Pérez" trabaja en 2 constructoras:

    ┌─────────────────────────────────────────────────────────────┐
    │ CONSTRUCTORA A                                              │
    │ - Estado: active                                            │
    │ - Rol: engineer                                             │
    │ - Puede acceder: ✅                                         │
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │ CONSTRUCTORA B                                              │
    │ - Estado: suspended                                         │
    │ - Rol: resident                                             │
    │ - Razón: "Registró asistencias falsas"                     │
    │ - Suspendido hasta: 2025-12-01                             │
    │ - Puede acceder: ❌                                         │
    └─────────────────────────────────────────────────────────────┘

    Al hacer login:
    - Ve solo CONSTRUCTORA A en selector
    - NO ve CONSTRUCTORA B (suspendido ahí)
    - Puede trabajar normalmente en CONSTRUCTORA A

LEYENDA:
────► Transición automática/usuario
- - → Transición admin only
═══► Transición irreversible global
```

---

## 🔧 Implementación Técnica Completa

### 1. Funciones de Base de Datos

#### verify_user_status()
**Propósito:** Verificar si usuario puede acceder a una constructora

```sql
-- apps/database/ddl/schemas/auth_management/functions/verify-user-status.sql
CREATE OR REPLACE FUNCTION auth_management.verify_user_status(
    p_user_id UUID,
    p_constructora_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
DECLARE
    v_global_status auth_management.user_status;
    v_constructora_status auth_management.user_status;
BEGIN
    -- 1. Verificar estado global del perfil
    SELECT status INTO v_global_status
    FROM auth_management.profiles
    WHERE id = p_user_id;

    -- Usuario no existe
    IF v_global_status IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Baneado globalmente
    IF v_global_status = 'banned' THEN
        RETURN FALSE;
    END IF;

    -- Email no verificado
    IF v_global_status = 'pending' THEN
        RETURN FALSE;
    END IF;

    -- Si no se especifica constructora, solo validar estado global
    IF p_constructora_id IS NULL THEN
        RETURN v_global_status = 'active';
    END IF;

    -- 2. Verificar estado en constructora específica
    SELECT status INTO v_constructora_status
    FROM auth_management.user_constructoras
    WHERE user_id = p_user_id
      AND constructora_id = p_constructora_id;

    -- Usuario no está asociado a esa constructora
    IF v_constructora_status IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Estado debe ser active en constructora
    RETURN v_constructora_status = 'active';
END;
$$;

COMMENT ON FUNCTION auth_management.verify_user_status(UUID, UUID) IS
  'Verifica si usuario puede acceder (global: active, constructora: active)';
```

---

#### suspend_user_in_constructora()
**Propósito:** Suspender usuario en una constructora específica (no afecta otras)

```sql
-- apps/database/ddl/schemas/auth_management/functions/suspend-user-in-constructora.sql
CREATE OR REPLACE FUNCTION auth_management.suspend_user_in_constructora(
    p_user_id UUID,
    p_constructora_id UUID,
    p_reason TEXT,
    p_duration_days INTEGER DEFAULT 14,
    p_suspended_by UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_current_status auth_management.user_status;
    v_user_email TEXT;
    v_user_name TEXT;
    v_constructora_name TEXT;
BEGIN
    -- 1. Validar que usuario esté activo en esta constructora
    SELECT uc.status, p.email, p.full_name, c.nombre
    INTO v_current_status, v_user_email, v_user_name, v_constructora_name
    FROM auth_management.user_constructoras uc
    INNER JOIN auth_management.profiles p ON p.id = uc.user_id
    INNER JOIN auth_management.constructoras c ON c.id = uc.constructora_id
    WHERE uc.user_id = p_user_id
      AND uc.constructora_id = p_constructora_id;

    -- Usuario no encontrado en constructora
    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'User % not found in constructora %', p_user_id, p_constructora_id;
    END IF;

    -- Solo se puede suspender si está active
    IF v_current_status != 'active' THEN
        RAISE EXCEPTION 'User must be active to suspend. Current status: %', v_current_status;
    END IF;

    -- 2. Validar razón (mínimo 20 caracteres)
    IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 20 THEN
        RAISE EXCEPTION 'Suspension reason must be at least 20 characters';
    END IF;

    -- 3. Validar duración
    IF p_duration_days <= 0 OR p_duration_days > 90 THEN
        RAISE EXCEPTION 'Suspension duration must be between 1 and 90 days';
    END IF;

    -- 4. Actualizar estado
    UPDATE auth_management.user_constructoras
    SET
        status = 'suspended',
        suspended_at = NOW(),
        suspended_by = p_suspended_by,
        suspended_reason = p_reason,
        suspended_until = NOW() + (p_duration_days || ' days')::INTERVAL,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND constructora_id = p_constructora_id;

    -- 5. Cerrar sesiones activas en esta constructora
    DELETE FROM auth_management.user_sessions
    WHERE user_id = p_user_id
      AND constructora_id = p_constructora_id;

    -- 6. Trigger automático auditará el cambio

    RAISE NOTICE 'User % (%) suspended in % for % days. Reason: %',
      v_user_name, v_user_email, v_constructora_name, p_duration_days, p_reason;
END;
$$;

COMMENT ON FUNCTION auth_management.suspend_user_in_constructora IS
  'Suspende usuario en una constructora específica (reversible, no afecta otras constructoras)';
```

---

#### ban_user_globally()
**Propósito:** Banear usuario en TODAS las constructoras (permanente, irreversible)

```sql
-- apps/database/ddl/schemas/auth_management/functions/ban-user-globally.sql
CREATE OR REPLACE FUNCTION auth_management.ban_user_globally(
    p_user_id UUID,
    p_reason TEXT,
    p_banned_by UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_current_status auth_management.user_status;
    v_email TEXT;
    v_full_name TEXT;
    v_affected_constructoras INTEGER;
BEGIN
    -- 1. Obtener estado y email
    SELECT status, email, full_name
    INTO v_current_status, v_email, v_full_name
    FROM auth_management.profiles
    WHERE id = p_user_id;

    -- Usuario no existe
    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'User % not found', p_user_id;
    END IF;

    -- Ya está baneado
    IF v_current_status = 'banned' THEN
        RAISE NOTICE 'User % is already banned', p_user_id;
        RETURN;
    END IF;

    -- 2. Validar razón (mínimo 50 caracteres para acción permanente)
    IF p_reason IS NULL OR LENGTH(TRIM(p_reason)) < 50 THEN
        RAISE EXCEPTION 'Ban reason must be at least 50 characters (PERMANENT action requires detailed justification)';
    END IF;

    -- 3. Banear en perfil global (IRREVERSIBLE)
    UPDATE auth_management.profiles
    SET
        status = 'banned',
        status_changed_at = NOW(),
        status_changed_by = p_banned_by,
        status_reason = p_reason,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- 4. Banear en TODAS las constructoras
    UPDATE auth_management.user_constructoras
    SET
        status = 'banned',
        suspended_at = NOW(),
        suspended_by = p_banned_by,
        suspended_reason = p_reason,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND status != 'banned'; -- Solo actualizar las que no estén baneadas

    GET DIAGNOSTICS v_affected_constructoras = ROW_COUNT;

    -- 5. Bloquear email permanentemente
    INSERT INTO auth_management.banned_emails (
        email, reason, banned_by, banned_at
    ) VALUES (
        v_email, p_reason, p_banned_by, NOW()
    ) ON CONFLICT (email) DO UPDATE
    SET
        reason = EXCLUDED.reason,
        banned_by = EXCLUDED.banned_by,
        banned_at = EXCLUDED.banned_at;

    -- 6. Cerrar TODAS las sesiones del usuario
    DELETE FROM auth_management.user_sessions
    WHERE user_id = p_user_id;

    -- 7. Trigger auditará el cambio

    RAISE WARNING 'User % (%) BANNED GLOBALLY (PERMANENT). Affected % constructoras. Reason: %',
      v_full_name, v_email, v_affected_constructoras, p_reason;
END;
$$;

COMMENT ON FUNCTION auth_management.ban_user_globally IS
  'Banea usuario en TODAS las constructoras (PERMANENTE e IRREVERSIBLE)';
```

---

#### lift_suspension()
**Propósito:** Levantar suspensión en constructora

```sql
-- apps/database/ddl/schemas/auth_management/functions/lift-suspension.sql
CREATE OR REPLACE FUNCTION auth_management.lift_suspension(
    p_user_id UUID,
    p_constructora_id UUID,
    p_lifted_by UUID DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_current_status auth_management.user_status;
    v_user_name TEXT;
BEGIN
    -- Obtener estado actual
    SELECT uc.status, p.full_name
    INTO v_current_status, v_user_name
    FROM auth_management.user_constructoras uc
    INNER JOIN auth_management.profiles p ON p.id = uc.user_id
    WHERE uc.user_id = p_user_id
      AND uc.constructora_id = p_constructora_id;

    -- Solo se puede levantar suspensión si está suspended
    IF v_current_status != 'suspended' THEN
        RAISE EXCEPTION 'User must be suspended to lift. Current status: %', v_current_status;
    END IF;

    -- Reactivar
    UPDATE auth_management.user_constructoras
    SET
        status = 'active',
        suspended_at = NULL,
        suspended_by = NULL,
        suspended_reason = NULL,
        suspended_until = NULL,
        updated_at = NOW()
    WHERE user_id = p_user_id
      AND constructora_id = p_constructora_id;

    -- Trigger auditará

    RAISE NOTICE 'Suspension lifted for user % in constructora %', v_user_name, p_constructora_id;
END;
$$;

COMMENT ON FUNCTION auth_management.lift_suspension IS
  'Levanta suspensión de usuario en constructora (suspended → active)';
```

---

#### reactivate_user()
**Propósito:** Usuario reactiva su propia cuenta (desde inactive)

```sql
-- apps/database/ddl/schemas/auth_management/functions/reactivate-user.sql
CREATE OR REPLACE FUNCTION auth_management.reactivate_user(
    p_user_id UUID
)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_current_status auth_management.user_status;
    v_reactivations_today INTEGER;
BEGIN
    -- Obtener estado global
    SELECT status INTO v_current_status
    FROM auth_management.profiles
    WHERE id = p_user_id;

    -- Solo se puede reactivar desde inactive
    IF v_current_status != 'inactive' THEN
        RAISE EXCEPTION 'Can only reactivate inactive users. Current status: %', v_current_status;
    END IF;

    -- Rate limiting: máximo 3 reactivaciones por día
    SELECT COUNT(*)
    INTO v_reactivations_today
    FROM audit_logging.audit_logs
    WHERE resource_id = p_user_id::TEXT
      AND action = 'reactivate'
      AND created_at >= CURRENT_DATE;

    IF v_reactivations_today >= 3 THEN
        RAISE EXCEPTION 'Maximum reactivations per day reached (3). Try again tomorrow.';
    END IF;

    -- Reactivar
    UPDATE auth_management.profiles
    SET
        status = 'active',
        status_changed_at = NOW(),
        status_changed_by = p_user_id, -- Usuario se reactiva a sí mismo
        status_reason = NULL,
        updated_at = NOW()
    WHERE id = p_user_id;

    -- Trigger auditará

    RAISE NOTICE 'User % reactivated (inactive → active)', p_user_id;
END;
$$;

COMMENT ON FUNCTION auth_management.reactivate_user IS
  'Usuario reactiva su propia cuenta (inactive → active, máx 3/día)';
```

---

### 2. Triggers de Auditoría

```sql
-- apps/database/ddl/schemas/audit_logging/functions/log-status-change.sql
CREATE OR REPLACE FUNCTION audit_logging.log_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
    v_current_user_id UUID;
    v_priority TEXT;
BEGIN
    -- Obtener usuario que ejecuta la acción
    v_current_user_id := NULLIF(current_setting('app.current_user_id', true), '')::UUID;

    -- Determinar prioridad según nuevo estado
    v_priority := CASE NEW.status
        WHEN 'banned' THEN 'critical'
        WHEN 'suspended' THEN 'high'
        WHEN 'inactive' THEN 'medium'
        ELSE 'low'
    END;

    -- Insertar en audit_logs
    INSERT INTO audit_logging.audit_logs (
        action,
        resource_type,
        resource_id,
        performed_by,
        details,
        priority,
        created_at
    ) VALUES (
        CASE NEW.status
            WHEN 'suspended' THEN 'suspend'
            WHEN 'banned' THEN 'ban'
            WHEN 'active' THEN 'reactivate'
            WHEN 'inactive' THEN 'deactivate'
            ELSE 'update_status'
        END,
        'user_status',
        COALESCE(NEW.user_id::TEXT, NEW.id::TEXT), -- user_constructoras vs profiles
        COALESCE(v_current_user_id, NEW.id), -- Si es NULL, asumir self-action
        jsonb_build_object(
            'old_status', OLD.status,
            'new_status', NEW.status,
            'reason', COALESCE(NEW.suspended_reason, NEW.status_reason),
            'table', TG_TABLE_NAME,
            'constructora_id', CASE
                WHEN TG_TABLE_NAME = 'user_constructoras' THEN NEW.constructora_id::TEXT
                ELSE NULL
            END,
            'timestamp', NOW()
        ),
        v_priority,
        NOW()
    );

    RETURN NEW;
END;
$$;

-- Aplicar a ambas tablas
CREATE TRIGGER trg_profiles_status_change
    AFTER UPDATE OF status ON auth_management.profiles
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION audit_logging.log_status_change();

CREATE TRIGGER trg_user_constructoras_status_change
    AFTER UPDATE OF status ON auth_management.user_constructoras
    FOR EACH ROW
    WHEN (OLD.status IS DISTINCT FROM NEW.status)
    EXECUTE FUNCTION audit_logging.log_status_change();
```

---

### 3. Backend - Service de Gestión de Estados

**Ubicación:** `apps/backend/src/modules/auth/services/user-status.service.ts`

```typescript
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import { UserConstructora } from '../entities/user-constructora.entity';
import { BannedEmail } from '../entities/banned-email.entity';
import { UserStatus } from '../enums/user-status.enum';
import { NotificationService } from '@modules/notifications/notification.service';
import { EmailService } from '@modules/email/email.service';

@Injectable()
export class UserStatusService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,

    @InjectRepository(UserConstructora)
    private readonly userConstructoraRepo: Repository<UserConstructora>,

    @InjectRepository(BannedEmail)
    private readonly bannedEmailRepo: Repository<BannedEmail>,

    private readonly dataSource: DataSource,
    private readonly notificationService: NotificationService,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Suspender usuario en una constructora específica
   */
  async suspendUserInConstructora(
    userId: string,
    constructoraId: string,
    reason: string,
    durationDays: number,
    suspendedBy: string,
  ): Promise<void> {
    // Validaciones
    if (!reason || reason.trim().length < 20) {
      throw new BadRequestException('Razón debe tener mínimo 20 caracteres');
    }

    if (durationDays < 1 || durationDays > 90) {
      throw new BadRequestException('Duración debe estar entre 1 y 90 días');
    }

    // Ejecutar función de base de datos
    await this.dataSource.query(`
      SELECT auth_management.suspend_user_in_constructora($1, $2, $3, $4, $5)
    `, [userId, constructoraId, reason, durationDays, suspendedBy]);

    // Enviar notificación
    await this.notifyStatusChange(
      userId,
      UserStatus.ACTIVE,
      UserStatus.SUSPENDED,
      reason,
      suspendedBy,
      constructoraId,
    );
  }

  /**
   * Banear usuario globalmente (todas las constructoras)
   */
  async banUserGlobally(
    userId: string,
    reason: string,
    bannedBy: string,
  ): Promise<void> {
    // Validación estricta para acción permanente
    if (!reason || reason.trim().length < 50) {
      throw new BadRequestException(
        'Razón debe tener mínimo 50 caracteres (acción PERMANENTE requiere justificación detallada)'
      );
    }

    // Ejecutar función de base de datos
    await this.dataSource.query(`
      SELECT auth_management.ban_user_globally($1, $2, $3)
    `, [userId, reason, bannedBy]);

    // Enviar notificación crítica
    await this.notifyStatusChange(
      userId,
      UserStatus.ACTIVE,
      UserStatus.BANNED,
      reason,
      bannedBy,
      null, // Global ban
    );
  }

  /**
   * Levantar suspensión en constructora
   */
  async liftSuspension(
    userId: string,
    constructoraId: string,
    liftedBy: string,
  ): Promise<void> {
    await this.dataSource.query(`
      SELECT auth_management.lift_suspension($1, $2, $3)
    `, [userId, constructoraId, liftedBy]);

    await this.notifyStatusChange(
      userId,
      UserStatus.SUSPENDED,
      UserStatus.ACTIVE,
      'Suspensión levantada por administrador',
      liftedBy,
      constructoraId,
    );
  }

  /**
   * Usuario reactiva su propia cuenta
   */
  async reactivateAccount(userId: string): Promise<void> {
    try {
      await this.dataSource.query(`
        SELECT auth_management.reactivate_user($1)
      `, [userId]);

      await this.notifyStatusChange(
        userId,
        UserStatus.INACTIVE,
        UserStatus.ACTIVE,
        'Cuenta reactivada por el usuario',
        userId,
        null,
      );
    } catch (error) {
      if (error.message.includes('Maximum reactivations')) {
        throw new BadRequestException(
          'Has alcanzado el límite de reactivaciones por hoy (3 máximo). Intenta mañana.'
        );
      }
      throw error;
    }
  }

  /**
   * Usuario desactiva su propia cuenta
   */
  async deactivateAccount(userId: string, password: string): Promise<void> {
    // Validar contraseña primero
    const user = await this.profileRepo.findOne({ where: { id: userId } });
    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    // Desactivar
    await this.profileRepo.update(
      { id: userId },
      {
        status: UserStatus.INACTIVE,
        statusChangedAt: new Date(),
        statusChangedBy: userId, // Self-deactivation
      }
    );

    // Enviar email de confirmación
    await this.emailService.send({
      to: user.email,
      subject: 'Cuenta desactivada temporalmente',
      template: 'account-deactivated',
      data: {
        userName: user.fullName,
        reactivationUrl: `${process.env.FRONTEND_URL}/auth/reactivate`,
      },
    });
  }

  /**
   * Verificar si email está baneado
   */
  async isEmailBanned(email: string): Promise<boolean> {
    const banned = await this.bannedEmailRepo.findOne({ where: { email } });
    return !!banned;
  }

  /**
   * Obtener razón de baneo de email
   */
  async getBannedEmailReason(email: string): Promise<string | null> {
    const banned = await this.bannedEmailRepo.findOne({ where: { email } });
    return banned?.reason || null;
  }

  /**
   * Notificar cambio de estado
   */
  private async notifyStatusChange(
    userId: string,
    oldStatus: UserStatus,
    newStatus: UserStatus,
    reason: string,
    changedBy: string,
    constructoraId: string | null,
  ): Promise<void> {
    // Solo notificar si el cambio NO fue iniciado por el propio usuario
    if (changedBy !== userId) {
      // Notificación push
      await this.notificationService.send({
        userId,
        type: 'system_announcement',
        priority: newStatus === UserStatus.BANNED ? 'critical' : 'high',
        title: this.getNotificationTitle(newStatus, constructoraId),
        body: reason,
        icon: this.getStatusIcon(newStatus),
      });

      // Email
      const user = await this.profileRepo.findOne({ where: { id: userId } });
      await this.emailService.send({
        to: user.email,
        subject: this.getEmailSubject(newStatus),
        template: 'account-status-changed',
        data: {
          userName: user.fullName,
          newStatus,
          oldStatus,
          reason,
          constructoraId,
          supportEmail: process.env.SUPPORT_EMAIL,
        },
      });
    }
  }

  private getNotificationTitle(status: UserStatus, constructoraId: string | null): string {
    const scope = constructoraId ? 'en esta constructora' : 'globalmente';

    switch (status) {
      case UserStatus.SUSPENDED:
        return `Tu cuenta ha sido suspendida ${scope}`;
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

  private getStatusIcon(status: UserStatus): string {
    const icons = {
      [UserStatus.SUSPENDED]: '⚠️',
      [UserStatus.BANNED]: '🚫',
      [UserStatus.ACTIVE]: '✅',
      [UserStatus.INACTIVE]: 'ℹ️',
      [UserStatus.PENDING]: '⏳',
    };
    return icons[status] || '🔔';
  }

  private getEmailSubject(status: UserStatus): string {
    switch (status) {
      case UserStatus.SUSPENDED:
        return 'Tu cuenta ha sido suspendida temporalmente';
      case UserStatus.BANNED:
        return 'Tu cuenta ha sido baneada permanentemente';
      case UserStatus.ACTIVE:
        return 'Tu cuenta ha sido reactivada';
      case UserStatus.INACTIVE:
        return 'Cuenta desactivada temporalmente';
      default:
        return 'Cambio en tu estado de cuenta';
    }
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(password, hash);
  }
}
```

---

### 4. Backend - Middleware de Validación de Estado

**Ubicación:** `apps/backend/src/modules/auth/middleware/user-status.middleware.ts`

```typescript
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserStatus } from '../enums/user-status.enum';

/**
 * Middleware que valida estado de usuario en CADA request autenticado
 *
 * Valida:
 * 1. Estado global del perfil (no banned, no pending)
 * 2. Estado en constructora actual (active)
 */
@Injectable()
export class UserStatusMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as any;

    // Si no hay usuario, continuar (otros guards manejarán autenticación)
    if (!user) {
      return next();
    }

    // Excepciones: endpoints que permiten ciertos estados
    const allowedPaths = [
      '/auth/reactivate',           // inactive puede reactivar
      '/auth/status',               // consultar estado
      '/auth/switch-constructora',  // cambiar constructora
      '/auth/deactivate',           // active puede desactivar
      '/auth/logout',               // cualquiera puede cerrar sesión
    ];

    if (allowedPaths.some(path => req.path.startsWith(path))) {
      return next();
    }

    // Validar estado global del perfil
    if (user.profileStatus === UserStatus.BANNED) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Tu cuenta ha sido baneada permanentemente.',
        errorCode: 'ACCOUNT_BANNED',
        contactSupport: true,
      });
    }

    if (user.profileStatus === UserStatus.PENDING) {
      throw new ForbiddenException({
        statusCode: 403,
        message: 'Debes verificar tu email antes de acceder.',
        errorCode: 'EMAIL_NOT_VERIFIED',
        action: 'verify_email',
      });
    }

    // Validar estado en constructora actual
    if (user.constructoraId && user.constructoraStatus !== UserStatus.ACTIVE) {
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
import { UserStatusMiddleware } from './modules/auth/middleware/user-status.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Aplicar middleware globalmente
  app.use(UserStatusMiddleware);

  await app.listen(3000);
}
```

---

## 🧪 Testing

### Test Suite 1: Funciones de Base de Datos

```typescript
// apps/backend/test/database/user-status-functions.spec.ts
describe('User Status Database Functions', () => {
  describe('suspend_user_in_constructora()', () => {
    it('should suspend active user in constructora', async () => {
      const user = await createUser({ status: UserStatus.ACTIVE });
      const constructora = await createConstructora();
      await assignToConstructora(user.id, constructora.id, 'engineer');

      await db.query(`
        SELECT auth_management.suspend_user_in_constructora($1, $2, $3, $4, $5)
      `, [user.id, constructora.id, 'Test suspension', 14, adminUser.id]);

      const userConstructora = await getUserConstructora(user.id, constructora.id);
      expect(userConstructora.status).toBe(UserStatus.SUSPENDED);
      expect(userConstructora.suspendedReason).toBe('Test suspension');
    });

    it('should reject suspension with short reason', async () => {
      await expect(
        db.query(`
          SELECT auth_management.suspend_user_in_constructora($1, $2, $3, $4, $5)
        `, [user.id, constructora.id, 'Short', 14, adminUser.id])
      ).rejects.toThrow('at least 20 characters');
    });
  });

  describe('ban_user_globally()', () => {
    it('should ban user in all constructoras', async () => {
      const user = await createUser();
      const constructoraA = await createConstructora();
      const constructoraB = await createConstructora();

      await assignToConstructora(user.id, constructoraA.id, 'engineer');
      await assignToConstructora(user.id, constructoraB.id, 'director');

      const reason = 'Fraude financiero comprobado con evidencia documental y testimonio de testigos';
      await db.query(`
        SELECT auth_management.ban_user_globally($1, $2, $3)
      `, [user.id, reason, adminUser.id]);

      // Verificar perfil global
      const profile = await getProfile(user.id);
      expect(profile.status).toBe(UserStatus.BANNED);

      // Verificar ambas constructoras
      const ucA = await getUserConstructora(user.id, constructoraA.id);
      const ucB = await getUserConstructora(user.id, constructoraB.id);
      expect(ucA.status).toBe(UserStatus.BANNED);
      expect(ucB.status).toBe(UserStatus.BANNED);

      // Verificar email bloqueado
      const bannedEmail = await getBannedEmail(user.email);
      expect(bannedEmail).toBeDefined();
      expect(bannedEmail.reason).toBe(reason);
    });

    it('should reject ban with insufficient reason', async () => {
      await expect(
        db.query(`
          SELECT auth_management.ban_user_globally($1, $2, $3)
        `, [user.id, 'Too short', adminUser.id])
      ).rejects.toThrow('at least 50 characters');
    });
  });

  describe('reactivate_user()', () => {
    it('should enforce rate limiting (max 3/day)', async () => {
      const user = await createUser({ status: UserStatus.INACTIVE });

      // Primera reactivación: OK
      await db.query(`SELECT auth_management.reactivate_user($1)`, [user.id]);
      await db.query(`UPDATE auth_management.profiles SET status = 'inactive' WHERE id = $1`, [user.id]);

      // Segunda: OK
      await db.query(`SELECT auth_management.reactivate_user($1)`, [user.id]);
      await db.query(`UPDATE auth_management.profiles SET status = 'inactive' WHERE id = $1`, [user.id]);

      // Tercera: OK
      await db.query(`SELECT auth_management.reactivate_user($1)`, [user.id]);
      await db.query(`UPDATE auth_management.profiles SET status = 'inactive' WHERE id = $1`, [user.id]);

      // Cuarta: DEBE FALLAR
      await expect(
        db.query(`SELECT auth_management.reactivate_user($1)`, [user.id])
      ).rejects.toThrow('Maximum reactivations per day reached');
    });
  });
});
```

### Test Suite 2: Service Integration

```typescript
// apps/backend/src/modules/auth/services/user-status.service.spec.ts
describe('UserStatusService', () => {
  let service: UserStatusService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserStatusService, ...mockProviders],
    }).compile();

    service = module.get<UserStatusService>(UserStatusService);
  });

  describe('suspendUserInConstructora', () => {
    it('should send notification to suspended user', async () => {
      const user = await createUser();
      const constructora = await createConstructora();
      const notificationSpy = jest.spyOn(service['notificationService'], 'send');

      await service.suspendUserInConstructora(
        user.id,
        constructora.id,
        'Comportamiento inapropiado en obra',
        14,
        adminUser.id,
      );

      expect(notificationSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: user.id,
          type: 'system_announcement',
          priority: 'high',
        })
      );
    });
  });

  describe('isEmailBanned', () => {
    it('should return true for banned email', async () => {
      await createBannedEmail('banned@test.com');

      const isBanned = await service.isEmailBanned('banned@test.com');
      expect(isBanned).toBe(true);
    });

    it('should return false for non-banned email', async () => {
      const isBanned = await service.isEmailBanned('clean@test.com');
      expect(isBanned).toBe(false);
    });
  });
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-AUTH-002: Estados de Cuenta](../requerimientos/RF-AUTH-002-estados-cuenta.md)
- 📄 [RF-AUTH-003: Multi-tenancy](../requerimientos/RF-AUTH-003-multi-tenancy.md)
- 📄 [ET-AUTH-001: RBAC](./ET-AUTH-001-rbac.md)

### Estándares y Regulaciones
- [GDPR Article 17: Right to Erasure](https://gdpr-info.eu/art-17-gdpr/)
- [Ley Federal de Protección de Datos Personales (México)](https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Team | Creación inicial adaptada de GAMILIT con multi-tenancy |

---

**Documento:** `MAI-001-fundamentos/especificaciones/ET-AUTH-002-estados-cuenta.md`
**Ruta absoluta:** `/home/isem/workspace/worskpace-inmobiliaria/docs/01-fase-alcance-inicial/MAI-001-fundamentos/especificaciones/ET-AUTH-002-estados-cuenta.md`
**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @database-team
