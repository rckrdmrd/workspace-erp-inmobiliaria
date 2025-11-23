# ET-ADM-001: Implementación de RBAC Multi-Tenancy

**ID:** ET-ADM-001
**Módulo:** MAI-013 - Administración & Seguridad
**Tipo:** Especificación Técnica
**Prioridad:** P0 (Crítica)
**Fecha de creación:** 2025-11-20
**Versión:** 1.0
**Relacionado con:** RF-ADM-001, RF-ADM-002

---

## 📋 Descripción

Especificación técnica completa para la implementación del sistema **RBAC (Role-Based Access Control)** con soporte **multi-tenancy** que permite:

- Gestión de múltiples empresas constructoras en un solo sistema
- 7 roles especializados con permisos granulares
- Row Level Security (RLS) en PostgreSQL
- Guards y decoradores en NestJS
- Componentes React para gestión de usuarios

---

## 🗄️ Base de Datos (PostgreSQL)

### Schemas

```sql
-- Schema para autenticación y gestión de usuarios
CREATE SCHEMA IF NOT EXISTS auth_management;

-- Schema para multi-tenancy (empresas constructoras)
CREATE SCHEMA IF NOT EXISTS constructoras;

-- Schema para auditoría
CREATE SCHEMA IF NOT EXISTS audit_logging;
```

### ENUMs

```sql
-- auth_management.construction_role
CREATE TYPE auth_management.construction_role AS ENUM (
  'director',      -- Director General
  'engineer',      -- Ingeniero/Planeación
  'resident',      -- Residente de Obra
  'purchases',     -- Compras/Almacén
  'finance',       -- Administración/Finanzas
  'hr',            -- RRHH/Nómina
  'post_sales'     -- Postventa
);

-- auth_management.account_status
CREATE TYPE auth_management.account_status AS ENUM (
  'active',        -- Activo
  'inactive',      -- Inactivo
  'suspended',     -- Suspendido temporalmente
  'locked'         -- Bloqueado por intentos fallidos
);

-- auth_management.permission_action
CREATE TYPE auth_management.permission_action AS ENUM (
  'create',
  'read',
  'update',
  'delete',
  'approve'
);
```

### Tabla: constructoras

