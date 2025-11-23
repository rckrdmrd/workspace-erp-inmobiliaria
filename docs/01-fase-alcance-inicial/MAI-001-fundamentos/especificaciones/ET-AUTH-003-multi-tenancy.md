# ET-AUTH-003: Multi-tenancy Implementation

## 📋 Metadata

| Campo | Valor |
|-------|-------|
| **ID** | ET-AUTH-003 |
| **Épica** | MAI-001 - Fundamentos |
| **Módulo** | Autenticación y Multi-tenancy |
| **Tipo** | Especificación Técnica |
| **Estado** | 🚧 Planificado |
| **Versión** | 1.0 |
| **Fecha creación** | 2025-11-17 |
| **Última actualización** | 2025-11-17 |
| **Esfuerzo estimado** | 22h |

## 🔗 Referencias

### Requerimiento Funcional
📄 [RF-AUTH-003: Multi-tenancy por Constructora](../requerimientos/RF-AUTH-003-multi-tenancy.md)

### Origen (GAMILIT)
♻️ **Reutilización:** 0% - Funcionalidad completamente nueva
- **Justificación:** GAMILIT es single-tenant, no requiere multi-tenancy
- **Inspiración:** Patterns de RLS y contexto de GAMILIT adaptados a multi-tenant
- **Beneficio:** Permite profesionales trabajando en múltiples constructoras

### Documentos Relacionados
- 📄 [RF-AUTH-001: Sistema de Roles](../requerimientos/RF-AUTH-001-roles-construccion.md)
- 📄 [RF-AUTH-002: Estados de Cuenta](../requerimientos/RF-AUTH-002-estados-cuenta.md)
- 📄 [ET-AUTH-001: RBAC](./ET-AUTH-001-rbac.md)
- 📄 [ET-AUTH-002: Estados de Cuenta](./ET-AUTH-002-estados-cuenta.md)

### Implementación

🗄️ **Database:** Ver sección "Implementación de Base de Datos"
💻 **Backend:** Ver sección "Implementación Backend"
🎨 **Frontend:** Ver sección "Implementación Frontend"

