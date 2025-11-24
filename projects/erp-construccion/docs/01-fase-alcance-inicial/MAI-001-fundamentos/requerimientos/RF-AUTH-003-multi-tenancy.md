# RF-AUTH-003: Multi-tenancy por Constructora

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | RF-AUTH-003 |
| **Épica** | MAI-001 - Fundamentos |
| **Módulo** | Autenticación y Multi-tenancy |
| **Prioridad** | Crítica |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |
| **Esfuerzo estimado** | 18h |
| **Story Points** | 8 SP |

## 🔗 Referencias

### Especificación Técnica
📐 [ET-AUTH-003: Multi-tenancy Implementation](../especificaciones/ET-AUTH-003-multi-tenancy.md) *(Pendiente)*

### Origen (GAMILIT)
♻️ **Reutilización:** 0% - Funcionalidad nueva
- **Justificación:** GAMILIT no requiere multi-tenancy a nivel de organización
- **Adaptación:** Implementación completa desde cero para construcción
- **Beneficio:** Permite que profesionales trabajen en múltiples constructoras

### Documentos Relacionados
- 📄 [RF-AUTH-001: Sistema de Roles](./RF-AUTH-001-roles-construccion.md) - Roles pueden variar por constructora
- 📄 [RF-AUTH-002: Estados de Cuenta](./RF-AUTH-002-estados-cuenta.md) - Estados pueden variar por constructora
- 📄 [US-FUND-001: Autenticación Básica JWT](../historias-usuario/US-FUND-001-autenticacion-basica-jwt.md) - Login con selector de constructora

### Implementación DDL

🗄️ **Tablas Principales:**

```sql
-- apps/database/ddl/schemas/auth_management/tables/constructoras.sql
CREATE TABLE auth_management.constructoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre VARCHAR(255) NOT NULL,
  razon_social VARCHAR(500) NOT NULL,
  rfc VARCHAR(13) NOT NULL UNIQUE,
  logo_url VARCHAR(1000),
  settings JSONB DEFAULT '{}'::JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_constructoras_rfc ON auth_management.constructoras(rfc);
CREATE INDEX idx_constructoras_active ON auth_management.constructoras(active);

-- apps/database/ddl/schemas/auth_management/tables/user-constructoras.sql
CREATE TABLE auth_management.user_constructoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id) ON DELETE CASCADE,
  role construction_role NOT NULL,
  status user_status NOT NULL DEFAULT 'active',
  is_primary BOOLEAN DEFAULT FALSE,
  invited_by UUID REFERENCES auth_management.profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id, constructora_id)
);

CREATE INDEX idx_user_constructoras_user ON auth_management.user_constructoras(user_id);
CREATE INDEX idx_user_constructoras_constructora ON auth_management.user_constructoras(constructora_id);
CREATE INDEX idx_user_constructoras_status ON auth_management.user_constructoras(user_id, status);

-- Constraint: Solo una constructora primaria por usuario
CREATE UNIQUE INDEX idx_user_primary_constructora
  ON auth_management.user_constructoras(user_id)
  WHERE is_primary = TRUE;
```

🗄️ **Funciones de Context:**

```sql
-- apps/database/ddl/schemas/auth_management/functions/context.sql

-- Obtener constructora actual del usuario (desde JWT)
CREATE OR REPLACE FUNCTION auth_management.get_current_constructora_id()
RETURNS UUID AS $$
BEGIN
  RETURN NULLIF(current_setting('app.current_constructora_id', true), '')::UUID;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Verificar si usuario tiene acceso a constructora
CREATE OR REPLACE FUNCTION auth_management.user_has_access_to_constructora(
  p_user_id UUID,
  p_constructora_id UUID
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth_management.user_constructoras
    WHERE user_id = p_user_id
      AND constructora_id = p_constructora_id
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Obtener rol del usuario en constructora actual
CREATE OR REPLACE FUNCTION auth_management.get_user_role_in_constructora(
  p_user_id UUID,
  p_constructora_id UUID
) RETURNS construction_role AS $$
DECLARE
  v_role construction_role;
BEGIN
  SELECT role INTO v_role
  FROM auth_management.user_constructoras
  WHERE user_id = p_user_id
    AND constructora_id = p_constructora_id
    AND status = 'active';

  RETURN v_role;
END;
$$ LANGUAGE plpgsql STABLE;

-- Obtener constructoras activas del usuario
CREATE OR REPLACE FUNCTION auth_management.get_user_active_constructoras(
  p_user_id UUID
) RETURNS TABLE (
  constructora_id UUID,
  nombre VARCHAR,
  role construction_role,
  is_primary BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.nombre,
    uc.role,
    uc.is_primary
  FROM auth_management.user_constructoras uc
  INNER JOIN auth_management.constructoras c ON c.id = uc.constructora_id
  WHERE uc.user_id = p_user_id
    AND uc.status = 'active'
    AND c.active = TRUE
  ORDER BY uc.is_primary DESC, c.nombre ASC;
END;
$$ LANGUAGE plpgsql STABLE;
```

🗄️ **Row Level Security (RLS) Policies:**

```sql
-- Ejemplo: Tabla de proyectos con RLS por constructora
CREATE POLICY "users_view_own_constructora_projects"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_access_to_constructora(
      auth_management.get_current_user_id(),
      constructora_id
    )
  );

CREATE POLICY "users_create_in_own_constructora"
  ON projects.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
  );
```

### Backend

💻 **Implementación:**