```sql
CREATE TABLE constructoras.constructoras (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL, -- CONST-001, CONST-002

  -- Información básica
  name VARCHAR(200) NOT NULL,
  legal_name VARCHAR(300) NOT NULL, -- Razón social
  rfc VARCHAR(13) UNIQUE NOT NULL,
  tax_regime VARCHAR(100),

  -- Domicilio fiscal
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(10),
  country VARCHAR(2) DEFAULT 'MX',

  -- Contacto
  phone VARCHAR(20),
  email VARCHAR(100),
  website VARCHAR(200),

  -- Branding
  logo_url TEXT,
  primary_color VARCHAR(7), -- Hex color: #FF5733

  -- Estado
  status VARCHAR(20) DEFAULT 'active',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,

  CONSTRAINT constructoras_status_check CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- Índices
CREATE INDEX idx_constructoras_code ON constructoras.constructoras(code);
CREATE INDEX idx_constructoras_rfc ON constructoras.constructoras(rfc);
CREATE INDEX idx_constructoras_status ON constructoras.constructoras(status);

-- Trigger para updated_at
CREATE TRIGGER update_constructoras_updated_at
  BEFORE UPDATE ON constructoras.constructoras
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Tabla: users

```sql
CREATE TABLE auth_management.users (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, -- bcrypt hash

  -- Datos personales
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  phone VARCHAR(20),
  mobile_phone VARCHAR(20),

  -- Avatar
  avatar_url TEXT,

  -- Estado de cuenta
  status auth_management.account_status DEFAULT 'active',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMPTZ,

  -- Seguridad
  last_login_at TIMESTAMPTZ,
  last_login_ip INET,
  failed_login_attempts INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ DEFAULT NOW(),
  must_change_password BOOLEAN DEFAULT TRUE, -- Primer login

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID,
  deleted_at TIMESTAMPTZ, -- Soft delete

  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Índices
CREATE UNIQUE INDEX idx_users_email ON auth_management.users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON auth_management.users(status);
CREATE INDEX idx_users_last_login ON auth_management.users(last_login_at DESC);

-- Trigger para updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON auth_management.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Tabla: user_constructoras (Relación Many-to-Many)

```sql
CREATE TABLE auth_management.user_constructoras (
  -- Relación
  user_id UUID NOT NULL REFERENCES auth_management.users(id) ON DELETE CASCADE,
  constructora_id UUID NOT NULL REFERENCES constructoras.constructoras(id) ON DELETE CASCADE,

  -- Rol en esta constructora
  role auth_management.construction_role NOT NULL,

  -- Estado
  status VARCHAR(20) DEFAULT 'active',

  -- Permisos personalizados (JSONB)
  custom_permissions JSONB DEFAULT '[]'::jsonb,

  -- Metadata
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth_management.users(id),

  PRIMARY KEY (user_id, constructora_id),
  CONSTRAINT user_constructoras_status_check CHECK (status IN ('active', 'inactive'))
);

-- Índices
CREATE INDEX idx_user_constructoras_user ON auth_management.user_constructoras(user_id);
CREATE INDEX idx_user_constructoras_constructora ON auth_management.user_constructoras(constructora_id);
CREATE INDEX idx_user_constructoras_role ON auth_management.user_constructoras(role);
CREATE INDEX idx_user_constructoras_custom_permissions ON auth_management.user_constructoras USING GIN (custom_permissions);

-- Trigger para updated_at
CREATE TRIGGER update_user_constructoras_updated_at
  BEFORE UPDATE ON auth_management.user_constructoras
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Tabla: invitations

```sql
CREATE TABLE auth_management.invitations (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token VARCHAR(64) UNIQUE NOT NULL, -- Random token

  -- Usuario a invitar
  email VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),

  -- Constructora y rol asignado
  constructora_id UUID NOT NULL REFERENCES constructoras.constructoras(id),
  role auth_management.construction_role NOT NULL,

  -- Mensaje personalizado
  custom_message TEXT,

  -- Estado
  status VARCHAR(20) DEFAULT 'pending',
  accepted_at TIMESTAMPTZ,

  -- Expiración
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth_management.users(id),

  CONSTRAINT invitations_status_check CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled'))
);

-- Índices
CREATE UNIQUE INDEX idx_invitations_token ON auth_management.invitations(token) WHERE status = 'pending';
CREATE INDEX idx_invitations_email ON auth_management.invitations(email);
CREATE INDEX idx_invitations_status ON auth_management.invitations(status);
CREATE INDEX idx_invitations_expires_at ON auth_management.invitations(expires_at);

-- Trigger para expirar invitaciones automáticamente
CREATE OR REPLACE FUNCTION expire_old_invitations()
RETURNS void AS $$
BEGIN
  UPDATE auth_management.invitations
  SET status = 'expired'
  WHERE status = 'pending'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Cron job (pg_cron o external)
-- SELECT cron.schedule('expire-invitations', '0 */6 * * *', 'SELECT expire_old_invitations();');
```

### Tabla: role_permissions (Matriz de Permisos)

```sql
CREATE TABLE auth_management.role_permissions (
  -- Identificación
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Rol y módulo
  role auth_management.construction_role NOT NULL,
  module VARCHAR(50) NOT NULL, -- 'projects', 'budgets', 'purchases', etc.

  -- Permisos
  permissions auth_management.permission_action[] NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(role, module)
);

-- Índices
CREATE INDEX idx_role_permissions_role ON auth_management.role_permissions(role);
CREATE INDEX idx_role_permissions_module ON auth_management.role_permissions(module);