### Trazabilidad
📊 [TRACEABILITY.yml](../implementacion/TRACEABILITY.yml#L15-L44)

---

## 🏗️ Arquitectura Multi-tenant

### Modelo de Datos

```
┌────────────────────────────────────────────────────────────────────┐
│                   ARQUITECTURA MULTI-TENANT                        │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   CONSTRUCTORAS     │    Tenants (empresas)
│  (Tenants)          │
├─────────────────────┤
│ id (PK)             │
│ nombre              │
│ rfc (UNIQUE)        │
│ logo_url            │
│ settings (JSONB)    │
│ active              │
└──────────┬──────────┘
           │
           │ 1:N
           │
           ▼
┌──────────────────────────────┐
│  USER_CONSTRUCTORAS          │    Many-to-Many con metadata
│  (User-Tenant Relationship)  │
├──────────────────────────────┤
│ id (PK)                      │
│ user_id (FK) ────────────┐   │
│ constructora_id (FK)     │   │
│ role                     │   │    Rol DIFERENTE por constructora
│ status                   │   │    Estado DIFERENTE por constructora
│ is_primary               │   │
│ invited_by               │   │
│ joined_at                │   │
└───────────┬──────────────┘   │
            │                  │
            │ N:1              │ N:1
            │                  │
            ▼                  ▼
┌──────────────────┐    ┌──────────────────┐
│  CONSTRUCTORA    │    │     PROFILES     │    Usuario global
│  (Tenant Entity) │    │     (Users)      │
└──────────────────┘    ├──────────────────┤
                        │ id (PK)          │
                        │ email (UNIQUE)   │
                        │ password_hash    │
                        │ status (global)  │    Estado global
                        └──────────────────┘

TODOS LOS DATOS DE NEGOCIO TIENEN constructora_id:

┌──────────────────┐
│    PROJECTS      │
├──────────────────┤
│ id               │
│ constructora_id  │─────► Aislamiento por tenant
│ nombre           │
│ ...              │
└──────────────────┘

┌──────────────────┐
│    BUDGETS       │
├──────────────────┤
│ id               │
│ constructora_id  │─────► Aislamiento por tenant
│ project_id       │
│ ...              │
└──────────────────┘

┌──────────────────┐
│   EMPLOYEES      │
├──────────────────┤
│ id               │
│ constructora_id  │─────► Aislamiento por tenant
│ nombre           │
│ ...              │
└──────────────────┘

RLS POLICIES garantizan que queries automáticamente filtren por:
  WHERE constructora_id = get_current_constructora_id()
```

---

## 🔧 Implementación de Base de Datos

### 1. Esquema Principal

```sql
-- apps/database/ddl/schemas/auth_management/tables/constructoras.sql

CREATE TABLE auth_management.constructoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Información básica
  nombre VARCHAR(255) NOT NULL,
  razon_social VARCHAR(500) NOT NULL,
  rfc VARCHAR(13) NOT NULL UNIQUE,

  -- Branding
  logo_url VARCHAR(1000),
  color_primary VARCHAR(7), -- Hex color #FF5733
  color_secondary VARCHAR(7),

  -- Configuración
  settings JSONB DEFAULT '{}'::JSONB,
  /*
  settings: {
    timezone: "America/Mexico_City",
    currency: "MXN",
    locale: "es-MX",
    fiscalRegime: "601",
    mainAddress: {
      street: "...",
      city: "...",
      state: "...",
      zipCode: "..."
    },
    billingConfig: {
      cfdiUse: "G03",
      paymentMethod: "PUE",
      paymentForm: "03"
    },
    features: {
      enableBiometric: true,
      enableInventory: true,
      maxProjects: 50
    }
  }
  */

  -- Estado
  active BOOLEAN DEFAULT TRUE,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth_management.profiles(id)
);

-- Índices
CREATE INDEX idx_constructoras_rfc ON auth_management.constructoras(rfc);
CREATE INDEX idx_constructoras_active ON auth_management.constructoras(active) WHERE active = TRUE;

-- Comentarios
COMMENT ON TABLE auth_management.constructoras IS
  'Constructoras (tenants) - Cada empresa constructora en el sistema';

COMMENT ON COLUMN auth_management.constructoras.settings IS
  'Configuración JSON específica de la constructora (timezone, moneda, features, etc.)';
```

---

### 2. Relación User-Constructora

```sql
-- apps/database/ddl/schemas/auth_management/tables/user-constructoras.sql

CREATE TABLE auth_management.user_constructoras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relaciones
  user_id UUID NOT NULL REFERENCES auth_management.profiles(id) ON DELETE CASCADE,
  constructora_id UUID NOT NULL REFERENCES auth_management.constructoras(id) ON DELETE CASCADE,

  -- Rol y estado EN ESTA CONSTRUCTORA
  role construction_role NOT NULL,
  status user_status NOT NULL DEFAULT 'active',

  -- Metadata de suspensión (si aplica)
  suspended_at TIMESTAMP WITH TIME ZONE,
  suspended_by UUID REFERENCES auth_management.profiles(id),
  suspended_reason TEXT,
  suspended_until TIMESTAMP WITH TIME ZONE,

  -- Constructora principal
  is_primary BOOLEAN DEFAULT FALSE,

  -- Metadata de invitación
  invited_by UUID REFERENCES auth_management.profiles(id),
  invited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id, constructora_id)
);

-- Constraint: Solo una constructora principal por usuario
CREATE UNIQUE INDEX idx_user_primary_constructora
  ON auth_management.user_constructoras(user_id)
  WHERE is_primary = TRUE;

-- Índices para performance
CREATE INDEX idx_user_constructoras_user
  ON auth_management.user_constructoras(user_id);

CREATE INDEX idx_user_constructoras_constructora
  ON auth_management.user_constructoras(constructora_id);

CREATE INDEX idx_user_constructoras_active
  ON auth_management.user_constructoras(user_id, constructora_id, status)
  WHERE status = 'active';

CREATE INDEX idx_user_constructoras_role
  ON auth_management.user_constructoras(constructora_id, role);

-- Comentarios
COMMENT ON TABLE auth_management.user_constructoras IS
  'Relación many-to-many usuarios-constructoras con rol y estado por constructora';

COMMENT ON COLUMN auth_management.user_constructoras.is_primary IS
  'Constructora principal del usuario (pre-seleccionada al login). Solo una puede ser true.';
```

---

### 3. Funciones de Contexto

#### get_current_constructora_id()
**Propósito:** Obtener constructora activa en contexto actual

```sql
-- apps/database/ddl/schemas/auth_management/functions/get-current-constructora-id.sql

CREATE OR REPLACE FUNCTION auth_management.get_current_constructora_id()
RETURNS UUID
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  -- Obtener de variable de sesión configurada por backend
  RETURN NULLIF(current_setting('app.current_constructora_id', true), '')::UUID;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$;

COMMENT ON FUNCTION auth_management.get_current_constructora_id IS
  'Retorna constructora activa del contexto actual (configurada por SetRlsContextInterceptor)';
```

---

#### user_has_access_to_constructora()
**Propósito:** Verificar si usuario tiene acceso activo a constructora

```sql
-- apps/database/ddl/schemas/auth_management/functions/user-has-access-to-constructora.sql

CREATE OR REPLACE FUNCTION auth_management.user_has_access_to_constructora(
  p_user_id UUID,
  p_constructora_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth_management.user_constructoras uc
    INNER JOIN auth_management.constructoras c ON c.id = uc.constructora_id
    WHERE uc.user_id = p_user_id
      AND uc.constructora_id = p_constructora_id
      AND uc.status = 'active'
      AND c.active = TRUE
  );
END;
$$;

COMMENT ON FUNCTION auth_management.user_has_access_to_constructora IS
  'Verifica si usuario tiene acceso activo a una constructora específica';
```

---

#### get_user_active_constructoras()
**Propósito:** Obtener todas las constructoras activas del usuario

```sql
-- apps/database/ddl/schemas/auth_management/functions/get-user-active-constructoras.sql

CREATE OR REPLACE FUNCTION auth_management.get_user_active_constructoras(
  p_user_id UUID
)
RETURNS TABLE (
  constructora_id UUID,
  nombre VARCHAR(255),
  logo_url VARCHAR(1000),
  role construction_role,
  is_primary BOOLEAN
)
LANGUAGE plpgsql STABLE SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id AS constructora_id,
    c.nombre,
    c.logo_url,
    uc.role,
    uc.is_primary
  FROM auth_management.user_constructoras uc
  INNER JOIN auth_management.constructoras c ON c.id = uc.constructora_id
  WHERE uc.user_id = p_user_id
    AND uc.status = 'active'
    AND c.active = TRUE
  ORDER BY uc.is_primary DESC, c.nombre ASC;
END;
$$;

COMMENT ON FUNCTION auth_management.get_user_active_constructoras IS
  'Retorna todas las constructoras activas del usuario (para selector de constructora)';
```

---

### 4. RLS Policies Multi-tenant

**Patrón estándar para TODAS las tablas de negocio:**

```sql
-- apps/database/ddl/schemas/projects/tables/projects.sql

-- Habilitar RLS
ALTER TABLE projects.projects ENABLE ROW LEVEL SECURITY;

-- Policy base: Constructora Isolation
CREATE POLICY "constructora_isolation_policy"
  ON projects.projects
  FOR ALL
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
  )
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
  );

-- Policy adicional: Role-based (si se necesita)
CREATE POLICY "directors_view_all"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'director'
  );
```

**Ejemplo más complejo con proyectos:**

```sql
-- apps/database/ddl/schemas/projects/tables/projects.sql

ALTER TABLE projects.projects ENABLE ROW LEVEL SECURITY;

-- SELECT: Depende del rol
CREATE POLICY "projects_select_by_role"
  ON projects.projects
  FOR SELECT
  TO authenticated
  USING (
    -- Siempre filtrar por constructora
    constructora_id = auth_management.get_current_constructora_id()
    AND (
      -- Director y Engineer ven todos los proyectos
      auth_management.user_has_any_role(ARRAY['director', 'engineer', 'finance'])
      OR
      -- Residente solo ve proyectos asignados
      (
        auth_management.get_current_user_role() = 'resident'
        AND id IN (
          SELECT project_id
          FROM projects.project_team_assignments
          WHERE user_id = auth_management.get_current_user_id()
            AND role = 'resident'
            AND active = TRUE
        )
      )
    )
  );

-- INSERT: Solo director y engineer
CREATE POLICY "projects_insert"
  ON projects.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])
  );

-- UPDATE: Solo director y engineer
CREATE POLICY "projects_update"
  ON projects.projects
  FOR UPDATE
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.user_has_any_role(ARRAY['director', 'engineer'])
  );

-- DELETE: Solo director
CREATE POLICY "projects_delete"
  ON projects.projects
  FOR DELETE
  TO authenticated
  USING (
    constructora_id = auth_management.get_current_constructora_id()
    AND auth_management.get_current_user_role() = 'director'
  );
```

---

## 💻 Implementación Backend

### 1. Entities de TypeORM

#### Constructora Entity

```typescript
// apps/backend/src/modules/auth/entities/constructora.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export interface ConstructoraSettings {
  timezone?: string;
  currency?: string;
  locale?: string;
  fiscalRegime?: string;
  mainAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  billingConfig?: {
    cfdiUse: string;
    paymentMethod: string;
    paymentForm: string;
  };
  features?: {
    enableBiometric?: boolean;
    enableInventory?: boolean;
    maxProjects?: number;
  };
}

@Entity('constructoras', { schema: 'auth_management' })
export class Constructora {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 500, name: 'razon_social' })
  razonSocial: string;

  @Column({ type: 'varchar', length: 13, unique: true })
  rfc: string;

  @Column({ type: 'varchar', length: 1000, nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'color_primary' })
  colorPrimary: string;

  @Column({ type: 'varchar', length: 7, nullable: true, name: 'color_secondary' })
  colorSecondary: string;

  @Column({ type: 'jsonb', default: {} })
  settings: ConstructoraSettings;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'created_by' })
  createdBy: string;

  @OneToMany(() => UserConstructora, (uc) => uc.constructora)
  users: UserConstructora[];
}
```

---

#### UserConstructora Entity

```typescript
// apps/backend/src/modules/auth/entities/user-constructora.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Profile } from './profile.entity';
import { Constructora } from './constructora.entity';
import { ConstructionRole } from '../enums/construction-role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Entity('user_constructoras', { schema: 'auth_management' })
export class UserConstructora {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'constructora_id' })
  constructoraId: string;

  @Column({ type: 'enum', enum: ConstructionRole })
  role: ConstructionRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'suspended_at' })
  suspendedAt: Date;

  @Column({ type: 'uuid', nullable: true, name: 'suspended_by' })
  suspendedBy: string;

  @Column({ type: 'text', nullable: true, name: 'suspended_reason' })
  suspendedReason: string;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'suspended_until' })
  suspendedUntil: Date;

  @Column({ type: 'boolean', default: false, name: 'is_primary' })
  isPrimary: boolean;

  @Column({ type: 'uuid', nullable: true, name: 'invited_by' })
  invitedBy: string;

  @Column({ type: 'timestamp with time zone', default: () => 'NOW()', name: 'invited_at' })
  invitedAt: Date;

  @Column({ type: 'timestamp with time zone', nullable: true, name: 'joined_at' })
  joinedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: Profile;

  @ManyToOne(() => Constructora, (constructora) => constructora.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;
}
```

---

### 2. DTO's para Multi-tenancy

```typescript
// apps/backend/src/modules/auth/dto/create-constructora.dto.ts
import { IsString, IsNotEmpty, Length, IsOptional, IsObject, Matches } from 'class-validator';

export class CreateConstructoraDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Length(5, 500)
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  @Length(13, 13)
  @Matches(/^[A-Z&Ñ]{3,4}\d{6}[A-V1-9][A-Z0-9][0-9A]$/, {
    message: 'RFC inválido para persona moral mexicana',
  })
  rfc: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  colorPrimary?: string;

  @IsString()
  @IsOptional()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  colorSecondary?: string;

  @IsObject()
  @IsOptional()
  settings?: ConstructoraSettings;
}

// apps/backend/src/modules/auth/dto/switch-constructora.dto.ts
import { IsUUID } from 'class-validator';

export class SwitchConstructoraDto {
  @IsUUID()
  constructoraId: string;
}

// apps/backend/src/modules/auth/dto/invite-to-constructora.dto.ts
import { IsEmail, IsUUID, IsEnum } from 'class-validator';
import { ConstructionRole } from '../enums/construction-role.enum';

export class InviteToConstructoraDto {
  @IsEmail()
  email: string;

  @IsUUID()
  constructoraId: string;

  @IsEnum(ConstructionRole)
  role: ConstructionRole;
}
```

---

### 3. Service: Constructora Service

```typescript
// apps/backend/src/modules/auth/services/constructora.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Constructora } from '../entities/constructora.entity';
import { UserConstructora } from '../entities/user-constructora.entity';
import { CreateConstructoraDto } from '../dto/create-constructora.dto';
import { InviteToConstructoraDto } from '../dto/invite-to-constructora.dto';
import { ConstructionRole } from '../enums/construction-role.enum';
import { UserStatus } from '../enums/user-status.enum';

@Injectable()
export class ConstructoraService {
  constructor(
    @InjectRepository(Constructora)
    private readonly constructoraRepo: Repository<Constructora>,

    @InjectRepository(UserConstructora)
    private readonly userConstructoraRepo: Repository<UserConstructora>,

    private readonly dataSource: DataSource,
  ) {}

  /**
   * Crear nueva constructora
   */
  async create(dto: CreateConstructoraDto, createdBy: string): Promise<Constructora> {
    // Validar RFC único
    const existing = await this.constructoraRepo.findOne({ where: { rfc: dto.rfc } });
    if (existing) {
      throw new BadRequestException(`RFC ${dto.rfc} ya está registrado`);
    }

    // Crear constructora
    const constructora = this.constructoraRepo.create({
      ...dto,
      createdBy,
    });

    await this.constructoraRepo.save(constructora);

    // Asociar creador como director
    await this.userConstructoraRepo.save({
      userId: createdBy,
      constructoraId: constructora.id,
      role: ConstructionRole.DIRECTOR,
      status: UserStatus.ACTIVE,
      isPrimary: false, // Usuario puede decidir después
      joinedAt: new Date(),
    });

    return constructora;
  }

  /**
   * Obtener constructoras activas del usuario
   */
  async getUserActiveConstructoras(userId: string): Promise<any[]> {
    const result = await this.dataSource.query(`
      SELECT * FROM auth_management.get_user_active_constructoras($1)
    `, [userId]);

    return result;
  }

  /**
   * Cambiar constructora primaria
   */
  async setPrimaryConstructora(userId: string, constructoraId: string): Promise<void> {
    // Validar que usuario tenga acceso
    const access = await this.userConstructoraRepo.findOne({
      where: {
        userId,
        constructoraId,
        status: UserStatus.ACTIVE,
      },
    });

    if (!access) {
      throw new NotFoundException('No tienes acceso a esta constructora');
    }

    // Transacción: quitar primary de todas, asignar a nueva
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
  }

  /**
   * Invitar usuario a constructora
   */
  async inviteToConstructora(dto: InviteToConstructoraDto, invitedBy: string): Promise<string> {
    // Validar que invitador sea director en esa constructora
    const inviterAccess = await this.userConstructoraRepo.findOne({
      where: {
        userId: invitedBy,
        constructoraId: dto.constructoraId,
        role: ConstructionRole.DIRECTOR,
        status: UserStatus.ACTIVE,
      },
    });

    if (!inviterAccess) {
      throw new BadRequestException('Solo directores pueden invitar usuarios');
    }

    // Verificar si usuario ya existe
    const existingUser = await this.profileRepo.findOne({ where: { email: dto.email } });

    if (existingUser) {
      // Usuario existente: asociar directamente a constructora
      const existingAssociation = await this.userConstructoraRepo.findOne({
        where: {
          userId: existingUser.id,
          constructoraId: dto.constructoraId,
        },
      });

      if (existingAssociation) {
        throw new BadRequestException('Usuario ya está asociado a esta constructora');
      }

      // Crear asociación
      await this.userConstructoraRepo.save({
        userId: existingUser.id,
        constructoraId: dto.constructoraId,
        role: dto.role,
        status: UserStatus.ACTIVE,
        invitedBy,
        joinedAt: new Date(),
      });

      // Enviar notificación
      await this.sendExistingUserInvitation(existingUser, dto.constructoraId, dto.role);

      return 'Usuario existente asociado a constructora';
    } else {
      // Usuario nuevo: crear invitación
      const invitation = await this.createInvitation(dto, invitedBy);

      // Enviar email de invitación
      await this.sendNewUserInvitation(dto.email, invitation.token, dto.constructoraId, dto.role);

      return invitation.token;
    }
  }

  /**
   * Verificar acceso a constructora
   */
  async hasAccessToConstructora(userId: string, constructoraId: string): Promise<boolean> {
    const result = await this.dataSource.query(`
      SELECT auth_management.user_has_access_to_constructora($1, $2) AS has_access
    `, [userId, constructoraId]);

    return result[0]?.has_access || false;
  }
}
```

---

### 4. Interceptor: SetRlsContextInterceptor

**Ya documentado en ET-AUTH-001**, aquí un recordatorio:

```typescript
// apps/backend/src/common/interceptors/set-rls-context.interceptor.ts
@Injectable()
export class SetRlsContextInterceptor implements NestInterceptor {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return next.handle();
    }

    // Configurar variables de sesión de PostgreSQL
    return from(
      this.dataSource.query(`
        SELECT
          set_config('app.current_user_id', $1, true),
          set_config('app.current_constructora_id', $2, true),
          set_config('app.current_user_role', $3, true)
      `, [
        user.id || '',
        user.constructoraId || '',
        user.role || '',
      ])
    ).pipe(
      switchMap(() => next.handle())
    );
  }
}
```

---

## 🎨 Implementación Frontend

### 1. Types

```typescript
// apps/frontend/src/types/constructora.types.ts
export interface Constructora {
  id: string;
  nombre: string;
  razonSocial: string;
  rfc: string;
  logoUrl?: string;
  colorPrimary?: string;
  colorSecondary?: string;
  settings: ConstructoraSettings;
  active: boolean;
}

export interface ConstructoraSettings {
  timezone?: string;
  currency?: string;
  locale?: string;
  fiscalRegime?: string;
  mainAddress?: Address;
  billingConfig?: BillingConfig;
  features?: Features;
}

export interface UserConstructoraAccess {
  constructoraId: string;
  nombre: string;
  logoUrl?: string;
  role: ConstructionRole;
  isPrimary: boolean;
}
```

---

### 2. Zustand Store

```typescript
// apps/frontend/src/stores/constructora-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Constructora, UserConstructoraAccess } from '@/types/constructora.types';
import api from '@/lib/api';

interface ConstructoraStore {
  // State
  currentConstructora: Constructora | null;
  availableConstructoras: UserConstructoraAccess[];

  // Actions
  setCurrentConstructora: (constructora: Constructora) => void;
  setAvailableConstructoras: (constructoras: UserConstructoraAccess[]) => void;
  switchConstructora: (constructoraId: string) => Promise<void>;
  fetchAvailableConstructoras: () => Promise<void>;
  setPrimaryConstructora: (constructoraId: string) => Promise<void>;
}

export const useConstructoraStore = create<ConstructoraStore>()(
  persist(
    (set, get) => ({
      currentConstructora: null,
      availableConstructoras: [],

      setCurrentConstructora: (constructora) => {
        set({ currentConstructora: constructora });
      },

      setAvailableConstructoras: (constructoras) => {
        set({ availableConstructoras: constructoras });
      },

      switchConstructora: async (constructoraId: string) => {
        try {
          // Request switch to backend
          const response = await api.post('/auth/switch-constructora', {
            constructoraId,
          });

          // Update token
          const newToken = response.data.accessToken;
          localStorage.setItem('accessToken', newToken);

          // Find constructora in available list
          const constructora = get().availableConstructoras.find(
            (c) => c.constructoraId === constructoraId
          );

          if (constructora) {
            // Fetch full constructora details
            const detailsResponse = await api.get(`/constructoras/${constructoraId}`);
            set({ currentConstructora: detailsResponse.data });
          }

          // Reload page to apply new context
          window.location.reload();
        } catch (error) {
          console.error('Error switching constructora:', error);
          throw error;
        }
      },

      fetchAvailableConstructoras: async () => {
        const response = await api.get('/auth/my-constructoras');
        set({ availableConstructoras: response.data });
      },

      setPrimaryConstructora: async (constructoraId: string) => {
        await api.patch('/user/set-primary-constructora', {
          constructoraId,
        });

        // Update local state
        const updated = get().availableConstructoras.map((c) => ({
          ...c,
          isPrimary: c.constructoraId === constructoraId,
        }));
        set({ availableConstructoras: updated });
      },
    }),
    {
      name: 'constructora-storage',
      partialize: (state) => ({
        currentConstructora: state.currentConstructora,
        availableConstructoras: state.availableConstructoras,
      }),
    }
  )
);
```

---

### 3. Componente: Constructora Selector

```tsx
// apps/frontend/src/components/auth/ConstructoraSelector.tsx
import React from 'react';
import { useConstructoraStore } from '@/stores/constructora-store';
import { UserConstructoraAccess } from '@/types/constructora.types';
import { Building2, Star, ChevronRight } from 'lucide-react';

interface ConstructoraSelectorProps {
  onSelect?: (constructoraId: string) => void;
}

export const ConstructoraSelector: React.FC<ConstructoraSelectorProps> = ({
  onSelect,
}) => {
  const { availableConstructoras, switchConstructora } = useConstructoraStore();

  const handleSelect = async (constructoraId: string) => {
    try {
      await switchConstructora(constructoraId);
      onSelect?.(constructoraId);
    } catch (error) {
      console.error('Error selecting constructora:', error);
      // Show error toast
    }
  };

  if (availableConstructoras.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No tienes acceso a ninguna constructora</p>
        <p className="text-sm text-gray-500 mt-2">
          Contacta a un administrador para que te invite
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Selecciona una constructora
      </h3>

      <div className="grid gap-3">
        {availableConstructoras.map((constructora) => (
          <button
            key={constructora.constructoraId}
            onClick={() => handleSelect(constructora.constructoraId)}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            {/* Logo */}
            {constructora.logoUrl ? (
              <img
                src={constructora.logoUrl}
                alt={constructora.nombre}
                className="w-12 h-12 rounded object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-gray-400" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 text-left">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-gray-900">
                  {constructora.nombre}
                </h4>
                {constructora.isPrimary && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    Principal
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 capitalize">
                {constructora.role.replace('_', ' ')}
              </p>
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};
```

---

### 4. Componente: Constructora Switcher (Header)

```tsx
// apps/frontend/src/components/layout/ConstructoraSwitcher.tsx
import React, { useState } from 'react';
import { useConstructoraStore } from '@/stores/constructora-store';
import { Building2, ChevronDown, Star, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export const ConstructoraSwitcher: React.FC = () => {
  const { currentConstructora, availableConstructoras, switchConstructora, setPrimaryConstructora } =
    useConstructoraStore();

  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitch = async (constructoraId: string) => {
    if (currentConstructora?.id === constructoraId) return;

    setIsSwitching(true);
    try {
      await switchConstructora(constructoraId);
    } finally {
      setIsSwitching(false);
    }
  };

  const handleSetPrimary = async (e: React.MouseEvent, constructoraId: string) => {
    e.stopPropagation();
    await setPrimaryConstructora(constructoraId);
  };

  if (!currentConstructora) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          disabled={isSwitching}
        >
          {currentConstructora.logoUrl ? (
            <img
              src={currentConstructora.logoUrl}
              alt={currentConstructora.nombre}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-gray-600" />
            </div>
          )}

          <div className="text-left">
            <div className="font-medium text-sm">{currentConstructora.nombre}</div>
            <div className="text-xs text-gray-500">Cambiar constructora</div>
          </div>

          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-64">
        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
          TUS CONSTRUCTORAS
        </div>
        <DropdownMenuSeparator />

        {availableConstructoras.map((constructora) => {
          const isCurrent = constructora.constructoraId === currentConstructora.id;

          return (
            <DropdownMenuItem
              key={constructora.constructoraId}
              onClick={() => handleSwitch(constructora.constructoraId)}
              className="flex items-center gap-3 px-3 py-2"
            >
              {/* Logo */}
              {constructora.logoUrl ? (
                <img
                  src={constructora.logoUrl}
                  alt={constructora.nombre}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium text-sm">{constructora.nombre}</div>
                  {isCurrent && <Check className="w-4 h-4 text-green-600" />}
                </div>
                <div className="text-xs text-gray-500 capitalize">
                  {constructora.role.replace('_', ' ')}
                </div>
              </div>

              {/* Primary star */}
              <button
                onClick={(e) => handleSetPrimary(e, constructora.constructoraId)}
                className={`p-1 rounded hover:bg-gray-200 ${
                  constructora.isPrimary ? 'text-yellow-500' : 'text-gray-300'
                }`}
                title={constructora.isPrimary ? 'Principal' : 'Marcar como principal'}
              >
                <Star className={`w-4 h-4 ${constructora.isPrimary ? 'fill-current' : ''}`} />
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

---

## 🧪 Testing

### Database Functions

```typescript
describe('Multi-tenancy Database Functions', () => {
  it('get_user_active_constructoras should return only active constructoras', async () => {
    const user = await createUser();
    const constructoraA = await createConstructora({ nombre: 'A', active: true });
    const constructoraB = await createConstructora({ nombre: 'B', active: false });

    await assignToConstructora(user.id, constructoraA.id, 'engineer', 'active');
    await assignToConstructora(user.id, constructoraB.id, 'director', 'active');

    const result = await db.query(`
      SELECT * FROM auth_management.get_user_active_constructoras($1)
    `, [user.id]);

    // Solo debe retornar constructora A (activa)
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0].constructora_id).toBe(constructoraA.id);
  });

  it('user_has_access_to_constructora should validate status', async () => {
    const user = await createUser();
    const constructora = await createConstructora();

    // Sin acceso
    let hasAccess = await db.query(`
      SELECT auth_management.user_has_access_to_constructora($1, $2) AS result
    `, [user.id, constructora.id]);
    expect(hasAccess.rows[0].result).toBe(false);

    // Con acceso activo
    await assignToConstructora(user.id, constructora.id, 'engineer', 'active');
    hasAccess = await db.query(`
      SELECT auth_management.user_has_access_to_constructora($1, $2) AS result
    `, [user.id, constructora.id]);
    expect(hasAccess.rows[0].result).toBe(true);

    // Suspendido
    await suspendInConstructora(user.id, constructora.id);
    hasAccess = await db.query(`
      SELECT auth_management.user_has_access_to_constructora($1, $2) AS result
    `, [user.id, constructora.id]);
    expect(hasAccess.rows[0].result).toBe(false);
  });
});
```

---

## 📚 Referencias Adicionales

### Documentos Relacionados
- 📄 [RF-AUTH-003: Multi-tenancy](../requerimientos/RF-AUTH-003-multi-tenancy.md)
- 📄 [ET-AUTH-001: RBAC](./ET-AUTH-001-rbac.md)
- 📄 [ET-AUTH-002: Estados de Cuenta](./ET-AUTH-002-estados-cuenta.md)

### Recursos Técnicos
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Multi-tenancy Patterns (Microsoft)](https://docs.microsoft.com/en-us/azure/architecture/patterns/category/data-management)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)

---

## 📅 Historial de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2025-11-17 | Tech Team | Creación inicial - Implementación completa multi-tenancy |

---

**Documento:** `MAI-001-fundamentos/especificaciones/ET-AUTH-003-multi-tenancy.md`
**Ruta absoluta:** `/home/isem/workspace/worskpace-inmobiliaria/docs/01-fase-alcance-inicial/MAI-001-fundamentos/especificaciones/ET-AUTH-003-multi-tenancy.md`
**Generado:** 2025-11-17
**Mantenedores:** @tech-lead @backend-team @frontend-team @database-team