```typescript
// apps/backend/src/modules/auth/entities/constructora.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('constructoras', { schema: 'auth_management' })
export class Constructora {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 500 })
  razonSocial: string;

  @Column({ type: 'varchar', length: 13, unique: true })
  rfc: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  logoUrl: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// apps/backend/src/modules/auth/entities/user-constructora.entity.ts
@Entity('user_constructoras', { schema: 'auth_management' })
export class UserConstructora {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  constructoraId: string;

  @Column({ type: 'enum', enum: ConstructionRole })
  role: ConstructionRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'boolean', default: false })
  isPrimary: boolean;

  @Column({ type: 'uuid', nullable: true })
  invitedBy: string;

  @Column({ type: 'timestamp with time zone', default: () => 'NOW()' })
  invitedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  joinedAt: Date;

  @ManyToOne(() => Profile)
  @JoinColumn({ name: 'user_id' })
  user: Profile;

  @ManyToOne(() => Constructora)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;
}

// apps/backend/src/modules/auth/guards/constructora.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ConstructoraGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Validar que el usuario tenga acceso a la constructora
    if (!user.constructoraId) {
      throw new ForbiddenException('No se ha seleccionado una constructora');
    }

    const hasAccess = await this.userConstructoraRepository.findOne({
      where: {
        userId: user.id,
        constructoraId: user.constructoraId,
        status: UserStatus.ACTIVE,
      },
    });

    if (!hasAccess) {
      throw new ForbiddenException(
        'No tienes acceso a esta constructora o tu acceso está inactivo'
      );
    }

    return true;
  }
}
```

### Frontend

🎨 **Componentes:**

```typescript
// apps/frontend/src/features/auth/ConstructoraSelector.tsx
interface ConstructoraSelectorProps {
  constructoras: Constructora[];
  onSelect: (constructoraId: string) => void;
}

export const ConstructoraSelector: React.FC<ConstructoraSelectorProps> = ({
  constructoras,
  onSelect,
}) => {
  return (
    <div className="constructora-selector">
      <h3>Selecciona una constructora</h3>
      <div className="constructora-grid">
        {constructoras.map(constructora => (
          <button
            key={constructora.id}
            onClick={() => onSelect(constructora.id)}
            className="constructora-card"
          >
            <img src={constructora.logoUrl} alt={constructora.nombre} />
            <h4>{constructora.nombre}</h4>
            <span className="role-badge">{constructora.role}</span>
            {constructora.isPrimary && <span className="primary-badge">Principal</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

// apps/frontend/src/stores/constructora-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ConstructoraStore {
  currentConstructora: Constructora | null;
  constructoras: Constructora[];
  setCurrentConstructora: (constructora: Constructora) => void;
  setConstructoras: (constructoras: Constructora[]) => void;
  switchConstructora: (constructoraId: string) => Promise<void>;
}

export const useConstructoraStore = create<ConstructoraStore>()(
  persist(
    (set, get) => ({
      currentConstructora: null,
      constructoras: [],

      setCurrentConstructora: (constructora) => set({ currentConstructora: constructora }),

      setConstructoras: (constructoras) => set({ constructoras }),

      switchConstructora: async (constructoraId) => {
        const response = await api.post('/auth/switch-constructora', {
          constructoraId,
        });

        const newToken = response.data.accessToken;
        localStorage.setItem('accessToken', newToken);

        const constructora = get().constructoras.find(c => c.id === constructoraId);
        set({ currentConstructora: constructora });

        // Recargar página para actualizar contexto
        window.location.reload();
      },
    }),
    {
      name: 'constructora-storage',
    }
  )
);
```