-- Seed data: Matriz de permisos por defecto
INSERT INTO auth_management.role_permissions (role, module, permissions) VALUES
  -- Director: Acceso completo a todo
  ('director', 'projects', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('director', 'budgets', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('director', 'purchases', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('director', 'estimations', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('director', 'admin', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),

  -- Engineer: CRUD en proyectos, presupuestos, control obra
  ('engineer', 'projects', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('engineer', 'budgets', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('engineer', 'construction', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('engineer', 'estimations', ARRAY['create','read','update','delete']::auth_management.permission_action[]),

  -- Resident: CRUD en obra, compras, inventarios
  ('resident', 'projects', ARRAY['read']::auth_management.permission_action[]),
  ('resident', 'construction', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('resident', 'purchases', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('resident', 'inventory', ARRAY['create','read','update','delete']::auth_management.permission_action[]),

  -- Purchases: CRUD+Approve en compras e inventarios
  ('purchases', 'purchases', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('purchases', 'inventory', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('purchases', 'projects', ARRAY['read']::auth_management.permission_action[]),

  -- Finance: CRUD+Approve en estimaciones y finanzas
  ('finance', 'estimations', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('finance', 'reports', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('finance', 'projects', ARRAY['read']::auth_management.permission_action[]),

  -- HR: CRUD+Approve en RRHH
  ('hr', 'hr', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]),
  ('hr', 'projects', ARRAY['read']::auth_management.permission_action[]),

  -- Post Sales: CRUD en postventa y CRM
  ('post_sales', 'quality', ARRAY['create','read','update','delete']::auth_management.permission_action[]),
  ('post_sales', 'crm', ARRAY['create','read','update','delete','approve']::auth_management.permission_action[]);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS en tablas críticas
ALTER TABLE constructoras.constructoras ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_management.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_management.user_constructoras ENABLE ROW LEVEL SECURITY;

-- Política: Solo ver usuarios de tu constructora
CREATE POLICY user_constructoras_isolation_policy
  ON auth_management.user_constructoras
  FOR ALL
  USING (
    constructora_id = current_setting('app.current_constructora_id', true)::uuid
  );

-- Política: Solo ver tu constructora
CREATE POLICY constructoras_isolation_policy
  ON constructoras.constructoras
  FOR ALL
  USING (
    id = current_setting('app.current_constructora_id', true)::uuid
  );

-- Función: Configurar contexto de sesión
CREATE OR REPLACE FUNCTION set_session_context(
  p_user_id UUID,
  p_constructora_id UUID,
  p_user_role auth_management.construction_role
)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', p_user_id::text, false);
  PERFORM set_config('app.current_constructora_id', p_constructora_id::text, false);
  PERFORM set_config('app.current_user_role', p_user_role::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔧 Backend (NestJS + TypeScript)

### Entities (TypeORM)

#### user.entity.ts

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { UserConstructora } from './user-constructora.entity';
import { AccountStatus } from '../enums/account-status.enum';

@Entity({ schema: 'auth_management', name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ name: 'first_name' })
  firstName: string;

  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ name: 'full_name', insert: false, update: false })
  fullName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ name: 'mobile_phone', nullable: true })
  mobilePhone?: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'enum', enum: AccountStatus, default: AccountStatus.ACTIVE })
  status: AccountStatus;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'email_verified_at', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ name: 'last_login_at', nullable: true })
  lastLoginAt?: Date;

  @Column({ name: 'last_login_ip', type: 'inet', nullable: true })
  lastLoginIp?: string;

  @Column({ name: 'failed_login_attempts', default: 0 })
  failedLoginAttempts: number;

  @Column({ name: 'locked_until', nullable: true })
  lockedUntil?: Date;

  @Column({ name: 'password_changed_at' })
  passwordChangedAt: Date;

  @Column({ name: 'must_change_password', default: true })
  mustChangePassword: boolean;

  @OneToMany(() => UserConstructora, uc => uc.user)
  constructoras: UserConstructora[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
```

#### constructora.entity.ts

```typescript
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserConstructora } from './user-constructora.entity';

@Entity({ schema: 'constructoras', name: 'constructoras' })
export class Constructora {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 20 })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ name: 'legal_name', length: 300 })
  legalName: string;

  @Column({ unique: true, length: 13 })
  rfc: string;

  @Column({ name: 'tax_regime', length: 100, nullable: true })
  taxRegime?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ length: 100, nullable: true })
  city?: string;

  @Column({ length: 100, nullable: true })
  state?: string;

  @Column({ name: 'zip_code', length: 10, nullable: true })
  zipCode?: string;

  @Column({ length: 2, default: 'MX' })
  country: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ length: 200, nullable: true })
  website?: string;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl?: string;

  @Column({ name: 'primary_color', length: 7, nullable: true })
  primaryColor?: string;

  @Column({ length: 20, default: 'active' })
  status: string;

  @OneToMany(() => UserConstructora, uc => uc.constructora)
  users: UserConstructora[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy?: string;
}
```

#### user-constructora.entity.ts

```typescript
import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Constructora } from './constructora.entity';
import { ConstructionRole } from '../enums/construction-role.enum';

@Entity({ schema: 'auth_management', name: 'user_constructoras' })
export class UserConstructora {
  @PrimaryColumn({ name: 'user_id' })
  userId: string;

  @PrimaryColumn({ name: 'constructora_id' })
  constructoraId: string;

  @ManyToOne(() => User, user => user.constructoras)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Constructora, constructora => constructora.users)
  @JoinColumn({ name: 'constructora_id' })
  constructora: Constructora;

  @Column({ type: 'enum', enum: ConstructionRole })
  role: ConstructionRole;

  @Column({ length: 20, default: 'active' })
  status: string;

  @Column({ name: 'custom_permissions', type: 'jsonb', default: [] })
  customPermissions: any[];

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'granted_by', nullable: true })
  grantedBy?: string;
}
```

### ENUMs

```typescript
// enums/construction-role.enum.ts
export enum ConstructionRole {
  DIRECTOR = 'director',
  ENGINEER = 'engineer',
  RESIDENT = 'resident',
  PURCHASES = 'purchases',
  FINANCE = 'finance',
  HR = 'hr',
  POST_SALES = 'post_sales'
}

// enums/account-status.enum.ts
export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  LOCKED = 'locked'
}

// enums/permission-action.enum.ts
export enum PermissionAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve'
}
```

### Services

#### users.service.ts

```typescript
import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { UserConstructora } from './entities/user-constructora.entity';
import { CreateUserDto, UpdateUserDto } from './dto';
import { AccountStatus } from './enums/account-status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    @InjectRepository(UserConstructora)
    private userConstructorasRepo: Repository<UserConstructora>,
  ) {}

  async create(dto: CreateUserDto, createdBy: string): Promise<User> {
    // Validar email único
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email }
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Crear usuario
    const user = this.usersRepo.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      mobilePhone: dto.mobilePhone,
      createdBy
    });

    return this.usersRepo.save(user);
  }

  async findAll(constructoraId: string, filters?: any): Promise<User[]> {
    const qb = this.usersRepo.createQueryBuilder('u')
      .innerJoin('u.constructoras', 'uc')
      .where('uc.constructora_id = :constructoraId', { constructoraId });

    if (filters.status) {
      qb.andWhere('u.status = :status', { status: filters.status });
    }

    if (filters.role) {
      qb.andWhere('uc.role = :role', { role: filters.role });
    }

    if (filters.search) {
      qb.andWhere(
        '(u.full_name ILIKE :search OR u.email ILIKE :search)',
        { search: `%${filters.search}%` }
      );
    }

    return qb.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({
      where: { id },
      relations: ['constructoras', 'constructoras.constructora']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    Object.assign(user, dto);

    return this.usersRepo.save(user);
  }

  async changeStatus(
    id: string,
    status: AccountStatus,
    reason?: string
  ): Promise<User> {
    const user = await this.findOne(id);

    user.status = status;

    if (status === AccountStatus.LOCKED) {
      user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 min
    }

    // TODO: Audit log
    // TODO: Send notification

    return this.usersRepo.save(user);
  }

  async changeRole(
    userId: string,
    constructoraId: string,
    newRole: ConstructionRole,
    changedBy: string
  ): Promise<UserConstructora> {
    const uc = await this.userConstructorasRepo.findOne({
      where: { userId, constructoraId }
    });

    if (!uc) {
      throw new NotFoundException('User not assigned to this constructora');
    }

    const oldRole = uc.role;
    uc.role = newRole;

    // TODO: Audit log (role_change)

    return this.userConstructorasRepo.save(uc);
  }

  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.usersRepo.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'status', 'failedLoginAttempts', 'lockedUntil']
    });

    if (!user) {
      return null;
    }

    // Check si está bloqueado
    if (user.status === AccountStatus.LOCKED) {
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        throw new UnauthorizedException('Account is locked. Try again later.');
      } else {
        // Desbloquear automáticamente
        user.status = AccountStatus.ACTIVE;
        user.failedLoginAttempts = 0;
        await this.usersRepo.save(user);
      }
    }

    // Validar contraseña
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      // Incrementar intentos fallidos
      user.failedLoginAttempts++;

      if (user.failedLoginAttempts >= 5) {
        user.status = AccountStatus.LOCKED;
        user.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
        // TODO: Send alert email
      }

      await this.usersRepo.save(user);

      return null;
    }

    // Reset intentos fallidos
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      await this.usersRepo.save(user);
    }

    return user;
  }
}
```

### Guards y Decoradores

#### permissions.guard.ts

```typescript
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionsService } from '../services/permissions.service';
import { PermissionAction } from '../enums/permission-action.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private permissionsService: PermissionsService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.get<string>(
      'module',
      context.getHandler()
    );

    const requiredActions = this.reflector.get<PermissionAction[]>(
      'actions',
      context.getHandler()
    );

    if (!requiredModule || !requiredActions) {
      return true; // No requiere permisos
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // Validar permisos
    return this.permissionsService.hasPermissions(
      user.role,
      requiredModule,
      requiredActions
    );
  }
}
```

#### decorators/require-permissions.decorator.ts

```typescript
import { SetMetadata } from '@nestjs/common';
import { PermissionAction } from '../enums/permission-action.enum';