### Trazabilidad
📊 [TRACEABILITY.yml](../implementacion/TRACEABILITY.yml#L15-L44)

---

## 📝 Descripción del Requerimiento

### Contexto

En la industria de la construcción, es **común** que profesionales trabajen simultáneamente para **múltiples empresas constructoras**:

**Ejemplos del Mundo Real:**
- 🏗️ **Ingeniero Freelance:** Proporciona servicios de planeación a 3 constructoras diferentes
- 👨‍💼 **Residente de Obra:** Trabaja medio tiempo en "Constructora A" y medio tiempo en "Constructora B"
- 💼 **Director de Proyectos:** Socio en 2 constructoras y consultor externo en 1 más
- 📊 **Contador Externo:** Lleva contabilidad de 5 constructoras pequeñas
- 🛒 **Coordinador de Compras:** Trabaja para 2 constructoras del mismo grupo empresarial

### Necesidad del Negocio

**Problema (Sin Multi-tenancy):**
Sin un sistema multi-tenant robusto:

1. ❌ **Usuario necesita múltiples cuentas:** Un ingeniero que trabaja en 3 constructoras necesitaría 3 emails diferentes
2. ❌ **No hay aislamiento de datos:** Riesgo de que constructora A vea datos de constructora B
3. ❌ **Complejidad en permisos:** No se puede modelar que un usuario sea "director" en una empresa y "residente" en otra
4. ❌ **Experiencia de usuario pobre:** Usuario debe cerrar sesión y volver a iniciar en cada empresa
5. ❌ **Difícil auditoría:** No queda claro en qué contexto (constructora) se realizó cada acción

**Solución (Multi-tenancy por Constructora):**
✅ **Un email, múltiples constructoras:** Usuario accede con un solo email a todas sus constructoras
✅ **Aislamiento total de datos:** RLS garantiza que datos de cada constructora estén separados
✅ **Roles por constructora:** Usuario puede ser "director" en A y "resident" en B simultáneamente
✅ **Cambio fluido:** Usuario cambia de constructora sin cerrar sesión (switch token)
✅ **Auditoría clara:** Cada acción registra en qué constructora se realizó

---

## 🎯 Requerimiento Funcional

### RF-AUTH-003.1: Modelo de Datos Multi-tenant

El sistema **DEBE** implementar un modelo de multi-tenancy donde:

#### Entidades Principales

**1. Constructora (Tenant)**
```typescript
interface Constructora {
  id: string;                    // UUID
  nombre: string;                // "Constructora ABC S.A. de C.V."
  razonSocial: string;           // Razón social oficial
  rfc: string;                   // RFC único (13 caracteres)
  logoUrl: string;               // URL del logo
  settings: {
    timezone?: string;           // "America/Mexico_City"
    currency?: string;           // "MXN"
    locale?: string;             // "es-MX"
    fiscalRegime?: string;       // "601 - General de Ley Personas Morales"
    mainAddress?: Address;
    billingConfig?: BillingConfig;
  };
  active: boolean;               // true = operando, false = inactiva
  createdAt: Date;
  updatedAt: Date;
}
```

**Validaciones:**
- `rfc`: Debe ser RFC válido mexicano (13 caracteres para persona moral)
- `nombre`: Mínimo 3 caracteres, máximo 255
- `razonSocial`: Mínimo 5 caracteres, máximo 500
- `active`: Solo super_admin puede cambiar

**2. User-Constructora (Relación Many-to-Many)**
```typescript
interface UserConstructora {
  id: string;
  userId: string;               // Usuario
  constructoraId: string;       // Constructora
  role: ConstructionRole;       // Rol del usuario EN ESTA constructora
  status: UserStatus;           // Estado EN ESTA constructora
  isPrimary: boolean;           // true = constructora principal del usuario
  invitedBy: string;            // UUID del usuario que invitó
  invitedAt: Date;              // Fecha de invitación
  joinedAt: Date | null;        // Fecha en que aceptó invitación (verificó email)
  createdAt: Date;
  updatedAt: Date;
}
```

**Validaciones:**
- `userId` + `constructoraId`: Unique constraint (usuario no puede estar duplicado en misma constructora)
- `isPrimary`: Solo UNA constructora puede ser primaria por usuario
- `role`: Puede ser diferente en cada constructora
- `status`: Puede ser diferente en cada constructora (ej: activo en A, suspendido en B)

---

### RF-AUTH-003.2: Flujo de Invitación a Constructora

#### Caso 1: Usuario Nuevo (No existe en sistema)

**Flujo:**
1. **Director de Constructora A** invita a "ingeniero@email.com"
2. Sistema verifica que email NO existe en `profiles`
3. Sistema crea registro en `invitations`:
   ```typescript
   {
     email: "ingeniero@email.com",
     constructoraId: "constructora-a-uuid",
     role: "engineer",
     invitedBy: "director-uuid",
     token: "random-secure-token",
     expiresAt: NOW() + 7 days
   }
   ```
4. Sistema envía email:
   ```
   Asunto: Has sido invitado a Constructora ABC

   Hola,

   El Director López te ha invitado a unirte a Constructora ABC como Ingeniero.

   Para aceptar la invitación, haz click aquí:
   https://app.constructora.com/auth/accept-invitation?token=xyz123

   Esta invitación expira en 7 días.
   ```
5. Usuario hace click en link
6. Sistema muestra formulario de registro:
   - Email: ingeniero@email.com (pre-llenado, readonly)
   - Nombre completo
   - Contraseña
   - Confirmar contraseña
7. Usuario completa formulario y hace click en "Registrarme"
8. Sistema ejecuta transacción:
   ```sql
   BEGIN;

   -- Crear perfil
   INSERT INTO auth_management.profiles (email, password_hash, full_name, status)
   VALUES ('ingeniero@email.com', hash, 'Juan Pérez', 'pending');

   -- Asociar a constructora
   INSERT INTO auth_management.user_constructoras (
     user_id, constructora_id, role, status, is_primary, invited_by, joined_at
   ) VALUES (
     new_user_id, 'constructora-a-uuid', 'engineer', 'pending', true, 'director-uuid', NOW()
   );

   -- Marcar invitación como aceptada
   UPDATE invitations SET status = 'accepted' WHERE token = 'xyz123';

   COMMIT;
   ```
9. Sistema envía email de verificación
10. Usuario verifica email → `profiles.status` y `user_constructoras.status` cambian a `'active'`
11. Usuario puede hacer login

**Resultado:** Usuario nuevo creado y asociado a su primera constructora

---

#### Caso 2: Usuario Existente (Ya registrado)

**Flujo:**
1. **Director de Constructora B** invita a "ingeniero@email.com" (que ya trabaja en Constructora A)
2. Sistema detecta que email YA existe en `profiles`
3. Sistema crea invitación:
   ```typescript
   {
     email: "ingeniero@email.com",
     userId: "existing-user-uuid", // Ya conocido
     constructoraId: "constructora-b-uuid",
     role: "resident", // Diferente rol
     invitedBy: "director-b-uuid",
     token: "random-secure-token",
     expiresAt: NOW() + 7 days
   }
   ```
4. Sistema envía email:
   ```
   Asunto: Nueva invitación a Constructora XYZ

   Hola Juan,

   El Director Gómez te ha invitado a unirte a Constructora XYZ como Residente de Obra.

   Para aceptar la invitación, haz click aquí:
   https://app.constructora.com/auth/accept-invitation?token=abc456

   Esta invitación expira en 7 días.
   ```
5. Usuario (ya tiene cuenta) hace click en link
6. Sistema detecta que usuario está autenticado O solicita login
7. Sistema muestra confirmación:
   ```
   Constructora XYZ te ha invitado como Residente de Obra

   ¿Deseas aceptar esta invitación?

   [Aceptar] [Rechazar]
   ```
8. Usuario hace click en "Aceptar"
9. Sistema asocia usuario a nueva constructora:
   ```sql
   INSERT INTO auth_management.user_constructoras (
     user_id, constructora_id, role, status, is_primary, invited_by, joined_at
   ) VALUES (
     'existing-user-uuid', 'constructora-b-uuid', 'resident', 'active', false, 'director-b-uuid', NOW()
   );
   ```
10. Sistema muestra:
    ```
    ¡Listo! Ahora tienes acceso a Constructora XYZ

    Tus constructoras:
    - Constructora ABC (Ingeniero) ⭐ Principal
    - Constructora XYZ (Residente de Obra)

    [Ir a Constructora XYZ]
    ```

**Resultado:** Usuario existente asociado a nueva constructora con rol diferente

---

### RF-AUTH-003.3: Login Multi-tenant

El sistema **DEBE** manejar login de usuarios con acceso a múltiples constructoras:

#### Flujo de Login

**Paso 1: Credenciales**
```typescript
// POST /api/auth/login
{
  "email": "ingeniero@email.com",
  "password": "password123"
}
```

**Paso 2: Validación**
```typescript
async login(email: string, password: string) {
  // 1. Buscar usuario
  const user = await this.profileRepository.findOne({ where: { email } });

  // 2. Validar password
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

  // 3. Validar estado global
  if (user.status === 'banned') {
    throw new UnauthorizedException('Account banned');
  }

  // 4. Obtener constructoras activas
  const constructoras = await this.getActiveConstructoras(user.id);

  if (constructoras.length === 0) {
    throw new UnauthorizedException('No active access to any constructora');
  }

  // 5A. Si solo tiene 1 constructora: login directo
  if (constructoras.length === 1) {
    const token = this.generateJwt(user, constructoras[0]);
    return {
      accessToken: token,
      user: user,
      currentConstructora: constructoras[0],
    };
  }

  // 5B. Si tiene múltiples: retornar lista para que elija
  return {
    requiresConstructoraSelection: true,
    user: user,
    constructoras: constructoras, // Usuario debe elegir
  };
}
```

**Paso 3A: Respuesta (1 sola constructora)**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "ingeniero@email.com",
    "fullName": "Juan Pérez"
  },
  "currentConstructora": {
    "id": "constructora-a-uuid",
    "nombre": "Constructora ABC",
    "role": "engineer"
  }
}
```

**Paso 3B: Respuesta (Múltiples constructoras)**
```json
{
  "requiresConstructoraSelection": true,
  "user": {
    "id": "user-uuid",
    "email": "ingeniero@email.com",
    "fullName": "Juan Pérez"
  },
  "constructoras": [
    {
      "id": "constructora-a-uuid",
      "nombre": "Constructora ABC",
      "logoUrl": "https://...",
      "role": "engineer",
      "isPrimary": true
    },
    {
      "id": "constructora-b-uuid",
      "nombre": "Constructora XYZ",
      "logoUrl": "https://...",
      "role": "resident",
      "isPrimary": false
    }
  ]
}
```

**Paso 4: Usuario selecciona constructora**
```typescript
// POST /api/auth/select-constructora
{
  "userId": "user-uuid",
  "constructoraId": "constructora-b-uuid",
  "tempToken": "temp-token-from-step-3" // Token temporal de 5 min
}