export const RequirePermissions = (
  module: string,
  ...actions: PermissionAction[]
) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata('module', module)(target, propertyKey, descriptor);
    SetMetadata('actions', actions)(target, propertyKey, descriptor);
  };
};
```

### Controllers

#### users.controller.ts

```typescript
import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermissions } from './decorators/require-permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PermissionAction } from './enums/permission-action.enum';
import { CreateUserDto, UpdateUserDto, ChangeStatusDto, ChangeRoleDto } from './dto';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RequirePermissions('admin', PermissionAction.READ)
  async findAll(
    @CurrentUser() user: any,
    @Query() filters: any
  ) {
    return this.usersService.findAll(user.constructoraId, filters);
  }

  @Get(':id')
  @RequirePermissions('admin', PermissionAction.READ)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('admin', PermissionAction.UPDATE)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto
  ) {
    return this.usersService.update(id, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('admin', PermissionAction.UPDATE)
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: ChangeStatusDto
  ) {
    return this.usersService.changeStatus(id, dto.status, dto.reason);
  }

  @Patch(':id/role')
  @RequirePermissions('admin', PermissionAction.UPDATE)
  async changeRole(
    @Param('id') id: string,
    @Body() dto: ChangeRoleDto,
    @CurrentUser() user: any
  ) {
    return this.usersService.changeRole(
      id,
      user.constructoraId,
      dto.newRole,
      user.id
    );
  }

  @Delete(':id')
  @RequirePermissions('admin', PermissionAction.DELETE)
  async remove(@Param('id') id: string) {
    // Soft delete
    return this.usersService.softDelete(id);
  }
}
```

---

## 🎨 Frontend (React + TypeScript)

### Hooks

#### useAuth.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Constructora } from '../types';

interface AuthState {
  user: User | null;
  currentConstructora: Constructora | null;
  accessToken: string | null;

  setAuth: (user: User, constructora: Constructora, token: string) => void;
  switchConstructora: (constructora: Constructora) => void;
  logout: () => void;
  hasPermission: (module: string, action: string) => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      currentConstructora: null,
      accessToken: null,

      setAuth: (user, constructora, token) => {
        set({ user, currentConstructora: constructora, accessToken: token });
      },

      switchConstructora: async (constructora) => {
        const { user } = get();
        // API call to switch constructora
        const response = await fetch('/api/auth/switch-constructora', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${get().accessToken}`
          },
          body: JSON.stringify({ constructoraId: constructora.id })
        });

        const { accessToken } = await response.json();

        set({ currentConstructora: constructora, accessToken });
      },

      logout: () => {
        set({ user: null, currentConstructora: null, accessToken: null });
      },

      hasPermission: (module, action) => {
        const { user } = get();
        if (!user) return false;

        // TODO: Check permissions from user.role and user.customPermissions
        return true;
      }
    }),
    { name: 'auth-storage' }
  )
);
```

### Components

#### ConstructoraSelector.tsx

```typescript
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Constructora } from '../types';

export const ConstructoraSelector: React.FC = () => {
  const { user, currentConstructora, switchConstructora } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !user.constructoras || user.constructoras.length <= 1) {
    return null;
  }

  const handleSwitch = async (constructora: Constructora) => {
    await switchConstructora(constructora);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50"
      >
        <Building className="w-5 h-5" />
        <span className="font-medium">{currentConstructora?.name}</span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white border rounded-lg shadow-lg">
          {user.constructoras.map((uc) => (
            <button
              key={uc.constructora.id}
              onClick={() => handleSwitch(uc.constructora)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between ${
                uc.constructora.id === currentConstructora?.id ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <div className="font-medium">{uc.constructora.name}</div>
                <div className="text-sm text-gray-500">{uc.role}</div>
              </div>
              {uc.constructora.id === currentConstructora?.id && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

#### UsersList.tsx

```typescript
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types';
import { api } from '../services/api';

export const UsersList: React.FC = () => {
  const { hasPermission, currentConstructora } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'active',
    role: '',
    search: ''
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', { params: filters });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (userId: string, status: string) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, { status });
      fetchUsers();
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  if (!hasPermission('admin', 'read')) {
    return <div>No tienes permisos para ver esta página</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuarios</h1>
        {hasPermission('admin', 'create') && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Invitar Usuario
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="suspended">Suspendidos</option>
        </select>

        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Todos los roles</option>
          <option value="director">Director</option>
          <option value="engineer">Ingeniero</option>
          <option value="resident">Residente</option>
          {/* ... */}
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Usuario</th>
              <th className="px-6 py-3 text-left">Rol</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Último acceso</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatarUrl || '/default-avatar.png'}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-medium">{user.fullName}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' :
                    user.status === 'suspended' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Nunca'}
                </td>
                <td className="px-6 py-4">
                  {hasPermission('admin', 'update') && (
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:underline">Editar</button>
                      {user.status === 'active' && (
                        <button
                          onClick={() => handleChangeStatus(user.id, 'suspended')}
                          className="text-red-600 hover:underline"
                        >
                          Suspender
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
```

---

## 🧪 Tests

### Unit Tests

#### users.service.spec.ts

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserConstructora } from './entities/user-constructora.entity';
import { AccountStatus } from './enums/account-status.enum';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepo: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserConstructora),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCredentials', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 'uuid-123',
        email: 'test@empresa.com',
        passwordHash: await bcrypt.hash('password123', 10),
        status: AccountStatus.ACTIVE,
        failedLoginAttempts: 0
      };

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(mockUser as User);

      const result = await service.validateCredentials('test@empresa.com', 'password123');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@empresa.com');
    });

    it('should lock account after 5 failed attempts', async () => {
      const mockUser = {
        id: 'uuid-123',
        email: 'test@empresa.com',
        passwordHash: await bcrypt.hash('password123', 10),
        status: AccountStatus.ACTIVE,
        failedLoginAttempts: 4 // Ya tiene 4 intentos
      };

      jest.spyOn(usersRepo, 'findOne').mockResolvedValue(mockUser as User);
      jest.spyOn(usersRepo, 'save').mockResolvedValue(mockUser as User);

      const result = await service.validateCredentials('test@empresa.com', 'wrong-password');

      expect(result).toBeNull();
      expect(mockUser.status).toBe(AccountStatus.LOCKED);
      expect(mockUser.lockedUntil).toBeDefined();
    });
  });
});
```

---

## 🔗 Referencias

- **Requerimiento funcional:** [RF-ADM-001](../requerimientos/RF-ADM-001-usuarios-roles.md), [RF-ADM-002](../requerimientos/RF-ADM-002-permisos-granulares.md)
- **Historias de usuario:** [US-ADM-001](../historias-usuario/US-ADM-001-crear-usuarios.md), [US-ADM-002](../historias-usuario/US-ADM-002-asignar-roles-permisos.md)
- **Módulo:** [README.md](../README.md)

---

**Generado:** 2025-11-20
**Versión:** 1.0
**Autor:** Sistema de Documentación Técnica
**Estado:** ✅ Completo