// Respuesta:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "currentConstructora": {
    "id": "constructora-b-uuid",
    "nombre": "Constructora XYZ",
    "role": "resident"
  }
}
```

**JWT Payload:**
```typescript
interface JwtPayload {
  sub: string;              // userId
  email: string;
  fullName: string;
  constructoraId: string;   // 🔑 Constructora seleccionada
  role: ConstructionRole;   // 🔑 Rol EN ESTA constructora
  iat: number;
  exp: number;
}
```

---

### RF-AUTH-003.4: Cambio de Constructora (Switch)

El sistema **DEBE** permitir cambiar de constructora **sin cerrar sesión**:

#### Flujo de Switch

**Paso 1: Usuario hace click en selector de constructora en UI**
```tsx
<ConstructoraSwitcher
  current={currentConstructora}
  available={userConstructoras}
  onSwitch={(constructoraId) => switchConstructora(constructoraId)}
/>
```

**Paso 2: Request al backend**
```typescript
// POST /api/auth/switch-constructora
// Headers: Authorization: Bearer <current-token>
{
  "constructoraId": "constructora-b-uuid"
}
```

**Paso 3: Backend valida y genera nuevo token**
```typescript
@Post('switch-constructora')
@UseGuards(JwtAuthGuard) // Requiere estar autenticado
async switchConstructora(
  @CurrentUser() user: User,
  @Body() dto: SwitchConstructoraDto
): Promise<{ accessToken: string }> {
  // 1. Validar que usuario tiene acceso a constructora destino
  const hasAccess = await this.userConstructoraRepository.findOne({
    where: {
      userId: user.id,
      constructoraId: dto.constructoraId,
      status: UserStatus.ACTIVE,
    },
    relations: ['constructora'],
  });

  if (!hasAccess) {
    throw new ForbiddenException('No tienes acceso a esta constructora');
  }

  // 2. Generar nuevo JWT con nueva constructora
  const newToken = this.jwtService.sign({
    sub: user.id,
    email: user.email,
    fullName: user.fullName,
    constructoraId: dto.constructoraId,
    role: hasAccess.role, // Nuevo rol (puede ser diferente)
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24h
  });

  // 3. Auditar cambio de contexto
  await this.auditService.log({
    action: 'switch_constructora',
    userId: user.id,
    details: {
      from: user.constructoraId,
      to: dto.constructoraId,
      timestamp: new Date(),
    },
  });

  return { accessToken: newToken };
}
```

**Paso 4: Frontend actualiza token y contexto**
```typescript
async function switchConstructora(constructoraId: string) {
  const response = await api.post('/auth/switch-constructora', {
    constructoraId,
  });

  // Actualizar token en localStorage
  localStorage.setItem('accessToken', response.data.accessToken);

  // Actualizar estado global
  useConstructoraStore.getState().setCurrentConstructora(
    constructoras.find(c => c.id === constructoraId)
  );

  // Recargar aplicación para aplicar nuevo contexto
  window.location.reload();
}
```

**Resultado:**
- ✅ Usuario cambia de constructora sin volver a hacer login
- ✅ Nuevo token con `constructoraId` y `role` actualizados
- ✅ RLS en base de datos usa nuevo contexto automáticamente
- ✅ UI se actualiza mostrando datos de nueva constructora

---

### RF-AUTH-003.5: Aislamiento de Datos (Row Level Security)

El sistema **DEBE** garantizar aislamiento TOTAL de datos entre constructoras usando RLS:

#### Implementación RLS

**Paso 1: Configurar contexto en cada request**
```typescript
// apps/backend/src/common/interceptors/set-rls-context.interceptor.ts
@Injectable()
export class SetRlsContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Del JWT

    if (user) {
      // Configurar variables de sesión de PostgreSQL
      return from(
        this.dataSource.query(`
          SELECT set_config('app.current_user_id', $1, true),
                 set_config('app.current_constructora_id', $2, true),
                 set_config('app.current_user_role', $3, true)
        `, [user.id, user.constructoraId, user.role])
      ).pipe(
        switchMap(() => next.handle())
      );
    }

    return next.handle();
  }
}
```

**Paso 2: Políticas RLS en todas las tablas de negocio**

```sql
-- Ejemplo: Tabla de proyectos
CREATE POLICY "users_view_own_constructora_projects"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
  );

CREATE POLICY "users_create_in_own_constructora"
  ON projects.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
  );

-- Ejemplo: Tabla de empleados
CREATE POLICY "users_view_own_constructora_employees"
  ON hr.employees
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
  );

-- Ejemplo: Tabla de presupuestos
CREATE POLICY "directors_engineers_view_budgets"
  ON budgets.budgets
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() IN ('director', 'engineer', 'finance')
  );
```

**Paso 3: Testing de aislamiento**

```typescript
describe('Multi-tenancy Data Isolation', () => {
  it('should NOT allow user to see projects from other constructora', async () => {
    // Setup: 2 constructoras con 1 proyecto cada una
    const constructoraA = await createConstructora({ nombre: 'Constructora A' });
    const constructoraB = await createConstructora({ nombre: 'Constructora B' });

    const projectA = await createProject({
      nombre: 'Proyecto A',
      constructoraId: constructoraA.id,
    });

    const projectB = await createProject({
      nombre: 'Proyecto B',
      constructoraId: constructoraB.id,
    });

    // Usuario con acceso SOLO a constructora A
    const user = await createUser();
    await assignToConstructora(user.id, constructoraA.id, 'engineer');
    const token = await loginAs(user, constructoraA.id);

    // Act: Solicitar todos los proyectos
    const response = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    // Assert: Solo debe ver proyecto de constructora A
    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].id).toBe(projectA.id);
    expect(response.body.data[0].nombre).toBe('Proyecto A');

    // Proyecto B NO debe aparecer
    const projectBInResponse = response.body.data.find(p => p.id === projectB.id);
    expect(projectBInResponse).toBeUndefined();
  });
});
```

---

### RF-AUTH-003.6: Constructora Principal (Primary)

El sistema **DEBE** soportar concepto de "constructora principal":

#### Características

**Definición:**
- Usuario designa UNA constructora como "principal"
- Al hacer login con múltiples constructoras, se selecciona automáticamente la principal
- Usuario puede cambiar cuál es la principal en cualquier momento

**Reglas:**
- Solo UNA constructora puede ser principal por usuario
- Constraint a nivel de base de datos garantiza unicidad
- Si usuario elimina su única constructora principal, debe designar otra

**Implementación:**

```typescript
// PATCH /api/user/set-primary-constructora
async setPrimaryConstructora(
  userId: string,
  constructoraId: string
): Promise<void> {
  // 1. Validar que usuario tiene acceso
  const access = await this.userConstructoraRepository.findOne({
    where: { userId, constructoraId, status: UserStatus.ACTIVE },
  });

  if (!access) {
    throw new NotFoundException('No tienes acceso a esta constructora');
  }

  // 2. Transacción: quitar primary de anterior y asignar a nueva
  await this.dataSource.transaction(async (manager) => {
    // Quitar is_primary de todas las constructoras del usuario
    await manager.update(
      UserConstructora,
      { userId },
      { isPrimary: false }
    );

    // Asignar is_primary a la nueva
    await manager.update(
      UserConstructora,
      { userId, constructoraId },
      { isPrimary: true }
    );
  });

  // 3. Auditar
  await this.auditService.log({
    action: 'set_primary_constructora',
    userId,
    details: { constructoraId },
  });
}
```

**UI:**

```tsx
// Componente de lista de constructoras del usuario
<div className="constructora-list">
  {userConstructoras.map(uc => (
    <div key={uc.id} className="constructora-item">
      <img src={uc.constructora.logoUrl} />
      <h4>{uc.constructora.nombre}</h4>
      <span className="role-badge">{uc.role}</span>

      {uc.isPrimary ? (
        <span className="primary-badge">⭐ Principal</span>
      ) : (
        <button onClick={() => setPrimary(uc.constructoraId)}>
          Marcar como principal
        </button>
      )}
    </div>
  ))}
</div>
```

---

## 📊 Casos de Uso

### UC-MT-001: Ingeniero freelance trabaja en 3 constructoras

**Actor:** Ingeniero de Planeación
**Precondiciones:** Usuario registrado

**Flujo:**
1. **Constructora A** invita a ingeniero@email.com como "engineer"
2. Ingeniero acepta, verifica email, tiene acceso a Constructora A
3. Ingeniero marca Constructora A como principal
4. **Constructora B** invita a ingeniero@email.com como "engineer"
5. Ingeniero (ya autenticado) acepta invitación desde panel
6. Ingeniero ahora tiene acceso a:
   - Constructora A (Ingeniero) ⭐ Principal
   - Constructora B (Ingeniero)
7. **Constructora C** invita a ingeniero@email.com como "director"
8. Ingeniero acepta
9. Ingeniero ahora tiene:
   - Constructora A (Ingeniero) ⭐ Principal
   - Constructora B (Ingeniero)
   - Constructora C (Director) ← Rol diferente
10. Ingeniero hace login una vez
11. Sistema le muestra selector de 3 constructoras
12. Ingeniero selecciona Constructora A (principal pre-seleccionada)
13. Ingeniero trabaja en Constructora A
14. Ingeniero hace click en selector de constructora en header
15. Ingeniero selecciona "Constructora C"
16. Sistema regenera token con `constructoraId=C` y `role=director`
17. UI se actualiza mostrando dashboard de director
18. Ingeniero trabaja en Constructora C con permisos de director

**Resultado:**
- ✅ Un email, 3 constructoras
- ✅ Roles diferentes en cada constructora
- ✅ Cambio fluido entre contextos
- ✅ Datos aislados por constructora

---

### UC-MT-002: Director crea nueva constructora e invita equipo

**Actor:** Director de Construcción
**Precondiciones:** Usuario con acceso al sistema

**Flujo:**
1. Director navega a `/admin/constructoras/create`
2. Director completa formulario:
   - Nombre: "Constructora Nueva S.A."
   - Razón Social: "Constructora Nueva Sociedad Anónima de Capital Variable"
   - RFC: "CNN123456ABC"
   - Logo: (sube imagen)
3. Director hace click en "Crear Constructora"
4. Sistema crea constructora
5. Sistema automáticamente asocia al director como primer usuario:
   ```sql
   INSERT INTO user_constructoras (user_id, constructora_id, role, status, is_primary)
   VALUES (director_id, new_constructora_id, 'director', 'active', false);
   ```
6. Director navega a `/admin/users/invite`
7. Director invita usuarios:
   - ingeniero@email.com → Ingeniero
   - residente1@email.com → Residente de Obra
   - residente2@email.com → Residente de Obra
   - compras@email.com → Compras
8. Sistema envía 4 emails de invitación
9. Usuarios aceptan invitaciones y verifican emails
10. Director ve en panel de usuarios:
    ```
    Usuarios activos en Constructora Nueva S.A.:
    - Director López (Director) ⭐ Tú
    - Ing. Juan Pérez (Ingeniero)
    - Residente Carlos Gómez (Residente de Obra)
    - Residente Ana Martínez (Residente de Obra)
    - María Torres (Compras)
    ```

**Resultado:**
- ✅ Constructora creada
- ✅ Equipo completo invitado
- ✅ Usuarios pueden acceder con diferentes roles

---

### UC-MT-003: Usuario suspendido en constructora A pero activo en B

**Actor:** Director de Constructora A
**Precondiciones:**
- Residente trabaja en Constructora A y Constructora B
- Residente cometió falta grave en Constructora A

**Flujo:**
1. Director de Constructora A suspende al residente por 14 días
2. Sistema actualiza:
   ```sql
   UPDATE user_constructoras
   SET status = 'suspended'
   WHERE user_id = residente_id
     AND constructora_id = constructora_a_id;
   ```
3. Residente intenta hacer login
4. Sistema detecta que tiene:
   - Constructora A: status = 'suspended'
   - Constructora B: status = 'active'
5. Sistema muestra solo Constructora B en selector
6. Residente hace login en Constructora B exitosamente
7. Residente puede trabajar normalmente en Constructora B
8. Residente intenta cambiar a Constructora A desde selector
9. Sistema muestra error: "Tu acceso a Constructora A está suspendido. Contacta al administrador."
10. Después de 14 días, Director de Constructora A levanta suspensión
11. Sistema actualiza status a 'active'
12. Residente ahora puede acceder a ambas constructoras

**Resultado:**
- ✅ Suspensión aislada por constructora
- ✅ No afecta acceso a otras constructoras
- ✅ Usuario puede seguir trabajando donde no está suspendido

---

## 🔐 Consideraciones de Seguridad

### 1. Prevención de Data Leakage entre Constructoras

**Problema:** Query malicioso podría intentar acceder a datos de otra constructora

**Solución: RLS aplicado en TODAS las tablas de negocio**

```sql
-- OBLIGATORIO en CADA tabla con constructora_id
ALTER TABLE projects.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE hr.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets.budgets ENABLE ROW LEVEL SECURITY;
-- ... etc

-- Política base (repetir en cada tabla)
CREATE POLICY "constructora_isolation"
  ON [tabla]
  FOR ALL
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
  );
```

**Testing:**
```typescript
it('should prevent SQL injection to access other constructora data', async () => {
  const userA = await createUserInConstructora('constructora-a');
  const projectB = await createProjectInConstructora('constructora-b');

  // Intentar inyección SQL
  const maliciousQuery = `
    SELECT * FROM projects.projects
    WHERE constructora_id = '${projectB.constructoraId}'
    -- Intentar bypass
  `;

  // Debe retornar 0 resultados (RLS bloquea)
  const result = await executeAsUser(userA, maliciousQuery);
  expect(result).toHaveLength(0);
});
```

---

### 2. Validación de Acceso en Cambio de Constructora

**Problema:** Usuario intenta cambiar a constructora a la que no tiene acceso

**Solución: Validar en backend antes de generar token**

```typescript
async switchConstructora(userId: string, constructoraId: string) {
  // 1. Verificar acceso
  const hasAccess = await this.db.query(`
    SELECT 1
    FROM auth_management.user_constructoras
    WHERE user_id = $1
      AND constructora_id = $2
      AND status = 'active'
  `, [userId, constructoraId]);

  if (hasAccess.rows.length === 0) {
    throw new ForbiddenException({
      statusCode: 403,
      message: 'No tienes acceso a esta constructora',
      errorCode: 'CONSTRUCTORA_ACCESS_DENIED',
    });
  }

  // 2. Generar token solo si tiene acceso
  return this.generateJwt(userId, constructoraId);
}
```

---

### 3. Auditoría de Cambios de Contexto

**Problema:** Difícil rastrear en qué constructora se realizó cada acción

**Solución: Incluir `constructora_id` en TODOS los audit logs**

```sql
-- Trigger en cada tabla
CREATE TRIGGER trg_audit_with_constructora
  AFTER INSERT OR UPDATE OR DELETE ON [tabla]
  FOR EACH ROW
  EXECUTE FUNCTION audit_logging.log_action_with_constructora();

-- Función
CREATE OR REPLACE FUNCTION audit_logging.log_action_with_constructora()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logging.audit_logs (
    action,
    table_name,
    record_id,
    user_id,
    constructora_id, -- 🔑 Incluir siempre
    old_data,
    new_data,
    timestamp
  ) VALUES (
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    auth_management.get_current_user_id(),
    auth_management.get_current_constructora_id(), -- 🔑 Contexto
    to_jsonb(OLD),
    to_jsonb(NEW),
    NOW()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

**Query de auditoría:**
```sql
-- Ver todas las acciones del usuario en Constructora A
SELECT *
FROM audit_logging.audit_logs
WHERE user_id = 'user-uuid'
  AND constructora_id = 'constructora-a-uuid'
ORDER BY timestamp DESC;
```

---

### 4. Expiración de Invitaciones

**Problema:** Invitaciones pendientes indefinidamente

**Solución: Cleanup automático de invitaciones expiradas**

```typescript
// Cron job: cada día a las 2 AM
@Cron('0 2 * * *')
async cleanupExpiredInvitations() {
  const result = await this.invitationRepository.delete({
    expiresAt: LessThan(new Date()),
    status: 'pending',
  });

  this.logger.log(`Deleted ${result.affected} expired invitations`);
}
```

---

## ✅ Criterios de Aceptación

### AC-001: Modelo de Datos
- [ ] Tabla `constructoras` creada con campos obligatorios
- [ ] Tabla `user_constructoras` creada con unique constraint (user_id, constructora_id)
- [ ] Constraint de una sola constructora principal por usuario funciona
- [ ] Índices creados en columnas de búsqueda frecuente

### AC-002: Invitaciones
- [ ] Director puede invitar usuario nuevo (no registrado)
- [ ] Director puede invitar usuario existente
- [ ] Email de invitación enviado con token válido
- [ ] Invitación expira después de 7 días
- [ ] Usuario puede aceptar invitación y asociarse a constructora
- [ ] Usuario puede rechazar invitación

### AC-003: Login Multi-tenant
- [ ] Usuario con 1 constructora: login directo
- [ ] Usuario con múltiples constructoras: muestra selector
- [ ] JWT incluye `constructoraId` y `role` correcto
- [ ] Constructora principal se pre-selecciona
- [ ] Login valida que usuario tenga al menos 1 constructora activa

### AC-004: Switch de Constructora
- [ ] Usuario puede cambiar de constructora sin cerrar sesión
- [ ] Nuevo token generado con `constructoraId` y `role` actualizados
- [ ] UI se actualiza mostrando datos de nueva constructora
- [ ] Cambio auditado en `audit_logs`
- [ ] Error claro si usuario no tiene acceso a constructora destino

### AC-005: Aislamiento de Datos (RLS)
- [ ] RLS habilitado en TODAS las tablas con `constructora_id`
- [ ] Usuario NO puede ver datos de otras constructoras
- [ ] Queries automáticamente filtran por `constructora_id` actual
- [ ] Testing demuestra aislamiento completo

### AC-006: Roles por Constructora
- [ ] Usuario puede tener diferentes roles en diferentes constructoras
- [ ] JWT incluye rol correcto según constructora actual
- [ ] Permisos se evalúan según rol en constructora actual

### AC-007: Estados por Constructora
- [ ] Usuario puede estar suspendido en A pero activo en B
- [ ] Login muestra solo constructoras donde status = 'active'
- [ ] Cambio a constructora suspendida bloqueado con error claro

### AC-008: Constructora Principal
- [ ] Usuario puede marcar una constructora como principal
- [ ] Solo una constructora puede ser principal (constraint)
- [ ] Login pre-selecciona constructora principal

---

## 🧪 Testing

### Test Suite: Multi-tenancy

#### Test 1: Data isolation between constructoras
```typescript
describe('Multi-tenancy Data Isolation', () => {
  it('should completely isolate data between constructoras', async () => {
    // Setup
    const constructoraA = await createConstructora({ nombre: 'A' });
    const constructoraB = await createConstructora({ nombre: 'B' });

    const userA = await createUser({ email: 'usera@test.com' });
    const userB = await createUser({ email: 'userb@test.com' });

    await assignToConstructora(userA.id, constructoraA.id, 'engineer');
    await assignToConstructora(userB.id, constructoraB.id, 'engineer');

    const projectA = await createProject({ constructoraId: constructoraA.id });
    const projectB = await createProject({ constructoraId: constructoraB.id });

    // Act: User A requests all projects
    const tokenA = await loginAs(userA, constructoraA.id);
    const responseA = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);

    // Assert: User A sees ONLY projectA
    expect(responseA.body.data).toHaveLength(1);
    expect(responseA.body.data[0].id).toBe(projectA.id);

    // Act: User B requests all projects
    const tokenB = await loginAs(userB, constructoraB.id);
    const responseB = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(200);

    // Assert: User B sees ONLY projectB
    expect(responseB.body.data).toHaveLength(1);
    expect(responseB.body.data[0].id).toBe(projectB.id);
  });
});
```

#### Test 2: User with multiple constructoras can switch
```typescript
it('should allow user to switch between constructoras', async () => {
  const user = await createUser();
  const constructoraA = await createConstructora({ nombre: 'A' });
  const constructoraB = await createConstructora({ nombre: 'B' });

  await assignToConstructora(user.id, constructoraA.id, 'engineer');
  await assignToConstructora(user.id, constructoraB.id, 'director');

  // Login in constructora A
  let token = await loginAs(user, constructoraA.id);
  let decoded = jwt.decode(token);
  expect(decoded.constructoraId).toBe(constructoraA.id);
  expect(decoded.role).toBe('engineer');

  // Switch to constructora B
  const switchResponse = await request(app.getHttpServer())
    .post('/auth/switch-constructora')
    .set('Authorization', `Bearer ${token}`)
    .send({ constructoraId: constructoraB.id })
    .expect(200);

  const newToken = switchResponse.body.accessToken;
  decoded = jwt.decode(newToken);
  expect(decoded.constructoraId).toBe(constructoraB.id);
  expect(decoded.role).toBe('director'); // Role changed!
});
```

#### Test 3: Invitation flow for new user
```typescript
it('should allow director to invite new user and user to accept', async () => {
  const director = await createDirector();
  const constructora = director.constructoras[0];

  // Director invites new user
  await loginAs(director);
  const inviteResponse = await request(app.getHttpServer())
    .post('/admin/users/invite')
    .send({
      email: 'newuser@test.com',
      constructoraId: constructora.id,
      role: 'resident',
    })
    .expect(201);

  const invitationToken = inviteResponse.body.token;

  // New user accepts invitation
  const registerResponse = await request(app.getHttpServer())
    .post('/auth/register-by-invitation')
    .send({
      token: invitationToken,
      password: 'SecurePass123!',
      fullName: 'Juan Pérez',
    })
    .expect(201);

  // Verify user was created and associated
  const newUser = await getUserByEmail('newuser@test.com');
  expect(newUser).toBeDefined();
  expect(newUser.status).toBe('pending'); // Needs email verification

  const association = await getUserConstructoraAssociation(newUser.id, constructora.id);
  expect(association.role).toBe('resident');
  expect(association.status).toBe('pending');
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-AUTH-001: Sistema de Roles](./RF-AUTH-001-roles-construccion.md)
- 📄 [RF-AUTH-002: Estados de Cuenta](./RF-AUTH-002-estados-cuenta.md)
- 📄 [US-FUND-001: Autenticación Básica JWT](../historias-usuario/US-FUND-001-autenticacion-basica-jwt.md)

### Recursos Técnicos
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-tenancy Patterns](https://docs.microsoft.com/en-us/azure/architecture/patterns/category/data-management)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Team | Creación inicial - Funcionalidad completamente nueva para construcción |

---

**Documento:** `MAI-001-fundamentos/requerimientos/RF-AUTH-003-multi-tenancy.md`
**Ruta absoluta:** `/home/isem/workspace/worskpace-inmobiliaria/docs/01-fase-alcance-inicial/MAI-001-fundamentos/requerimientos/RF-AUTH-003-multi-tenancy.md`
**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @database-team
